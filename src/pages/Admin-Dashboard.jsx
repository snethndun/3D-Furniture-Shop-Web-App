import React, { useState } from "react";
import AddProduct from "../components/AddProduct";
import ShowProduct from "../components/ShowProduct";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-10">
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-4">
          <button
            onClick={() => setActiveTab("add")}
            className={`text-left px-4 py-2 rounded-md text-lg font-medium transition ${
              activeTab === "add"
                ? "bg-indigo-600 text-white shadow"
                : "text-indigo-700 hover:bg-indigo-100"
            }`}
          >
            Add Product
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`text-left px-4 py-2 rounded-md text-lg font-medium transition ${
              activeTab === "view"
                ? "bg-indigo-600 text-white shadow"
                : "text-indigo-700 hover:bg-indigo-100"
            }`}
          >
             View Products
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            {activeTab === "add" ? "Add New Product" : "Product List"}
          </h1>
          <p className="text-gray-600 mt-2">
            {activeTab === "add"
              ? "Use the form below to add a new product."
              : "Here are all the products you’ve added."}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === "add" ? <AddProduct /> : <ShowProduct />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
