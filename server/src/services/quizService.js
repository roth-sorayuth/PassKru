import { prisma } from "../config/prisma.js";

/**
 * Read side of quiz/mock-exam taking.
 *
 * The "ForTaking" shapes deliberately strip `isCorrect` off every answer
 * option: the client renders these directly, so shipping the answer key with
 * the questions would make the quiz self-defeating. Grading happens server
 * side in scoringService against the DB rows instead.
 */

function toTakingQuestion(question, order) {
  return {
    questionId: question.questionId,
    topicId: question.topicId,
    topicName: question.topic?.topicName ?? null,
    subjectId: question.topic?.subjectId ?? null,
    questionText: question.questionText,
    questionType: question.questionType,
    difficultyLevel: question.difficultyLevel,
    questionOrder: order,
    options: (question.answerOptions || []).map((o) => ({
      optionId: o.optionId,
      optionText: o.optionText,
    })),
  };
}

export const listQuizzes = async ({ subjectId, examId } = {}) => {
  const where = {};
  if (subjectId) where.subjectId = Number(subjectId);
  if (examId) where.subject = { examId: Number(examId) };

  const quizzes = await prisma.quiz.findMany({
    where,
    orderBy: { quizId: "asc" },
    include: {
      subject: { select: { subjectId: true, subjectName: true, examId: true } },
      _count: { select: { quizQuestions: true } },
    },
  });

  return quizzes.map((q) => ({
    quizId: q.quizId,
    title: q.title,
    difficultyLevel: q.difficultyLevel,
    durationMinutes: q.durationMinutes,
    subjectId: q.subjectId,
    subjectName: q.subject?.subjectName ?? null,
    examId: q.subject?.examId ?? null,
    totalQuestions: q._count.quizQuestions,
  }));
};

export const getQuizForTaking = async (quizId) => {
  const quiz = await prisma.quiz.findUnique({
    where: { quizId: Number(quizId) },
    include: {
      subject: { select: { subjectId: true, subjectName: true, examId: true } },
      quizQuestions: {
        orderBy: [{ questionOrder: "asc" }, { quizQuestionId: "asc" }],
        include: {
          question: {
            include: {
              answerOptions: { orderBy: { optionId: "asc" } },
              topic: { select: { topicId: true, topicName: true, subjectId: true } },
            },
          },
        },
      },
    },
  });

  if (!quiz) {
    const error = new Error(`Quiz ${quizId} not found`);
    error.statusCode = 404;
    throw error;
  }

  const questions = quiz.quizQuestions
    .filter((qq) => qq.question)
    .map((qq, idx) => toTakingQuestion(qq.question, qq.questionOrder ?? idx + 1));

  return {
    quizId: quiz.quizId,
    title: quiz.title,
    difficultyLevel: quiz.difficultyLevel,
    durationMinutes: quiz.durationMinutes,
    subjectId: quiz.subjectId,
    subjectName: quiz.subject?.subjectName ?? null,
    examId: quiz.subject?.examId ?? null,
    totalQuestions: questions.length,
    questions,
  };
};

export const listMockExams = async ({ examId } = {}) => {
  const where = {};
  if (examId) where.examId = Number(examId);

  const mockExams = await prisma.mockExam.findMany({
    where,
    orderBy: { mockExamId: "asc" },
    include: {
      exam: { select: { examId: true, examName: true, targetCode: true } },
      mockExamSections: { select: { sectionId: true, numberOfQuestions: true } },
    },
  });

  return mockExams.map((m) => ({
    mockExamId: m.mockExamId,
    title: m.title,
    description: m.description,
    year: m.year,
    durationMinutes: m.durationMinutes,
    totalMarks: m.totalMarks !== null ? Number(m.totalMarks) : null,
    passingMarks: m.passingMarks !== null ? Number(m.passingMarks) : null,
    examId: m.examId,
    examName: m.exam?.examName ?? null,
    totalQuestions: m.mockExamSections.reduce((sum, s) => sum + (s.numberOfQuestions || 0), 0),
  }));
};

export const getMockExamForTaking = async (mockExamId) => {
  const mockExam = await prisma.mockExam.findUnique({
    where: { mockExamId: Number(mockExamId) },
    include: {
      exam: { select: { examId: true, examName: true } },
      mockExamSections: {
        orderBy: { sectionId: "asc" },
        include: {
          subject: { select: { subjectId: true, subjectName: true } },
          mockExamQuestions: {
            orderBy: [{ questionOrder: "asc" }, { mockExamQuestionId: "asc" }],
            include: {
              question: {
                include: {
                  answerOptions: { orderBy: { optionId: "asc" } },
                  topic: { select: { topicId: true, topicName: true, subjectId: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!mockExam) {
    const error = new Error(`Mock exam ${mockExamId} not found`);
    error.statusCode = 404;
    throw error;
  }

  let running = 0;
  const sections = mockExam.mockExamSections.map((section) => {
    const questions = section.mockExamQuestions
      .filter((mq) => mq.question)
      .map((mq) => toTakingQuestion(mq.question, ++running));
    return {
      sectionId: section.sectionId,
      subjectId: section.subjectId,
      subjectName: section.subject?.subjectName ?? null,
      questions,
    };
  });

  return {
    mockExamId: mockExam.mockExamId,
    title: mockExam.title,
    description: mockExam.description,
    durationMinutes: mockExam.durationMinutes,
    totalMarks: mockExam.totalMarks !== null ? Number(mockExam.totalMarks) : null,
    passingMarks: mockExam.passingMarks !== null ? Number(mockExam.passingMarks) : null,
    examId: mockExam.examId,
    examName: mockExam.exam?.examName ?? null,
    sections,
    totalQuestions: running,
  };
};

// ---------------------------------------------------------------------------
// Admin write side (quiz builder)
// ---------------------------------------------------------------------------

export const createQuiz = async (data) => {
  const subjectId = Number(data.subjectId);
  const subjectExists = await prisma.subject.findUnique({ where: { subjectId } });
  if (!subjectExists) {
    const error = new Error(`Subject with ID ${subjectId} not found`);
    error.statusCode = 404;
    throw error;
  }

  return await prisma.quiz.create({
    data: {
      subjectId,
      title: data.title,
      difficultyLevel: data.difficultyLevel || null,
      durationMinutes: data.durationMinutes !== undefined && data.durationMinutes !== null
        ? Number(data.durationMinutes)
        : null,
    },
  });
};

export const updateQuiz = async (quizId, data) => {
  const quizExists = await prisma.quiz.findUnique({ where: { quizId } });
  if (!quizExists) {
    const error = new Error(`Quiz ${quizId} not found`);
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};
  if (data.subjectId !== undefined) updateData.subjectId = Number(data.subjectId);
  if (data.title !== undefined) updateData.title = data.title;
  if (data.difficultyLevel !== undefined) updateData.difficultyLevel = data.difficultyLevel || null;
  if (data.durationMinutes !== undefined) {
    updateData.durationMinutes = data.durationMinutes !== null ? Number(data.durationMinutes) : null;
  }

  return await prisma.quiz.update({ where: { quizId }, data: updateData });
};

export const removeQuiz = async (quizId) => {
  const quizExists = await prisma.quiz.findUnique({ where: { quizId } });
  if (!quizExists) {
    const error = new Error(`Quiz ${quizId} not found`);
    error.statusCode = 404;
    throw error;
  }

  await prisma.quiz.delete({ where: { quizId } });
  return true;
};

/** Replaces a quiz's full question list, in the given order. */
export const setQuizQuestions = async (quizId, questionIds) => {
  const quizExists = await prisma.quiz.findUnique({ where: { quizId } });
  if (!quizExists) {
    const error = new Error(`Quiz ${quizId} not found`);
    error.statusCode = 404;
    throw error;
  }

  const ids = (questionIds || []).map((id) => Number(id));

  await prisma.$transaction([
    prisma.quizQuestion.deleteMany({ where: { quizId } }),
    ...(ids.length
      ? [
          prisma.quizQuestion.createMany({
            data: ids.map((questionId, idx) => ({ quizId, questionId, questionOrder: idx + 1 })),
          }),
        ]
      : []),
  ]);

  return getQuizForTaking(quizId);
};

/** Every question (with its answer key) behind a quiz — grading use only. */
export const getQuizQuestionsWithAnswers = async (quizId) => {
  const rows = await prisma.quizQuestion.findMany({
    where: { quizId: Number(quizId) },
    include: { question: { include: { answerOptions: true } } },
  });
  return rows.map((r) => r.question).filter(Boolean);
};

/** Every question (with its answer key) behind a mock exam — grading use only. */
export const getMockExamQuestionsWithAnswers = async (mockExamId) => {
  const rows = await prisma.mockExamQuestion.findMany({
    where: { section: { mockExamId: Number(mockExamId) } },
    include: { question: { include: { answerOptions: true } } },
  });
  return rows.map((r) => r.question).filter(Boolean);
};

// ---------------------------------------------------------------------------
// Admin write side (mock exam builder)
// ---------------------------------------------------------------------------

export const createMockExam = async (data) => {
  const examId = Number(data.examId);
  const examExists = await prisma.exam.findUnique({ where: { examId } });
  if (!examExists) {
    const error = new Error(`Exam with ID ${examId} not found`);
    error.statusCode = 404;
    throw error;
  }

  return await prisma.mockExam.create({
    data: {
      examId,
      title: data.title,
      description: data.description || null,
      year: data.year !== undefined && data.year !== null ? Number(data.year) : null,
      durationMinutes: data.durationMinutes !== undefined && data.durationMinutes !== null
        ? Number(data.durationMinutes)
        : null,
      totalMarks: data.totalMarks !== undefined && data.totalMarks !== null ? Number(data.totalMarks) : null,
      passingMarks: data.passingMarks !== undefined && data.passingMarks !== null
        ? Number(data.passingMarks)
        : null,
      instructions: data.instructions !== undefined ? data.instructions : undefined,
    },
  });
};

export const updateMockExam = async (mockExamId, data) => {
  const examExists = await prisma.mockExam.findUnique({ where: { mockExamId } });
  if (!examExists) {
    const error = new Error(`Mock exam ${mockExamId} not found`);
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};
  if (data.examId !== undefined) updateData.examId = Number(data.examId);
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description || null;
  if (data.year !== undefined) updateData.year = data.year !== null ? Number(data.year) : null;
  if (data.durationMinutes !== undefined) {
    updateData.durationMinutes = data.durationMinutes !== null ? Number(data.durationMinutes) : null;
  }
  if (data.totalMarks !== undefined) {
    updateData.totalMarks = data.totalMarks !== null ? Number(data.totalMarks) : null;
  }
  if (data.passingMarks !== undefined) {
    updateData.passingMarks = data.passingMarks !== null ? Number(data.passingMarks) : null;
  }
  if (data.instructions !== undefined) updateData.instructions = data.instructions;

  return await prisma.mockExam.update({ where: { mockExamId }, data: updateData });
};

export const removeMockExam = async (mockExamId) => {
  const examExists = await prisma.mockExam.findUnique({ where: { mockExamId } });
  if (!examExists) {
    const error = new Error(`Mock exam ${mockExamId} not found`);
    error.statusCode = 404;
    throw error;
  }

  await prisma.mockExam.delete({ where: { mockExamId } });
  return true;
};

export const addMockExamSection = async (mockExamId, data) => {
  const examExists = await prisma.mockExam.findUnique({ where: { mockExamId } });
  if (!examExists) {
    const error = new Error(`Mock exam ${mockExamId} not found`);
    error.statusCode = 404;
    throw error;
  }

  const subjectId = Number(data.subjectId);
  const subjectExists = await prisma.subject.findUnique({ where: { subjectId } });
  if (!subjectExists) {
    const error = new Error(`Subject with ID ${subjectId} not found`);
    error.statusCode = 404;
    throw error;
  }

  return await prisma.mockExamSection.create({
    data: {
      mockExamId,
      subjectId,
      numberOfQuestions: data.numberOfQuestions !== undefined ? Number(data.numberOfQuestions) : 0,
    },
  });
};

export const updateMockExamSection = async (sectionId, data) => {
  const sectionExists = await prisma.mockExamSection.findUnique({ where: { sectionId } });
  if (!sectionExists) {
    const error = new Error(`Mock exam section ${sectionId} not found`);
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};
  if (data.numberOfQuestions !== undefined) updateData.numberOfQuestions = Number(data.numberOfQuestions);

  return await prisma.mockExamSection.update({ where: { sectionId }, data: updateData });
};

export const removeMockExamSection = async (sectionId) => {
  const sectionExists = await prisma.mockExamSection.findUnique({ where: { sectionId } });
  if (!sectionExists) {
    const error = new Error(`Mock exam section ${sectionId} not found`);
    error.statusCode = 404;
    throw error;
  }

  await prisma.mockExamSection.delete({ where: { sectionId } });
  return true;
};

/** Replaces a section's full question list, in the given order. */
export const setMockExamSectionQuestions = async (sectionId, questionIds) => {
  const sectionExists = await prisma.mockExamSection.findUnique({ where: { sectionId } });
  if (!sectionExists) {
    const error = new Error(`Mock exam section ${sectionId} not found`);
    error.statusCode = 404;
    throw error;
  }

  const ids = (questionIds || []).map((id) => Number(id));

  await prisma.$transaction([
    prisma.mockExamQuestion.deleteMany({ where: { sectionId } }),
    ...(ids.length
      ? [
          prisma.mockExamQuestion.createMany({
            data: ids.map((questionId, idx) => ({ sectionId, questionId, questionOrder: idx + 1 })),
          }),
        ]
      : []),
    prisma.mockExamSection.update({ where: { sectionId }, data: { numberOfQuestions: ids.length } }),
  ]);

  return prisma.mockExamSection.findUnique({
    where: { sectionId },
    include: { mockExamQuestions: true },
  });
};
