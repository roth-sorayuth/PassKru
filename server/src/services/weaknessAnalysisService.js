import { prisma } from "../config/prisma.js";
import { WEAK_AREA_THRESHOLD } from "./masteryService.js";

/**
 * How long after recovering from a weak area the topic gets re-tested.
 *
 * A gap the candidate closed in March is not automatically still closed in
 * September, so recovery schedules a confirmation rather than ending the
 * story there.
 */
const RETEST_AFTER_DAYS = 7;

/**
 * Keeps WeakArea rows in step with how the candidate actually performed.
 *
 * This is the feedback half of the course loop: the generator reads WeakArea
 * to decide what to teach first, and this is what writes it after every
 * graded attempt. Without it the course would keep recommending topics the
 * candidate has already mastered and never react to new gaps.
 */

function severityFor(accuracy) {
  if (accuracy < 40) return { severityLevel: "high", priority: "high" };
  if (accuracy < 55) return { severityLevel: "medium", priority: "medium" };
  return { severityLevel: "low", priority: "low" };
}

function recommendationFor(topicName, accuracy) {
  return `ភាពត្រឹមត្រូវ ${accuracy}% លើ «${topicName}» — សូមរំលឹកមេរៀន រួចធ្វើកម្រងសំណួរម្តងទៀត។`;
}

/**
 * Upserts a weak area per struggling topic and resolves the ones the
 * candidate has pulled back above the threshold, so a topic doesn't stay
 * flagged forever after it's been fixed.
 *
 * Recovery marks the row `resolved` and schedules a re-test rather than
 * deleting it. Deleting threw away the one piece of information worth
 * keeping — that this topic has been a problem before — so nothing ever
 * verified the fix held.
 *
 * `topicStats` comes straight from scoringService.gradeSubmission.
 */
export const refreshWeakAreasFromAttempt = async (userId, topicStats) => {
  if (!Array.isArray(topicStats) || topicStats.length === 0) return { flagged: 0, cleared: 0 };

  const topicIds = topicStats.map((t) => t.topicId).filter((id) => id != null);
  if (!topicIds.length) return { flagged: 0, cleared: 0 };

  const [topics, existingWeakAreas] = await Promise.all([
    prisma.topic.findMany({
      where: { topicId: { in: topicIds } },
      select: { topicId: true, topicName: true, subjectId: true },
    }),
    prisma.weakArea.findMany({ where: { userId, topicId: { in: topicIds } } }),
  ]);

  const topicById = new Map(topics.map((t) => [t.topicId, t]));
  const existingByTopic = new Map(existingWeakAreas.map((w) => [w.topicId, w]));

  // The follow-up quiz is resolved by topic when a topic-scoped quiz exists,
  // and falls back to the subject quiz otherwise — sending a candidate to a
  // whole-subject quiz to fix one topic is the mismatch this loop is meant to
  // remove. Candidate-generated review quizzes are excluded: they belong to
  // one person's past session, not to the catalogue.
  const subjectIds = [...new Set(topics.map((t) => t.subjectId).filter((id) => id != null))];
  const quizzes = subjectIds.length
    ? await prisma.quiz.findMany({
        where: { subjectId: { in: subjectIds }, generatedForUserId: null },
        orderBy: { quizId: "asc" },
        select: { quizId: true, subjectId: true, topicId: true },
      })
    : [];
  const quizBySubject = new Map();
  const quizByTopic = new Map();
  for (const q of quizzes) {
    if (q.topicId != null) {
      if (!quizByTopic.has(q.topicId)) quizByTopic.set(q.topicId, q.quizId);
    } else if (!quizBySubject.has(q.subjectId)) {
      quizBySubject.set(q.subjectId, q.quizId);
    }
  }

  let flagged = 0;
  let cleared = 0;

  for (const stat of topicStats) {
    const topic = topicById.get(stat.topicId);
    if (!topic) continue;

    const existing = existingByTopic.get(stat.topicId);

    if (stat.accuracy >= WEAK_AREA_THRESHOLD) {
      // Only an open row is worth resolving — re-passing a topic that is
      // already resolved shouldn't keep pushing its re-test date out.
      if (existing && existing.status !== "resolved") {
        const resolvedAt = new Date();
        await prisma.weakArea.update({
          where: { weakAreaId: existing.weakAreaId },
          data: {
            status: "resolved",
            resolvedAt,
            nextReviewAt: new Date(resolvedAt.getTime() + RETEST_AFTER_DAYS * 86400000),
            accuracyRate: stat.accuracy,
          },
        });
        cleared += 1;
      }
      continue;
    }

    const { severityLevel, priority } = severityFor(stat.accuracy);
    const data = {
      severityLevel,
      priority,
      accuracyRate: stat.accuracy,
      failedQuestionsCount: stat.incorrect,
      recommendation: recommendationFor(topic.topicName, stat.accuracy),
      actionQuizId: quizByTopic.get(topic.topicId) ?? quizBySubject.get(topic.subjectId) ?? null,
      actionReadTopicId: topic.topicId,
      identifiedDate: new Date(),
      // A previously resolved topic that has slipped back is open again, and
      // its old resolution/re-test schedule no longer applies.
      status: "open",
      resolvedAt: null,
      nextReviewAt: null,
    };

    if (existing) {
      await prisma.weakArea.update({ where: { weakAreaId: existing.weakAreaId }, data });
    } else {
      await prisma.weakArea.create({ data: { userId, topicId: topic.topicId, ...data } });
    }
    flagged += 1;
  }

  return { flagged, cleared };
};
