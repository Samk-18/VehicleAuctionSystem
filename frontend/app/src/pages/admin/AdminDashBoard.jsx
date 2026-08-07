import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";
import DashboardShell from "../../components/dashboard/DashboardShell";

const navItems = [
  { label: "User Management", icon: "bi-people-fill", path: "/admin-ui/users" },
  { label: "Vehicle Inventory", icon: "bi-car-front-fill", path: "/admin-ui/vehicles" },
  { label: "Live Auctions", icon: "bi-broadcast", path: "/admin/auctions/live" },
  { label: "All Auctions", icon: "bi-list-check", path: "/admin/auctions" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";
  const [stats, setStats] = useState({ users: 0, vehicles: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      axiosInstance.get("/admin/users"),
      axiosInstance.get("/admin/vehicles/all"),
      axiosInstance.get("/admin/vehicles/pending"),
    ]).then(([usersRes, vehiclesRes, pendingRes]) => {
      setStats({
        users: usersRes.status === "fulfilled" ? usersRes.value.data.length : 0,
        vehicles: vehiclesRes.status === "fulfilled" ? vehiclesRes.value.data.length : 0,
        pending: pendingRes.status === "fulfilled" ? pendingRes.value.data.length : 0,
      });
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: "Registered Users", value: stats.users, icon: "bi-people-fill" },
    { label: "Total Vehicles", value: stats.vehicles, icon: "bi-car-front-fill" },
    { label: "Pending Approval", value: stats.pending, icon: "bi-hourglass-split" },
  ];

  const quickLinks = [
    { title: "User Management", text: "View and manage registered users.", icon: "bi-people-fill", path: "/admin-ui/users" },
    { title: "Vehicle Inventory", text: "Approve or reject vehicle listings.", icon: "bi-car-front-fill", path: "/admin-ui/vehicles" },
    { title: "Live Auctions", text: "Monitor ongoing auctions — extend or cancel as needed.", icon: "bi-broadcast", path: "/admin/auctions/live" },
    { title: "All Auctions", text: "View all auctions and attempt history.", icon: "bi-list-check", path: "/admin/auctions" },
  ];

  return (
    <DashboardShell roleLabel="ADMIN" navItems={navItems} userName={username}>
      <div className="mb-4">
        <span className="text-uppercase fw-semibold" style={{ color: "var(--gold-dark)", fontSize: "0.75rem", letterSpacing: "0.12em" }}>
          Admin Panel
        </span>
        <h2 className="fw-bold display-font mt-1" style={{ color: "var(--text)" }}>
          Platform Overview
        </h2>
        <p className="text-muted fs-6 mb-0">Oversight and moderation across AuctionMart.</p>
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
        {quickLinks.map((item) => (
          <div className="col-12 col-md-6 col-lg-4" key={item.path}>
            <div className="card h-100 border-0 admin-card" onClick={() => navigate(item.path)}>
              <div className="card-body p-4">
                <div className="icon-box mb-4">
                  <i className={`bi ${item.icon}`} style={{ fontSize: "1.4rem", color: "var(--navy)" }}></i>
                </div>
                <h5 className="fw-bold mb-2 display-font">{item.title}</h5>
                <p className="text-muted small mb-4">{item.text}</p>
                <div className="d-flex align-items-center fw-semibold small" style={{ color: "var(--gold-dark)" }}>
                  MANAGE <i className="bi bi-arrow-right ms-2"></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .admin-card { border-radius: 14px; cursor: pointer; transition: all 0.25s ease; box-shadow: 0 2px 6px rgba(18,33,58,0.06); }
        .admin-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(18,33,58,0.12); }
        .icon-box { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(214,168,75,0.12); }
      `}</style>
    </DashboardShell>
  );
};

export default AdminDashboard;