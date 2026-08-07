import axiosInstance from "./axios"; 

const BASE_URL = "http://localhost:8080/api/bids";

export const getMyBids = () => {
  return axiosInstance.get("/api/bids/my-bids");
};

export const placeBid = (auctionId, bidAmount) => {
  return axiosInstance.post(
    `/api/bids/place/${auctionId}`,
    { bidAmount }
  );
};

