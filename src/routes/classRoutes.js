// routes/classRoutes.js
import express from "express";
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  softDeleteClass,
} from "../controllers/classController.js"; // Import controller functions

const router = express.Router();

// ReadMany
router.get("/", getClasses);

// ReadByID
router.get("/:id", getClassById);

// Create
router.post("/", createClass);

// Update
router.patch("/:id", updateClass);

// Soft Delete
router.delete("/:id", softDeleteClass);

export default router;
