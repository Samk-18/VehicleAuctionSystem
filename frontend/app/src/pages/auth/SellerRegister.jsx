import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerSeller, sendOtp } from "../../services/authService";
import AuthLayout from "../../components/common/AuthLayout";

const SellerRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    houseStreet: "",
    city: "",
    state: "",
    pincode: "",
    idProofNumber: "",
    drivingLicenseNumber: "",
    sellerType: "INDIVIDUAL",
    dealerName: "",
    otp: "",
    agreeTerms: false,
    agreePrivacy: false,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [otpMsg, setOtpMsg] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{7,}$/;
    const aadhaarRegex = /^\d{12}$/;
    const panRegex = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/;
    const dlRegex = /^[A-Za-z0-9-]{10,16}$/;

    if (!emailRegex.test(formData.email)) return "Please enter a valid email address.";
    if (!phoneRegex.test(formData.phone)) return "Mobile number must be 10 digits, starting 6-9.";
    if (!passwordRegex.test(formData.password))
      return "Password must be 7+ characters with 1 uppercase, 1 number, and 1 symbol.";
    if (formData.password !== formData.confirmPassword) return "Passwords do not match.";
    if (!formData.houseStreet || !formData.city || !formData.state || !formData.pincode)
      return "Complete address is required for sellers.";
    if (!aadhaarRegex.test(formData.idProofNumber) && !panRegex.test(formData.idProofNumber))
      return "Enter a valid Aadhaar (12 digits) or PAN (e.g. ABCDE1234F).";
    if (!dlRegex.test(formData.drivingLicenseNumber))
      return "Enter a valid Driving License number.";
    if (!formData.agreeTerms) return "You must agree to the Terms & Conditions.";
    if (!formData.agreePrivacy) return "You must agree to the Privacy Policy.";
    return "";
  };

  const handleSendOtp = async () => {
    setErrorMsg("");
    setOtpMsg("");

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    try {
      setSendingOtp(true);
      await sendOtp(formData.email.trim().toLowerCase(), "REGISTRATION");
      setOtpSent(true);
      setOtpMsg("✅ OTP sent to your email. It expires in 10 minutes.");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Could not send OTP. Try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.otp.trim()) {
      setErrorMsg("Please enter the OTP sent to your email.");
      return;
    }

    try {
      setSubmitting(true);
      await registerSeller({
        ...formData,
        email: formData.email.trim().toLowerCase(),
        idProofNumber: formData.idProofNumber.trim().toUpperCase(),
        drivingLicenseNumber: formData.drivingLicenseNumber.trim().toUpperCase(),
      });
      alert("Registration successful. You're now a seller — please login.");
      navigate("/login");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Seller"
      title="List it. Sell it."
      subtitle="Register to post vehicles, manage listings, and track your sales."
    >
      <h4 className="mb-3 display-font">Seller Registration</h4>
      {errorMsg && <div className="alert alert-danger py-2 text-center">{errorMsg}</div>}
      {otpMsg && <div className="alert alert-success py-2 text-center">{otpMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <input className="form-control mb-3" name="firstName" placeholder="First Name"
              value={formData.firstName} onChange={handleChange} required disabled={otpSent} />
          </div>
          <div className="col">
            <input className="form-control mb-3" name="lastName" placeholder="Last Name"
              value={formData.lastName} onChange={handleChange} required disabled={otpSent} />
          </div>
        </div>

        <input className="form-control mb-3" type="email" name="email" placeholder="Email Address"
          value={formData.email} onChange={handleChange} required disabled={otpSent} />

        <input className="form-control mb-3" name="phone" placeholder="Mobile Number"
          value={formData.phone} onChange={handleChange} required disabled={otpSent} />

        <input className="form-control mb-3" type="password" name="password" placeholder="Password"
          value={formData.password} onChange={handleChange} required disabled={otpSent} />

        <input className="form-control mb-3" type="password" name="confirmPassword" placeholder="Confirm Password"
          value={formData.confirmPassword} onChange={handleChange} required disabled={otpSent} />

        <small className="text-muted">Address</small>
        <input className="form-control mb-3 mt-1" name="houseStreet" placeholder="House No. / Street"
          value={formData.houseStreet} onChange={handleChange} required disabled={otpSent} />
        <div className="row">
          <div className="col-4">
            <input className="form-control mb-3" name="city" placeholder="City"
              value={formData.city} onChange={handleChange} required disabled={otpSent} />
          </div>
          <div className="col-4">
            <input className="form-control mb-3" name="state" placeholder="State"
              value={formData.state} onChange={handleChange} required disabled={otpSent} />
          </div>
          <div className="col-4">
            <input className="form-control mb-3" name="pincode" placeholder="Pincode"
              value={formData.pincode} onChange={handleChange} required disabled={otpSent} />
          </div>
        </div>

        <small className="text-muted">Identity Verification</small>
        <input className="form-control mb-3 mt-1" name="idProofNumber" placeholder="Aadhaar Number / PAN Number"
          value={formData.idProofNumber} onChange={handleChange} required disabled={otpSent} />
        <input className="form-control mb-3" name="drivingLicenseNumber" placeholder="Driving License Number"
          value={formData.drivingLicenseNumber} onChange={handleChange} required disabled={otpSent} />

        <small className="text-muted">Business Information (optional)</small>
        <select className="form-control mb-3 mt-1" name="sellerType"
          value={formData.sellerType} onChange={handleChange} disabled={otpSent}>
          <option value="INDIVIDUAL">Individual</option>
          <option value="DEALER">Dealer</option>
        </select>

        {formData.sellerType === "DEALER" && (
          <input className="form-control mb-3" name="dealerName" placeholder="Dealer Name"
            value={formData.dealerName} onChange={handleChange} disabled={otpSent} />
        )}

        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" name="agreeTerms"
            checked={formData.agreeTerms} onChange={handleChange} id="sellerTerms" disabled={otpSent} />
          <label className="form-check-label" htmlFor="sellerTerms">
            I agree to the Terms &amp; Conditions
          </label>
        </div>
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" name="agreePrivacy"
            checked={formData.agreePrivacy} onChange={handleChange} id="sellerPrivacy" disabled={otpSent} />
          <label className="form-check-label" htmlFor="sellerPrivacy">
            I agree to the Privacy Policy
          </label>
        </div>

        {!otpSent ? (
          <button
            type="button"
            className="btn btn-success w-100"
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
              name="otp"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={formData.otp}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="btn btn-link btn-sm mb-2 p-0"
              onClick={handleSendOtp}
              disabled={sendingOtp}
            >
              {sendingOtp ? "Resending..." : "Resend OTP"}
            </button>
            <button className="btn btn-success w-100" type="submit" disabled={submitting}>
              {submitting ? "Verifying..." : "Verify & Register"}
            </button>
          </>
        )}

        <p className="text-center mt-3 mb-0">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SellerRegister;
