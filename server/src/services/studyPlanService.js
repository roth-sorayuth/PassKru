import { prisma } from "../config/prisma.js";
import { recomputeUserStats } from "./userStatsService.js";
import { generateStructuredContent, isGeminiConfigured } from "./geminiService.js";
import { appTodayString } from "../utils/appDate.js";

const EXAM_ID_BY_TARGET = { nie: 1, rttc: 2, pttc: 3, kindergarten: 4 };
const TARGET_BY_EXAM_ID = { 1: "nie", 2: "rttc", 3: "pttc", 4: "kindergarten" };

const DAY_TYPE_PATTERN = ["read", "quiz", "read", "practice", "quiz", "mock", "review"];
const DEFAULT_PLAN_DAYS = 14;
const MIN_PLAN_DAYS = 7;
const MAX_PLAN_DAYS = 60;

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

async function buildTopicQueue(examId, targetSubjectText, userId) {
  const weakAreas = await prisma.weakArea.findMany({
    where: { userId },
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

  const entries = [];
  for (const subject of subjects) {
    for (const topic of subject.topics) {
      if (weakTopicIds.has(topic.topicId)) continue;
      entries.push({
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        topicId: topic.topicId,
        topicName: topic.topicName,
        isWeak: false,
      });
    }
  }

  const queue = [...weakEntries, ...entries];
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
async function buildPlanItems({ examId, targetSubjectText, knowledgeLevel, dailyGoalMinutes, startDate, planDays, userId }) {
  const queue = await buildTopicQueue(examId, targetSubjectText, userId);
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

function buildAIPlanPrompt({ targetExamLabel, queue, dailyGoalMinutes, knowledgeLevel, planDays }) {
  const topicLines = queue
    .slice(0, MAX_QUEUE_ENTRIES_FOR_PROMPT)
    .map((e) => `- topicId=${e.topicId ?? "null"} | subject="${e.subjectName}" | topic="${e.topicName}"${e.isWeak ? " | WEAK AREA" : ""}`)
    .join("\n");

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
    `- Produce exactly ${planDays} day entries, one per study day in order.`,
  ].join("\n");
}

/**
 * LLM-backed study plan generator (algorithm v2, Gemini).
 *
 * Sends the candidate's real syllabus topics and weak areas to Gemini and
 * asks it to design the day-by-day schedule, so ordering, pacing and day
 * variety reflect actual judgment instead of the fixed DAY_TYPE_PATTERN
 * rotation. The model's response is never trusted as-is: every field is
 * validated/coerced below, and topicId is only honored when it matches a
 * real topic from `queue` — the same contract buildPlanItems produces, so
 * generatePlanForUser can fall back to it transparently on any failure.
 */
async function buildAIPlanItems({ examId, targetExamLabel, targetSubjectText, knowledgeLevel, dailyGoalMinutes, startDate, planDays, userId }) {
  const queue = await buildTopicQueue(examId, targetSubjectText, userId);
  const cursor = { i: 0 };

  const topicById = new Map(queue.filter((e) => e.topicId != null).map((e) => [e.topicId, e]));
  const byNormalizedName = new Map(
    queue.map((e) => [`${e.subjectName}::${e.topicName}`.toLowerCase().trim(), e])
  );

  const raw = await generateStructuredContent({
    systemInstruction:
      "You are a study-plan designer for teacher-certification exam candidates in Cambodia. Always respond with the exact JSON shape requested, no prose.",
    prompt: buildAIPlanPrompt({ targetExamLabel, queue, dailyGoalMinutes, knowledgeLevel, planDays }),
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

export const getActivePlanForUser = async (userId) => {
  return prisma.studyPlan.findFirst({
    where: { userId, status: "active" },
    orderBy: { planId: "desc" },
  });
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

  const targetExam = input.targetExam || TARGET_BY_EXAM_ID[user.targetExamId] || null;
  const examId = input.targetExam ? EXAM_ID_BY_TARGET[input.targetExam] : user.targetExamId || null;

  if (input.targetExam && !examId) {
    const error = new Error(`Unknown target exam "${input.targetExam}"`);
    error.statusCode = 400;
    throw error;
  }

  const knowledgeLevel = input.knowledgeLevel || user.knowledgeLevel || "intermediate";
  const dailyGoalMinutes = Number(input.dailyGoalMinutes) || user.dailyGoalMinutes || 30;
  const targetSubject = input.targetSubject !== undefined ? input.targetSubject : user.targetSubject;

  await prisma.user.update({
    where: { userId },
    data: {
      targetExamId: examId || undefined,
      targetSubject: targetSubject || undefined,
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

  let examDate = input.examDate ? new Date(input.examDate) : null;
  if (examDate && isNaN(examDate.getTime())) examDate = null;

  let planDays = DEFAULT_PLAN_DAYS;
  if (examDate) {
    const diffDays = Math.ceil((examDate.getTime() - startDate.getTime()) / 86400000);
    planDays = Math.min(Math.max(diffDays, MIN_PLAN_DAYS), MAX_PLAN_DAYS);
  }

  let days;
  let algorithmVersion;

  if (isGeminiConfigured()) {
    try {
      const exam = examId ? await prisma.exam.findUnique({ where: { examId } }) : null;
      const targetExamLabel = exam?.examName || targetExam || "the candidate's target teacher-certification exam";

      days = await buildAIPlanItems({
        examId,
        targetExamLabel,
        targetSubjectText: targetSubject,
        knowledgeLevel,
        dailyGoalMinutes,
        startDate,
        planDays,
        userId,
      });
      algorithmVersion = "gemini-v1";
    } catch (aiError) {
      console.error("Gemini study plan generation failed, falling back to rule-based generator:", aiError);
    }
  }

  if (!days) {
    days = await buildPlanItems({
      examId,
      targetSubjectText: targetSubject,
      knowledgeLevel,
      dailyGoalMinutes,
      startDate,
      planDays,
      userId,
    });
    algorithmVersion = "rule-based-v1";
  }

  const endDate = addDays(startDate, planDays - 1);

  const items = {
    algorithmVersion,
    generatedAt: new Date().toISOString(),
    examDate: examDate ? toDateOnlyString(examDate) : null,
    dailyGoalMinutes,
    knowledgeLevel,
    days,
  };

  const [, plan] = await prisma.$transaction([
    prisma.studyPlan.updateMany({
      where: { userId, status: "active" },
      data: { status: "archived" },
    }),
    prisma.studyPlan.create({
      data: {
        userId,
        startDate,
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
