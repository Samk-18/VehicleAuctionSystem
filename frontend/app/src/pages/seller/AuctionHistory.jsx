import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import DashboardShell from "../../components/dashboard/DashboardShell";

const navItems = [
  { label: "Sell Vehicle", icon: "bi-plus-circle", path: "/user/add-car" },
  { label: "My Garage", icon: "bi-truck", path: "/user/my-cars" },
  { label: "Auction Status", icon: "bi-broadcast", path: "/seller/auction-status" },
  { label: "Auction History", icon: "bi-clock-history", path: "/seller/auction-history" },
];

const statusStyle = {
  SCHEDULED: { bg: "rgba(102,112,133,0.1)", color: "#667085", label: "Scheduled" },
  ACTIVE: { bg: "rgba(214,168,75,0.15)", color: "#B8862E", label: "Live" },
  COMPLETED: { bg: "rgba(46,125,83,0.12)", color: "#2E7D53", label: "Completed" },
  CANCELLED: { bg: "rgba(192,57,43,0.1)", color: "#C0392B", label: "Cancelled" },
};

const AuctionHistory = () => {
  const username = localStorage.getItem("username") || "Seller";
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/api/auctions/mine")
      .then((res) => setAuctions(res.data))
      .catch(() => setError("Could not load your auctions."))
      .finally(() => setLoading(false));
  }, []);

  const formatDateTime = (dt) =>
    new Date(dt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

  return (
    <DashboardShell roleLabel="SELLER" navItems={navItems} userName={username}>
      <div className="mb-4">
        <span className="text-uppercase fw-semibold" style={{ color: "var(--gold-dark)", fontSize: "0.75rem", letterSpacing: "0.12em" }}>
          Seller Dashboard
        </span>
        <h2 className="fw-bold display-font mt-1" style={{ color: "var(--text)" }}>
          Auction History
        </h2>
        <p className="text-muted fs-6 mb-0">A full record of every auction you've listed, bid activity, and final outcome.</p>
      </div>

      {loading && <div className="text-muted">Loading your auctions...</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {!loading && !error && auctions.length === 0 && (
        <div className="dash-stat-card text-center py-5">
          <i className="bi bi-clock-history mb-3" style={{ fontSize: "2rem", color: "var(--gold)" }}></i>
          <h5 className="display-font mb-1">No auctions yet</h5>
          <p className="text-muted mb-0">Start an auction from My Garage to see bid activity here.</p>
        </div>
      )}

      {!loading && auctions.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white rounded-3 overflow-hidden shadow-sm">
            <thead style={{ background: "var(--navy)" }}>
              <tr className="text-white">
                <th>Vehicle</th>
                <th>Status</th>
                <th>Bids</th>
                <th>Leader / Winner</th>
                <th>Price</th>
                <th>Timing</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {auctions.map((a) => {
                const s = statusStyle[a.status] || statusStyle.SCHEDULED;
                const isCompleted = a.status === "COMPLETED";
                const isActive = a.status === "ACTIVE";

                return (
                  <tr key={a.auctionId}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {a.imageUrls?.[0] && (
                          <img
                            src={`http://localhost:8080${a.imageUrls[0]}`}
                            alt=""
                            style={{ width: 44, height: 34, objectFit: "cover", borderRadius: 6 }}
                          />
                        )}
                        <div>
                          <div className="fw-semibold small">{a.brand} {a.model}</div>
                          <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                            Attempt {a.auctionAttempts}/3
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className="badge rounded-pill px-3 py-2"
                        style={{ background: s.bg, color: s.color, fontWeight: 600 }}
                      >
                        {s.label}
                      </span>
                    </td>
                    <td className="fw-semibold">{a.bidCount}</td>
                    <td>
                      {isCompleted ? (
                        a.winnerName ? (
                          <span>🏆 {a.winnerName}</span>
                        ) : (
                          <span className="text-muted">No bids — unsold</span>
                        )
                      ) : a.topBidderName ? (
                        <span>{a.topBidderName} <span className="text-muted small">(leading)</span></span>
                      ) : (
                        <span className="text-muted">No bids yet</span>
                      )}
                    </td>
                    <td className="fw-semibold">
                      ₹{(isCompleted ? a.finalPrice : a.currentPrice)?.toLocaleString() || "—"}
                    </td>
                    <td className="small text-muted">
                      {a.status === "SCHEDULED" && `Starts ${formatDateTime(a.endTime)}`}
                      {isActive && `Ends ${formatDateTime(a.endTime)}`}
                      {isCompleted && `Ended ${formatDateTime(a.endTime)}`}
                      {a.status === "CANCELLED" && "Cancelled by admin"}
                    </td>
                    <td>
                      {isCompleted && a.winnerName ? (
                        <span
                          className="badge rounded-pill px-3 py-2"
                          style={
                            a.paid
                              ? { background: "rgba(46,125,83,0.12)", color: "#2E7D53" }
                              : { background: "rgba(192,57,43,0.1)", color: "#C0392B" }
                          }
                        >
                          {a.paid ? "Paid" : "Awaiting Payment"}
                        </span>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
};

export default AuctionHistory;