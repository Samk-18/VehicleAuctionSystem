import { useNavigate } from "react-router-dom";

const DashboardHeader = ({ title, backTo, backLabel = "Back to Dashboard" }) => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex justify-content-between align-items-center px-4 py-3 mb-4 shadow-sm"
      style={{ background: "linear-gradient(120deg, var(--navy) 0%, var(--navy-2) 100%)" }}
    >
      <div className="d-flex align-items-center gap-3">
        {backTo && (
          <button
            className="btn btn-sm rounded-pill px-3"
            style={{ border: "1.5px solid var(--gold)", color: "var(--gold)", background: "transparent" }}
            onClick={() => navigate(backTo)}
          >
            <i className="bi bi-arrow-left me-1"></i> {backLabel}
          </button>
        )}
        <h5 className="fw-bold display-font mb-0" style={{ color: "#fff" }}>
          {title}
        </h5>
      </div>
    </div>
  );
};

export default DashboardHeader;
