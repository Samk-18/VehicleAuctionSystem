import { Routes, Route } from "react-router-dom";

/* ================= PUBLIC PAGES ================= */
import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import RegisterChoice from "./pages/auth/RegisterChoice";
import BuyerRegister from "./pages/auth/BuyerRegister";
import SellerRegister from "./pages/auth/SellerRegister";
import ResetPassword from "./pages/auth/ResetPasssword";

/* ================= ROUTE GUARD ================= */
import ProtectedRoute from "./components/common/ProtectedRoute";

/* ================= USER PAGES ================= */
import UserDashboard from "./pages/user/UserDashBoard";
import Auctions from "./pages/user/auctions";
import ViewAuction from "./pages/user/ViewAuction";
import MyBids from "./pages/user/MyBids";
import AddCar from "./pages/user/addCar";
import SubscriptionPlans from "./pages/user/SubscriptionPlans";
import MySubscription from "./pages/user/MySubscription";
import MyCars from "./pages/user/MyCars";
import CarsForSale from "./pages/user/CarForSale";
import MyOrdersPage from "./pages/order/MyOrdersPage";

/* ================= ADMIN PAGES (UI ROUTES) ================= */
import AdminDashboard from "./pages/admin/AdminDashBoard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageVehicles from "./pages/admin/ManageVechiles";
import ViewAuctions from "./pages/admin/ViewAuctions";

import WonAuctions from "./pages/user/WonAuctions";
import AdminAuctions from "./pages/admin/AdminAuctions";
import Cart from "./pages/cart/Cart";
import PaymentPage from "./pages/payment/PaymentPage";
import DealPaymentPage from "./pages/payment/DealPaymentPage";

import SellerDashboard from "./pages/seller/SellerDashboard";
import AuctionStatus from "./pages/seller/AuctionStatus";
import AuctionHistory from "./pages/seller/AuctionHistory";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import LiveAuctions from "./pages/admin/LiveAuctions";
import Checkout from "./pages/user/Checkout";

function App() {
  return (
    <Routes>

      {/* ===== PUBLIC ===== */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterChoice />} />
      <Route path="/register/buyer" element={<BuyerRegister />} />
      <Route path="/register/seller" element={<SellerRegister />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ===== BUYER (protected) ===== */}
      <Route path="/buyer/dashboard" element={
        <ProtectedRoute role="ROLE_BUYER"><BuyerDashboard /></ProtectedRoute>
      } />
      <Route path="/user/dashboard" element={
        <ProtectedRoute><UserDashboard /></ProtectedRoute>
      } />
      <Route path="/user/auctions" element={
        <ProtectedRoute><Auctions /></ProtectedRoute>
      } />
      <Route path="/user/auction/:auctionId" element={
        <ProtectedRoute role="ROLE_BUYER"><ViewAuction /></ProtectedRoute>
      } />
      <Route path="/user/payment/deal/:dealId" element={
        <ProtectedRoute role="ROLE_BUYER"><DealPaymentPage /></ProtectedRoute>
      } />
      <Route path="/user/bids" element={
        <ProtectedRoute role="ROLE_BUYER"><MyBids /></ProtectedRoute>
      } />
      <Route path="/user/subscriptions" element={
        <ProtectedRoute><SubscriptionPlans /></ProtectedRoute>
      } />
      <Route path="/user/my-subscription" element={
        <ProtectedRoute><MySubscription /></ProtectedRoute>
      } />
      <Route path="/user/car-for-sell" element={
        <ProtectedRoute><CarsForSale /></ProtectedRoute>
      } />
      <Route path="/user/my-orders" element={
        <ProtectedRoute role="ROLE_BUYER"><MyOrdersPage /></ProtectedRoute>
      } />
      <Route path="/user/cart" element={
        <ProtectedRoute role="ROLE_BUYER"><Cart /></ProtectedRoute>
      } />
      <Route path="/user/payment" element={
        <ProtectedRoute role="ROLE_BUYER"><PaymentPage /></ProtectedRoute>
      } />
      <Route path="/user/payment/:auctionId" element={
        <ProtectedRoute role="ROLE_BUYER"><Checkout /></ProtectedRoute>
      } />
      <Route path="/user/won-auctions" element={
        <ProtectedRoute role="ROLE_BUYER"><WonAuctions /></ProtectedRoute>
      } />

      {/* ===== SELLER (protected) ===== */}
      <Route path="/seller/dashboard" element={
        <ProtectedRoute role="ROLE_SELLER"><SellerDashboard /></ProtectedRoute>
      } />
      <Route path="/seller/auction-history" element={
        <ProtectedRoute role="ROLE_SELLER"><AuctionHistory /></ProtectedRoute>
      } />
      <Route path="/seller/auction-status" element={
        <ProtectedRoute role="ROLE_SELLER"><AuctionStatus /></ProtectedRoute>
      } />
      <Route path="/user/add-car" element={
        <ProtectedRoute role="ROLE_SELLER"><AddCar /></ProtectedRoute>
      } />
      <Route path="/user/my-cars" element={
        <ProtectedRoute role="ROLE_SELLER"><MyCars /></ProtectedRoute>
      } />

      {/* ===== ADMIN UI (protected) ===== */}
      <Route path="/admin-ui/dashboard" element={
        <ProtectedRoute role="ROLE_ADMIN"><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin-ui/users" element={
        <ProtectedRoute role="ROLE_ADMIN"><ManageUsers /></ProtectedRoute>
      } />
      <Route path="/admin-ui/vehicles" element={
        <ProtectedRoute role="ROLE_ADMIN"><ManageVehicles /></ProtectedRoute>
      } />
      <Route path="/admin-ui/auctions" element={
        <ProtectedRoute role="ROLE_ADMIN"><ViewAuctions /></ProtectedRoute>
      } />
      <Route path="/admin/auctions" element={
        <ProtectedRoute role="ROLE_ADMIN"><AdminAuctions /></ProtectedRoute>
      } />
      <Route path="/admin/auctions/live" element={
        <ProtectedRoute role="ROLE_ADMIN"><LiveAuctions /></ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
