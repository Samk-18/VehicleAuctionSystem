import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";
import DashboardShell from "../../components/dashboard/DashboardShell";
import ImageCarousel from "../../components/common/ImageCarousel";

const navItems = [
  { label: "Live Auctions", icon: "bi-hammer", path: "/user/auctions" },
  { label: "My Bids", icon: "bi-graph-down", path: "/user/bids" },
  { label: "Won Auctions", icon: "bi-trophy-fill", path: "/user/won-auctions" },
  { label: "Subscriptions", icon: "bi-gem", path: "/user/subscriptions" },
  { label: "My Plan", icon: "bi-person-badge", path: "/user/my-subscription" },
  { label: "Direct Sale", icon: "bi-cart3", path: "/user/car-for-sell" },
  { label: "My Orders", icon: "bi-receipt-cutoff", path: "/user/my-orders" },
];

const ViewAuction = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Buyer";
  const loggedInUserId = Number(localStorage.getItem("userId"));

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAuction();
    fetchBidHistory();
    const interval = setInterval(fetchBidHistory, 10000);
    return () => clearInterval(interval);
  }, [auctionId]);

  const fetchAuction = async () => {
    try {
      const res = await axiosInstance.get(`/api/auctions/${auctionId}`);
      setAuction(res.data);
    } catch {
      setMessage("❌ Failed to load auction details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBidHistory = async () => {
    try {
      const res = await axiosInstance.get(`/api/bids/auction/${auctionId}`);
      setBids(Array.isArray(res.data) ? res.data : []);
    } catch {
      setBids([]);
    }
  };

  const remainingTime = (endTime) => {
    if (!endTime) return "N/A";
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return "Auction Ended";
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}m ${secs}s remaining`;
  };

  const formatBidTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const placeBid = async (customAmount = null) => {
    if (auction.status !== "ACTIVE") {
      setMessage("❌ This auction has already ended.");
      return;
    }

    const amountToBid = Number(customAmount || bidAmount);
    if (!amountToBid || amountToBid <= auction.currentPrice) {
      setMessage("❌ Bid must be higher than the current price.");
      return;
    }

    try {
      await axiosInstance.post(`/api/bids/place/${auctionId}`, { bidAmount: amountToBid });
      setMessage("✅ Bid placed successfully!");
      setBidAmount("");
      fetchAuction();
      fetchBidHistory();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      let backendMessage = "Bid failed. Please try again.";
      if (typeof err.response?.data === "string") backendMessage = err.response.data;
      else if (err.response?.data?.message) backendMessage = err.response.data.message;

      setMessage(`❌ ${backendMessage}`);
      if (backendMessage.toLowerCase().includes("subscription") || backendMessage.toLowerCase().includes("bids")) {
        setTimeout(() => navigate("/user/subscriptions"), 2000);
      }
    }
  };

  if (loading || !auction) {
    return (
      <DashboardShell roleLabel="BUYER" navItems={navItems} userName={username}>
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border" style={{ color: "var(--navy)" }} />
        </div>
      </DashboardShell>
    );
  }

  const quickBidValue = (auction.currentPrice || 0) + 2000;
  const isLive = auction.status === "ACTIVE";

  return (
    <DashboardShell roleLabel="BUYER" navItems={navItems} userName={username}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="text-uppercase fw-semibold" style={{ color: "var(--gold-dark)", fontSize: "0.75rem", letterSpacing: "0.12em" }}>
            Live Auction Room
          </span>
          <h2 className="fw-bold display-font mt-1 mb-0" style={{ color: "var(--text)" }}>
            {auction.brand} {auction.model}
          </h2>
        </div>
        <span
          className="badge rounded-pill px-3 py-2 fw-semibold"
          style={isLive ? { background: "rgba(214,168,75,0.15)", color: "#B8862E" } : { background: "rgba(102,112,133,0.1)", color: "#667085" }}
        >
          {isLive ? "● LIVE" : "ENDED"}
        </span>
      </div>

      {message && <div className="alert alert-info text-center py-2">{message}</div>}

      <div className="card shadow-sm rounded-4 mb-4 border-0">
        <div className="card-body">
          <div className="rounded-4 overflow-hidden mb-4">
            <ImageCarousel
              images={(auction.imageUrls || []).map((u) => ({ imageUrl: u }))}
              alt={`${auction.brand} ${auction.model}`}
              height="340px"
            />
          </div>

          <div className="text-center">
            <p className="text-muted mb-1">⏳ {remainingTime(auction.endTime)}</p>
            <h1 className="fw-bold display-font mb-4" style={{ color: "var(--navy)" }}>
              ₹{auction.currentPrice?.toLocaleString()}
            </h1>

            {auction.status === "COMPLETED" && auction.winnerName && (
              <div className="alert rounded-4" style={{ background: "rgba(46,125,83,0.1)", color: "#2E7D53" }}>
                🏆 <strong>{auction.winnerName}</strong> won this auction
                <br />
                Final Price: ₹{auction.finalPrice?.toLocaleString()}
              </div>
            )}

            {auction.status === "COMPLETED" && auction.winnerId === loggedInUserId && (
              <button
                className="btn btn-lg rounded-pill px-5 mt-3 fw-semibold"
                style={{ background: "var(--gold)", color: "var(--navy)", border: "none" }}
                onClick={() => navigate(`/user/payment/${auction.auctionId}`)}
              >
                Make Payment
              </button>
            )}

            {isLive && (
              <div className="mt-4 mx-auto" style={{ maxWidth: "460px" }}>
                <button
                  className="btn btn-lg w-100 mb-3 rounded-pill fw-bold"
                  style={{ border: "1.5px solid var(--gold)", color: "var(--gold-dark)", background: "transparent" }}
                  onClick={() => placeBid(quickBidValue)}
                >
                  Quick Bid ₹{quickBidValue.toLocaleString()}
                </button>

                <input
                  type="number"
                  className="form-control form-control-lg mb-3"
                  placeholder={`Min ₹${auction.currentPrice + 1}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />

                <button
                  className="btn btn-lg w-100 rounded-pill fw-bold text-white"
                  style={{ background: "var(--navy)", border: "none" }}
                  onClick={() => placeBid()}
                >
                  Place Bid
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card shadow-sm rounded-4 border-0 mb-4">
  <div className="card-body p-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h5 className="fw-bold display-font mb-0">Bid Activity</h5>
      <span className="badge rounded-pill px-3 py-2" style={{ background: "rgba(18,33,58,0.06)", color: "var(--navy)" }}>
        {bids.length} {bids.length === 1 ? "bid" : "bids"}
      </span>
    </div>

    {bids.length === 0 ? (
      <div className="text-center text-muted py-5">
        <i className="bi bi-hourglass-split fs-1 mb-3 d-block" style={{ opacity: 0.3 }}></i>
        Be the first to bid on this vehicle
      </div>
    ) : (
      <div className="d-flex flex-column gap-2">
        {bids.map((b, i) => {
          const isTop = i === 0;
          const isMine = b.bidderId === loggedInUserId;
          return (
            <div
              key={i}
              className="d-flex justify-content-between align-items-center p-3 rounded-4"
              style={{
                background: isTop ? "linear-gradient(90deg, rgba(214,168,75,0.16), rgba(214,168,75,0.04))" : "rgba(18,33,58,0.03)",
                border: isTop ? "1.5px solid var(--gold)" : "1px solid transparent",
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
                  style={{
                    width: "42px",
                    height: "42px",
                    background: isTop ? "var(--gold)" : "var(--navy)",
                    color: isTop ? "var(--navy)" : "#fff",
                    fontSize: "1rem",
                    flexShrink: 0,
                  }}
                >
                  {b.bidderName?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <div className="fw-bold d-flex align-items-center gap-2">
                    {b.bidderName}
                    {isTop && (
                      <span className="badge rounded-pill" style={{ background: "var(--gold)", color: "var(--navy)", fontSize: "0.65rem" }}>
                        <i className="bi bi-trophy-fill me-1"></i>LEADING
                      </span>
                    )}
                    {isMine && !isTop && (
                      <span className="badge rounded-pill" style={{ background: "rgba(18,33,58,0.1)", color: "var(--navy)", fontSize: "0.65rem" }}>
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-muted small">{formatBidTime(b.bidTime)}</div>
                </div>
              </div>
              <div className="fw-bold fs-5" style={{ color: isTop ? "var(--gold-dark)" : "var(--navy)" }}>
                ₹{b.bidAmount.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
</div>

      <div className="card shadow-sm rounded-4 mb-4 border-0">
  <div className="card-body">
    <h5 className="fw-bold display-font mb-3">Vehicle Details</h5>

    <div className="row g-3 mb-4">
      {[
        { label: "Manufacturer", value: auction.manufacturer },
        { label: "Year", value: auction.manufactureYear },
        { label: "Fuel Type", value: auction.fuelType },
        { label: "Transmission", value: auction.transmission },
        { label: "KM Driven", value: auction.kmDriven ? `${auction.kmDriven.toLocaleString()} km` : "—" },
        { label: "Mileage", value: auction.mileage ? `${auction.mileage} km/l` : "—" },
        { label: "Color", value: auction.color },
        { label: "Engine", value: auction.engineCc ? `${auction.engineCc} cc` : "—" },
        { label: "Registration No.", value: auction.registrationNo },
        { label: "Sale Type", value: auction.saleType },
      ].map((spec) => (
        <div className="col-6 col-md-3" key={spec.label}>
          <div className="text-muted small text-uppercase" style={{ fontSize: "0.68rem", letterSpacing: "0.06em" }}>
            {spec.label}
          </div>
          <div className="fw-semibold">{spec.value || "—"}</div>
        </div>
      ))}
    </div>

    {auction.description && (
      <div className="mb-3">
        <div className="text-muted small text-uppercase mb-1" style={{ fontSize: "0.68rem", letterSpacing: "0.06em" }}>
          Description
        </div>
        <p className="mb-0">{auction.description}</p>
      </div>
    )}

    {auction.sellerName && (
      <div className="border-top pt-3">
        <div className="text-muted small text-uppercase mb-1" style={{ fontSize: "0.68rem", letterSpacing: "0.06em" }}>
          Seller
        </div>
        <div className="fw-semibold">{auction.sellerName}</div>
      </div>
    )}
  </div>
</div>

    </DashboardShell>
  );
};

export default ViewAuction;