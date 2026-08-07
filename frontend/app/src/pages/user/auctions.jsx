import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveAuctions } from "../../services/auctionService";
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

const statusStyle = {
  ACTIVE: { bg: "rgba(214,168,75,0.15)", color: "#B8862E", label: "Live" },
  COMPLETED: { bg: "rgba(102,112,133,0.1)", color: "#667085", label: "Ended" },
  CANCELLED: { bg: "rgba(192,57,43,0.1)", color: "#C0392B", label: "Cancelled" },
};

const Auctions = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Buyer";

  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ brand: "", fuelType: "", transmission: "", maxBudget: "" });
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const res = await getActiveAuctions();
      setAuctions(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error("AUCTION LOAD ERROR:", err);
      setError("Failed to load live auctions");
    } finally {
      setLoading(false);
    }
  };

  const remainingTime = (endTime) => {
    if (!endTime) return "N/A";
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return "Ended";
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    return hrs > 0 ? `${hrs}h ${mins % 60}m left` : `${mins}m left`;
  };

  const brands = [...new Set(auctions.map((a) => a.brand))];

  const filteredAuctions = auctions
    .filter((a) => !filters.brand || a.brand === filters.brand)
    .filter((a) => !filters.fuelType || a.fuelType === filters.fuelType)
    .filter((a) => !filters.transmission || a.transmission === filters.transmission)
    .filter((a) => !filters.maxBudget || a.currentPrice <= Number(filters.maxBudget))
    .sort((a, b) => {
      if (sortOrder === "low-high") return a.currentPrice - b.currentPrice;
      if (sortOrder === "high-low") return b.currentPrice - a.currentPrice;
      return 0;
    });

  return (
    <DashboardShell roleLabel="BUYER" navItems={navItems} userName={username}>
      <div
        className="p-4 mb-4 rounded-4 text-white shadow-sm"
        style={{ background: "linear-gradient(120deg, var(--navy) 0%, var(--navy-2) 100%)" }}
      >
        <span className="text-uppercase fw-semibold" style={{ color: "var(--gold)", fontSize: "0.72rem", letterSpacing: "0.14em" }}>
          Live Now
        </span>
        <h2 className="fw-bold display-font mt-1 mb-1">Bid before time runs out ⏳</h2>
        <p className="mb-0 opacity-75">Explore live vehicle auctions happening right now.</p>
      </div>

      <div className="card border-0 shadow-sm p-3 mb-4" style={{ borderRadius: "14px" }}>
        <div className="row g-2 align-items-center">
          <div className="col-6 col-md-2">
            <select className="form-select form-select-sm" value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })}>
              <option value="">All Brands</option>
              {brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <select className="form-select form-select-sm" value={filters.fuelType} onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}>
              <option value="">All Fuel Types</option>
              <option value="PETROL">Petrol</option>
              <option value="DIESEL">Diesel</option>
              <option value="ELECTRIC">Electric</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
          <div className="col-6 col-md-2">
            <select className="form-select form-select-sm" value={filters.transmission} onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}>
              <option value="">All Transmissions</option>
              <option value="MANUAL">Manual</option>
              <option value="AUTOMATIC">Automatic</option>
            </select>
          </div>
          <div className="col-6 col-md-2">
            <input type="number" className="form-control form-control-sm" placeholder="Max Budget ₹" value={filters.maxBudget} onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })} />
          </div>
          <div className="col-6 col-md-2">
            <select className="form-select form-select-sm" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="">Sort by Price</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
          <div className="col-6 col-md-2">
            <button
              className="btn btn-sm w-100"
              style={{ border: "1.5px solid var(--navy)", color: "var(--navy)" }}
              onClick={() => { setFilters({ brand: "", fuelType: "", transmission: "", maxBudget: "" }); setSortOrder(""); }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {loading && <div className="text-muted">Loading live auctions...</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {!loading && !error && filteredAuctions.length === 0 && (
        <div className="dash-stat-card text-center py-5">
          <i className="bi bi-hourglass-split mb-3" style={{ fontSize: "2rem", color: "var(--gold)" }}></i>
          <h5 className="display-font mb-1">No auctions available</h5>
          <p className="text-muted mb-0">Please check back later.</p>
        </div>
      )}

      {!loading && filteredAuctions.length > 0 && (
        <div className="row g-4">
          {filteredAuctions.map((auction) => {
            const s = statusStyle[auction.status] || statusStyle.ACTIVE;
            return (
              <div key={auction.auctionId} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 rounded-4 auction-card">
                  <ImageCarousel
                    images={(auction.imageUrls || []).map((u) => ({ imageUrl: u }))}
                    alt={`${auction.brand} ${auction.model}`}
                    height="180px"
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="fw-bold mb-2 display-font">{auction.brand} {auction.model}</h5>

                    <div className="mb-2">
                      <span className="text-muted small text-uppercase" style={{ letterSpacing: "0.06em", fontSize: "0.7rem" }}>
                        Current Bid
                      </span>
                      <div className="fs-4 fw-bold" style={{ color: "var(--navy)" }}>
                        ₹{auction.currentPrice?.toLocaleString()}
                      </div>
                    </div>

                    <div className="d-flex gap-2 mb-3">
                      <span className="badge rounded-pill px-3 py-2" style={{ background: "rgba(18,33,58,0.06)", color: "var(--navy)" }}>
                        ⏳ {remainingTime(auction.endTime)}
                      </span>
                      <span className="badge rounded-pill px-3 py-2" style={{ background: s.bg, color: s.color, fontWeight: 600 }}>
                        {s.label}
                      </span>
                    </div>

                    <button
                      className="btn mt-auto fw-semibold rounded-pill"
                      style={{ background: "var(--gold)", color: "var(--navy)", border: "none" }}
                      onClick={() => navigate(`/user/auction/${auction.auctionId}`)}
                    >
                      View Auction →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .auction-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .auction-card:hover { transform: translateY(-6px); box-shadow: 0 15px 30px rgba(18,33,58,0.12); }
      `}</style>
    </DashboardShell>
  );
};

export default Auctions;
