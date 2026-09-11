import { prisma } from "../config/prisma.js";
import { recomputeUserStats } from "./userStatsService.js";
import { generateStructuredContent, isGeminiConfigured } from "./geminiService.js";
import { gradeSubmission, WEAK_AREA_THRESHOLD } from "./scoringService.js";
import { applyProficiencyUpdates } from "./attemptService.js";
import { refreshWeakAreasFromAttempt } from "./weaknessAnalysisService.js";
import { getLearnerScope, nextWeightedStream, roleWeight } from "./learnerScope.js";
import { getLatestPlacementResult, levelFor } from "./placementService.js";
import { normalizeSubjectSelection, subjectLabel } from "../config/examSubjects.js";
import {
  appDayOfWeek,
  appDayStartInstant,
  appTodayString,
  appWeekMonday,
  shiftAppDateString,
  toAppDateString,
} from "../utils/appDate.js";

/**
 * AI study plan (items.version = 2).
 *
 * One month: Mon–Fri study days filled only with content that exists in the
 * database — quiz sets (`quiz`), practice (`mock_exam`) and papers
 * (`past_paper`) — a Saturday review of the week's wrong answers, and a
 * Sunday rest day. The mix follows the track weighting and the candidate's
 * topic scores; every task carries a reason built from those facts.
 * Gemini, when configured, only rewrites the wording of the summary, goals
 * and reasons — it never chooses content, so the plan always works without it.
 */

const PLAN_DAYS = 28;
const REVIEW_MINUTES = 20;
const DEFAULT_MOCK_MINUTES = 90;
const MIN_TASK_MINUTES = 10;
const REPEAT_GAP_DAYS = 2;
const SATURDAY = 6;
const SUNDAY = 0;
const WEDNESDAY = 3;
const FRIDAY = 5;

const badRequest = (message) => Object.assign(new Error(message), { statusCode: 400 });
const notFound = (message) => Object.assign(new Error(message), { statusCode: 404 });

/* ================================================================ content -- */

/** Everything the planner may schedule for this candidate, with topic composition. */
async function loadContent(scope) {
  const subjectName = new Map(scope.subjects.map((s) => [s.subjectId, s.subjectName]));
  const [quizRows, mockRows, paperRows] = await Promise.all([
    scope.subjectIds.length
      ? prisma.quiz.findMany({
          where: { subjectId: { in: scope.subjectIds } },
          orderBy: { quizId: "asc" },
          select: {
            quizId: true,
            title: true,
            subjectId: true,
            durationMinutes: true,
            quizQuestions: { select: { question: { select: { topicId: true } } } },
          },
        })
      : [],
    scope.examId
      ? prisma.mockExam.findMany({
          where: { examId: scope.examId },
          orderBy: { mockExamId: "asc" },
          select: { mockExamId: true, title: true, durationMinutes: true },
        })
      : [],
    scope.subjectIds.length
      ? prisma.pastPaper.findMany({
          where: { subjectId: { in: scope.subjectIds } },
          orderBy: [{ year: "desc" }, { paperId: "asc" }],
          select: { paperId: true, title: true, subjectId: true, paperType: true, fileUrl: true, hasAnswerKey: true, totalQuestions: true, year: true },
        })
      : [],
  ]);

  const quizzes = quizRows
    .map((q) => {
      const topicCounts = new Map();
      for (const qq of q.quizQuestions) {
        const id = qq.question?.topicId;
        if (id != null) topicCounts.set(id, (topicCounts.get(id) || 0) + 1);
      }
      const questionCount = q.quizQuestions.length;
      return {
        quizId: q.quizId,
        title: q.title,
        subjectId: q.subjectId,
        subjectName: subjectName.get(q.subjectId) || "",
        questionCount,
        minutes: Math.max(MIN_TASK_MINUTES, q.durationMinutes || Math.ceil(questionCount * 1.5)),
        topicCounts,
      };
    })
    .filter((q) => q.questionCount > 0);

  return {
    quizzes,
    mocks: mockRows.map((m) => ({ ...m, minutes: m.durationMinutes || DEFAULT_MOCK_MINUTES })),
    papers: paperRows.map((p) => ({
      ...p,
      subjectName: subjectName.get(p.subjectId) || "",
      minutes: p.paperType === "prepare-paper" ? 30 : Math.min(90, Math.max(30, Math.round((p.totalQuestions || 30) * 1.5))),
    })),
  };
}

/** Topic score map (0–100) from progress records, plus names for reasons. */
async function loadTopicState(userId, scope) {
  const [records, weak] = await Promise.all([
    scope.topicIds.length
      ? prisma.progressRecord.findMany({ where: { userId, topicId: { in: scope.topicIds } }, select: { topicId: true, proficiencyScore: true } })
      : [],
    scope.topicIds.length
      ? prisma.weakArea.findMany({ where: { userId, topicId: { in: scope.topicIds } }, select: { topicId: true, accuracyRate: true } })
      : [],
  ]);
  const topicName = new Map(scope.subjects.flatMap((s) => s.topics.map((t) => [t.topicId, t.topicName])));
  return {
    score: new Map(records.map((r) => [r.topicId, Math.round(Number(r.proficiencyScore || 0))])),
    weak: new Set(weak.map((w) => w.topicId)),
    topicName,
  };
}

/** How much a topic needs work: 0 (mastered) … ~2 (flagged and failing). */
function topicNeed(topicId, state) {
  const score = state.score.get(topicId);
  const base = score == null ? 0.8 : Math.max(0.05, (100 - score) / 100);
  return state.weak.has(topicId) ? base + 1 : base;
}

function quizNeed(quiz, state) {
  if (!quiz.topicCounts.size) return 0.5;
  let sum = 0;
  for (const [topicId, count] of quiz.topicCounts) sum += topicNeed(topicId, state) * count;
  return sum / quiz.questionCount;
}

/** The topic this quiz does most for, for goals and reasons. */
function focusTopic(quiz, state) {
  let best = null;
  for (const [topicId, count] of quiz.topicCounts) {
    const need = topicNeed(topicId, state) * count;
    if (!best || need > best.need) best = { topicId, count, need, name: state.topicName.get(topicId), score: state.score.get(topicId) };
  }
  return best;
}

/* =============================================================== calendar -- */

function buildCalendar(startDate, days = PLAN_DAYS) {
  const calendar = [];
  let studySoFar = 0;
  for (let i = 0; i < days; i++) {
    const date = shiftAppDateString(startDate, i);
    const dow = appDayOfWeek(date);
    let dayType = "study";
    // A weekend before any study day has nothing to review or rest from.
    if (studySoFar > 0 && dow === SATURDAY) dayType = "review";
    else if (studySoFar > 0 && dow === SUNDAY) dayType = "rest";
    if (dayType === "study") studySoFar += 1;
    calendar.push({ date, dayIndex: i, dow, dayType, weekIndex: Math.floor(i / 7) });
  }
  return calendar;
}

function weekStatus(week, today) {
  if (today > week.endDate) return "done";
  if (today >= week.startDate) return "active";
  return "draft";
}

/* ============================================================== scheduler -- */

/**
 * Fills study days for the given calendar entries. `memory` carries quiz use
 * across calls so a regenerated week continues from the month so far.
 */
function scheduleDays({ calendarDays, scope, content, state, dailyMinutes, memory, examName }) {
  const streams = [];
  const bySubject = new Map();
  for (const quiz of content.quizzes) {
    if (!bySubject.has(quiz.subjectId)) bySubject.set(quiz.subjectId, []);
    bySubject.get(quiz.subjectId).push(quiz);
  }
  for (const subject of scope.subjects) {
    const quizzes = bySubject.get(subject.subjectId);
    if (quizzes?.length) streams.push({ key: subject.subjectId, weight: roleWeight(scope, subject), role: subject.role, quizzes });
  }
  const rr = memory.rr || (memory.rr = new Map());
  const used = memory.used || (memory.used = new Map()); // quizId → { count, lastDay }

  const bestInStream = (stream, dayIndex, excludeIds) => {
    let best = null;
    for (const quiz of stream.quizzes) {
      if (excludeIds.has(quiz.quizId)) continue;
      const u = used.get(quiz.quizId);
      if (u && dayIndex - u.lastDay < REPEAT_GAP_DAYS) continue;
      const score = quizNeed(quiz, state) - (u ? 0.35 * u.count : 0);
      if (!best || score > best.score) best = { quiz, score };
    }
    return best;
  };

  const pickQuiz = (dayIndex, excludeIds) => {
    // The subject whose turn it is may have nothing left for today; give the
    // turn to the next subject rather than ending the day early.
    let best = null;
    let stream = null;
    for (let tries = 0; tries < streams.length && !best; tries++) {
      stream = nextWeightedStream(streams, rr);
      if (!stream) return null;
      best = bestInStream(stream, dayIndex, excludeIds);
    }
    for (const s of best ? [] : streams) {
      const candidate = bestInStream(s, dayIndex, excludeIds);
      if (candidate && (!best || candidate.score > best.score)) [best, stream] = [candidate, s];
    }
    if (!best) return null;
    const prior = used.get(best.quiz.quizId);
    used.set(best.quiz.quizId, { count: (prior?.count || 0) + 1, lastDay: dayIndex, firstDay: prior?.firstDay ?? dayIndex });
    return { quiz: best.quiz, role: stream.role, repeatOf: prior };
  };

  const quizReason = ({ quiz, role, repeatOf }, dayIndex) => {
    const focus = focusTopic(quiz, state);
    if (repeatOf) {
      const gap = dayIndex - repeatOf.lastDay;
      return focus?.name
        ? `ធ្វើម្ដងទៀតក្រោយ ${gap} ថ្ងៃ ដើម្បីមើលថាពិន្ទុ${focus.name}ឡើងឬនៅ។`
        : `ធ្វើម្ដងទៀតក្រោយ ${gap} ថ្ងៃ ដើម្បីកុំឲ្យភ្លេច។`;
    }
    const parts = [];
    if (focus?.name) {
      parts.push(`ឈុតនេះមានសំណួរ${focus.name} ${focus.count} ក្នុង ${quiz.questionCount}`);
      if (focus.score != null) parts.push(`ពិន្ទុរបស់អ្នក ${focus.score}%`);
      if (state.weak.has(focus.topicId)) parts.push("ជាចំណុចខ្សោយ");
    } else {
      parts.push(`កម្រងសំណួរ${quiz.subjectName}ដែលអ្នកមិនទាន់ធ្វើ`);
    }
    if (role === "core") parts.push("មុខវិជ្ជាស្នូល");
    return parts.join(" · ") + "។";
  };

  const makeQuizTask = (pick, dayIndex, taskIndex) => ({
    id: `d${dayIndex}-t${taskIndex}`,
    type: "quiz",
    title: pick.quiz.title,
    estimatedMinutes: pick.quiz.minutes,
    reason: quizReason(pick, dayIndex),
    completed: false,
    completedAt: null,
    subjectName: pick.quiz.subjectName,
    questionCount: pick.quiz.questionCount,
    quizId: pick.quiz.quizId,
    focusTopicId: focusTopic(pick.quiz, state)?.topicId ?? null,
  });

  const days = [];
  for (const day of calendarDays) {
    const base = { date: day.date, dayIndex: day.dayIndex, weekIndex: day.weekIndex, dayType: day.dayType, tasks: [] };
    if (day.dayType === "rest") {
      days.push(base);
      continue;
    }
    if (day.dayType === "review") {
      base.tasks.push({
        id: `d${day.dayIndex}-t0`,
        type: "review",
        title: "ពិនិត្យកំហុសប្រចាំសប្តាហ៍",
        estimatedMinutes: REVIEW_MINUTES,
        reason: "ចម្លើយខុសពីកម្រងសំណួរ និងអនុវត្តក្នុងសប្តាហ៍នេះ។ វិញ្ញាសាមិនរួមបញ្ចូលទេ ព្រោះគ្មានពិន្ទុ។",
        completed: false,
        completedAt: null,
      });
      days.push(base);
      continue;
    }

    let budget = dailyMinutes;
    const tasks = [];
    const today = new Set();

    // Practice (mock exam) on the Friday of weeks 2 and 4.
    if (day.dow === FRIDAY && (day.weekIndex === 1 || day.weekIndex === 3) && content.mocks.length) {
      memory.mocks = (memory.mocks || 0) + 1;
      const mock = content.mocks[(memory.mocks - 1) % content.mocks.length];
      const round = memory.mocks;
      tasks.push({
        id: `d${day.dayIndex}-t0`,
        type: "practice",
        title: mock.title,
        estimatedMinutes: mock.minutes,
        reason:
          round === 1
            ? "អនុវត្តលើកទី ១ — មានពិន្ទុ និងចម្លើយខុសគ្រប់ផ្នែក ដែល AI ប្រើនៅថ្ងៃសៅរ៍។"
            : `អនុវត្តលើកទី ${round} — ប្រៀបធៀបពិន្ទុជាមួយលើកមុន${content.mocks.length === 1 ? " (វិញ្ញាសាដដែល)" : ""}។`,
        completed: false,
        completedAt: null,
        mockExamId: mock.mockExamId,
      });
      days.push({ ...base, tasks });
      continue;
    }

    // One paper a week, mid-week: prepared papers first, then past papers.
    if (day.dow === WEDNESDAY && content.papers.length) {
      const order = [...content.papers].sort((a, b) => (a.paperType === "prepare-paper" ? -1 : 0) - (b.paperType === "prepare-paper" ? -1 : 0));
      memory.papers = memory.papers || new Set();
      const paper = order.find((p) => !memory.papers.has(p.paperId));
      if (paper) {
        memory.papers.add(paper.paperId);
        tasks.push({
          id: `d${day.dayIndex}-t${tasks.length}`,
          type: "paper",
          title: paper.title,
          estimatedMinutes: paper.minutes,
          reason:
            paper.paperType === "prepare-paper"
              ? `ស្គាល់ទម្រង់សំណួរពិតនៃ${examName || "ការប្រឡង"}។ វិញ្ញាសាគ្មានពិន្ទុ ដូច្នេះធីកពេលធ្វើរួច។`
              : `ធ្វើវិញ្ញាសាពិត${paper.year ? `ឆ្នាំ ${paper.year}` : ""}ដោយកំណត់ពេល${paper.hasAnswerKey ? " ហើយផ្ទៀងផ្ទាត់ជាមួយចម្លើយ" : ""}។ ធីកពេលធ្វើរួច។`,
          completed: false,
          completedAt: null,
          subjectName: paper.subjectName,
          questionCount: paper.totalQuestions,
          paperId: paper.paperId,
          paperType: paper.paperType,
          fileUrl: paper.fileUrl,
          hasAnswerKey: paper.hasAnswerKey,
        });
        budget -= paper.minutes;
      }
    }

    // Fill the rest of the day with quiz sets (at least one on a study day).
    while (budget >= MIN_TASK_MINUTES || (!tasks.length && streams.length)) {
      const pick = pickQuiz(day.dayIndex, today);
      if (!pick) break;
      if (tasks.length && pick.quiz.minutes > budget + 5) {
        // Too long for what's left: undo the reservation and stop.
        const u = used.get(pick.quiz.quizId);
        if (u.count === 1) used.delete(pick.quiz.quizId);
        else used.set(pick.quiz.quizId, { ...u, count: u.count - 1, lastDay: pick.repeatOf.lastDay });
        break;
      }
      today.add(pick.quiz.quizId);
      tasks.push(makeQuizTask(pick, day.dayIndex, tasks.length));
      budget -= pick.quiz.minutes;
      if (tasks.length >= 4) break;
    }
    days.push({ ...base, tasks });
  }
  return days;
}

function buildWeeks(calendar, days, state, today) {
  const weeks = [];
  for (let w = 0; w * 7 < calendar.length; w++) {
    const inWeek = calendar.filter((c) => c.weekIndex === w);
    const tasks = days.filter((d) => d.weekIndex === w).flatMap((d) => d.tasks);
    const focusCounts = new Map();
    for (const t of tasks) if (t.focusTopicId != null) focusCounts.set(t.focusTopicId, (focusCounts.get(t.focusTopicId) || 0) + 1);
    const focus = [...focusCounts.entries()]
      .sort((a, b) => b[1] - a[1] || topicNeed(b[0], state) - topicNeed(a[0], state))
      .slice(0, 2)
      .map(([id]) => ({ id, name: state.topicName.get(id), score: state.score.get(id) }));
    const quizCount = tasks.filter((t) => t.type === "quiz").length;
    const paperCount = tasks.filter((t) => t.type === "paper").length;
    const practice = tasks.find((t) => t.type === "practice");

    const goal = [
      focus.length ? `ផ្តោតលើ${focus.map((f) => f.name).join(" និង")}` : "រំលឹកមុខវិជ្ជាទាំងអស់",
      practice ? `អនុវត្ត${w === 1 ? "លើកទី ១" : "លើកទី ២"}` : null,
    ]
      .filter(Boolean)
      .join(" · ");
    const first = focus[0];
    const target = [
      first ? `${first.name} ≥ ${Math.min(100, Math.max(55, (first.score ?? 40) + 20))}%` : null,
      `កម្រងសំណួរ ${quizCount} ឈុត`,
      paperCount ? `វិញ្ញាសា ${paperCount}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    const week = { weekIndex: w, startDate: inWeek[0].date, endDate: inWeek[inWeek.length - 1].date, goal, target: `គោលដៅ៖ ${target}` };
    weeks.push({ ...week, status: weekStatus(week, today) });
  }
  return weeks;
}

function levelText(level) {
  return { beginner: "ទើបចាប់ផ្តើម", intermediate: "មធ្យម", advanced: "រឹងមាំ" }[level] || "មធ្យម";
}

function buildSummary({ scope, state, placement, days, dailyMinutes, level, content }) {
  const weakest = (placement?.weakTopics || []).slice(0, 2);
  const weightText = scope.isGeneralist
    ? "គ្រប់មុខវិជ្ជាស្មើៗគ្នា"
    : scope.majorKeys.length === 2
      ? `${subjectLabel(scope.majorKeys[0])} ${scope.weighting.major}% · ${subjectLabel(scope.majorKeys[1])} ${scope.weighting.second}% · ស្នូល ${scope.weighting.core}%`
      : `${subjectLabel(scope.majorKeys[0])} ${scope.weighting.major}% · ស្នូល ${scope.weighting.core}%`;

  const hasPractice = days.some((d) => d.tasks.some((t) => t.type === "practice"));
  const sentences = [
    placement ? `កម្រិតរបស់អ្នកគឺ${levelText(level)} (ត្រូវ ${placement.correct} ក្នុង ${placement.total})។` : `កម្រិតរបស់អ្នកគឺ${levelText(level)}។`,
    weakest.length
      ? `ចំណុចខ្សោយបំផុត៖ ${weakest.map((w) => `${w.topicName} (${w.percent}%)`).join(" និង ")} — សប្តាហ៍ទី ១ ចាប់ផ្តើមពីទីនេះ។`
      : null,
    placement?.patterns?.[0] || null,
    hasPractice ? "អនុវត្ត (ប្រឡងសាកល្បង) ដាក់នៅថ្ងៃសុក្រ សប្តាហ៍ទី ២ និង ៤ ដើម្បីវាស់វឌ្ឍនភាពពិត។" : null,
    scope.coverage.missingMajors.length
      ? `មុខវិជ្ជា ${scope.coverage.missingMajors.map((k) => subjectLabel(k)).join(" និង ")} មិនទាន់មានខ្លឹមសារនៅឡើយ ដូច្នេះផែនការប្រើមុខវិជ្ជាផ្សេងជំនួស។`
      : null,
  ].filter(Boolean);

  const tasks = days.flatMap((d) => d.tasks);
  return {
    text: sentences.join(" "),
    decisions: [
      { label: "ទម្ងន់", value: weightText, note: scope.isGeneralist ? "ក្របខណ្ឌបង្រៀនគ្រប់មុខវិជ្ជា" : "មុខវិជ្ជារបស់អ្នក ជាមួយមុខវិជ្ជាស្នូល" },
      {
        label: "ចាប់ផ្តើមពី",
        value: weakest[0]?.topicName || "ប្រធានបទដែលមិនទាន់វាស់",
        note: weakest[0] ? `ពិន្ទុ ${weakest[0].percent}% ក្នុងតេស្តវាស់កម្រិត` : "គ្មានលទ្ធផលតេស្ត",
      },
      {
        label: "ទំហំប្រចាំថ្ងៃ",
        value: `${dailyMinutes} នាទី`,
        note: placement?.secondsPerQuestion ? `ល្បឿនឆ្លើយ ${placement.secondsPerQuestion} វិនាទីក្នុងមួយសំណួរ` : "តាមគោលដៅប្រចាំថ្ងៃរបស់អ្នក",
      },
    ],
    content: {
      quizzes: new Set(tasks.filter((t) => t.quizId).map((t) => t.quizId)).size,
      practice: new Set(tasks.filter((t) => t.mockExamId).map((t) => t.mockExamId)).size,
      papers: new Set(tasks.filter((t) => t.paperId).map((t) => t.paperId)).size,
    },
    available: { quizzes: content.quizzes.length, practice: content.mocks.length, papers: content.papers.length },
  };
}

/**
 * Optional: Gemini rewrites the summary, week goals and task reasons in
 * natural Khmer from the same facts. Content, ids and counts are never
 * touched; anything malformed keeps the rule-based wording.
 */
async function polishWording(items) {
  if (!isGeminiConfigured()) return items;
  const tasks = items.days.flatMap((d) => d.tasks).filter((t) => t.type !== "review").slice(0, 60);
  try {
    const raw = await generateStructuredContent({
      systemInstruction:
        "You rewrite a study plan's explanations for a Cambodian teacher-exam candidate. Write in natural, concise Khmer. Keep every number and name exactly as given. Never add facts. Reply only with JSON.",
      prompt: JSON.stringify({
        summary: items.summary.text,
        weeks: items.weeks.map((w) => ({ weekIndex: w.weekIndex, goal: w.goal })),
        tasks: tasks.map((t) => ({ id: t.id, type: t.type, title: t.title, reason: t.reason })),
      }),
      schema: {
        type: "OBJECT",
        properties: {
          summary: { type: "STRING" },
          weeks: { type: "ARRAY", items: { type: "OBJECT", properties: { weekIndex: { type: "INTEGER" }, goal: { type: "STRING" } }, required: ["weekIndex", "goal"] } },
          reasons: { type: "ARRAY", items: { type: "OBJECT", properties: { id: { type: "STRING" }, reason: { type: "STRING" } }, required: ["id", "reason"] } },
        },
        required: ["summary", "weeks", "reasons"],
      },
      temperature: 0.3,
    });
    const clean = (s, max) => (typeof s === "string" && s.trim() ? s.trim().slice(0, max) : null);
    const reasons = new Map((raw?.reasons || []).map((r) => [r.id, clean(r.reason, 300)]).filter(([, v]) => v));
    const goals = new Map((raw?.weeks || []).map((w) => [w.weekIndex, clean(w.goal, 120)]).filter(([, v]) => v));
    return {
      ...items,
      algorithmVersion: "gemini-v2",
      summary: { ...items.summary, text: clean(raw?.summary, 900) || items.summary.text },
      weeks: items.weeks.map((w) => ({ ...w, goal: goals.get(w.weekIndex) || w.goal })),
      days: items.days.map((d) => ({ ...d, tasks: d.tasks.map((t) => ({ ...t, reason: reasons.get(t.id) || t.reason })) })),
    };
  } catch (err) {
    console.error("Plan wording polish failed, keeping rule-based text:", err?.message || err);
    return items;
  }
}

/* ============================================================ plan API ---- */

function withLiveStatus(plan) {
  if (plan?.items?.version !== 2) return plan;
  const today = appTodayString();
  return { ...plan, items: { ...plan.items, weeks: plan.items.weeks.map((w) => ({ ...w, status: weekStatus(w, today) })) } };
}

/* ============================================================ my plans ---- */

/**
 * A candidate can keep several plans — one per level + subjects, like courses —
 * but studies one at a time:
 *   active   — the plan the dashboard, Saturday review and weekly update follow
 *   paused   — kept with its progress; continuing it makes it active again
 *   archived — finished, or replaced by a newer plan for the same subjects
 */
const PAUSED = "paused";

const sameKeys = (a = [], b = []) => a.length === b.length && [...a].sort().join("|") === [...b].sort().join("|");

/** Whether a plan was made for this exam track and subjects. Plans saved before examCode was stored match on subjects. */
function planMatchesSelection(items, examCode, keys) {
  if (items?.version !== 2) return false;
  if (items.examCode && examCode && items.examCode !== examCode) return false;
  return sameKeys(items.targetSubjects || [], keys);
}

async function currentSelection(userId) {
  const user = await prisma.user.findUnique({
    where: { userId },
    select: { targetSubjects: true, targetExam: { select: { targetCode: true } } },
  });
  const examCode = user?.targetExam?.targetCode?.toLowerCase() || null;
  const selection = examCode ? normalizeSubjectSelection(examCode, user.targetSubjects) : { ok: false, keys: [] };
  return { examCode, keys: selection.ok ? selection.keys : [] };
}

const weekAt = (items, date) => items.weeks.find((w) => date >= w.startDate && date <= w.endDate)?.weekIndex ?? null;

async function pausePlan(plan) {
  return prisma.studyPlan.update({
    where: { planId: plan.planId },
    data: { status: PAUSED, items: { ...plan.items, pausedAt: appTodayString() } },
  });
}

/**
 * Moves a paused plan's unfinished weeks forward by whole weeks, so the
 * candidate picks up where they stopped instead of facing days in the past.
 * Whole weeks keep Saturday reviews on Saturdays and rest days on Sundays.
 */
function resumeItems(items, today) {
  const { pausedAt, ...rest } = items;
  if (!pausedAt || today <= pausedAt) return rest;
  const gapDays = Math.round((new Date(`${today}T00:00:00Z`) - new Date(`${pausedAt}T00:00:00Z`)) / 86400000);
  const shift = Math.floor(gapDays / 7) * 7;
  const fromWeek = weekAt(items, pausedAt);
  if (!shift || fromWeek == null) return rest;
  const move = (date) => shiftAppDateString(date, shift);
  return {
    ...rest,
    days: items.days.map((d) => (d.weekIndex >= fromWeek ? { ...d, date: move(d.date) } : d)),
    weeks: items.weeks.map((w) => (w.weekIndex >= fromWeek ? { ...w, startDate: move(w.startDate), endDate: move(w.endDate) } : w)),
    updates: (items.updates || []).map((u) =>
      u.weekIndex >= fromWeek
        ? { ...u, autoApplyAt: move(u.autoApplyAt), proposedDays: (u.proposedDays || []).map((d) => ({ ...d, date: move(d.date) })) }
        : u
    ),
  };
}

export const getActivePlanForUser = async (userId) => {
  let plan = await prisma.studyPlan.findFirst({ where: { userId, status: "active" }, orderBy: { planId: "desc" } });
  if (!plan) return null;
  if (plan.items?.version === 2) {
    const { examCode, keys } = await currentSelection(userId);
    // The candidate switched level or subjects: this plan waits in "My plans".
    if (!planMatchesSelection(plan.items, examCode, keys)) {
      await pausePlan(plan);
      return null;
    }
  }
  plan = await autoApplyDueUpdates(plan);
  return withLiveStatus(plan);
};

/** Every AI plan the candidate has, newest first, with progress for the "My plans" list. */
export const listMyPlans = async (userId) => {
  await getActivePlanForUser(userId); // pauses an active plan left over from a selection change
  const [plans, selection] = await Promise.all([
    prisma.studyPlan.findMany({
      where: { userId, status: { in: ["active", PAUSED, "archived"] } },
      orderBy: { planId: "desc" },
      select: { planId: true, status: true, items: true },
    }),
    currentSelection(userId),
  ]);
  const today = appTodayString();

  return plans
    .filter((p) => p.items?.version === 2 && Array.isArray(p.items.days) && p.items.days.length)
    .map((p) => {
      const items = p.items;
      const tasks = items.days.flatMap((d) => d.tasks || []);
      const endDate = items.days[items.days.length - 1].date;
      const matches = planMatchesSelection(items, selection.examCode, selection.keys);
      const weekIndex = p.status === PAUSED && items.pausedAt ? weekAt(items, items.pausedAt) : weekAt(items, today);
      return {
        planId: p.planId,
        status: p.status,
        examCode: items.examCode || (matches ? selection.examCode : null),
        targetSubjects: items.targetSubjects || [],
        level: items.level || null,
        generatedAt: items.generatedAt || null,
        startDate: items.days[0].date,
        endDate,
        finished: today > endDate,
        pausedAt: items.pausedAt || null,
        weekIndex,
        totalWeeks: items.weeks.length,
        tasksDone: tasks.filter((t) => t.completed).length,
        tasksTotal: tasks.length,
        matchesSelection: matches,
      };
    });
};

/**
 * Continue a paused plan: it becomes the active plan, the candidate's level and
 * subjects switch to the plan's, and the plan that was active is paused.
 */
export const activatePlanForUser = async (userId, planId) => {
  const plan = await prisma.studyPlan.findUnique({ where: { planId } });
  if (!plan || plan.userId !== userId || plan.items?.version !== 2) throw notFound("Study plan not found");
  if (plan.status !== PAUSED && plan.status !== "active") throw badRequest("Only a paused plan can be continued");

  const examCode = plan.items.examCode || (await currentSelection(userId)).examCode;
  const exam = examCode
    ? await prisma.exam.findFirst({ where: { targetCode: { equals: examCode, mode: "insensitive" } }, select: { examId: true } })
    : null;
  if (!exam) throw badRequest("This plan's exam track is no longer available");

  if (plan.status === PAUSED) {
    const others = await prisma.studyPlan.findMany({ where: { userId, status: "active", planId: { not: planId } } });
    for (const other of others) {
      if (other.items?.version === 2) await pausePlan(other);
      else await prisma.studyPlan.update({ where: { planId: other.planId }, data: { status: "archived" } });
    }
  }

  const items = plan.status === PAUSED ? resumeItems(plan.items, appTodayString()) : plan.items;
  const subjects = items.targetSubjects || [];
  const [, updated] = await prisma.$transaction([
    prisma.user.update({
      where: { userId },
      data: {
        targetExamId: exam.examId,
        targetSubjects: subjects,
        targetSubject: subjects[0] || null,
        ...(items.level ? { knowledgeLevel: items.level } : {}),
        ...(items.dailyGoalMinutes ? { dailyGoalMinutes: items.dailyGoalMinutes } : {}),
      },
    }),
    prisma.studyPlan.update({
      where: { planId },
      data: {
        status: "active",
        items: { ...items, examCode },
        endDate: new Date(`${items.days[items.days.length - 1].date}T00:00:00.000Z`),
      },
    }),
  ]);

  return { plan: withLiveStatus(updated), selection: { targetExamCode: examCode, targetSubjects: subjects } };
};

export const listPlansForUser = async (userId) =>
  prisma.studyPlan.findMany({
    where: { userId },
    orderBy: { planId: "desc" },
    select: { planId: true, startDate: true, endDate: true, status: true },
  });

export const generatePlanForUser = async (userId, input = {}) => {
  const scope = await getLearnerScope(userId);
  if (!scope.hasSelection) throw badRequest("Choose an exam track and subjects first");

  const placement = await getLatestPlacementResult(userId);
  if (!placement) throw badRequest("Take the placement test before generating a plan");

  const level = levelFor(placement.percent);
  const dailyMinutes = Math.max(20, Math.min(180, Number(input.dailyGoalMinutes) || scope.user.dailyGoalMinutes || 60));
  const [content, state] = await Promise.all([loadContent(scope), loadTopicState(userId, scope)]);
  if (!content.quizzes.length && !content.mocks.length && !content.papers.length) {
    throw badRequest("There is no quiz, practice or paper content for your subjects yet");
  }

  const today = appTodayString();
  const calendar = buildCalendar(today);
  const memory = {};
  const days = scheduleDays({ calendarDays: calendar, scope, content, state, dailyMinutes, memory, examName: scope.examName });
  const weeks = buildWeeks(calendar, days, state, today);

  let items = {
    version: 2,
    algorithmVersion: "rule-based-v2",
    generatedAt: new Date().toISOString(),
    level,
    dailyGoalMinutes: dailyMinutes,
    examCode: scope.examCode,
    targetSubjects: scope.keys,
    placementAttemptId: placement.attemptId,
    coverage: scope.coverage,
    summary: buildSummary({ scope, state, placement, days, dailyMinutes, level, content }),
    weeks,
    days,
    updates: [],
  };
  items = await polishWording(items);

  // A plan for other subjects is paused (kept in "My plans"); an older plan for
  // these same subjects — or a pre-AI plan — is replaced and goes to history.
  await getActivePlanForUser(userId);
  const open = await prisma.studyPlan.findMany({
    where: { userId, status: { in: ["active", PAUSED] } },
    select: { planId: true, items: true },
  });
  const replaced = open
    .filter((p) => p.items?.version !== 2 || planMatchesSelection(p.items, scope.examCode, scope.keys))
    .map((p) => p.planId);

  const endDate = new Date(`${calendar[calendar.length - 1].date}T00:00:00.000Z`);
  const [, plan] = await prisma.$transaction([
    prisma.studyPlan.updateMany({ where: { planId: { in: replaced } }, data: { status: "archived" } }),
    prisma.studyPlan.create({
      data: { userId, startDate: new Date(`${today}T00:00:00.000Z`), endDate, status: "active", items },
    }),
    prisma.user.update({ where: { userId }, data: { knowledgeLevel: level, dailyGoalMinutes: dailyMinutes } }),
  ]);
  return withLiveStatus(plan);
};

export const setTaskCompletion = async (userId, planId, taskId, completed) => {
  const plan = await prisma.studyPlan.findUnique({ where: { planId } });
  if (!plan || plan.userId !== userId) throw notFound("Study plan not found");

  const items = plan.items || { days: [] };
  let found = false;
  const days = (items.days || []).map((day) => ({
    ...day,
    tasks: (day.tasks || []).map((task) => {
      if (task.id !== taskId) return task;
      found = true;
      return { ...task, completed, completedAt: completed ? new Date().toISOString() : null };
    }),
  }));
  if (!found) throw notFound("Study task not found");

  const updated = await prisma.studyPlan.update({ where: { planId }, data: { items: { ...items, days } } });
  recomputeUserStats(userId).catch((err) => console.error("Failed to recompute user stats after task toggle:", err));
  return withLiveStatus(updated);
};

/* ========================================================= weekly review -- */

const SCORED_TYPES = ["quiz", "mock_exam"];

async function weeklyMistakeRows(userId, weekStart, weekEnd) {
  const from = appDayStartInstant(weekStart);
  const to = appDayStartInstant(shiftAppDateString(weekEnd, 1));
  const wrong = await prisma.attemptAnswer.findMany({
    where: { isCorrect: false, attempt: { userId, attemptType: { in: SCORED_TYPES }, endTime: { gte: from, lt: to } } },
    orderBy: { answerId: "desc" },
    include: {
      attempt: { select: { attemptType: true, endTime: true } },
      question: {
        select: {
          questionId: true,
          questionText: true,
          explanation: true,
          topic: { select: { topicId: true, topicName: true, subject: { select: { subjectName: true } } } },
          answerOptions: { select: { optionId: true, optionText: true, isCorrect: true }, orderBy: { optionId: "asc" } },
        },
      },
    },
  });

  // Latest wrong answer per question, dropped if answered correctly since.
  const latest = new Map();
  for (const row of wrong) if (!latest.has(row.questionId)) latest.set(row.questionId, row);
  if (!latest.size) return [];
  const later = await prisma.attemptAnswer.findMany({
    where: { questionId: { in: [...latest.keys()] }, isCorrect: true, attempt: { userId, endTime: { gte: from } } },
    select: { questionId: true, attempt: { select: { endTime: true } } },
  });
  for (const row of later) {
    const miss = latest.get(row.questionId);
    if (miss && row.attempt.endTime > miss.attempt.endTime) latest.delete(row.questionId);
  }
  return [...latest.values()].filter((r) => r.question?.answerOptions?.some((o) => o.isCorrect));
}

function reviewWindow(today = appTodayString()) {
  const weekStart = appWeekMonday(today);
  // Reviewing on Sunday still looks back at Monday–Saturday.
  return { weekStart, weekEnd: shiftAppDateString(weekStart, 5) };
}

function weekIndexFor(plan, date) {
  const week = plan?.items?.weeks?.find((w) => date >= w.startDate && date <= w.endDate);
  return week ? week.weekIndex : 0;
}

export const getWeeklyReviewForUser = async (userId) => {
  const today = appTodayString();
  const { weekStart, weekEnd } = reviewWindow(today);
  const [rows, plan] = await Promise.all([
    weeklyMistakeRows(userId, weekStart, weekEnd),
    prisma.studyPlan.findFirst({ where: { userId, status: "active" }, orderBy: { planId: "desc" }, select: { items: true } }),
  ]);

  const byTopic = new Map();
  for (const r of rows) {
    const key = `${r.question.topic?.subject?.subjectName}::${r.question.topic?.topicName}`;
    const entry = byTopic.get(key) || { topicName: r.question.topic?.topicName || "", subjectName: r.question.topic?.subject?.subjectName || "", count: 0 };
    entry.count += 1;
    byTopic.set(key, entry);
  }

  return {
    weekIndex: weekIndexFor(plan, today),
    weekStart,
    weekEnd,
    total: rows.length,
    byTopic: [...byTopic.values()].sort((a, b) => b.count - a.count),
    mistakes: rows.map((r) => ({
      questionId: r.questionId,
      questionText: r.question.questionText,
      subjectName: r.question.topic?.subject?.subjectName || "",
      topicName: r.question.topic?.topicName || "",
      answeredAt: toAppDateString(r.attempt.endTime),
      source: r.attempt.attemptType === "mock_exam" ? "practice" : "quiz",
      options: r.question.answerOptions.map((o) => ({ optionId: o.optionId, optionText: o.optionText })),
      selectedOptionId: r.selectedOptionId,
      correctOptionId: r.question.answerOptions.find((o) => o.isCorrect).optionId,
      explanation: r.question.explanation,
    })),
  };
};

export const submitWeeklyReviewForUser = async (userId, answers = []) => {
  const today = appTodayString();
  const { weekStart, weekEnd } = reviewWindow(today);
  const rows = await weeklyMistakeRows(userId, weekStart, weekEnd);
  const byId = new Map(rows.map((r) => [r.questionId, r]));
  const submitted = (Array.isArray(answers) ? answers : []).filter((a) => byId.has(Number(a?.questionId)));
  if (!submitted.length) throw badRequest("No answers for this week's mistakes");

  const questions = submitted.map((a) => {
    const q = byId.get(Number(a.questionId)).question;
    return { questionId: q.questionId, topicId: q.topic?.topicId, explanation: q.explanation, answerOptions: q.answerOptions };
  });
  const { gradedAnswers, topicStats, correctCount, score } = gradeSubmission(questions, submitted);

  await prisma.attempt.create({
    data: {
      userId,
      attemptType: "review",
      score,
      startTime: new Date(),
      endTime: new Date(),
      attemptAnswers: {
        create: gradedAnswers.map((g) => ({ questionId: g.questionId, selectedOptionId: g.selectedOptionId, isCorrect: g.isCorrect })),
      },
    },
  });
  await applyProficiencyUpdates(userId, topicStats);
  await refreshWeakAreasFromAttempt(userId, topicStats);

  // Tick the Saturday task and prepare next week's proposal.
  const plan = await prisma.studyPlan.findFirst({ where: { userId, status: "active" }, orderBy: { planId: "desc" } });
  if (plan?.items?.version === 2) {
    const reviewDay = plan.items.days.find((d) => d.dayType === "review" && d.date >= weekStart && d.date <= shiftAppDateString(weekEnd, 1));
    const days = plan.items.days.map((d) =>
      d !== reviewDay ? d : { ...d, tasks: d.tasks.map((t) => ({ ...t, completed: true, completedAt: new Date().toISOString() })) }
    );
    const withReview = await prisma.studyPlan.update({ where: { planId: plan.planId }, data: { items: { ...plan.items, days } } });
    await createWeeklyUpdate(userId, withReview).catch((err) => console.error("Weekly update failed:", err));
  }
  recomputeUserStats(userId).catch((err) => console.error("Failed to recompute stats after review:", err));

  return { total: gradedAnswers.length, correct: correctCount, clearedQuestionIds: gradedAnswers.filter((g) => g.isCorrect).map((g) => g.questionId) };
};

/* ========================================================= weekly update -- */

/** Per-topic accuracy from scored answers in [from, to). */
async function topicAccuracy(userId, topicIds, from, to) {
  if (!topicIds.length) return new Map();
  const rows = await prisma.attemptAnswer.findMany({
    where: {
      question: { topicId: { in: topicIds } },
      attempt: { userId, endTime: { ...(from ? { gte: from } : {}), lt: to } },
      isCorrect: { not: null },
    },
    select: { isCorrect: true, question: { select: { topicId: true } } },
  });
  const tally = new Map();
  for (const r of rows) {
    const t = tally.get(r.question.topicId) || { correct: 0, total: 0 };
    t.total += 1;
    if (r.isCorrect) t.correct += 1;
    tally.set(r.question.topicId, t);
  }
  return new Map([...tally].map(([id, t]) => [id, { ...t, percent: Math.round((t.correct / t.total) * 100) }]));
}

async function createWeeklyUpdate(userId, plan) {
  const items = plan.items;
  const today = appTodayString();
  const current = weekIndexFor(plan, today);
  const next = current + 1;
  if (next >= items.weeks.length) return null;
  if ((items.updates || []).some((u) => u.weekIndex === next)) return null;

  const scope = await getLearnerScope(userId);
  const { weekStart } = reviewWindow(today);
  const weekFrom = appDayStartInstant(weekStart);
  const now = new Date();
  const [before, after, weekAttempts, content, state] = await Promise.all([
    topicAccuracy(userId, scope.topicIds, null, weekFrom),
    topicAccuracy(userId, scope.topicIds, null, now),
    prisma.attempt.findMany({
      where: { userId, endTime: { gte: weekFrom }, attemptType: { in: [...SCORED_TYPES, "review"] } },
      select: { attemptType: true, quizId: true, score: true, startTime: true, endTime: true },
      orderBy: { endTime: "asc" },
    }),
    loadContent(scope),
    loadTopicState(userId, scope),
  ]);

  const topicName = state.topicName;
  const subjectOf = new Map(scope.subjects.flatMap((s) => s.topics.map((t) => [t.topicId, s.subjectName])));
  const findings = [...after.entries()]
    .filter(([id]) => before.has(id) && before.get(id).percent !== after.get(id).percent)
    .map(([id, a]) => ({
      topicName: topicName.get(id),
      subjectName: subjectOf.get(id) || "",
      before: before.get(id).percent,
      after: a.percent,
      note: `ត្រូវ ${a.correct - before.get(id).correct} ក្នុង ${a.total - before.get(id).total} សំណួរសប្តាហ៍នេះ`,
    }))
    .sort((x, y) => Math.abs(y.after - y.before) - Math.abs(x.after - x.before))
    .slice(0, 3);

  // Did repeating a quiz help? Compare first and last sitting this week.
  const sittings = new Map();
  for (const a of weekAttempts.filter((x) => x.quizId && x.score != null)) {
    if (!sittings.has(a.quizId)) sittings.set(a.quizId, []);
    sittings.get(a.quizId).push(Number(a.score));
  }
  let pattern = null;
  for (const [quizId, scores] of sittings) {
    if (scores.length >= 2 && scores[scores.length - 1] > scores[0]) {
      const title = content.quizzes.find((q) => q.quizId === quizId)?.title || "";
      pattern = `ការធ្វើម្ដងទៀតដំណើរការ៖ ${title} ពី ${scores[0]}% ឡើងដល់ ${scores[scores.length - 1]}%។`;
      break;
    }
  }

  // Pace: planned vs actual minutes this week.
  const weekDays = items.days.filter((d) => d.weekIndex === current && d.date <= today);
  const planned = weekDays.flatMap((d) => d.tasks).reduce((s, t) => s + t.estimatedMinutes, 0);
  const studyDays = weekDays.filter((d) => d.dayType === "study").length || 1;
  const attemptMinutes = weekAttempts.reduce((s, a) => s + Math.min(240, Math.max(0, (new Date(a.endTime) - new Date(a.startTime)) / 60000)), 0);
  const paperMinutes = weekDays.flatMap((d) => d.tasks).filter((t) => t.type === "paper" && t.completed).reduce((s, t) => s + t.estimatedMinutes, 0);
  const actual = Math.round(attemptMinutes + paperMinutes);
  let dailyMinutes = items.dailyGoalMinutes;
  const changes = [];
  if (planned > 0 && actual < planned * 0.75) {
    const tuned = Math.max(20, Math.round(actual / studyDays / 5) * 5 + 5);
    if (tuned < dailyMinutes) {
      changes.push({
        kind: "tune",
        what: "ពេលប្រចាំថ្ងៃ",
        detail: `${dailyMinutes} → ${tuned} នាទី`,
        why: `អ្នកធ្វើបាន ${Math.round(actual / studyDays)} នាទីក្នុងមួយថ្ងៃជាមធ្យម។ ផែនការតូចជាងដែលធ្វើចប់ ប្រសើរជាងផែនការធំដែលធ្វើមិនចប់។`,
      });
      dailyMinutes = tuned;
    }
  }

  // Rebuild next week from current scores, continuing this month's quiz use.
  const calendar = buildCalendar(items.days[0].date, items.days.length).filter((c) => c.weekIndex === next);
  const memory = { used: new Map(), papers: new Set(), mocks: 0 };
  for (const d of items.days.filter((x) => x.weekIndex < next)) {
    for (const t of d.tasks) {
      if (t.quizId) memory.used.set(t.quizId, { count: (memory.used.get(t.quizId)?.count || 0) + 1, lastDay: d.dayIndex });
      if (t.paperId) memory.papers.add(t.paperId);
      if (t.mockExamId) memory.mocks += 1;
    }
  }
  const proposedDays = scheduleDays({ calendarDays: calendar, scope, content, state, dailyMinutes, memory, examName: scope.examName });

  const countFocus = (days) => {
    const m = new Map();
    for (const t of days.flatMap((d) => d.tasks)) if (t.focusTopicId != null) m.set(t.focusTopicId, (m.get(t.focusTopicId) || 0) + 1);
    return m;
  };
  const oldFocus = countFocus(items.days.filter((d) => d.weekIndex === next));
  const newFocus = countFocus(proposedDays);
  for (const id of new Set([...oldFocus.keys(), ...newFocus.keys()])) {
    const o = oldFocus.get(id) || 0;
    const n = newFocus.get(id) || 0;
    if (Math.abs(n - o) < 1 || !topicName.get(id)) continue;
    const score = after.get(id)?.percent ?? state.score.get(id);
    changes.push({
      kind: n > o ? "add" : "cut",
      what: topicName.get(id),
      detail: `${o} → ${n} ឈុត`,
      why:
        n > o
          ? `ពិន្ទុ${score != null ? ` ${score}%` : ""} — ត្រូវការការអនុវត្តបន្ថែម។`
          : `ពិន្ទុ${score != null ? ` ${score}%` : ""} — បន្ថយ ប៉ុន្តែរក្សាទុកដើម្បីរំលឹក។`,
    });
  }
  const oldPaper = items.days.filter((d) => d.weekIndex === next).flatMap((d) => d.tasks).find((t) => t.type === "paper");
  const newPaper = proposedDays.flatMap((d) => d.tasks).find((t) => t.type === "paper");
  if (oldPaper && newPaper && oldPaper.paperId !== newPaper.paperId) {
    changes.push({ kind: "tune", what: "វិញ្ញាសា", detail: `${oldPaper.title} → ${newPaper.title}`, why: "ជ្រើសវិញ្ញាសាដែលអ្នកមិនទាន់ធ្វើ។" });
  }

  const readiness = (acc) => {
    const values = [...acc.values()];
    if (!values.length) return 0;
    const mean = values.reduce((s, v) => s + v.percent, 0) / values.length;
    const mastered = scope.topicIds.filter((id) => (acc.get(id)?.percent ?? 0) >= WEAK_AREA_THRESHOLD).length;
    return Math.round(mean * 0.7 + (scope.topicIds.length ? (mastered / scope.topicIds.length) * 100 : 0) * 0.3);
  };
  const weakCount = (acc) => [...acc.values()].filter((v) => v.percent < 55).length;
  const quizSets = weekAttempts.filter((a) => a.attemptType === "quiz").length;
  const mockSets = weekAttempts.filter((a) => a.attemptType === "mock_exam").length;
  const reviewed = weekAttempts.filter((a) => a.attemptType === "review").length;

  const update = {
    updateId: `w${next}-${Date.now()}`,
    weekIndex: next,
    createdAt: new Date().toISOString(),
    basis: `ផ្អែកលើកម្រងសំណួរ ${quizSets} ឈុត${mockSets ? ` អនុវត្ត ${mockSets}` : ""}${reviewed ? " និងការពិនិត្យកំហុស" : ""}។ វិញ្ញាសាមិនរួមបញ្ចូលទេ ព្រោះគ្មានពិន្ទុ។`,
    findings,
    pattern,
    changes,
    readiness: { before: readiness(before), after: readiness(after) },
    weakTopics: { before: weakCount(before), after: weakCount(after) },
    status: "pending",
    autoApplyAt: items.weeks[next].startDate,
    proposedDays,
    dailyGoalMinutes: dailyMinutes,
  };

  await prisma.studyPlan.update({
    where: { planId: plan.planId },
    data: { items: { ...items, updates: [...(items.updates || []), update] } },
  });
  return update;
}

const publicUpdate = (u) => {
  if (!u) return null;
  const { proposedDays, dailyGoalMinutes, ...rest } = u;
  return rest;
};

function applyUpdateToItems(items, update) {
  // Work already done ahead of time stays ticked when the same content is still scheduled.
  const doneKeys = new Map(
    items.days
      .filter((d) => d.weekIndex === update.weekIndex)
      .flatMap((d) => d.tasks)
      .filter((t) => t.completed)
      .map((t) => [`${t.type}:${t.quizId ?? t.mockExamId ?? t.paperId ?? t.id}`, t.completedAt])
  );
  const replaced = items.days.map((d) => {
    if (d.weekIndex !== update.weekIndex) return d;
    const proposed = update.proposedDays.find((p) => p.date === d.date);
    if (!proposed) return d;
    return {
      ...proposed,
      tasks: proposed.tasks.map((t) => {
        const key = `${t.type}:${t.quizId ?? t.mockExamId ?? t.paperId ?? t.id}`;
        return doneKeys.has(key) ? { ...t, completed: true, completedAt: doneKeys.get(key) } : t;
      }),
    };
  });
  const calendar = buildCalendar(items.days[0].date, items.days.length);
  const stateless = { score: new Map(), weak: new Set(), topicName: new Map() };
  const rebuiltWeeks = buildWeeks(calendar, replaced, stateless, appTodayString());
  return {
    ...items,
    dailyGoalMinutes: update.dailyGoalMinutes || items.dailyGoalMinutes,
    days: replaced,
    // Keep the existing goal wording for untouched weeks; refresh the target counts of the updated week.
    weeks: items.weeks.map((w) => (w.weekIndex === update.weekIndex ? { ...w, target: rebuiltWeeks[w.weekIndex].target } : w)),
    updates: items.updates.map((u) => (u.updateId === update.updateId ? { ...u, status: "accepted" } : u)),
  };
}

async function autoApplyDueUpdates(plan) {
  const items = plan.items;
  if (items?.version !== 2) return plan;
  const today = appTodayString();
  const due = (items.updates || []).filter((u) => u.status === "pending" && u.autoApplyAt <= today);
  if (!due.length) return plan;
  let next = items;
  for (const u of due) next = applyUpdateToItems(next, u);
  return prisma.studyPlan.update({ where: { planId: plan.planId }, data: { items: next } });
}

export const getWeeklyUpdateForUser = async (userId) => {
  // Through getActivePlanForUser so a plan for other subjects is paused, not updated.
  let plan = await getActivePlanForUser(userId);
  if (plan?.items?.version !== 2) return null;

  // No review on Saturday? Still adapt next week on Sunday.
  const today = appTodayString();
  if (appDayOfWeek(today) === SUNDAY) {
    const next = weekIndexFor(plan, today) + 1;
    if (next < plan.items.weeks.length && !(plan.items.updates || []).some((u) => u.weekIndex === next)) {
      await createWeeklyUpdate(userId, plan).catch((err) => console.error("Sunday weekly update failed:", err));
      plan = await prisma.studyPlan.findUnique({ where: { planId: plan.planId } });
    }
  }
  const updates = plan.items.updates || [];
  return publicUpdate(updates[updates.length - 1] || null);
};

export const decideWeeklyUpdateForUser = async (userId, updateId, decision) => {
  if (!["accept", "keep"].includes(decision)) throw badRequest("decision must be 'accept' or 'keep'");
  const plan = await prisma.studyPlan.findFirst({ where: { userId, status: "active" }, orderBy: { planId: "desc" } });
  const update = plan?.items?.updates?.find((u) => u.updateId === updateId);
  if (!update) throw notFound("Weekly update not found");
  if (update.status !== "pending") return publicUpdate(update);

  const items =
    decision === "accept"
      ? applyUpdateToItems(plan.items, update)
      : { ...plan.items, updates: plan.items.updates.map((u) => (u.updateId === updateId ? { ...u, status: "kept" } : u)) };
  const saved = await prisma.studyPlan.update({ where: { planId: plan.planId }, data: { items } });
  return publicUpdate(saved.items.updates.find((u) => u.updateId === updateId));
};

/* Exposed for the dashboard and tests. */
export { buildCalendar, weeklyMistakeRows, reviewWindow, weekIndexFor, loadContent, scheduleDays, buildWeeks, resumeItems, planMatchesSelection };
