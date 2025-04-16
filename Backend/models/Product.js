import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String }, // Cloudinary image URL
    glbUrl: { type: String }, // Can now be a local file path (e.g., /uploads/glb/filename.glb)
    category: { type: String }, // Optional category field
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
