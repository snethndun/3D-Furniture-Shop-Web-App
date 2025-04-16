import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; // Import the CartProvider

import Navbar from "./components/NavBar";
import Home from "./pages/homepage";
import AdminDashboard from "./pages/Admin-Dashboard";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/SingleProductPage";

const App = () => {
  return (
    <CartProvider>
      {" "}
      {/* Wrap your app with CartProvider */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
