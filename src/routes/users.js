import express from "express";

import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  getMe,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js";

import { auth, adminOnly } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.post("/", registerUser);
router.post("/login", loginUser);

// Logged-in user
router.get("/me", auth, getMe);

// Admin routes
router.get("/", auth, adminOnly, getAllUsers);

// User by id
router.get("/:id", auth, getUserById);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, adminOnly, deleteUser);

export default router;