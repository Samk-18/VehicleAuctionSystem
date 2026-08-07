import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axios";
import { startPayment } from "../../util/startPayment";

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // UI-only username (safe default)
  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get("/api/subscriptions/plans");
      setPlans(response.data || []);
    } catch (err) {
      setError("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 BUY PLAN WITH RAZORPAY
  const buyPlan = (plan) => {
    startPayment({
      amount: plan.price,
      paymentFor: "SUBSCRIPTION",
      referenceId: plan.id,
      title: plan.planName + " Plan Purchase",
      onSuccess: () => navigate("/buyer/my-subscription"),
    });
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
        <div className="spinner-grow text-primary" />
        <p className="mt-3 fw-bold text-muted text-uppercase">
          Finding the best deals...
        </p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: "#f4f7fe" }}>

      {/* HEADER */}
      <div className="bg-white border-bottom shadow-sm sticky-top">
        <div className="container py-3 d-flex justify-content-between align-items-center">

          {/* LEFT */}
          <div>
            <button
              className="btn btn-outline-secondary btn-sm rounded-pill mb-2"
              onClick={() => navigate("/buyer/dashboard")}
            >
              <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
            </button>
            <h4 className="fw-bold mb-0">
              Subscription <span className="text-primary">Plans</span>
            </h4>
          </div>

          {/* RIGHT */}
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "38px", height: "38px" }}
            >
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="text-end small">
              <div className="fw-bold">{username}</div>
              <div className="text-muted">Premium Access</div>
            </div>
          </div>

        </div>
      </div>

      {/* HERO */}
      <div
        className="py-5 mb-5 text-white text-center"
        style={{
          background: "linear-gradient(135deg, #0d6efd, #6610f2)",
        }}
      >
        <h1 className="fw-bold">Upgrade Your Bidding Power 🚀</h1>
        <p className="opacity-75 mb-0">
          Choose a plan that fits your auction strategy
        </p>
      </div>

      {/* CONTENT */}
      <div className="container">

        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        <div className="row g-4 justify-content-center">
          {plans.map((plan) => {
            const isPremium = plan.price > 1000;

            return (
              <div key={plan.id} className="col-12 col-md-6 col-lg-4">
                <div className={`card h-100 shadow-lg border-0 plan-card ${isPremium ? "premium" : ""}`}>
                  <div className="card-body p-5 text-center">

                    {isPremium && (
                      <span className="badge bg-warning text-dark px-3 py-2 mb-3 rounded-pill">
                        MOST POPULAR
                      </span>
                    )}

                    <h3 className="fw-bold mt-2">{plan.planName}</h3>

                    <div className="my-4">
                      <span className="fs-1 fw-bold text-primary">
                        ₹{plan.price}
                      </span>
                    </div>

                    <hr />

                    <p>✅ {plan.totalBids} Total Bids</p>
                    <p>✅ {plan.bidsPerAuction} Bids per Auction</p>
                    <p>✅ Priority Notifications</p>

                    <button
                      className={`btn btn-lg w-100 mt-4 rounded-pill fw-bold ${
                        isPremium ? "btn-warning" : "btn-outline-primary"
                      }`}
                      onClick={() => buyPlan(plan)}
                    >
                      {isPremium ? "Activate Pro Plan" : "Activate Plan"}
                    </button>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .plan-card {
          border-radius: 24px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .plan-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        .plan-card.premium {
          border: 2px solid rgba(255,193,7,0.4);
        }
      `}</style>

    </div>
  );
};

export default SubscriptionPlans;
