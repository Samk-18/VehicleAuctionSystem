import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/common/AuthLayout";

const RegisterChoice = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout
      eyebrow="Join the floor"
      title="Every great deal starts with a registration."
      subtitle="Tell us which side of the gavel you're on — you can always add the other role later."
    >
      <h4 className="mb-4 display-font">How do you want to join?</h4>

      <button
        className="btn btn-outline-primary w-100 mb-3 py-3 text-start px-3"
        onClick={() => navigate("/register/buyer")}
      >
        <div className="fw-bold">Register as Buyer</div>
        <small className="text-muted">Browse, bid, and buy vehicles</small>
      </button>

      <button
        className="btn btn-outline-success w-100 py-3 text-start px-3"
        onClick={() => navigate("/register/seller")}
      >
        <div className="fw-bold">Register as Seller</div>
        <small className="text-muted">List vehicles and manage sales</small>
      </button>

      <p className="text-center mt-4 mb-0">
        Already have an account? <a href="/login">Login</a>
      </p>
    </AuthLayout>
  );
};

export default RegisterChoice;