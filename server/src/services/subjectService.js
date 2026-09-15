import { prisma } from "../config/prisma.js";
import { getEquivalentSubjectNames } from "./flashcardService.js";

// Utility function to get variations of subject names (e.g., Thai/English, abbreviations)

export const getAll = async (filters = {}) => {
  const where = {};
  if (filters.examId) {
    where.examId = parseInt(filters.examId, 10);
  }
  if (filters.targetExam) {
    where.exam = {
      targetCode: {
        equals: filters.targetExam,
        mode: "insensitive",
      },
    };
  }

  const pastPapersCount = filters.paperType
    ? { where: { paperType: filters.paperType } }
    : true;

  const subjects = await prisma.subject.findMany({
    where,
    orderBy: { subjectId: "asc" },
    include: {
      _count: {
        select: {
          topics: true,
          pastPapers: pastPapersCount,
          quizzes: true,
          flashcardDecks: true,
        },
      },
      exam: true,
      quizzes: {
        select: {
          quizId: true,
          _count: { select: { quizQuestions: true } },
        },
      },
      topics: {
        select: {
          topicId: true,
          topicName: true,
          _count: { select: { questions: true } },
        },
      },
    },
  });

  // Decks are found by subject name as well as id (see flashcardService.listDecks),
  // and many cards sit on decks of a same-named subject row, so count cards that way.
  const deckRows = await prisma.flashcardDeck.findMany({
    select: {
      subjectName: true,
      subject: { select: { subjectName: true } },
      _count: { select: { flashcards: true } },
    },
  });
  const cardsByName = new Map();
  for (const d of deckRows) {
    const name = (d.subjectName || d.subject?.subjectName || "").trim().toLowerCase();
    if (name) cardsByName.set(name, (cardsByName.get(name) || 0) + d._count.flashcards);
  }
  const flashcardCountFor = (subjectName) =>
    [...new Set(getEquivalentSubjectNames(subjectName).map((n) => n.trim().toLowerCase()))]
      .reduce((sum, n) => sum + (cardsByName.get(n) || 0), 0);

  return subjects.map((s) => {
    const quizQuestionCount = s.quizzes
      ? s.quizzes.reduce((sum, q) => sum + (q._count?.quizQuestions || 0), 0)
      : 0;
    const topicQuestionCount = s.topics
      ? s.topics.reduce((sum, t) => sum + (t._count?.questions || 0), 0)
      : 0;
    const totalQuestions = Math.max(quizQuestionCount, topicQuestionCount);

    return {
      subjectId: s.subjectId,
      examId: s.examId,
      subjectName: s.subjectName,
      description: s.description,
      exam: s.exam,
      topics: (s.topics || []).map((t) => t.topicName),
      quizCount: s._count?.quizzes || 0,
      questionCount: totalQuestions,
      // Number of flashcards (not decks) the flashcards page will find for this subject.
      flashcardCount: flashcardCountFor(s.subjectName),
      pastPaperCount: s._count?.pastPapers || 0,
      _count: s._count,
    };
  });
};

export const getById = async (id) => {
  const subject = await prisma.subject.findUnique({
    where: { subjectId: id },
    include: {
      topics: true,
      pastPapers: true,
    },
  });

  if (!subject) {
    const error = new Error(`Subject with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  return subject;
};

export const create = async (data) => {
  let examId = null;
  if (data.examId) {
    examId = parseInt(data.examId, 10);
    const examExists = await prisma.exam.findUnique({
      where: { examId },
    });
    if (!examExists) {
      examId = null;
    }
  }

  // Dedup: check by subjectName (case-insensitive) AND examId together
  // so "Math" in Exam A and "Math" in Exam B are treated as different subjects.
  const existing = await prisma.subject.findFirst({
    where: {
      subjectName: {
        equals: data.subjectName.trim(),
        mode: "insensitive",
      },
      examId: examId ?? null,
    },
  });
  if (existing) {
    return existing;
  }

  return await prisma.subject.create({
    data: {
      examId,
      subjectName: data.subjectName.trim(),
      description: data.description || null,
    },
  });
};

export const update = async (id, data) => {
  const subjectExists = await prisma.subject.findUnique({
    where: { subjectId: id },
  });

  if (!subjectExists) {
    const error = new Error(`Subject with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  if (data.examId !== undefined) {
    const examId = parseInt(data.examId, 10);
    const examExists = await prisma.exam.findUnique({
      where: { examId },
    });

    if (!examExists) {
      const error = new Error(`Exam with ID ${examId} not found`);
      error.statusCode = 404;
      throw error;
    }
  }

  return await prisma.subject.update({
    where: { subjectId: id },
    data: {
      examId: data.examId !== undefined ? parseInt(data.examId, 10) : undefined,
      subjectName: data.subjectName !== undefined ? data.subjectName : undefined,
      description: data.description !== undefined ? data.description : undefined,
    },
  });
};

export const remove = async (id) => {
  const subjectExists = await prisma.subject.findUnique({
    where: { subjectId: id },
  });

  if (!subjectExists) {
    const error = new Error(`Subject with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  await prisma.subject.delete({
    where: { subjectId: id },
  });

  return true;
};
