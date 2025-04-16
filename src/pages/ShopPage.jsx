import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { useDebounce } from "use-debounce";
import {
  FaSearch,
  FaFilter,
  FaUndoAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { GiSofa, GiBed, GiOfficeChair } from "react-icons/gi";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (category) {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (priceRange !== "All") {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((p) => p.price >= min && p.price <= max);
    }

    if (debouncedSearchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [category, priceRange, debouncedSearchQuery, products]);

  const handlePageChange = (newPage) => setPage(newPage);

  const clearFilters = () => {
    setCategory("");
    setPriceRange("All");
    setSearchQuery("");
    setPage(1);
  };

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">
             Shop Our Furniture
          </h1>
          <p className="text-gray-600 mt-2">
            Explore our premium furniture collection
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 bg-white shadow-md rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <FaFilter />
              <h2 className="text-lg font-semibold">Filter Options</h2>
            </div>

            <h3 className="text-md font-medium text-gray-700 mb-2">Category</h3>
            <ul className="space-y-2 mb-6">
              {[
                { name: "All", icon: <FaUndoAlt /> },
                { name: "Living Room", icon: <GiSofa /> },
                { name: "Bedroom", icon: <GiBed /> },
                { name: "Office", icon: <GiOfficeChair /> },
              ].map(({ name, icon }) => (
                <li key={name}>
                  <button
                    onClick={() => setCategory(name === "All" ? "" : name)}
                    className={`flex items-center gap-2 w-full py-2 px-3 rounded-lg text-sm transition hover:bg-blue-50 ${
                      category === (name === "All" ? "" : name)
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {icon} {name}
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="text-md font-medium text-gray-700 mb-2">Price</h3>
            <select
              className="w-full p-2 rounded-lg border border-gray-300 bg-white mb-6"
              onChange={(e) => setPriceRange(e.target.value)}
              value={priceRange}
            >
              <option value="All">All Price Ranges</option>
              <option value="0-100">Under $100</option>
              <option value="100-300">$100 - $300</option>
              <option value="300-500">$300 - $500</option>
              <option value="500-10000">Above $500</option>
            </select>

            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <FaUndoAlt /> Reset Filters
            </button>
          </aside>

          {/* Main Section */}
          <main className="flex-1">
            {/* Search */}
            <div className="mb-6 flex items-center gap-3 justify-end">
              <FaSearch className="text-gray-500 text-lg" />
              <input
                type="text"
                className="w-full sm:w-250 p-3 rounded-lg shadow-inner border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="text-center text-gray-600 py-20 animate-pulse">
                Loading products...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <p className="col-span-4 text-center text-gray-600">
                    No products found.
                  </p>
                )}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-4 items-center">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition disabled:opacity-40"
              >
                <FaArrowLeft />
              </button>
              <span className="text-gray-700 font-medium">
                Page {page} of{" "}
                {Math.ceil(filteredProducts.length / itemsPerPage)}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={
                  page === Math.ceil(filteredProducts.length / itemsPerPage)
                }
                className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition disabled:opacity-40"
              >
                <FaArrowRight />
              </button>
            </div>
          </main>
        </div>
      </div>

    </div>
    
  );
};

export default ShopPage;
