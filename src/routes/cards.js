import express from "express";

import {
  getAllCards,
  getCardById,
  getMyCards,
  createCard,
  updateCard,
  deleteCard,
  likeCard,
} from "../controllers/cardsController.js";

import { auth, businessOnly } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllCards);

// Private routes
router.get("/my-cards", auth, getMyCards);
router.post("/", auth, businessOnly, createCard);
router.put("/:id", auth, updateCard);
router.delete("/:id", auth, deleteCard);
router.patch("/:id", auth, likeCard);

// Must be last
router.get("/:id", getCardById);

export default router;