import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { mockQuizzes, mockExams } from '../../data/mockData';
import { ExamTarget } from '../../types';
import {
  Check,
  HelpCircle,
  BookOpen,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Search,
  Sparkles,
  Layers,
  Clock,
  BookMarked,
  Globe,
  Calculator,
  Languages,
  Atom,
  Leaf,
  Landmark,
  Play,
  CheckCircle2,
  GraduationCap,
  School,
  Building2,
  ChevronRight,
  Compass,
  Target,
  RefreshCw,
  Filter,
  ChevronDown,
  X,
  Flame,
  Trophy
} from 'lucide-react';

type PracticeCategory = 'quiz' | 'flashcards' | 'mock-exam';

export interface ExamCategoryOption {
  id: ExamTarget;
  tag: string;
  nameKm: string;
  nameEn: string;
  levelKm: string;
  levelEn: string;
  badgeKm: string;
  badgeEn: string;
  degreeKm: string;
  degreeEn: string;
  subjectsCount: number;
  quizzesCount: number;
  mockExamsCount: number;
  flashcardsCount: number;
  cardGradient: string;
  borderAccent: string;
  iconBg: string;
  iconColor: string;
  icon: React.ElementType;
  descriptionKm: string;
  descriptionEn: string;
  keySubjectsKm: string[];
  keySubjectsEn: string[];
}

export interface SubjectItem {
  id: string;
  nameKm: string;
  nameEn: string;
  category: 'Core' | 'Specialization' | 'Primary';
  targetExams: ExamTarget[];
  icon: React.ElementType;
  colorBg: string;
  colorText: string;
  colorBorder: string;
  topicsKm: string[];
  topicsEn: string[];
  quizCount: number;
  questionCount: number;
  flashcardCount: number;
  mockExamId?: string;
  quizId?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Exactly 3 Official Exam Categories
export const examCategoriesList: ExamCategoryOption[] = [
  {
    id: 'nie',
    tag: 'កម្រិតឧត្តម',
    nameKm: 'កម្រិតឧត្តម (វិទ្យាល័យ)',
    nameEn: 'Higher Level (Upper Secondary)',
    levelKm: 'ក្របខណ្ឌគ្រូបង្រៀនកម្រិតឧត្តម / វិទ្យាល័យ (ថ្នាក់ទី ១០-១២)',
    levelEn: 'Upper Secondary / High School Teachers (Grades 10–12)',
    badgeKm: 'លក្ខខណ្ឌ៖ បរិញ្ញាបត្រ+១',
    badgeEn: "Requirement: Bachelor's + 1",
    degreeKm: 'សញ្ញាបត្របរិញ្ញាបត្រឡើងទៅ',
    degreeEn: "Bachelor's Degree or Higher",
    subjectsCount: 8,
    quizzesCount: 16,
    mockExamsCount: 5,
    flashcardsCount: 150,
    cardGradient: 'hover:border-indigo-500 hover:shadow-indigo-100',
    borderAccent: 'border-indigo-600',
    iconBg: 'bg-indigo-100 text-indigo-700',
    iconColor: 'text-indigo-600',
    icon: GraduationCap,
    descriptionKm: 'ត្រៀមប្រឡងជ្រើសរើសគ្រូបង្រៀនកម្រិតឧត្តម បង្រៀននៅវិទ្យាល័យ (ថ្នាក់ទី ១០-១២)។ ផ្ដោតលើវប្បធម៌ទូទៅ និងវិញ្ញាសាឯកទេសតាមជំនាញនីមួយៗ។',
    descriptionEn: 'Prepare for upper secondary teacher recruitment (Grades 10–12). Focuses on general culture and specialized subject examinations.',
    keySubjectsKm: ['វប្បធម៌ទូទៅ', 'ឯកទេសគណិត', 'ឯកទេសអក្សរសាស្ត្រខ្មែរ', 'ឯកទេសរូប/គីមី/ជីវ'],
    keySubjectsEn: ['General Culture', 'Math Specialization', 'Khmer Literature', 'Sciences (Phys/Chem/Bio)']
  },
  {
    id: 'rttc',
    tag: 'កម្រិតមូលដ្ឋាន',
    nameKm: 'កម្រិតមូលដ្ឋាន (អនុវិទ្យាល័យ)',
    nameEn: 'Basic Level (Lower Secondary)',
    levelKm: 'ក្របខណ្ឌគ្រូបង្រៀនកម្រិតមូលដ្ឋាន / អនុវិទ្យាល័យ (ថ្នាក់ទី ៧-៩)',
    levelEn: 'Lower Secondary / Middle School Teachers (Grades 7–9)',
    badgeKm: 'លក្ខខណ្ឌ៖ ១២+២ / បរិញ្ញាបត្ររង',
    badgeEn: 'Requirement: 12+2 / Associate Degree',
    degreeKm: 'សញ្ញាបត្របរិញ្ញាបត្ររង ឬ បរិញ្ញាបត្រ',
    degreeEn: "Associate's or Bachelor's Degree",
    subjectsCount: 8,
    quizzesCount: 14,
    mockExamsCount: 4,
    flashcardsCount: 130,
    cardGradient: 'hover:border-blue-500 hover:shadow-blue-100',
    borderAccent: 'border-blue-600',
    iconBg: 'bg-blue-100 text-blue-700',
    iconColor: 'text-blue-600',
    icon: School,
    descriptionKm: 'ត្រៀមប្រឡងជ្រើសរើសគ្រូបង្រៀនកម្រិតមូលដ្ឋាន បង្រៀននៅអនុវិទ្យាល័យ (ថ្នាក់ទី ៧-៩)។ ផ្ដោតលើវប្បធម៌ទូទៅ និងវិញ្ញាសាឯកទេសតាមជំនាញនីមួយៗ។',
    descriptionEn: 'Prepare for lower secondary teacher recruitment (Grades 7–9). Focuses on general culture and specialized subject examinations.',
    keySubjectsKm: ['វប្បធម៌ទូទៅ', 'ឯកទេសគណិត', 'ឯកទេសអក្សរសាស្ត្រខ្មែរ', 'ឯកទេសរូប/គីមី/ជីវ'],
    keySubjectsEn: ['General Culture', 'Math Specialization', 'Khmer Literature', 'Sciences (Phys/Chem/Bio)']
  },
  {
    id: 'pttc',
    tag: 'កម្រិតបឋមសិក្សា',
    nameKm: 'កម្រិតបឋមសិក្សា',
    nameEn: 'Primary Education Level',
    levelKm: 'ក្របខណ្ឌគ្រូបង្រៀនកម្រិតបឋមសិក្សា (ថ្នាក់ទី ១-៦)',
    levelEn: 'Primary School Teachers (Grades 1–6)',
    badgeKm: 'លក្ខខណ្ឌ៖ បាក់ឌុប ១២+២',
    badgeEn: 'Requirement: Bac II 12+2',
    degreeKm: 'សញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប)',
    degreeEn: 'High School Diploma (Bac II)',
    subjectsCount: 3,
    quizzesCount: 6,
    mockExamsCount: 3,
    flashcardsCount: 70,
    cardGradient: 'hover:border-emerald-500 hover:shadow-emerald-100',
    borderAccent: 'border-emerald-600',
    iconBg: 'bg-emerald-100 text-emerald-700',
    iconColor: 'text-emerald-600',
    icon: Building2,
    descriptionKm: 'ត្រៀមប្រឡងជ្រើសរើសគ្រូបង្រៀនកម្រិតបឋមសិក្សាទាំង ២៥ រាជធានី-ខេត្ត (ថ្នាក់ទី ១-៦)។ ផ្ដោតលើមុខវិជ្ជាស្នូលទាំង ៣៖ ភាសាខ្មែរ គណិត និងវប្បធម៌ទូទៅ។',
    descriptionEn: 'Prepare for primary school teacher recruitment across all 25 provinces (Grades 1–6). Focuses exclusively on the 3 core subjects: Khmer Language, Mathematics, and General Culture.',
    keySubjectsKm: ['ភាសាខ្មែរ', 'គណិត', 'វប្បធម៌ទូទៅ'],
    keySubjectsEn: ['Khmer Language', 'Mathematics', 'General Culture']
  }
];

// Rich Subject Catalog mapped to specific target exams (NIE, RTTC, PTTC)
export const allSubjectsList: SubjectItem[] = [
  // =========================================================================
  // PTTC SUBJECTS — ONLY 3 SUBJECTS: ភាសាខ្មែរ, គណិត, វប្បធម៌ទូទៅ
  // =========================================================================
  {
    id: 'pttc-khmer',
    nameKm: 'ភាសាខ្មែរ',
    nameEn: 'Khmer Language',
    category: 'Core',
    targetExams: ['pttc'],
    icon: BookMarked,
    colorBg: 'bg-emerald-50',
    colorText: 'text-emerald-600',
    colorBorder: 'border-emerald-100',
    topicsKm: ['វេយ្យាករណ៍ និងអក្ខរាវិរុទ្ធខ្មែរ', 'វិធីសាស្ត្របង្រៀនអំណានដំបូង (EGRA)', 'ក្បួនតែងសេចក្តី និងសំណេរ', 'ការបកស្រាយអត្ថបទ និងការសរសេរតាមអាន'],
    topicsEn: ['Khmer Grammar & Spelling', 'Early Grade Reading (EGRA)', 'Essay Writing', 'Reading Comprehension & Dictation'],
    quizCount: 3,
    questionCount: 15,
    flashcardCount: 25,
    quizId: 'quiz-pttc-khmer-01',
    mockExamId: 'mock-pttc-2026-01',
    difficulty: 'easy'
  },
  {
    id: 'pttc-math',
    nameKm: 'គណិត',
    nameEn: 'Mathematics',
    category: 'Core',
    targetExams: ['pttc'],
    icon: Calculator,
    colorBg: 'bg-blue-50',
    colorText: 'text-blue-600',
    colorBorder: 'border-blue-100',
    topicsKm: ['វិធីសាស្ត្របង្រៀនគណិតដំបូង (EGMA)', 'លេខនព្វន្ត (បូក ដក គុណ ចែក)', 'ចំណោទគណិតវិទ្យាបឋម', 'រង្វាស់រង្វាល់ និងធរណីមាត្រ'],
    topicsEn: ['Early Grade Math Didactics (EGMA)', 'Arithmetic Operations', 'Primary Word Problems', 'Measurements & Basic Geometry'],
    quizCount: 3,
    questionCount: 15,
    flashcardCount: 25,
    quizId: 'quiz-pttc-egma-01',
    mockExamId: 'mock-pttc-2026-01',
    difficulty: 'medium'
  },
  {
    id: 'pttc-general-culture',
    nameKm: 'វប្បធម៌ទូទៅ',
    nameEn: 'General Culture',
    category: 'Core',
    targetExams: ['pttc'],
    icon: Globe,
    colorBg: 'bg-amber-50',
    colorText: 'text-amber-600',
    colorBorder: 'border-amber-100',
    topicsKm: ['ប្រវត្តិសាស្ត្រ និងភូមិវិទ្យាកម្ពុជា', 'សីលធម៌ និងពលរដ្ឋវិទ្យា', 'រដ្ឋធម្មនុញ្ញ និងស្ថាប័នជាតិ', 'បេតិកភណ្ឌ និងបុណ្យប្រពៃណីជាតិ'],
    topicsEn: ['Cambodian History & Geography', 'Ethics & Civics', 'Constitution & State Institutions', 'Heritage & National Traditions'],
    quizCount: 2,
    questionCount: 10,
    flashcardCount: 20,
    quizId: 'quiz-pttc-gen-01',
    mockExamId: 'mock-pttc-2026-01',
    difficulty: 'easy'
  },

  // =========================================================================
  // SECONDARY SUBJECTS (SHARED BY BOTH កម្រិតឧត្តម NIE AND កម្រិតមូលដ្ឋាន RTTC)
  // Both share the exact same teacher specialization and pedagogy subjects!
  // =========================================================================
  {
    id: 'sec-general-culture',
    nameKm: 'វប្បធម៌ទូទៅ',
    nameEn: 'General Culture',
    category: 'Core',
    targetExams: ['nie', 'rttc'],
    icon: Globe,
    colorBg: 'bg-indigo-50',
    colorText: 'text-indigo-600',
    colorBorder: 'border-indigo-100',
    topicsKm: ['ប្រវត្តិសាស្ត្រ និងបេតិកភណ្ឌកម្ពុជា', 'រដ្ឋធម្មនុញ្ញ និងច្បាប់ស្តីពីការអប់រំ', 'សីលធម៌ និងពលរដ្ឋវិទ្យា', 'ចំណេះដឹងទូទៅ និងសមាហរណកម្មអាស៊ាន'],
    topicsEn: ['Cambodian History & Heritage', 'Constitution & Education Law', 'Civics & Ethics', 'General Knowledge & ASEAN Integration'],
    quizCount: 3,
    questionCount: 15,
    flashcardCount: 25,
    quizId: 'quiz-ped-01',
    mockExamId: 'mock-nie-2026-01',
    difficulty: 'medium'
  },
  {
    id: 'sec-mathematics',
    nameKm: 'ឯកទេសគណិតវិទ្យា',
    nameEn: 'Mathematics Specialization',
    category: 'Specialization',
    targetExams: ['nie', 'rttc'],
    icon: Calculator,
    colorBg: 'bg-blue-50',
    colorText: 'text-blue-600',
    colorBorder: 'border-blue-100',
    topicsKm: ['អនុគមន៍ ពិជគណិត និងអាំងតេក្រាល', 'ធរណីមាត្រ និងត្រីកោណមាត្រ', 'ប្រូបាប និងស្ថិតិ', 'វិធីសាស្ត្រដោះស្រាយលំហាត់'],
    topicsEn: ['Functions, Algebra & Calculus', 'Geometry & Trigonometry', 'Probability & Statistics', 'Problem Solving Methods'],
    quizCount: 3,
    questionCount: 15,
    flashcardCount: 25,
    quizId: 'quiz-nie-math-01',
    mockExamId: 'mock-nie-2026-01',
    difficulty: 'hard'
  },
  {
    id: 'sec-khmer-literature',
    nameKm: 'ឯកទេសអក្សរសាស្ត្រខ្មែរ',
    nameEn: 'Khmer Literature Specialization',
    category: 'Specialization',
    targetExams: ['nie', 'rttc'],
    icon: BookMarked,
    colorBg: 'bg-amber-50',
    colorText: 'text-amber-600',
    colorBorder: 'border-amber-100',
    topicsKm: ['ក្បួនតែងសេចក្តីពន្យល់ & ពិភាក្សា', 'វិភាគអក្សរសិល្ប៍បុរាណ-ទំនើប', 'កាព្យសាស្ត្រ (បទពាក្យ ៧, ៨, ៩)', 'វេយ្យាករណ៍ និងភាសាវិទ្យា'],
    topicsEn: ['Expository & Argumentative Essays', 'Classical & Modern Literature Analysis', 'Khmer Poetics', 'Grammar & Linguistics'],
    quizCount: 3,
    questionCount: 15,
    flashcardCount: 25,
    quizId: 'quiz-nie-khmer-01',
    mockExamId: 'mock-nie-2026-01',
    difficulty: 'hard'
  },
  {
    id: 'sec-physics',
    nameKm: 'ឯកទេសរូបវិទ្យា',
    nameEn: 'Physics Specialization',
    category: 'Specialization',
    targetExams: ['nie', 'rttc'],
    icon: Atom,
    colorBg: 'bg-rose-50',
    colorText: 'text-rose-600',
    colorBorder: 'border-rose-100',
    topicsKm: ['មេកានិច និងច្បាប់ញូតុន', 'អគ្គិសនី និងម៉ាញេទិច', 'ទែម៉ូឌីណាមិច និងរលក', 'អុបទិក និងរូបវិទ្យាទំនើប'],
    topicsEn: ['Newtonian Mechanics', 'Electricity & Magnetism', 'Thermodynamics & Waves', 'Optics & Modern Physics'],
    quizCount: 2,
    questionCount: 10,
    flashcardCount: 20,
    quizId: 'quiz-rttc-sci-01',
    mockExamId: 'mock-nie-2026-01',
    difficulty: 'hard'
  },
  {
    id: 'sec-chemistry',
    nameKm: 'ឯកទេសគីមីវិទ្យា',
    nameEn: 'Chemistry Specialization',
    category: 'Specialization',
    targetExams: ['nie', 'rttc'],
    icon: Sparkles,
    colorBg: 'bg-purple-50',
    colorText: 'text-purple-600',
    colorBorder: 'border-purple-100',
    topicsKm: ['គីមីទូទៅ និងរចនាសម្ព័ន្ធអាតូម', 'គីមីអសរីរាង្គ និងសមីការ', 'គីមីសរីរាង្គ និងអ៊ីដ្រូកាបួ', 'សូលុយស្យុង និងអាស៊ីត-បាស'],
    topicsEn: ['Atomic Structure & General Chemistry', 'Inorganic Chemistry & Equations', 'Organic Chemistry & Hydrocarbons', 'Solutions & Acid-Base'],
    quizCount: 2,
    questionCount: 10,
    flashcardCount: 20,
    quizId: 'quiz-rttc-sci-01',
    mockExamId: 'mock-nie-2026-01',
    difficulty: 'hard'
  },
  {
    id: 'sec-biology',
    nameKm: 'ឯកទេសជីវវិទ្យា',
    nameEn: 'Biology Specialization',
    category: 'Specialization',
    targetExams: ['nie', 'rttc'],
    icon: Leaf,
    colorBg: 'bg-teal-50',
    colorText: 'text-teal-600',
    colorBorder: 'border-teal-100',
    topicsKm: ['ជីវវិទ្យាកោសិកា និងហ្សែន', 'សរីរវិទ្យាមនុស្ស និងសត្វ', 'រុក្ខសាស្ត្រ និងរស្មីសំយោគ', 'បរិស្ថានវិទ្យា និងជីវចម្រុះ'],
    topicsEn: ['Cell Biology & Genetics', 'Human & Animal Physiology', 'Botany & Photosynthesis', 'Ecology & Biodiversity'],
    quizCount: 2,
    questionCount: 10,
    flashcardCount: 20,
    quizId: 'quiz-rttc-sci-01',
    mockExamId: 'mock-nie-2026-01',
    difficulty: 'medium'
  },
  {
    id: 'sec-history-geography',
    nameKm: 'ឯកទេសប្រវត្តិវិទ្យា & ភូមិវិទ្យា',
    nameEn: 'History & Geography Specialization',
    category: 'Specialization',
    targetExams: ['nie', 'rttc'],
    icon: Landmark,
    colorBg: 'bg-orange-50',
    colorText: 'text-orange-600',
    colorBorder: 'border-orange-100',
    topicsKm: ['ប្រវត្តិសាស្ត្រខ្មែរគ្រប់សម័យកាល', 'ប្រវត្តិសាស្ត្រពិភពលោកទំនើប', 'ភូមិវិទ្យារូបវន្ត និងសេដ្ឋកិច្ចកម្ពុជា', 'សហគមន៍អាស៊ាន និងពិភពលោក'],
    topicsEn: ['Khmer Historical Eras', 'Modern World History', 'Physical & Economic Geography of Cambodia', 'ASEAN & Global Geography'],
    quizCount: 2,
    questionCount: 10,
    flashcardCount: 20,
    quizId: 'quiz-rttc-gen-01',
    mockExamId: 'mock-rttc-2026-01',
    difficulty: 'medium'
  },
  {
    id: 'sec-english',
    nameKm: 'ឯកទេសភាសាអង់គ្លេស',
    nameEn: 'English Language Specialization',
    category: 'Specialization',
    targetExams: ['nie', 'rttc'],
    icon: Languages,
    colorBg: 'bg-sky-50',
    colorText: 'text-sky-600',
    colorBorder: 'border-sky-100',
    topicsKm: ['Advanced English Grammar & Syntax', 'ELT Methodology & Lesson Planning', 'Academic Reading & Comprehension', 'Phonetics & Vocabulary Expansion'],
    topicsEn: ['Advanced English Grammar & Syntax', 'ELT Methodology & Lesson Planning', 'Academic Reading & Comprehension', 'Phonetics & Vocabulary Expansion'],
    quizCount: 2,
    questionCount: 10,
    flashcardCount: 20,
    quizId: 'quiz-ped-01',
    mockExamId: 'mock-nie-2026-01',
    difficulty: 'hard'
  }
];

// =============================================================================
// DERIVED CATALOG STATS
// Every number shown in the UI below is computed from the arrays above (or from
// the mock exam data), never typed in the JSX. Swapping these arrays for real
// API data is therefore a data change, not a UI rewrite.
// =============================================================================

const getSubjectsForExam = (target: ExamTarget): SubjectItem[] =>
  allSubjectsList.filter((s) => s.targetExams.includes(target));

const getExamStats = (target: ExamTarget) => {
  const subjects = getSubjectsForExam(target);
  return {
    subjects: subjects.length,
    quizzes: subjects.reduce((total, s) => total + s.quizCount, 0),
    questions: subjects.reduce((total, s) => total + s.questionCount, 0),
    flashcards: subjects.reduce((total, s) => total + s.flashcardCount, 0),
    mockExams: mockExams.filter((e) => e.targetExam === target).length,
  };
};

// Round duration comes from the real mock exam records for the selected target.
const getRoundDuration = (target: ExamTarget, round: 1 | 2): number =>
  mockExams.find((e) => e.targetExam === target && e.round === round)?.durationMinutes ??
  mockExams.find((e) => e.round === round)?.durationMinutes ??
  (round === 1 ? 45 : 60);

const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

const localizeNumber = (value: number, lang: string): string =>
  lang === 'km' ? String(value).replace(/[0-9]/g, (d) => KHMER_DIGITS[Number(d)]) : String(value);

const DIFFICULTY_META: Record<SubjectItem['difficulty'], { km: string; en: string; pill: string }> = {
  easy: { km: 'ងាយ', en: 'Easy', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  medium: { km: 'មធ្យម', en: 'Medium', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  hard: { km: 'ពិបាក', en: 'Hard', pill: 'bg-rose-50 text-rose-700 border-rose-200' },
};

const SUBJECT_GROUP_META: Record<SubjectItem['category'], { km: string; en: string }> = {
  Core: { km: 'មុខវិជ្ជាស្នូល', en: 'Core' },
  Specialization: { km: 'ឯកទេស', en: 'Specialization' },
  Primary: { km: 'បឋមសិក្សា', en: 'Primary' },
};

// =============================================================================
// PRACTICE CATEGORY CONFIG
// The hub cards and the subject-select header both render from this list.
// =============================================================================

interface PracticeCategoryConfig {
  id: PracticeCategory;
  icon: React.ElementType;
  tagKm: string;
  tagEn: string;
  nameKm: string;
  nameEn: string;
  taglineKm: string;
  taglineEn: string;
  iconTile: string;
  pill: string;
  accentText: string;
  accentBar: string;
  featuresKm: string[];
  featuresEn: string[];
  selectTitleKm: string;
  selectTitleEn: string;
  selectDescKm: (examName: string) => string;
  selectDescEn: (examName: string) => string;
  actionKm: string;
  actionEn: string;
}

const practiceCategories: PracticeCategoryConfig[] = [
  {
    id: 'quiz',
    icon: HelpCircle,
    tagKm: 'កម្រងសំណួរ',
    tagEn: 'Quiz',
    nameKm: 'លំហាត់ Quiz',
    nameEn: 'Quiz Practice',
    taglineKm: 'វាយតម្លៃចំណេះដឹងរហ័សតាមមុខវិជ្ជា',
    taglineEn: 'Short, subject-by-subject knowledge checks',
    iconTile: 'bg-sky-50 text-sky-600 border-sky-100',
    pill: 'bg-sky-50 text-sky-700 border-sky-200',
    accentText: 'text-sky-500',
    accentBar: 'bg-sky-500',
    featuresKm: ['សំណួរតាមមុខវិជ្ជា', 'ជ្រើសរើសប្រធានបទ', 'ចម្លើយ & ការពន្យល់ភ្លាមៗ'],
    featuresEn: ['Questions grouped by subject', 'Pick the topic you need', 'Answers and explanations instantly'],
    selectTitleKm: 'ជ្រើសរើសមុខវិជ្ជាសម្រាប់ Quiz',
    selectTitleEn: 'Select a subject for your quiz',
    selectDescKm: (examName) => `មុខវិជ្ជាទាំងអស់សម្រាប់ក្របខណ្ឌ ${examName}។ ជ្រើសរើសមុខវិជ្ជាដើម្បីចាប់ផ្ដើមធ្វើ Quiz។`,
    selectDescEn: (examName) => `All subjects available for ${examName}. Pick one to start a short knowledge assessment.`,
    actionKm: 'ធ្វើ Quiz',
    actionEn: 'Start quiz',
  },
  {
    id: 'flashcards',
    icon: Layers,
    tagKm: 'បណ្ណចងចាំ',
    tagEn: 'Flashcards',
    nameKm: 'បណ្ណចងចាំ',
    nameEn: 'Flashcards',
    taglineKm: 'ទន្ទេញរូបមន្ត ពាក្យគន្លឹះ និងនិយមន័យ',
    taglineEn: 'Drill formulas, key terms and definitions',
    iconTile: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    pill: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accentText: 'text-indigo-500',
    accentBar: 'bg-indigo-500',
    featuresKm: ['ពាក្យគន្លឹះសំខាន់ៗ', 'រូបមន្តត្រូវចងចាំ', 'មេរៀនសង្ខេបខ្លីៗ'],
    featuresEn: ['Must-know key terms', 'Formulas worth memorising', 'Short summary lessons'],
    selectTitleKm: 'ជ្រើសរើសមុខវិជ្ជាសម្រាប់បណ្ណចងចាំ',
    selectTitleEn: 'Select a subject for flashcards',
    selectDescKm: (examName) => `បណ្ណចងចាំរូបមន្ត ពាក្យគន្លឹះ និងទ្រឹស្តីសម្រាប់ក្របខណ្ឌ ${examName}។`,
    selectDescEn: (examName) => `Interactive cards covering formulas, key terms and theory for ${examName}.`,
    actionKm: 'ចូលរៀនបណ្ណចងចាំ',
    actionEn: 'Study cards',
  },
  {
    id: 'mock-exam',
    icon: ShieldCheck,
    tagKm: 'ប្រឡងសាកល្បង',
    tagEn: 'Mock exam',
    nameKm: 'ការប្រឡងសាកល្បង',
    nameEn: 'Mock Exam',
    taglineKm: 'វិញ្ញាសាកំណត់ពេលដូចថ្ងៃប្រឡងពិត',
    taglineEn: 'Full timed simulation of the real exam day',
    iconTile: 'bg-[#0a3263]/10 text-[#0a3263] border-[#0a3263]/20',
    pill: 'bg-[#0a3263]/10 text-[#0a3263] border-[#0a3263]/20',
    accentText: 'text-[#0a3263]',
    accentBar: 'bg-[#0a3263]',
    featuresKm: ['កំណត់ពេលវេលាពិត', 'សំណួរច្រើនប្រភេទ', 'វិភាគសមត្ថភាពក្រោយប្រឡង'],
    featuresEn: ['Real exam timing', 'Mixed question formats', 'Performance breakdown afterwards'],
    selectTitleKm: 'ជ្រើសរើសមុខវិជ្ជាសម្រាប់វិញ្ញាសាប្រឡងសាកល្បង',
    selectTitleEn: 'Select a subject for your mock exam',
    selectDescKm: () => 'វិញ្ញាសាប្រឡងសាកល្បងកំណត់ពេលពិតប្រាកដ។ សូមជ្រើសរើសជុំមុននឹងចាប់ផ្ដើម។',
    selectDescEn: () => 'A timed mock examination. Choose which round you want to sit before you start.',
    actionKm: 'ចាប់ផ្តើមប្រឡង',
    actionEn: 'Start mock exam',
  },
];

// =============================================================================
// SHARED PRESENTATIONAL BITS
// =============================================================================

const PRIMARY_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#0a3263] hover:bg-[#082447] text-white text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer active:scale-[0.98]';

const SECONDARY_BTN =
  'inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition cursor-pointer';

const GHOST_BTN =
  'inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:text-[#0a3263] text-slate-600 text-xs font-bold shadow-2xs transition cursor-pointer';

interface TrailStep {
  key: string;
  label: string;
  sub?: string;
  state: 'done' | 'current' | 'todo';
  onClick?: () => void;
}

const StepTrail: React.FC<{ steps: TrailStep[] }> = ({ steps }) => (
  <nav aria-label="Practice progress" className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
    {steps.map((step, index) => (
      <React.Fragment key={step.key}>
        {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
        <button
          type="button"
          onClick={step.onClick}
          disabled={!step.onClick}
          aria-current={step.state === 'current' ? 'step' : undefined}
          className={`inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border text-xs font-semibold transition max-w-full ${
            step.state === 'current'
              ? 'bg-[#0a3263] text-white border-[#0a3263]'
              : step.onClick
                ? 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-[#0a3263] cursor-pointer shadow-2xs'
                : 'bg-slate-50 text-slate-400 border-slate-200 cursor-default'
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
              step.state === 'current'
                ? 'bg-white/20 text-white'
                : step.state === 'done'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-white text-slate-400 border border-slate-200'
            }`}
          >
            {step.state === 'done' ? <Check className="w-3 h-3" /> : index + 1}
          </span>
          <span className="whitespace-nowrap">{step.label}</span>
          {step.sub && (
            <span className="hidden sm:inline max-w-[140px] truncate font-medium opacity-70">· {step.sub}</span>
          )}
        </button>
      </React.Fragment>
    ))}
  </nav>
);

export const PracticePage: React.FC = () => {
  const { lang } = useLanguage();
  const {
    userProfile,
    setUserProfile,
    setCurrentPage,
    setActiveQuiz,
    setActiveMockExam,
    setSelectedPracticeSubject,
    setSelectedPracticeSubjectId,
    practiceViewMode,
    setPracticeViewMode,
    subjectScores
  } = useApp();

  // State: Selected National Exam Target (strictly 3 categories: 'nie' | 'rttc' | 'pttc')
  const initialCategory: ExamTarget =
    userProfile.targetExam === 'nie' || userProfile.targetExam === 'rttc' || userProfile.targetExam === 'pttc'
      ? userProfile.targetExam
      : 'nie';

  const [selectedExamTarget, setSelectedExamTarget] = useState<ExamTarget>(initialCategory);

  // View mode controlled globally ('exam-select' | 'hub' | 'subject-select')
  // Defaults to 'hub' (the 3 cards: Quiz, Flashcards, Mock Exam)
  const viewMode = practiceViewMode;
  const setViewMode = setPracticeViewMode;

  // When in subject-select mode, which feature was clicked?
  const [selectedCategory, setSelectedCategory] = useState<PracticeCategory>('quiz');

  // Search & Filter state for subject selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string | null>(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [mockExamRound, setMockExamRound] = useState<1 | 2>(1);

  // Selected Exam Object info
  const currentExamInfo = examCategoriesList.find(e => e.id === selectedExamTarget) || examCategoriesList[0];

  // Subjects strictly filtered for the selected 3-category target exam
  const availableSubjectsForExam = getSubjectsForExam(selectedExamTarget);

  // Counts derived from the catalog rather than hardcoded in the markup
  const examStats = getExamStats(selectedExamTarget);
  const round1Duration = getRoundDuration(selectedExamTarget, 1);
  const round2Duration = getRoundDuration(selectedExamTarget, 2);

  const activeCategory =
    practiceCategories.find(c => c.id === selectedCategory) || practiceCategories[0];

  // Filtered subjects based on search & subject filter (1 subject at a time)
  const filteredSubjects = availableSubjectsForExam.filter(s => {
    const matchesSearch =
      s.nameKm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.topicsKm.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.topicsEn.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject = !selectedSubjectFilter || s.id === selectedSubjectFilter;
    return matchesSearch && matchesSubject;
  });

  const hasActiveFilters = Boolean(searchQuery) || Boolean(selectedSubjectFilter);
  const activeFilterSubject = availableSubjectsForExam.find(s => s.id === selectedSubjectFilter);

  const handleSelectExamTarget = (target: ExamTarget) => {
    setSelectedExamTarget(target);
    setUserProfile(prev => ({ ...prev, targetExam: target }));
    setSelectedSubjectFilter(null);
    setIsFilterDropdownOpen(false);
    setSearchQuery('');
  };

  const handleSelectAndGoToHub = (target: ExamTarget) => {
    handleSelectExamTarget(target);
    setViewMode('hub');
  };

  const handleOpenCategory = (category: PracticeCategory) => {
    setSelectedCategory(category);
    setViewMode('subject-select');
  };

  const handleStartSubjectQuiz = (subject: SubjectItem) => {
    const matchedQuiz = mockQuizzes.find(q => q.id === subject.quizId) ||
      mockQuizzes.find(q => q.targetExam?.includes(selectedExamTarget)) ||
      mockQuizzes[0];
    setActiveQuiz(matchedQuiz);
    setSelectedPracticeSubjectId(subject.id);
    setSelectedPracticeSubject(subject.nameKm);
    setCurrentPage('quiz');
  };

  const handleStartSubjectFlashcards = (subject: SubjectItem) => {
    setSelectedPracticeSubjectId(subject.id);
    setSelectedPracticeSubject(subject.nameKm);
    setCurrentPage('flashcards');
  };

  const handleStartSubjectMockExam = (subject: SubjectItem, roundNumber: 1 | 2 = mockExamRound) => {
    const matchedExam =
      mockExams.find(e => e.targetExam === selectedExamTarget && e.round === roundNumber) ||
      mockExams.find(e => e.round === roundNumber) ||
      mockExams.find(e => e.id === subject.mockExamId) ||
      mockExams[0];
    setActiveMockExam(matchedExam);
    setSelectedPracticeSubjectId(subject.id);
    setSelectedPracticeSubject(subject.nameKm);
    setCurrentPage('quiz');
  };

  const handleStartSubject = (subject: SubjectItem) => {
    if (selectedCategory === 'quiz') handleStartSubjectQuiz(subject);
    else if (selectedCategory === 'flashcards') handleStartSubjectFlashcards(subject);
    else if (selectedCategory === 'mock-exam') handleStartSubjectMockExam(subject, mockExamRound);
  };

  // Step trail shared by all three view modes so the user always knows the path.
  const buildSteps = (): TrailStep[] => [
    {
      key: 'target',
      label: lang === 'km' ? 'ក្របខណ្ឌប្រឡង' : 'Exam target',
      sub: currentExamInfo.tag,
      state: viewMode === 'exam-select' ? 'current' : 'done',
      onClick: viewMode === 'exam-select' ? undefined : () => setViewMode('exam-select'),
    },
    {
      key: 'mode',
      label: lang === 'km' ? 'របៀបអនុវត្ត' : 'Practice mode',
      sub: viewMode === 'subject-select' ? (lang === 'km' ? activeCategory.tagKm : activeCategory.tagEn) : undefined,
      state: viewMode === 'hub' ? 'current' : viewMode === 'subject-select' ? 'done' : 'todo',
      onClick: viewMode === 'hub' ? undefined : () => setViewMode('hub'),
    },
    {
      key: 'subject',
      label: lang === 'km' ? 'មុខវិជ្ជា' : 'Subject',
      state: viewMode === 'subject-select' ? 'current' : 'todo',
    },
  ];

  // =========================================================================
  // VIEW 1: STEP 1 — 3-CATEGORY FULL SELECTION OVERVIEW
  // =========================================================================
  if (viewMode === 'exam-select') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">

        {/* Navigation: back + step trail */}
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setViewMode('hub')} className={GHOST_BTN}>
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'km' ? 'ត្រឡប់ក្រោយ' : 'Back'}</span>
          </button>
          <StepTrail steps={buildSteps()} />
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Compass className="w-4 h-4" />
            <span>{lang === 'km' ? 'ជំហានទី ១' : 'Step 1 of 3'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            {lang === 'km' ? 'ជ្រើសរើសក្របខណ្ឌប្រឡងគ្រូ' : 'Choose your teacher exam target'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            {lang === 'km'
              ? 'ជ្រើសរើស ១ ក្នុងចំណោមក្របខណ្ឌទាំង ៣ ដើម្បីឱ្យប្រព័ន្ធកំណត់ Quiz បណ្ណចងចាំ និងវិញ្ញាសាប្រឡងសាកល្បងឱ្យត្រូវនឹងកម្រិតរបស់អ្នក។'
              : 'Pick one of the three recruitment frameworks. Quizzes, flashcards and mock exams are then tailored to that level.'}
          </p>
        </div>

        {/* Exactly 3 Exam Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {examCategoriesList.map((exam) => {
            const isSelected = selectedExamTarget === exam.id;
            const stats = getExamStats(exam.id);
            const ExamIcon = exam.icon;
            const keySubjects = lang === 'km' ? exam.keySubjectsKm : exam.keySubjectsEn;
            const visibleSubjects = keySubjects.slice(0, 3);
            const hiddenSubjectCount = keySubjects.length - visibleSubjects.length;

            const statTiles = [
              { key: 'subjects', value: stats.subjects, km: 'មុខវិជ្ជា', en: 'Subjects' },
              { key: 'quizzes', value: stats.quizzes, km: 'Quiz', en: 'Quizzes' },
              { key: 'rounds', value: stats.mockExams, km: 'ជុំប្រឡង', en: 'Mock rounds' },
            ];

            return (
              <div
                key={exam.id}
                id={`exam-target-card-${exam.id}`}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => handleSelectAndGoToHub(exam.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectAndGoToHub(exam.id);
                  }
                }}
                className={`relative flex flex-col bg-white rounded-2xl border shadow-2xs p-5 sm:p-6 cursor-pointer select-none transition ${
                  isSelected
                    ? 'border-[#0a3263] ring-2 ring-[#0a3263]/25'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${exam.iconBg}`}>
                    <ExamIcon className="w-6 h-6" />
                  </div>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#0a3263] text-white border border-[#0a3263]">
                      <Check className="w-3.5 h-3.5" />
                      {lang === 'km' ? 'បានជ្រើស' : 'Selected'}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {lang === 'km' ? exam.nameKm : exam.nameEn}
                </h3>
                <p className="mt-1 text-xs text-slate-500 font-medium leading-relaxed">
                  {lang === 'km' ? exam.levelKm : exam.levelEn}
                </p>

                <span className="mt-3 self-start px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                  {lang === 'km' ? exam.badgeKm : exam.badgeEn}
                </span>

                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {lang === 'km' ? exam.descriptionKm : exam.descriptionEn}
                </p>

                {/* Derived counts */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {statTiles.map((tile) => (
                    <div key={tile.key} className="rounded-xl bg-slate-50 border border-slate-200 px-2 py-2.5 text-center">
                      <p className="text-sm font-extrabold text-slate-900">{localizeNumber(tile.value, lang)}</p>
                      <p className="mt-0.5 text-[10px] font-semibold text-slate-500 leading-tight">
                        {lang === 'km' ? tile.km : tile.en}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Key subjects */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {visibleSubjects.map((subjectName) => (
                    <span
                      key={subjectName}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                    >
                      {subjectName}
                    </span>
                  ))}
                  {hiddenSubjectCount > 0 && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
                      +{localizeNumber(hiddenSubjectCount, lang)}
                    </span>
                  )}
                </div>

                <div className="mt-auto pt-5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAndGoToHub(exam.id);
                    }}
                    className={`${PRIMARY_BTN} w-full px-4 py-3`}
                  >
                    <span>
                      {isSelected
                        ? (lang === 'km' ? 'បន្តទៅការអនុវត្ត' : 'Continue')
                        : (lang === 'km' ? 'ជ្រើសរើសក្របខណ្ឌនេះ' : 'Choose this target')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: STEP 3 — SUBJECT SELECTION
  // =========================================================================
  if (viewMode === 'subject-select') {
    const CategoryIcon = activeCategory.icon;
    const roundOptions: { round: 1 | 2; duration: number; titleKm: string; titleEn: string; subKm: string; subEn: string; toneKm: string; toneEn: string; tone: string }[] = [
      {
        round: 1,
        duration: round1Duration,
        titleKm: 'ជុំទី ១',
        titleEn: 'Round 1',
        subKm: 'ជម្រុះបឋម',
        subEn: 'Preliminary qualifier',
        toneKm: 'មធ្យម',
        toneEn: 'Medium',
        tone: 'bg-amber-50 text-amber-700 border-amber-200',
      },
      {
        round: 2,
        duration: round2Duration,
        titleKm: 'ជុំទី ២',
        titleEn: 'Round 2',
        subKm: 'ជុំផ្ដាច់ព្រ័ត្រ',
        subEn: 'Final advanced stage',
        toneKm: 'ពិបាក',
        toneEn: 'Harder',
        tone: 'bg-rose-50 text-rose-700 border-rose-200',
      },
    ];

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">

        {/* Navigation: back + step trail */}
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setViewMode('hub')} className={GHOST_BTN}>
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'km' ? 'ត្រឡប់ទៅផ្ទាំងអនុវត្ត' : 'Back to practice hub'}</span>
          </button>
          <StepTrail steps={buildSteps()} />
        </div>

        {/* Category hero */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <span className={`block h-1.5 w-full ${activeCategory.accentBar}`} />
          <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${activeCategory.iconTile}`}>
              <CategoryIcon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${activeCategory.pill}`}>
                  {lang === 'km' ? activeCategory.tagKm : activeCategory.tagEn}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                  {currentExamInfo.tag}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {lang === 'km' ? activeCategory.selectTitleKm : activeCategory.selectTitleEn}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                {lang === 'km'
                  ? activeCategory.selectDescKm(currentExamInfo.nameKm)
                  : activeCategory.selectDescEn(currentExamInfo.nameEn)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('exam-select')}
              className={`${SECONDARY_BTN} px-3 py-2 shrink-0 self-start md:self-auto`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ប្តូរក្របខណ្ឌ' : 'Switch target'}</span>
            </button>
          </div>
        </div>

        {/* Mock exam round selector */}
        {selectedCategory === 'mock-exam' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0a3263]/10 text-[#0a3263] flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  {lang === 'km' ? 'ជ្រើសរើសជុំប្រឡងមុននឹងចាប់ផ្ដើម' : 'Choose the round before you start'}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                  {lang === 'km'
                    ? 'ការប្រឡងពិតមាន ២ ជុំ។ ជុំដែលអ្នកជ្រើសរើសកំណត់រយៈពេល កម្រិតលំបាក និងពិន្ទុដែលបង្ហាញខាងក្រោម។'
                    : 'The real exam runs in two rounds. Your choice sets the timer, the difficulty and the scores shown below.'}
                </p>
              </div>
            </div>

            <div role="radiogroup" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roundOptions.map((option) => {
                const isActive = mockExamRound === option.round;
                return (
                  <button
                    key={option.round}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setMockExamRound(option.round)}
                    className={`text-left rounded-2xl border p-4 transition cursor-pointer ${
                      isActive
                        ? 'border-[#0a3263] ring-2 ring-[#0a3263]/25 bg-[#0a3263]/[0.04]'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-md bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900">
                          {lang === 'km' ? option.titleKm : option.titleEn}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500 font-medium">
                          {lang === 'km' ? option.subKm : option.subEn}
                        </p>
                      </div>
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-[#0a3263] border-[#0a3263] text-white' : 'border-slate-300 text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                        <Clock className="w-3.5 h-3.5" />
                        {localizeNumber(option.duration, lang)} {lang === 'km' ? 'នាទី' : 'mins'}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${option.tone}`}>
                        {option.round === 2 && <Flame className="w-3.5 h-3.5" />}
                        {lang === 'km' ? option.toneKm : option.toneEn}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search + filter control group */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            {/* Search */}
            <div className="flex items-center gap-2.5 px-4 py-3 flex-1 min-w-0">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'km' ? 'ស្វែងរកមុខវិជ្ជា ឬប្រធានបទ...' : 'Search subjects or topics...'}
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={lang === 'km' ? 'សម្អាតការស្វែងរក' : 'Clear search'}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Subject filter */}
            <div className="relative px-4 py-3 flex items-center sm:w-64 shrink-0">
              <button
                type="button"
                id="btn-subject-filter-dropdown"
                onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
                aria-expanded={isFilterDropdownOpen}
                className={`w-full inline-flex items-center justify-between gap-2 text-sm font-semibold transition cursor-pointer ${
                  selectedSubjectFilter ? 'text-indigo-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <Filter className={`w-4 h-4 shrink-0 ${selectedSubjectFilter ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="truncate">
                    {activeFilterSubject
                      ? (lang === 'km' ? activeFilterSubject.nameKm : activeFilterSubject.nameEn)
                      : (lang === 'km' ? 'គ្រប់មុខវិជ្ជា' : 'All subjects')}
                  </span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition ${isFilterDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isFilterDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsFilterDropdownOpen(false)} />
                  <div className="absolute left-2 right-2 sm:left-auto sm:right-4 top-full mt-1 w-auto sm:w-72 max-h-80 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-lg z-30 p-1.5 space-y-0.5 animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSubjectFilter(null);
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                        !selectedSubjectFilter ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{lang === 'km' ? 'គ្រប់មុខវិជ្ជាទាំងអស់' : 'All subjects'}</span>
                      {!selectedSubjectFilter && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div className="h-px bg-slate-100 my-1" />

                    {availableSubjectsForExam.map((subject) => {
                      const isSelected = selectedSubjectFilter === subject.id;
                      return (
                        <button
                          key={subject.id}
                          type="button"
                          onClick={() => {
                            setSelectedSubjectFilter(subject.id);
                            setIsFilterDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                            isSelected ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="truncate">{lang === 'km' ? subject.nameKm : subject.nameEn}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Result count */}
            <div className="px-4 py-3 flex items-center shrink-0">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                {localizeNumber(filteredSubjects.length, lang)}
                {' / '}
                {localizeNumber(availableSubjectsForExam.length, lang)}{' '}
                {lang === 'km' ? 'មុខវិជ្ជា' : 'subjects'}
              </span>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="border-t border-slate-200 px-4 py-2.5 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {lang === 'km' ? 'តម្រង' : 'Filters'}
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 transition cursor-pointer"
                >
                  <span className="max-w-[160px] truncate">“{searchQuery}”</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {activeFilterSubject && (
                <button
                  type="button"
                  onClick={() => setSelectedSubjectFilter(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer"
                >
                  <span className="max-w-[160px] truncate">
                    {lang === 'km' ? activeFilterSubject.nameKm : activeFilterSubject.nameEn}
                  </span>
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubjectFilter(null);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-[#0a3263] underline transition cursor-pointer"
              >
                {lang === 'km' ? 'សម្អាតទាំងអស់' : 'Clear all'}
              </button>
            </div>
          )}
        </div>

        {/* Subject list */}
        {filteredSubjects.length > 0 ? (
          <div className="space-y-3">
            {filteredSubjects.map((subject) => {
              const SubjectIcon = subject.icon;
              const scoreRecord = subjectScores[subject.id] || subjectScores[subject.nameKm];
              const savedQuizScore = scoreRecord?.quizScore;
              const savedMockScore = mockExamRound === 1 ? scoreRecord?.mockExamR1Score : scoreRecord?.mockExamR2Score;
              const activeScore = selectedCategory === 'quiz' ? savedQuizScore : selectedCategory === 'mock-exam' ? savedMockScore : undefined;
              const passMark = selectedCategory === 'mock-exam' ? (mockExamRound === 1 ? 50 : 60) : 50;
              const topics = lang === 'km' ? subject.topicsKm : subject.topicsEn;
              const visibleTopics = topics.slice(0, 3);
              const hiddenTopicCount = topics.length - visibleTopics.length;
              const difficulty = DIFFICULTY_META[subject.difficulty];
              const roundDuration = mockExamRound === 1 ? round1Duration : round2Duration;

              const metaItems =
                selectedCategory === 'quiz'
                  ? [
                      { key: 'quizzes', icon: HelpCircle, text: `${localizeNumber(subject.quizCount, lang)} ${lang === 'km' ? 'កម្រងសំណួរ' : 'quizzes'}` },
                      { key: 'questions', icon: Layers, text: `${localizeNumber(subject.questionCount, lang)} ${lang === 'km' ? 'សំណួរ' : 'questions'}` },
                    ]
                  : selectedCategory === 'flashcards'
                    ? [
                        { key: 'cards', icon: Layers, text: `${localizeNumber(subject.flashcardCount, lang)} ${lang === 'km' ? 'បណ្ណចងចាំ' : 'cards'}` },
                        { key: 'areas', icon: CheckCircle2, text: `${localizeNumber(topics.length, lang)} ${lang === 'km' ? 'ប្រធានបទ' : 'topic areas'}` },
                      ]
                    : [
                        { key: 'duration', icon: Clock, text: `${localizeNumber(roundDuration, lang)} ${lang === 'km' ? 'នាទី' : 'mins'}` },
                        { key: 'round', icon: ShieldCheck, text: lang === 'km' ? `ជុំទី ${localizeNumber(mockExamRound, lang)}` : `Round ${mockExamRound}` },
                      ];

              return (
                <div
                  key={subject.id}
                  id={`subject-row-${subject.id}`}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-md transition p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-4"
                >
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${subject.colorBg} ${subject.colorText} ${subject.colorBorder}`}>
                    <SubjectIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {lang === 'km' ? subject.nameKm : subject.nameEn}
                      </h3>
                      <span className="text-xs font-medium text-slate-400">
                        {lang === 'km' ? subject.nameEn : subject.nameKm}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                        {lang === 'km' ? SUBJECT_GROUP_META[subject.category].km : SUBJECT_GROUP_META[subject.category].en}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficulty.pill}`}>
                        {lang === 'km' ? difficulty.km : difficulty.en}
                      </span>
                      {activeScore !== undefined && (
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                            activeScore >= passMark
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <Trophy className="w-3 h-3" />
                          {localizeNumber(activeScore, lang)}%
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {visibleTopics.map((topic) => (
                        <span
                          key={topic}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200"
                        >
                          {topic}
                        </span>
                      ))}
                      {hiddenTopicCount > 0 && (
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white text-slate-400 border border-slate-200">
                          +{localizeNumber(hiddenTopicCount, lang)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-500">
                      {metaItems.map((meta) => {
                        const MetaIcon = meta.icon;
                        return (
                          <span key={meta.key} className="inline-flex items-center gap-1.5">
                            <MetaIcon className="w-3.5 h-3.5 text-slate-400" />
                            {meta.text}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="shrink-0 lg:w-56">
                    <button
                      type="button"
                      id={`btn-action-subject-${subject.id}`}
                      onClick={() => handleStartSubject(subject)}
                      className={`${PRIMARY_BTN} w-full px-4 py-3`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span className="truncate">
                        {selectedCategory === 'mock-exam'
                          ? (lang === 'km'
                              ? `ចាប់ផ្តើមជុំទី ${localizeNumber(mockExamRound, lang)}`
                              : `Start round ${mockExamRound}`)
                          : (lang === 'km' ? activeCategory.actionKm : activeCategory.actionEn)}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-10 sm:p-12 text-center space-y-3">
            <Search className="w-14 h-14 text-slate-300 mx-auto" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'km' ? 'រកមិនឃើញមុខវិជ្ជាទេ' : 'No matching subjects'}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {lang === 'km'
                ? 'សូមព្យាយាមស្វែងរកជាមួយពាក្យគន្លឹះផ្សេងទៀត ឬសម្អាតតម្រងចេញ។'
                : 'Try a different keyword, or clear the filters to see every subject for this exam target.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSubjectFilter(null);
              }}
              className={`${PRIMARY_BTN} px-5 py-2.5`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'សម្អាតតម្រង' : 'Clear filters'}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: STEP 2 — PRACTICE HUB (3 Main Cards + exam context bar)
  // =========================================================================
  // Collect scores for subjects that user has ever taken
  const takenQuizScores: number[] = [];
  const takenMockR1Scores: number[] = [];
  const takenMockR2Scores: number[] = [];

  // Iterate over availableSubjectsForExam to count each distinct subject
  availableSubjectsForExam.forEach(s => {
    const rec = subjectScores[s.id] || subjectScores[s.nameKm];
    if (typeof rec?.quizScore === 'number') {
      takenQuizScores.push(rec.quizScore);
    }
    if (typeof rec?.mockExamR1Score === 'number') {
      takenMockR1Scores.push(rec.mockExamR1Score);
    }
    if (typeof rec?.mockExamR2Score === 'number') {
      takenMockR2Scores.push(rec.mockExamR2Score);
    }
  });

  // Fallback: If user took subjects under another category, include them uniquely
  if (takenQuizScores.length === 0) {
    const seenSubjects = new Set<string>();
    Object.entries(subjectScores).forEach(([key, rec]) => {
      const identifier = rec.lastUpdated || key;
      if (!seenSubjects.has(identifier) && typeof rec.quizScore === 'number') {
        seenSubjects.add(identifier);
        takenQuizScores.push(rec.quizScore);
      }
    });
  }
  if (takenMockR1Scores.length === 0 && takenMockR2Scores.length === 0) {
    const seenMock = new Set<string>();
    Object.entries(subjectScores).forEach(([key, rec]) => {
      const identifier = rec.lastUpdated || key;
      if (!seenMock.has(identifier)) {
        seenMock.add(identifier);
        if (typeof rec.mockExamR1Score === 'number') takenMockR1Scores.push(rec.mockExamR1Score);
        if (typeof rec.mockExamR2Score === 'number') takenMockR2Scores.push(rec.mockExamR2Score);
      }
    });
  }

  // Quiz Average Percentage (if more than one taken, it averages them)
  const avgQuizScore = takenQuizScores.length > 0
    ? Math.round(takenQuizScores.reduce((sum, val) => sum + val, 0) / takenQuizScores.length)
    : null;

  // Mock Exam Average Percentages for Round 1, Round 2, and Overall
  const avgMockR1 = takenMockR1Scores.length > 0
    ? Math.round(takenMockR1Scores.reduce((sum, val) => sum + val, 0) / takenMockR1Scores.length)
    : null;

  const avgMockR2 = takenMockR2Scores.length > 0
    ? Math.round(takenMockR2Scores.reduce((sum, val) => sum + val, 0) / takenMockR2Scores.length)
    : null;

  const allMockScores = [...takenMockR1Scores, ...takenMockR2Scores];
  const overallAvgMock = allMockScores.length > 0
    ? Math.round(allMockScores.reduce((sum, val) => sum + val, 0) / allMockScores.length)
    : null;

  const HubExamIcon = currentExamInfo.icon;

  const hubExamStats = [
    { key: 'subjects', icon: BookOpen, value: localizeNumber(examStats.subjects, lang), km: 'មុខវិជ្ជា', en: 'Subjects' },
    { key: 'quizzes', icon: HelpCircle, value: localizeNumber(examStats.quizzes, lang), km: 'កម្រងសំណួរ', en: 'Quizzes' },
    { key: 'cards', icon: Layers, value: localizeNumber(examStats.flashcards, lang), km: 'បណ្ណចងចាំ', en: 'Cards' },
    { key: 'rounds', icon: ShieldCheck, value: localizeNumber(examStats.mockExams, lang), km: 'ជុំប្រឡង', en: 'Mock rounds' },
  ];

  // Each hub card's summary line and score badge are derived, never hardcoded.
  const categorySummary = (category: PracticeCategory): string => {
    if (category === 'quiz') {
      return lang === 'km'
        ? `${localizeNumber(examStats.quizzes, lang)} កម្រងសំណួរ · ${localizeNumber(examStats.questions, lang)} សំណួរ`
        : `${examStats.quizzes} quizzes · ${examStats.questions} questions`;
    }
    if (category === 'flashcards') {
      return lang === 'km'
        ? `${localizeNumber(examStats.flashcards, lang)} បណ្ណ · ${localizeNumber(examStats.subjects, lang)} មុខវិជ្ជា`
        : `${examStats.flashcards} cards · ${examStats.subjects} subjects`;
    }
    return lang === 'km'
      ? `${localizeNumber(examStats.mockExams, lang)} ជុំ · ${localizeNumber(round1Duration, lang)}/${localizeNumber(round2Duration, lang)} នាទី`
      : `${examStats.mockExams} rounds · ${round1Duration}/${round2Duration} mins`;
  };

  const categoryScore = (category: PracticeCategory): number | null => {
    if (category === 'quiz') return avgQuizScore;
    if (category === 'mock-exam') return overallAvgMock;
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">

      {/* Step trail */}
      <StepTrail steps={buildSteps()} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Target className="w-4 h-4" />
          <span>{lang === 'km' ? 'ជំហានទី ២' : 'Step 2 of 3'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          {lang === 'km' ? 'តើអ្នកចង់អនុវត្តបែបណា?' : 'How do you want to practise?'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {lang === 'km'
            ? 'ជ្រើសរើសរបៀបអនុវត្តមួយ បន្ទាប់មកជ្រើសរើសមុខវិជ្ជាដែលអ្នកចង់ធ្វើ។'
            : 'Pick a practice mode, then choose the subject you want to work on.'}
        </p>
      </div>

      {/* Exam target context bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${currentExamInfo.iconBg}`}>
            <HubExamIcon className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {lang === 'km' ? 'ក្របខណ្ឌរបស់អ្នក' : 'Your exam target'}
            </p>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {lang === 'km' ? currentExamInfo.nameKm : currentExamInfo.nameEn}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 font-medium">
              {lang === 'km' ? currentExamInfo.levelKm : currentExamInfo.levelEn}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:shrink-0">
          {hubExamStats.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <div key={stat.key} className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-center lg:w-24">
                <StatIcon className="w-4 h-4 text-slate-400 mx-auto" />
                <p className="mt-1 text-sm font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-[10px] font-semibold text-slate-500 leading-tight">
                  {lang === 'km' ? stat.km : stat.en}
                </p>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          id="btn-switch-exam-category"
          onClick={() => setViewMode('exam-select')}
          className={`${SECONDARY_BTN} px-3 py-2 shrink-0 self-start lg:self-auto`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{lang === 'km' ? 'ប្តូរក្របខណ្ឌ' : 'Switch target'}</span>
        </button>
      </div>

      {/* Three practice mode cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {practiceCategories.map((category) => {
          const CardIcon = category.icon;
          const score = categoryScore(category.id);
          const features = lang === 'km' ? category.featuresKm : category.featuresEn;

          return (
            <div
              key={category.id}
              id={`practice-card-${category.id}`}
              role="button"
              tabIndex={0}
              onClick={() => handleOpenCategory(category.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenCategory(category.id);
                }
              }}
              className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden hover:border-slate-300 hover:shadow-md transition cursor-pointer select-none"
            >
              <span className={`block h-1.5 w-full ${category.accentBar}`} />

              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${category.iconTile}`}>
                    <CardIcon className="w-6 h-6" />
                  </div>
                  {score !== null && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Trophy className="w-3.5 h-3.5" />
                      {localizeNumber(score, lang)}%
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-base sm:text-lg font-bold text-slate-900">
                  {lang === 'km' ? category.nameKm : category.nameEn}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {lang === 'km' ? category.taglineKm : category.taglineEn}
                </p>

                <span className={`mt-3 self-start px-3 py-1 rounded-full text-xs font-semibold border ${category.pill}`}>
                  {categorySummary(category.id)}
                </span>

                <ul className="mt-4 space-y-2.5">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${category.accentText}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {category.id === 'mock-exam' && (avgMockR1 !== null || avgMockR2 !== null) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {avgMockR1 !== null && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                        {lang === 'km' ? 'ជុំទី ១' : 'Round 1'}: {localizeNumber(avgMockR1, lang)}%
                      </span>
                    )}
                    {avgMockR2 !== null && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <Flame className="w-3.5 h-3.5" />
                        {lang === 'km' ? 'ជុំទី ២' : 'Round 2'}: {localizeNumber(avgMockR2, lang)}%
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-auto pt-6">
                  <button
                    type="button"
                    id={`btn-start-${category.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCategory(category.id);
                    }}
                    className={`${PRIMARY_BTN} w-full px-4 py-3`}
                  >
                    <span>{lang === 'km' ? 'ជ្រើសរើសមុខវិជ្ជា' : 'Choose a subject'}</span>
                    <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PracticePage;
