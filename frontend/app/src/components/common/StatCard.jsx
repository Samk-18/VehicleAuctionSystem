const StatCard = ({ label, value, icon, accent = "var(--gold)" }) => (
  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "14px" }}>
    <div className="card-body d-flex align-items-center gap-3 py-3">
      <div
        className="d-flex align-items-center justify-content-center rounded-3"
        style={{ width: "44px", height: "44px", background: `${accent}20` }}
      >
        <i className={`bi ${icon}`} style={{ color: accent, fontSize: "1.2rem" }}></i>
      </div>
      <div>
        <div className="text-muted small">{label}</div>
        <div className="fw-bold fs-4" style={{ color: "var(--navy)" }}>{value}</div>
      </div>
    </div>
  </div>
);

export default StatCard;