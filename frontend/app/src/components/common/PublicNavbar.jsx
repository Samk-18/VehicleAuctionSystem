import { useNavigate } from "react-router-dom";

const PublicNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav
      className="navbar navbar-expand-lg px-4"
      style={{ background: "var(--navy)" }}
    >
      <span
        className="navbar-brand fw-bold display-font"
        style={{ cursor: "pointer", color: "#fff" }}
        onClick={() => navigate("/")}
      >
        Auction<span style={{ color: "var(--gold)" }}>Mart</span>
      </span>

      <div className="ms-auto">
        <button
          className="btn btn-outline-light me-2"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button className="btn btn-warning" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </nav>
  );
};

export default PublicNavbar;