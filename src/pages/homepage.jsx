import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import FurnitureModel from "../components/FurnitureModel";
import ProductCard from "../components/ProductCard";
import CategorySection from "../components/category";
import { FaStar, FaPaintBrush, FaTruck } from "react-icons/fa";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <section
        className="relative bg-cover h-70px bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      >
        <div className="container mx-auto px-4 py-20 md:py-32 grid grid-cols-1 md:grid-cols-2 items-center">
          {/* Text content */}
          <div className="space-y-6 text-white animate-fadeInUp max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Discover Furniture That{" "}
              <span className="text-indigo-500">Defines You</span>
            </h1>
            <p className="text-md md:text-lg max-w-lg">
              Elevate your living spaces with sleek, modern, and timeless
              designs — built to last and inspire.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <button className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition">
                  Shop Now
                </button>
              </Link>
              <Link to="/about">
                <button className="px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-white hover:text-black transition">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <CategorySection />

      {/* Features Section */}
      <section className="bg-white py-20 px-8 md:px-20">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Why Choose Us?
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Our 3D furniture is crafted with precision and designed to elevate
            your home. Here are some of the reasons to choose us:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
          {[
            {
              icon: <FaStar />,
              title: "Premium Quality",
              desc: "Our furniture is made from high-quality materials to ensure durability and style.",
            },
            {
              icon: <FaPaintBrush />,
              title: "Custom Designs",
              desc: "Tailor your furniture to match your unique style and preferences.",
            },
            {
              icon: <FaTruck />,
              title: "Fast Delivery",
              desc: "Get your furniture delivered quickly and securely, right to your doorstep.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg hover:scale-105 transition-transform duration-300"
            >
              <div className="text-indigo-700 text-5xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 mt-4">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Section */}
      <section className="bg-white py-20 px-8 md:px-20">
        <div className="text-center space-y-5">
          <h2 className="text-3xl font-semibold text-gray-800">
            Featured Products
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Discover our best-selling products that bring elegance and comfort
            to any home.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {loading ? (
            <p className="text-center text-gray-500 col-span-full">
              Loading products...
            </p>
          ) : error ? (
            <p className="text-center text-red-500 col-span-full">{error}</p>
          ) : products.length > 0 ? (
            products
              .slice(0, 6)
              .map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No products available.
            </p>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20 px-8 md:px-20 border-t border-gray-200">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            What Our Customers Say
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          {[
            {
              quote:
                "The furniture I ordered transformed my living room! The quality is amazing.",
              name: "Jane Doe",
            },
            {
              quote:
                "I loved the customization options. The delivery was seamless.",
              name: "John Smith",
            },
          ].map((testimonial, idx) => (
            <div
              key={idx}
              className="w-full md:w-1/3 p-6 bg-gray-100 rounded-lg shadow-lg"
            >
              <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              <p className="mt-4 font-semibold text-gray-800">
                {testimonial.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 py-20 px-10 md:px-30 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left text-black">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Redefine Your Space?
          </h2>
          <p className="text-lg mb-6">
            Browse our collection of premium 3D furniture and transform your
            home into a luxurious sanctuary.
          </p>
          <Link to="/shop">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-indigo-800 transition duration-300 transform hover:scale-105">
              Start Shopping
            </button>
          </Link>
        </div>

        {/* Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/cta.png"
            alt="Sofa"
            className="w-[400px] h-auto animate-float object-contain"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-8 md:px-20 border-t border-gray-200 text-center text-gray-600">
        <p>&copy; 2025 3D Furniture. All rights reserved.</p>
        <div className="mt-4">
          <Link to="/contact" className="hover:text-indigo-600 mx-2">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-indigo-600 mx-2">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-indigo-600 mx-2">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
