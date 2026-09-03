import { prisma } from "../config/prisma.js";
import { recomputeUserStats } from "./userStatsService.js";
import { appTodayString, shiftAppDateString, toAppDateString } from "../utils/appDate.js";
import { calculateCountdown } from "../utils/timeHelper.js";
import { rankNextUp } from "./studyPlanService.js";

const DEFAULT_SUBJECT_COLORS = [
  "#0a3263", // Deep navy
  "#5c3818", // Rich brown/amber
  "#0d7652", // Forest emerald
  "#d97706", // Warm amber
  "#4f46e5", // Indigo
  "#0284c7", // Sky blue
];

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

/**
 * This week's average attempt score vs. the prior week's, both drawn from the
 * same recent-attempts page already fetched for the readiness score — good
 * enough for a directional "+N% this week" badge without a second query.
 * Returns 0 (no badge movement) whenever either week has no scored attempts.
 */
function computeWeeklyScoreChange(attempts) {
  const today = appTodayString();
  const weekAgo = shiftAppDateString(today, -7);
  const twoWeeksAgo = shiftAppDateString(today, -14);

  const thisWeekScores = [];
  const lastWeekScores = [];
  for (const a of attempts) {
    if (a.score === null || a.score === undefined || !a.startTime) continue;
    const dateStr = toAppDateString(a.startTime);
    if (!dateStr) continue;
    const score = Number(a.score);
    if (dateStr >= weekAgo && dateStr <= today) thisWeekScores.push(score);
    else if (dateStr >= twoWeeksAgo && dateStr < weekAgo) lastWeekScores.push(score);
  }

  if (!thisWeekScores.length || !lastWeekScores.length) return 0;
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.round(avg(thisWeekScores) - avg(lastWeekScores));
}

/**
 * StreakCard wants Mon=0..Sun=6 for the *current calendar week*, derived from
 * the same real activity-date set recomputeUserStats already builds (study
 * plan task completions + attempts) — not a fabricated or JS-Sunday-first
 * index like the old getActiveDayIndicesThisWeek produced.
 */
function activeDayIndicesForCurrentWeek(activityDates) {
  const today = appTodayString();
  const todayDow = (new Date(`${today}T00:00:00Z`).getUTCDay() + 6) % 7; // 0=Mon..6=Sun
  const monday = shiftAppDateString(today, -todayDow);
  const indices = [];
  for (let i = 0; i < 7; i++) {
    if (activityDates.has(shiftAppDateString(monday, i))) indices.push(i);
  }
  return indices;
}

export const getDashboardSummary = async (userId) => {
  const [user, stats, activePlan] = await Promise.all([
    prisma.user.findUnique({
      where: { userId },
      include: {
        targetExam: {
          include: { subjects: { include: { topics: true, quizzes: true } } },
        },
      },
    }),
    recomputeUserStats(userId),
    prisma.studyPlan.findFirst({ where: { userId, status: "active" }, orderBy: { planId: "desc" } }),
  ]);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // No fallback to an arbitrary exam — a user with no target exam simply sees
  // empty course-progress states until they set one via the course setup.
  const targetExam = user.targetExam;
  const subjects = targetExam?.subjects || [];
  const allTopicIds = subjects.flatMap((s) => s.topics.map((t) => t.topicId));

  const [progressRecords, weakAreasList, recentAttempts] = await Promise.all([
    allTopicIds.length
      ? prisma.progressRecord.findMany({ where: { userId, topicId: { in: allTopicIds } } })
      : Promise.resolve([]),
    prisma.weakArea.findMany({
      where: { userId: numericUserId },
      orderBy: [{ accuracyRate: "asc" }],
      take: 4,
      include: { topic: { include: { subject: true } } },
    }),
    prisma.attempt.findMany({
      where: { userId: numericUserId },
      orderBy: { startTime: "desc" },
      take: 10,
      include: {
        quiz: { select: { title: true, subject: true } },
        mockExam: { select: { title: true } },
      },
    }),
  ]);

  // 1. Exam countdown — only when a real date is known (active course's
  // examDate, if the candidate happened to supply one, else Exam.schedules).
  // No fabricated fallback: a missing date just means no countdown card.
  let examDate = null;
  if (activePlan?.items?.examDate) {
    const d = new Date(activePlan.items.examDate);
    if (!isNaN(d.getTime())) examDate = d;
  }
  if (!examDate) examDate = resolveExamDateFromSchedules(targetExam?.schedules);
  const countdown = examDate ? calculateCountdown(examDate) : null;

  // 2. Overall course progress (topic mastery, threshold-based "completed")
  const progressMap = new Map(progressRecords.map((p) => [p.topicId, Number(p.proficiencyScore || 0)]));
  const totalLessons = allTopicIds.length;
  const completedLessons = allTopicIds.filter((id) => (progressMap.get(id) || 0) >= 50).length;
  const overallPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // 3. Exam readiness score
  const recentScores = recentAttempts.map((a) => Number(a.score)).filter((s) => !isNaN(s) && s > 0);
  const averageScore = recentScores.length
    ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length)
    : Math.round(Number(stats.averageScore) || 0);
  const readinessScore = Math.min(100, Math.round(averageScore * 0.7 + overallPercent * 0.3));
  let readinessStatus = "ត្រូវការការខិតខំបន្ថែម";
  if (readinessScore >= 75) readinessStatus = "ឱកាសជាប់ប្រឡងខ្ពស់";
  else if (readinessScore >= 50) readinessStatus = "ឱកាសជាប់មធ្យម";

  // 4. Subject mastery donuts
  const subjectDonuts = subjects.map((subject, index) => {
    const topicIds = subject.topics.map((t) => t.topicId);
    const total = topicIds.length;
    const completed = topicIds.filter((id) => (progressMap.get(id) || 0) >= 50).length;
    return {
      subjectId: subject.subjectId,
      label: subject.subjectName,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      completed,
      total,
      color: DEFAULT_SUBJECT_COLORS[index % DEFAULT_SUBJECT_COLORS.length],
    };
  });

  // 5. AI insight: accuracy, weekly trend, top weak areas
  const formattedWeakAreas = weakAreasList.map((w, idx) => ({
    subject: w.topic?.subject?.subjectName || "ទូទៅ",
    topic: w.topic?.topicName || "មេរៀន",
    color: idx % 2 === 0 ? "#ef4444" : "#b45309",
  }));

  // 6. Study streak & this-week active days (real activity, Mon=0..Sun=6)
  const activeDayIndices = activeDayIndicesForCurrentWeek(stats.activityDates);

  // 7. Resource usage
  const totalQuizzesAvailable = subjects.reduce((acc, s) => acc + (s.quizzes?.length || 0), 0);
  const userQuizAttemptsCount = await prisma.attempt.count({
    where: { userId, attemptType: "quiz" },
  });
  const quizUsagePercent =
    totalQuizzesAvailable > 0
      ? Math.min(100, Math.round((userQuizAttemptsCount / totalQuizzesAvailable) * 100))
      : 0;

  const resourceUsage = [
    { label: "វីដេអូ / មេរៀន", percent: overallPercent, color: "#0a3263" },
    { label: "កម្រងសំណួរ", percent: quizUsagePercent, color: "#5c3818" },
    {
      label: "ឯកសារអាន / វិញ្ញាសា",
      percent: Math.min(100, Math.round(overallPercent * 0.8)),
      color: "#0d7652",
    },
  ];

  // 8. Study time distribution per subject (from scored quiz attempts already fetched)
  const subjectStudySeconds = new Map();
  let totalStudySeconds = 0;
  for (const a of recentAttempts) {
    if (a.startTime && a.endTime && a.quiz?.subject) {
      const durationSec = Math.max(
        0,
        Math.floor((new Date(a.endTime).getTime() - new Date(a.startTime).getTime()) / 1000)
      );
      const subName = a.quiz.subject.subjectName;
      subjectStudySeconds.set(subName, (subjectStudySeconds.get(subName) || 0) + durationSec);
      totalStudySeconds += durationSec;
    }
  }

  // 9. Next recommended module — same live weak-area/proficiency ranking the
  // course page's "Next Up" panel uses, so the dashboard's suggestion always
  // matches what the candidate would actually see if they opened the course.
  const nextUp = activePlan ? await rankNextUp(activePlan.items, userId) : [];
  const nextModule = nextUp.length
    ? {
        title: nextUp[0].task.title,
        type: nextUp[0].task.type,
        subjectName: nextUp[0].task.subjectName,
        topicName: nextUp[0].task.topicName,
      }
    : null;

  const circumference = 238.7;
  let currentStrokeOffset = 0;
  const studyTimeDistribution = subjects.map((subject, index) => {
    const seconds = subjectStudySeconds.get(subject.subjectName) || 0;
    const hours = Math.round((seconds / 3600) * 10) / 10;
    const percent =
      totalStudySeconds > 0
        ? Math.round((seconds / totalStudySeconds) * 100)
        : Math.round(100 / Math.max(1, subjects.length));

    const item = {
      label: subject.subjectName,
      percent,
      hours,
      color: DEFAULT_SUBJECT_COLORS[index % DEFAULT_SUBJECT_COLORS.length],
      strokeOffset: currentStrokeOffset,
    };
    currentStrokeOffset += (percent / 100) * circumference;
    return item;
  });

  return {
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
    },
    subjectDonuts,
    aiInsight: {
      accuracy: averageScore,
      weeklyChange: computeWeeklyScoreChange(recentAttempts),
      weakAreas: formattedWeakAreas,
    },
    streak: {
      streakDays: stats.streakDays,
      activeDayIndices,
    },
    resourceUsage,
    studyTimeDistribution,
    hasActivePlan: Boolean(activePlan),
    nextModule,
    recentAttempts: recentAttempts.slice(0, 5).map((a) => ({
      attemptId: a.attemptId,
      attemptType: a.attemptType,
      title: a.quiz?.title || a.mockExam?.title || "Attempt",
      score: a.score !== null ? Number(a.score) : null,
      startTime: a.startTime,
      endTime: a.endTime,
    })),
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
