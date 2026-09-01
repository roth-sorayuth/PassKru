import { prisma } from "../config/prisma.js";

const EXAM_ID_BY_TARGET = { nie: 1, rttc: 2, pttc: 3, kindergarten: 4 };
const TARGET_BY_EXAM_ID = { 1: "nie", 2: "rttc", 3: "pttc", 4: "kindergarten" };

const DAY_TYPE_PATTERN = ["read", "quiz", "read", "practice", "quiz", "mock", "review"];
const DEFAULT_PLAN_DAYS = 14;
const MIN_PLAN_DAYS = 7;
const MAX_PLAN_DAYS = 60;

function toDateOnlyString(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
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
 * target exam subjects/topics, known weak areas, and daily time budget.
 * No external AI provider is wired in yet (undecided) — once one is chosen
 * for study-plan generation, swap this function's body for an LLM-backed
 * generator while keeping the same output contract (array of day objects)
 * so callers (generatePlanForUser below) don't need to change.
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

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  let examDate = input.examDate ? new Date(input.examDate) : null;
  if (examDate && isNaN(examDate.getTime())) examDate = null;

  let planDays = DEFAULT_PLAN_DAYS;
  if (examDate) {
    const diffDays = Math.ceil((examDate.getTime() - startDate.getTime()) / 86400000);
    planDays = Math.min(Math.max(diffDays, MIN_PLAN_DAYS), MAX_PLAN_DAYS);
  }

  const days = await buildPlanItems({
    examId,
    targetSubjectText: targetSubject,
    knowledgeLevel,
    dailyGoalMinutes,
    startDate,
    planDays,
    userId,
  });

  const endDate = addDays(startDate, planDays - 1);

  const items = {
    algorithmVersion: "rule-based-v1",
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

  return prisma.studyPlan.update({
    where: { planId },
    data: { items: { ...items, days } },
  });
};
