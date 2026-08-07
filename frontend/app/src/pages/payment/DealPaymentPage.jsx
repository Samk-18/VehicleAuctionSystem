import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDealById } from "../../services/dealService";
import { startPayment } from "../../util/startPayment";

const STATUS_META = {
  PENDING: { label: "Awaiting Deposit", color: "#d6a84b" },
  CONTACT_UNLOCKED: { label: "Balance Due", color: "#2e7d53" },
  COMPLETED: { label: "Purchase Complete", color: "#2e7d53" },
  FORFEITED: { label: "Forfeited", color: "#b3261e" },
  DECLINED_BY_SELLER: { label: "Declined by Seller", color: "#b3261e" },
  EXPIRED: { label: "Expired", color: "#b3261e" },
};

const formatDeadline = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DealPaymentPage = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  const fetchDeal = useCallback(async () => {
    try {
      const data = await getDealById(dealId);
      setDeal(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load this deal.");
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  useEffect(() => {
    fetchDeal();
  }, [fetchDeal]);

  const handlePayDeposit = () => {
    if (!deal) return;
    setPaying(true);
    startPayment({
      amount: deal.depositAmount,
      paymentFor: "DEPOSIT",
      referenceId: deal.dealId,
      title: `${deal.brand} ${deal.model} - Deposit`,
      onSuccess: () => {
        setPaying(false);
        fetchDeal();
      },
    });
    setTimeout(() => setPaying(false), 4000);
  };

  const handlePayBalance = () => {
    if (!deal) return;
    setPaying(true);
    startPayment({
      amount: deal.remainingAmount,
      paymentFor: "BALANCE",
      referenceId: deal.dealId,
      title: `${deal.brand} ${deal.model} - Remaining Balance`,
      onSuccess: () => {
        setPaying(false);
        fetchDeal();
      },
    });
    setTimeout(() => setPaying(false), 4000);
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ background: "var(--bg)" }}>
        <div className="spinner-grow" style={{ color: "var(--navy)" }} />
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center" style={{ background: "var(--bg)" }}>
        <h5 className="fw-bold mb-2">Couldn't load this deal</h5>
        <p className="text-muted">{error}</p>
        <button className="btn rounded-pill px-4" style={{ background: "var(--navy)", color: "#fff" }} onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const meta = STATUS_META[deal.status] || { label: deal.status, color: "var(--navy)" };
  const canPay = deal.status === "PENDING" && !deal.depositPaid;
  const canPayBalance = deal.status === "CONTACT_UNLOCKED" && !deal.balancePaid;
  const isWaitingOnSeller = deal.status === "PENDING" && deal.sellerConfirmation === "PENDING";

  return (
    <div className="min-vh-100 pb-5" style={{ background: "var(--bg)" }}>

      {/* HEADER */}
      <div className="border-bottom shadow-sm" style={{ background: "var(--navy)" }}>
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <button
            className="btn btn-sm rounded-pill px-3"
            style={{ border: "1.5px solid var(--gold)", color: "var(--gold)", background: "transparent" }}
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-1"></i> Back
          </button>
          <span className="fw-bold display-font fs-5" style={{ color: "#fff" }}>
            Auction<span style={{ color: "var(--gold)" }}>Mart</span>
            <span className="ms-2 fw-normal" style={{ fontSize: "0.8rem", color: "#c7cedb" }}>— Secure Deposit</span>
          </span>
        </div>
      </div>

      <div className="container py-5 d-flex justify-content-center">
        <div className="card border-0 shadow-lg w-100" style={{ maxWidth: "560px", borderRadius: "18px" }}>
          <div className="card-body p-4 p-md-5">

            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <span className="text-uppercase fw-semibold" style={{ color: "var(--gold-dark)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                  {deal.dealType === "AUCTION_WIN" ? "Auction Win" : "Direct Purchase"}
                </span>
                <h4 className="fw-bold display-font mt-1 mb-0">{deal.brand} {deal.model}</h4>
                <p className="text-muted small mb-0">{deal.registrationNo}</p>
              </div>
              <span
                className="px-3 py-2 fw-bold small"
                style={{ background: `${meta.color}20`, color: meta.color, borderRadius: "999px" }}
              >
                {meta.label}
              </span>
            </div>

            <div className="p-3 mb-4" style={{ background: "var(--bg)", borderRadius: "12px" }}>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Agreed Price</span>
                <span className="fw-semibold">₹{deal.agreedPrice?.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Deposit Amount</span>
                <span className="fw-bold" style={{ color: "var(--gold-dark)" }}>₹{deal.depositAmount?.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Deposit Deadline</span>
                <span className="small">{formatDeadline(deal.depositDeadline)}</span>
              </div>
              {(deal.status === "CONTACT_UNLOCKED" || deal.status === "COMPLETED") && (
                <div className="d-flex justify-content-between">
                  <span className="text-muted small">Remaining Balance</span>
                  <span className="fw-bold" style={{ color: deal.balancePaid ? "#2e7d53" : "#b3261e" }}>
                    {deal.balancePaid ? "Paid" : `₹${deal.remainingAmount?.toLocaleString()}`}
                  </span>
                </div>
              )}
            </div>

            {(deal.status === "CONTACT_UNLOCKED" || deal.status === "COMPLETED") && (
              <div className="p-3 mb-4 text-center" style={{ background: "#2e7d5315", borderRadius: "12px", border: "1px solid #2e7d5340" }}>
                <i className="bi bi-unlock-fill fs-3 mb-2" style={{ color: "#2e7d53" }}></i>
                <h6 className="fw-bold mb-2">Seller Contact Unlocked</h6>
                <p className="mb-1"><i className="bi bi-telephone-fill me-2"></i>{deal.sellerContact}</p>
                <p className="mb-0"><i className="bi bi-envelope-fill me-2"></i>{deal.sellerEmail}</p>
                <p className="text-muted small mt-2 mb-0">Reach out to {deal.sellerName} to finish the deal in person.</p>
              </div>
            )}

            {deal.status === "COMPLETED" && (
              <div className="p-3 mb-4 text-center" style={{ background: "#2e7d5315", borderRadius: "12px", border: "1px solid #2e7d5340" }}>
                <i className="bi bi-check-circle-fill fs-3 mb-2" style={{ color: "#2e7d53" }}></i>
                <h6 className="fw-bold mb-0">Purchase Complete</h6>
                <p className="text-muted small mt-1 mb-0">
                  Full payment received{deal.balancePaidAt ? ` on ${formatDeadline(deal.balancePaidAt)}` : ""}. This car is yours.
                </p>
              </div>
            )}

            {isWaitingOnSeller && deal.status === "PENDING" && (
              <div className="p-3 mb-4 small text-center" style={{ background: "#d6a84b15", borderRadius: "12px", color: "var(--gold-dark)" }}>
                <i className="bi bi-hourglass-split me-2"></i>
                Waiting on {deal.sellerName} to confirm the sale (auto-confirms by {formatDeadline(deal.sellerConfirmDeadline)}).
                You can still pay your deposit now — it'll unlock automatically once they confirm.
              </div>
            )}

            {deal.status === "DECLINED_BY_SELLER" && (
              <div className="p-3 mb-4 small text-center" style={{ background: "#b3261e15", borderRadius: "12px", color: "#b3261e" }}>
                The seller declined this sale. {deal.depositPaid ? "Your deposit is being refunded automatically." : ""}
              </div>
            )}

            {deal.status === "FORFEITED" && (
              <div className="p-3 mb-4 small text-center" style={{ background: "#b3261e15", borderRadius: "12px", color: "#b3261e" }}>
                The deposit window closed before payment was made, so this reservation was released.
              </div>
            )}

            {canPay && (
              <button
                className="btn w-100 rounded-pill py-3 fw-bold"
                style={{ background: "var(--navy)", color: "#fff" }}
                disabled={paying}
                onClick={handlePayDeposit}
              >
                {paying ? "Opening Secure Checkout…" : `🔒 Pay Deposit ₹${deal.depositAmount?.toLocaleString()}`}
              </button>
            )}

            {canPayBalance && (
              <button
                className="btn w-100 rounded-pill py-3 fw-bold"
                style={{ background: "#2e7d53", color: "#fff" }}
                disabled={paying}
                onClick={handlePayBalance}
              >
                {paying ? "Opening Secure Checkout…" : `💳 Pay Remaining Balance ₹${deal.remainingAmount?.toLocaleString()}`}
              </button>
            )}

            {deal.depositPaid && deal.status === "PENDING" && (
              <div className="text-center text-muted small mt-2">
                <i className="bi bi-check-circle-fill me-1" style={{ color: "#2e7d53" }}></i>
                Deposit received — waiting on the seller.
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DealPaymentPage;