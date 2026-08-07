import { useEffect, useState } from "react";
import {
  getPendingVehicles,
  approveVehicle,
  rejectVehicle,
} from "../../services/adminVehicleService";
import { useNavigate } from "react-router-dom";

const ManageVehicles = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const username = "Admin"; // replace with dynamic value if needed

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const res = await getPendingVehicles();
      setCars(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch {
      setError("❌ Unable to load pending vehicles.");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this vehicle?")) return;

    try {
      setActionLoading(true);
      await approveVehicle(id);
      setMessage("✅ Vehicle approved successfully");
      loadCars();
    } catch {
      alert("Failed to approve vehicle");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this vehicle?")) return;

    try {
      setActionLoading(true);
      await rejectVehicle(id);
      setMessage("❌ Vehicle rejected");
      loadCars();
    } catch {
      alert("Failed to reject vehicle");
    } finally {
      setActionLoading(false);
    }
  };

  // Auto-clear message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-dark text-white rounded shadow-sm">
        <h4 className="mb-0">Pending Vehicle Approvals</h4>
        <span className="badge bg-light text-dark px-3 py-2">
          Username: <strong>{username}</strong>
        </span>
      </div>

      {/* Back Button */}
      <div className="mb-3">
        <button
          className="btn btn-primary fw-semibold"
          onClick={() => navigate("/admin-ui/dashboard")}
        >
          ← Back to Admin Dashboard
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="alert alert-info text-center fw-semibold">
          {message}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" />
          <p className="mt-2">Loading pending vehicles...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="alert alert-danger mt-3 text-center fw-semibold">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && cars.length === 0 && (
        <p className="text-muted mt-3 text-center fw-semibold">
          🎉 No pending vehicle approvals.
        </p>
      )}

      {/* Vehicle Cards */}
      {!loading && !error && cars.length > 0 && (
        <div className="row g-4">
          {cars.map((car) => (
            <div key={car.id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm rounded-4 h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold mb-2">
                    {car.brand} {car.model}
                  </h5>

                  <p className="mb-1">
                    <strong>Year:</strong> {car.manufactureYear}
                  </p>
                  <p className="mb-1">
                    <strong>Price:</strong> ₹{car.price?.toLocaleString()}
                  </p>
                  <p className="mb-3">
                    <strong>Status:</strong>{" "}
                    <span className="badge bg-warning text-dark">
                      {car.status}
                    </span>
                  </p>

                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm fw-semibold w-50"
                      disabled={actionLoading}
                      onClick={() => handleApprove(car.id)}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-danger btn-sm fw-semibold w-50"
                      disabled={actionLoading}
                      onClick={() => handleReject(car.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ManageVehicles;
