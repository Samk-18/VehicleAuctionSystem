import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import AuthLayout from "../../components/common/AuthLayout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      setMessage("Login Successful");

      if (data.role === "ROLE_ADMIN") {
        navigate("/admin-ui/dashboard");
      } else if (data.role === "ROLE_SELLER") {
        navigate("/seller/dashboard");
      } else {
        navigate("/buyer/dashboard");
      }
    } catch (error) {
      console.error("LOGIN ERROR", error);
      setMessage(error.response?.data?.message || "Login failed. Check your email or password.");
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Good to see you again."
      subtitle="Log in to keep bidding, tracking orders, or managing your listings."
    >
      <h3 className="mb-1 display-font">Welcome to AuctionMart</h3>
      <p className="text-muted mb-3">Login to your account</p>

      {message && (
        <p
          className={`text-center ${
            message === "Login Successful" ? "text-success" : "text-danger"
          }`}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary w-100" type="submit">
          Login
        </button>

        <div className="text-end mb-3 mt-2">
          <span
            className="text-primary"
            style={{ cursor: "pointer", fontSize: "14px" }}
            onClick={() => navigate("/reset-password")}
          >
            Forgot Password?
          </span>
        </div>

        <div className="text-center mt-3">
          <span className="text-muted">Don’t have an account? </span>
          <span
            className="fw-bold"
            style={{ cursor: "pointer", color: "var(--gold-dark)" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;