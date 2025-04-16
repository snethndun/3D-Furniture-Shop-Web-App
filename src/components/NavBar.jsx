import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import CartSlider from "./CartSlider"; // Import CartSlider component

const Navbar = () => {
  const [cartItems, setCartItems] = useState([]); // State to store cart items
  const [isCartOpen, setIsCartOpen] = useState(false); // State to toggle cart slider

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen); // Toggle cart slider visibility
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-semibold text-indigo-600 hover:text-indigo-800 transition duration-300"
        >
          3D Furniture
        </Link>

        {/* Nav Links */}
        <nav className="space-x-12 text-gray-700 font-medium">
          <Link
            to="/"
            className="hover:text-indigo-600 transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="hover:text-indigo-600 transition duration-300"
          >
            Shop
          </Link>
          <Link
            to="/admin"
            className="hover:text-indigo-600 transition duration-300"
          >
            Admin Dashboard
          </Link>
          <Link
            to="/contact"
            className="hover:text-indigo-600 transition duration-300"
          >
            Contact
          </Link>
        </nav>

        {/* Cart Icon */}
        <button
          onClick={toggleCart} // Toggle cart visibility on click
          className="relative text-gray-700 hover:text-indigo-600 transition duration-300"
        >
          <FiShoppingCart size={24} />
          {/* Optionally show item count */}
          {/* <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">3</span> */}
        </button>
      </div>

      {/* Cart Slider */}
      <CartSlider
        cartItems={cartItems}
        onRemoveFromCart={removeFromCart}
        isOpen={isCartOpen}
        toggleCart={toggleCart}
      />
    </header>
  );
};

export default Navbar;
