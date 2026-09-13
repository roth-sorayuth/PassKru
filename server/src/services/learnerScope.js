import { prisma } from "../config/prisma.js";
import {
  CORE_SUBJECT_KEYS,
  describeSubjects,
  getRulesForExamCode,
  normalizeSubjectSelection,
  subjectMatchesKeys,
} from "../config/examSubjects.js";

/**
 * Which subjects and topics belong to a candidate, derived once from their
 * exam track and chosen subject keys:
 *   nie / rttc → the chosen subject / pair + General Knowledge
 *   pttc       → Math, Khmer Literature, Pedagogy (fixed) + General Knowledge
 *   legacy "generalist" rows → every subject of the exam
 *
 * Placement, the plan generator, the weekly review and the dashboard all read
 * this, so "your subjects" means the same thing everywhere. Previously the
 * dashboard counted every topic of the exam while the plan used only some.
 */
export async function getLearnerScope(userId) {
  const user = await prisma.user.findUnique({
    where: { userId },
    include: { targetExam: { select: { examId: true, examName: true, targetCode: true, schedules: true } } },
  });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const examCode = user.targetExam?.targetCode?.toLowerCase() || null;
  const examId = user.targetExam?.examId ?? null;
  const rules = getRulesForExamCode(examCode);
  const selection = examCode ? normalizeSubjectSelection(examCode, user.targetSubjects) : { ok: false, keys: [] };
  const keys = selection.ok ? selection.keys : [];
  // Only "generalist" means the whole exam; PTTC's fixed Math + Khmer are real subjects.
  const isGeneralist = keys.includes("generalist");

  const allSubjects = examId
    ? await prisma.subject.findMany({
        where: { examId },
        include: { topics: { select: { topicId: true, topicName: true } } },
        orderBy: { subjectId: "asc" },
      })
    : [];

  const majorKeys = keys.filter((k) => k !== "generalist");
  const coverage = { missingMajors: [], usedAllSubjects: false };

  let subjects;
  if (isGeneralist || !majorKeys.length) {
    subjects = allSubjects.map((s) => ({ ...s, role: "subject", majorIndex: null }));
  } else {
    subjects = [];
    for (const s of allSubjects) {
      const majorIndex = majorKeys.findIndex((k) => subjectMatchesKeys(s.subjectName, [k]));
      if (majorIndex >= 0) subjects.push({ ...s, role: "major", majorIndex });
      else if (subjectMatchesKeys(s.subjectName, CORE_SUBJECT_KEYS)) subjects.push({ ...s, role: "core", majorIndex: null });
    }
    coverage.missingMajors = majorKeys.filter((_, i) => !subjects.some((s) => s.majorIndex === i));
    // The chosen major has no content in this exam yet: fall back to the whole
    // exam rather than an empty plan, and say so.
    if (!subjects.some((s) => s.role === "major")) {
      coverage.usedAllSubjects = true;
      subjects = allSubjects.map((s) => ({ ...s, role: "subject", majorIndex: null }));
    }
  }

  const weighting = rules?.weighting || {};
  return {
    user,
    examCode,
    examId,
    examName: user.targetExam?.examName || null,
    keys,
    majorKeys,
    majorLabels: describeSubjects(majorKeys),
    isGeneralist: isGeneralist || coverage.usedAllSubjects,
    selectionMode: rules?.selectionMode || null,
    weighting: {
      major: weighting.major ?? (rules?.selectionMode === "pair" ? 40 : 80),
      second: weighting.second ?? 40,
      core: weighting.core ?? 20,
    },
    // The core share is split between the core subjects this exam actually has.
    coreCount: subjects.filter((s) => s.role === "core").length,
    subjects,
    subjectIds: subjects.map((s) => s.subjectId),
    topicIds: subjects.flatMap((s) => s.topics.map((t) => t.topicId)),
    coverage,
    hasSelection: Boolean(examId && selection.ok),
  };
}

/** Weight of a subject role for weighted round-robin. */
export function roleWeight(scope, subject) {
  if (subject.role === "major") return subject.majorIndex === 1 ? scope.weighting.second : scope.weighting.major;
  if (subject.role === "core") return scope.weighting.core / Math.max(1, scope.coreCount || 1);
  return 1;
}

/**
 * Smooth weighted round-robin over streams [{ weight, ... }]: returns the
 * stream to draw from next. `state` persists between calls.
 */
export function nextWeightedStream(streams, state) {
  const live = streams.filter((s) => s.weight > 0);
  if (!live.length) return null;
  const total = live.reduce((sum, s) => sum + s.weight, 0);
  let best = null;
  for (const s of live) {
    state.set(s.key, (state.get(s.key) || 0) + s.weight);
    if (!best || state.get(s.key) > state.get(best.key)) best = s;
  }
  state.set(best.key, state.get(best.key) - total);
  return best;
}
