import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; // Import the CartProvider

import Navbar from "./components/NavBar";
import Home from "./pages/homepage";
import AdminDashboard from "./pages/Admin-Dashboard";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/SingleProductPage";
import LoginModal from "./components/LoginModal";
import ThreeDRoomPage from "./pages/ThreeDRoom";

const App = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Functions to manage the modal state
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <CartProvider>
      {/* Wrap your app with CartProvider */}
      <Router>
        <Navbar openLoginModal={openLoginModal} />{" "}
        {/* Pass function to Navbar to open login modal */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/3D" element={<ThreeDRoomPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route
            path="/login"
            element={
              <LoginModal
                isOpen={isLoginModalOpen}
                closeModal={closeLoginModal}
              />
            }
          />
        </Routes>
       
      </Router>
    </CartProvider>
  );
};

export default App;
