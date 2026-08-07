import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";
import DashboardShell from "../../components/dashboard/DashboardShell";

const navItems = [
  { label: "Live Auctions", icon: "bi-broadcast", path: "/user/auctions" },
  { label: "My Bids", icon: "bi-graph-down", path: "/user/bids" },
  { label: "Won Auctions", icon: "bi-trophy-fill", path: "/user/won-auctions" },
  { label: "Subscriptions", icon: "bi-gem", path: "/user/subscriptions" },
  { label: "My Plan", icon: "bi-person-badge", path: "/user/my-subscription" },
  { label: "Direct Sale", icon: "bi-cart3", path: "/user/car-for-sell" },
  { label: "My Orders", icon: "bi-receipt-cutoff", path: "/user/my-orders" },
];

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Buyer";
  const [stats, setStats] = useState({ bids: 0, won: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      axiosInstance.get("/api/bids/my-bids"),
      axiosInstance.get("/api/auctions/my-wins"),
      axiosInstance.get("/api/orders/mine"),
    ]).then(([bidsRes, wonRes, ordersRes]) => {
      setStats({
        bids: bidsRes.status === "fulfilled" ? bidsRes.value.data.length : 0,
        won: wonRes.status === "fulfilled" ? wonRes.value.data.length : 0,
        orders: ordersRes.status === "fulfilled" ? ordersRes.value.data.length : 0,
      });
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: "Active Bids", value: stats.bids, icon: "bi-graph-down" },
    { label: "Won Auctions", value: stats.won, icon: "bi-trophy-fill" },
    { label: "My Orders", value: stats.orders, icon: "bi-receipt-cutoff" },
  ];

  const menuItems = [
    { title: "Live Auctions", text: "Browse active auctions and place bids.", icon: "bi-broadcast", path: "/user/auctions" },
    { title: "My Bids", text: "Track vehicles you have bid on.", icon: "bi-graph-down", path: "/user/bids" },
    { title: "My Purchases", text: "View everything you've won or bought, and manage payment.", icon: "bi-trophy-fill", path: "/user/won-auctions" },
    { title: "Subscriptions", text: "Buy or upgrade your bidding plan.", icon: "bi-gem", path: "/user/subscriptions" },
    { title: "My Plan", text: "Check active plan and remaining bids.", icon: "bi-person-badge", path: "/user/my-subscription" },
    { title: "Direct Sale", text: "Explore vehicles for direct purchase.", icon: "bi-cart3", path: "/user/car-for-sell" },
    { title: "My Orders", text: "See vehicles you successfully purchased.", icon: "bi-receipt-cutoff", path: "/user/my-orders" },
  ];

  return (
    <DashboardShell roleLabel="BUYER" navItems={navItems} userName={username}>
      <div className="mb-4">
        <span className="text-uppercase fw-semibold" style={{ color: "var(--gold-dark)", fontSize: "0.75rem", letterSpacing: "0.12em" }}>
          Buyer Dashboard
        </span>
        <h2 className="fw-bold display-font mt-1" style={{ color: "var(--text)" }}>
          Welcome back, {username}
        </h2>
        <p className="text-muted fs-6 mb-0">Your personal auction command center.</p>
      </div>

      <div className="row g-3 mb-5">
        {statCards.map((s) => (
          <div className="col-6 col-lg-4" key={s.label}>
            <div className="dash-stat-card d-flex justify-content-between align-items-start">
              <div>
                <div className="dash-stat-card__num">{loading ? "—" : s.value}</div>
                <div className="dash-stat-card__label">{s.label}</div>
              </div>
              <i className={`bi ${s.icon}`} style={{ fontSize: "1.3rem", color: "var(--gold)" }}></i>
            </div>
          </div>
        ))}
      </div>

      <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "0.78rem", letterSpacing: "0.08em", color: "var(--muted)" }}>
        Quick Actions
      </h6>
      <div className="row g-4">
        {menuItems.map((item) => (
          <div className="col-12 col-md-6 col-lg-4" key={item.path}>
            <div className="card h-100 border-0 buyer-card" onClick={() => navigate(item.path)}>
              <div className="card-body p-4">
                <div className="icon-box mb-4">
                  <i className={`bi ${item.icon}`} style={{ fontSize: "1.4rem", color: "var(--navy)" }}></i>
                </div>
                <h5 className="fw-bold mb-2 display-font">{item.title}</h5>
                <p className="text-muted small mb-4">{item.text}</p>
                <div className="d-flex align-items-center fw-semibold small" style={{ color: "var(--gold-dark)" }}>
                  EXPLORE <i className="bi bi-arrow-right ms-2"></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .buyer-card { border-radius: 14px; cursor: pointer; transition: all 0.25s ease; box-shadow: 0 2px 6px rgba(18,33,58,0.06); }
        .buyer-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(18,33,58,0.12); }
        .icon-box { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(214,168,75,0.12); }
      `}</style>
    </DashboardShell>
  );
};

export default BuyerDashboard;
