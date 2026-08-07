import { useState } from "react";

const ScheduleAuctionModal = ({ car, onClose, onConfirm }) => {
  const [mode, setMode] = useState("now"); // "now" | "later"
  const [startDateTime, setStartDateTime] = useState("");
  const [duration, setDuration] = useState(10);
  const [error, setError] = useState("");

  // Minimum selectable time = 5 minutes from now, formatted for datetime-local input
  const minDateTime = new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16);

  const handleSubmit = () => {
    setError("");

    if (duration < 5 || duration > 360) {
      setError("Duration must be between 5 and 360 minutes (6 hours).");
      return;
    }

    if (mode === "later") {
      if (!startDateTime) {
        setError("Pick a start date and time.");
        return;
      }
      if (new Date(startDateTime) <= new Date()) {
        setError("Scheduled time must be in the future.");
        return;
      }
    }

    onConfirm({
      scheduledStartTime: mode === "later" ? startDateTime : "",
      durationMinutes: Number(duration),
    });
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(18,33,58,0.55)", zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 shadow-lg p-4"
        style={{ width: "420px", maxWidth: "90vw" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="display-font mb-1">Start Auction</h5>
        <p className="text-muted small mb-3">
          {car.brand} {car.model} — {car.registrationNo}
        </p>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <div className="d-flex gap-2 mb-3">
          <button
            type="button"
            className={`btn flex-fill rounded-pill ${mode === "now" ? "btn-primary" : "btn-outline-secondary"}`}
            style={mode === "now" ? { background: "var(--navy)", borderColor: "var(--navy)" } : {}}
            onClick={() => setMode("now")}
          >
            Start Now
          </button>
          <button
            type="button"
            className={`btn flex-fill rounded-pill ${mode === "later" ? "btn-primary" : "btn-outline-secondary"}`}
            style={mode === "later" ? { background: "var(--navy)", borderColor: "var(--navy)" } : {}}
            onClick={() => setMode("later")}
          >
            Schedule for Later
          </button>
        </div>

        {mode === "later" && (
          <div className="mb-3">
            <label className="form-label small fw-semibold">Start date &amp; time</label>
            <input
              type="datetime-local"
              className="form-control"
              min={minDateTime}
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
            />
          </div>
        )}

        <div className="mb-4">
          <label className="form-label small fw-semibold">Duration (minutes)</label>
          <input
            type="number"
            className="form-control"
            min={5}
            max={360}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <small className="text-muted">Between 5 minutes and 6 hours (360 min)</small>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary flex-fill" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn flex-fill fw-semibold"
            style={{ background: "var(--gold)", color: "var(--navy)", border: "none" }}
            onClick={handleSubmit}
          >
            {mode === "now" ? "Start Auction" : "Schedule Auction"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAuctionModal;
