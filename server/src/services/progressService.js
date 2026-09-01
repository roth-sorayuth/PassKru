import { prisma } from "../config/prisma.js";
import { buildWeeklyActivity, recomputeUserStats } from "./userStatsService.js";
import { appTodayString } from "../utils/appDate.js";

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

function computeCountdown(examDate) {
  if (!examDate) return null;
  const diffMs = examDate.getTime() - Date.now();
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, isPast: true };
  }
  const totalMinutes = Math.floor(diffMs / 60000);
  return {
    days: Math.floor(totalMinutes / (60 * 24)),
    hours: Math.floor((totalMinutes % (60 * 24)) / 60),
    minutes: totalMinutes % 60,
    isPast: false,
  };
}

function summarizePlanProgress(items) {
  const empty = {
    totalTasks: 0,
    completedTasks: 0,
    percent: 0,
    todayTotalTasks: 0,
    todayCompletedTasks: 0,
    todayPercent: 0,
    todayDate: null,
    todayTasks: [],
  };
  if (!items || !Array.isArray(items.days)) return empty;

  const todayStr = appTodayString();
  let totalTasks = 0;
  let completedTasks = 0;
  let todayDay = null;

  for (const day of items.days) {
    const tasks = day.tasks || [];
    totalTasks += tasks.length;
    completedTasks += tasks.filter((t) => t.completed).length;
    if (day.date === todayStr) todayDay = day;
  }

  if (!todayDay) {
    todayDay = items.days.find((d) => (d.tasks || []).some((t) => !t.completed)) || items.days[0] || null;
  }

  const todayTasks = todayDay ? todayDay.tasks || [] : [];
  const todayCompletedTasks = todayTasks.filter((t) => t.completed).length;

  return {
    totalTasks,
    completedTasks,
    percent: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
    todayTotalTasks: todayTasks.length,
    todayCompletedTasks,
    todayPercent: todayTasks.length ? Math.round((todayCompletedTasks / todayTasks.length) * 100) : 0,
    todayDate: todayDay ? todayDay.date : null,
    todayTasks,
  };
}

export const getDashboardSummary = async (userId) => {
  // Every one of these reads is independent of the others (recomputeUserStats
  // takes just the userId, not the user row) — running them as one batch
  // instead of one after another matters a lot here specifically, since the
  // DB is cross-region and each round trip costs real latency regardless of
  // how small the query is.
  const [user, stats, activePlan, progressRecords, weakAreas, recentAttempts] = await Promise.all([
    prisma.user.findUnique({ where: { userId }, include: { targetExam: true } }),
    recomputeUserStats(userId),
    prisma.studyPlan.findFirst({ where: { userId, status: "active" }, orderBy: { planId: "desc" } }),
    prisma.progressRecord.findMany({
      where: { userId },
      include: { topic: { include: { subject: true } } },
    }),
    prisma.weakArea.findMany({
      where: { userId },
      orderBy: [{ accuracyRate: "asc" }],
      take: 5,
      include: { topic: { include: { subject: true } } },
    }),
    prisma.attempt.findMany({
      where: { userId },
      orderBy: { startTime: "desc" },
      take: 5,
      include: {
        quiz: { select: { title: true } },
        mockExam: { select: { title: true } },
      },
    }),
  ]);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const planItems = activePlan?.items || null;

  let examDate = null;
  if (planItems?.examDate) {
    const d = new Date(planItems.examDate);
    if (!isNaN(d.getTime())) examDate = d;
  }
  if (!examDate && user.targetExam) {
    examDate = resolveExamDateFromSchedules(user.targetExam.schedules);
  }

  const subjectMap = new Map();
  for (const record of progressRecords) {
    if (!record.topic) continue;
    const subject = record.topic.subject;
    if (!subjectMap.has(subject.subjectId)) {
      subjectMap.set(subject.subjectId, {
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        scores: [],
        topicsTracked: 0,
      });
    }
    const entry = subjectMap.get(subject.subjectId);
    if (record.proficiencyScore !== null) entry.scores.push(Number(record.proficiencyScore));
    entry.topicsTracked += 1;
  }

  const subjectIds = [...subjectMap.keys()];
  const subjectTopicTotals = subjectIds.length
    ? await prisma.subject.findMany({
        where: { subjectId: { in: subjectIds } },
        select: { subjectId: true, _count: { select: { topics: true } } },
      })
    : [];
  const totalsBySubject = new Map(subjectTopicTotals.map((s) => [s.subjectId, s._count.topics]));

  const subjectProficiency = subjectIds.map((id) => {
    const entry = subjectMap.get(id);
    const avg = entry.scores.length
      ? Math.round(entry.scores.reduce((a, b) => a + b, 0) / entry.scores.length)
      : 0;
    return {
      subjectId: entry.subjectId,
      subjectName: entry.subjectName,
      proficiency: avg,
      topicsTracked: entry.topicsTracked,
      topicsTotal: totalsBySubject.get(id) || entry.topicsTracked,
    };
  });

  return {
    profile: {
      streakDays: stats.streakDays,
      averageScore: stats.averageScore,
      studyHoursTotal: stats.studyHoursTotal,
      completedQuestions: stats.completedQuestions,
      dailyGoalMinutes: user.dailyGoalMinutes,
      targetExamName: user.targetExam?.examName || null,
    },
    examCountdown: computeCountdown(examDate),
    studyPlan: {
      hasActivePlan: Boolean(activePlan),
      planId: activePlan?.planId || null,
      ...summarizePlanProgress(planItems),
    },
    subjectProficiency,
    weakAreas: weakAreas.map((w) => ({
      weakAreaId: w.weakAreaId,
      subjectName: w.topic?.subject?.subjectName || "Unknown Subject",
      topicName: w.topic?.topicName || "Unknown Topic",
      accuracyRate: w.accuracyRate !== null ? Number(w.accuracyRate) : null,
      priority: w.priority,
      failedQuestionsCount: w.failedQuestionsCount,
      recommendation: w.recommendation,
    })),
    recentAttempts: recentAttempts.map((a) => ({
      attemptId: a.attemptId,
      attemptType: a.attemptType,
      title: a.quiz?.title || a.mockExam?.title || "Attempt",
      score: a.score !== null ? Number(a.score) : null,
      startTime: a.startTime,
      endTime: a.endTime,
    })),
    weeklyActivity: buildWeeklyActivity(stats.activityDates),
  };
};
