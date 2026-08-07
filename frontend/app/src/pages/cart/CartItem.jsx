import React from "react";

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="card mb-3 shadow-sm border-0 rounded-4 overflow-hidden">
      <div className="row g-0 align-items-center">

        <div className="col-md-4">
          {item.images && item.images.length > 0 ? (
            <img
              src={`http://localhost:8080${item.images[0].imageUrl}`}
              alt={item.model}
              style={{ height: "180px", objectFit: "cover", width: "100%" }}
            />
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "180px", background: "rgba(18,33,58,0.04)" }}
            >
              <i className="bi bi-image text-muted fs-1"></i>
            </div>
          )}
        </div>

        <div className="col-md-6">
          <div className="card-body py-3">
            <h5 className="card-title mb-2 fw-bold display-font">
              {item.brand} {item.model}
              <span
                className="badge rounded-pill ms-2"
                style={{ background: "rgba(18,33,58,0.08)", color: "var(--navy)", fontSize: "0.65rem" }}
              >
                {item.status}
              </span>
            </h5>

            <div className="row small text-muted">
              <div className="col-6 mb-1">
                <strong>Registration:</strong> {item.registrationNo}
              </div>
              <div className="col-6 mb-1">
                <strong>Price:</strong>{" "}
                <span className="fw-semibold" style={{ color: "var(--gold-dark)" }}>
                  ₹{item.price.toLocaleString()}
                </span>
              </div>
              <div className="col-6 mb-1">
                <strong>Seller:</strong> {item.sellerName}
              </div>
              <div className="col-6 mb-1">
                <strong>Phone:</strong> {item.sellerPhone}
              </div>
              <div className="col-12">
                <strong>Email:</strong> {item.sellerEmail}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-2 d-flex justify-content-center align-items-center py-3">
          <button
            onClick={() => onRemove(item.cartItemId)}
            className="btn rounded-pill px-3"
            style={{ border: "1.5px solid var(--danger)", color: "var(--danger)", background: "transparent" }}
          >
            <i className="bi bi-trash-fill me-1"></i>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;