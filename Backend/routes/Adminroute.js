import express from "express";
import protectAdmin from "../middleware/protectAdmin.js"; // Import the middleware

const router = express.Router();

// Admin-only route to view all users
router.get("/admin/users", protectAdmin, (req, res) => {
  // Logic to fetch and return all users
  res.status(200).json({ message: "Admin can view all users" });
});

// Admin-only route to manage orders
router.get("/admin/orders", protectAdmin, (req, res) => {
  // Logic to fetch and return all orders
  res.status(200).json({ message: "Admin can view all orders" });
});

export default router;
