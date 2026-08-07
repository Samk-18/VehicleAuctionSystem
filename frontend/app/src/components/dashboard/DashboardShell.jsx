import { useNavigate, useLocation } from "react-router-dom";

const DashboardShell = ({ roleLabel, navItems, children, userName }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="dash-sidebar__brand" onClick={() => navigate("/")}>
          <svg viewBox="0 0 40 40" className="dash-sidebar__mark" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="19" fill="none" stroke="#D6A84B" strokeWidth="1.5" />
            <path d="M9 24 L13 15 Q15 11 20 11 Q25 11 27 15 L31 24 Z" fill="none" stroke="#D6A84B" strokeWidth="1.6" />
            <circle cx="14" cy="26" r="3" fill="#12213A" stroke="#D6A84B" strokeWidth="1.4" />
            <circle cx="26" cy="26" r="3" fill="#12213A" stroke="#D6A84B" strokeWidth="1.4" />
          </svg>
          <span>Auction<b>Mart</b></span>
        </div>

        <span className="dash-sidebar__role">{roleLabel} PORTAL</span>

        <nav className="dash-sidebar__nav">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <div
                key={item.path}
                className={`dash-nav-item ${active ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        <div className="dash-sidebar__footer">
          <div className="dash-user-chip">
            <div className="dash-user-avatar">{userName?.[0]?.toUpperCase() || "U"}</div>
            <div>
              <div className="dash-user-name">{userName || "User"}</div>
              <div className="dash-user-role">{roleLabel}</div>
            </div>
          </div>
          <button className="dash-logout-btn" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </div>
      </aside>

      <main className="dash-main">{children}</main>
    </div>
  );
};

export default DashboardShell;