import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { StarIcon, ShoppingCartIcon } from "lucide-react";
import FurnitureModel from "../components/FurnitureModel";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

const ProductDetailPage = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const [selectedContent, setSelectedContent] = useState("image");
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchProducts();
  }, []);

  if (!product) {
    return <div className="text-center py-20 text-xl">Product not found</div>;
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} has been added to your cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 space-y-20">
      {/* Product Detail */}
      <div className="bg-white rounded-xl shadow-lg max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 p-8">
        {/* Left: Viewer */}
        <div className="space-y-6 flex flex-col items-center">
          <div className="w-full h-[360px] bg-gray-200 rounded-xl overflow-hidden shadow-md flex items-center justify-center relative transition-all">
            {selectedContent === "image" ? (
              <img
                src={product.imageUrl}
                alt="Selected product"
                className="object-contain h-full w-full"
              />
            ) : (
              <FurnitureModel modelUrl={product.glbUrl} />
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4">
            <div
              onClick={() => setSelectedContent("image")}
              className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition ${
                selectedContent === "image"
                  ? "border-indigo-600"
                  : "border-gray-300"
              }`}
            >
              <img
                src={product.imageUrl}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center text-white text-xs font-semibold p-1">
                Image
              </div>
            </div>

            {product.glbUrl && (
              <div
                onClick={() => setSelectedContent("glb")}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition ${
                  selectedContent === "glb"
                    ? "border-indigo-600"
                    : "border-gray-300"
                }`}
              >
                <img
                  src={product.imageUrl}
                  alt="3D Model Thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center text-white text-xs font-semibold p-1">
                  3D Model
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-center space-y-5">
          <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 text-lg">{product.description}</p>

          <div className="flex items-center space-x-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  size={20}
                  fill={
                    i < Math.floor(product.rating) ? "currentColor" : "none"
                  }
                  className={
                    i < Math.floor(product.rating)
                      ? "text-amber-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="text-3xl font-extrabold text-indigo-600">
            ${product.price}
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-500 transition w-fit"
          >
            <ShoppingCartIcon size={20} />
            Add to Cart
          </button>

          <div className="text-sm text-gray-500">
            Category:{" "}
            <span className="font-medium text-gray-700">
              {product.category || "Uncategorized"}
            </span>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="bg-white py-12 px-4 md:px-20">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            You might also like
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loadingFeatured ? (
            <p className="text-center text-gray-500 col-span-full">
              Loading featured products...
            </p>
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No featured products found.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
