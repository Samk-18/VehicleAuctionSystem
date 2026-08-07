import { useNavigate, useLocation } from "react-router-dom";

const SidebarLayout = ({ navItems, roleLabel, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* SIDEBAR */}
      <aside
        className="d-none d-md-flex flex-column"
        style={{
          width: "240px",
          background: "var(--navy)",
          color: "#c7cedb",
          flexShrink: 0,
        }}
      >
        <div className="px-4 py-4">
          <span className="fw-bold display-font fs-5" style={{ color: "#fff" }}>
            Auction<span style={{ color: "var(--gold)" }}>Mart</span>
          </span>
        </div>

        <nav className="flex-grow-1 px-2">
          {navItems.map((item, i) => {
            const active = location.pathname === item.path;
            return (
              <div
                key={i}
                onClick={() => navigate(item.path)}
                className="d-flex align-items-center gap-3 px-3 py-2 mb-1 rounded-3"
                style={{
                  cursor: "pointer",
                  color: active ? "#fff" : "#c7cedb",
                  background: active ? "rgba(214,168,75,0.16)" : "transparent",
                  borderLeft: active ? "3px solid var(--gold)" : "3px solid transparent",
                  fontWeight: active ? 600 : 400,
                  fontSize: "0.92rem",
                  transition: "all 0.15s ease",
                }}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </div>
            );
          })}
        </nav>

        <div className="px-3 pb-4">
          <button
            className="btn w-100 rounded-pill py-2"
            style={{ border: "1.5px solid var(--gold)", color: "var(--gold)", background: "transparent" }}
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow-1">
        <div className="d-flex d-md-none justify-content-between align-items-center px-3 py-3" style={{ background: "var(--navy)" }}>
          <span className="fw-bold display-font" style={{ color: "#fff" }}>
            Auction<span style={{ color: "var(--gold)" }}>Mart</span>
          </span>
          <button className="btn btn-sm" style={{ color: "var(--gold)" }} onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
};

export default SidebarLayout;