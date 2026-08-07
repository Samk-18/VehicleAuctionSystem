import axios from "../api/axiosConfig";

export const getAllUsers = () => {
  return axios.get("/admin/users");
};

export const makeAdmin = (userId) => {
  return axios.put(`/admin/users/${userId}/make-admin`);
};

export const blockUser = (userId) => {
  return axios.put(`/admin/users/${userId}/block`);
};

export const unblockUser = (userId) => {
  return axios.put(`/admin/users/${userId}/unblock`);
};

export const deleteUser = (userId) => {
  return axios.delete(`/admin/users/${userId}`);
};

export const updateUserRoles = (userId, roles) => {
  return axios.put(`/admin/users/${userId}/roles`, roles);
};