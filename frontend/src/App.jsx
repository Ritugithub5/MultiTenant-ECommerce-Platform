import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext"
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from './pages/OrderDetailsPage';
import WishlistPage from "./pages/WishlistPage";
import VendorDashboard from "./pages/VendorDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WomenFashionPage from "./pages/WomenFashionPage";
import MenFashionPage from "./pages/MenFashionPage";
import About from "./pages/About";
import Electronics from "./pages/Electronics";
import SunglassesPage from "./pages/SunglassesPage";
import BagsPage from "./pages/BagsPage";
import JewelryPage from "./pages/JewelryPage";
import WatchesPage from "./pages/WatchesPage";
import FootwearPage from "./pages/FootwearPage";
import VendorOrderDetailsPage from './pages/VendorOrderDetailsPage';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navbar />
        <main className="p-4">
          <Routes>
            {/* ============================================================
               PUBLIC ROUTES - No login required
            ============================================================ */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/WomenFashionPage" element={<WomenFashionPage />} />
            <Route path="/MenFashionPage" element={<MenFashionPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/electronics" element={<Electronics />} />
            <Route path="/SunglassesPage" element={<SunglassesPage />} />
            <Route path="/BagsPage" element={<BagsPage />} />
            <Route path="/JewelryPage" element={<JewelryPage />} />
            <Route path="/WatchesPage" element={<WatchesPage />} />
            <Route path="/FootwearPage" element={<FootwearPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ============================================================
               PROTECTED ROUTES - Require Login
            ============================================================ */}
            <Route path="/CartPage" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/CheckoutPage" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/OrderSuccessPage" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
            <Route path="/OrdersPage" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
            <Route path="/WishlistPage" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/vendor" element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} />
            <Route path="/vendor/order/:id" element={<ProtectedRoute><VendorOrderDetailsPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}