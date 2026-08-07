import { useEffect, useState } from "react";
import { getMyBids } from "../../services/bidService";
import { useNavigate } from "react-router-dom";

const statusColor = {
  ACTIVE: "bg-success",
  COMPLETED: "bg-secondary",
  CANCELLED: "bg-danger",
};

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // UI-only username (safe default)
  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    loadBids();
  }, []);

  const loadBids = async () => {
    try {
      const res = await getMyBids();
      setBids(res.data || []);
    } catch (err) {
      console.error("Failed to load bids", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div className="spinner-border text-primary" />
        <p className="mt-3">Loading your bids...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f3f4f7" }}>

      {/* HEADER */}
      <div className="bg-white shadow-sm border-bottom sticky-top">
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
              📌 My <span className="text-primary">Bids</span>
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
              <div className="fw-bold text-dark">{username}</div>
              <div className="text-muted">Bidder</div>
            </div>
          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div className="container my-5">

        {/* EMPTY STATE */}
        {bids.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <h5>No bids placed yet</h5>
            <p>Start bidding on live auctions 🚀</p>
          </div>
        ) : (
          <div className="row g-4">
            {bids.map((bid, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 rounded-4 bid-card">
                  <div className="card-body">

                    <h5 className="fw-bold mb-2">
                      🚗 {bid.brand} {bid.model}
                    </h5>

                    <p className="mb-2">
                      <span className="text-muted small">Your Bid</span>
                      <br />
                      <span className="fs-4 fw-bold text-success">
                        ₹{bid.bidAmount?.toLocaleString()}
                      </span>
                    </p>

                    <p className="mb-3 text-muted small">
                      ⏰ {new Date(bid.bidTime).toLocaleString()}
                    </p>

                    <span
                      className={`badge ${
                        statusColor[bid.auctionStatus] || "bg-primary"
                      }`}
                    >
                      {bid.auctionStatus}
                    </span>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STYLES */}
      <style>{`
        .bid-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .bid-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.12);
        }
      `}</style>

    </div>
  );
};

export default MyBids;
