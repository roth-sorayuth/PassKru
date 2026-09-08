import { ExamTarget } from '../types';

export interface ExamCategoryConfig {
  id: string;
  targetExam: ExamTarget;
  titleKm: string;
  titleEn: string;
  badgeKm: string;
  badgeEn: string;
  levelKm: string;
  levelEn: string;
  descriptionKm: string;
  descriptionEn: string;
  requiredSubjects: string[];
  selectionType: 'single' | 'combination' | 'automatic';
  availableOptions?: {
    id: string;
    labelKm: string;
    labelEn: string;
    subjectKey: string;
  }[];
}

export const EXAM_CATEGORIES: ExamCategoryConfig[] = [
  {
    id: 'higher',
    targetExam: 'nie',
    titleKm: 'កម្រិតឧត្តម (វិទ្យាល័យ)',
    titleEn: 'Higher Level (Upper Secondary)',
    badgeKm: 'បរិញ្ញាបត្រ+១',
    badgeEn: "Bachelor's + 1",
    levelKm: 'ក្របខណ្ឌគ្រូបង្រៀនកម្រិតឧត្តម / វិទ្យាល័យ (ថ្នាក់ទី ១០-១២)',
    levelEn: 'Upper Secondary / High School Teachers (Grades 10–12)',
    descriptionKm: 'តម្រូវឱ្យជ្រើសរើសវប្បធម៌ទូទៅ (ស្វ័យប្រវត្តិ) និងមុខវិជ្ជាឯកទេសបន្ថែមចំនួន ១។',
    descriptionEn: 'Requires General Culture (automatic) and 1 additional specialization subject.',
    requiredSubjects: ['វប្បធម៌ទូទៅ'],
    selectionType: 'single',
    availableOptions: [
      { id: 'opt-math', labelKm: 'គណិតវិទ្យា', labelEn: 'Mathematics', subjectKey: 'គណិតវិទ្យា' },
      { id: 'opt-physics', labelKm: 'រូបវិទ្យា', labelEn: 'Physics', subjectKey: 'រូបវិទ្យា' },
      { id: 'opt-chemistry', labelKm: 'គីមីវិទ្យា', labelEn: 'Chemistry', subjectKey: 'គីមីវិទ្យា' },
      { id: 'opt-biology', labelKm: 'ជីវវិទ្យា', labelEn: 'Biology', subjectKey: 'ជីវវិទ្យា' },
      { id: 'opt-earth', labelKm: 'ផែនដី និងបរិស្ថានវិទ្យា', labelEn: 'Earth & Environmental Science', subjectKey: 'ផែនដី និងបរិស្ថានវិទ្យា' },
      { id: 'opt-khmer', labelKm: 'អក្សរសាស្ត្រខ្មែរ', labelEn: 'Khmer Literature', subjectKey: 'អក្សរសាស្ត្រខ្មែរ' },
      { id: 'opt-english', labelKm: 'ភាសាអង់គ្លេស', labelEn: 'English Language', subjectKey: 'ភាសាអង់គ្លេស' },
      { id: 'opt-history', labelKm: 'ប្រវត្តិវិទ្យា', labelEn: 'History', subjectKey: 'ប្រវត្តិវិទ្យា' },
      { id: 'opt-geography', labelKm: 'ភូមិវិទ្យា', labelEn: 'Geography', subjectKey: 'ភូមិវិទ្យា' },
    ],
  },
  {
    id: 'basic',
    targetExam: 'rttc',
    titleKm: 'កម្រិតមូលដ្ឋាន (អនុវិទ្យាល័យ)',
    titleEn: 'Basic Level (Lower Secondary)',
    badgeKm: '១២+២ / បរិញ្ញាបត្ររង',
    badgeEn: '12+2 / Associate Degree',
    levelKm: 'ក្របខណ្ឌគ្រូបង្រៀនកម្រិតមូលដ្ឋាន / អនុវិទ្យាល័យ (ថ្នាក់ទី ៧-៩)',
    levelEn: 'Lower Secondary / Middle School Teachers (Grades 7–9)',
    descriptionKm: 'តម្រូវឱ្យជ្រើសរើសវប្បធម៌ទូទៅ (ស្វ័យប្រវត្តិ) និងគូឯកទេសចម្រុះចំនួន ១។',
    descriptionEn: 'Requires General Culture (automatic) and 1 subject combination.',
    requiredSubjects: ['វប្បធម៌ទូទៅ'],
    selectionType: 'combination',
    availableOptions: [
      { id: 'pair-math-physics', labelKm: 'Math - Physics (គណិត - រូបវិទ្យា)', labelEn: 'Math - Physics', subjectKey: 'Math - Physics' },
      { id: 'pair-physics-chem', labelKm: 'Physics - Chemistry (រូបវិទ្យា - គីមីវិទ្យា)', labelEn: 'Physics - Chemistry', subjectKey: 'Physics - Chemistry' },
      { id: 'pair-bio-earth', labelKm: 'Biology - Earth Science (ជីវវិទ្យា - ផែនដីវិទ្យា)', labelEn: 'Biology - Earth Science', subjectKey: 'Biology - Earth Science' },
      { id: 'pair-hist-geo', labelKm: 'History - Geography (ប្រវត្តិវិទ្យា - ភូមិវិទ្យា)', labelEn: 'History - Geography', subjectKey: 'History - Geography' },
      { id: 'pair-khmer-morality', labelKm: 'Khmer - Morality (ភាសាខ្មែរ - ពលរដ្ឋវិជ្ជា)', labelEn: 'Khmer - Morality', subjectKey: 'Khmer - Morality' },
      { id: 'pair-math-eng', labelKm: 'Math - English (គណិត - អង់គ្លេស)', labelEn: 'Math - English', subjectKey: 'Math - English' },
      { id: 'pair-khmer-eng', labelKm: 'Khmer - English (ភាសាខ្មែរ - អង់គ្លេស)', labelEn: 'Khmer - English', subjectKey: 'Khmer - English' },
    ],
  },
  {
    id: 'primary',
    targetExam: 'pttc',
    titleKm: 'កម្រិតបឋមសិក្សា',
    titleEn: 'Primary Education Level',
    badgeKm: 'បាក់ឌុប ១២+២',
    badgeEn: 'Bac II 12+2',
    levelKm: 'ក្របខណ្ឌគ្រូបង្រៀនកម្រិតបឋមសិក្សា (ថ្នាក់ទី ១-៦)',
    levelEn: 'Primary School Teachers (Grades 1–6)',
    descriptionKm: 'រួមបញ្ចូលមុខវិជ្ជាចាំបាច់ទាំង ៣ ដោយស្វ័យប្រវត្តិ៖ ភាសាខ្មែរ គណិត និងវប្បធម៌ទូទៅ។',
    descriptionEn: 'Automatically includes all 3 required subjects: Khmer Language, Math & General Culture.',
    requiredSubjects: ['ភាសាខ្មែរ', 'គណិត', 'វប្បធម៌ទូទៅ'],
    selectionType: 'automatic',
  },
];

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
  const s = subject.toLowerCase().trim();
  const tokens = [s];

  if (s.includes('វប្បធម៌ទូទៅ') || s.includes('general culture')) {
    tokens.push('វប្បធម៌ទូទៅ', 'general culture', 'culture', 'pedagogy', 'ped', 'sec-general-culture', 'pttc-general-culture');
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


