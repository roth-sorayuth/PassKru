import { prisma } from "../config/prisma.js";
import { appTodayString, shiftAppDateString, toAppDateString } from "../utils/appDate.js";

// An abandoned attempt can sit open indefinitely; cap what a single attempt
// may contribute so one stale end_time can't inflate total study hours.
const MAX_ATTEMPT_MINUTES = 240;

function round2(value) {
  return Math.round(value * 100) / 100;
}

/**
 * Study-plan task completions.
 *
 * Every generated task carries the minutes the planner budgeted for it plus
 * the timestamp it was ticked off, which is what makes completions usable as
 * both study time and streak activity.
 */
function collectPlanActivity(plans) {
  const dates = new Set();
  let minutes = 0;

  for (const plan of plans) {
    const days = plan.items?.days;
    if (!Array.isArray(days)) continue;

    for (const day of days) {
      for (const task of day.tasks || []) {
        if (!task.completed) continue;
        minutes += Number(task.estimatedMinutes) || 0;
        // Fall back to the scheduled day for tasks completed before
        // completedAt started being recorded.
        const dateStr = toAppDateString(task.completedAt) || day.date;
        if (dateStr) dates.add(dateStr);
      }
    }
  }

  return { dates, minutes };
}

function collectAttemptActivity(attempts) {
  const dates = new Set();
  let minutes = 0;

  for (const attempt of attempts) {
    const dateStr = toAppDateString(attempt.endTime || attempt.startTime);
    if (dateStr) dates.add(dateStr);

    if (attempt.startTime && attempt.endTime) {
      const span = (new Date(attempt.endTime).getTime() - new Date(attempt.startTime).getTime()) / 60000;
      if (span > 0) minutes += Math.min(span, MAX_ATTEMPT_MINUTES);
    }
  }

  return { dates, minutes };
}

/**
 * Consecutive days of study activity ending today.
 *
 * A day with nothing logged yet shouldn't break the streak until it is over,
 * so counting starts at yesterday whenever today is still empty.
 */
export function computeStreakDays(activityDates, today = appTodayString()) {
  let cursor = activityDates.has(today) ? today : shiftAppDateString(today, -1);
  if (!activityDates.has(cursor)) return 0;

  let streak = 0;
  while (activityDates.has(cursor)) {
    streak += 1;
    cursor = shiftAppDateString(cursor, -1);
  }
  return streak;
}

/** The last 7 calendar days, oldest first, flagged with real study activity. */
export function buildWeeklyActivity(activityDates, today = appTodayString()) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = shiftAppDateString(today, -i);
    days.push({ date, active: activityDates.has(date), isToday: i === 0 });
  }
  return days;
}

/**
 * Every calendar day the user did something that counts as studying, plus the
 * total time those activities represent.
 *
 * Archived plans are included: a completion still happened even once the plan
 * it belonged to has been superseded by a regenerated one.
 */
export const gatherUserActivity = async (userId) => {
  const [plans, attempts] = await Promise.all([
    prisma.studyPlan.findMany({ where: { userId }, select: { items: true } }),
    prisma.attempt.findMany({
      where: { userId },
      select: { startTime: true, endTime: true },
    }),
  ]);

  const planActivity = collectPlanActivity(plans);
  const attemptActivity = collectAttemptActivity(attempts);

  return {
    activityDates: new Set([...planActivity.dates, ...attemptActivity.dates]),
    studyMinutes: planActivity.minutes + attemptActivity.minutes,
  };
};

/**
 * Recompute the cached counters on the user row from their source tables and
 * persist them.
 *
 * streakDays / completedQuestions / averageScore / studyHoursTotal are only a
 * denormalised cache — attempts, attempt answers and study-plan completions
 * are the source of truth — so this is safe to call from any path that records
 * study activity, and is what keeps the dashboard and the profile page (which
 * reads the same columns via /users/me) in step.
 *
 * Returns the fresh stats plus the activity day set, so a caller rendering an
 * activity strip doesn't have to query for it again.
 */
export const recomputeUserStats = async (userId) => {
  const [activity, completedQuestions, scoreAggregate] = await Promise.all([
    gatherUserActivity(userId),
    prisma.attemptAnswer.count({ where: { attempt: { userId } } }),
    prisma.attempt.aggregate({
      _avg: { score: true },
      where: { userId, score: { not: null } },
    }),
  ]);

  const averageScore = scoreAggregate._avg.score !== null ? Number(scoreAggregate._avg.score) : 0;

  const stats = {
    streakDays: computeStreakDays(activity.activityDates),
    completedQuestions,
    averageScore: round2(averageScore),
    studyHoursTotal: round2(activity.studyMinutes / 60),
  };

  // Persist the cache for other readers (e.g. /users/me) without making this
  // call's caller wait on it — the freshly computed `stats` below is already
  // correct for this response, and each round trip to the DB costs real
  // cross-region latency, so a write nothing here depends on shouldn't sit
  // on the critical path.
  prisma.user
    .update({ where: { userId }, data: { ...stats, updatedAt: new Date() } })
    .catch((err) => console.error("Failed to persist recomputed user stats:", err));

  return { ...stats, activityDates: activity.activityDates };
};
