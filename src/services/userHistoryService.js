import axiosInstance from "./axiosInstance";

export const fetchUserHistory = async () => {
  const response = await axiosInstance.get("/api/user-history");
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch history");
  }
  return response.data.data; 
};