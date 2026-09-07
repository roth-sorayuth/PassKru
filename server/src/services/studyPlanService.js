import { prisma } from "../config/prisma.js";
import { recomputeUserStats } from "./userStatsService.js";
import { generateStructuredContent, isGeminiConfigured } from "./geminiService.js";
import { appTodayString } from "../utils/appDate.js";
import { subjectMatchesKeys, describeSubjects, getRulesForExamCode } from "../config/examSubjects.js";
import { canSkipInCourse } from "./masteryService.js";
import { buildTopicQuiz } from "./quizService.js";
import { getDueRetestsForUser } from "./weaknessService.js";

/**
 * Resolves the frontend's target keys (nie/rttc/pttc/kindergarten) against
 * Exam.targetCode rather than hardcoded row ids.
 *
 * The ids differ per environment — this previously mapped to exams 1-3, which
 * don't exist in this database, so every generated course silently targeted
 * nothing and fell back to placeholder topics.
 */
async function resolveExamIdByTarget(targetCode) {
  if (!targetCode) return null;
  const exam = await prisma.exam.findFirst({
    where: { targetCode },
    select: { examId: true },
  });
  return exam?.examId ?? null;
}

async function resolveTargetByExamId(examId) {
  if (!examId) return null;
  const exam = await prisma.exam.findUnique({
    where: { examId },
    select: { targetCode: true },
  });
  return exam?.targetCode ?? null;
}

const DAY_TYPE_PATTERN = ["read", "quiz", "read", "practice", "quiz", "mock", "review"];
const MIN_PLAN_DAYS = 7;
const MAX_PLAN_DAYS = 60;
const NEXT_UP_LIMIT = 8;

function toDateOnlyString(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Adds whole days using UTC-based date components, not the host's local
 * timezone — otherwise a server running outside UTC+0 could drift plan dates
 * by a day depending on where it's deployed. Keeps this in step with
 * appDate.js's shiftAppDateString, which the rest of the app uses for the
 * same "what calendar day is this" bucketing.
 */
function addDays(date, days) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function splitMinutes(total, parts) {
  const safeTotal = Math.max(total, parts * 10);
  const base = Math.floor(safeTotal / parts);
  const minutes = Array(parts).fill(base);
  minutes[parts - 1] += safeTotal - base * parts;
  return minutes;
}

function fallbackTopicsFromText(text) {
  const cleaned = (text || "").trim();
  if (!cleaned) {
    return [{ subjectId: null, subjectName: "General Review", topicId: null, topicName: "Core Concepts", isWeak: false }];
  }
  const parts = cleaned
    .split(/[,&]| and | និង /gi)
    .map((s) => s.trim())
    .filter(Boolean);
  const names = parts.length ? parts : [cleaned];
  return names.map((name) => ({
    subjectId: null,
    subjectName: name,
    topicId: null,
    topicName: "Core Concepts",
    isWeak: false,
  }));
}

async function buildTopicQueue(examId, targetSubjectText, userId, targetSubjectKeys = []) {
  const weakAreas = await prisma.weakArea.findMany({
    where: { userId, status: "open" },
    orderBy: [{ accuracyRate: "asc" }],
    include: { topic: { include: { subject: true } } },
  });

  const weakEntries = weakAreas
    .filter((w) => w.topic)
    .map((w) => ({
      subjectId: w.topic.subjectId,
      subjectName: w.topic.subject.subjectName,
      topicId: w.topicId,
      topicName: w.topic.topicName,
      isWeak: true,
    }));
  const weakTopicIds = new Set(weakEntries.map((w) => w.topicId));

  let subjects = [];
  if (examId) {
    subjects = await prisma.subject.findMany({
      where: { examId },
      include: { topics: true },
      orderBy: { subjectId: "asc" },
    });
  }

  const candidateEntries = [];
  for (const subject of subjects) {
    for (const topic of subject.topics) {
      if (weakTopicIds.has(topic.topicId)) continue;
      candidateEntries.push({
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        topicId: topic.topicId,
        topicName: topic.topicName,
        isWeak: false,
      });
    }
  }

  // Mastery gating ("test out"): a topic the candidate has already
  // demonstrated strong proficiency in doesn't need a fresh module — only
  // applies to non-weak topics, since a WeakArea flag is the stronger signal
  // and should still get revisited even against a stale proficiency score.
  //
  // The bar is masteryService's `mastered`, which also requires repeated
  // evidence. This previously skipped on a bare score of 80, so a topic seen
  // once, on a good day, could be dropped from the course permanently.
  let entries = candidateEntries;
  if (candidateEntries.length) {
    const progressRecords = await prisma.progressRecord.findMany({
      where: { userId, topicId: { in: candidateEntries.map((e) => e.topicId) } },
      select: { topicId: true, proficiencyScore: true, attemptsCount: true },
    });
    const masteredTopicIds = new Set(
      progressRecords
        .filter((p) => canSkipInCourse(p.proficiencyScore, p.attemptsCount))
        .map((p) => p.topicId)
    );
    entries = candidateEntries.filter((e) => !masteredTopicIds.has(e.topicId));
  }

  // The candidate's chosen major(s) come first. Previously the selected
  // subject only acted as a text fallback when the DB returned nothing, so
  // an NIE maths candidate and an NIE history candidate got identical
  // courses. Weak areas still outrank everything — a flagged gap in any
  // subject is more urgent than untouched major content.
  // "generalist" (PTTC/kindergarten) means cover the whole syllabus evenly —
  // partitioning on it would front-load whichever subject its alias happened
  // to match, which is the opposite of the intent.
  const specialisedKeys = (targetSubjectKeys || []).filter((k) => k !== "generalist");

  let ordered = entries;
  if (specialisedKeys.length) {
    const inMajor = [];
    const rest = [];
    for (const e of entries) {
      (subjectMatchesKeys(e.subjectName, specialisedKeys) ? inMajor : rest).push(e);
    }
    // If nothing matched, the chosen subject simply isn't in this exam's
    // syllabus yet — keep the full queue rather than emptying the course.
    ordered = inMajor.length ? [...inMajor, ...rest] : entries;
  }

  // Topics the candidate fixed a while back and hasn't confirmed since sit
  // between weak areas and untouched syllabus: less urgent than a live gap,
  // more urgent than material they've never struggled with.
  const dueRetests = await getDueRetestsForUser(userId);
  const weakTopicIdSet = new Set(weakEntries.map((e) => e.topicId));
  const retestEntries = dueRetests
    .filter((w) => w.topic && !weakTopicIdSet.has(w.topicId))
    .map((w) => ({
      subjectId: w.topic.subjectId,
      subjectName: w.topic.subject?.subjectName ?? "Review",
      topicId: w.topicId,
      topicName: w.topic.topicName,
      isWeak: false,
      isRetest: true,
    }));
  const retestTopicIds = new Set(retestEntries.map((e) => e.topicId));

  const queue = [...weakEntries, ...retestEntries, ...ordered.filter((e) => !retestTopicIds.has(e.topicId))];
  return queue.length ? queue : fallbackTopicsFromText(targetSubjectText);
}

function makeTask(dayIndex, taskIndex, task) {
  return {
    id: `d${dayIndex}-t${taskIndex}`,
    completed: false,
    completedAt: null,
    ...task,
  };
}

function buildDayTasks(dayIndex, dayType, queue, cursor, dailyGoalMinutes, knowledgeLevel) {
  const nextEntry = () => {
    if (!queue.length) {
      return { subjectId: null, subjectName: "General Review", topicId: null, topicName: "Mixed Review" };
    }
    const entry = queue[cursor.i % queue.length];
    cursor.i += 1;
    return entry;
  };

  const tasks = [];
  const M = Math.max(dailyGoalMinutes || 30, 15);

  if (dayType === "read") {
    const includeRecap = M >= 45 && knowledgeLevel !== "advanced";
    const e1 = nextEntry();
    if (includeRecap) {
      const [m1, m2] = splitMinutes(M, 2);
      tasks.push(
        makeTask(dayIndex, 0, {
          type: "read",
          targetAction: "learning",
          subjectId: e1.subjectId,
          subjectName: e1.subjectName,
          topicId: e1.topicId,
          topicName: e1.topicName,
          title: `Study: ${e1.topicName} (${e1.subjectName})`,
          estimatedMinutes: m1,
        }),
        makeTask(dayIndex, 1, {
          type: "quiz",
          targetAction: "quiz",
          subjectId: e1.subjectId,
          subjectName: e1.subjectName,
          topicId: e1.topicId,
          topicName: e1.topicName,
          title: `Quick Recap Quiz: ${e1.topicName}`,
          estimatedMinutes: m2,
        })
      );
    } else {
      tasks.push(
        makeTask(dayIndex, 0, {
          type: "read",
          targetAction: "learning",
          subjectId: e1.subjectId,
          subjectName: e1.subjectName,
          topicId: e1.topicId,
          topicName: e1.topicName,
          title: `Study: ${e1.topicName} (${e1.subjectName})`,
          estimatedMinutes: M,
        })
      );
    }
  } else if (dayType === "quiz") {
    const e1 = nextEntry();
    if (M >= 40) {
      const [m1, m2] = splitMinutes(M, 2);
      tasks.push(
        makeTask(dayIndex, 0, {
          type: "quiz",
          targetAction: "quiz",
          subjectId: e1.subjectId,
          subjectName: e1.subjectName,
          topicId: e1.topicId,
          topicName: e1.topicName,
          title: `Practice Quiz: ${e1.topicName}`,
          estimatedMinutes: m1,
        }),
        makeTask(dayIndex, 1, {
          type: "flashcards",
          targetAction: "flashcards",
          subjectId: e1.subjectId,
          subjectName: e1.subjectName,
          topicId: e1.topicId,
          topicName: e1.topicName,
          title: `Flashcard Review: ${e1.topicName}`,
          estimatedMinutes: m2,
        })
      );
    } else {
      tasks.push(
        makeTask(dayIndex, 0, {
          type: "quiz",
          targetAction: "quiz",
          subjectId: e1.subjectId,
          subjectName: e1.subjectName,
          topicId: e1.topicId,
          topicName: e1.topicName,
          title: `Practice Quiz: ${e1.topicName}`,
          estimatedMinutes: M,
        })
      );
    }
  } else if (dayType === "practice") {
    const e1 = nextEntry();
    tasks.push(
      makeTask(dayIndex, 0, {
        type: "practice",
        targetAction: "past-papers",
        subjectId: e1.subjectId,
        subjectName: e1.subjectName,
        topicId: e1.topicId,
        topicName: e1.topicName,
        title: `Past Paper Practice: ${e1.subjectName}`,
        estimatedMinutes: M,
      })
    );
  } else if (dayType === "mock") {
    tasks.push(
      makeTask(dayIndex, 0, {
        type: "mock",
        targetAction: "mock-exam",
        subjectId: null,
        subjectName: "Full Simulation",
        topicId: null,
        topicName: "All Subjects",
        title: "Full Mock Exam Simulation",
        estimatedMinutes: M,
      })
    );
  } else {
    // review day: revisit a weak/earlier topic + light flashcard recap
    const e1 = nextEntry();
    const e2 = nextEntry();
    const [m1, m2] = splitMinutes(M, 2);
    tasks.push(
      makeTask(dayIndex, 0, {
        type: "quiz",
        targetAction: "quiz",
        subjectId: e1.subjectId,
        subjectName: e1.subjectName,
        topicId: e1.topicId,
        topicName: e1.topicName,
        title: `Weekly Review Quiz: ${e1.topicName}`,
        estimatedMinutes: m1,
      }),
      makeTask(dayIndex, 1, {
        type: "flashcards",
        targetAction: "flashcards",
        subjectId: e2.subjectId,
        subjectName: e2.subjectName,
        topicId: e2.topicId,
        topicName: e2.topicName,
        title: `Flashcard Recap: ${e2.topicName}`,
        estimatedMinutes: m2,
      })
    );
  }

  return tasks;
}

/**
 * Rule-based study plan generator (algorithm v1).
 *
 * Deterministically builds the day-by-day schedule from the candidate's
 * target exam subjects/topics, known weak areas, and daily time budget. Used
 * as the fallback when Gemini is unconfigured or a generation attempt fails,
 * so plan generation never hard-fails for the user. See buildAIPlanItems for
 * the LLM-backed generator, which shares this function's output contract
 * (array of day objects) so generatePlanForUser doesn't need to branch on it.
 */
async function buildPlanItems({ queue, knowledgeLevel, dailyGoalMinutes, startDate, planDays }) {
  const cursor = { i: 0 };

  const days = [];
  for (let dayIndex = 0; dayIndex < planDays; dayIndex++) {
    const date = addDays(startDate, dayIndex);
    const dayType = DAY_TYPE_PATTERN[dayIndex % DAY_TYPE_PATTERN.length];
    days.push({
      date: toDateOnlyString(date),
      dayIndex,
      dayType,
      tasks: buildDayTasks(dayIndex, dayType, queue, cursor, dailyGoalMinutes, knowledgeLevel),
    });
  }

  return days;
}

const AI_DAY_TYPES = ["read", "quiz", "practice", "mock", "review"];
const AI_TASK_TYPES = ["read", "quiz", "practice", "mock", "flashcards"];
const AI_TARGET_ACTIONS = ["learning", "quiz", "past-papers", "mock-exam", "flashcards"];
const DEFAULT_TARGET_ACTION_BY_TYPE = {
  read: "learning",
  quiz: "quiz",
  practice: "past-papers",
  mock: "mock-exam",
  flashcards: "flashcards",
};
const MAX_TASK_MINUTES = 180;
const MIN_TASK_MINUTES = 10;
const MAX_QUEUE_ENTRIES_FOR_PROMPT = 80;

const AI_PLAN_SCHEMA = {
  type: "OBJECT",
  properties: {
    days: {
      type: "ARRAY",
      description: "One entry per study day, in order starting from day 1.",
      items: {
        type: "OBJECT",
        properties: {
          dayType: { type: "STRING", enum: AI_DAY_TYPES },
          tasks: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                type: { type: "STRING", enum: AI_TASK_TYPES },
                topicId: { type: "INTEGER", nullable: true, description: "Must be one of the provided topic IDs, or null for a general/mixed task." },
                subjectName: { type: "STRING" },
                topicName: { type: "STRING" },
                title: { type: "STRING" },
                estimatedMinutes: { type: "INTEGER" },
              },
              required: ["type", "subjectName", "topicName", "title", "estimatedMinutes"],
            },
          },
        },
        required: ["dayType", "tasks"],
      },
    },
  },
  required: ["days"],
};

function clampInt(value, min, max, fallback) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

function truncate(text, maxLen) {
  const s = String(text ?? "").trim();
  return s.length > maxLen ? s.slice(0, maxLen).trim() : s;
}

function buildAIPlanPrompt({ targetExam, targetExamLabel, queue, dailyGoalMinutes, knowledgeLevel, planDays, targetSubjects = [] }) {
  const topicLines = queue
    .slice(0, MAX_QUEUE_ENTRIES_FOR_PROMPT)
    .map((e) => `- topicId=${e.topicId ?? "null"} | subject="${e.subjectName}" | topic="${e.topicName}"${e.isWeak ? " | WEAK AREA" : ""}`)
    .join("\n");

  // Name the candidate's actual chosen major(s) and the split to hold them
  // to, taken from the same config the wizard renders from — a generic
  // "e.g. Math + ICT" hint let the model pick whatever it liked.
  const chosen = describeSubjects(targetSubjects).filter((s) => s.key !== "generalist");
  const chosenLabel = chosen.map((s) => `${s.en} (${s.km})`).join(" + ");
  const weighting = getRulesForExamCode(targetExam)?.weighting;

  let examTypeGuideline = "";
  if (targetExam === "nie") {
    examTypeGuideline = chosenLabel
      ? `- Upper Secondary (NIE): The candidate's single major is ${chosenLabel}. Devote roughly ${weighting?.major ?? 80}% of tasks to that subject and about ${weighting?.pedagogy ?? 20}% to pedagogy/general teaching knowledge. Do not spread the plan evenly across unrelated subjects.`
      : "- Upper Secondary (NIE): Focus the plan deeply on the candidate's single major subject.";
  } else if (targetExam === "rttc") {
    examTypeGuideline = chosen.length === 2
      ? `- Lower Secondary (RTTC): The candidate holds a dual major of ${chosenLabel}. Split tasks roughly ${weighting?.major ?? 40}% / ${weighting?.second ?? 40}% between those two subjects, with about ${weighting?.pedagogy ?? 20}% pedagogy. Both majors must get comparable coverage — do not favour one.`
      : "- Lower Secondary (RTTC): The candidate has a dual-major pairing. Split the plan evenly across the two subjects.";
  } else if (targetExam === "pttc" || targetExam === "kindergarten") {
    examTypeGuideline = "- Primary (PTTC) / Kindergarten generalist: Do NOT specialise. Cover all fundamental primary subjects broadly (Khmer, Math, Basic Science, Social Studies, Art, PE) plus pedagogy.";
  }

  return [
    `Candidate preparing for: ${targetExamLabel}`,
    `Self-reported knowledge level: ${knowledgeLevel}`,
    `Available study time: ${dailyGoalMinutes} minutes/day`,
    `Plan length: exactly ${planDays} days`,
    "",
    "Available syllabus topics (use topicId verbatim when a task targets one of these; use null only for a general/mixed-review task):",
    topicLines || "(no syllabus topics available — use null topicId and general subject/topic names)",
    "",
    "Design a day-by-day study plan as JSON matching the response schema. Guidelines:",
    "- Prioritize WEAK AREA topics earlier in the plan.",
    "- Vary dayType across read/quiz/practice/mock/review so the plan isn't repetitive.",
    "- Include periodic 'mock' full-simulation days for plans longer than a week.",
    "- Each day's tasks should sum to roughly the available daily study time (some variance is fine).",
    "- Beginners get more 'read' days; advanced learners get more 'quiz'/'practice'/'mock' days.",
    examTypeGuideline,
    `- Produce exactly ${planDays} day entries, one per study day in order.`,
  ].filter(Boolean).join("\n");
}

/**
 * LLM-backed study plan generator (algorithm v2, Gemini).
 *
 * Sends the candidate's real syllabus topics and weak areas to Gemini and
 * asks it to design the day-by-day schedule, so ordering, pacing and day
 * variety reflect actual judgment instead of the fixed DAY_TYPE_PATTERN
 * rotation. The model's response is never trusted as-is: every field is
 * validated/coerced below, and topicId is only honored when it matches a
 * real topic from \`queue\` — the same contract buildPlanItems produces, so
 * generatePlanForUser can fall back to it transparently on any failure.
 */
async function buildAIPlanItems({ queue, targetExam, targetExamLabel, knowledgeLevel, dailyGoalMinutes, startDate, planDays, targetSubjects = [] }) {
  const cursor = { i: 0 };

  const topicById = new Map(queue.filter((e) => e.topicId != null).map((e) => [e.topicId, e]));
  const byNormalizedName = new Map(
    queue.map((e) => [`${e.subjectName}::${e.topicName}`.toLowerCase().trim(), e])
  );

  const raw = await generateStructuredContent({
    systemInstruction:
      "You are a study-plan designer for teacher-certification exam candidates in Cambodia. Always respond with the exact JSON shape requested, no prose.",
    // targetExam was previously omitted here, so examTypeGuideline was always
    // empty and the model never received the per-track weighting rules.
    prompt: buildAIPlanPrompt({ targetExam, targetExamLabel, queue, dailyGoalMinutes, knowledgeLevel, planDays, targetSubjects }),
    schema: AI_PLAN_SCHEMA,
  });

  const rawDays = Array.isArray(raw?.days) ? raw.days.slice(0, planDays) : [];
  if (rawDays.length < Math.min(planDays, MIN_PLAN_DAYS)) {
    const error = new Error("Gemini returned too few plan days");
    error.code = "GEMINI_INVALID_PLAN";
    throw error;
  }

  const resolveEntry = (task) => {
    if (task?.topicId != null && topicById.has(task.topicId)) return topicById.get(task.topicId);
    const key = `${truncate(task?.subjectName, 150)}::${truncate(task?.topicName, 150)}`.toLowerCase();
    if (byNormalizedName.has(key)) return byNormalizedName.get(key);
    return null;
  };

  const days = rawDays.map((rawDay, dayIndex) => {
    const date = addDays(startDate, dayIndex);
    const dayType = AI_DAY_TYPES.includes(rawDay?.dayType) ? rawDay.dayType : "review";

    const rawTasks = Array.isArray(rawDay?.tasks) ? rawDay.tasks : [];
    let tasks = rawTasks.slice(0, 4).map((rawTask, taskIndex) => {
      const type = AI_TASK_TYPES.includes(rawTask?.type) ? rawTask.type : "read";
      const targetAction = AI_TARGET_ACTIONS.includes(rawTask?.targetAction)
        ? rawTask.targetAction
        : DEFAULT_TARGET_ACTION_BY_TYPE[type];
      const entry = resolveEntry(rawTask);
      const subjectId = entry ? entry.subjectId : null;
      const subjectName = entry ? entry.subjectName : truncate(rawTask?.subjectName, 150) || "General Review";
      const topicId = entry ? entry.topicId : null;
      const topicName = entry ? entry.topicName : truncate(rawTask?.topicName, 150) || "Mixed Review";
      const title = truncate(rawTask?.title, 160) || `${type === "read" ? "Study" : "Practice"}: ${topicName}`;
      const estimatedMinutes = clampInt(rawTask?.estimatedMinutes, MIN_TASK_MINUTES, MAX_TASK_MINUTES, Math.max(dailyGoalMinutes || 30, 15));

      return makeTask(dayIndex, taskIndex, {
        type,
        targetAction,
        subjectId,
        subjectName,
        topicId,
        topicName,
        title,
        estimatedMinutes,
      });
    });

    if (tasks.length === 0) {
      tasks = buildDayTasks(dayIndex, dayType, queue, cursor, dailyGoalMinutes, knowledgeLevel);
    }

    return { date: toDateOnlyString(date), dayIndex, dayType, tasks };
  });

  return days;
}

function groupBySubjectId(list) {
  const map = new Map();
  for (const item of list) {
    const key = item.subjectId;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

/**
 * Attaches real, linkable content to each task after generation: a
 * preparation paper (never a past-exam paper — paperType is filtered to
 * "prepare-paper") for practice tasks, a real quiz for quiz tasks, and a real
 * mock exam for mock tasks.
 *
 * Quizzes resolve by topic first and fall back to the task's subject. Papers
 * remain subject-level (PastPaper has no topic relation). The topic-first
 * step matters beyond the review loop: a task titled "Practice Quiz:
 * {topicName}" used to be handed whichever subject quiz came next in the
 * rotation, so its questions frequently had nothing to do with the topic
 * named on the task — and the resulting scores were then attributed to
 * whatever topics those questions did cover.
 *
 * Round-robins across a subject's available items so consecutive modules on
 * the same subject don't all point at the same paper or quiz. Tasks with no
 * match keep today's generic page-link behavior.
 */
async function attachRealContent(days, examId) {
  const subjectIds = [
    ...new Set(days.flatMap((d) => d.tasks.map((t) => t.subjectId)).filter((id) => id != null)),
  ];

  const [papers, quizzes, mockExams] = await Promise.all([
    subjectIds.length
      ? prisma.pastPaper.findMany({
          where: { subjectId: { in: subjectIds }, paperType: "prepare-paper" },
          orderBy: { paperId: "asc" },
        })
      : Promise.resolve([]),
    subjectIds.length
      ? prisma.quiz.findMany({
          // Catalogue quizzes only — another candidate's generated review
          // quiz is not course content.
          where: { subjectId: { in: subjectIds }, generatedForUserId: null },
          orderBy: { quizId: "asc" },
        })
      : Promise.resolve([]),
    examId
      ? prisma.mockExam.findMany({ where: { examId }, orderBy: { mockExamId: "asc" } })
      : Promise.resolve([]),
  ]);

  const papersBySubject = groupBySubjectId(papers);
  // Subject-wide quizzes stay in the round-robin pool; topic-scoped ones are
  // indexed separately so a task naming a topic can be matched exactly.
  const quizzesBySubject = groupBySubjectId(quizzes.filter((q) => q.topicId == null));
  const quizByTopic = new Map();
  for (const q of quizzes) {
    if (q.topicId != null && !quizByTopic.has(q.topicId)) quizByTopic.set(q.topicId, q);
  }
  const paperCursor = new Map();
  const quizCursor = new Map();
  let mockCursor = 0;

  const nextFrom = (list, cursorMap, key) => {
    if (!list || !list.length) return null;
    const i = cursorMap.get(key) || 0;
    cursorMap.set(key, i + 1);
    return list[i % list.length];
  };

  for (const day of days) {
    for (const task of day.tasks) {
      if (task.targetAction === "past-papers" && task.subjectId != null) {
        const paper = nextFrom(papersBySubject.get(task.subjectId), paperCursor, task.subjectId);
        if (paper) {
          task.paperId = paper.paperId;
          task.paperTitle = paper.title;
          task.fileUrl = paper.fileUrl;
        }
      } else if (task.targetAction === "quiz") {
        const topicQuiz = task.topicId != null ? quizByTopic.get(task.topicId) : null;
        const quiz =
          topicQuiz || (task.subjectId != null ? nextFrom(quizzesBySubject.get(task.subjectId), quizCursor, task.subjectId) : null);
        if (quiz) {
          task.quizId = quiz.quizId;
          // Tells the UI whether this quiz actually covers the topic on the
          // task, rather than being a subject-wide stand-in.
          task.quizScope = quiz.topicId != null ? "topic" : "subject";
        }
      } else if (task.targetAction === "mock-exam" && mockExams.length) {
        task.mockExamId = mockExams[mockCursor % mockExams.length].mockExamId;
        mockCursor += 1;
      }
    }
  }

  return days;
}

/**
 * Ranks incomplete tasks by *current* weak-area/proficiency state rather than
 * the order they were baked in at generation time — so finishing a quiz that
 * clears a weak area (or a new one showing up) actually reprioritizes what
 * "Next Up" surfaces, without needing to regenerate or reorder the course's
 * stored module list (which stays a stable, generation-time structural view).
 */
export async function rankNextUp(items, userId) {
  const days = items?.days;
  if (!Array.isArray(days)) return [];

  const incomplete = [];
  for (const day of days) {
    for (const task of day.tasks || []) {
      // Mastery-skipped tasks are still shown on the course page (struck
      // through, as evidence the course reacted) but must never be offered as
      // the next thing to do.
      if (!task.completed && !task.skipped) incomplete.push({ task, dayDate: day.date });
    }
  }
  if (!incomplete.length) return [];

  const topicIds = [...new Set(incomplete.map((e) => e.task.topicId).filter((id) => id != null))];
  const weakAreas = topicIds.length
    ? await prisma.weakArea.findMany({
        where: { userId, topicId: { in: topicIds }, status: "open" },
        select: { topicId: true, accuracyRate: true },
      })
    : [];
  const weakRankByTopic = new Map(weakAreas.map((w) => [w.topicId, Number(w.accuracyRate ?? 100)]));

  return incomplete
    .map((entry, originalIndex) => ({
      ...entry,
      weakRank: weakRankByTopic.has(entry.task.topicId) ? weakRankByTopic.get(entry.task.topicId) : null,
      originalIndex,
    }))
    .sort((a, b) => {
      const aWeak = a.weakRank !== null;
      const bWeak = b.weakRank !== null;
      if (aWeak && bWeak) return a.weakRank - b.weakRank;
      if (aWeak !== bWeak) return aWeak ? -1 : 1;
      return a.originalIndex - b.originalIndex;
    })
    .slice(0, NEXT_UP_LIMIT)
    .map(({ task, dayDate }) => ({ task, dayDate }));
}

/** Most review tasks the loop will add to any single day. */
const MAX_REVIEW_TASKS_PER_DAY = 2;
/** Most topics one attempt can trigger review for, worst-performing first. */
const MAX_REVIEW_TOPICS_PER_ATTEMPT = 3;

/** Exported for tests: id allocation must never collide with generated ids. */
export function nextTaskSequence(days) {
  // Injected ids must not collide with generated `d{n}-t{i}` ids, nor with
  // each other across repeated injections, so they carry their own counter
  // seeded past whatever the plan already holds.
  let max = 0;
  for (const day of days) {
    for (const task of day.tasks || []) {
      const match = /^d\d+-r\d+-(\d+)$/.exec(task.id || "");
      if (match) max = Math.max(max, Number(match[1]));
    }
  }
  return max + 1;
}

function makeReviewTasks(topic, dayIndex, seq, minutes) {
  const half = Math.max(10, Math.round(minutes / 2));
  const base = {
    origin: "review",
    reviewOfTopicId: topic.topicId,
    subjectId: topic.subjectId,
    subjectName: topic.subjectName,
    topicId: topic.topicId,
    topicName: topic.topicName,
    completed: false,
    completedAt: null,
    reason: "weak-area",
    reasonDetail: `Accuracy ${topic.accuracy}% on your last quiz`,
    addedAt: new Date().toISOString(),
  };
  return [
    {
      ...base,
      id: `d${dayIndex}-r${topic.topicId}-${seq}`,
      type: "read",
      targetAction: "learning",
      title: `Review: ${topic.topicName}`,
      estimatedMinutes: half,
    },
    {
      ...base,
      id: `d${dayIndex}-r${topic.topicId}-${seq + 1}`,
      type: "quiz",
      targetAction: "quiz",
      title: `Retest: ${topic.topicName}`,
      estimatedMinutes: half,
    },
  ];
}

/**
 * Feeds a graded attempt's mastery outcome back into the active course — the
 * loop's closing edge (Weak → Review → Study Path).
 *
 * Before this, a quiz could flag a brand-new weak area and the course would
 * not change at all: `rankNextUp` reorders tasks that already exist, so a
 * topic whose tasks were all completed produced no further work and the
 * candidate had to regenerate the whole course by hand to get any.
 *
 * Two things happen here:
 *  - a weak topic gets a Review + Retest pair inserted near the front of the
 *    remaining course, pointed at a topic-scoped quiz;
 *  - a newly mastered topic has its remaining untouched tasks marked skipped,
 *    so the course stops teaching what the candidate has demonstrated.
 *
 * `proficiencyUpdates` comes from attemptService.applyProficiencyUpdates and
 * already carries mastery before/after per topic.
 */
export async function applyLoopToActivePlan(userId, proficiencyUpdates) {
  if (!Array.isArray(proficiencyUpdates) || !proficiencyUpdates.length) return null;

  const plan = await prisma.studyPlan.findFirst({
    where: { userId, status: "active" },
    orderBy: { planId: "desc" },
  });
  if (!plan?.items?.days?.length) return null;

  const days = plan.items.days.map((day) => ({ ...day, tasks: [...(day.tasks || [])] }));
  const dailyGoalMinutes = plan.items.dailyGoalMinutes || 30;

  // --- mastered topics: stop teaching what's already known ---------------
  const masteredTopicIds = new Set(
    proficiencyUpdates.filter((u) => u.masteryAfter?.state === "mastered").map((u) => u.topicId)
  );
  const skippedTasks = [];
  if (masteredTopicIds.size) {
    for (const day of days) {
      day.tasks = day.tasks.map((task) => {
        // Only untouched future work is skippable. A task already completed
        // stays completed, and one already skipped isn't skipped twice.
        if (task.completed || task.skipped) return task;
        if (task.topicId == null || !masteredTopicIds.has(task.topicId)) return task;
        skippedTasks.push({ id: task.id, title: task.title, topicId: task.topicId });
        return { ...task, skipped: true, skipReason: "mastered", skippedAt: new Date().toISOString() };
      });
    }
  }

  // --- weak topics: add review work -------------------------------------
  const weakUpdates = proficiencyUpdates
    .filter((u) => u.masteryAfter?.branch === "weak" && u.topicId != null)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, MAX_REVIEW_TOPICS_PER_ATTEMPT);

  // A topic already carrying unfinished review work doesn't need more — two
  // failures in a row should sharpen the existing review, not stack duplicates.
  const alreadyUnderReview = new Set(
    days.flatMap((d) => (d.tasks || []).filter((t) => t.origin === "review" && !t.completed).map((t) => t.reviewOfTopicId))
  );

  const addedTasks = [];
  let seq = nextTaskSequence(days);

  for (const update of weakUpdates) {
    if (alreadyUnderReview.has(update.topicId)) continue;

    const target = findReviewSlot(days, dailyGoalMinutes);
    if (!target) break;

    const quiz = await buildTopicQuiz({
      userId,
      topicId: update.topicId,
      reason: "weak-area",
    }).catch((err) => {
      console.error(`Failed to build review quiz for topic ${update.topicId}:`, err);
      return null;
    });

    const tasks = makeReviewTasks(
      {
        topicId: update.topicId,
        topicName: update.topicName || "This topic",
        subjectId: update.subjectId,
        subjectName: update.subjectName || "Review",
        accuracy: update.accuracy,
      },
      target.day.dayIndex ?? 0,
      seq,
      dailyGoalMinutes
    );
    // A topic with no questions yet still gets the reading half — sending the
    // candidate back to the material is useful even when we can't retest it.
    if (quiz) tasks[1].quizId = quiz.quizId;
    else tasks.pop();

    target.day.tasks.push(...tasks);
    addedTasks.push(...tasks.map((t) => ({ id: t.id, title: t.title, topicId: t.topicId, date: target.day.date })));
    alreadyUnderReview.add(update.topicId);
    seq += 2;
  }

  if (!addedTasks.length && !skippedTasks.length) return null;

  await prisma.studyPlan.update({
    where: { planId: plan.planId },
    data: { items: { ...plan.items, days } },
  });

  return { addedTasks, skippedTasks };
}

/**
 * Picks where review work should land: the earliest day that still has
 * unfinished work and room inside the daily budget.
 *
 * Appending to the end of the course would be simpler, but review that
 * arrives weeks after the failure it responds to isn't review — the whole
 * point is that it lands while the mistake is still fresh.
 *
 * When every open day is already full, the review goes on the earliest open
 * day anyway and that day runs over its minute budget. Inserting a dedicated
 * day mid-course is the tempting alternative, but plan days are keyed by
 * date on the client and dated one-per-day, so a day inserted between two
 * existing ones necessarily duplicates the following day's date and index —
 * which breaks day lookup and renders two rows for the same day. Overshooting
 * one day's budget is a much smaller cost than a corrupted course structure.
 * Appending past the end is safe, so the fully-complete case below still
 * gets its own day.
 */
export function findReviewSlot(days, dailyGoalMinutes) {
  const unfinished = days.filter((d) => (d.tasks || []).some((t) => !t.completed && !t.skipped));

  if (!unfinished.length) {
    // Everything is done: the course has no open day left, so give the review
    // its own day rather than dropping it. Appending past the last day can't
    // collide with an existing date or index.
    const last = days[days.length - 1];
    const newDay = {
      date: toDateOnlyString(addDays(new Date(`${last.date}T00:00:00.000Z`), 1)),
      dayIndex: (last.dayIndex ?? days.length - 1) + 1,
      dayType: "review",
      tasks: [],
    };
    days.push(newDay);
    return { day: newDay };
  }

  for (const day of unfinished) {
    const load = (day.tasks || [])
      .filter((t) => !t.completed && !t.skipped)
      .reduce((sum, t) => sum + (Number(t.estimatedMinutes) || 0), 0);
    const reviewCount = (day.tasks || []).filter((t) => t.origin === "review").length;
    if (load < dailyGoalMinutes && reviewCount < MAX_REVIEW_TASKS_PER_DAY * 2) {
      return { day };
    }
  }

  return { day: unfinished[0], overBudget: true };
}

export const getActivePlanForUser = async (userId) => {
  const plan = await prisma.studyPlan.findFirst({
    where: { userId, status: "active" },
    orderBy: { planId: "desc" },
  });
  if (!plan) return plan;
  const nextUp = await rankNextUp(plan.items, userId);
  return { ...plan, nextUp };
};

export const listPlansForUser = async (userId) => {
  return prisma.studyPlan.findMany({
    where: { userId },
    orderBy: { planId: "desc" },
    select: { planId: true, startDate: true, endDate: true, status: true },
  });
};

export const generatePlanForUser = async (userId, input) => {
  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const targetExam = input.targetExam || (await resolveTargetByExamId(user.targetExamId)) || null;
  const examId = input.targetExam
    ? await resolveExamIdByTarget(input.targetExam)
    : user.targetExamId || null;

  if (input.targetExam && !examId) {
    const error = new Error(`Unknown target exam "${input.targetExam}"`);
    error.statusCode = 400;
    throw error;
  }

  const knowledgeLevel = input.knowledgeLevel || user.knowledgeLevel || "intermediate";
  const dailyGoalMinutes = Number(input.dailyGoalMinutes) || user.dailyGoalMinutes || 30;
  // targetSubjects (array) is the source of truth; a legacy single
  // targetSubject string is accepted and lifted into the array so older
  // callers keep working. The legacy column is still written alongside so
  // anything not yet migrated (admin dashboard columns, older reads) is
  // unaffected.
  const targetSubjects =
    input.targetSubjects !== undefined
      ? (input.targetSubjects || []).filter(Boolean)
      : input.targetSubject !== undefined
        ? [input.targetSubject].filter(Boolean)
        : (user.targetSubjects?.length ? user.targetSubjects : [user.targetSubject].filter(Boolean));
  const targetSubject = targetSubjects[0] || null;

  await prisma.user.update({
    where: { userId },
    data: {
      targetExamId: examId || undefined,
      targetSubject: targetSubject || undefined,
      targetSubjects,
      knowledgeLevel,
      dailyGoalMinutes,
      availableStudyHours: input.availableStudyHours !== undefined ? input.availableStudyHours : undefined,
    },
  });

  // UTC-midnight of the candidate's current app-calendar day (Cambodia,
  // UTC+7 by default — see appDate.js), not the host server's local midnight.
  // Keeps generated plan dates aligned with the dashboard's activity/streak
  // day bucketing regardless of what timezone this process runs in.
  const startDate = new Date(`${appTodayString()}T00:00:00.000Z`);

  // examDate is optional, informational pacing only — never required to
  // generate a course. Some years there's no official exam announcement at
  // all, so the course has to stand on its own without one.
  let examDate = input.examDate ? new Date(input.examDate) : null;
  if (examDate && isNaN(examDate.getTime())) examDate = null;

  // Smart regenerate: unless the candidate explicitly asked for a clean
  // slate, carry forward already-completed tasks from the current course
  // instead of discarding progress on every "Generate & Save" click. Mastery
  // gating above already drops newly-mastered topics from the fresh queue,
  // so the regenerated tail naturally avoids re-covering finished ground.
  const resetProgress = input.resetProgress === true;
  const existingActivePlan = resetProgress
    ? null
    : await prisma.studyPlan.findFirst({ where: { userId, status: "active" }, orderBy: { planId: "desc" } });

  const carriedDays = [];
  if (existingActivePlan?.items?.days) {
    for (const day of existingActivePlan.items.days) {
      const completedTasks = (day.tasks || []).filter((t) => t.completed);
      if (completedTasks.length) carriedDays.push({ ...day, tasks: completedTasks });
    }
  }
  const courseStartDate = existingActivePlan?.startDate ? new Date(existingActivePlan.startDate) : startDate;

  const queue = await buildTopicQueue(examId, targetSubject, userId, targetSubjects);

  // Course length: if the candidate happens to know their exam date this
  // year, use it to pace the course toward it; otherwise size the course off
  // how much syllabus there actually is to cover (roughly one topic per day)
  // rather than an arbitrary flat window.
  let planDays;
  if (examDate) {
    const diffDays = Math.ceil((examDate.getTime() - startDate.getTime()) / 86400000);
    planDays = Math.min(Math.max(diffDays, MIN_PLAN_DAYS), MAX_PLAN_DAYS);
  } else {
    planDays = Math.min(Math.max(queue.length, MIN_PLAN_DAYS), MAX_PLAN_DAYS);
  }

  let days;
  let algorithmVersion;

  if (isGeminiConfigured()) {
    try {
      const exam = examId ? await prisma.exam.findUnique({ where: { examId } }) : null;
      const targetExamLabel = exam?.examName || targetExam || "the candidate's target teacher-certification exam";

      days = await buildAIPlanItems({
        queue,
        targetExam,
        targetExamLabel,
        targetSubjects,
        knowledgeLevel,
        dailyGoalMinutes,
        startDate,
        planDays,
      });
      algorithmVersion = "gemini-v1";
    } catch (aiError) {
      console.error("Gemini study plan generation failed, falling back to rule-based generator:", aiError);
    }
  }

  if (!days) {
    days = await buildPlanItems({
      queue,
      knowledgeLevel,
      dailyGoalMinutes,
      startDate,
      planDays,
    });
    algorithmVersion = "rule-based-v1";
  }

  days = await attachRealContent(days, examId);

  // Renumber dayIndex only — carried days keep their original dates
  // (completedAt/history untouched); the fresh tail's dates already run from
  // today (startDate above), which is when the remaining work actually
  // starts, regardless of how long ago the course itself began.
  const renumberedCarried = carriedDays.map((day, i) => ({ ...day, dayIndex: i }));
  const renumberedNew = days.map((day, i) => ({ ...day, dayIndex: renumberedCarried.length + i }));
  const combinedDays = [...renumberedCarried, ...renumberedNew];

  const endDate = addDays(startDate, planDays - 1);

  const items = {
    algorithmVersion,
    generatedAt: new Date().toISOString(),
    examDate: examDate ? toDateOnlyString(examDate) : null,
    dailyGoalMinutes,
    knowledgeLevel,
    // Persisted so the wizard can re-open pre-filled with the majors this
    // course was actually built for, not just the user's current profile.
    targetSubjects,
    days: combinedDays,
  };

  const [, plan] = await prisma.$transaction([
    prisma.studyPlan.updateMany({
      where: { userId, status: "active" },
      data: { status: "archived" },
    }),
    prisma.studyPlan.create({
      data: {
        userId,
        startDate: courseStartDate,
        endDate,
        status: "active",
        items,
      },
    }),
  ]);

  return plan;
};

export const setTaskCompletion = async (userId, planId, taskId, completed) => {
  const plan = await prisma.studyPlan.findUnique({ where: { planId } });
  if (!plan || plan.userId !== userId) {
    const error = new Error("Study plan not found");
    error.statusCode = 404;
    throw error;
  }

  const items = plan.items || { days: [] };
  let found = false;
  const days = (items.days || []).map((day) => ({
    ...day,
    tasks: (day.tasks || []).map((task) => {
      if (task.id === taskId) {
        found = true;
        return { ...task, completed, completedAt: completed ? new Date().toISOString() : null };
      }
      return task;
    }),
  }));

  if (!found) {
    const error = new Error("Study task not found");
    error.statusCode = 404;
    throw error;
  }

  const updated = await prisma.studyPlan.update({
    where: { planId },
    data: { items: { ...items, days } },
  });

  // Ticking a task off is study activity, so refresh the user's cached streak
  // and study hours now rather than waiting for their next dashboard visit —
  // but don't make the toggle response wait on it, since nothing below uses
  // the result and every extra round trip costs real cross-region latency.
  recomputeUserStats(userId).catch((err) => console.error("Failed to recompute user stats after task toggle:", err));

  return updated;
};
