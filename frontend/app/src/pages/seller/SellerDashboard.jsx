import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";
import DashboardShell from "../../components/dashboard/DashboardShell";

const navItems = [
  { label: "Sell Vehicle", icon: "bi-plus-circle", path: "/user/add-car" },
  { label: "My Garage", icon: "bi-truck", path: "/user/my-cars" },
  { label: "Auction Status", icon: "bi-broadcast", path: "/seller/auction-status" },
  { label: "Auction History", icon: "bi-clock-history", path: "/seller/auction-history" },
];

const SellerDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Seller";
  const [stats, setStats] = useState({ total: 0, pending: 0, available: 0, sold: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/api/cars/mine")
      .then((res) => {
        const cars = Array.isArray(res.data) ? res.data : [];
        setStats({
          total: cars.length,
          pending: cars.filter((c) => c.status === "PENDING_APPROVAL").length,
          available: cars.filter((c) => c.status === "AVAILABLE" || c.status === "UNDER_AUCTION").length,
          sold: cars.filter((c) => c.status === "SOLD").length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Vehicles", value: stats.total, icon: "bi-car-front-fill" },
    { label: "Pending Approval", value: stats.pending, icon: "bi-hourglass-split" },
    { label: "Live / Available", value: stats.available, icon: "bi-broadcast" },
    { label: "Sold", value: stats.sold, icon: "bi-cash-coin" },
  ];

  const quickLinks = [
    { title: "Sell a Vehicle", text: "Add your vehicle for auction or direct sale.", icon: "bi-plus-circle", path: "/user/add-car" },
    { title: "My Garage", text: "Manage listings and start an auction.", icon: "bi-truck", path: "/user/my-cars" },
    { title: "Auction Status", text: "See live bids, who's leading, and decisions waiting on you.", icon: "bi-broadcast", path: "/seller/auction-status" },
    { title: "Auction History", text: "Full record of past auctions, bids, and outcomes.", icon: "bi-clock-history", path: "/seller/auction-history" },
  ];

  return (
    <DashboardShell roleLabel="SELLER" navItems={navItems} userName={username}>
      <div className="mb-4">
        <span className="text-uppercase fw-semibold" style={{ color: "var(--gold-dark)", fontSize: "0.75rem", letterSpacing: "0.12em" }}>
          Seller Dashboard
        </span>
        <h2 className="fw-bold display-font mt-1" style={{ color: "var(--text)" }}>
          Welcome back, {username}
        </h2>
        <p className="text-muted fs-6 mb-0">Here's what's happening with your listings.</p>
      </div>

      <div className="row g-3 mb-5">
        {statCards.map((s) => (
          <div className="col-6 col-lg-3" key={s.label}>
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
        {quickLinks.map((item) => (
          <div className="col-12 col-md-6 col-lg-4" key={item.path}>
            <div className="card h-100 border-0 seller-card" onClick={() => navigate(item.path)}>
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
        .seller-card { border-radius: 14px; cursor: pointer; transition: all 0.25s ease; box-shadow: 0 2px 6px rgba(18,33,58,0.06); }
        .seller-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(18,33,58,0.12); }
        .icon-box { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(214,168,75,0.12); }
      `}</style>
    </DashboardShell>
  );
};

export default SellerDashboard;