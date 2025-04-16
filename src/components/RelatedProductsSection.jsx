import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const RelatedProductsSection = ({ currentProductId, currentCategory }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        const all = res.data;

        // Filter out current product and match category (or fallback to random)
        const filtered = all.filter(
          (p) =>
            p._id !== currentProductId &&
            (p.category === currentCategory || Math.random() > 0.5) // fallback random
        );

        // Shuffle and take up to 4
        const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 4);
        setRelatedProducts(shuffled);
      } catch (err) {
        console.error("Failed to fetch related products", err);
      }
    };

    fetchRelated();
  }, [currentProductId, currentCategory]);

  return (
    <section className="mt-20 max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        You might also like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProductsSection;
