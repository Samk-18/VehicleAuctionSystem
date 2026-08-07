import axios from "../services/axios";

export const createOrder = async ({ amount, paymentFor, referenceId }) => {
  const res = await axios.post("/user/payment/create-order", null, {
    params: { amount, paymentFor, referenceId }
  });
  return res.data;
};

export const verifyPayment = async (data) => {
  return axios.post("/user/payment/razorpay/verify", data);
};

