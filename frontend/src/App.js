import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { StoreProvider } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import Wishlist from "@/pages/Wishlist";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminCoupons from "@/pages/admin/AdminCoupons";

const Shell = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-[70vh]">{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <StoreProvider>
          <BrowserRouter>
            <Toaster position="bottom-right" theme="light" />
            <Routes>
              <Route path="/" element={<Shell><Home /></Shell>} />
              <Route path="/shop" element={<Shell><Shop /></Shell>} />
              <Route path="/product/:id" element={<Shell><ProductDetail /></Shell>} />
              <Route path="/cart" element={<Shell><Cart /></Shell>} />
              <Route path="/checkout" element={<Shell><ProtectedRoute><Checkout /></ProtectedRoute></Shell>} />
              <Route path="/orders" element={<Shell><ProtectedRoute><Orders /></ProtectedRoute></Shell>} />
              <Route path="/wishlist" element={<Shell><ProtectedRoute><Wishlist /></ProtectedRoute></Shell>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<ProtectedRoute admin><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="coupons" element={<AdminCoupons />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </StoreProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
