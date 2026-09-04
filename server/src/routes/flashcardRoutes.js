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

// Users must be logged in to view/manage flashcards
router.use(protect);

router.route("/decks")
  .get(getFlashcardDecks)
  .post(admin, createFlashcardDeck);

router.route("/decks/:id")
  .put(admin, updateFlashcardDeck)
  .delete(admin, deleteFlashcardDeck);

router.route("/")
  .get(getFlashcards)
  .post(admin, createFlashcard);

router.route("/:id")
  .get(getFlashcardById)
  .put(admin, updateFlashcard)
  .delete(admin, deleteFlashcard);

export default router;
