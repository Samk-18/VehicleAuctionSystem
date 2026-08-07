import axiosInstance from "./axios";

export const getMyCart = async () => {
  const res = await axiosInstance.get("/api/cart/my");
  return res.data;
};

export const removeFromCart = async (cartItemId) => {
  const res = await axiosInstance.delete(`/api/cart/remove/${cartItemId}`);
  return res.data;
};

export const addToCart = async (carId) => {
  const res = await axiosInstance.post(`/api/cart/add/${carId}`);
  return res.data;
};

