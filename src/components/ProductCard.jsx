import React from "react";
import { Link } from "react-router-dom";
import { HeartIcon, StarIcon, ShoppingCartIcon } from "lucide-react";

const ProductCard = ({ product }) => {
  const imageUrl = product.imageUrl ? product.imageUrl : "/default-image.jpg"; // fallback if needed

  return (
    <div
      key={product._id}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow transform hover:scale-105 max-w-xs"
    >
      <Link
        to={`/product/${product._id}`}
        state={{ product }}
        className="block relative"
      >
        <div className="aspect-w-4 aspect-h-3 overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </div>
        {/* NEW label */}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
            NEW
          </div>
        )}
        {/* Heart Icon */}
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
          <HeartIcon size={18} className="text-gray-600" />
        </button>
      </Link>

      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-gray-500 mb-1">{product.category}</div>
        {/* Product name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {product.name}
        </h3>
        {/* Rating and Reviews */}
        <div className="flex items-center mb-2">
          <div className="flex text-amber-400 mr-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                size={14}
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                className={
                  i < Math.floor(product.rating)
                    ? "text-amber-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-800">
            ${product.price}
          </span>
          <button className="p-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors">
            <ShoppingCartIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
