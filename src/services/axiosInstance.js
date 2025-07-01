// services/axiosInstance.js
import axios from "axios";
import { getValidToken, isTokenExpired } from "./tokenService";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getValidToken();

    if (token) {
      if (isTokenExpired(token)) {
        localStorage.clear();
        if (typeof window !== "undefined") window.location.href = "/";
        return Promise.reject(new Error("Token expired"));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          const refreshResponse = await axios.post(
            `${axiosInstance.defaults.baseURL}/api/auth/refresh`,
            { refreshToken }
          );

          const { accessToken: newToken, refreshToken: newRefreshToken } =
            refreshResponse.data.data;

          localStorage.setItem("token", newToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return axiosInstance(originalRequest);
        }
      } catch (err) {
        localStorage.clear();
        if (typeof window !== "undefined") window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;