import React, { useState } from "react";
import axios from "../../services/axios";
import { useNavigate } from "react-router-dom";

const AddCar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // UI-only username (safe default)
  const username = localStorage.getItem("username") || "User";

  const [car, setCar] = useState({
    registrationNo: "",
    brand: "",
    manufacturer: "",
    model: "",
    manufactureYear: "",
    fuelType: "",
    transmission: "",
    kmDriven: "",
    color: "",
    price: "",
    saleType: "DIRECT",
    engineCc: "",
    mileage: "",
    description: ""
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const submitCar = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (images.length < 5) {
      alert("Please upload at least 5 images of the vehicle (front, back, left, right, interior).");
      setLoading(false);
      return;
    }

    try {
      const carData = {
        ...car,
        manufactureYear: parseInt(car.manufactureYear),
        kmDriven: parseInt(car.kmDriven),
        price: parseFloat(car.price),
        engineCc: car.engineCc ? parseInt(car.engineCc) : null,
        mileage: car.mileage ? parseFloat(car.mileage) : null,
      };

      const formData = new FormData();
      formData.append("carData", JSON.stringify(carData));

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      await axios.post("/api/cars/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("🚗 Car added successfully!");
      navigate("/user/my-cars");
    } catch (err) {
      alert("❌ Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: "#f8f9fa" }}>

      {/* HEADER */}
      <div className="bg-white border-bottom py-3 mb-5 shadow-sm sticky-top">
        <div className="container d-flex justify-content-between align-items-center">

          <div>
            <button
              className="btn btn-outline-secondary btn-sm rounded-pill mb-2"
              onClick={() => navigate("/seller/dashboard")}
            >
              <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
            </button>

            <h3 className="fw-bold mb-0 text-dark">
              List Your <span className="text-primary">Vehicle</span>
            </h3>
          </div>

          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "38px", height: "38px" }}
            >
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="text-end">
              <div className="fw-bold text-dark">{username}</div>
              <div className="small text-muted">Seller Dashboard</div>
            </div>
          </div>

        </div>
      </div>

      {/* FORM */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg p-3 p-md-4" style={{ borderRadius: "20px" }}>
              <form onSubmit={submitCar}>

                {/* VEHICLE IDENTIFICATION */}
                <div className="mb-5">
                  <h5 className="fw-bold text-secondary mb-4 border-start border-primary border-4 ps-3">
                    Vehicle Identification
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Registration Number</label>
                      <input type="text" name="registrationNo" className="form-control custom-input" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Brand Name</label>
                      <input type="text" name="brand" className="form-control custom-input" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Manufacturer</label>
                      <input type="text" name="manufacturer" className="form-control custom-input" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Model</label>
                      <input type="text" name="model" className="form-control custom-input" onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                {/* TECHNICAL SPECIFICATIONS */}
                <div className="mb-5">
                  <h5 className="fw-bold text-secondary mb-4 border-start border-primary border-4 ps-3">
                    Technical Specifications
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Manufacture Year</label>
                      <input type="number" name="manufactureYear" className="form-control custom-input" onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Fuel Type</label>
                      <select name="fuelType" className="form-select custom-input" onChange={handleChange} required>
                        <option value="">Select Fuel</option>
                        <option value="PETROL">Petrol</option>
                        <option value="DIESEL">Diesel</option>
                        <option value="ELECTRIC">Electric</option>
                        <option value="HYBRID">Hybrid</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Transmission</label>
                      <select name="transmission" className="form-select custom-input" onChange={handleChange} required>
                        <option value="">Select Gearbox</option>
                        <option value="MANUAL">Manual</option>
                        <option value="AUTOMATIC">Automatic</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Engine Capacity (CC)</label>
                      <input type="number" name="engineCc" className="form-control custom-input" onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Mileage</label>
                      <input type="number" step="0.1" name="mileage" className="form-control custom-input" onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* CONDITION & PRICING */}
                <div className="mb-5">
                  <h5 className="fw-bold text-secondary mb-4 border-start border-primary border-4 ps-3">
                    Condition & Pricing
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Distance Driven (KM)</label>
                      <input type="number" name="kmDriven" className="form-control custom-input" onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Color</label>
                      <input type="text" name="color" className="form-control custom-input" onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Expected Price (₹)</label>
                      <input type="number" name="price" className="form-control custom-input fw-bold text-primary" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Listing Type</label>
                      <select name="saleType" className="form-select custom-input" onChange={handleChange}>
                        <option value="DIRECT">Direct Marketplace Sale</option>
                        <option value="AUCTION">Put for Auction</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Upload Images</label>
                      <input type="file" className="form-control custom-input" multiple onChange={handleImageChange} />
                      <small className={`d-block mt-1 ${images.length >= 5 ? "text-success" : "text-danger"}`}>
                        {images.length} / 5 images selected {images.length >= 5 ? "✓" : "(minimum 5 required)"}
                      </small>
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="mb-5">
                  <h5 className="fw-bold text-secondary mb-4 border-start border-primary border-4 ps-3">
                    Vehicle Description
                  </h5>
                  <textarea
                    name="description"
                    rows="4"
                    className="form-control custom-input"
                    placeholder="Add extra details about condition, features, modifications, etc."
                    onChange={handleChange}
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" disabled={loading} className="btn btn-primary btn-lg rounded-pill shadow fw-bold py-3">
                    {loading ? "Processing..." : <><i className="bi bi-cloud-arrow-up me-2"></i> Publish Vehicle</>}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .custom-input {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid #e0e0e0;
          background-color: #fcfcfc;
          transition: all 0.2s;
        }
        .custom-input:focus {
          border-color: #0d6efd;
          background-color: #fff;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
        }
        .form-label {
          color: #555;
        }
      `}</style>

    </div>
  );
};

export default AddCar;
