import React, { useEffect, useState } from "react";
import { getMyCart, removeFromCart } from "../../services/CartService";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import { startPayment } from "../../util/startPayment";
import DashboardShell from "../../components/dashboard/DashboardShell";

const navItems = [
  { label: "Live Auctions", icon: "bi-hammer", path: "/user/auctions" },
  { label: "My Bids", icon: "bi-graph-down", path: "/user/bids" },
  { label: "Won Auctions", icon: "bi-trophy-fill", path: "/user/won-auctions" },
  { label: "Subscriptions", icon: "bi-gem", path: "/user/subscriptions" },
  { label: "My Plan", icon: "bi-person-badge", path: "/user/my-subscription" },
  { label: "Direct Sale", icon: "bi-cart3", path: "/user/car-for-sell" },
  { label: "My Orders", icon: "bi-receipt-cutoff", path: "/user/my-orders" },
];

const Cart = () => {
  const [cart, setCart] = useState({ cartId: null, cars: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await getMyCart();
      setCart({
        cartId: data?.cartId ?? null,
        cars: Array.isArray(data?.cars) ? data.cars : [],
        totalAmount: data?.totalAmount ?? 0,
      });
    } catch (err) {
      console.error(err);
      setCart({ cartId: null, cars: [], totalAmount: 0 });
      alert("Failed to fetch cart");
    }
    setLoading(false);
  };

  const handleRemove = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <DashboardShell roleLabel="BUYER" navItems={navItems} userName={username}>
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border" style={{ color: "var(--navy)" }} />
        </div>
      </DashboardShell>
    );
  }

  if (!cart?.cars || cart.cars.length === 0) {
    return (
      <DashboardShell roleLabel="BUYER" navItems={navItems} userName={username}>
        <div className="text-center py-5">
          <i className="bi bi-cart-x fs-1 mb-3 d-block" style={{ color: "var(--muted)", opacity: 0.4 }}></i>
          <h4 className="display-font fw-bold">Your cart is empty</h4>
          <p className="text-muted mb-4">Browse direct-sale vehicles to add something here.</p>
          <button
            className="btn rounded-pill px-4"
            style={{ background: "var(--navy)", color: "#fff", border: "none" }}
            onClick={() => navigate("/user/car-for-sell")}
          >
            <i className="bi bi-cart3 me-2"></i> Browse Direct Sale
          </button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell roleLabel="BUYER" navItems={navItems} userName={username}>
      <div className="mb-4">
        <span className="text-uppercase fw-semibold" style={{ color: "var(--gold-dark)", fontSize: "0.75rem", letterSpacing: "0.12em" }}>
          Buyer Dashboard
        </span>
        <h2 className="fw-bold display-font mt-1 mb-0" style={{ color: "var(--text)" }}>
          My Cart
        </h2>
        <p className="text-muted fs-6 mb-0">{cart.cars.length} vehicle{cart.cars.length !== 1 ? "s" : ""} ready for checkout.</p>
      </div>

      {cart.cars.map((item) => (
        <CartItem key={item.id} item={item} onRemove={handleRemove} />
      ))}

      <div className="card shadow-sm border-0 rounded-4 p-4 mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold display-font mb-0">Total Amount</h5>
          <h3 className="fw-bold mb-0" style={{ color: "var(--gold-dark)" }}>
            ₹{(cart.totalAmount || 0).toLocaleString()}
          </h3>
        </div>

        <button
          className="btn btn-lg w-100 rounded-pill fw-bold"
          style={{ background: "var(--gold)", color: "var(--navy)", border: "none" }}
          onClick={() => {
            startPayment({
              amount: cart.totalAmount,
              paymentFor: "CAR_PURCHASE",
              referenceId: cart?.cartId,
              title: "Car Purchase Payment",
              onSuccess: () => navigate("/buyer/dashboard"),
            });
          }}
        >
          <i className="bi bi-cart-check-fill me-2"></i>
          Proceed to Checkout
        </button>
      </div>
    </DashboardShell>
  );
};

export default Cart;
