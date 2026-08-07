import api from "./axios";

export const buySubscription = (planName) =>
  api.post(`/api/subscriptions/buy/${planName}`);

export const getMySubscription = () =>
  api.get("/api/subscriptions/me");
