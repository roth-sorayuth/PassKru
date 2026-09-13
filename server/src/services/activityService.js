import { prisma } from "../config/prisma.js";

/**
 * The candidate's study history, newest first, merged from:
 *   - finished attempts: quiz, practice (mock_exam), placement test, weekly review
 *   - papers ticked off in a study plan (papers have no attempt)
 *   - study plans created
 * Paged by time: pass the `nextCursor` of one page as `before` for the next.
 */

const MAX_LIMIT = 50;
const ATTEMPT_MINUTES_CAP = 240;

const minutesBetween = (start, end) =>
  start && end ? Math.min(ATTEMPT_MINUTES_CAP, Math.max(0, Math.round((new Date(end) - new Date(start)) / 60000))) : null;

const KIND_BY_ATTEMPT = { quiz: "quiz", mock_exam: "practice", placement: "placement", review: "review" };

/** Plan-derived events (plans created, papers ticked) before a cursor. */
function planEvents(plans, before) {
  const events = [];
  for (const plan of plans) {
    const items = plan.items;
    if (items?.version !== 2) continue;
    if (items.generatedAt) {
      events.push({
        id: `plan-${plan.planId}`,
        kind: "plan",
        at: items.generatedAt,
        title: null,
        level: items.level || null,
        planId: plan.planId,
        active: plan.status === "active",
      });
    }
    for (const day of items.days || []) {
      for (const task of day.tasks || []) {
        if (task.type !== "paper" || !task.completed || !task.completedAt) continue;
        events.push({
          id: `paper-${plan.planId}-${task.id}`,
          kind: "paper",
          at: task.completedAt,
          title: task.title,
          subjectName: task.subjectName || null,
          durationMinutes: task.estimatedMinutes || null,
          fileUrl: task.fileUrl || null,
        });
      }
    }
  }
  return events.filter((e) => !before || new Date(e.at) < before);
}

export async function listActivity(userId, { before: beforeRaw, limit: limitRaw } = {}) {
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(limitRaw) || 10));
  const before = beforeRaw ? new Date(beforeRaw) : null;
  if (before && isNaN(before.getTime())) {
    throw Object.assign(new Error("Invalid 'before' cursor"), { statusCode: 400 });
  }

  const [attempts, plans] = await Promise.all([
    prisma.attempt.findMany({
      where: { userId, endTime: { not: null, ...(before ? { lt: before } : {}) } },
      orderBy: { endTime: "desc" },
      take: limit + 1,
      select: {
        attemptId: true,
        attemptType: true,
        score: true,
        startTime: true,
        endTime: true,
        quiz: { select: { title: true, subject: { select: { subjectName: true } } } },
        mockExam: { select: { title: true } },
        _count: { select: { attemptAnswers: true } },
        attemptAnswers: { where: { isCorrect: true }, select: { answerId: true } },
      },
    }),
    prisma.studyPlan.findMany({ where: { userId }, select: { planId: true, status: true, items: true } }),
  ]);

  const attemptEvents = attempts.map((a) => ({
    id: `attempt-${a.attemptId}`,
    kind: KIND_BY_ATTEMPT[a.attemptType] || "quiz",
    at: a.endTime.toISOString(),
    title: a.quiz?.title || a.mockExam?.title || null,
    subjectName: a.quiz?.subject?.subjectName || null,
    attemptId: a.attemptId,
    score: a.score != null ? Math.round(Number(a.score)) : null,
    correct: a.attemptAnswers.length,
    total: a._count.attemptAnswers,
    durationMinutes: minutesBetween(a.startTime, a.endTime),
  }));

  // Attempts were fetched limit+1 deep; plan events are all in memory. The
  // merged page is exact up to the oldest attempt fetched.
  const merged = [...attemptEvents, ...planEvents(plans, before)].sort((x, y) => new Date(y.at) - new Date(x.at));
  const items = merged.slice(0, limit);
  const hasMore = merged.length > limit;
  return { items, nextCursor: hasMore ? items[items.length - 1].at : null };
}
