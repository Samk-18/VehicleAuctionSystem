import { createOrder, verifyPayment } from "../services/paymentService";
export const startPayment = async ({
  amount,
  paymentFor,
  referenceId,
  title,
  onSuccess
}) => {
  // ✅ Wait until Razorpay exists
  if (!window.Razorpay) {
    alert("Razorpay SDK not loaded. Please refresh the page.");
    return;
  }

  try {
    const payment = await createOrder({ amount, paymentFor, referenceId });

    const options = {
      key: "rzp_test_TKO5DFMqpwMCPR",
      amount: payment.amount * 100, // in paise
      currency: "INR",
      name: "Vehicle Auction",
      description: title,
      order_id: payment.razorpayOrderId,
      handler: async function (response) {
        await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        alert("✅ Payment Successful!");
        if (onSuccess) onSuccess();
      },
      theme: { color: "#0d6efd" },
    };

    const rzp = new window.Razorpay(options); 
    rzp.open();

  } catch (err) {
    console.error(err);
    alert("Payment failed");
  }
};
