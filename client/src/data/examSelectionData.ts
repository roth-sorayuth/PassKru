import { ExamTarget } from '../types';

/**
 * Exam tracks for step 1 of the selection flow. Step 1.5 (which subjects) is
 * served by GET /study-plan/subject-options so the rules live server-side:
 *   nie  → Upper Secondary: pick exactly one specialized subject
 *   rttc → Lower Secondary: pick one predefined subject pair
 *   pttc → Primary (kindergarten & primary teachers): no choice; Math, Khmer Literature, Pedagogy
 * Every level also sits General Knowledge.
 */
export interface ExamCategoryConfig {
  id: string;
  targetExam: ExamTarget;
  titleKm: string;
  titleEn: string;
  badgeKm: string;
  badgeEn: string;
  levelKm: string;
  levelEn: string;
  ruleKm: string;
  ruleEn: string;
  selectionMode: 'single' | 'pair' | 'none';
  /** Saved when there is nothing to choose (selectionMode 'none'). */
  defaultSubjects?: string[];
  /** Subjects this level always sits, each shown on its own (not "+"). */
  examSubjects: string[];
}

export const EXAM_CATEGORIES: ExamCategoryConfig[] = [
  {
    id: 'higher',
    targetExam: 'nie',
    titleKm: 'កម្រិតឧត្តម (វិទ្យាល័យ)',
    titleEn: 'Higher Level (Upper Secondary)',
    badgeKm: 'កម្រិតឧត្តម',
    badgeEn: 'Higher Level',
    levelKm: 'គ្រូមធ្យមសិក្សាទុតិយភូមិ · ថ្នាក់ទី ១០–១២',
    levelEn: 'Upper secondary teachers · grades 10–12',
    ruleKm: 'ជ្រើសរើស ១ ឯកទេសទោល',
    ruleEn: 'Pick 1 specialized subject',
    selectionMode: 'single',
    examSubjects: ['generalCulture', 'english'],
  },
  {
    id: 'basic',
    targetExam: 'rttc',
    titleKm: 'កម្រិតមូលដ្ឋាន (អនុវិទ្យាល័យ)',
    titleEn: 'Basic Level (Lower Secondary)',
    badgeKm: 'កម្រិតមូលដ្ឋាន',
    badgeEn: 'Basic Level',
    levelKm: 'គ្រូមធ្យមសិក្សាបឋមភូមិ · ថ្នាក់ទី ៧–៩',
    levelEn: 'Lower secondary teachers · grades 7–9',
    ruleKm: 'ជ្រើសរើស ១ ឯកទេសគូ',
    ruleEn: 'Pick 1 subject pair',
    selectionMode: 'pair',
    examSubjects: ['generalCulture', 'english'],
  },
  {
    id: 'primary',
    targetExam: 'pttc',
    titleKm: 'កម្រិតបឋមសិក្សា',
    titleEn: 'Primary Education Level',
    badgeKm: 'កម្រិតបឋម',
    badgeEn: 'Primary Level',
    levelKm: 'គ្រូមត្តេយ្យ និងគ្រូបឋមសិក្សា',
    levelEn: 'Kindergarten & primary teachers',
    ruleKm: 'មិនបាច់ជ្រើសរើស',
    ruleEn: 'Nothing to pick',
    selectionMode: 'none',
    defaultSubjects: ['math', 'khmer', 'pedagogy', 'english'],
    examSubjects: ['generalCulture', 'math', 'khmer', 'pedagogy', 'english'],
  },
];

/**
 * Display labels for the subject keys saved on the profile. Mirrors
 * server/src/config/examSubjects.js — the server stays the authority on which
 * keys are valid for which track; this only turns keys into words.
 */
export const SUBJECT_CATALOG: Record<string, { km: string; en: string }> = {
  math: { km: 'គណិតវិទ្យា', en: 'Mathematics' },
  physics: { km: 'រូបវិទ្យា', en: 'Physics' },
  chemistry: { km: 'គីមីវិទ្យា', en: 'Chemistry' },
  biology: { km: 'ជីវវិទ្យា', en: 'Biology' },
  earthScience: { km: 'ផែនដីវិទ្យា', en: 'Earth Science' },
  khmer: { km: 'អក្សរសាស្ត្រខ្មែរ', en: 'Khmer Literature' },
  english: { km: 'ភាសាអង់គ្លេស', en: 'English' },
  french: { km: 'ភាសាបារាំង', en: 'French' },
  moralityCivics: { km: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', en: 'Morality & Civics' },
  history: { km: 'ប្រវត្តិវិទ្យា', en: 'History' },
  geography: { km: 'ភូមិវិទ្យា', en: 'Geography' },
  civics: { km: 'ពលរដ្ឋវិជ្ជា', en: 'Citizenship' },
  morality: { km: 'សីលធម៌', en: 'Morality' },
  ict: { km: 'ព័ត៌មានវិទ្យា', en: 'Information Technology' },
  homeEconomics: { km: 'គេហវិទ្យា', en: 'Home Economics' },
  generalist: { km: 'គ្រប់មុខវិជ្ជា', en: 'All subjects' },
  generalCulture: { km: 'វប្បធម៌ទូទៅ', en: 'General Knowledge' },
  pedagogy: { km: 'វប្បធម៌ទូទៅ', en: 'Pedagogy' },
};

/** The paper every level sits alongside its own subjects (General Knowledge, English); never chosen, never saved. */
export const CORE_SUBJECT_KEYS = ['generalCulture', 'english'];

export const subjectLabel = (key: string, lang: 'km' | 'en' = 'km'): string =>
  SUBJECT_CATALOG[key] ? SUBJECT_CATALOG[key][lang] : key;

/**
 * The subjects content pages should show for a profile: the chosen subjects
 * plus the core subjects. A generalist track already covers everything.
 */
export const withCoreSubjects = (selected: string[] | null | undefined): string[] => {
  const list = (selected || []).filter(Boolean);
  if (list.includes('generalist')) return list;
  return Array.from(new Set([...list, ...CORE_SUBJECT_KEYS]));
};

/**
 * Returns the matching category config by titleKm, id, or target code.
 */
export const getCategoryConfig = (categoryOrTarget?: string): ExamCategoryConfig | undefined => {
  if (!categoryOrTarget) return undefined;
  const query = categoryOrTarget.toLowerCase().trim();
  return EXAM_CATEGORIES.find(
    (cat) =>
      cat.id === query ||
      cat.targetExam === query ||
      cat.titleKm.toLowerCase().includes(query) ||
      query.includes(cat.titleKm.toLowerCase()) ||
      query.includes(cat.id)
  );
};

/**
 * Normalizes subject names and aliases into lowercase tokens.
 */
const getSubjectTokens = (subject: string): string[] => {
  // A saved key ("math", "generalCulture") matches like its Khmer and English names.
  const known = SUBJECT_CATALOG[subject?.trim?.()];
  if (known && subject !== 'generalist') {
    return Array.from(new Set([subject.toLowerCase(), ...getSubjectTokens(known.km), ...getSubjectTokens(known.en)]));
  }
  const s = subject.toLowerCase().trim();
  const tokens = [s];

  if (s.includes('គរុកោសល្យ') || s.includes('វប្បធម៌ទូទៅ') || s.includes('pedagogy')) {
    tokens.push('គរុកោសល្យ', 'វប្បធម៌ទូទៅ', 'pedagogy');
  }
  if (s.includes('ព័ត៌មានវិទ្យា') || s === 'ict') {
    tokens.push('ព័ត៌មានវិទ្យា', 'ict');
  }

  if (s.includes('វប្បធម៌ទូទៅ') || s.includes('general culture')) {
    tokens.push('វប្បធម៌ទូទៅ', 'general culture', 'general knowledge', 'culture', 'sec-general-culture', 'pttc-general-culture');
  }
  if (s.includes('គណិត') || s.includes('math')) {
    tokens.push('គណិត', 'គណិតវិទ្យា', 'math', 'mathematics', 'sec-mathematics', 'pttc-math');
  }
  if (s.includes('រូបវិទ្យា') || s.includes('physics')) {
    tokens.push('រូបវិទ្យា', 'physics', 'sec-physics');
  }
  if (s.includes('គីមី') || s.includes('chemistry')) {
    tokens.push('គីមី', 'គីមីវិទ្យា', 'chemistry', 'sec-chemistry');
  }
  if (s.includes('ជីវ') || s.includes('biology')) {
    tokens.push('ជីវវិទ្យា', 'biology', 'sec-biology');
  }
  if (s.includes('ផែនដី') || s.includes('earth') || s.includes('បរិស្ថាន')) {
    tokens.push('ផែនដី', 'ផែនដីវិទ្យា', 'ផែនដី និងបរិស្ថានវិទ្យា', 'earth science', 'earth', 'sec-earth');
  }
  if (s.includes('ខ្មែរ') || s.includes('khmer')) {
    tokens.push('ភាសាខ្មែរ', 'អក្សរសាស្ត្រខ្មែរ', 'khmer', 'sec-khmer-literature', 'pttc-khmer');
  }
  if (s.includes('អង់គ្លេស') || s.includes('english')) {
    tokens.push('ភាសាអង់គ្លេស', 'english', 'sec-english');
    tokens.push('ភាសាអង់គ្លេស', 'english', 'sec-english', 'pttc-english', 'ឯកទេសភាសាអង់គ្លេស');
  }
  if (s.includes('បារាំង') || s.includes('french')) {
    tokens.push('ភាសាបារាំង', 'french');
  }
  if (s.includes('ប្រវត្តិ') || s.includes('history')) {
    tokens.push('ប្រវត្តិវិទ្យា', 'history', 'sec-history-geography');
  }
  if (s.includes('ភូមិ') || s.includes('geography')) {
    tokens.push('ភូមិវិទ្យា', 'geography', 'sec-history-geography');
  }
  if (s.includes('សីលធម៌') || s.includes('morality') || s.includes('ពលរដ្ឋ')) {
    tokens.push('សីលធម៌', 'ពលរដ្ឋវិជ្ជា', 'morality', 'civics');
  }

  // Handle combinations: e.g. "Math - Physics"
  if (s.includes('math - physics') || s.includes('គណិត - រូប')) {
    tokens.push('math - physics', 'គណិតវិទ្យា', 'រូបវិទ្យា', 'math', 'physics', 'sec-mathematics', 'sec-physics');
  }
  if (s.includes('physics - chemistry') || s.includes('រូប - គីមី')) {
    tokens.push('physics - chemistry', 'រូបវិទ្យា', 'គីមីវិទ្យា', 'physics', 'chemistry', 'sec-physics', 'sec-chemistry');
  }
  if (s.includes('biology - earth') || s.includes('ជីវ - ផែនដី')) {
    tokens.push('biology - earth science', 'ជីវវិទ្យា', 'ផែនដី និងបរិស្ថានវិទ្យា', 'biology', 'earth science', 'sec-biology');
  }
  if (s.includes('history - geography') || s.includes('ប្រវត្តិ - ភូមិ')) {
    tokens.push('history - geography', 'ប្រវត្តិវិទ្យា', 'ភូមិវិទ្យា', 'history', 'geography', 'sec-history-geography');
  }
  if (s.includes('khmer - morality') || s.includes('ខ្មែរ - ពលរដ្ឋ')) {
    tokens.push('khmer - morality', 'អក្សរសាស្ត្រខ្មែរ', 'ភាសាខ្មែរ', 'សីលធម៌', 'khmer', 'sec-khmer-literature');
  }
  if (s.includes('math - english') || s.includes('គណិត - អង់គ្លេស')) {
    tokens.push('math - english', 'គណិតវិទ្យា', 'ភាសាអង់គ្លេស', 'math', 'english', 'sec-mathematics', 'sec-english');
  }
  if (s.includes('khmer - english') || s.includes('ខ្មែរ - អង់គ្លេស')) {
    tokens.push('khmer - english', 'អក្សរសាស្ត្រខ្មែរ', 'ភាសាខ្មែរ', 'ភាសាអង់គ្លេស', 'khmer', 'english', 'sec-khmer-literature', 'sec-english');
  }

  return tokens;
};

/**
 * Strict filtering check: determines if a given item (subject name, ID, or quiz/flashcard subject)
 * matches the user's active selectedSubjects array.
 */
export const isSubjectInSelection = (
  subjectCandidate: string | null | undefined,
  selectedSubjects: string[] | null | undefined
): boolean => {
  if (!subjectCandidate || !selectedSubjects || selectedSubjects.length === 0) {
    return false;
  }
  // PTTC / kindergarten teach every subject.
  if (selectedSubjects.includes('generalist')) return true;

  const candidateTokens = getSubjectTokens(subjectCandidate);

  return selectedSubjects.some((selected) => {
    const selectedTokens = getSubjectTokens(selected);
    return candidateTokens.some((cToken) =>
      selectedTokens.some((sToken) => cToken.includes(sToken) || sToken.includes(cToken))
    );
  });
};

/**
 * Splits a specialization pair/couple into two individual subject names.
 * Supports Khmer and English naming.
 */
export const splitSubjectPair = (
  subject: string,
  lang: 'km' | 'en' = 'km'
): string[] => {
  if (!subject) return [];
  const s = subject.trim();
  const lower = s.toLowerCase();

  // 1. Math - Physics
  if (
    (lower.includes('math') && lower.includes('phys')) ||
    (lower.includes('គណិត') && lower.includes('រូប'))
  ) {
    return lang === 'km' ? ['គណិតវិទ្យា', 'រូបវិទ្យា'] : ['Mathematics', 'Physics'];
  }

  // 2. Physics - Chemistry
  if (
    (lower.includes('phys') && lower.includes('chem')) ||
    (lower.includes('រូប') && lower.includes('គីមី'))
  ) {
    return lang === 'km' ? ['រូបវិទ្យា', 'គីមីវិទ្យា'] : ['Physics', 'Chemistry'];
  }

  // 3. Biology - Earth Science
  if (
    (lower.includes('bio') && (lower.includes('earth') || lower.includes('geo'))) ||
    (lower.includes('ជីវ') && lower.includes('ផែនដី'))
  ) {
    return lang === 'km' ? ['ជីវវិទ្យា', 'ផែនដី និងបរិស្ថានវិទ្យា'] : ['Biology', 'Earth & Environmental Science'];
  }

  // 4. History - Geography
  if (
    (lower.includes('hist') && lower.includes('geo')) ||
    (lower.includes('ប្រវត្តិ') && lower.includes('ភូមិ'))
  ) {
    return lang === 'km' ? ['ប្រវត្តិវិទ្យា', 'ភូមិវិទ្យា'] : ['History', 'Geography'];
  }

  // 5. Khmer - Morality / Civics
  if (
    ((lower.includes('khmer') || lower.includes('ខ្មែរ') || lower.includes('អក្សរសាស្ត្រ')) &&
      (lower.includes('moral') || lower.includes('civic') || lower.includes('ពលរដ្ឋ') || lower.includes('សីលធម៌')))
  ) {
    return lang === 'km' ? ['អក្សរសាស្ត្រខ្មែរ', 'ពលរដ្ឋវិជ្ជា'] : ['Khmer Literature', 'Civics & Morality'];
  }

  // 6. Math - English
  if (
    (lower.includes('math') && lower.includes('eng')) ||
    (lower.includes('គណិត') && lower.includes('អង់គ្លេស'))
  ) {
    return lang === 'km' ? ['គណិតវិទ្យា', 'ភាសាអង់គ្លេស'] : ['Mathematics', 'English'];
  }

  // 7. Khmer - English
  if (
    ((lower.includes('khmer') || lower.includes('ខ្មែរ') || lower.includes('អក្សរសាស្ត្រ')) &&
      (lower.includes('eng') || lower.includes('អង់គ្លេស')))
  ) {
    return lang === 'km' ? ['អក្សរសាស្ត្រខ្មែរ', 'ភាសាអង់គ្លេស'] : ['Khmer Literature', 'English'];
  }

  // 8. ICT - English
  if (
    (lower.includes('ict') || lower.includes('ព័ត៌មានវិទ្យា')) &&
    (lower.includes('eng') || lower.includes('អង់គ្លេស'))
  ) {
    return lang === 'km' ? ['ព័ត៌មានវិទ្យា', 'ភាសាអង់គ្លេស'] : ['ICT', 'English'];
  }

  // Generic fallback if contains delimiter
  const cleaned = s.replace(/\([^)]*\)/g, '').trim();
  const delimiters = [' - ', ' / ', ' & ', ' + ', ' និង '];
  for (const delim of delimiters) {
    if (cleaned.includes(delim)) {
      const parts = cleaned.split(delim).map((p) => p.trim()).filter(Boolean);
      if (parts.length === 2) {
        return parts;
      }
    }
  }

  return [s];
};

/**
 * Expands an array of subject selections by dividing any couple/combination
 * into 2 individual subjects while preserving singles.
 */
export const expandSubjectSelection = (
  subjects: string[],
  lang: 'km' | 'en' = 'km'
): string[] => {
  if (!subjects || subjects.length === 0) return [];
  const result: string[] = [];
  for (const subj of subjects) {
    if (SUBJECT_CATALOG[subj]) {
      result.push(subjectLabel(subj, lang));
      continue;
    }
    const parts = splitSubjectPair(subj, lang);
    result.push(...parts);
  }
  return Array.from(new Set(result));
};

/**
 * Translates an exam target code or category string into a formal user-facing title.
 * Removes acronyms like NIE, RTTC, PTTC.
 */
export const getExamCategoryLabel = (
  targetOrCategory?: string,
  lang: 'km' | 'en' = 'km'
): string => {
  if (!targetOrCategory) return '';
  const query = targetOrCategory.toLowerCase().trim();

  if (query === 'nie' || query === 'higher' || query.includes('ឧត្តម') || query.includes('វិទ្យាល័យ') || query.includes('upper secondary')) {
    return lang === 'km' ? 'កម្រិតឧត្តម (វិទ្យាល័យ)' : 'Higher Level (Upper Secondary)';
  }
  if (query === 'rttc' || query === 'basic' || query.includes('មូលដ្ឋាន') || query.includes('អនុវិទ្យាល័យ') || query.includes('lower secondary')) {
    return lang === 'km' ? 'កម្រិតមូលដ្ឋាន (អនុវិទ្យាល័យ)' : 'Basic Level (Lower Secondary)';
  }
  if (query === 'pttc' || query === 'primary' || query.includes('បឋម') || query.includes('primary')) {
    return lang === 'km' ? 'កម្រិតបឋមសិក្សា' : 'Primary Education Level';
  }
  if (query === 'kindergarten' || query.includes('មត្តេយ្យ') || query.includes('kindergarten')) {
    return lang === 'km' ? 'មត្តេយ្យសិក្សា' : 'Kindergarten Level';
  }

  const cat = getCategoryConfig(targetOrCategory);
  if (cat) {
    return lang === 'km' ? cat.titleKm : cat.titleEn;
  }

  return targetOrCategory;
};

/**
 * Translates an exam target code or category into a short badge/tag label.
 * Removes acronyms like NIE, RTTC, PTTC.
 */
export const getExamCategoryTag = (
  targetOrCategory?: string,
  lang: 'km' | 'en' = 'km'
): string => {
  if (!targetOrCategory) return '';
  const query = targetOrCategory.toLowerCase().trim();

  if (query === 'nie' || query === 'higher' || query.includes('ឧត្តម') || query.includes('វិទ្យាល័យ') || query.includes('upper secondary')) {
    return lang === 'km' ? 'កម្រិតឧត្តម' : 'Higher Level';
  }
  if (query === 'rttc' || query === 'basic' || query.includes('មូលដ្ឋាន') || query.includes('អនុវិទ្យាល័យ') || query.includes('lower secondary')) {
    return lang === 'km' ? 'កម្រិតមូលដ្ឋាន' : 'Basic Level';
  }
  if (query === 'pttc' || query === 'primary' || query.includes('បឋម') || query.includes('primary')) {
    return lang === 'km' ? 'កម្រិតបឋម' : 'Primary Level';
  }
  if (query === 'kindergarten' || query.includes('មត្តេយ្យ') || query.includes('kindergarten')) {
    return lang === 'km' ? 'មត្តេយ្យ' : 'Kindergarten';
  }

  const cat = getCategoryConfig(targetOrCategory);
  if (cat) {
    return lang === 'km' ? cat.badgeKm : cat.badgeEn;
  }

  return targetOrCategory;
};


