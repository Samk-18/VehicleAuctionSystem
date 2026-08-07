import { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const PendingCars = () => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  const username = "Admin"; // replace later if dynamic

  useEffect(() => {
    loadPendingCars();
  }, []);

  const loadPendingCars = async () => {
    const res = await axios.get("/admin/cars/pending");
    setCars(res.data);
  };

  const handleApprove = async (id) => {
    await axios.put(`/admin/cars/${id}/approve`);
    loadPendingCars();
  };

  const handleReject = async (id) => {
    await axios.put(`/admin/cars/${id}/reject`);
    loadPendingCars();
  };

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-dark text-white rounded shadow-sm">
        <h4 className="mb-0">Pending Car Approvals</h4>
        <span className="badge bg-light text-dark px-3 py-2">
          Username: <strong>{username}</strong>
        </span>
      </div>

      {/* Back Button */}
      <div className="mb-3">
        <button
          className="btn btn-primary fw-semibold"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Back to Admin Dashboard
        </button>
      </div>

      {/* Empty State */}
      {cars.length === 0 && (
        <div className="alert alert-secondary text-center fw-semibold">
          No pending approvals
        </div>
      )}

      {/* Cars List */}
      <div className="row g-4">
        {cars.map((car) => (
          <div key={car.carId} className="col-md-6 col-lg-4">
            <div className="card shadow-sm rounded-4 h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="fw-bold mb-2">
                  {car.brand} {car.model}
                </h5>

                <p className="mb-1">
                  <strong>Year:</strong> {car.manufactureYear}
                </p>
                <p className="mb-1">
                  <strong>Price:</strong> ₹{car.price}
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
                    onClick={() => handleApprove(car.carId)}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger btn-sm fw-semibold w-50"
                    onClick={() => handleReject(car.carId)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default PendingCars;
