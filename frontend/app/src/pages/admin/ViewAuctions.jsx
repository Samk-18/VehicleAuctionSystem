import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";

const ViewAuction = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);

  const username = "Admin"; // replace with dynamic value if needed

  useEffect(() => {
    loadAuction();
  }, []);

  const loadAuction = async () => {
    try {
      const res = await axiosInstance.get(`/api/auctions/${auctionId}`);
      setAuction(res.data);
    } catch {
      setAuction(null);
    } finally {
      setLoading(false);
    }
  };

  const remainingTime = (endTime) => {
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return "Auction Ended";
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    return hrs > 0 ? `${hrs}h ${mins % 60}m left` : `${mins}m left`;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!auction) {
    return <p className="text-center mt-5">Auction not found</p>;
  }

  return (
    <div className="container my-4">

      {/* TOP BAR */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-primary fw-semibold"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <span className="badge bg-dark px-3 py-2">
          Username: <strong>{username}</strong>
        </span>
      </div>

      {/* 🔥 HEADER */}
      <div
        className="p-4 rounded-4 mb-4 text-white shadow"
        style={{
          background: "linear-gradient(135deg, #ff512f, #dd2476)",
        }}
      >
        <h2 className="fw-bold">
          🚗 {auction.brand} {auction.model}
        </h2>
        <p className="mb-0 opacity-75">
          Live Vehicle Auction
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="row g-4">
        {/* IMAGE */}
        <div className="col-md-6">
          <div className="card shadow rounded-4 overflow-hidden">
            <img
              src={`http://localhost:8080${auction.imageUrl || "/placeholder.jpg"}`}
              alt="Car"
              style={{ height: "350px", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* AUCTION INFO */}
        <div className="col-md-6">
          <div
            className="p-4 rounded-4 h-100"
            style={{
              background: "rgba(255,255,255,0.95)",
              boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
            }}
          >
            <p className="text-muted mb-1">Current Bid</p>

            <h1 className="fw-bold text-success">
              ₹{auction.currentPrice?.toLocaleString()}
            </h1>

            <div className="d-flex gap-3 my-3">
              <span className="badge bg-warning text-dark px-3 py-2">
                ⏳ {remainingTime(auction.endTime)}
              </span>

              <span className="badge bg-success px-3 py-2">
                {auction.status}
              </span>
            </div>

            <button
              className="btn btn-danger w-100 fw-bold rounded-pill py-2 mt-3"
              style={{ letterSpacing: "1px" }}
            >
              BID NOW
            </button>

            <p className="text-muted text-center mt-2">
              Minimum increment applies
            </p>
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="card shadow rounded-4 mt-5 p-4">
        <h4 className="fw-bold mb-3">📄 Vehicle Details</h4>

        <div className="row">
          <div className="col-md-4">
            <p><b>Brand:</b> {auction.brand}</p>
            <p><b>Model:</b> {auction.model}</p>
            <p><b>Year:</b> {auction.manufactureYear}</p>
          </div>

          <div className="col-md-4">
            <p><b>Fuel:</b> {auction.fuelType}</p>
            <p><b>Transmission:</b> {auction.transmission}</p>
            <p><b>KMs Driven:</b> {auction.kmDriven}</p>
          </div>

          <div className="col-md-4">
            <p><b>Color:</b> {auction.color}</p>
            <p><b>Engine:</b> {auction.engineCc} cc</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ViewAuction;
