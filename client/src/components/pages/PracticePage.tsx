// PassKru Practice Hub
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { ExamTarget } from '../../types';
import { isSubjectInSelection, expandSubjectSelection, getExamCategoryLabel, withCoreSubjects } from '../../data/examSelectionData';
import { ExamSelectionFlow } from '../exam-selection/ExamSelectionFlow';
import { getSubjects, ApiSubject } from '../../services/subjectService';
import { getMockExams } from '../../services/mockExamService';
import { getQuizzes } from '../../services/quizService';
import { SEOHead } from '../common/SEOHead';
import {
  Check,
  HelpCircle,
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
  RefreshCw,
  Filter,
  ChevronDown,
  X,
  Flame,
  History,
  FlaskConical,
  Compass,
  Laptop,
  Dna
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
  dbSubjectId?: number;
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
    descriptionKm: 'ត្រៀមប្រឡងគ្រូបង្រៀនវិទ្យាល័យ ផ្ដោតលើវប្បធម៌ទូទៅ ភាសាអង់គ្លេស និងឯកទេស។',
    descriptionEn: 'Prepare for upper secondary teacher exams in general culture, English & specialization.',
    keySubjectsKm: ['វប្បធម៌ទូទៅ', 'ភាសាអង់គ្លេស', 'ឯកទេសគណិត', 'ឯកទេសអក្សរសាស្ត្រខ្មែរ'],
    keySubjectsEn: ['General Culture', 'English Language', 'Math Specialization', 'Khmer Literature']
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
    descriptionKm: 'ត្រៀមប្រឡងគ្រូបង្រៀនអនុវិទ្យាល័យ ផ្ដោតលើវប្បធម៌ទូទៅ ភាសាអង់គ្លេស និងឯកទេស។',
    descriptionEn: 'Prepare for lower secondary teacher exams in general culture, English & specialization.',
    keySubjectsKm: ['វប្បធម៌ទូទៅ', 'ភាសាអង់គ្លេស', 'ឯកទេសគណិត', 'ឯកទេសអក្សរសាស្ត្រខ្មែរ'],
    keySubjectsEn: ['General Culture', 'English Language', 'Math Specialization', 'Khmer Literature']
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
    subjectsCount: 4,
    quizzesCount: 8,
    mockExamsCount: 3,
    flashcardsCount: 90,
    cardGradient: 'hover:border-emerald-500 hover:shadow-emerald-100',
    borderAccent: 'border-emerald-600',
    iconBg: 'bg-emerald-100 text-emerald-700',
    iconColor: 'text-emerald-600',
    icon: Building2,
    descriptionKm: 'ត្រៀមប្រឡងគ្រូបង្រៀនបឋមសិក្សា ផ្ដោតលើភាសាខ្មែរ គណិត វប្បធម៌ទូទៅ និងភាសាអង់គ្លេស។',
    descriptionEn: 'Prepare for primary school teacher exams in Khmer, math, general culture & English.',
    keySubjectsKm: ['ភាសាខ្មែរ', 'គណិត', 'វប្បធម៌ទូទៅ', 'ភាសាអង់គ្លេស'],
    keySubjectsEn: ['Khmer Language', 'Mathematics', 'General Culture', 'English Language']
  }
];

// Rich Subject Catalog mapped to specific target exams (NIE, RTTC, PTTC)
export const allSubjectsList: SubjectItem[] = [
  // =========================================================================
  // PTTC SUBJECTS — 4 SUBJECTS: ភាសាខ្មែរ, គណិត, វប្បធម៌ទូទៅ, ភាសាអង់គ្លេស
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
    questionCount: 20,
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
    questionCount: 20,
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
    questionCount: 20,
    flashcardCount: 20,
    quizId: 'quiz-pttc-gen-01',
    mockExamId: 'mock-pttc-2026-01',
    difficulty: 'easy'
  },
  {
    id: 'pttc-english',
    nameKm: 'ភាសាអង់គ្លេស',
    nameEn: 'English Language',
    category: 'Core',
    targetExams: ['pttc', 'nie', 'rttc'],
    icon: Languages,
    colorBg: 'bg-sky-50',
    colorText: 'text-sky-600',
    colorBorder: 'border-sky-100',
    topicsKm: [
      'មូលដ្ឋានវេយ្យាករណ៍អង់គ្លេស (Grammar & Tenses)',
      'វាក្យសព្ទ និងការប្រើប្រាស់ (Vocabulary & Usage)',
      'ការអានយល់អត្ថបទ (Reading Comprehension)',
      'រចនាសម្ព័ន្ធប្រយោគ និងការសរសេរ (Sentence Structure & Writing)'
    ],
    topicsEn: [
      'English Grammar & Tenses',
      'Vocabulary & Usage',
      'Reading Comprehension',
      'Sentence Structure & Writing'
    ],
    quizCount: 10,
    questionCount: 500,
    flashcardCount: 20,
    quizId: 'quiz-eng-set-01',
    mockExamId: 'mock-pttc-2026-01',
    difficulty: 'medium'
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
    questionCount: 20,
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
    questionCount: 20,
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
    questionCount: 20,
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
    questionCount: 20,
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
    icon: FlaskConical,
    colorBg: 'bg-purple-50',
    colorText: 'text-purple-600',
    colorBorder: 'border-purple-100',
    topicsKm: ['គីមីទូទៅ និងរចនាសម្ព័ន្ធអាតូម', 'គីមីអសរីរាង្គ និងសមីការ', 'គីមីសរីរាង្គ និងអ៊ីដ្រូកាបួ', 'សូលុយស្យុង និងអាស៊ីត-បាស'],
    topicsEn: ['Atomic Structure & General Chemistry', 'Inorganic Chemistry & Equations', 'Organic Chemistry & Hydrocarbons', 'Solutions & Acid-Base'],
    quizCount: 2,
    questionCount: 20,
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
    questionCount: 20,
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
    questionCount: 20,
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
    questionCount: 20,
    flashcardCount: 20,
    quizId: 'quiz-ped-01',
    mockExamId: 'mock-nie-2026-01',
    difficulty: 'hard'
  },
  {
    id: 'sec-earth',
    nameKm: 'ឯកទេសផែនដី និងបរិស្ថានវិទ្យា',
    nameEn: 'Earth & Environmental Science Specialization',
    category: 'Specialization',
    targetExams: ['nie', 'rttc'],
    icon: Globe,
    colorBg: 'bg-emerald-50',
    colorText: 'text-emerald-600',
    colorBorder: 'border-emerald-100',
    topicsKm: ['ភូគព្ភវិទ្យា និងរចនាសម្ព័ន្ធផែនដី', 'បរិយាកាសវិទ្យា និងអាកាសធាតុ', 'ជលសាស្ត្រ និងធនធានទឹក', 'បរិស្ថានវិទ្យា និងការអភិវឌ្ឍប្រកបដោយចីរភាព'],
    topicsEn: ['Geology & Earth Structure', 'Meteorology & Climate', 'Hydrology & Water Resources', 'Ecology & Sustainable Development'],
    quizCount: 2,
    questionCount: 20,
    flashcardCount: 20,
    quizId: 'quiz-rttc-sci-01',
    mockExamId: 'mock-nie-2026-01',
    difficulty: 'medium'
  }
];

interface SubjectMeta {
  nameKm: string;
  nameEn: string;
  category: 'Core' | 'Specialization' | 'Primary';
  icon: React.ElementType;
  colorBg: string;
  colorText: string;
  colorBorder: string;
  topicsKm: string[];
  topicsEn: string[];
}

export const getSubjectMeta = (subjectName: string, examTarget: ExamTarget): SubjectMeta => {
  const norm = subjectName.toLowerCase().trim();
  if (norm.includes('អង់គ្លេស') || norm.includes('english')) {
    return {
      nameKm: 'ភាសាអង់គ្លេស',
      nameEn: 'English Language',
      category: examTarget === 'pttc' ? 'Primary' : 'Core',
      icon: Languages,
      colorBg: 'bg-indigo-50',
      colorText: 'text-indigo-600',
      colorBorder: 'border-indigo-100',
      topicsKm: [
        'សមត្ថភាពភាសាអង់គ្លេសទូទៅ',
        'វេយ្យាករណ៍ និងរចនាសម្ព័ន្ធប្រយោគ',
        'វាក្យសព្ទវប្បធម៌ទូទៅ និងការបង្រៀន',
        'ការអានយល់អត្ថបទ និងការវិភាគន័យ',
      ],
      topicsEn: [
        'General English Competency',
        'Grammar & Sentence Structures',
        'Pedagogical Vocabulary & Teaching',
        'Reading Comprehension & Analysis',
      ],
    };
  }
  if (norm.includes('គណិត') || norm.includes('math')) {
    return {
      nameKm: 'គណិតវិទ្យា',
      nameEn: 'Mathematics',
      category: examTarget === 'pttc' ? 'Primary' : examTarget === 'nie' || examTarget === 'rttc' ? 'Specialization' : 'Core',
      icon: Calculator,
      colorBg: 'bg-blue-50',
      colorText: 'text-blue-600',
      colorBorder: 'border-blue-100',
      topicsKm: [
        'ពិជគណិត និងអនុគមន៍',
        'ធរណីមាត្រ និងត្រីកោណមាត្រ',
        'វិភាគ និងកាលគុលុស',
        'ស្ថិតិ និងប្រូបាប',
      ],
      topicsEn: [
        'Algebra & Functions',
        'Geometry & Trigonometry',
        'Calculus & Mathematical Analysis',
        'Statistics & Probability',
      ],
    };
  }
  if (norm.includes('ខ្មែរ') || norm.includes('khmer')) {
    return {
      nameKm: 'ភាសាខ្មែរ',
      nameEn: 'Khmer Language',
      category: examTarget === 'pttc' ? 'Primary' : examTarget === 'nie' || examTarget === 'rttc' ? 'Specialization' : 'Core',
      icon: BookMarked,
      colorBg: 'bg-emerald-50',
      colorText: 'text-emerald-600',
      colorBorder: 'border-emerald-100',
      topicsKm: [
        'វេយ្យាករណ៍ និងអក្ខរាវិរុទ្ធខ្មែរ',
        'វិធីសាស្ត្របង្រៀនអំណានដំបូង (EGRA)',
        'ក្បួនតែងសេចក្តី និងសំណេរ',
        'ការបកស្រាយអត្ថបទ និងការសរសេរតាមអាន',
      ],
      topicsEn: [
        'Khmer Grammar & Orthography',
        'Early Grade Reading Methodology (EGRA)',
        'Khmer Composition & Writing',
        'Text Analysis & Dictation',
      ],
    };
  }
  if (norm.includes('វប្បធម៌') || norm.includes('culture')) {
    return {
      nameKm: 'វប្បធម៌ទូទៅ',
      nameEn: 'General Culture',
      category: examTarget === 'pttc' ? 'Primary' : 'Core',
      icon: Landmark,
      colorBg: 'bg-amber-50',
      colorText: 'text-amber-600',
      colorBorder: 'border-amber-100',
      topicsKm: [
        'ប្រវត្តិសាស្ត្រ និងអារ្យធម៌ខ្មែរ',
        'រដ្ឋធម្មនុញ្ញ និងរដ្ឋបាលសាធារណៈ',
        'ភូមិសាស្ត្រ និងសេដ្ឋកិច្ចកម្ពុជា',
        'ព្រឹត្តិការណ៍ជាតិ និងអន្តរជាតិបច្ចុប្បន្ន',
      ],
      topicsEn: [
        'Cambodian History & Civilization',
        'Constitution & Public Administration',
        'Cambodian Geography & Economy',
        'Current National & Global Affairs',
      ],
    };
  }
  if (norm.includes('រូប') || norm.includes('physic')) {
    return {
      nameKm: 'រូបវិទ្យា',
      nameEn: 'Physics',
      category: 'Specialization',
      icon: Atom,
      colorBg: 'bg-sky-50',
      colorText: 'text-sky-600',
      colorBorder: 'border-sky-100',
      topicsKm: ['មេកានិច និងចលនា', 'អគ្គិសនី និងម៉ាញេទិច', 'ទែរម៉ូឌីណាមិច', 'អុបទិច និងរលក'],
      topicsEn: ['Mechanics & Motion', 'Electricity & Magnetism', 'Thermodynamics', 'Optics & Waves'],
    };
  }
  if (norm.includes('គីមី') || norm.includes('chem')) {
    return {
      nameKm: 'គីមីវិទ្យា',
      nameEn: 'Chemistry',
      category: 'Specialization',
      icon: FlaskConical,
      colorBg: 'bg-purple-50',
      colorText: 'text-purple-600',
      colorBorder: 'border-purple-100',
      topicsKm: ['គីមីទូទៅ និងរចនាសម្ព័ន្ធអាតូម', 'គីមីសរីរាង្គ', 'គីមីអសរីរាង្គ', 'តុល្យភាពគីមី និងដំណោះស្រាយ'],
      topicsEn: ['General Chemistry & Atomic Structure', 'Organic Chemistry', 'Inorganic Chemistry', 'Chemical Equilibrium & Solutions'],
    };
  }
  if (norm.includes('ជីវ') || norm.includes('bio')) {
    return {
      nameKm: 'ជីវ:វិទ្យា',
      nameEn: 'Biology',
      category: 'Specialization',
      icon: Dna,
      colorBg: 'bg-teal-50',
      colorText: 'text-teal-600',
      colorBorder: 'border-teal-100',
      topicsKm: ['ជីវវិទ្យាកោសិកា និងពន្ធុវិទ្យា', 'សរីរវិទ្យារុក្ខជាតិ និងសត្វ', 'បរិស្ថានវិទ្យា និងជីវចម្រុះ', 'មីក្រូជីវវិទ្យា'],
      topicsEn: ['Cell Biology & Genetics', 'Plant & Animal Physiology', 'Ecology & Biodiversity', 'Microbiology'],
    };
  }
  if (norm.includes('ប្រវត្តិ') || norm.includes('histor')) {
    return {
      nameKm: 'ប្រវត្តិវិទ្យា',
      nameEn: 'History',
      category: 'Specialization',
      icon: History,
      colorBg: 'bg-orange-50',
      colorText: 'text-orange-600',
      colorBorder: 'border-orange-100',
      topicsKm: ['ប្រវត្តិសាស្ត្រកម្ពុជាសម័យបុរាណ និងអង្គរ', 'កម្ពុជាសម័យកណ្តាល និងទំនើប', 'ប្រវត្តិសាស្ត្រអាស៊ីអាគ្នេយ៍', 'ប្រវត្តិសាស្ត្រពិភពលោក'],
      topicsEn: ['Ancient Cambodia & Angkor Era', 'Middle & Modern Era Cambodia', 'Southeast Asian History', 'World History'],
    };
  }
  if (norm.includes('ភូមិ') || norm.includes('geograph')) {
    return {
      nameKm: 'ភូមិវិទ្យា',
      nameEn: 'Geography',
      category: 'Specialization',
      icon: Compass,
      colorBg: 'bg-cyan-50',
      colorText: 'text-cyan-600',
      colorBorder: 'border-cyan-100',
      topicsKm: ['ភូមិវិទ្យារូបវន្តកម្ពុជា', 'ភូមិវិទ្យាសេដ្ឋកិច្ច និងប្រជាជន', 'ការគ្រប់គ្រងធនធានធម្មជាតិ', 'បម្រែបម្រួលអាកាសធាតុ'],
      topicsEn: ['Physical Geography of Cambodia', 'Economic & Human Geography', 'Natural Resource Management', 'Climate Change'],
    };
  }
  if (norm.includes('ict') || norm.includes('ព័ត៌មានវិទ្យា') || norm.includes('កុំព្យូទ័រ')) {
    return {
      nameKm: 'ICT',
      nameEn: 'Information & Communication Technology',
      category: 'Specialization',
      icon: Laptop,
      colorBg: 'bg-violet-50',
      colorText: 'text-violet-600',
      colorBorder: 'border-violet-100',
      topicsKm: ['មូលដ្ឋានគ្រឹះកុំព្យូទ័រ និងប្រព័ន្ធប្រតិបត្តិការ', 'បណ្តាញកុំព្យូទ័រ និងអ៊ីនធឺណិត', 'កម្មវិធីការិយាល័យ និងបច្ចេកវិទ្យាអប់រំ', 'សន្តិសុខឌីជីថល'],
      topicsEn: ['Computer Basics & Operating Systems', 'Networking & Internet', 'Office Applications & EdTech', 'Digital Safety & Cyber Security'],
    };
  }

  return {
    nameKm: subjectName,
    nameEn: subjectName,
    category: 'Core',
    icon: BookMarked,
    colorBg: 'bg-slate-50',
    colorText: 'text-slate-600',
    colorBorder: 'border-slate-100',
    topicsKm: [subjectName],
    topicsEn: [subjectName],
  };
};


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
    iconTile: 'bg-[#0a3263]/10 text-[#0a3263] border-[#0a3263]/20',
    pill: 'bg-[#0a3263]/10 text-[#0a3263] border-[#0a3263]/20',
    accentText: 'text-[#0a3263]',
    accentBar: 'bg-[#0a3263]',
    featuresKm: ['សំណួរតាមមុខវិជ្ជា', 'ជ្រើសរើសប្រធានបទ', 'ចម្លើយនិងការពន្យល់ភ្លាមៗ'],
    featuresEn: ['Questions by subject', 'Topic selection', 'Instant answer explanations'],
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
    iconTile: 'bg-[#0a3263]/10 text-[#0a3263] border-[#0a3263]/20',
    pill: 'bg-[#0a3263]/10 text-[#0a3263] border-[#0a3263]/20',
    accentText: 'text-[#0a3263]',
    accentBar: 'bg-[#0a3263]',
    featuresKm: ['ពាក្យគន្លឹះសំខាន់ៗ', 'រូបមន្តត្រូវចងចាំ', 'មេរៀនសង្ខេបខ្លីៗ'],
    featuresEn: ['Essential key terms', 'Must-know formulas', 'Short summary lessons'],
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
    featuresKm: ['កំណត់ពេលវេលាពិត', 'វិញ្ញាសាគ្រប់មុខវិជ្ជា', 'វិភាគសមត្ថភាពលម្អិត'],
    featuresEn: ['Real exam timing', 'All subject exams', 'Detailed performance review'],
    selectTitleKm: 'ជ្រើសរើសមុខវិជ្ជាសម្រាប់វិញ្ញាសាប្រឡងសាកល្បង',
    selectTitleEn: 'Select a subject for your mock exam',
    selectDescKm: () => 'វិញ្ញាសាប្រឡងសាកល្បងកំណត់ពេលពិតប្រាកដដូចថ្ងៃប្រឡងជាក់ស្ដែង។',
    selectDescEn: () => 'A timed mock examination simulating the real exam day.',
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

export const PracticePage: React.FC = () => {
  const { lang } = useLanguage();
  const {
    userProfile,
    setUserProfile,
    setCurrentPage,
    setActiveQuiz,
    setActiveQuizId,
    setActiveMockExam,
    setSelectedPracticeSubject,
    setSelectedPracticeSubjectId,
    practiceViewMode,
    setPracticeViewMode,
    subjectScores,
    activeMockSetNumber,
    setActiveMockSetNumber,
    openExamSelection,
  } = useApp();

  // State: Selected National Exam Target (strictly 3 categories: 'nie' | 'rttc' | 'pttc')
  const initialCategory: ExamTarget =
    userProfile.targetExam === 'nie' || userProfile.targetExam === 'rttc' || userProfile.targetExam === 'pttc'
      ? userProfile.targetExam
      : 'nie';

  const [selectedExamTarget, setSelectedExamTarget] = useState<ExamTarget>(initialCategory);
  const [dbSubjects, setDbSubjects] = useState<SubjectItem[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState<boolean>(true);
  const [dbMockExams, setDbMockExams] = useState<any[]>([]);

  // Keep exam target in sync with user profile, and clear filter when subjects change
  React.useEffect(() => {
    if (userProfile.targetExam) {
      setSelectedExamTarget(userProfile.targetExam);
    }
    setSelectedSubjectFilter(null);
    setSearchQuery('');
  }, [userProfile.targetExam, userProfile.selectedSubjects]);

  // Fetch real subjects & mock exams from PostgreSQL database
  useEffect(() => {
    let isMounted = true;
    setLoadingSubjects(true);

    Promise.all([
      getSubjects({ targetExam: selectedExamTarget }),
      getMockExams({ targetExam: selectedExamTarget }).catch(() => ({ mockExams: [] })),
    ])
      .then(([subRes, mockRes]) => {
        if (!isMounted) return;
        if (subRes && Array.isArray(subRes.subjects) && subRes.subjects.length > 0) {
          const mapped: SubjectItem[] = subRes.subjects.map((s: ApiSubject) => {
            const meta = getSubjectMeta(s.subjectName, selectedExamTarget);
            return {
              id: String(s.subjectId),
              dbSubjectId: s.subjectId,
              nameKm: s.subjectName,
              nameEn: meta.nameEn,
              category: meta.category,
              targetExams: [selectedExamTarget],
              icon: meta.icon,
              colorBg: meta.colorBg,
              colorText: meta.colorText,
              colorBorder: meta.colorBorder,
              topicsKm: s.topics && s.topics.length > 0 ? s.topics : meta.topicsKm,
              topicsEn: meta.topicsEn,
              quizCount: s.quizCount || 0,
              questionCount: s.questionCount || 0,
              flashcardCount: s.flashcardCount || 0,
              difficulty: 'medium' as const,
            };
          });
          setDbSubjects(mapped);
        } else {
          setDbSubjects([]);
        }
        if (mockRes && Array.isArray(mockRes.mockExams)) {
          setDbMockExams(mockRes.mockExams);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch subjects from database:', err);
      })
      .finally(() => {
        if (isMounted) {
          setLoadingSubjects(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedExamTarget]);

  // View mode controlled globally ('exam-select' | 'hub' | 'subject-select')
  // Defaults to 'hub' (the 3 cards: Quiz, Flashcards, Mock Exam)
  const viewMode = practiceViewMode;
  const setViewMode = setPracticeViewMode;

  // When in subject-select mode, which feature was clicked?
  const [selectedCategory, setSelectedCategory] = useState<PracticeCategory>(() => {
    try {
      const saved = sessionStorage.getItem('passkru_practice_category');
      if (saved === 'flashcards' || saved === 'mock-exam' || saved === 'quiz') {
        return saved;
      }
    } catch { }
    return 'quiz';
  });

  // Search & Filter state for subject selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string | null>(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [activeMockSetTab, setActiveMockSetTab] = useState<number | null>(null);

  // Selected Exam Object info
  const currentExamInfo = examCategoriesList.find(e => e.id === selectedExamTarget) || examCategoriesList[0];

  // Subjects come only from the database, filtered by the user's selectedSubjects
  const baseSubjects = dbSubjects;

  const userSelected = (userProfile.selectedSubjects || []).length
    ? withCoreSubjects(userProfile.selectedSubjects)
    : [];
  const availableSubjectsForExam = userSelected.length > 0
    ? baseSubjects.filter(s =>
      isSubjectInSelection(s.nameKm, userSelected) ||
      isSubjectInSelection(s.nameEn, userSelected) ||
      isSubjectInSelection(s.id, userSelected)
    )
    : baseSubjects;

  // Counts derived dynamically from PostgreSQL database
  const examStats = {
    subjects: baseSubjects.length,
    quizzes: baseSubjects.reduce((total, s) => total + s.quizCount, 0),
    questions: baseSubjects.reduce((total, s) => total + s.questionCount, 0),
    flashcards: baseSubjects.reduce((total, s) => total + s.flashcardCount, 0),
    mockExams: dbMockExams.length,
  };
  const mockExamDuration: number = dbMockExams[0]?.durationMinutes ?? 45;
  const [mockExamNotice, setMockExamNotice] = useState<string | null>(null);

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
    setActiveMockSetTab(null);
  };

  const handleSelectAndGoToHub = (target: ExamTarget) => {
    handleSelectExamTarget(target);
    openExamSelection();
  };

  const handleOpenCategory = (category: PracticeCategory) => {
    try {
      sessionStorage.setItem('passkru_practice_category', category);
    } catch { }
    setSelectedCategory(category);
    setActiveMockSetTab(null);
    setViewMode('subject-select');
  };

  const handleStartSubjectQuiz = (subject: SubjectItem) => {
    try {
      sessionStorage.setItem('passkru_practice_category', 'quiz');
    } catch { }
    setActiveMockExam(null);
    setActiveQuizId(null);
    setActiveQuiz(null);
    setSelectedPracticeSubjectId(subject.id);
    setSelectedPracticeSubject(subject.nameKm);
    setCurrentPage('quiz');
  };

  const handleStartSubjectFlashcards = (subject: SubjectItem) => {
    try {
      sessionStorage.setItem('passkru_practice_category', 'flashcards');
    } catch { }
    setActiveQuiz(null);
    setActiveQuizId(null);
    setActiveMockExam(null);
    setSelectedPracticeSubjectId(subject.id);
    setSelectedPracticeSubject(subject.nameKm);
    setCurrentPage('flashcards');
  };

  const handleStartSubjectMockExam = async (subject: SubjectItem, setNum: number = 1) => {
    try {
      sessionStorage.setItem('passkru_practice_category', 'mock-exam');
    } catch { }
    setActiveMockSetNumber(setNum);
    setSelectedPracticeSubjectId(subject.id);
    setSelectedPracticeSubject(subject.nameKm);
    setMockExamNotice(null);

    try {
      // Query real organized quizzes from backend database API
      const res = await getQuizzes({
        targetExam: selectedExamTarget,
        subjectName: subject.nameKm,
      });

      const quizzesList = res?.quizzes || [];
      if (quizzesList.length > 0) {
        const kmDigit = localizeNumber(setNum, 'km');
        const matchedApiQuiz =
          quizzesList.find((q: any) =>
            q.title?.includes(`វិញ្ញាសាទី ${setNum}`) ||
            q.title?.includes(`វិញ្ញាសាទី ${kmDigit}`) ||
            q.title?.toLowerCase().includes(`set ${setNum}`) ||
            q.title?.toLowerCase().includes(`set-${setNum}`)
          ) ||
          quizzesList[setNum - 1] ||
          quizzesList[0];

        if (matchedApiQuiz?.quizId) {
          setActiveMockExam(null);
          setActiveQuiz(null);
          setActiveQuizId(matchedApiQuiz.quizId);
          setCurrentPage('mock-exam');
          return;
        }
      }
      setMockExamNotice(lang === 'km'
        ? `មុខវិជ្ជា «${subject.nameKm}» មិនទាន់មានវិញ្ញាសានៅក្នុងមូលដ្ឋានទិន្នន័យទេ។`
        : `${subject.nameEn} has no papers in the database yet.`);
    } catch (err: any) {
      setMockExamNotice(err?.message || (lang === 'km' ? 'មិនអាចទាញយកវិញ្ញាសាបានទេ' : 'Failed to load papers'));
    }
  };

  const handleStartSubject = (subject: SubjectItem) => {
    if (selectedCategory === 'quiz') handleStartSubjectQuiz(subject);
    else if (selectedCategory === 'flashcards') handleStartSubjectFlashcards(subject);
    else if (selectedCategory === 'mock-exam') handleStartSubjectMockExam(subject, activeMockSetTab);
  };

  // =========================================================================
  // =========================================================================
  // VIEW 1: UNIFIED 3-STEP EXAM & SUBJECT SELECTION FLOW
  // =========================================================================
  if (viewMode === 'exam-select') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
        {/* Navigation: back */}
        <div className="flex items-center">
          <button type="button" onClick={() => setViewMode('hub')} className={GHOST_BTN}>
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'km' ? 'ត្រឡប់ទៅផ្ទាំងអនុវត្ត' : 'Back to practice hub'}</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <ExamSelectionFlow
            isModal={false}
            onClose={() => setViewMode('hub')}
            onSuccess={() => setViewMode('hub')}
          />
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: STEP 3 — MOCK EXAM PACKAGES LIST OR SELECTED MOCK EXAM DETAIL PAGE
  // =========================================================================
  if (viewMode === 'subject-select' && selectedCategory === 'mock-exam') {
    const mockSets = [1, 2, 3, 4, 5];
    const userSelectedTexts = expandSubjectSelection(userProfile.selectedSubjects || [], lang);

    // PAGE LEVEL 2: DETAILED SUBJECT PAPERS PAGE FOR A SELECTED MOCK EXAM SET (e.g. Mock Exam 1 or 2)
    if (activeMockSetTab !== null) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
          {/* Navigation: back to Mock Exam list */}
          <div className="flex items-center">
            <button type="button" onClick={() => setActiveMockSetTab(null)} className={GHOST_BTN}>
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'km' ? 'ត្រឡប់ទៅជ្រើសរើសវិញ្ញាសារប្រឡង' : 'Back to Mock Exam packages'}</span>
            </button>
          </div>

          {/* Hero Header for specific Mock Exam */}
          <div className="bg-gradient-to-r from-[#0f3360] to-[#1a4a82] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-black shadow-xs">
                  {userProfile.examCategory || getExamCategoryLabel(userProfile.targetExam, lang)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-900 shadow-xs">
                  {lang === 'km' ? `វិញ្ញាសាប្រឡងសាកល្បងទី ${localizeNumber(activeMockSetTab, 'km')}` : `Mock Exam Set ${activeMockSetTab}`}
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-white leading-snug">
                {lang === 'km'
                  ? `បញ្ជីមុខវិជ្ជាក្នុងវិញ្ញាសាប្រឡងសាកល្បងទី ${localizeNumber(activeMockSetTab, 'km')}`
                  : `Subjects in Mock Exam Set ${activeMockSetTab}`}
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
                {lang === 'km'
                  ? 'សូមជ្រើសរើសមុខវិជ្ជាខាងក្រោមដើម្បីចាប់ផ្ដើមធ្វើវិញ្ញាសាតាមពេលវេលាកំណត់។'
                  : 'Select a subject paper below to begin your timed mock examination.'}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-xs text-blue-200 font-semibold mr-1">
                  {lang === 'km' ? 'មុខវិជ្ជាជ្រើសរើស៖' : 'Selected Subjects:'}
                </span>
                {(userSelectedTexts.length > 0 ? userSelectedTexts : availableSubjectsForExam.map(s => lang === 'km' ? s.nameKm : s.nameEn)).map((subj, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-white/15 text-white border border-white/20 backdrop-blur-xs"
                  >
                    • {subj}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => openExamSelection()}
              className="self-start md:self-auto shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition border border-white/30 shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ផ្លាស់ប្តូរក្របខណ្ឌ' : 'Switch target'}</span>
            </button>
          </div>

          {/* Timing Instruction Banner */}
          <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#0a3263] shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {lang === 'km'
                ? `មុខវិជ្ជាក្នុងវិញ្ញាសាប្រឡងសាកល្បងទី ${localizeNumber(activeMockSetTab, 'km')} (បេក្ខជនត្រូវបានផ្តល់ពេលវេលាកំណត់សម្រាប់ធ្វើវិញ្ញាសាតាមមុខវិជ្ជានីមួយៗ)`
                : `Subjects in Mock Exam ${activeMockSetTab} (Candidates are given time to complete each subject paper)`}
            </span>
          </div>

          {mockExamNotice && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl">
              {mockExamNotice}
            </div>
          )}

          {/* Subject Cards List */}
          <div className="space-y-3">
            {availableSubjectsForExam.map((subject) => {
              const duration = mockExamDuration;
              const questionCount = subject.questionCount;
              const SubjectIcon = subject.icon || BookMarked;

              const currentSetNum = activeMockSetTab || activeMockSetNumber || 1;
              const scoreRecord = selectedExamTarget
                ? (subjectScores[`${selectedExamTarget}::set-${currentSetNum}::${subject.id}`] ||
                   subjectScores[`${selectedExamTarget}::set-${currentSetNum}::${subject.nameKm}`])
                : undefined;
              const activeScore = scoreRecord?.mockExamScore ?? scoreRecord?.mockExamR1Score ?? scoreRecord?.mockExamR2Score;

              return (
                <div
                  key={subject.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-md transition p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className={`p-3 rounded-2xl shrink-0 ${subject.colorBg} ${subject.colorText}`}>
                      <SubjectIcon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                          {lang === 'km' ? subject.nameKm : subject.nameEn}
                        </h3>
                        {activeScore !== undefined && (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold shadow-xs ${activeScore >= 50 ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                              }`}
                          >
                            {localizeNumber(activeScore, lang)}%
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {localizeNumber(duration, lang)} {lang === 'km' ? 'នាទី' : 'mins'}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          {localizeNumber(questionCount, lang)} {lang === 'km' ? 'សំណួរ' : 'questions'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 lg:w-56">
                    <button
                      type="button"
                      onClick={() => handleStartSubjectMockExam(subject, activeMockSetTab)}
                      className={`${PRIMARY_BTN} w-full px-4 py-3`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span className="truncate">
                        {lang === 'km' ? 'ចាប់ផ្តើមប្រឡង' : 'Start Mock Exam'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // PAGE LEVEL 1: MOCK EXAM PACKAGES SELECTION PAGE (Lists Mock Exam 1, Mock Exam 2, Mock Exam 3)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
        {/* Navigation: back to hub */}
        <div className="flex items-center">
          <button type="button" onClick={() => setViewMode('hub')} className={GHOST_BTN}>
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'km' ? 'ត្រឡប់ទៅផ្ទាំងអនុវត្ត' : 'Back to practice hub'}</span>
          </button>
        </div>

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#0f3360] to-[#1a4a82] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-black shadow-xs">
                {userProfile.examCategory || getExamCategoryLabel(userProfile.targetExam, lang)}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white leading-snug">
              {lang === 'km' ? 'ជ្រើសរើសវិញ្ញាសារប្រឡង' : 'Select Exam Papers'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
              {lang === 'km'
                ? 'កញ្ចប់វិញ្ញាសាប្រឡងសាកល្បងរួមបញ្ចូលគ្រប់មុខវិជ្ជាចាំបាច់ ផ្អែកលើក្របខណ្ឌ និងមុខវិជ្ជាដែលអ្នកបានជ្រើសរើស។'
                : 'Full mock exam packages containing all required subjects for your active track.'}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-xs text-blue-200 font-semibold mr-1">
                {lang === 'km' ? 'មុខវិជ្ជាជ្រើសរើស៖' : 'Selected Subjects:'}
              </span>
              {(userSelectedTexts.length > 0 ? userSelectedTexts : availableSubjectsForExam.map(s => lang === 'km' ? s.nameKm : s.nameEn)).map((subj, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-white/15 text-white border border-white/20 backdrop-blur-xs"
                >
                  • {subj}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => openExamSelection()}
            className="self-start md:self-auto shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition border border-white/30 shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'ផ្លាស់ប្តូរក្របខណ្ឌ' : 'Switch target'}</span>
          </button>
        </div>

        {/* Mock Exam Packages Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0a3263]" />
              <span>{lang === 'km' ? 'កញ្ចប់វិញ្ញាសាប្រឡងសាកល្បង' : 'Mock Exam Packages'}</span>
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              {lang === 'km' ? 'ជ្រើសរើសវិញ្ញាសា (ទី១ ដល់ ទី៥)' : 'Select Mock Exam Set 1 to 5'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSets.map((setNum) => (
              <div
                key={setNum}
                onClick={() => {
                  setActiveMockSetNumber(setNum);
                  setActiveMockSetTab(setNum);
                }}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-[#0a3263] hover:shadow-md transition p-6 cursor-pointer select-none space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl text-xs font-black bg-[#0a3263]/10 text-[#0a3263]">
                    {lang === 'km' ? `វិញ្ញាសាទី ${localizeNumber(setNum, 'km')}` : `Mock Exam ${setNum}`}
                  </span>
                  <Sparkles className="w-5 h-5 text-amber-500 group-hover:scale-110 transition" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#0a3263] transition">
                    {lang === 'km' ? `វិញ្ញាសាប្រឡងសាកល្បង ${localizeNumber(setNum, 'km')}` : `Mock Exam Set ${setNum}`}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {lang === 'km'
                      ? `រួមបញ្ចូលគ្រប់ ${localizeNumber(availableSubjectsForExam.length, 'km')} មុខវិជ្ជាប្រឡងដែលចាំបាច់។`
                      : `Contains all ${availableSubjectsForExam.length} mandatory exam subjects.`}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {lang === 'km' ? 'កំណត់ពេលតាមមុខវិជ្ជា' : 'Timed subject papers'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMockSetNumber(setNum);
                      setActiveMockSetTab(setNum);
                    }}
                    className={`${PRIMARY_BTN} px-3.5 py-2`}
                  >
                    <span>{lang === 'km' ? 'ចូលធ្វើវិញ្ញាសា' : 'Open Mock Exam'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: STEP 3 — SUBJECT SELECTION (QUIZ / FLASHCARDS)
  // =========================================================================
  if (viewMode === 'subject-select') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">

        {/* Navigation: back */}
        <div className="flex items-center">
          <button type="button" onClick={() => setViewMode('hub')} className={GHOST_BTN}>
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'km' ? 'ត្រឡប់ទៅផ្ទាំងអនុវត្ត' : 'Back to practice hub'}</span>
          </button>
        </div>

        {/* Category hero */}
        <div className="bg-gradient-to-r from-[#0f3360] to-[#1a4a82] rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-black shadow-xs">
                {userProfile.examCategory || getExamCategoryLabel(userProfile.targetExam, lang)}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {lang === 'km' ? activeCategory.selectTitleKm : activeCategory.selectTitleEn}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
              {lang === 'km'
                ? activeCategory.selectDescKm(userProfile.examCategory || currentExamInfo.nameKm)
                : activeCategory.selectDescEn(userProfile.examCategory || currentExamInfo.nameEn)}
            </p>
            {userProfile?.selectedSubjects && userProfile.selectedSubjects.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs text-blue-200 font-semibold mr-1">
                  {lang === 'km' ? 'មុខវិជ្ជាជ្រើសរើស៖' : 'Selected Subjects:'}
                </span>
                {expandSubjectSelection(userProfile.selectedSubjects || [], lang).map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-white/15 text-white border border-white/20 backdrop-blur-xs"
                  >
                    • {s}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => openExamSelection()}
            className="self-start md:self-auto shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition border border-white/30 shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'ផ្លាស់ប្តូរក្របខណ្ឌ' : 'Switch target'}</span>
          </button>
        </div>

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
                className={`w-full inline-flex items-center justify-between gap-2 text-sm font-semibold transition cursor-pointer ${selectedSubjectFilter ? 'text-indigo-700' : 'text-slate-600 hover:text-slate-900'
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
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${!selectedSubjectFilter ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
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
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${isSelected ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
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
        {loadingSubjects ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-slate-200 rounded-md w-44" />
                  <div className="h-3.5 bg-slate-100 rounded-md w-64" />
                </div>
                <div className="h-10 bg-slate-200 rounded-xl lg:w-56" />
              </div>
            ))}
          </div>
        ) : filteredSubjects.length > 0 ? (
          <div className="space-y-3">
            {filteredSubjects.map((subject) => {
              const currentSetNum = activeMockSetTab || activeMockSetNumber || 1;
              const quizScoreRecord = selectedExamTarget
                ? (subjectScores[`${selectedExamTarget}::quiz::${subject.id}`] ||
                   subjectScores[`${selectedExamTarget}::quiz::${subject.nameKm}`] ||
                   subjectScores[`${selectedExamTarget}::${subject.id}`] ||
                   subjectScores[`${selectedExamTarget}::${subject.nameKm}`])
                : undefined;
              const mockScoreRecord = selectedExamTarget
                ? (subjectScores[`${selectedExamTarget}::set-${currentSetNum}::${subject.id}`] ||
                   subjectScores[`${selectedExamTarget}::set-${currentSetNum}::${subject.nameKm}`])
                : undefined;

              const savedQuizScore = quizScoreRecord?.quizScore;
              const savedMockScore = mockScoreRecord?.mockExamScore ?? mockScoreRecord?.mockExamR1Score ?? mockScoreRecord?.mockExamR2Score;
              const activeScore = selectedCategory === 'quiz' ? savedQuizScore : selectedCategory === 'mock-exam' ? savedMockScore : undefined;
              const roundDuration = mockExamDuration;
              const topics = lang === 'km' ? subject.topicsKm : subject.topicsEn;

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
                      { key: 'questions', icon: Layers, text: `${localizeNumber(subject.questionCount, lang)} ${lang === 'km' ? 'សំណួរ' : 'questions'}` },
                    ];

              return (
                <div
                  key={subject.id}
                  id={`subject-row-${subject.id}`}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-md transition p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-4"
                >
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {lang === 'km' ? subject.nameKm : subject.nameEn}
                      </h3>
                      <span className="text-xs font-medium text-slate-400">
                        {lang === 'km' ? subject.nameEn : subject.nameKm}
                      </span>
                      {activeScore !== undefined && (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold shadow-xs ${activeScore >= 50
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 text-white'
                            }`}
                        >
                          {localizeNumber(activeScore, lang)}%
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
                        {lang === 'km' ? activeCategory.actionKm : activeCategory.actionEn}
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
  const takenMockScores: number[] = [];

  // Iterate over availableSubjectsForExam to count each distinct subject strictly for this exam target
  availableSubjectsForExam.forEach(s => {
    const qRec = selectedExamTarget
      ? (subjectScores[`${selectedExamTarget}::quiz::${s.id}`] ||
         subjectScores[`${selectedExamTarget}::quiz::${s.nameKm}`] ||
         subjectScores[`${selectedExamTarget}::${s.id}`] ||
         subjectScores[`${selectedExamTarget}::${s.nameKm}`])
      : undefined;
    if (typeof qRec?.quizScore === 'number') {
      takenQuizScores.push(qRec.quizScore);
    }

    [1, 2, 3, 4, 5].forEach(setNum => {
      const mRec = selectedExamTarget
        ? (subjectScores[`${selectedExamTarget}::set-${setNum}::${s.id}`] ||
           subjectScores[`${selectedExamTarget}::set-${setNum}::${s.nameKm}`])
        : undefined;
      const scoreVal = mRec?.mockExamScore ?? mRec?.mockExamR1Score ?? mRec?.mockExamR2Score;
      if (typeof scoreVal === 'number') {
        takenMockScores.push(scoreVal);
      }
    });
  });

  // Quiz Average Percentage (if more than one taken, it averages them)
  const avgQuizScore = takenQuizScores.length > 0
    ? Math.round(takenQuizScores.reduce((sum, val) => sum + val, 0) / takenQuizScores.length)
    : null;

  // Mock Exam Average Percentage
  const overallAvgMock = takenMockScores.length > 0
    ? Math.round(takenMockScores.reduce((sum, val) => sum + val, 0) / takenMockScores.length)
    : null;


  const categoryScore = (category: PracticeCategory): number | null => {
    if (category === 'quiz') return avgQuizScore;
    if (category === 'mock-exam') return overallAvgMock;
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <SEOHead
        title={lang === 'km' ? 'លំហាត់អនុវត្តតាមមុខវិជ្ជា' : 'Practice Hub'}
        description={
          lang === 'km'
            ? 'ធ្វើលំហាត់អនុវត្តតាមប្រធានបទ វប្បធម៌ទូទៅ គណិតវិទ្យា ភាសាខ្មែរ ភាសាអង់គ្លេស និងមុខវិជ្ជាប្រឡងគ្រូ។'
            : 'Topic-based exercises and mock exam practice modules tailored for Cambodian Teacher Examination candidates.'
        }
        path="/practice"
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
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
      <div className="bg-gradient-to-r from-[#0f3360] to-[#1a4a82] rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-black shadow-xs">
              {lang === 'km' ? 'ក្របខណ្ឌប្រឡងសកម្ម' : 'Active Track'}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {userProfile.examCategory || getExamCategoryLabel(userProfile.targetExam, lang)}
            </h2>
          </div>
          {userProfile?.selectedSubjects && userProfile.selectedSubjects.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-blue-200 font-semibold mr-1">
                {lang === 'km' ? 'មុខវិជ្ជាជ្រើសរើស៖' : 'Selected Subjects:'}
              </span>
              {expandSubjectSelection(userProfile.selectedSubjects || [], lang).map((subj, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-white/15 text-white border border-white/20 backdrop-blur-xs"
                >
                  • {subj}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          id="btn-switch-exam-category"
          onClick={() => openExamSelection()}
          className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition border border-white/30 shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{lang === 'km' ? 'ផ្លាស់ប្តូរក្របខណ្ឌប្រឡង' : 'Change Exam Category'}</span>
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
              className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden hover:border-slate-300 hover:shadow-md transition cursor-pointer select-none min-h-[310px] sm:min-h-[330px]"
            >
              <span className={`block h-1.5 w-full ${category.accentBar}`} />

              <div className="p-6 sm:p-7 flex flex-col flex-1">
                <div className="flex items-center justify-end min-h-[26px]">
                  {score !== null && (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold shadow-xs ${score >= 50
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                        }`}
                    >
                      {localizeNumber(score, lang)}%
                    </span>
                  )}
                </div>

                <h2 className="mt-3 text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {lang === 'km' ? category.nameKm : category.nameEn}
                </h2>

                <ul className="mt-5 space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${category.accentText}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6 sm:pt-8">
                  <button
                    type="button"
                    id={`btn-start-${category.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCategory(category.id);
                    }}
                    className={`${PRIMARY_BTN} w-full px-4 py-3 sm:py-3.5`}
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
