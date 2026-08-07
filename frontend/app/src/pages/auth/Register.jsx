import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import Footer from "../../components/common/Footer";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [errorMsg, setErrorMsg] = useState("");

const validate = () => {
  const phoneRegex = /^[6-9]\d{9}$/;
if (!phoneRegex.test(formData.phone)) {
  return "Phone number must be exactly 10 digits.";
}
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{7,}$/;

  if (!emailRegex.test(formData.email)) {
    return "Please enter a valid email address.";
  }
  if (!passwordRegex.test(formData.password)) {
    return "Password must be at least 7 characters and include 1 uppercase letter, 1 number, and 1 symbol.";
  }
  return "";
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMsg("");

  const validationError = validate();
  if (validationError) {
    setErrorMsg(validationError);
    return;
  }

  try {
    await register({ ...formData, email: formData.email.trim().toLowerCase() });
    alert("Registration successful. Please login.");
    navigate("/login");
  } catch (error) {
    setErrorMsg(error.response?.data?.message || "Registration failed. Try again.");
  }
};

  return (
    <div className="d-flex flex-column vh-100">
      <div className="container d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card shadow p-4" style={{ width: "420px" }}>
          <h4 className="text-center mb-3">Create an Account</h4>
          {errorMsg && (
            <div className="alert alert-danger py-2 text-center">{errorMsg}</div>
          )}
          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-3"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <input
              className="form-control mb-3"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <input
              className="form-control mb-3"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              className="form-control mb-3"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              className="form-control mb-3"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <textarea
              className="form-control mb-3"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />

            <button className="btn btn-primary w-100" type="submit">
              Register
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
