import { prisma } from "../config/prisma.js";
import { recomputeUserStats } from "./userStatsService.js";
import { appDayOfWeek, appDayStartInstant, appTodayString, shiftAppDateString } from "../utils/appDate.js";
import { calculateCountdown } from "../utils/timeHelper.js";
import { getActivePlanForUser, reviewWindow, weeklyMistakeRows } from "./studyPlanService.js";
import { getLearnerScope } from "./learnerScope.js";
import { getPlacementStatusForScope } from "./placementService.js";
import { WEAK_AREA_THRESHOLD } from "./scoringService.js";

/**
 * A topic counts as "mastered" on the dashboard at the same bar the rest of
 * the app uses for competence. Anything under WEAK_AREA_THRESHOLD is actively
 * flagged as a weak area, so counting it as mastered would have the dashboard
 * contradict itself.
 */
const MASTERED_THRESHOLD = WEAK_AREA_THRESHOLD;

/** Resolves an exam date out of the free-form Exam.schedules JSON blob, if present. */
function resolveExamDateFromSchedules(schedules) {
  if (!schedules || typeof schedules !== "object") return null;
  const candidateKeys = ["examDate", "examinationDate", "date", "startDate"];
  for (const key of candidateKeys) {
    const value = schedules[key];
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d;
    }
  }
  return null;
}

/* ------------------------------------------------------ dashboard v2 -- */

const countBy = (rows, keyOf) => {
  const counts = new Map();
  for (const row of rows) {
    const key = keyOf(row);
    if (key) counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts].map(([label, count]) => ({ label, count }));
};

/**
 * Fields for the state-driven dashboard (client types/aiStudyPlan.ts →
 * DashboardV2Fields). Only what the page shows: the state, today's tasks,
 * this week's progress, readiness movement, the Saturday mistakes and topic
 * scores. Study history is paged separately (GET /progress/activity).
 */
async function buildDashboardV2({ userId, scope, activePlan, averageScore, overallPercent, progressMap }) {
  const today = appTodayString();
  const dow = appDayOfWeek(today);
  const weekAgoInstant = appDayStartInstant(shiftAppDateString(today, -6));
  const planItems = activePlan?.items?.version === 2 ? activePlan.items : null;

  const [placement, olderScored, contentCounts] = await Promise.all([
    getPlacementStatusForScope(userId, scope),
    // Readiness a week ago: the same score average, over attempts finished before then.
    prisma.attempt.findMany({
      where: { userId, score: { not: null }, endTime: { lt: weekAgoInstant } },
      orderBy: { endTime: "desc" },
      take: 10,
      select: { score: true },
    }),
    Promise.all([
      scope.subjectIds.length ? prisma.quiz.count({ where: { subjectId: { in: scope.subjectIds } } }) : 0,
      scope.examId ? prisma.mockExam.count({ where: { examId: scope.examId } }) : 0,
      scope.subjectIds.length ? prisma.pastPaper.count({ where: { subjectId: { in: scope.subjectIds } } }) : 0,
    ]),
  ]);

  const isNew = placement.status !== "completed";
  const lastPlanDate = planItems?.days?.[planItems.days.length - 1]?.date;
  const state = isNew ? "new" : lastPlanDate && today > lastPlanDate ? "month-end" : dow === 6 ? "saturday" : "weekday";
  const week = planItems?.weeks?.find((w) => today >= w.startDate && today <= w.endDate);

  // This plan week: tasks done so far against everything scheduled for the week.
  let weekProgress = null;
  if (week) {
    const tasks = planItems.days.filter((d) => d.weekIndex === week.weekIndex).flatMap((d) => d.tasks || []);
    weekProgress = {
      weekIndex: week.weekIndex,
      totalWeeks: planItems.weeks.length,
      startDate: week.startDate,
      endDate: week.endDate,
      goal: week.goal,
      done: tasks.filter((t) => t.completed).length,
      total: tasks.length,
    };
  }

  // Saturday: the wrong answers the review will bring back.
  let weeklyMistakes = null;
  if (!isNew && dow === 6) {
    const { weekStart, weekEnd } = reviewWindow(today);
    const rows = await weeklyMistakeRows(userId, weekStart, weekEnd);
    weeklyMistakes = {
      total: rows.length,
      byTopic: countBy(rows, (r) => r.question?.topic?.topicName)
        .sort((a, b) => b.count - a.count)
        .map(({ label, count }) => ({ topicName: label, count })),
    };
  }

  // Topic scores grouped by subject, the candidate's majors before the core subjects.
  const topicScores = [...scope.subjects]
    .sort((a, b) => (a.role === "core") - (b.role === "core"))
    .map((s) => ({
      subjectName: s.subjectName,
      isCore: s.role === "core",
      topics: s.topics
        .filter((t) => progressMap.has(t.topicId))
        .map((t) => ({ topicId: t.topicId, topicName: t.topicName, percent: Math.round(progressMap.get(t.topicId)) })),
    }))
    .filter((g) => g.topics.length);

  // Only the score half of readiness has history; mastery a week ago isn't stored.
  const olderScores = olderScored.map((a) => Number(a.score)).filter((s) => s > 0);
  const readinessNow = Math.min(100, Math.round(averageScore * 0.7 + overallPercent * 0.3));
  const readinessDelta =
    isNew || !olderScores.length
      ? null
      : readinessNow - Math.min(100, Math.round((olderScores.reduce((s, v) => s + v, 0) / olderScores.length) * 0.7 + overallPercent * 0.3));

  const [quizzes, practice, papers] = contentCounts;
  const todayDay = planItems?.days?.find((d) => d.date === today);
  return {
    state,
    weekIndex: week ? week.weekIndex : null,
    weekProgress,
    readinessDelta,
    today: todayDay ? { date: today, dayType: todayDay.dayType, tasks: todayDay.tasks, planId: activePlan.planId } : null,
    weeklyMistakes,
    dailyGoalMinutes: planItems?.dailyGoalMinutes || scope.user.dailyGoalMinutes,
    topicScores,
    contentAvailable: scope.examId ? { quizzes, practice, papers } : null,
  };
}

/**
 * The dashboard: only what the page shows. Readiness, topics mastered, the
 * streak and the exam countdown, plus the state-driven fields above. The study
 * history is served separately and paged (GET /progress/activity).
 */
export const getDashboardSummary = async (userId) => {
  const [scope, stats, activePlan] = await Promise.all([
    getLearnerScope(userId),
    recomputeUserStats(userId),
    // Goes through the plan service so a due weekly update is applied first.
    getActivePlanForUser(userId),
  ]);

  // Subjects are the candidate's own (major(s) + core, or every subject for a
  // generalist track), the same set the plan and placement test use.
  const targetExam = scope.user.targetExam;
  const allTopicIds = scope.topicIds;

  const [progressRecords, recentScored] = await Promise.all([
    allTopicIds.length ? prisma.progressRecord.findMany({ where: { userId, topicId: { in: allTopicIds } } }) : [],
    prisma.attempt.findMany({
      where: { userId, score: { not: null }, endTime: { not: null } },
      orderBy: { endTime: "desc" },
      take: 10,
      select: { score: true },
    }),
  ]);

  // Exam countdown — only when a real date is known; no fabricated fallback.
  let examDate = null;
  if (activePlan?.items?.examDate) {
    const d = new Date(activePlan.items.examDate);
    if (!isNaN(d.getTime())) examDate = d;
  }
  if (!examDate) examDate = resolveExamDateFromSchedules(targetExam?.schedules);
  const countdown = examDate ? calculateCountdown(examDate) : null;

  // Topic mastery (threshold-based).
  const progressMap = new Map(progressRecords.map((p) => [p.topicId, Number(p.proficiencyScore || 0)]));
  const totalLessons = allTopicIds.length;
  const completedLessons = allTopicIds.filter((id) => (progressMap.get(id) || 0) >= MASTERED_THRESHOLD).length;
  const overallPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Exam readiness: recent scores (70%) and topic mastery (30%).
  const recentScores = recentScored.map((a) => Number(a.score)).filter((s) => !isNaN(s) && s > 0);
  const averageScore = recentScores.length
    ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length)
    : Math.round(Number(stats.averageScore) || 0);
  const readinessScore = Math.min(100, Math.round(averageScore * 0.7 + overallPercent * 0.3));
  let readinessStatus = "ត្រូវការការខិតខំបន្ថែម";
  let readinessStatusEn = "Needs more work";
  if (readinessScore >= 75) {
    readinessStatus = "ឱកាសជាប់ប្រឡងខ្ពស់";
    readinessStatusEn = "Strong chance of passing";
  } else if (readinessScore >= 50) {
    readinessStatus = "ឱកាសជាប់មធ្យម";
    readinessStatusEn = "Moderate chance of passing";
  }

  const v2 = await buildDashboardV2({ userId, scope, activePlan, averageScore, overallPercent, progressMap });

  return {
    ...v2,
    countdown,
    overallProgress: {
      percent: overallPercent,
      lessonsCompleted: completedLessons,
      totalLessons,
      remaining: Math.max(0, 100 - overallPercent),
    },
    examReadiness: {
      score: readinessScore,
      maxScore: 100,
      statusLabel: readinessStatus,
      statusLabelEn: readinessStatusEn,
    },
    averageScore,
    streak: { streakDays: stats.streakDays },
    hasActivePlan: Boolean(activePlan),
  };
};

/** Record or update a user's proficiency score for a topic. Not currently routed. */
export const updateTopicProgress = async (userId, topicId, proficiencyScore) => {
  return prisma.progressRecord.upsert({
    where: { userId_topicId: { userId: Number(userId), topicId: Number(topicId) } },
    update: { proficiencyScore: Number(proficiencyScore), lastUpdated: new Date() },
    create: {
      userId: Number(userId),
      topicId: Number(topicId),
      proficiencyScore: Number(proficiencyScore),
      lastUpdated: new Date(),
    },
  });
};

/** Update a user's target exam. Not currently routed. */
export const updateTargetExam = async (userId, examId) => {
  return prisma.user.update({
    where: { userId: Number(userId) },
    data: { targetExamId: Number(examId) },
  });
};
