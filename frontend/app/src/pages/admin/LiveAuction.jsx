import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";

const LiveAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const navigate = useNavigate();

  const loadAuctions = () => {
    axiosInstance
      .get("/api/auctions/admin/live")
      .then((res) => setAuctions(res.data))
      .catch(() => setError("You are not authorized or failed to load auctions"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAuctions();
    const interval = setInterval(loadAuctions, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const remainingTime = (endTime) => {
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return "Ending...";
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    return hrs > 0 ? `${hrs}h ${mins % 60}m left` : `${mins}m left`;
  };

  const handleCancel = async (auctionId) => {
    if (!window.confirm("Cancel this auction? The car will return to Available.")) return;
    try {
      await axiosInstance.post(`/api/auctions/admin/cancel/${auctionId}`);
      setActionMsg("Auction cancelled.");
      loadAuctions();
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Failed to cancel auction.");
    }
  };

  const handleExtend = async (auctionId) => {
    const minutes = window.prompt("Extend by how many minutes? (1-120)", "10");
    if (!minutes) return;
    try {
      await axiosInstance.post(`/api/auctions/admin/extend/${auctionId}`, null, {
        params: { minutes: Number(minutes) },
      });
      setActionMsg(`Auction extended by ${minutes} minutes.`);
      loadAuctions();
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Failed to extend auction.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" style={{ color: "var(--navy)" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center fw-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div
        className="d-flex justify-content-between align-items-center mb-4 p-3 rounded shadow-sm text-white"
        style={{ background: "linear-gradient(120deg, var(--navy) 0%, var(--navy-2) 100%)" }}
      >
        <h4 className="mb-0 display-font">🔴 Live Auctions</h4>
        <button
          className="btn btn-sm rounded-pill px-4"
          style={{ border: "1.5px solid var(--gold)", color: "var(--gold)", background: "transparent" }}
          onClick={() => navigate("/admin-ui/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {actionMsg && (
        <div className="alert alert-info py-2 text-center">{actionMsg}</div>
      )}

      {auctions.length === 0 ? (
        <div className="alert alert-secondary text-center">No live auctions right now</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered shadow-sm align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th>ID</th>
                <th>Vehicle</th>
                <th>Current Price</th>
                <th>Time Left</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {auctions.map((a) => (
                <tr key={a.auctionId}>
                  <td>{a.auctionId}</td>
                  <td><strong>{a.brand}</strong> {a.model}</td>
                  <td>₹{a.currentPrice?.toLocaleString()}</td>
                  <td>
                    <span className="badge bg-warning text-dark px-2 py-2">
                      ⏳ {remainingTime(a.endTime)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleExtend(a.auctionId)}
                    >
                      Extend
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleCancel(a.auctionId)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LiveAuctions;