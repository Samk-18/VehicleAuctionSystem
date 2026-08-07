import axiosInstance from "./axios";

export const getMyOrders = async () => {
  const res = await axiosInstance.get("/api/orders/my", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};
