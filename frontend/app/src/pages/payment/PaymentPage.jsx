import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCart } from "../../services/CartService";
import { createOrder, verifyPayment } from "../../services/paymentService";
import "bootstrap/dist/css/bootstrap.min.css";

const PaymentPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getMyCart();
      setCart(data);
    } catch (err) {
      alert("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      // 1️⃣ Create Razorpay order
      const payment = await createOrder(cart.totalAmount);

      console.log("ORDER RESPONSE =>", payment);

      const options = {
        key: "rzp_test_TKO5DFMqpwMCPR",

        // ✅ CORRECT: Razorpay expects `id`
        order_id: payment.id,

        name: "Vehicle Auction",
        description: "Checkout Payment",

        handler: async function (response) {
          console.log("VERIFY PAYLOAD =>", {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          // 2️⃣ Verify payment (camelCase → backend DTO)
          await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          alert("✅ Payment Successful!");
          navigate("/buyer/dashboard");
        },

        modal: {
          ondismiss: function () {
            alert("Payment cancelled");
          },
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!cart || cart.cars.length === 0) {
    return (
      <div className="text-center mt-5">
        <h3>Your cart is empty</h3>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row g-4">

        {/* LEFT */}
        <div className="col-lg-7">
          <div className="card shadow-sm p-4">
            <h4 className="mb-3">Billing Details</h4>
            <p className="text-muted small">
              Payment will be securely processed via Razorpay.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-lg-5">
          <div className="card shadow-lg p-4 border-primary">
            <h4 className="mb-3">Order Summary</h4>

            {cart.cars.map((item) => (
              <div key={item.id} className="d-flex justify-content-between mb-3">
                <div>
                  <strong>{item.brand} {item.model}</strong>
                  <div className="text-muted small">
                    {item.registrationNo}
                  </div>
                </div>
                <div>₹{item.price?.toLocaleString()}</div>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between fs-5 fw-bold">
              <span>Total</span>
              <span className="text-success">
                ₹{cart.totalAmount?.toLocaleString()}
              </span>
            </div>

            <button
              className="btn btn-primary w-100 mt-4 py-3 fw-bold"
              onClick={handlePayment}
            >
              🔒 Pay Securely
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;
