import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const login = async (email, password) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/auth/login`,
    { email, password },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

export const sendOtp = async (email, purpose) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/auth/otp/send`,
    { email, purpose },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/auth/reset-password`,
    null,
    { params: { email, otp, newPassword } }
  );
  return response.data;
};

// kept for backward compatibility (old generic buyer-only register)
export const register = async (userData) => {
  return axios.post(`${API_BASE_URL}/api/auth/register`, userData);
};

export const registerBuyer = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/auth/register/buyer`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

export const registerSeller = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/auth/register/seller`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
