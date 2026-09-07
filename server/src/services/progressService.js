import { prisma } from "../config/prisma.js";
import { recomputeUserStats } from "./userStatsService.js";
import { appTodayString, shiftAppDateString, toAppDateString } from "../utils/appDate.js";
import { calculateCountdown } from "../utils/timeHelper.js";
import { rankNextUp } from "./studyPlanService.js";
import { resolveMasteryState, isStrong, MASTERY_STATES, describeMastery } from "./masteryService.js";

const DEFAULT_SUBJECT_COLORS = [
  "#0a3263", // Deep navy
  "#5c3818", // Rich brown/amber
  "#0d7652", // Forest emerald
  "#d97706", // Warm amber
  "#4f46e5", // Indigo
  "#0284c7", // Sky blue
];

/**
 * Weak-area severity → colour. Severity is the real signal (set by
 * weaknessAnalysisService from accuracy), so the colour has to come from it —
 * the previous `idx % 2` alternation coloured by list *position*, which meant
 * the 3rd-worst weak area could render red while the 2nd-worst rendered amber.
 */
const WEAK_AREA_SEVERITY_COLORS = {
  high: "#ef4444", // red
  medium: "#b45309", // amber
  low: "#0d7652", // emerald
};

/**
 * WeakArea.severityLevel is nullable in the schema, so fall back to the same
 * accuracy thresholds weaknessAnalysisService uses rather than guessing.
 */
function resolveWeakAreaSeverity(weakArea) {
  const stored = weakArea?.severityLevel;
  if (stored && WEAK_AREA_SEVERITY_COLORS[stored]) return stored;
  const rawAccuracy = weakArea?.accuracyRate;
  if (rawAccuracy === null || rawAccuracy === undefined) return "medium";
  const accuracy = Number(rawAccuracy);
  if (isNaN(accuracy)) return "medium";
  if (accuracy < 40) return "high";
  if (accuracy < 55) return "medium";
  return "low";
}

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

/**
 * Compares syllabus left to cover against days left before the exam.
 *
 * The countdown and the remaining-topics count both already existed but were
 * never put next to each other, so a candidate could watch a confident-looking
 * progress bar without ever being told they were running out of time.
 *
 * Returns null rather than a guess when either half is unknown.
 */
function buildPacing(countdown, masteryCounts, totalTopics) {
  if (!countdown || !totalTopics) return null;
  const daysLeft = Number(countdown.days);
  if (!Number.isFinite(daysLeft) || daysLeft <= 0) return null;

  const remaining = masteryCounts.untouched + masteryCounts.learning + masteryCounts.developing;
  if (remaining === 0) return { daysLeft, topicsRemaining: 0, topicsPerDay: 0, onTrack: true };

  const topicsPerDay = Math.round((remaining / daysLeft) * 100) / 100;
  // One topic a day is the pace the course generator itself assumes when it
  // has no exam date to work from, so it's the same yardstick throughout.
  return { daysLeft, topicsRemaining: remaining, topicsPerDay, onTrack: topicsPerDay <= 1 };
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
      ? prisma.progressRecord.findMany({
          where: { userId, topicId: { in: allTopicIds } },
          select: { topicId: true, proficiencyScore: true, attemptsCount: true },
        })
      : Promise.resolve([]),
    prisma.weakArea.findMany({
      where: { userId, status: "open" },
      orderBy: [{ accuracyRate: "asc" }],
      take: 4,
      include: { topic: { include: { subject: true } } },
    }),
    prisma.attempt.findMany({
      where: { userId },
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

  // 2. Overall course progress, by mastery state rather than a bare score
  // comparison — masteryService owns where every boundary sits, so the
  // dashboard can no longer disagree with the course generator about whether
  // a topic is known (it used to call 70 "mastered" while the generator
  // required 80).
  const progressMap = new Map(progressRecords.map((p) => [p.topicId, p]));
  const stateFor = (topicId) => {
    const record = progressMap.get(topicId);
    if (!record) return "untouched";
    return resolveMasteryState(record.proficiencyScore, record.attemptsCount);
  };

  const totalLessons = allTopicIds.length;
  // "Covered" means the candidate is at or above proficient on it — the
  // Strong side of the loop's fork.
  const completedLessons = allTopicIds.filter((id) => isStrong(stateFor(id))).length;
  const overallPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Mastery breakdown: the Topic Mastery node of the loop, which previously
  // had nowhere to live in the UI at all. Binary "mastered or not" hid the
  // difference between a topic never attempted and one actively going badly.
  const masteryCounts = Object.fromEntries(MASTERY_STATES.map((s) => [s, 0]));
  for (const id of allTopicIds) masteryCounts[stateFor(id)] += 1;

  // 3. Exam readiness score
  const recentScores = recentAttempts.map((a) => Number(a.score)).filter((s) => !isNaN(s) && s > 0);
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

  // 4. Subject mastery donuts, plus the per-state split behind each one
  const subjectDonuts = subjects.map((subject, index) => {
    const topicIds = subject.topics.map((t) => t.topicId);
    const total = topicIds.length;
    const completed = topicIds.filter((id) => isStrong(stateFor(id))).length;
    const counts = Object.fromEntries(MASTERY_STATES.map((s) => [s, 0]));
    for (const id of topicIds) counts[stateFor(id)] += 1;
    return {
      subjectId: subject.subjectId,
      label: subject.subjectName,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      completed,
      total,
      masteryCounts: counts,
      color: DEFAULT_SUBJECT_COLORS[index % DEFAULT_SUBJECT_COLORS.length],
    };
  });

  // 4b. The Strong side of the fork, which the UI has never shown — only weak
  // areas were ever surfaced, so the system looked like it only ever found
  // fault. Strongest first, capped to match the weak-area list's length.
  const strongTopics = allTopicIds
    .map((id) => ({ id, record: progressMap.get(id), state: stateFor(id) }))
    .filter((t) => isStrong(t.state))
    .sort((a, b) => Number(b.record?.proficiencyScore || 0) - Number(a.record?.proficiencyScore || 0))
    .slice(0, 4)
    .map((t) => {
      const topic = subjects.flatMap((s) => s.topics.map((tp) => ({ ...tp, subjectName: s.subjectName }))).find((tp) => tp.topicId === t.id);
      return {
        topicId: t.id,
        topic: topic?.topicName ?? "",
        subject: topic?.subjectName ?? "",
        ...describeMastery(t.record?.proficiencyScore, t.record?.attemptsCount),
      };
    });

  // 5. AI insight: accuracy, weekly trend, top weak areas
  const formattedWeakAreas = weakAreasList.map((w) => {
    const severityLevel = resolveWeakAreaSeverity(w);
    return {
      subject: w.topic?.subject?.subjectName || "ទូទៅ",
      topic: w.topic?.topicName || "មេរៀន",
      severityLevel,
      color: WEAK_AREA_SEVERITY_COLORS[severityLevel],
    };
  });

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

  // Reading progress is the completion rate of the active course's `read`
  // tasks — a real signal. Previously this was `overallPercent * 0.8`, a
  // fabricated number with no reading data behind it. With no active course
  // there is nothing to measure, so it reports 0 rather than inventing a
  // figure (same honest-null stance as the countdown above).
  let readTasksTotal = 0;
  let readTasksCompleted = 0;
  for (const day of activePlan?.items?.days || []) {
    for (const task of day?.tasks || []) {
      if (task?.type !== "read") continue;
      readTasksTotal += 1;
      if (task.completed) readTasksCompleted += 1;
    }
  }
  const readingUsagePercent =
    readTasksTotal > 0 ? Math.round((readTasksCompleted / readTasksTotal) * 100) : 0;

  // These labels are server-authored (not DB values), so they carry an English
  // twin — the UI is bilingual and can't translate a free-form string itself.
  const resourceUsage = [
    { label: "វីដេអូ / មេរៀន", labelEn: "Lessons", percent: overallPercent, color: "#0a3263" },
    { label: "កម្រងសំណួរ", labelEn: "Quizzes", percent: quizUsagePercent, color: "#5c3818" },
    {
      label: "ឯកសារអាន / វិញ្ញាសា",
      labelEn: "Reading & papers",
      percent: readingUsagePercent,
      color: "#0d7652",
    },
  ];

  // 8. Study time distribution (from the recent attempts already fetched).
  // Mock exams span multiple subjects and so carry no single `quiz.subject`;
  // they used to be dropped on the floor entirely. They now get their own
  // bucket so the time a candidate spends on full mocks is actually counted.
  const subjectStudySeconds = new Map();
  let mockStudySeconds = 0;
  let totalStudySeconds = 0;
  for (const a of recentAttempts) {
    if (!a.startTime || !a.endTime) continue;
    const durationSec = Math.max(
      0,
      Math.floor((new Date(a.endTime).getTime() - new Date(a.startTime).getTime()) / 1000)
    );
    if (a.quiz?.subject) {
      const subName = a.quiz.subject.subjectName;
      subjectStudySeconds.set(subName, (subjectStudySeconds.get(subName) || 0) + durationSec);
      totalStudySeconds += durationSec;
    } else if (a.mockExam || a.attemptType === "mock-exam") {
      mockStudySeconds += durationSec;
      totalStudySeconds += durationSec;
    }
  }

  // 9. Next recommended module — same live weak-area/proficiency ranking the
  // course page's "Next Up" panel uses, so the dashboard's suggestion always
  // matches what the candidate would actually see if they opened the course.
  const nextUp = activePlan ? await rankNextUp(activePlan.items, userId) : [];
  const nextModule = nextUp.length
    ? {
        // The task id lets the dashboard deep-link straight to this exact task
        // on the course page instead of dropping the candidate on the page top.
        taskId: nextUp[0].task.id ?? null,
        title: nextUp[0].task.title,
        type: nextUp[0].task.type,
        subjectName: nextUp[0].task.subjectName,
        topicName: nextUp[0].task.topicName,
      }
    : null;

  const circumference = 238.7;
  let currentStrokeOffset = 0;
  const distributionBuckets = subjects.map((subject, index) => ({
    label: subject.subjectName,
    labelEn: null, // subject names are DB values — same string in both languages
    seconds: subjectStudySeconds.get(subject.subjectName) || 0,
    color: DEFAULT_SUBJECT_COLORS[index % DEFAULT_SUBJECT_COLORS.length],
  }));
  // Only shown once there is real mock-exam time to show — an always-present
  // zero bucket would just be noise on the donut.
  if (mockStudySeconds > 0) {
    distributionBuckets.push({
      label: "ការប្រឡងសាកល្បង",
      labelEn: "Mock Exams",
      seconds: mockStudySeconds,
      color: "#7c3aed",
    });
  }

  const studyTimeDistribution = distributionBuckets.map(({ label, labelEn, seconds, color }) => {
    const hours = Math.round((seconds / 3600) * 10) / 10;
    const percent =
      totalStudySeconds > 0
        ? Math.round((seconds / totalStudySeconds) * 100)
        : Math.round(100 / Math.max(1, distributionBuckets.length));

    const item = { label, labelEn, percent, hours, color, strokeOffset: currentStrokeOffset };
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
      statusLabelEn: readinessStatusEn,
    },
    subjectDonuts,
    // The Topic Mastery node, with both sides of the fork. `pacing` is null
    // whenever there's no exam date or nothing left to cover — it's a real
    // comparison or nothing, not a fabricated reassurance.
    topicMastery: {
      counts: masteryCounts,
      total: totalLessons,
      strongTopics,
      pacing: buildPacing(countdown, masteryCounts, totalLessons),
    },
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
