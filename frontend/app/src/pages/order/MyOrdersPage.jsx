import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyDealsAsBuyer } from "../../services/dealService";
import { getMyOrders } from "../../services/orderService";

const STATUS_META = {
  PENDING: { label: "Action Needed", color: "#d6a84b" },
  CONTACT_UNLOCKED: { label: "Balance Due", color: "#2e7d53" },
  COMPLETED: { label: "Purchase Complete", color: "#2e7d53" },
  FORFEITED: { label: "Forfeited", color: "#b3261e" },
  DECLINED_BY_SELLER: { label: "Declined", color: "#b3261e" },
  EXPIRED: { label: "Expired", color: "#b3261e" },
};

const DEAL_TYPE_LABEL = {
  AUCTION_WIN: "Auction Win",
  DIRECT_SALE: "Direct Purchase",
};

const ctaFor = (d) => {
  if (d.status === "PENDING") return "Pay Deposit";
  if (d.status === "CONTACT_UNLOCKED") {
    return d.balancePaid ? "View Details" : `Pay Remaining Balance ₹${d.remainingAmount?.toLocaleString()}`;
  }
  if (d.status === "COMPLETED") return "View Details";
  return null;
};

const MyOrdersPage = () => {
  const navigate = useNavigate();

  const [deals, setDeals] = useState([]);
  const [legacyOrders, setLegacyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const dealData = await getMyDealsAsBuyer();
      setDeals(Array.isArray(dealData) ? dealData : []);
    } catch (err) {
      console.error("Failed to fetch purchases", err);
      setError("Failed to load your purchases.");
    }

    // Legacy cart-based orders — shown only if any exist, so this stays
    // invisible for accounts that only ever used the deal flow.
    try {
      const orderData = await getMyOrders();
      setLegacyOrders(Array.isArray(orderData) ? orderData : []);
    } catch (err) {
      // Non-fatal — legacy order history is a bonus section, not core.
      console.warn("Legacy orders unavailable", err);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{ background: "var(--bg)" }}>
        <div className="spinner-border" style={{ color: "var(--navy)" }} />
        <p className="mt-2 text-muted">Loading your purchases...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 pb-5" style={{ background: "var(--bg)" }}>
      <div className="border-bottom shadow-sm sticky-top" style={{ background: "var(--navy)" }}>
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <div>
            <button
              className="btn btn-sm rounded-pill px-3 mb-2"
              style={{ border: "1.5px solid var(--gold)", color: "var(--gold)", background: "transparent" }}
              onClick={() => navigate("/buyer/dashboard")}
            >
              <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
            </button>
            <h4 className="fw-bold display-font mb-0" style={{ color: "#fff" }}>
              🧾 My <span style={{ color: "var(--gold)" }}>Purchases</span>
            </h4>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        {error && <div className="alert alert-danger">{error}</div>}

        {deals.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <h5>No purchases yet</h5>
            <p>Cars you buy directly or win at auction will show up here.</p>
          </div>
        ) : (
          deals.map((d) => {
            const meta = STATUS_META[d.status] || { label: d.status, color: "var(--navy)" };
            const cta = ctaFor(d);
            return (
              <div key={d.dealId} className="card mb-3 border-0 shadow-sm purchase-card" style={{ borderRadius: "16px" }}>
                <div className="card-body d-flex justify-content-between align-items-center p-4 flex-wrap gap-3">
                  <div>
                    <span
                      className="text-uppercase fw-semibold d-inline-block mb-1"
                      style={{ color: "var(--gold-dark)", fontSize: "0.72rem", letterSpacing: "0.08em" }}
                    >
                      {DEAL_TYPE_LABEL[d.dealType] || d.dealType}
                    </span>
                    <h5 className="fw-bold mb-1">{d.brand} {d.model}</h5>
                    <p className="mb-1 text-muted small">{d.registrationNo}</p>
                    <p className="mb-0 text-muted">
                      Price: <span className="fw-bold" style={{ color: "var(--gold-dark)" }}>₹{d.agreedPrice?.toLocaleString()}</span>
                      <span className="mx-2">·</span>
                      Deposit: <span className="fw-bold">₹{d.depositAmount?.toLocaleString()}</span>
                      {d.status === "CONTACT_UNLOCKED" && !d.balancePaid && (
                        <>
                          <span className="mx-2">·</span>
                          Remaining: <span className="fw-bold" style={{ color: "#b3261e" }}>₹{d.remainingAmount?.toLocaleString()}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="text-end">
                    <span
                      className="d-inline-block mb-2 px-3 py-1 fw-bold small"
                      style={{ background: `${meta.color}20`, color: meta.color, borderRadius: "999px" }}
                    >
                      {meta.label}
                    </span>
                    <div>
                      {cta && (
                        <button
                          className="btn rounded-pill fw-bold px-4"
                          style={{ background: "var(--navy)", color: "#fff" }}
                          onClick={() => navigate(`/user/payment/deal/${d.dealId}`)}
                        >
                          {cta}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {legacyOrders.length > 0 && (
          <div className="mt-5">
            <h6 className="text-muted mb-3">Earlier Cart Orders</h6>
            {legacyOrders.map((order) => (
              <div key={order.id} className="card mb-3 shadow-sm p-3">
                <h6>Order ID: {order.id}</h6>
                <p className="mb-1 small text-muted">{new Date(order.orderTime).toLocaleString()}</p>
                <p className="mb-1">Status: <strong>{order.status}</strong></p>
                <p className="mb-2">Total: ₹{order.totalAmount?.toLocaleString()}</p>
                {order.items?.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between small">
                    <div>{item.car.brand} {item.car.model}</div>
                    <div>₹{item.priceAtAddTime.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .purchase-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .purchase-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.12); }
      `}</style>
    </div>
  );
};

export default MyOrdersPage;
