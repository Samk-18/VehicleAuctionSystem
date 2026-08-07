import api from "./axios";
export const getActiveAuctions = () => {
  return api.get("/api/auctions");
};

export const getUserAuctions = () => {
  return api.get("/api/auctions/my");
};

export const getMyWonAuctions = () => {
  return api.get("/api/auctions/my-wins");
};

export const getAuctionById = (auctionId) => {
  if (!auctionId) {
    throw new Error("auctionId is required");
  }
  return api.get(`/api/auctions/${auctionId}`);
};

export const startAuction = (carId) => {
  if (!carId) {
    throw new Error("carId is required to start auction");
  }
  return api.post(`/api/auctions/start/${carId}`);
};

export const getAllAuctionsForAdmin = () => {
  return api.get("/api/auctions/admin/all");
};
