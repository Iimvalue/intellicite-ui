import axiosInstance from "./axiosInstance";
import * as tokenService from "./tokenService";

export const register = async (name, email, password) => {
  try {
    const response = await axiosInstance.post("/api/users/register", {
      name,
      email,
      password,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Registration failed");
    }

    const { token } = response.data.data;
    if (token) {
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("authChange"));
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post("/api/users/login", {
      email,
      password,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }

    const { token } = response.data.data;
    if (token) {
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("authChange"));
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get("/api/users/profile");

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch profile");
    }

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (name, email, profileImage) => {
  try {
    const response = await axiosInstance.put("/api/users/profile", {
      name,
      email,
      profileImage,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update profile");
    }

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("homePageState"); 
  window.dispatchEvent(new Event("authChange"));
};

export const isAuthenticated = async () => {
  const token = tokenService.getValidToken();
  if (!token) return false;

  try {
    const response = await axiosInstance.get("/api/users/profile");
    return response.data.success === true;
  } catch {
    return false;
  }
};