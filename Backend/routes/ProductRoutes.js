import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Product from "../models/Product.js";

const router = express.Router();

// Setup multer for .glb upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/glb";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Route to upload .glb file
router.post("/upload-glb", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `http://localhost:5000/uploads/glb/${req.file.filename}`;
  res.status(200).json({ fileUrl });
});

// Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE route
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }});

// Create a new product
router.post("/", async (req, res) => {
  try {
    const { name, price, description, imageUrl, glbUrl, category } = req.body;

    if (!name || !price || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      imageUrl,
      glbUrl,
      category,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Error adding product", error: err });
  }
});

export default router;
