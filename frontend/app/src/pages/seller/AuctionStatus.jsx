import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../services/axios";
import DashboardShell from "../../components/dashboard/DashboardShell";
import { getMyDealsAsSeller, confirmDeal, declineDeal } from "../../services/dealService";

const navItems = [
  { label: "Sell Vehicle", icon: "bi-plus-circle", path: "/user/add-car" },
  { label: "My Garage", icon: "bi-truck", path: "/user/my-cars" },
  { label: "Auction Status", icon: "bi-broadcast", path: "/seller/auction-status" },
  { label: "Auction History", icon: "bi-clock-history", path: "/seller/auction-history" },
];

const formatCountdown = (target) => {
  const diff = new Date(target) - new Date();
  if (diff <= 0) return "Any moment now";
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  return hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`;
};

const formatDateTime = (dt) =>
  new Date(dt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

const AuctionStatus = () => {
  const username = localStorage.getItem("username") || "Seller";

  const [auctions, setAuctions] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingOn, setActingOn] = useState(null); // dealId currently being confirmed/declined
  const [, setTick] = useState(0); // forces countdown re-render

  const fetchAll = useCallback(async () => {
    try {
      const [auctionRes, dealData] = await Promise.all([
        axiosInstance.get("/api/auctions/mine"),
        getMyDealsAsSeller(),
      ]);
      setAuctions(Array.isArray(auctionRes.data) ? auctionRes.data : []);
      setDeals(Array.isArray(dealData) ? dealData : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Could not load live auction status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const dataPoll = setInterval(fetchAll, 15000); // refresh live data every 15s
    const clockTick = setInterval(() => setTick((t) => t + 1), 1000); // keep countdowns moving
    return () => {
      clearInterval(dataPoll);
      clearInterval(clockTick);
    };
  }, [fetchAll]);

  const handleConfirm = async (dealId) => {
    setActingOn(dealId);
    try {
      await confirmDeal(dealId);
      await fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Could not confirm this sale.");
    } finally {
      setActingOn(null);
    }
  };

  const handleDecline = async (dealId) => {
    if (!window.confirm("Decline this sale? The car will reopen for listing.")) return;
    setActingOn(dealId);
    try {
      await declineDeal(dealId);
      await fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Could not decline this sale.");
    } finally {
      setActingOn(null);
    }
  };

  const liveAuctions = auctions.filter((a) => a.status === "ACTIVE");
  const upcomingAuctions = auctions.filter((a) => a.status === "SCHEDULED");
  const auctionDeals = deals.filter((d) => d.dealType === "AUCTION_WIN");
  const awaitingDecision = auctionDeals.filter((d) => d.status === "PENDING");
  const recentlySold = auctionDeals.filter((d) => d.status === "CONTACT_UNLOCKED");

  return (
    <DashboardShell roleLabel="SELLER" navItems={navItems} userName={username}>
      <div className="mb-4">
        <span className="text-uppercase fw-semibold" style={{ color: "var(--gold-dark)", fontSize: "0.75rem", letterSpacing: "0.12em" }}>
          Seller Dashboard
        </span>
        <h2 className="fw-bold display-font mt-1" style={{ color: "var(--text)" }}>
          Auction Status
        </h2>
        <p className="text-muted fs-6 mb-0">What's live right now, and what needs your decision.</p>
      </div>

      {loading && <div className="text-muted">Loading live status...</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {!loading && (
        <>
          {/* ===== AWAITING YOUR DECISION ===== */}
          <SectionHeader icon="bi-hourglass-split" color="#B8862E" title="Awaiting Your Decision" />
          {awaitingDecision.length === 0 ? (
            <EmptyRow text="No auctions are waiting on a confirm/decline decision right now." />
          ) : (
            <div className="row g-3 mb-5">
              {awaitingDecision.map((d) => (
                <div className="col-12 col-lg-6" key={d.dealId}>
                  <div className="dash-stat-card h-100 p-4" style={{ borderLeft: "4px solid #B8862E" }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="fw-bold mb-0">{d.brand} {d.model}</h6>
                      <span className="badge rounded-pill px-3 py-2" style={{ background: "rgba(214,168,75,0.15)", color: "#B8862E" }}>
                        Auto-confirms in {formatCountdown(d.sellerConfirmDeadline)}
                      </span>
                    </div>
                    <p className="text-muted small mb-2">{d.registrationNo}</p>
                    <p className="mb-2">
                      Winner: <strong>{d.buyerName}</strong>
                      <span className="mx-2">·</span>
                      Winning Bid: <strong>₹{d.agreedPrice?.toLocaleString()}</strong>
                    </p>
                    <p className="mb-3 small">
                      Deposit:{" "}
                      {d.depositPaid ? (
                        <span className="fw-bold" style={{ color: "#2E7D53" }}>Paid ✓</span>
                      ) : (
                        <span className="text-muted">Not yet paid — buyer has until {formatDateTime(d.depositDeadline)}</span>
                      )}
                    </p>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm rounded-pill px-4 fw-bold"
                        style={{ background: "#2E7D53", color: "#fff" }}
                        disabled={actingOn === d.dealId}
                        onClick={() => handleConfirm(d.dealId)}
                      >
                        {actingOn === d.dealId ? "Working…" : "Confirm Sale"}
                      </button>
                      <button
                        className="btn btn-sm rounded-pill px-4 fw-bold"
                        style={{ background: "transparent", border: "1.5px solid #C0392B", color: "#C0392B" }}
                        disabled={actingOn === d.dealId}
                        onClick={() => handleDecline(d.dealId)}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== LIVE NOW ===== */}
          <SectionHeader icon="bi-broadcast" color="#B8862E" title="Live Now" pulse />
          {liveAuctions.length === 0 ? (
            <EmptyRow text="No auctions are live at the moment." />
          ) : (
            <div className="row g-3 mb-5">
              {liveAuctions.map((a) => (
                <div className="col-12 col-lg-6" key={a.auctionId}>
                  <div className="dash-stat-card h-100 p-4" style={{ borderLeft: "4px solid #2E7D53" }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="fw-bold mb-0">{a.brand} {a.model}</h6>
                      <span className="badge rounded-pill px-3 py-2" style={{ background: "rgba(46,125,83,0.12)", color: "#2E7D53" }}>
                        {formatCountdown(a.endTime)} left
                      </span>
                    </div>
                    <p className="text-muted small mb-2">{a.bidCount} bid{a.bidCount === 1 ? "" : "s"} so far</p>
                    <p className="mb-0">
                      {a.topBidderName ? (
                        <>
                          Leading: <strong>{a.topBidderName}</strong>
                          <span className="mx-2">·</span>
                          <strong style={{ color: "var(--gold-dark)" }}>₹{(a.topBidAmount ?? a.currentPrice)?.toLocaleString()}</strong>
                        </>
                      ) : (
                        <span className="text-muted">No bids yet — reserve price ₹{a.currentPrice?.toLocaleString()}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== STARTING SOON ===== */}
          <SectionHeader icon="bi-clock" color="#667085" title="Starting Soon" />
          {upcomingAuctions.length === 0 ? (
            <EmptyRow text="Nothing scheduled to start soon." />
          ) : (
            <div className="row g-3 mb-5">
              {upcomingAuctions.map((a) => (
                <div className="col-12 col-lg-6" key={a.auctionId}>
                  <div className="dash-stat-card h-100 p-4">
                    <h6 className="fw-bold mb-1">{a.brand} {a.model}</h6>
                    <p className="text-muted small mb-0">Starts {formatDateTime(a.endTime)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== RECENTLY SOLD — BALANCE PENDING ===== */}
          <SectionHeader icon="bi-check-circle" color="#2E7D53" title="Sold — Awaiting Final Payment" />
          {recentlySold.length === 0 ? (
            <EmptyRow text="Nothing sold and pending final payment right now." />
          ) : (
            <div className="row g-3">
              {recentlySold.map((d) => (
                <div className="col-12 col-lg-6" key={d.dealId}>
                  <div className="dash-stat-card h-100 p-4" style={{ borderLeft: "4px solid #2E7D53" }}>
                    <h6 className="fw-bold mb-1">{d.brand} {d.model}</h6>
                    <p className="mb-1 small">Buyer: <strong>{d.buyerName}</strong></p>
                    <p className="mb-0 small">
                      Remaining balance:{" "}
                      {d.balancePaid ? (
                        <span className="fw-bold" style={{ color: "#2E7D53" }}>Paid ✓</span>
                      ) : (
                        <span className="text-muted">₹{d.remainingAmount?.toLocaleString()} still due from buyer</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardShell>
  );
};

const SectionHeader = ({ icon, color, title, pulse }) => (
  <div className="d-flex align-items-center gap-2 mb-3">
    <i className={`bi ${icon}`} style={{ color, fontSize: "1.1rem", animation: pulse ? "pulse 1.6s infinite" : "none" }}></i>
    <h5 className="fw-bold mb-0" style={{ fontSize: "1.05rem" }}>{title}</h5>
    <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }`}</style>
  </div>
);

const EmptyRow = ({ text }) => (
  <div className="text-muted small mb-5" style={{ paddingLeft: "0.2rem" }}>{text}</div>
);

export default AuctionStatus;
