import * as flashcardService from "../services/flashcardService.js";

// GET /api/flashcards?subjectId=&deckId=&difficulty=
export const getFlashcards = async (req, res, next) => {
  try {
    const { subjectId, deckId, difficulty } = req.query;
    const flashcards = await flashcardService.listFlashcards({ subjectId, deckId, difficulty });
    return res.status(200).json({ success: true, count: flashcards.length, flashcards });
  } catch (error) {
    next(error);
  }
};

// GET /api/flashcards/:id
export const getFlashcardById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid flashcard ID" });
    }
    const flashcard = await flashcardService.getFlashcardById(id);
    return res.status(200).json({ success: true, flashcard });
  } catch (error) {
    next(error);
  }
};

// POST /api/flashcards
export const createFlashcard = async (req, res, next) => {
  try {
    const { deckId, frontText, backText } = req.body;
    if (!deckId || !frontText || !backText) {
      return res.status(400).json({
        success: false,
        message: "Please provide deckId, frontText, and backText",
      });
    }
    const flashcard = await flashcardService.createFlashcard(req.body);
    return res.status(201).json({ success: true, message: "Flashcard created successfully", flashcard });
  } catch (error) {
    next(error);
  }
};

// PUT /api/flashcards/:id
export const updateFlashcard = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid flashcard ID" });
    }
    const flashcard = await flashcardService.updateFlashcard(id, req.body);
    return res.status(200).json({ success: true, message: "Flashcard updated successfully", flashcard });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/flashcards/:id
export const deleteFlashcard = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid flashcard ID" });
    }
    await flashcardService.removeFlashcard(id);
    return res.status(200).json({ success: true, message: "Flashcard deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// GET /api/flashcards/decks?subjectId=
export const getFlashcardDecks = async (req, res, next) => {
  try {
    const { subjectId } = req.query;
    const decks = await flashcardService.listDecks({ subjectId });
    return res.status(200).json({ success: true, count: decks.length, decks });
  } catch (error) {
    next(error);
  }
};

// POST /api/flashcards/decks
export const createFlashcardDeck = async (req, res, next) => {
  try {
    const { subjectId, title } = req.body;
    if (!subjectId || !title) {
      return res.status(400).json({ success: false, message: "Please provide subjectId and title" });
    }
    const deck = await flashcardService.createDeck(req.body);
    return res.status(201).json({ success: true, message: "Flashcard deck created successfully", deck });
  } catch (error) {
    next(error);
  }
};

// PUT /api/flashcards/decks/:id
export const updateFlashcardDeck = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid deck ID" });
    }
    const deck = await flashcardService.updateDeck(id, req.body);
    return res.status(200).json({ success: true, message: "Flashcard deck updated successfully", deck });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/flashcards/decks/:id
export const deleteFlashcardDeck = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid deck ID" });
    }
    await flashcardService.removeDeck(id);
    return res.status(200).json({ success: true, message: "Flashcard deck deleted successfully" });
  } catch (error) {
    next(error);
  }
};
