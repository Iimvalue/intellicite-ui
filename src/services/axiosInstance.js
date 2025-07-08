// services/axiosInstance.js
import axios from "axios";
import { getValidToken, isTokenExpired } from "./tokenService";

// Create axios instance with base URL and timeout
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000",  // Base URL from environment variable
  timeout: 30000,  // 30 seconds timeout for requests
  headers: {
    "Content-Type": "application/json",  // Default headers for JSON requests
  },
});

// Request interceptor to add Authorization header if token is valid
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getValidToken();  // Retrieve token from localStorage or other source

    if (token) {
      if (isTokenExpired(token)) {
        // If token is expired, clear storage and redirect to login page
        localStorage.clear();
        if (typeof window !== "undefined") window.location.href = "/";
        return Promise.reject(new Error("Token expired"));
      }
      // Attach token to Authorization header for all requests
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;  // Return config to proceed with request
  },
  (error) => Promise.reject(error)  // Handle request error
);

// Response interceptor to handle 401 errors (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,  // Return successful response directly
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;  // Mark request as retried to avoid loops
      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          // Attempt to refresh access token using the refresh token
          const refreshResponse = await axios.post(
            `${axiosInstance.defaults.baseURL}/api/auth/refresh`,
            { refreshToken }
          );

          const { accessToken: newToken, refreshToken: newRefreshToken } =
            refreshResponse.data.data;

          // Save new tokens in localStorage
          localStorage.setItem("token", newToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Update Authorization header with new token and retry original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return axiosInstance(originalRequest);
        }
      } catch (err) {
        // If refresh fails, clear storage and redirect to login page
        localStorage.clear();
        if (typeof window !== "undefined") window.location.href = "/";
        return Promise.reject(err);
      }
    }

    // For other errors, reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;