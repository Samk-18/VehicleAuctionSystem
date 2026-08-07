import React from "react";
import { useNavigate } from "react-router-dom";

const CarDetailsModal = ({ car, onClose }) => {
  const navigate = useNavigate();

  // UI-only username (safe default)
  const username = localStorage.getItem("username") || "User";

  if (!car) return null;

  return (
    <div className="car-modal-backdrop" onClick={onClose}>
      <div className="car-modal-box" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="modal-header-custom">
          <div>
            <button
              className="btn btn-outline-secondary btn-sm rounded-pill mb-2"
              onClick={() => navigate("/seller/dashboard")}
            >
              <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
            </button>
            <h4 className="fw-bold mb-0">Vehicle Details</h4>
          </div>

          <div className="d-flex align-items-center gap-2">
            <div className="avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="text-end small">
              <div className="fw-bold">{username}</div>
              <div className="text-muted">Logged in</div>
            </div>
          </div>
        </div>

        {/* 🔴 CLOSE BUTTON */}
        <button className="close-btn" onClick={onClose}>✕</button>

        {/* IMAGE */}
        {car.images?.length > 0 ? (
          <img
            src={`http://localhost:8080${car.images[0].imageUrl}`}
            alt={car.brand}
            className="img-fluid rounded mb-3"
            style={{ height: "320px", objectFit: "contain", width: "100%", backgroundColor: "#f5f5f5" }}
          />
        ) : (
          <div className="bg-light text-center py-5 rounded mb-3">
            No Image Available
          </div>
        )}

        {/* TITLE */}
        <h3 className="fw-bold mb-1">
          {car.brand} {car.model}
        </h3>
        <div className="text-muted small mb-2">
          {car.manufactureYear} • {car.fuelType} • {car.transmission}
        </div>

        <h2 className="text-primary mb-4">
          ₹{car.price?.toLocaleString()}
        </h2>

        {/* CAR DETAILS */}
        <div className="row g-3 small">
          <div className="col-4"><b>Manufacturer:</b> {car.manufacturer}</div>
          <div className="col-4"><b>Color:</b> {car.color}</div>
          <div className="col-4"><b>Engine CC:</b> {car.engineCc || "N/A"}</div>
          <div className="col-4"><b>Mileage:</b> {car.mileage || "N/A"}</div>
          <div className="col-4"><b>KM Driven:</b> {car.kmDriven}</div>
          <div className="col-4"><b>Fuel Type:</b> {car.fuelType}</div>
          <div className="col-4"><b>Transmission:</b> {car.transmission}</div>
          <div className="col-4"><b>Sale Type:</b> {car.saleType}</div>
          <div className="col-4"><b>Reg No:</b> {car.registrationNo}</div>
          <div className="col-4"><b>Status:</b> {car.status}</div>
        </div>

        {/* DESCRIPTION */}
        {car.description && (
          <div className="mt-4 bg-light p-3 rounded small">
            <b>Description</b>
            <div className="mt-1">{car.description}</div>
          </div>
        )}

        {/* SELLER DETAILS */}
        <div className="mt-4 border-top pt-3">
          <h5 className="fw-bold">Seller Details</h5>
          <div className="small">
            <div><b>Name:</b> {car.sellerName}</div>
            {car.sellerEmail && <div><b>Email:</b> {car.sellerEmail}</div>}
            {car.sellerPhone && <div><b>Phone:</b> {car.sellerPhone}</div>}
          </div>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .car-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 5000;
        }

        .car-modal-box {
          background: white;
          width: 95%;
          max-width: 900px;
          min-height: 650px;
          border-radius: 20px;
          padding: 30px;
          position: relative;
          animation: zoomIn 0.25s ease forwards;
        }

        .modal-header-custom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #0d6efd;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        /* 🔴 CLOSE BUTTON */
        .close-btn {
          position: absolute;
          top: -18px;
          right: -18px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #dc3545;
          color: white;
          font-size: 20px;
          font-weight: bold;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: 0.2s;
        }

        .close-btn:hover {
          transform: scale(1.1);
          background: #bb2d3b;
        }

        @keyframes zoomIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CarDetailsModal;
