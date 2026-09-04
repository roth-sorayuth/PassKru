import { prisma } from "../config/prisma.js";

function toFlashcardDTO(card) {
  return {
    flashcardId: card.flashcardId,
    deckId: card.deckId,
    category: card.category,
    frontText: card.frontText,
    backText: card.backText,
    hint: card.hint,
    difficulty: card.difficulty,
    deckTitle: card.deck?.title ?? null,
    subjectId: card.deck?.subjectId ?? null,
    subjectName: card.deck?.subject?.subjectName ?? null,
  };
}

export const listFlashcards = async ({ subjectId, deckId, difficulty } = {}) => {
  const where = {};
  if (deckId) where.deckId = Number(deckId);
  if (difficulty) where.difficulty = difficulty;
  if (subjectId) where.deck = { subjectId: Number(subjectId) };

  const cards = await prisma.flashcard.findMany({
    where,
    orderBy: { flashcardId: "asc" },
    include: { deck: { include: { subject: { select: { subjectId: true, subjectName: true } } } } },
  });

  return cards.map(toFlashcardDTO);
};

export const getFlashcardById = async (id) => {
  const card = await prisma.flashcard.findUnique({
    where: { flashcardId: id },
    include: { deck: { include: { subject: { select: { subjectId: true, subjectName: true } } } } },
  });

  if (!card) {
    const error = new Error(`Flashcard with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  return toFlashcardDTO(card);
};

export const createFlashcard = async (data) => {
  const deckId = Number(data.deckId);
  const deckExists = await prisma.flashcardDeck.findUnique({ where: { deckId } });
  if (!deckExists) {
    const error = new Error(`Flashcard deck with ID ${deckId} not found`);
    error.statusCode = 404;
    throw error;
  }

  const card = await prisma.flashcard.create({
    data: {
      deckId,
      category: data.category || null,
      frontText: data.frontText,
      backText: data.backText,
      hint: data.hint || null,
      difficulty: data.difficulty || null,
    },
    include: { deck: { include: { subject: { select: { subjectId: true, subjectName: true } } } } },
  });

  return toFlashcardDTO(card);
};

export const updateFlashcard = async (id, data) => {
  const cardExists = await prisma.flashcard.findUnique({ where: { flashcardId: id } });
  if (!cardExists) {
    const error = new Error(`Flashcard with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};
  if (data.deckId !== undefined) updateData.deckId = Number(data.deckId);
  if (data.category !== undefined) updateData.category = data.category || null;
  if (data.frontText !== undefined) updateData.frontText = data.frontText;
  if (data.backText !== undefined) updateData.backText = data.backText;
  if (data.hint !== undefined) updateData.hint = data.hint || null;
  if (data.difficulty !== undefined) updateData.difficulty = data.difficulty || null;

  const card = await prisma.flashcard.update({
    where: { flashcardId: id },
    data: updateData,
    include: { deck: { include: { subject: { select: { subjectId: true, subjectName: true } } } } },
  });

  return toFlashcardDTO(card);
};

export const removeFlashcard = async (id) => {
  const cardExists = await prisma.flashcard.findUnique({ where: { flashcardId: id } });
  if (!cardExists) {
    const error = new Error(`Flashcard with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  await prisma.flashcard.delete({ where: { flashcardId: id } });
  return true;
};

export const listDecks = async ({ subjectId } = {}) => {
  const where = {};
  if (subjectId) where.subjectId = Number(subjectId);

  const decks = await prisma.flashcardDeck.findMany({
    where,
    orderBy: { deckId: "asc" },
    include: {
      subject: { select: { subjectId: true, subjectName: true } },
      _count: { select: { flashcards: true } },
    },
  });

  return decks.map((d) => ({
    deckId: d.deckId,
    subjectId: d.subjectId,
    subjectName: d.subject?.subjectName ?? null,
    title: d.title,
    description: d.description,
    totalFlashcards: d._count.flashcards,
  }));
};

export const createDeck = async (data) => {
  const subjectId = Number(data.subjectId);
  const subjectExists = await prisma.subject.findUnique({ where: { subjectId } });
  if (!subjectExists) {
    const error = new Error(`Subject with ID ${subjectId} not found`);
    error.statusCode = 404;
    throw error;
  }

  return await prisma.flashcardDeck.create({
    data: {
      subjectId,
      title: data.title,
      description: data.description || null,
    },
  });
};

export const updateDeck = async (id, data) => {
  const deckExists = await prisma.flashcardDeck.findUnique({ where: { deckId: id } });
  if (!deckExists) {
    const error = new Error(`Flashcard deck with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};
  if (data.subjectId !== undefined) updateData.subjectId = Number(data.subjectId);
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description || null;

  return await prisma.flashcardDeck.update({ where: { deckId: id }, data: updateData });
};

export const removeDeck = async (id) => {
  const deckExists = await prisma.flashcardDeck.findUnique({ where: { deckId: id } });
  if (!deckExists) {
    const error = new Error(`Flashcard deck with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  await prisma.flashcardDeck.delete({ where: { deckId: id } });
  return true;
};
