import { prisma } from "../config/prisma.js";
import { gradeSubmission } from "./scoringService.js";
import { applyProficiencyUpdates } from "./attemptService.js";
import { refreshWeakAreasFromAttempt } from "./weaknessAnalysisService.js";
import { recomputeUserStats } from "./userStatsService.js";
import { generateStructuredContent, isGeminiConfigured } from "./geminiService.js";
import { getLearnerScope } from "./learnerScope.js";

/**
 * Placement test: 15 questions per subject drawn from the existing question bank for the
 * candidate's scope, stored as an Attempt with attemptType "placement". Its
 * AttemptAnswer rows are created up front (selectedOptionId null) so the
 * chosen questions survive a pause and answers autosave one at a time.
 */

export const PLACEMENT_TYPE = "placement";
/** Questions per subject; a test has one block per subject that has questions. */
const QUESTIONS_PER_SUBJECT = 15;
/** Time limit: about 45 seconds a question, never under 15 minutes (2 subjects → 23 min). */
const minutesFor = (questionCount) => Math.max(15, Math.ceil(questionCount * 0.75));
const WEAK_TOPIC_LIMIT = 5;

function notFound(message) {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}
function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

const shuffle = (items) => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export function levelFor(percent) {
  if (percent < 50) return "beginner";
  if (percent < 75) return "intermediate";
  return "advanced";
}

const attemptInclude = {
  attemptAnswers: {
    orderBy: { answerId: "asc" },
    include: {
      question: {
        select: {
          questionId: true,
          questionText: true,
          topicId: true,
          explanation: true,
          topic: { select: { topicId: true, topicName: true, subjectId: true, subject: { select: { subjectName: true } } } },
          answerOptions: { select: { optionId: true, optionText: true, isCorrect: true }, orderBy: { optionId: "asc" } },
        },
      },
    },
  },
};

/** The latest placement attempt, if its questions still belong to the candidate's scope. */
async function findCurrentPlacement(userId, scope) {
  const attempt = await prisma.attempt.findFirst({
    where: { userId, attemptType: PLACEMENT_TYPE },
    orderBy: { attemptId: "desc" },
    include: attemptInclude,
  });
  if (!attempt || !attempt.attemptAnswers.length) return null;
  // A track or subject change makes an old placement irrelevant.
  const inScope = attempt.attemptAnswers.every((a) => scope.subjectIds.includes(a.question?.topic?.subjectId));
  return inScope ? attempt : null;
}

function buildResult(attempt, patterns = [], aiReasons = new Map()) {
  const answers = attempt.attemptAnswers;
  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const percent = total ? Math.round((correct / total) * 100) : 0;

  const byTopic = new Map();
  for (const a of answers) {
    const t = a.question?.topic;
    if (!t) continue;
    const entry = byTopic.get(t.topicId) || { topicId: t.topicId, topicName: t.topicName, subjectName: t.subject?.subjectName || "", correct: 0, total: 0 };
    entry.total += 1;
    if (a.isCorrect) entry.correct += 1;
    byTopic.set(t.topicId, entry);
  }
  const topicScores = [...byTopic.values()]
    .map((t) => ({ ...t, percent: Math.round((t.correct / t.total) * 100) }))
    .sort((a, b) => a.percent - b.percent);

  const weakTopics = topicScores
    .filter((t) => t.percent < 55)
    .slice(0, WEAK_TOPIC_LIMIT)
    .map((t) => ({ ...t, reason: aiReasons.get(t.topicId) || `ត្រូវ ${t.correct} ក្នុងចំណោម ${t.total} សំណួរ` }));

  const seconds =
    attempt.startTime && attempt.endTime && total
      ? Math.round((new Date(attempt.endTime).getTime() - new Date(attempt.startTime).getTime()) / 1000 / total)
      : null;

  return {
    attemptId: attempt.attemptId,
    correct,
    total,
    percent,
    level: levelFor(percent),
    secondsPerQuestion: seconds && seconds > 0 && seconds < 600 ? seconds : null,
    topicScores,
    weakTopics,
    patterns,
  };
}

function toSession(attempt) {
  const savedAnswers = {};
  for (const a of attempt.attemptAnswers) if (a.selectedOptionId != null) savedAnswers[a.questionId] = a.selectedOptionId;
  return {
    attemptId: attempt.attemptId,
    durationMinutes: minutesFor(attempt.attemptAnswers.length),
    startedAt: attempt.startTime,
    savedAnswers,
    questions: attempt.attemptAnswers.map((a) => ({
      questionId: a.questionId,
      questionText: a.question.questionText,
      subjectName: a.question.topic?.subject?.subjectName || "",
      topicName: a.question.topic?.topicName || "",
      // Never send isCorrect before submission.
      options: a.question.answerOptions.map((o) => ({ optionId: o.optionId, optionText: o.optionText })),
    })),
  };
}

export const getPlacementStatus = async (userId, { withPreview = false } = {}) =>
  getPlacementStatusForScope(userId, await getLearnerScope(userId), { withPreview });

/**
 * Same as getPlacementStatus, for callers that already loaded the learner scope.
 * `withPreview` adds the test's subject coverage when no test has started yet.
 */
export const getPlacementStatusForScope = async (userId, scope, { withPreview = false } = {}) => {
  if (!scope.hasSelection) return { status: "none", attemptId: null, result: null, preview: null };
  const attempt = await findCurrentPlacement(userId, scope);
  if (!attempt) {
    return { status: "none", attemptId: null, result: null, preview: withPreview ? await buildPreview(scope) : null };
  }
  if (!attempt.endTime) return { status: "in-progress", attemptId: attempt.attemptId, result: null };
  return { status: "completed", attemptId: attempt.attemptId, result: buildResult(attempt) };
};

/** Coverage of a new test for the candidate's current level and subjects (used before a retake). */
export const getPlacementPreview = async (userId) => {
  const scope = await getLearnerScope(userId);
  if (!scope.hasSelection) throw badRequest("Choose an exam track and subjects before the placement test");
  return buildPreview(scope);
};

/** Latest completed placement result for the candidate's scope, or null. */
export const getLatestPlacementResult = async (userId) => {
  const status = await getPlacementStatus(userId);
  return status.status === "completed" ? status.result : null;
};

/**
 * Picks 15 questions from every subject in scope that has questions — capped
 * by the smallest subject bank, so the split is always equal — spreading
 * across topics before repeating one.
 */
async function pickQuestions(scope) {
  return shuffle(chooseQuestions(scope, await loadUsableQuestions(scope)).map((q) => q.questionId));
}

/** Questions in scope that can be graded (at least two options, one correct). */
async function loadUsableQuestions(scope) {
  const questions = await prisma.question.findMany({
    where: { topicId: { in: scope.topicIds } },
    select: {
      questionId: true,
      topicId: true,
      topic: { select: { subjectId: true } },
      answerOptions: { select: { optionId: true, isCorrect: true } },
    },
  });
  return questions.filter((q) => q.answerOptions.length >= 2 && q.answerOptions.some((o) => o.isCorrect));
}

function chooseQuestions(scope, usable) {
  const streams = scope.subjects
    .map((s) => {
      const byTopic = new Map();
      for (const q of shuffle(usable.filter((u) => u.topic.subjectId === s.subjectId))) {
        if (!byTopic.has(q.topicId)) byTopic.set(q.topicId, []);
        byTopic.get(q.topicId).push(q);
      }
      return { topics: shuffle([...byTopic.values()]) };
    })
    .filter((s) => s.topics.length);
  if (!streams.length) return [];

  // Every subject with questions gets 15, capped by the subject with the fewest
  // usable questions so the split stays equal.
  const smallestBank = Math.min(...streams.map((s) => s.topics.reduce((n, b) => n + b.length, 0)));
  const quota = Math.max(1, Math.min(QUESTIONS_PER_SUBJECT, smallestBank));
  const picked = [];
  for (const stream of streams) {
    // Round-robin the subject's topics so one topic can't fill its whole quota.
    let taken = 0;
    for (let cursor = 0; taken < quota && stream.topics.some((b) => b.length); cursor++) {
      const bucket = stream.topics[cursor % stream.topics.length];
      if (bucket.length) {
        picked.push(bucket.shift());
        taken++;
      }
    }
  }
  return picked;
}

/**
 * What the test will cover before it starts: how many of the questions come
 * from each subject, and how many questions each subject has in the bank.
 * Subjects with nothing in the bank show 0 so the gap is visible.
 */
async function buildPreview(scope) {
  const usable = await loadUsableQuestions(scope);
  const picked = chooseQuestions(scope, usable);
  const countFor = (list, subjectId) => list.filter((q) => q.topic.subjectId === subjectId).length;
  return {
    size: picked.length,
    maxSize: QUESTIONS_PER_SUBJECT * scope.subjects.filter((s) => countFor(usable, s.subjectId) > 0).length,
    minutes: minutesFor(picked.length),
    subjects: scope.subjects.map((s) => ({
      subjectId: s.subjectId,
      subjectName: s.subjectName,
      role: s.role,
      available: countFor(usable, s.subjectId),
      planned: countFor(picked, s.subjectId),
    })),
    missingMajors: scope.coverage.missingMajors,
    usedAllSubjects: scope.coverage.usedAllSubjects,
  };
}

export const startPlacement = async (userId) => {
  const scope = await getLearnerScope(userId);
  if (!scope.hasSelection) throw badRequest("Choose an exam track and subjects before the placement test");

  const current = await findCurrentPlacement(userId, scope);
  const questionIds = current && !current.endTime && current.attemptAnswers.some((a) => a.selectedOptionId != null)
    ? null // answered work is never thrown away: resume as-is
    : await pickQuestions(scope);

  if (current && !current.endTime) {
    // An open test that was never answered and was built under an older test size
    // (e.g. 20 questions before the 15-per-subject rule): rebuild it with a fresh timer.
    if (questionIds?.length && questionIds.length !== current.attemptAnswers.length) {
      await prisma.$transaction([
        prisma.attemptAnswer.deleteMany({ where: { attemptId: current.attemptId } }),
        prisma.attemptAnswer.createMany({
          data: questionIds.map((questionId) => ({ attemptId: current.attemptId, questionId, selectedOptionId: null, isCorrect: null })),
        }),
        prisma.attempt.update({ where: { attemptId: current.attemptId }, data: { startTime: new Date() } }),
      ]);
      const rebuilt = await prisma.attempt.findUnique({ where: { attemptId: current.attemptId }, include: attemptInclude });
      return toSession(rebuilt);
    }
    return toSession(current);
  }

  if (!questionIds?.length) throw badRequest("There are no questions for your subjects yet");

  const attempt = await prisma.attempt.create({
    data: {
      userId,
      attemptType: PLACEMENT_TYPE,
      startTime: new Date(),
      attemptAnswers: { create: questionIds.map((questionId) => ({ questionId, selectedOptionId: null, isCorrect: null })) },
    },
  });
  const full = await prisma.attempt.findUnique({ where: { attemptId: attempt.attemptId }, include: attemptInclude });
  return toSession(full);
};

async function loadOwnOpenAttempt(userId, attemptId) {
  const attempt = await prisma.attempt.findUnique({ where: { attemptId: Number(attemptId) }, include: attemptInclude });
  if (!attempt || attempt.userId !== userId || attempt.attemptType !== PLACEMENT_TYPE) throw notFound("Placement test not found");
  if (attempt.endTime) throw badRequest("This placement test has already been submitted");
  return attempt;
}

export const savePlacementAnswer = async (userId, attemptId, { questionId, selectedOptionId }) => {
  const attempt = await loadOwnOpenAttempt(userId, attemptId);
  const answer = attempt.attemptAnswers.find((a) => a.questionId === Number(questionId));
  if (!answer) throw badRequest("That question is not part of this test");
  const optionId = selectedOptionId == null ? null : Number(selectedOptionId);
  if (optionId != null && !answer.question.answerOptions.some((o) => o.optionId === optionId)) {
    throw badRequest("That option does not belong to the question");
  }
  await prisma.attemptAnswer.update({ where: { answerId: answer.answerId }, data: { selectedOptionId: optionId } });
  return { questionId: answer.questionId, selectedOptionId: optionId };
};

/**
 * Asks Gemini to name mistake patterns from the options the candidate chose.
 * Optional: any failure returns no patterns and the rule-based result stands.
 */
async function analyseMistakes(attempt, topicIds) {
  if (!isGeminiConfigured()) return { patterns: [], reasons: new Map() };
  const wrong = attempt.attemptAnswers
    .filter((a) => !a.isCorrect)
    .slice(0, 20)
    .map((a) => ({
      topicId: a.question.topicId,
      topic: a.question.topic?.topicName,
      question: String(a.question.questionText).slice(0, 300),
      chosen: a.question.answerOptions.find((o) => o.optionId === a.selectedOptionId)?.optionText || null,
      correct: a.question.answerOptions.find((o) => o.isCorrect)?.optionText || null,
    }));
  if (!wrong.length) return { patterns: [], reasons: new Map() };

  try {
    const raw = await generateStructuredContent({
      systemInstruction:
        "You analyse a Cambodian teacher-exam candidate's wrong answers. Reply only with JSON. Write in Khmer. Only describe what the answers show; never invent facts.",
      prompt: `Wrong answers (JSON):\n${JSON.stringify(wrong)}\n\nReturn up to 3 short mistake patterns, and for each topicId one short reason the topic is weak.`,
      schema: {
        type: "OBJECT",
        properties: {
          patterns: { type: "ARRAY", items: { type: "STRING" } },
          reasons: {
            type: "ARRAY",
            items: { type: "OBJECT", properties: { topicId: { type: "INTEGER" }, reason: { type: "STRING" } }, required: ["topicId", "reason"] },
          },
        },
        required: ["patterns", "reasons"],
      },
      temperature: 0.2,
    });
    const patterns = (Array.isArray(raw?.patterns) ? raw.patterns : [])
      .filter((p) => typeof p === "string" && p.trim())
      .slice(0, 3)
      .map((p) => p.trim().slice(0, 200));
    const reasons = new Map(
      (Array.isArray(raw?.reasons) ? raw.reasons : [])
        .filter((r) => topicIds.has(r?.topicId) && typeof r.reason === "string" && r.reason.trim())
        .map((r) => [r.topicId, r.reason.trim().slice(0, 200)])
    );
    return { patterns, reasons };
  } catch (err) {
    console.error("Placement mistake analysis failed, using rule-based result:", err?.message || err);
    return { patterns: [], reasons: new Map() };
  }
}

export const submitPlacement = async (userId, attemptId) => {
  const attempt = await loadOwnOpenAttempt(userId, attemptId);

  const questions = attempt.attemptAnswers.map((a) => ({
    questionId: a.questionId,
    topicId: a.question.topicId,
    explanation: a.question.explanation,
    answerOptions: a.question.answerOptions,
  }));
  const submitted = attempt.attemptAnswers.map((a) => ({ questionId: a.questionId, selectedOptionId: a.selectedOptionId }));
  const { gradedAnswers, topicStats, score } = gradeSubmission(questions, submitted);
  const graded = new Map(gradedAnswers.map((g) => [g.questionId, g]));

  const endTime = new Date();
  await prisma.$transaction([
    ...attempt.attemptAnswers.map((a) =>
      prisma.attemptAnswer.update({
        where: { answerId: a.answerId },
        data: { isCorrect: graded.get(a.questionId)?.isCorrect ?? false, selectedOptionId: graded.get(a.questionId)?.selectedOptionId ?? null },
      })
    ),
    prisma.attempt.update({ where: { attemptId: attempt.attemptId }, data: { score, endTime } }),
  ]);

  await applyProficiencyUpdates(userId, topicStats);
  await refreshWeakAreasFromAttempt(userId, topicStats);
  await prisma.user.update({
    where: { userId },
    data: { knowledgeLevel: levelFor(score) },
  });
  recomputeUserStats(userId).catch((err) => console.error("Failed to recompute stats after placement:", err));

  const fresh = await prisma.attempt.findUnique({ where: { attemptId: attempt.attemptId }, include: attemptInclude });
  const { patterns, reasons } = await analyseMistakes(fresh, new Set(topicStats.map((t) => t.topicId)));
  return buildResult(fresh, patterns, reasons);
};
