import axios from "axios";
// import Cookies from "js-cookie";



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




export const logout = () => {
//   Cookies.remove("token");
  localStorage.removeItem("token");
};

// export const getToken = () => Cookies.get("token");

