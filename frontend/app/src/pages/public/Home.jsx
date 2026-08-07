import { useNavigate } from "react-router-dom";
import heroCar from "../../assets/images/cars.webp"; // swap with your BMW-style hero image

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white px-4 shadow-sm">
        <span className="navbar-brand fw-bold text-success">AuctionMart</span>

        <div className="ms-auto">
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="btn btn-success"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <span className="badge bg-light text-success border mb-3">
                WELCOME TO AUCTIONMART
              </span>
              <h1 className="fw-bold">
                Anyone, Anywhere, Everywhere can <span className="text-success">sell vehicles.</span>
              </h1>
              <p className="text-muted mt-3">
                A secure and reliable platform that connects genuine buyers
                and sellers for a seamless vehicle trading experience.
              </p>

              <div className="mt-4 d-flex gap-3">
                <button
                  className="btn btn-outline-dark"
                  onClick={() => navigate("/login")}
                >
                  Login As Buyer
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => navigate("/login")}
                >
                  Login As Seller
                </button>
              </div>

              <div className="row mt-5">
                <div className="col-4">
                  <h6 className="mb-1">🛡️ Safe & Secure</h6>
                  <small className="text-muted">Your safety is our priority.</small>
                </div>
                <div className="col-4">
                  <h6 className="mb-1">👥 Verified Users</h6>
                  <small className="text-muted">Only genuine buyers and sellers.</small>
                </div>
                <div className="col-4">
                  <h6 className="mb-1">⚡ Instant Deals</h6>
                  <small className="text-muted">Real-time connections, faster transactions.</small>
                </div>
              </div>
            </div>

            <div className="col-md-6 text-center mt-4 mt-md-0">
              <img
                src={heroCar}
                alt="Vehicle"
                className="img-fluid rounded-4"
                style={{ maxHeight: "420px", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <span className="badge bg-white text-success border mb-2">OUR MISSION</span>
          <h2 className="fw-bold">Building the Future of Vehicle Trading</h2>
          <p className="text-muted mb-5">
            We're creating a transparent, efficient, and trust-driven
            ecosystem for vehicle buyers and sellers.
          </p>

          <div className="row">
            <div className="col-md-3 mb-3">
              <h6>🌐 Anytime, Anywhere</h6>
              <small className="text-muted">Buy or sell vehicles from anywhere in the world.</small>
            </div>
            <div className="col-md-3 mb-3">
              <h6>🔍 Smart Marketplace</h6>
              <small className="text-muted">Advanced search and powerful tools to find the perfect match.</small>
            </div>
            <div className="col-md-3 mb-3">
              <h6>🔒 Secure Transactions</h6>
              <small className="text-muted">End-to-end security for worry-free transactions.</small>
            </div>
            <div className="col-md-3 mb-3">
              <h6>🎧 24/7 Support</h6>
              <small className="text-muted">We're here to help you anytime, anywhere.</small>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-light text-center py-3">
        © 2026 AuctionMart | Pune, India
      </footer>
    </div>
  );
};
export default Home;