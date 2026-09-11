import { Router } from "express";
import {
  getFlashcards,
  getFlashcardById,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  getFlashcardDecks,
  createFlashcardDeck,
  updateFlashcardDeck,
  deleteFlashcardDeck,
} from "../controllers/flashcardController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = Router();

// Read operations are public; write operations require admin authentication
router.route("/decks")
  .get(getFlashcardDecks)
  .post(protect, admin, createFlashcardDeck);

router.route("/decks/:id")
  .put(protect, admin, updateFlashcardDeck)
  .delete(protect, admin, deleteFlashcardDeck);

router.route("/")
  .get(getFlashcards)
  .post(protect, admin, createFlashcard);

router.route("/:id")
  .get(getFlashcardById)
  .put(protect, admin, updateFlashcard)
  .delete(protect, admin, deleteFlashcard);

export default router;
