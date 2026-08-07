import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyDealsAsBuyer } from "../../services/dealService";
import DashboardShell from "../../components/dashboard/DashboardShell";

const navItems = [
  { label: "Live Auctions", icon: "bi-hammer", path: "/user/auctions" },
  { label: "My Bids", icon: "bi-graph-down", path: "/user/bids" },
  { label: "Won Auctions", icon: "bi-trophy-fill", path: "/user/won-auctions" },
  { label: "Subscriptions", icon: "bi-gem", path: "/user/subscriptions" },
  { label: "My Plan", icon: "bi-person-badge", path: "/user/my-subscription" },
  { label: "Direct Sale", icon: "bi-cart3", path: "/user/car-for-sell" },
  { label: "My Orders", icon: "bi-receipt-cutoff", path: "/user/my-orders" },
];

const STATUS_META = {
  PENDING: { label: "Action Needed", color: "#d6a84b" },
  CONTACT_UNLOCKED: { label: "Contact Unlocked", color: "#2e7d53" },
  FORFEITED: { label: "Forfeited", color: "#b3261e" },
  DECLINED_BY_SELLER: { label: "Declined", color: "#b3261e" },
  EXPIRED: { label: "Expired", color: "#b3261e" },
};

const TYPE_META = {
  AUCTION_WIN: { label: "🏆 Auction Win", color: "var(--gold-dark)" },
  DIRECT_SALE: { label: "🛒 Direct Purchase", color: "var(--navy)" },
};

const WonAuctions = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const data = await getMyDealsAsBuyer();
      setDeals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch deals", err);
      alert("Failed to load your purchases");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell roleLabel="BUYER" navItems={navItems} userName={username}>
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border" style={{ color: "var(--navy)" }} />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell roleLabel="BUYER" navItems={navItems} userName={username}>
      <div className="mb-4">
        <span className="text-uppercase fw-semibold" style={{ color: "var(--gold-dark)", fontSize: "0.75rem", letterSpacing: "0.12em" }}>
          Buyer Dashboard
        </span>
        <h2 className="fw-bold display-font mt-1 mb-0" style={{ color: "var(--text)" }}>
          My Purchases
        </h2>
        <p className="text-muted fs-6 mb-0">
          {deals.length} purchase{deals.length !== 1 ? "s" : ""} — auctions won and direct buys, together.
        </p>
      </div>

      {deals.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-bag-x fs-1 mb-3 d-block" style={{ opacity: 0.3 }}></i>
          <h5 className="display-font mb-1">No purchases yet</h5>
          <p className="mb-0">Win an auction or buy a vehicle directly — it'll show up here.</p>
        </div>
      ) : (
        deals.map((d) => {
          const statusMeta = STATUS_META[d.status] || { label: d.status, color: "var(--navy)" };
          const typeMeta = TYPE_META[d.dealType] || { label: d.dealType, color: "var(--navy)" };
          return (
            <div key={d.dealId} className="card mb-3 border-0 shadow-sm win-card" style={{ borderRadius: "16px" }}>
              <div className="card-body d-flex justify-content-between align-items-center p-4">
                <div>
                  <span
                    className="d-inline-block mb-2 px-2 py-1 fw-semibold"
                    style={{ background: `${typeMeta.color}15`, color: typeMeta.color, borderRadius: "999px", fontSize: "0.75rem" }}
                  >
                    {typeMeta.label}
                  </span>
                  <h5 className="fw-bold mb-1">{d.brand} {d.model}</h5>
                  <p className="mb-1 text-muted small">{d.registrationNo}</p>
                  <p className="mb-0 text-muted">
                    {d.dealType === "AUCTION_WIN" ? "Winning Bid" : "Agreed Price"}:{" "}
                    <span className="fw-bold" style={{ color: "var(--gold-dark)" }}>₹{d.agreedPrice?.toLocaleString()}</span>
                    <span className="mx-2">·</span>
                    Deposit: <span className="fw-bold">₹{d.depositAmount?.toLocaleString()}</span>
                  </p>
                </div>
                <div className="text-end">
                  <span
                    className="d-inline-block mb-2 px-3 py-1 fw-bold small"
                    style={{ background: `${statusMeta.color}20`, color: statusMeta.color, borderRadius: "999px" }}
                  >
                    {statusMeta.label}
                  </span>
                  <div>
                    {(d.status === "PENDING" || d.status === "CONTACT_UNLOCKED") && (
                      <button
                        className="btn rounded-pill fw-bold px-4"
                        style={{ background: "var(--navy)", color: "#fff" }}
                        onClick={() => navigate(`/user/payment/deal/${d.dealId}`)}
                      >
                        {d.status === "CONTACT_UNLOCKED" ? "View Seller Contact" : "Pay Deposit"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      <style>{`
        .win-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .win-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.12); }
      `}</style>
    </DashboardShell>
  );
};

export default WonAuctions;