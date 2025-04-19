import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import CartSlider from "./CartSlider";
import LoginModal from "./LoginModal";
import SignupModal from "./signupModal";

const Navbar = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (token) {
      setIsLoggedIn(true);
      if (email) setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setUserEmail("");
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  return (
    <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-semibold text-indigo-600">
          3D Furniture
        </Link>

        {/* Links */}
        <nav className="space-x-12 text-gray-700 font-medium">
          <Link to="/" className="hover:text-indigo-600">
            Home
          </Link>
          <Link to="/shop" className="hover:text-indigo-600">
            Shop
          </Link>
          {userEmail === "admin@gmail.com" && (
            <Link to="/admin" className="hover:text-indigo-600">
              Admin Dashboard
            </Link>
          )}
          <Link to="/contact" className="hover:text-indigo-600">
            Contact
          </Link>
        </nav>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleCart}
            className="text-gray-700 hover:text-indigo-600"
          >
            <FiShoppingCart size={24} />
          </button>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={openLoginModal}
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white"
              >
                Login
              </button>
              <button
                onClick={openSignupModal}
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* Cart Slider */}
      <CartSlider
        cartItems={cartItems}
        onRemoveFromCart={(id) =>
          setCartItems((prev) => prev.filter((item) => item.id !== id))
        }
        isOpen={isCartOpen}
        toggleCart={toggleCart}
      />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        closeModal={closeLoginModal}
        onLoginSuccess={() => {
          const email = localStorage.getItem("email");
          if (email) {
            setUserEmail(email);
            setIsLoggedIn(true);
          }
        }}
        openSignup={() => {
          closeLoginModal();
          openSignupModal();
        }}
      />

      <SignupModal
        isOpen={isSignupModalOpen}
        closeModal={closeSignupModal}
        openLogin={() => {
          closeSignupModal();
          openLoginModal();
        }}
      />
    </header>
  );
};

export default Navbar;
