import { prisma } from "../config/prisma.js";
import { getActivePlanForUser } from "./studyPlanService.js";
import { getLearnerScope } from "./learnerScope.js";
import { WEAK_AREA_THRESHOLD } from "./scoringService.js";

/**
 * Read side of weakness tracking.
 * Strictly scoped to the candidate's current active study plan.
 * If the candidate has no active study plan, returns empty so old/unrelated tracks
 * never pollute the current study experience.
 */
export const getWeakAreasForUser = async (userId) => {
  const activePlan = await getActivePlanForUser(userId);
  if (!activePlan) return [];

  const scope = await getLearnerScope(userId);
  if (!scope.topicIds || !scope.topicIds.length) return [];

  const weakAreas = await prisma.weakArea.findMany({
    where: {
      userId,
      topicId: { in: scope.topicIds },
    },
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
 * Complete strength and weakness analysis based strictly on the candidate's
 * current active study plan.
 */
export const getWeaknessAnalysisForUser = async (userId) => {
  const activePlan = await getActivePlanForUser(userId);
  if (!activePlan) {
    return {
      hasActivePlan: false,
      plan: null,
      weakAreas: [],
      strengths: [],
      summary: {
        totalWeak: 0,
        highPriority: 0,
        mediumPriority: 0,
        totalStrengths: 0,
        masteredCount: 0,
      },
    };
  }

  const scope = await getLearnerScope(userId);
  const weakAreas = await getWeakAreasForUser(userId);
  const weakTopicIds = new Set(weakAreas.map((w) => w.topicId));

  // Find mastered / strong topics in current study plan (proficiencyScore >= WEAK_AREA_THRESHOLD)
  const progressRecords = scope.topicIds?.length
    ? await prisma.progressRecord.findMany({
        where: { userId, topicId: { in: scope.topicIds } },
        include: {
          topic: { include: { subject: { select: { subjectId: true, subjectName: true } } } },
        },
      })
    : [];

  const subjectIds = [...new Set(progressRecords.map((r) => r.topic?.subjectId).filter(Boolean))];
  const quizzes = subjectIds.length
    ? await prisma.quiz.findMany({
        where: { subjectId: { in: subjectIds } },
        orderBy: { quizId: "asc" },
        select: { quizId: true, subjectId: true, title: true },
      })
    : [];
  const quizBySubject = new Map();
  for (const q of quizzes) {
    if (!quizBySubject.has(q.subjectId)) quizBySubject.set(q.subjectId, q);
  }

  const strengths = progressRecords
    .filter((r) => !weakTopicIds.has(r.topicId) && Number(r.proficiencyScore || 0) >= WEAK_AREA_THRESHOLD)
    .map((r) => {
      const score = Math.round(Number(r.proficiencyScore || 0));
      const actionQuiz = quizBySubject.get(r.topic?.subjectId);
      return {
        topicId: r.topicId,
        topicName: r.topic?.topicName ?? null,
        subjectId: r.topic?.subjectId ?? null,
        subjectName: r.topic?.subject?.subjectName ?? null,
        accuracyRate: score,
        status: "mastered",
        recommendation: `ស្ទាត់ជំនាញ ${score}% លើ «${r.topic?.topicName}» — ល្អណាស់! បន្តរក្សាការអនុវត្តដើម្បីរក្សាភាពស្ទាត់ជំនាញ។`,
        actionQuizId: actionQuiz?.quizId ?? null,
        actionQuizTitle: actionQuiz?.title ?? null,
      };
    })
    .sort((a, b) => b.accuracyRate - a.accuracyRate);

  const targetSubjectNames = (scope.majorLabels || []).map((s) => (typeof s === "string" ? s : s.km || s.key || ""));
  const planInfo = {
    planId: activePlan.planId,
    examCode: scope.examCode,
    examName: scope.examName,
    targetSubjects: targetSubjectNames.length ? targetSubjectNames : scope.keys,
  };

  return {
    hasActivePlan: true,
    plan: planInfo,
    weakAreas,
    strengths,
    summary: {
      totalWeak: weakAreas.length,
      highPriority: weakAreas.filter((w) => w.priority === "high").length,
      mediumPriority: weakAreas.filter((w) => w.priority === "medium").length,
      totalStrengths: strengths.length,
      masteredCount: strengths.length,
    },
  };
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
