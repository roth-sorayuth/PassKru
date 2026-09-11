import { prisma } from "../config/prisma.js";
import { WEAK_AREA_THRESHOLD } from "./scoringService.js";

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
 * Upserts a weak area per struggling topic and clears the ones the candidate
 * has pulled back above the threshold, so a topic doesn't stay flagged
 * forever after it's been fixed.
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

  // One quiz per subject is the norm here, so resolving the follow-up quiz
  // per subject (not per topic) keeps this to a single extra query.
  const subjectIds = [...new Set(topics.map((t) => t.subjectId).filter((id) => id != null))];
  const quizzes = subjectIds.length
    ? await prisma.quiz.findMany({
        where: { subjectId: { in: subjectIds } },
        orderBy: { quizId: "asc" },
        select: { quizId: true, subjectId: true },
      })
    : [];
  const quizBySubject = new Map();
  for (const q of quizzes) if (!quizBySubject.has(q.subjectId)) quizBySubject.set(q.subjectId, q.quizId);

  let flagged = 0;
  let cleared = 0;

  for (const stat of topicStats) {
    const topic = topicById.get(stat.topicId);
    if (!topic) continue;

    const existing = existingByTopic.get(stat.topicId);

    if (stat.accuracy >= WEAK_AREA_THRESHOLD) {
      if (existing) {
        await prisma.weakArea.delete({ where: { weakAreaId: existing.weakAreaId } });
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
      actionQuizId: quizBySubject.get(topic.subjectId) ?? null,
      actionReadTopicId: topic.topicId,
      identifiedDate: new Date(),
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
