import axiosInstance from "./axios";

const BASE_URL = "/admin/vehicles";

export const getPendingVehicles = () => {
  return axiosInstance.get(`${BASE_URL}/pending`);
};

export const approveVehicle = (id) => {
  return axiosInstance.put(`${BASE_URL}/approve/${id}`);
};

export const rejectVehicle = (id) => {
  return axiosInstance.put(`${BASE_URL}/reject/${id}`);
};
