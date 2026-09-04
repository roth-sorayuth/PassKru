import { prisma } from "../config/prisma.js";

function toQuestionDTO(question) {
  return {
    questionId: question.questionId,
    topicId: question.topicId,
    topicName: question.topic?.topicName ?? null,
    subjectId: question.topic?.subjectId ?? null,
    subjectName: question.topic?.subject?.subjectName ?? null,
    questionText: question.questionText,
    questionType: question.questionType,
    difficultyLevel: question.difficultyLevel,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    referenceNote: question.referenceNote,
    options: (question.answerOptions || []).map((o) => ({
      optionId: o.optionId,
      optionText: o.optionText,
      isCorrect: o.isCorrect,
    })),
  };
}

const includeForDTO = {
  topic: { include: { subject: { select: { subjectId: true, subjectName: true } } } },
  answerOptions: { orderBy: { optionId: "asc" } },
};

export const listQuestions = async ({ topicId, subjectId, questionType, difficultyLevel, search } = {}) => {
  const where = {};
  if (topicId) where.topicId = Number(topicId);
  if (subjectId) where.topic = { subjectId: Number(subjectId) };
  if (questionType) where.questionType = questionType;
  if (difficultyLevel) where.difficultyLevel = difficultyLevel;
  if (search) where.questionText = { contains: search, mode: "insensitive" };

  const questions = await prisma.question.findMany({
    where,
    orderBy: { questionId: "desc" },
    include: includeForDTO,
  });

  return questions.map(toQuestionDTO);
};

export const getQuestionById = async (id) => {
  const question = await prisma.question.findUnique({
    where: { questionId: id },
    include: includeForDTO,
  });

  if (!question) {
    const error = new Error(`Question with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  return toQuestionDTO(question);
};

export const createQuestion = async (data) => {
  const topicId = Number(data.topicId);
  const topicExists = await prisma.topic.findUnique({ where: { topicId } });
  if (!topicExists) {
    const error = new Error(`Topic with ID ${topicId} not found`);
    error.statusCode = 404;
    throw error;
  }

  const options = Array.isArray(data.options) ? data.options : [];

  const question = await prisma.question.create({
    data: {
      topicId,
      questionText: data.questionText,
      questionType: data.questionType,
      difficultyLevel: data.difficultyLevel || null,
      correctAnswer: data.correctAnswer || null,
      explanation: data.explanation || null,
      referenceNote: data.referenceNote || null,
      answerOptions: options.length
        ? {
            create: options.map((o) => ({
              optionText: o.optionText,
              isCorrect: Boolean(o.isCorrect),
            })),
          }
        : undefined,
    },
    include: includeForDTO,
  });

  return toQuestionDTO(question);
};

export const updateQuestion = async (id, data) => {
  const questionExists = await prisma.question.findUnique({ where: { questionId: id } });
  if (!questionExists) {
    const error = new Error(`Question with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};
  if (data.topicId !== undefined) updateData.topicId = Number(data.topicId);
  if (data.questionText !== undefined) updateData.questionText = data.questionText;
  if (data.questionType !== undefined) updateData.questionType = data.questionType;
  if (data.difficultyLevel !== undefined) updateData.difficultyLevel = data.difficultyLevel || null;
  if (data.correctAnswer !== undefined) updateData.correctAnswer = data.correctAnswer || null;
  if (data.explanation !== undefined) updateData.explanation = data.explanation || null;
  if (data.referenceNote !== undefined) updateData.referenceNote = data.referenceNote || null;

  // Replacing the full option set is simpler and safer than diffing individual
  // options, and the admin form always submits the complete list anyway.
  if (Array.isArray(data.options)) {
    await prisma.answerOption.deleteMany({ where: { questionId: id } });
    updateData.answerOptions = {
      create: data.options.map((o) => ({
        optionText: o.optionText,
        isCorrect: Boolean(o.isCorrect),
      })),
    };
  }

  const question = await prisma.question.update({
    where: { questionId: id },
    data: updateData,
    include: includeForDTO,
  });

  return toQuestionDTO(question);
};

export const removeQuestion = async (id) => {
  const questionExists = await prisma.question.findUnique({ where: { questionId: id } });
  if (!questionExists) {
    const error = new Error(`Question with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }

  await prisma.question.delete({ where: { questionId: id } });
  return true;
};
