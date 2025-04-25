import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import productRoutes from "./routes/ProductRoutes.js";
import authRoutes from "./routes/authRoutes.js";


// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;
const MONGODB_URI = "mongodb://localhost:27017/furniture";

// File storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (
      file.mimetype === "model/gltf-binary" ||
      file.originalname.endsWith(".glb")
    ) {
      cb(null, path.join(__dirname, "uploads/glb"));
    } else {
      cb(null, path.join(__dirname, "uploads/images"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

// ✅ Serve static files correctly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post(
  "/upload",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "glbFile", maxCount: 1 },
  ]),
  (req, res) => {
    const imageUrl = req.files?.image
      ? `/uploads/images/${req.files.image[0].filename}`
      : "";
    const glbUrl = req.files?.glbFile
      ? `/uploads/glb/${req.files.glbFile[0].filename}`
      : "";

    res.json({ imageUrl, glbUrl });
  }
);

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
