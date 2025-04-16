import React from "react";
import { useCart } from "../context/CartContext"; // import context

const CartSlider = ({ isOpen, toggleCart }) => {
  const { cartItems, removeFromCart } = useCart(); // get cart state

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 transition-all duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={toggleCart} // Close cart when overlay is clicked
      ></div>

      {/* Cart Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl p-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button onClick={toggleCart} className="text-lg text-gray-600">
            X
          </button>
        </div>

        {/* Items */}
        <div className="space-y-4 overflow-y-auto h-[70%]">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item._id)} // Remove item by _id
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">Your cart is empty</p>
          )}
        </div>

        {/* Total */}
        {cartItems.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <p className="font-semibold">
              Total: ${calculateTotal().toFixed(2)}
            </p>
            <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSlider;
