import { useState, useEffect, useCallback } from 'react';
import { 
  getAllUsers, 
  deleteUser as apiDeleteUser, 
  createUser as apiCreateUser, 
  updateUser as apiUpdateUser, 
  getDashboardStats 
} from '../../services/adminService';
import { ERRORS } from '../constants';


export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getAllUsers();
      const usersList = userData.users || [];
      setUsers(usersList);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      
      if (error.response?.status === 401) {
        setError(ERRORS.AUTH_REQUIRED);
      } else if (error.response?.status === 403) {
        setError(ERRORS.ACCESS_DENIED);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(error.message || ERRORS.FETCH_USERS_FAILED);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await apiDeleteUser(userId);
      await fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error(error.message || ERRORS.DELETE_USER_FAILED);
    }
  }, [fetchUsers]);

  const createUser = useCallback(async (userData) => {
    try {
      await apiCreateUser(userData);
      await fetchUsers();
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new Error(error.message || ERRORS.CREATE_USER_FAILED);
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (userId, userData) => {
    try {
      await apiUpdateUser(userId, userData);
      await fetchUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error(error.message || ERRORS.UPDATE_USER_FAILED);
    }
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    deleteUser,
    createUser,
    updateUser
  };
};


export const useDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await getDashboardStats();
      setStats(dashboardData);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setError(error.message || ERRORS.FETCH_DASHBOARD_FAILED);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stats,
    loading,
    error,
    fetchData
  };
};
