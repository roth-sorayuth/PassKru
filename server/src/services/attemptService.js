import { prisma } from "../config/prisma.js";
import { gradeSubmission, computeProficiency } from "./scoringService.js";
import { getQuizQuestionsWithAnswers, getMockExamQuestionsWithAnswers } from "./quizService.js";
import { refreshWeakAreasFromAttempt } from "./weaknessAnalysisService.js";
import { recomputeUserStats } from "./userStatsService.js";

/**
 * Attempt lifecycle: start → submit → graded, persisted, and fed back into
 * the candidate's proficiency and weak areas.
 *
 * Submitting is what closes the course loop — before this existed, taking a
 * quiz changed nothing, so the generator's mastery gating and weak-area
 * ordering had no data to work from.
 */

const ATTEMPT_TYPES = ["quiz", "mock-exam"];

export const startAttempt = async (userId, { attemptType, quizId, mockExamId }) => {
  if (!ATTEMPT_TYPES.includes(attemptType)) {
    const error = new Error(`attemptType must be one of: ${ATTEMPT_TYPES.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }
  if (attemptType === "quiz" && !quizId) {
    const error = new Error("quizId is required for a quiz attempt");
    error.statusCode = 400;
    throw error;
  }
  if (attemptType === "mock-exam" && !mockExamId) {
    const error = new Error("mockExamId is required for a mock-exam attempt");
    error.statusCode = 400;
    throw error;
  }

  // Confirm the target exists before opening an attempt against it, so a bad
  // id fails here rather than at submit time with a half-finished attempt.
  if (attemptType === "quiz") {
    const quiz = await prisma.quiz.findUnique({ where: { quizId: Number(quizId) }, select: { quizId: true } });
    if (!quiz) {
      const error = new Error(`Quiz ${quizId} not found`);
      error.statusCode = 404;
      throw error;
    }
  } else {
    const mock = await prisma.mockExam.findUnique({
      where: { mockExamId: Number(mockExamId) },
      select: { mockExamId: true },
    });
    if (!mock) {
      const error = new Error(`Mock exam ${mockExamId} not found`);
      error.statusCode = 404;
      throw error;
    }
  }

  return prisma.attempt.create({
    data: {
      userId,
      attemptType,
      quizId: attemptType === "quiz" ? Number(quizId) : null,
      mockExamId: attemptType === "mock-exam" ? Number(mockExamId) : null,
      startTime: new Date(),
    },
  });
};

/**
 * Grades a submission, persists it, then updates the candidate's proficiency
 * per topic and refreshes their weak areas.
 *
 * Answers are graded against the DB's answer key (never the client's claim of
 * correctness), and a re-submit of an already-scored attempt is rejected so a
 * candidate can't retry the same attempt until they like the score.
 */
export const submitAttempt = async (userId, attemptId, answers) => {
  const attempt = await prisma.attempt.findUnique({ where: { attemptId: Number(attemptId) } });

  if (!attempt || attempt.userId !== userId) {
    const error = new Error("Attempt not found");
    error.statusCode = 404;
    throw error;
  }
  if (attempt.endTime) {
    const error = new Error("This attempt has already been submitted");
    error.statusCode = 400;
    throw error;
  }

  const questions =
    attempt.attemptType === "quiz"
      ? await getQuizQuestionsWithAnswers(attempt.quizId)
      : await getMockExamQuestionsWithAnswers(attempt.mockExamId);

  if (!questions.length) {
    const error = new Error("This quiz has no questions yet");
    error.statusCode = 400;
    throw error;
  }

  const { gradedAnswers, topicStats, correctCount, totalQuestions, score } = gradeSubmission(questions, answers);

  const endTime = new Date();
  await prisma.$transaction([
    prisma.attemptAnswer.deleteMany({ where: { attemptId: attempt.attemptId } }),
    prisma.attemptAnswer.createMany({
      data: gradedAnswers.map((a) => ({
        attemptId: attempt.attemptId,
        questionId: a.questionId,
        selectedOptionId: a.selectedOptionId,
        isCorrect: a.isCorrect,
      })),
    }),
    prisma.attempt.update({
      where: { attemptId: attempt.attemptId },
      data: { score, endTime },
    }),
  ]);

  const proficiencyUpdates = await applyProficiencyUpdates(userId, topicStats);
  const weakAreaChanges = await refreshWeakAreasFromAttempt(userId, topicStats);
  const completedTask = await completeMatchingCourseTask(userId, attempt);

  // Cached streak/average/study-hours counters feed the dashboard; refresh
  // them now rather than making the candidate's next page load pay for it.
  recomputeUserStats(userId).catch((err) =>
    console.error("Failed to recompute user stats after attempt submit:", err)
  );

  return {
    attemptId: attempt.attemptId,
    attemptType: attempt.attemptType,
    score,
    correctCount,
    totalQuestions,
    startTime: attempt.startTime,
    endTime,
    topicStats,
    proficiencyUpdates,
    weakAreaChanges,
    completedTask,
    answers: gradedAnswers,
  };
};

/**
 * Ticks off the course task that sent the candidate here.
 *
 * Without this, finishing a quiz launched from the course left its task still
 * showing as to-do, so the course never registered work the candidate had
 * actually done. Only the first matching incomplete task is closed — a quiz
 * can legitimately appear on several days, and each sitting should clear one.
 */
async function completeMatchingCourseTask(userId, attempt) {
  const plan = await prisma.studyPlan.findFirst({
    where: { userId, status: "active" },
    orderBy: { planId: "desc" },
  });
  if (!plan?.items?.days) return null;

  const matches = (task) =>
    !task.completed &&
    (attempt.attemptType === "quiz"
      ? task.quizId === attempt.quizId
      : task.mockExamId === attempt.mockExamId);

  let closed = null;
  const days = plan.items.days.map((day) => ({
    ...day,
    tasks: (day.tasks || []).map((task) => {
      if (closed || !matches(task)) return task;
      closed = { id: task.id, title: task.title };
      return { ...task, completed: true, completedAt: new Date().toISOString() };
    }),
  }));

  if (!closed) return null;

  await prisma.studyPlan.update({
    where: { planId: plan.planId },
    data: { items: { ...plan.items, days } },
  });
  return closed;
}

/**
 * Blends each topic's accuracy from this attempt into its stored proficiency
 * (see scoringService.computeProficiency for why it's blended, not replaced).
 */
async function applyProficiencyUpdates(userId, topicStats) {
  const topicIds = topicStats.map((t) => t.topicId).filter((id) => id != null);
  if (!topicIds.length) return [];

  const existing = await prisma.progressRecord.findMany({
    where: { userId, topicId: { in: topicIds } },
    select: { topicId: true, proficiencyScore: true },
  });
  const previousByTopic = new Map(existing.map((r) => [r.topicId, r.proficiencyScore]));

  const updates = [];
  for (const stat of topicStats) {
    if (stat.topicId == null) continue;
    const previous = previousByTopic.has(stat.topicId) ? Number(previousByTopic.get(stat.topicId)) : null;
    const proficiencyScore = computeProficiency(previous, stat.accuracy);

    await prisma.progressRecord.upsert({
      where: { userId_topicId: { userId, topicId: stat.topicId } },
      update: { proficiencyScore, lastUpdated: new Date() },
      create: { userId, topicId: stat.topicId, proficiencyScore, lastUpdated: new Date() },
    });

    updates.push({ topicId: stat.topicId, previous, accuracy: stat.accuracy, proficiencyScore });
  }
  return updates;
}

/** A graded attempt with its per-question breakdown, for the results screen. */
export const getAttemptResult = async (userId, attemptId) => {
  const attempt = await prisma.attempt.findUnique({
    where: { attemptId: Number(attemptId) },
    include: {
      quiz: { select: { title: true } },
      mockExam: { select: { title: true } },
      attemptAnswers: {
        include: {
          question: {
            select: {
              questionId: true,
              questionText: true,
              explanation: true,
              topic: { select: { topicId: true, topicName: true } },
              answerOptions: { select: { optionId: true, optionText: true, isCorrect: true } },
            },
          },
        },
      },
    },
  });

  if (!attempt || attempt.userId !== userId) {
    const error = new Error("Attempt not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    attemptId: attempt.attemptId,
    attemptType: attempt.attemptType,
    title: attempt.quiz?.title || attempt.mockExam?.title || "Attempt",
    score: attempt.score !== null ? Number(attempt.score) : null,
    startTime: attempt.startTime,
    endTime: attempt.endTime,
    // Once an attempt is graded the answer key is no longer a secret — the
    // candidate needs it to learn from the result.
    answers: attempt.attemptAnswers.map((a) => ({
      questionId: a.questionId,
      questionText: a.question?.questionText ?? "",
      topicName: a.question?.topic?.topicName ?? null,
      explanation: a.question?.explanation ?? null,
      selectedOptionId: a.selectedOptionId,
      isCorrect: a.isCorrect,
      options: (a.question?.answerOptions || []).map((o) => ({
        optionId: o.optionId,
        optionText: o.optionText,
        isCorrect: o.isCorrect,
      })),
    })),
  };
};

export const listUserAttempts = async (userId, { limit = 20 } = {}) => {
  const attempts = await prisma.attempt.findMany({
    where: { userId },
    orderBy: { startTime: "desc" },
    take: limit,
    include: { quiz: { select: { title: true } }, mockExam: { select: { title: true } } },
  });

  return attempts.map((a) => ({
    attemptId: a.attemptId,
    attemptType: a.attemptType,
    title: a.quiz?.title || a.mockExam?.title || "Attempt",
    score: a.score !== null ? Number(a.score) : null,
    startTime: a.startTime,
    endTime: a.endTime,
    completed: Boolean(a.endTime),
  }));
};
