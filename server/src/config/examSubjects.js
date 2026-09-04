/**
 * Subject-selection rules per exam track (MoEYS teacher recruitment).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ⚠ VERIFY BEFORE RELYING ON THIS IN PRODUCTION
 * The subject lists and RTTC pairings below were compiled from secondary
 * academic/NGO sources describing Cambodian teacher training, NOT from an
 * official MoEYS exam regulation:
 *   - dccam.org/homepage/education/teacher-training
 *   - "Teacher Education in Cambodia: Formulae, Challenges and Suggestions"
 *   - NIE upper-secondary programme descriptions
 * Treat them as a sensible starting catalogue and correct them against the
 * official circular. This file is deliberately data-shaped and served to the
 * client over the API so fixing it never requires a UI change.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * `key` is what gets persisted on User.targetSubjects — a stable identifier,
 * so renaming a label never orphans saved candidate data. `aliases` are used
 * to match a key against real Subject rows, whose names are Khmer free text.
 */

export const SUBJECTS = {
  math: { key: "math", km: "គណិតវិទ្យា", en: "Mathematics", aliases: ["គណិតវិទ្យា", "math", "mathematics"] },
  physics: { key: "physics", km: "រូបវិទ្យា", en: "Physics", aliases: ["រូបវិទ្យា", "physics"] },
  chemistry: { key: "chemistry", km: "គីមីវិទ្យា", en: "Chemistry", aliases: ["គីមីវិទ្យា", "chemistry"] },
  biology: { key: "biology", km: "ជីវវិទ្យា", en: "Biology", aliases: ["ជីវវិទ្យា", "biology"] },
  earthScience: {
    key: "earthScience",
    km: "ផែនដី និងបរិស្ថានវិទ្យា",
    en: "Earth & Environmental Science",
    aliases: ["ផែនដី", "បរិស្ថានវិទ្យា", "earth", "environmental"],
  },
  khmer: { key: "khmer", km: "ភាសាខ្មែរ", en: "Khmer Literature", aliases: ["ភាសាខ្មែរ", "អក្សរសាស្ត្រខ្មែរ", "khmer"] },
  english: { key: "english", km: "ភាសាអង់គ្លេស", en: "English", aliases: ["ភាសាអង់គ្លេស", "english"] },
  history: { key: "history", km: "ប្រវត្តិវិទ្យា", en: "History", aliases: ["ប្រវត្តិវិទ្យា", "history"] },
  geography: { key: "geography", km: "ភូមិវិទ្យា", en: "Geography", aliases: ["ភូមិវិទ្យា", "geography"] },
  civics: { key: "civics", km: "ពលរដ្ឋវិជ្ជា", en: "Citizenship", aliases: ["ពលរដ្ឋវិជ្ជា", "civics", "citizenship"] },
  morality: { key: "morality", km: "សីលធម៌", en: "Morality", aliases: ["សីលធម៌", "morality"] },
  ict: { key: "ict", km: "ព័ត៌មានវិទ្យា", en: "ICT", aliases: ["ព័ត៌មានវិទ្យា", "ict", "computer"] },
  homeEconomics: { key: "homeEconomics", km: "គេហវិទ្យា", en: "Home Economics", aliases: ["គេហវិទ្យា", "home economics"] },
  generalist: {
    key: "generalist",
    km: "គ្រប់មុខវិជ្ជា (បឋមសិក្សា)",
    en: "All subjects (generalist)",
    aliases: ["វប្បធម៌ទូទៅ", "generalist"],
  },
};

/** RTTC certifies in two areas — these are the pairings we surface. */
const RTTC_PAIRS = [
  ["math", "physics"],
  ["physics", "chemistry"],
  ["chemistry", "biology"],
  ["khmer", "english"],
  ["history", "geography"],
  ["civics", "morality"],
  ["ict", "english"],
];

/**
 * selectionMode drives the wizard:
 *   "single" — pick exactly one major
 *   "pair"   — pick one predefined dual-major pairing
 *   "none"   — generalist track, the subject step is skipped entirely
 */
export const EXAM_SUBJECT_RULES = {
  nie: {
    selectionMode: "single",
    subjects: ["math", "physics", "chemistry", "biology", "earthScience", "khmer", "english", "history", "geography"],
    // A single deep major, with pedagogy always present as the minor strand.
    weighting: { major: 80, pedagogy: 20 },
  },
  rttc: {
    selectionMode: "pair",
    pairs: RTTC_PAIRS,
    weighting: { major: 40, second: 40, pedagogy: 20 },
  },
  pttc: {
    selectionMode: "none",
    defaultSubjects: ["generalist"],
  },
  kindergarten: {
    selectionMode: "none",
    defaultSubjects: ["generalist"],
  },
};

export const getRulesForExamCode = (code) =>
  EXAM_SUBJECT_RULES[String(code || "").toLowerCase()] || null;

/** Expands stored keys into label objects; unknown keys degrade to raw text. */
export const describeSubjects = (keys = []) =>
  (keys || []).map((k) => SUBJECTS[k] || { key: k, km: k, en: k, aliases: [k] });

/** True when a DB Subject row plausibly corresponds to one of the given keys. */
export const subjectMatchesKeys = (subjectName, keys = []) => {
  const name = String(subjectName || "").toLowerCase();
  if (!name) return false;
  return describeSubjects(keys).some((s) =>
    (s.aliases || []).some((a) => name.includes(String(a).toLowerCase()))
  );
};

/**
 * Wizard payload for one exam track: the selectable options plus how many
 * the candidate must choose. Shaped for direct rendering.
 */
export const getSubjectOptionsForExamCode = (code) => {
  const rules = getRulesForExamCode(code);
  if (!rules) return null;

  if (rules.selectionMode === "pair") {
    return {
      selectionMode: "pair",
      requiredCount: 2,
      pairs: rules.pairs.map(([a, b]) => ({
        id: `${a}+${b}`,
        subjects: [SUBJECTS[a], SUBJECTS[b]],
      })),
    };
  }

  if (rules.selectionMode === "single") {
    return {
      selectionMode: "single",
      requiredCount: 1,
      subjects: rules.subjects.map((k) => SUBJECTS[k]),
    };
  }

  return {
    selectionMode: "none",
    requiredCount: 0,
    defaultSubjects: (rules.defaultSubjects || []).map((k) => SUBJECTS[k]),
  };
};
