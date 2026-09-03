/**
 * Grading and proficiency maths for quiz/mock-exam attempts.
 *
 * Kept free of Prisma calls so the rules here stay easy to reason about and
 * test: callers hand in the questions (with their answer options) plus the
 * candidate's submission, and get back per-answer correctness and per-topic
 * accuracy, which attemptService then persists.
 */

/** Weak-area cutoff: below this accuracy on a topic, it's flagged for review. */
export const WEAK_AREA_THRESHOLD = 70;

/**
 * How much a single attempt moves a topic's stored proficiency.
 *
 * A straight overwrite would let one bad quiz erase months of progress (and
 * one lucky quiz fake mastery), so a new score is blended into the existing
 * one — recent performance leads, history still counts.
 */
const PRIOR_WEIGHT = 0.6;
const NEW_WEIGHT = 0.4;

export function computeProficiency(previousScore, accuracy) {
  const next =
    previousScore === null || previousScore === undefined
      ? accuracy
      : Number(previousScore) * PRIOR_WEIGHT + accuracy * NEW_WEIGHT;
  return Math.max(0, Math.min(100, Math.round(next)));
}

/**
 * Grades a submission against the correct answer options.
 *
 * `questions` must come from the DB with their answerOptions included (that's
 * the only source of truth for correctness — the client never sees isCorrect,
 * so it can't be trusted to self-report). Unanswered questions count as
 * incorrect rather than being skipped, so accuracy reflects the whole quiz.
 */
export function gradeSubmission(questions, submittedAnswers) {
  const selectedByQuestion = new Map(
    (submittedAnswers || [])
      .filter((a) => a && a.questionId != null)
      .map((a) => [Number(a.questionId), a.selectedOptionId == null ? null : Number(a.selectedOptionId)])
  );

  const gradedAnswers = [];
  const topicTallies = new Map();

  for (const question of questions) {
    const selectedOptionId = selectedByQuestion.has(question.questionId)
      ? selectedByQuestion.get(question.questionId)
      : null;

    const correctOption = (question.answerOptions || []).find((o) => o.isCorrect);
    // An option id the candidate didn't actually get offered is treated as no
    // answer rather than trusted, so a tampered payload can't score points.
    const isValidSelection =
      selectedOptionId != null && (question.answerOptions || []).some((o) => o.optionId === selectedOptionId);
    const isCorrect = isValidSelection && correctOption?.optionId === selectedOptionId;

    gradedAnswers.push({
      questionId: question.questionId,
      selectedOptionId: isValidSelection ? selectedOptionId : null,
      isCorrect,
      correctOptionId: correctOption?.optionId ?? null,
      explanation: question.explanation ?? null,
    });

    const tally = topicTallies.get(question.topicId) || { topicId: question.topicId, total: 0, correct: 0 };
    tally.total += 1;
    if (isCorrect) tally.correct += 1;
    topicTallies.set(question.topicId, tally);
  }

  const correctCount = gradedAnswers.filter((a) => a.isCorrect).length;
  const total = gradedAnswers.length;

  const topicStats = [...topicTallies.values()].map((t) => ({
    topicId: t.topicId,
    total: t.total,
    correct: t.correct,
    incorrect: t.total - t.correct,
    accuracy: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0,
  }));

  return {
    gradedAnswers,
    topicStats,
    correctCount,
    totalQuestions: total,
    score: total > 0 ? Math.round((correctCount / total) * 100) : 0,
  };
}
