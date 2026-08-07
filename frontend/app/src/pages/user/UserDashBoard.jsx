import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    {
      title: "View Auctions",
      text: "Browse active auctions and place bids.",
      icon: "bi-gavel",
      path: "/user/auctions",
      color: "bg-primary",
    },
    {
      title: "My Bids",
      text: "Track vehicles you have bid on.",
      icon: "bi-graph-down",
      path: "/user/bids",
      color: "bg-info",
    },
    {
      title: "🏆 My Won Auctions",
      text: "View auctions you have won and make payment.",
      icon: "bi-trophy-fill",
      path: "/user/won-auctions",
      color: "bg-warning",
    },
    {
      title: "Sell Vehicle",
      text: "Add your vehicle for auction or sale.",
      icon: "bi-plus-circle",
      path: "/user/add-car",
      color: "bg-danger",
    },
    {
      title: "Subscriptions",
      text: "Buy or upgrade your bidding plan.",
      icon: "bi-gem",
      path: "/buyer/dashboard",
      color: "bg-success",
    },
    {
      title: "My Status",
      text: "Check active plan and remaining bids.",
      icon: "bi-person-badge",
      path: "/buyer/dashboard",
      color: "bg-success",
    },
    {
      title: "My Garage",
      text: "Manage vehicles you have listed.",
      icon: "bi-truck",
      path: "/user/my-cars",
      color: "bg-secondary",
    },
    {
      title: "Direct Sale",
      text: "Explore vehicles for direct purchase.",
      icon: "bi-cart3",
      path: "/user/car-for-sell",
      color: "bg-warning",
    },
    {
      title: "🧾 My Orders",
      text: "See vehicles you successfully purchased.",
      icon: "bi-receipt-cutoff",
      path: "/user/my-orders",
      color: "bg-success",
    },

  ];

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net" />

      {/* NAVBAR */}
      <nav className="navbar navbar-dark bg-dark px-4 py-3 shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">
            <i className="bi bi-speedometer2 text-warning me-2"></i>
            AUTO<span className="text-warning">AUCTION</span>
          </span>
          <button
            className="btn btn-outline-light btn-sm rounded-pill px-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container py-5">
        <div className="mb-5">
          <h2 className="fw-bold">Welcome back, 👋</h2>
          <p className="text-muted fs-5">
            Your personal auction command center.
          </p>
        </div>

        <div className="row g-4">
          {menuItems.map((item, index) => (
            <div className="col-12 col-md-6 col-lg-4" key={index}>
              <div
                className="card h-100 border-0 shadow-sm custom-card"
                onClick={() => navigate(item.path)}
              >
                <div className="card-body p-4">
                  <div
                    className={`icon-box ${item.color} text-white mb-4 shadow-sm`}
                  >
                    <i
                      className={`bi ${item.icon}`}
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  </div>
                  <h5 className="fw-bold mb-2">{item.title}</h5>
                  <p className="text-muted small mb-4">{item.text}</p>
                  <div className="d-flex align-items-center text-primary fw-semibold small">
                    EXPLORE <i className="bi bi-arrow-right ms-2"></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .custom-card {
          transition: all 0.3s ease;
          border-radius: 15px;
          cursor: pointer;
        }
        .custom-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        .icon-box {
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
