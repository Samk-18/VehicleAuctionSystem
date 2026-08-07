import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import { useNavigate } from "react-router-dom";
import CarDetailsModal from "./CarDetailsModal";
import DashboardHeader from "../../components/common/DashboardHeader";
import ImageCarousel from "../../components/common/ImageCarousel";
import { buyDirectSale } from "../../services/dealService";

const CarsForSale = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [filters, setFilters] = useState({ brand: "", fuelType: "", transmission: "", maxBudget: "" });
  const [sortOrder, setSortOrder] = useState("");

  const navigate = useNavigate();

  const fetchCars = async () => {
    try {
      const res = await axiosInstance.get("/api/cars");
      const cleanedCars = (Array.isArray(res.data) ? res.data : []).map(car => ({
        ...car,
        images: (car.images || []).map(img => ({
          id: img.id,
          imageUrl: img.imageUrl
        }))
      }));
      setCars(cleanedCars);
    } catch {
      alert("Failed to load cars");
    } finally {
      setLoading(false);
    }
  };

const [buyingId, setBuyingId] = useState(null);

  const handleBuyNow = async (carId) => {
    setBuyingId(carId);
    try {
      const deal = await buyDirectSale(carId);
      navigate(`/user/payment/deal/${deal.dealId}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Could not start purchase for this car.";
      setToast({ show: true, message: msg });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    } finally {
      setBuyingId(null);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const brands = [...new Set(cars.map(c => c.brand))];

  const filteredCars = cars
    .filter(c => !filters.brand || c.brand === filters.brand)
    .filter(c => !filters.fuelType || c.fuelType === filters.fuelType)
    .filter(c => !filters.transmission || c.transmission === filters.transmission)
    .filter(c => !filters.maxBudget || c.price <= Number(filters.maxBudget))
    .sort((a, b) => {
      if (sortOrder === "low-high") return a.price - b.price;
      if (sortOrder === "high-low") return b.price - a.price;
      return 0;
    });

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-grow" style={{ color: "var(--navy)" }} />
      </div>
    );
  }

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: "var(--bg)" }}>

      {/* NEW INTEGRATED DASHBOARD HEADER */}
      <DashboardHeader title="Direct Sale Marketplace" backTo="/buyer/dashboard" />

      {/* FILTER BAR */}
      <div className="container mt-4 mb-2">
        <div className="card border-0 shadow-sm p-3" style={{ borderRadius: "14px" }}>
          <div className="row g-2 align-items-center">
            <div className="col-6 col-md-2">
              <select className="form-select form-select-sm" value={filters.brand} onChange={e => setFilters({ ...filters, brand: e.target.value })}>
                <option value="">All Brands</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <select className="form-select form-select-sm" value={filters.fuelType} onChange={e => setFilters({ ...filters, fuelType: e.target.value })}>
                <option value="">All Fuel Types</option>
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <div className="col-6 col-md-2">
              <select className="form-select form-select-sm" value={filters.transmission} onChange={e => setFilters({ ...filters, transmission: e.target.value })}>
                <option value="">All Transmissions</option>
                <option value="MANUAL">Manual</option>
                <option value="AUTOMATIC">Automatic</option>
              </select>
            </div>
            <div className="col-6 col-md-2">
              <input type="number" className="form-control form-control-sm" placeholder="Max Budget ₹" value={filters.maxBudget} onChange={e => setFilters({ ...filters, maxBudget: e.target.value })} />
            </div>
            <div className="col-6 col-md-2">
              <select className="form-select form-select-sm" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                <option value="">Sort by Price</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
            <div className="col-6 col-md-2">
              <button
                className="btn btn-sm w-100"
                style={{ border: "1.5px solid var(--navy)", color: "var(--navy)" }}
                onClick={() => { setFilters({ brand: "", fuelType: "", transmission: "", maxBudget: "" }); setSortOrder(""); }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CARS GRID */}
      <div className="container mt-4">
        <div className="row g-4">
          {filteredCars.map(car => (
            <div key={car.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm car-card">

                {/* IMAGE */}
                <div className="position-relative">
                  <div onClick={(e) => e.stopPropagation()}>
                  <ImageCarousel images={car.images} alt={`${car.brand} ${car.model}`} height="220px" />
                </div>
                  <span
                    className="position-absolute top-0 end-0 m-3 px-3 py-2 shadow-sm fw-bold"
                    style={{
                      background: "var(--gold)",
                      color: "var(--navy)",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                    }}
                  >
                    FIXED PRICE
                  </span>
                </div>

                {/* INFO */}
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-1 display-font">
                    {car.brand} {car.model}
                  </h5>
                  <p className="text-muted small mb-2">
                    {car.manufactureYear} • {car.fuelType}
                  </p>

                  <h4 className="fw-bold mb-3" style={{ color: "var(--gold-dark)" }}>
                    ₹{car.price?.toLocaleString()}
                  </h4>

                  <div className="row g-2">
                    <div className="col-6">
                      <button
                        className="btn w-100 rounded-pill fw-bold"
                        style={{ border: "1.5px solid var(--navy)", color: "var(--navy)", background: "transparent" }}
                        onClick={() => setSelectedCar(car)}
                      >
                        Details
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        className="btn w-100 rounded-pill fw-bold"
                        style={{ background: "var(--success)", color: "#fff", border: "none" }}
                        disabled={buyingId === car.id}
                        onClick={() => handleBuyNow(car.id)}
                      >
                        {buyingId === car.id ? "…" : <><i className="bi bi-lightning-charge-fill me-1"></i> Buy Now</>}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CAR DETAILS MODAL */}
      {selectedCar && (
        <CarDetailsModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}

      {/* TOAST */}
      {toast.show && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
          <div className="toast show text-white border-0 shadow" style={{ background: "var(--navy)" }}>
            <div className="d-flex">
              <div className="toast-body">{toast.message}</div>
              <button
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToast({ show: false, message: "" })}
              />
            </div>
          </div>
        </div>
      )}

      {/* STYLES */}
      <style>{`
        .car-card {
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .car-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(18,33,58,0.12) !important;
        }
      `}</style>

    </div>
  );
};

export default CarsForSale;