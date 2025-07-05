import axios from "axios";




// const API_URL = process.env.API_URL;

const API_URL = "http://localhost:3000"; 

export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/register`, {
      name,
      email,
      password,
    });
    if (!response.data.success) {
      throw new Error(response.data.message || "Registration failed");
    }
    if (response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
    }
     return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/login`, {
      email,
      password
    });
    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }
    if (response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
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
        const response = await axios.put(`${API_URL}/api/users/profile`, {
            name,
            email,
            profileImage
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
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
};

export const isAuthenticated = () => {
  const isAuth = localStorage.getItem("token");
  return !!isAuth;
};

