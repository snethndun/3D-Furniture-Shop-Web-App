import React, { useState } from "react";
import axios from "axios";

const categories = ["Living Room", "Bedroom", "Dining", "Office"];

const AdminDashboard = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
    glbFile: null,
  });

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const handleGlbChange = (e) => {
    setProduct({ ...product, glbFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      alert("Please select a category before submitting.");
      return;
    }

    try {
      // Upload product image to Cloudinary
      const imageFormData = new FormData();
      imageFormData.append("file", product.image);
      imageFormData.append("upload_preset", "first_one");

      const imageRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dhgou55im/image/upload",
        imageFormData
      );
      const imageUrl = imageRes.data.secure_url;

      // Upload .glb file to local server
      let glbUrl = "";
      if (product.glbFile) {
        const glbFormData = new FormData();
        glbFormData.append("file", product.glbFile);

        const glbRes = await axios.post(
          "http://localhost:5000/api/products/upload-glb",
          glbFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        glbUrl = glbRes.data.fileUrl;
      }

      // Submit product data
      await axios.post("http://localhost:5000/api/products", {
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl,
        glbUrl,
        category: selectedCategory,
      });

      alert("Product added successfully!");
      setProduct({
        name: "",
        description: "",
        price: "",
        image: null,
        glbFile: null,
      });
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Product</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Select Category
        </h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded font-medium text-white ${
                selectedCategory === category
                  ? "bg-indigo-600"
                  : "bg-gray-400 hover:bg-indigo-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        {selectedCategory && (
          <p className="text-sm text-green-600 mt-2">
            Selected: {selectedCategory}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Product Price"
          value={product.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Product Image (JPEG, PNG)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            3D Model (.glb format)
          </label>
          <input
            type="file"
            accept=".glb"
            onChange={handleGlbChange}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
