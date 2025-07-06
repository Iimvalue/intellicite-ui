import axiosInstance from "./axiosInstance";

// Registration service: Sends user data to backend to create a new account
export const register = async (name, email, password) => {
  try {
    // Make POST request to /register endpoint with user details
    const response = await axiosInstance.post("/api/users/register", {
      name,
      email,
      password,
    });

    // If registration was not successful, throw an error with the message from backend
    if (!response.data.success) {
      throw new Error(response.data.message || "Registration failed");
    }

    // Extract the token from the response data
    const { token } = response.data.data;

    // Store only the token in localStorage to manage authentication
    if (token) {
      localStorage.setItem("token", token);
    }

    // Return full response data for further handling if needed
    return response.data;
  } catch (error) {
    // Rethrow error to be handled by caller (UI or other layers)
    throw error;
  }
};

// Login service: Authenticates user with email and password
export const login = async (email, password) => {
  try {
    // POST login request with credentials
    const response = await axiosInstance.post("/api/users/login", {
      email,
      password,
    });

    // If login failed, throw error with message from backend
    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }

    // Extract the token from response
    const { token } = response.data.data;

    // Save token in localStorage for session persistence
    if (token) {
      localStorage.setItem("token", token);
    }

    // Return full response for further processing if needed
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch user profile: Get user details from backend when needed
// Note: We do NOT store user info in localStorage to avoid exposing sensitive info
export const getProfile = async () => {
  try {
    // Send GET request to profile endpoint (authenticated via token in axiosInstance)
    const response = await axiosInstance.get("/api/users/profile");

    // If fetching profile failed, throw error
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch profile");
    }

    // Return user profile data to be handled by the caller (e.g., store in React state)
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Update user profile: Sends updated info to backend
export const updateProfile = async (name, email, profileImage) => {
  try {
    // PUT request with updated profile data
    const response = await axiosInstance.put("/api/users/profile", {
      name,
      email,
      profileImage,
    });

    // Throw error if update failed
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update profile");
    }

    // Return updated profile data
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Logout function: Clears the authentication token from localStorage
export const logout = () => {
  localStorage.removeItem("token");
  // Since user data is NOT stored in localStorage, no need to clear it here
};

// Check authentication: Returns true if a token exists in localStorage
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
