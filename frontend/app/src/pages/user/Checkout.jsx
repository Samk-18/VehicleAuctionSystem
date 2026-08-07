import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";

const Checkout = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "User";

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchAuction();
  }, [auctionId]);

  const fetchAuction = async () => {
    try {
      const res = await axiosInstance.get(`/api/auctions/${auctionId}`);
      setAuction(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load auction details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      await axiosInstance.post(`/api/auctions/pay/${auctionId}`);
      alert("✅ Payment Successful!");
      navigate("/user/my-orders");
    } catch (err) {
      console.error(err);
      alert(`❌ ${err.response?.data?.message || "Payment failed. Please try again."}`);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border" style={{ color: "var(--navy)" }} />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <p className="text-muted">Auction not found.</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: "var(--bg)" }}>

      {/* HEADER */}
      <div
        className="px-4 py-3 shadow-sm"
        style={{ background: "linear-gradient(120deg, var(--navy) 0%, var(--navy-2) 100%)" }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <button
            className="btn btn-sm rounded-pill px-3"
            style={{ border: "1.5px solid var(--gold)", color: "var(--gold)", background: "transparent" }}
            onClick={() => navigate("/buyer/dashboard")}
          >
            <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
          </button>
          <h5 className="fw-bold display-font mb-0" style={{ color: "#fff" }}>
            Secure Checkout
          </h5>
        </div>
      </div>

      {/* CHECKOUT CARD */}
      <div className="container d-flex justify-content-center py-5">
        <div className="card shadow-sm border-0 rounded-4 w-100" style={{ maxWidth: "560px" }}>
          <div className="card-body p-5">

            <h4 className="fw-bold mb-1 text-center display-font">
              {auction.brand} {auction.model}
            </h4>
            <p className="text-muted text-center mb-4">
              This is a demo payment screen. No real money will be deducted.
            </p>

            {/* PAYER / RECEIVER SUMMARY */}
            <div className="p-3 mb-4" style={{ background: "rgba(18,33,58,0.04)", borderRadius: "12px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                <div>
                  <div className="text-muted small text-uppercase" style={{ letterSpacing: "0.05em", fontSize: "0.7rem" }}>
                    Payer (You)
                  </div>
                  <div className="fw-bold" style={{ color: "var(--navy)" }}>{username}</div>
                </div>
                <i className="bi bi-person-circle" style={{ fontSize: "1.6rem", color: "var(--navy)" }}></i>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small text-uppercase" style={{ letterSpacing: "0.05em", fontSize: "0.7rem" }}>
                    Receiver (Seller)
                  </div>
                  <div className="fw-bold" style={{ color: "var(--gold-dark)" }}>
                    {auction.sellerName || "Unknown Seller"}
                  </div>
                </div>
                <i className="bi bi-shop" style={{ fontSize: "1.6rem", color: "var(--gold-dark)" }}></i>
              </div>
            </div>

            {/* AMOUNT */}
            <div className="text-center mb-4">
              <div className="text-muted small text-uppercase" style={{ letterSpacing: "0.05em", fontSize: "0.7rem" }}>
                Amount to Pay
              </div>
              <div className="display-font fw-bold" style={{ fontSize: "2rem", color: "var(--navy)" }}>
                ₹{(auction.finalPrice || auction.currentPrice)?.toLocaleString()}
              </div>
            </div>

            <button
              className="btn w-100 rounded-pill py-3 fw-bold"
              style={{ background: "var(--gold)", color: "var(--navy)", border: "none" }}
              disabled={paying}
              onClick={handlePayment}
            >
              {paying ? "Processing..." : `Pay ₹${(auction.finalPrice || auction.currentPrice)?.toLocaleString()}`}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;