import { prisma } from "../config/prisma.js";

/**
 * Read side of weakness tracking. The write side (WeakArea upsert/clear per
 * graded attempt) already lives in weaknessAnalysisService.js — this just
 * exposes what's been accumulated there to the candidate.
 */
export const getWeakAreasForUser = async (userId) => {
  const weakAreas = await prisma.weakArea.findMany({
    // Resolved rows are kept for re-testing (see weaknessAnalysisService) but
    // are no longer weaknesses — showing them here would tell a candidate who
    // fixed a topic that they still haven't.
    where: { userId, status: "open" },
    orderBy: [{ priority: "asc" }, { accuracyRate: "asc" }],
    include: {
      topic: { include: { subject: { select: { subjectId: true, subjectName: true } } } },
      actionQuiz: { select: { quizId: true, title: true } },
    },
  });

  return weakAreas.map((w) => ({
    weakAreaId: w.weakAreaId,
    topicId: w.topicId,
    topicName: w.topic?.topicName ?? null,
    subjectId: w.topic?.subjectId ?? null,
    subjectName: w.topic?.subject?.subjectName ?? null,
    severityLevel: w.severityLevel,
    priority: w.priority,
    accuracyRate: w.accuracyRate !== null ? Number(w.accuracyRate) : null,
    failedQuestionsCount: w.failedQuestionsCount,
    recommendation: w.recommendation,
    actionQuizId: w.actionQuizId,
    actionQuizTitle: w.actionQuiz?.title ?? null,
    actionReadTopicId: w.actionReadTopicId,
    identifiedDate: w.identifiedDate,
  }));
};

/**
 * Resolved weak areas whose re-test is now due — topics the candidate fixed
 * a while ago and hasn't confirmed since. The course generator pulls these in
 * so a closed gap gets verified rather than assumed.
 */
export const getDueRetestsForUser = async (userId, now = new Date()) => {
  return prisma.weakArea.findMany({
    where: { userId, status: "resolved", nextReviewAt: { lte: now } },
    orderBy: [{ nextReviewAt: "asc" }],
    include: { topic: { include: { subject: { select: { subjectId: true, subjectName: true } } } } },
  });
};

/** Grouped by subject, for a "weakest subjects" summary view. */
export const getWeaknessSummaryForUser = async (userId) => {
  const weakAreas = await getWeakAreasForUser(userId);

  const bySubject = new Map();
  for (const w of weakAreas) {
    const key = w.subjectId ?? 0;
    if (!bySubject.has(key)) {
      bySubject.set(key, {
        subjectId: w.subjectId,
        subjectName: w.subjectName,
        weakTopicsCount: 0,
        averageAccuracy: 0,
        _accuracySum: 0,
        _accuracyCount: 0,
      });
    }
    const entry = bySubject.get(key);
    entry.weakTopicsCount += 1;
    if (w.accuracyRate !== null) {
      entry._accuracySum += w.accuracyRate;
      entry._accuracyCount += 1;
    }
  }

  const subjects = Array.from(bySubject.values()).map((entry) => ({
    subjectId: entry.subjectId,
    subjectName: entry.subjectName,
    weakTopicsCount: entry.weakTopicsCount,
    averageAccuracy: entry._accuracyCount ? Math.round(entry._accuracySum / entry._accuracyCount) : null,
  }));

  return {
    totalWeakTopics: weakAreas.length,
    highPriorityCount: weakAreas.filter((w) => w.priority === "high").length,
    subjects,
  };
};
