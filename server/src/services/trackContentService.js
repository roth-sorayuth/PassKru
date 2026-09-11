import { prisma } from "../config/prisma.js";
import { CORE_SUBJECT_KEYS, EXAM_SUBJECT_RULES, SUBJECTS, subjectMatchesKeys } from "../config/examSubjects.js";

/**
 * How much real content sits behind each exam track and subject, so the
 * exam-selection wizard can show it and steer candidates away from choices
 * that have nothing to study yet (e.g. a track with no Exam row, or a subject
 * with no questions).
 */

const EMPTY = { questions: 0, quizzes: 0, papers: 0 };

const sum = (list) =>
  list.reduce((a, c) => ({ questions: a.questions + c.questions, quizzes: a.quizzes + c.quizzes, papers: a.papers + c.papers }), { ...EMPTY });

const subjectCounts = (s) => ({
  questions: s.topics.reduce((n, t) => n + t._count.questions, 0),
  quizzes: s._count.quizzes,
  papers: s._count.pastPapers,
});

async function loadExams() {
  const exams = await prisma.exam.findMany({
    select: {
      examId: true,
      targetCode: true,
      _count: { select: { mockExams: true } },
      subjects: {
        select: {
          subjectName: true,
          _count: { select: { quizzes: true, pastPapers: true } },
          topics: { select: { _count: { select: { questions: true } } } },
        },
      },
    },
  });
  return new Map(exams.filter((e) => e.targetCode).map((e) => [e.targetCode.toLowerCase(), e]));
}

export const contentForKey = (exam, key) =>
  exam ? sum(exam.subjects.filter((s) => subjectMatchesKeys(s.subjectName, [key])).map(subjectCounts)) : { ...EMPTY };

/** Every configured track with whether it can be studied (an exam with questions) and its totals. */
export async function getTrackAvailability() {
  const exams = await loadExams();
  return Object.keys(EXAM_SUBJECT_RULES).map((code) => {
    const exam = exams.get(code);
    const total = exam ? sum(exam.subjects.map(subjectCounts)) : { ...EMPTY };
    return {
      code,
      available: Boolean(exam) && total.questions > 0,
      content: { ...total, practice: exam?._count.mockExams || 0 },
    };
  });
}

/** Adds `content` counts to each option of a getSubjectOptionsForExamCode payload. */
export async function withContentCounts(code, options) {
  const exam = (await loadExams()).get(String(code || "").toLowerCase());
  const tag = (subject) => ({ ...subject, content: contentForKey(exam, subject.key) });
  const core = CORE_SUBJECT_KEYS.map((k) => tag(SUBJECTS[k]));

  if (options.selectionMode === "single") return { ...options, subjects: options.subjects.map(tag), core, examAvailable: Boolean(exam) };
  if (options.selectionMode === "pair") {
    return {
      ...options,
      pairs: options.pairs.map((p) => ({ ...p, subjects: p.subjects.map(tag) })),
      core,
      examAvailable: Boolean(exam),
    };
  }
  return { ...options, core, examAvailable: Boolean(exam) };
}
