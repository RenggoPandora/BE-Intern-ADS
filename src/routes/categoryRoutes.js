// routes/categoryRoutes.js
import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  softDeleteCategory,
} from "../controllers/categoryController.js"; // Import controller functions

const router = express.Router();

// ReadMany
router.get("/", getCategories);

// ReadByID
router.get("/:id", getCategoryById);

// Create
router.post("/", createCategory);

// Update
router.patch("/:id", updateCategory);

// Soft Delete
router.delete("/:id", softDeleteCategory);

export default router;
