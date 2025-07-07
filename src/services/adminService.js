import axiosInstance from './axiosInstance';
import { DEFAULT_STATS } from '../admin/constants';

const API_BASE = '/api/admin';

const handleApiResponse = (response, errorMessage) => {
  if (!response.data.success) {
    throw new Error(response.data.message || errorMessage);
  }
  return response.data.data;
};

export const getAllUsers = async () => {
  const response = await axiosInstance.get(`${API_BASE}/users`);
  return handleApiResponse(response, 'Failed to fetch users');
};

export const createUser = async (userData) => {
  const response = await axiosInstance.post(`${API_BASE}/users`, userData);
  return handleApiResponse(response, 'Failed to create user');
};

export const updateUser = async (userId, userData) => {
  const response = await axiosInstance.put(`${API_BASE}/users/${userId}`, userData);
  return handleApiResponse(response, 'Failed to update user');
};

export const deleteUser = async (userId) => {
  const response = await axiosInstance.delete(`${API_BASE}/users/${userId}`);
  return handleApiResponse(response, 'Failed to delete user');
};

export const getAllPapers = async () => {
  const response = await axiosInstance.get(`${API_BASE}/papers`);
  return handleApiResponse(response, 'Failed to fetch papers');
};

export const deletePaper = async (paperId) => {
  const response = await axiosInstance.delete(`${API_BASE}/papers/${paperId}`);
  return handleApiResponse(response, 'Failed to delete paper');
};

export const getAllPaperReports = async () => {
  const response = await axiosInstance.get(`${API_BASE}/paper-reports`);
  return handleApiResponse(response, 'Failed to fetch paper reports');
};

export const getDashboardStats = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE}/dashboard/stats`);
    return handleApiResponse(response, 'Failed to fetch dashboard stats');
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return DEFAULT_STATS;
  }
};

export const isAdmin = (user) => {
  return user && user.role === 'admin';
};
