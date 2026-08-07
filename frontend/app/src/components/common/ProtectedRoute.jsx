import { Navigate } from "react-router-dom";

/**
 * Wrap any route element with this to require login (and optionally a specific role).
 * Usage: <Route path="/seller/dashboard" element={<ProtectedRoute role="ROLE_SELLER"><SellerDashboard /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    // logged in, but wrong role — send them to their own dashboard instead of a dead end
    if (userRole === "ROLE_ADMIN") return <Navigate to="/admin-ui/dashboard" replace />;
    if (userRole === "ROLE_SELLER") return <Navigate to="/seller/dashboard" replace />;
    return <Navigate to="/buyer/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;