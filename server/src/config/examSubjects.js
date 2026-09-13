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
    km: "ផែនដីវិទ្យា",
    en: "Earth Science",
    aliases: ["ផែនដី", "បរិស្ថានវិទ្យា", "earth", "environmental"],
  },
  khmer: { key: "khmer", km: "អក្សរសាស្ត្រខ្មែរ", en: "Khmer Literature", aliases: ["ភាសាខ្មែរ", "អក្សរសាស្ត្រខ្មែរ", "khmer"] },
  english: { key: "english", km: "ភាសាអង់គ្លេស", en: "English", aliases: ["ភាសាអង់គ្លេស", "english"] },
  french: { key: "french", km: "ភាសាបារាំង", en: "French", aliases: ["ភាសាបារាំង", "french"] },
  history: { key: "history", km: "ប្រវត្តិវិទ្យា", en: "History", aliases: ["ប្រវត្តិវិទ្យា", "history"] },
  geography: { key: "geography", km: "ភូមិវិទ្យា", en: "Geography", aliases: ["ភូមិវិទ្យា", "geography"] },
  civics: { key: "civics", km: "ពលរដ្ឋវិជ្ជា", en: "Citizenship", aliases: ["ពលរដ្ឋវិជ្ជា", "civics", "citizenship"] },
  morality: { key: "morality", km: "សីលធម៌", en: "Morality", aliases: ["សីលធម៌", "morality"] },
  // Upper-secondary major. Listed after morality/civics so a legacy "សីលធម៌" label still means morality.
  moralityCivics: {
    key: "moralityCivics",
    km: "សីលធម៌-ពលរដ្ឋវិជ្ជា",
    en: "Morality & Civics",
    aliases: ["សីលធម៌-ពលរដ្ឋវិជ្ជា", "morality & civics"],
  },
  ict: { key: "ict", km: "ព័ត៌មានវិទ្យា", en: "Information Technology", aliases: ["ព័ត៌មានវិទ្យា", "ict", "computer"] },
  homeEconomics: { key: "homeEconomics", km: "គេហវិទ្យា", en: "Home Economics", aliases: ["គេហវិទ្យា", "home economics"] },
  // No aliases on purpose: "generalist" means the whole syllabus, so it must
  // never match one specific Subject row. It used to alias "វប្បធម៌ទូទៅ",
  // which made a generalist track look like a General Culture major.
  generalist: {
    key: "generalist",
    km: "គ្រប់មុខវិជ្ជា",
    en: "All subjects (generalist)",
    aliases: [],
  },
  // Core papers every track sits alongside its major. Never chosen and never
  // stored on User.targetSubjects — the planner and content pages add them.
  generalCulture: {
    key: "generalCulture",
    km: "វប្បធម៌ទូទៅ",
    en: "General Knowledge",
    aliases: ["វប្បធម៌ទូទៅ", "general culture", "general knowledge"],
  },
  // One of Primary's fixed exam subjects.
  pedagogy: { key: "pedagogy", km: "គរុកោសល្យ", en: "Pedagogy", aliases: ["គរុកោសល្យ", "pedagogy"] },
};

/**
 * Levels and subjects (product spec, Sept 2026):
 *   Primary (kindergarten & primary teachers) → no choice: General Knowledge,
 *     Basic Mathematics, Basic Khmer Literature, Pedagogy, English
 *   Lower Secondary (RTTC) → one predefined subject pair, + General Knowledge, English
 *   Upper Secondary (NIE)  → one specialized subject (Paper 1), + General Knowledge, English
 * General Knowledge and English are the papers every candidate sits.
 */
export const CORE_SUBJECT_KEYS = ["generalCulture", "english"];

/** Subjects nobody picks: stripped from saved choices. */
const NEVER_CHOSEN_KEYS = ["generalCulture", "pedagogy"];

/** RTTC subject pairs (ឯកទេសគូ) — a candidate must choose one pair, never a single subject. */
const RTTC_PAIRS = [
  ["math", "physics"],
  ["biology", "chemistry"],
  ["biology", "earthScience"],
  ["khmer", "history"],
  ["khmer", "morality"],
];

/**
 * selectionMode drives the wizard:
 *   "single" — pick exactly one major
 *   "pair"   — pick one predefined dual-major pairing
 *   "none"   — nothing to choose, the subject step is skipped; defaultSubjects are saved
 *
 * weighting splits the study plan: `major`/`second` for the chosen (or fixed)
 * subjects, `core` for General Knowledge. (The placement test is always 15 a subject.)
 * There is no separate kindergarten level: kindergarten teachers sit the Primary exam.
 */
export const EXAM_SUBJECT_RULES = {
  nie: {
    selectionMode: "single",
    subjects: [
      "math", "physics", "chemistry", "biology", "earthScience", "khmer",
      "history", "geography", "moralityCivics", "english", "french", "ict",
    ],
    weighting: { major: 80, core: 20 },
  },
  rttc: {
    selectionMode: "pair",
    pairs: RTTC_PAIRS,
    weighting: { major: 40, second: 40, core: 20 },
  },
  pttc: {
    // Fixed papers in equal parts: Math, Khmer Literature, Pedagogy, English + General Knowledge.
    selectionMode: "none",
    defaultSubjects: ["math", "khmer", "pedagogy", "english"],
    weighting: { major: 25, second: 25, core: 25 },
  },
};

export const getRulesForExamCode = (code) =>
  EXAM_SUBJECT_RULES[String(code || "").toLowerCase()] || null;

/** Expands stored keys into label objects; unknown keys degrade to raw text. */
export const describeSubjects = (keys = []) =>
  (keys || []).map((k) => SUBJECTS[k] || { key: k, km: k, en: k, aliases: [k] });

/**
 * Subject names are free text typed by admins, so spacing and stray
 * punctuation vary — the live data has "ជីវ:វិទ្យា" for ជីវវិទ្យា.
 */
const normalizeName = (value) => String(value || "").toLowerCase().replace(/[\s:：.\-_​]/g, "");

/** True when a DB Subject row plausibly corresponds to one of the given keys. */
export const subjectMatchesKeys = (subjectName, keys = []) => {
  const name = normalizeName(subjectName);
  if (!name) return false;
  return describeSubjects(keys).some((s) =>
    (s.aliases || []).some((a) => normalizeName(a) && name.includes(normalizeName(a)))
  );
};

/** Finds the subject key a free-text label refers to, via its aliases. */
function keyForLabel(label) {
  const text = String(label || "").trim().toLowerCase();
  if (!text) return null;
  if (SUBJECTS[label]) return label;
  for (const subject of Object.values(SUBJECTS)) {
    const hit = (subject.aliases || []).some((alias) => {
      const a = String(alias).toLowerCase();
      return text === a || text.includes(a) || a.includes(text);
    });
    if (hit) return subject.key;
  }
  return null;
}

/**
 * Converts whatever is stored on a user into subject keys.
 *
 * The exam-selection modal used to save display labels — Khmer names
 * ("គណិតវិទ្យា"), a whole RTTC pairing as one string ("Math - Physics"), and
 * General Culture / English as extra "required" subjects. Keys pass through,
 * pairings are split, and core subjects are dropped.
 */
export const toSubjectKeys = (list = []) => {
  const keys = [];
  for (const raw of Array.isArray(list) ? list : []) {
    const value = String(raw || "").trim();
    if (!value) continue;
    const parts = SUBJECTS[value]
      ? [value]
      : value
          .replace(/\([^)]*\)/g, " ")
          .split(/\s+[-+&/]\s+|\s+និង\s+/)
          .map((p) => p.trim())
          .filter(Boolean);
    for (const part of parts) {
      const key = keyForLabel(part);
      if (key && !NEVER_CHOSEN_KEYS.includes(key) && !keys.includes(key)) keys.push(key);
    }
  }
  return keys;
};

const sameKeySet = (a, b) => a.length === b.length && [...a].sort().every((k, i) => k === [...b].sort()[i]);

/**
 * Enforces the per-track selection rule and returns the keys to persist.
 *   nie                 → exactly one subject from the NIE list
 *   rttc                → exactly one configured pairing (order doesn't matter)
 *   pttc / kindergarten → always ["generalist"], whatever was sent
 *
 * Returns { ok, keys } on success, { ok: false, keys: [], message } otherwise.
 */
export const normalizeSubjectSelection = (examCode, rawList = []) => {
  const code = String(examCode || "").toLowerCase();
  const rules = getRulesForExamCode(code);
  if (!rules) return { ok: false, keys: [], message: `Unknown exam track "${examCode}"` };

  if (rules.selectionMode === "none") return { ok: true, keys: [...rules.defaultSubjects] };

  // Legacy rows can hold English as an "automatic" subject next to the real
  // choice; drop it only when it makes the selection too long.
  let keys = toSubjectKeys(rawList).filter((k) => k !== "generalist");
  const wanted = rules.selectionMode === "single" ? 1 : 2;
  if (keys.length > wanted && keys.includes("english")) {
    keys = keys.filter((k) => k !== "english");
  }

  if (rules.selectionMode === "single") {
    if (keys.length === 1 && rules.subjects.includes(keys[0])) return { ok: true, keys };
    return { ok: false, keys: [], message: `${code.toUpperCase()} requires exactly one subject from: ${rules.subjects.join(", ")}` };
  }

  const pair = rules.pairs.find((p) => sameKeySet(p, keys));
  if (keys.length === 2 && pair) return { ok: true, keys: [...pair] };
  return {
    ok: false,
    keys: [],
    message: `${code.toUpperCase()} requires one of these pairings: ${rules.pairs.map((p) => p.join("+")).join(", ")}`,
  };
};

/** Display label for a key in the requested language. */
export const subjectLabel = (key, lang = "km") => {
  const s = SUBJECTS[key];
  return s ? (lang === "en" ? s.en : s.km) : key;
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
