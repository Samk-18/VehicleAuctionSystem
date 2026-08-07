import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, resetPassword } from "../../services/authService";
import AuthLayout from "../../components/common/AuthLayout";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [otpMsg, setOtpMsg] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{7,}$/;

  const handleSendOtp = async () => {
    setErrorMsg("");
    setOtpMsg("");

    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      setSendingOtp(true);
      await sendOtp(email.trim().toLowerCase(), "PASSWORD_RESET");
      setOtpSent(true);
      setOtpMsg("✅ OTP sent to your email. It expires in 10 minutes.");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Could not send OTP. Try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!otp.trim()) {
      setErrorMsg("Please enter the OTP sent to your email.");
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      setErrorMsg("Password must be 7+ characters with 1 uppercase, 1 number, and 1 symbol.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      await resetPassword(email.trim().toLowerCase(), otp.trim(), newPassword);
      alert("Password reset successful. Please login.");
      navigate("/login");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Reset failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Account Recovery"
      title="Let's get you back in."
      subtitle="Verify your email and set a new password."
    >
      <h4 className="mb-3 display-font">Reset Password</h4>
      {errorMsg && <div className="alert alert-danger py-2 text-center">{errorMsg}</div>}
      {otpMsg && <div className="alert alert-success py-2 text-center">{otpMsg}</div>}

      <form onSubmit={handleReset}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Registered Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={otpSent}
        />

        {!otpSent ? (
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={handleSendOtp}
            disabled={sendingOtp}
          >
            {sendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <>
            <input
              className="form-control mb-2 text-center fw-bold"
              style={{ letterSpacing: "0.3em" }}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-link btn-sm mb-3 p-0"
              onClick={handleSendOtp}
              disabled={sendingOtp}
            >
              {sendingOtp ? "Resending..." : "Resend OTP"}
            </button>

            <input
              type="password"
              className="form-control mb-3"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
              {submitting ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        <p className="text-center mt-3 mb-0">
          Remembered your password? <a href="/login">Login</a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;