import React, { useState } from "react";
import AddProduct from "../components/AddProduct";
import ShowProduct from "../components/ShowProduct";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="min-h-screen bg-white  p-6 flex items-center justify-center">
      <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg">
        <div className="p-8">
          {/* Dashboard Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your products seamlessly
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex justify-center gap-8 mb-8">
            <button
              className={`px-6 py-3 text-lg font-medium rounded-full transition-all ${
                activeTab === "add"
                  ? "bg-indigo-600 text-white transform scale-105 shadow-lg"
                  : "bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50"
              }`}
              onClick={() => setActiveTab("add")}
            >
              Add Product
            </button>
            <button
              className={`px-6 py-3 text-lg font-medium rounded-full transition-all ${
                activeTab === "view"
                  ? "bg-indigo-600 text-white transform scale-105 shadow-lg"
                  : "bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50"
              }`}
              onClick={() => setActiveTab("view")}
            >
              View Products
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105">
            {activeTab === "add" ? <AddProduct /> : <ShowProduct />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
