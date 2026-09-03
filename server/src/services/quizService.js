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
