import React, { createContext, useState, useContext } from "react";

// Create Cart Context
const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if the product is already in the cart using _id or id
      const existingItem = prevItems.find((item) => item._id === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 } // Increase quantity
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }]; // Add new product to the cart
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(
      (prevItems) => prevItems.filter((item) => item._id !== productId) // Ensure removal by _id or id
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
