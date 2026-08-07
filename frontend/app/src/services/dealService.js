import axiosInstance from "./axios";

export const getMyDealsAsBuyer = async () => {
  const res = await axiosInstance.get("/api/deals/mine");
  return res.data;
};

export const getMyDealsAsSeller = async () => {
  const res = await axiosInstance.get("/api/deals/seller");
  return res.data;
};

export const getDealById = async (dealId) => {
  const res = await axiosInstance.get(`/api/deals/${dealId}`);
  return res.data;
};

export const buyDirectSale = async (carId) => {
  const res = await axiosInstance.post(`/api/deals/direct-sale/${carId}`);
  return res.data;
};

export const confirmDeal = async (dealId) => {
  const res = await axiosInstance.post(`/api/deals/${dealId}/confirm`);
  return res.data;
};

export const declineDeal = async (dealId) => {
  const res = await axiosInstance.post(`/api/deals/${dealId}/decline`);
  return res.data;
};