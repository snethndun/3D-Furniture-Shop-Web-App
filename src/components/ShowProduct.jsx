import React, { useEffect, useState } from "react";
import axios from "axios";

const ShowProduct = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">All Products</h2>
      {products.length === 0 ? (
        <p className="text-gray-600">No products available.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow rounded p-4 border border-gray-200"
            >
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-4"
                />
              )}
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Category:{" "}
                <span className="font-medium">{product.category}</span>
              </p>
              <p className="text-gray-700 mb-2">{product.description}</p>
              <p className="font-bold text-indigo-600 mb-2">${product.price}</p>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowProduct;
