import axios from "axios";



// const API_URL = process.env.API_URL;
// "http://localhost:5000/api/users";
const API_URL =  "https://6861109e8e74864x08444cd19.mockapi.io/UI-Auth";

export const register = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/register`, { name, email, password });
  if (response.data?.data?.token) {
    localStorage.setItem("token", response.data.data.token);
  }
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data?.data?.token) {
    localStorage.setItem("token", response.data.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => localStorage.getItem("token");

