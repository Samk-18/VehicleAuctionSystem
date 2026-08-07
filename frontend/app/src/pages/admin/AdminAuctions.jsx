import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import { useNavigate } from "react-router-dom";

const AdminAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const username = "Admin"; // replace with dynamic value if available

  useEffect(() => {
    axiosInstance
      .get("/api/auctions/admin/all")
      .then((res) => setAuctions(res.data))
      .catch(() =>
        setError("You are not authorized or failed to load auctions")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-dark" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center fw-semibold">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-dark text-white rounded shadow-sm">
        <h4 className="mb-0">All Auctions (Admin)</h4>
        <span className="badge bg-light text-dark px-3 py-2">
          Username: <strong>{username}</strong>
        </span>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-success fw-semibold">
          + Add Auction
        </button>

        <button
          className="btn btn-primary fw-semibold"
          onClick={() => navigate("/admin-ui/dashboard")}
        >
          ← Back to Admin Dashboard
        </button>
      </div>

      {/* Table Section */}
      {auctions.length === 0 ? (
        <div className="alert alert-secondary text-center">
          No auctions found
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered shadow-sm align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th>ID</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Current / Final Price</th>
                <th>Winner</th>
                <th>Attempts</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {auctions.map((a) => (
                <tr key={a.auctionId}>
                  <td>{a.auctionId}</td>
                  <td>{a.auctionAttempts} / 3</td>
                  <td>
                    <strong>{a.brand}</strong> {a.model}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        a.status === "ACTIVE"
                          ? "bg-success"
                          : a.status === "COMPLETED"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td>
                    ₹{a.currentPrice?.toLocaleString()}
                  </td>
                  <td>
                    {a.winnerName ? (
                      <span className="text-success fw-bold">
                        {a.winnerName}
                      </span>
                    ) : (
                      "—"
                    )}
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

export default AdminAuctions;
