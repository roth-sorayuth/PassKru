import { prisma } from "../config/prisma.js";

function toDateOnlyString(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

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

  const todayStr = toDateOnlyString(new Date());
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

function computeWeeklyActivity(items) {
  const activityByDate = new Map();
  if (items && Array.isArray(items.days)) {
    for (const day of items.days) {
      const hasCompleted = (day.tasks || []).some((t) => t.completed);
      activityByDate.set(day.date, hasCompleted);
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today, -i);
    const dateStr = toDateOnlyString(d);
    days.push({
      date: dateStr,
      active: activityByDate.get(dateStr) || false,
      isToday: i === 0,
    });
  }
  return days;
}

export const getDashboardSummary = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { userId },
    include: { targetExam: true },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const activePlan = await prisma.studyPlan.findFirst({
    where: { userId, status: "active" },
    orderBy: { planId: "desc" },
  });

  const planItems = activePlan?.items || null;

  let examDate = null;
  if (planItems?.examDate) {
    const d = new Date(planItems.examDate);
    if (!isNaN(d.getTime())) examDate = d;
  }
  if (!examDate && user.targetExam) {
    examDate = resolveExamDateFromSchedules(user.targetExam.schedules);
  }

  const [progressRecords, weakAreas, recentAttempts] = await Promise.all([
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
      streakDays: user.streakDays,
      averageScore: Number(user.averageScore) || 0,
      studyHoursTotal: Number(user.studyHoursTotal) || 0,
      completedQuestions: user.completedQuestions,
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
    weeklyActivity: computeWeeklyActivity(planItems),
  };
};
