import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { mockQuizzes, mockExams, mockFlashcards } from '../../data/mockData';
import { Quiz, MockExam, ExamTarget } from '../../types';
import {
  Check,
  HelpCircle,
  BookOpen,
  ShieldCheck,
  Brain,
  ArrowLeft,
  ArrowRight,
  Search,
  Sparkles,
  Layers,
  Clock,
  Award,
  BookMarked,
  Globe,
  Calculator,
  Languages,
  Atom,
  Scale,
  Leaf,
  Landmark,
  Play,
  RotateCcw,
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
  const availableSubjectsForExam = allSubjectsList.filter(s => {
    return s.targetExams.includes(selectedExamTarget);
  });

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

  // =========================================================================
  // VIEW 1: STEP 1 — 3-CATEGORY FULL SELECTION OVERVIEW
  // =========================================================================
  if (viewMode === 'exam-select') {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50/70 py-10 sm:py-14 animate-fadeIn">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-slate-900">
              {lang === 'km' ? 'ជ្រើសរើសក្របខណ្ឌប្រឡងគ្រូ' : 'Choose Teacher Exam Target'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              {lang === 'km'
                ? 'សូមជ្រើសរើស ១ ក្នុងចំណោមក្របខណ្ឌទាំង ៣ (កម្រិតឧត្តម កម្រិតមូលដ្ឋាន កម្រិតបឋម) ដើម្បីឱ្យប្រព័ន្ធកំណត់កម្រងសំណួរ Quiz, Flashcards និង Mock Exam ទៅតាមកម្រិតក្របខណ្ឌនោះ។'
                : 'Select 1 of the 3 recruitment categories (Higher Level, Basic Level, Primary Level) to tailor your quizzes, flashcards, and mock exams.'}
            </p>
          </div>

          {/* Exactly 3 Exam Category Cards Grid - Matching Reference Image */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {examCategoriesList.map((exam) => {
              const isSelected = selectedExamTarget === exam.id;

              // Color configs matching screenshot:
              // nie -> purple/indigo
              // rttc -> sky/blue
              // pttc -> emerald/green
              const boxBg =
                exam.id === 'nie' ? 'bg-[#f5f3ff]' :
                exam.id === 'rttc' ? 'bg-[#eff6ff]' :
                'bg-[#f0fdf4]';

              const dotColor =
                exam.id === 'nie' ? 'bg-[#4f46e5]' :
                exam.id === 'rttc' ? 'bg-[#0284c7]' :
                'bg-[#16a34a]';

              const sublabelColor =
                exam.id === 'nie' ? 'text-[#4f46e5]' :
                exam.id === 'rttc' ? 'text-[#0284c7]' :
                'text-[#16a34a]';

              return (
                <div
                  key={exam.id}
                  id={`exam-target-card-${exam.id}`}
                  onClick={() => handleSelectAndGoToHub(exam.id)}
                  className={`bg-white rounded-[26px] sm:rounded-[30px] p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6 cursor-pointer group relative overflow-hidden min-h-[440px] select-none ${
                    isSelected
                      ? 'border-2 border-[#4f46e5] ring-4 ring-[#4f46e5]/10'
                      : 'border border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  {/* Selected Badge Ribbon on Top Right */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 bg-[#4f46e5] text-white text-[11px] font-normal px-4 py-1.5 rounded-bl-2xl shadow-xs">
                      {lang === 'km' ? 'បានជ្រើសរើស' : 'Selected'}
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Top Rounded Header Box */}
                    <div className={`${boxBg} rounded-2xl p-4 sm:p-5 transition-colors`}>
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${dotColor} shrink-0`} />
                        <h3 className="text-sm sm:text-base font-normal text-slate-900 leading-snug">
                          {lang === 'km' ? exam.nameKm : exam.nameEn}
                        </h3>
                      </div>
                      <p className={`text-xs font-normal ${sublabelColor} mt-1.5 pl-5`}>
                        {lang === 'km' ? exam.badgeKm : exam.badgeEn}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal px-1">
                      {lang === 'km' ? exam.descriptionKm : exam.descriptionEn}
                    </p>
                  </div>

                  {/* Selection Action Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAndGoToHub(exam.id);
                      }}
                      className={`w-full py-3.5 px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-normal flex items-center justify-center gap-2 shadow-xs transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                        isSelected
                          ? 'bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-md'
                          : 'bg-[#0f172a] hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>{lang === 'km' ? 'ជ្រើសរើស' : 'Select'}</span>
                      <ArrowRight className="w-4 h-4 stroke-[2]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setViewMode('hub')}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'km' ? 'ត្រឡប់ទៅផ្ទាំងអនុវត្តផ្ទាល់' : 'Return directly to Practice Hub'}</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: STEP 3 — SUBJECT SELECTION (Rendered immediately after clicking any card)
  // =========================================================================
  if (viewMode === 'subject-select') {
    const categoryInfo = {
      quiz: {
        tag: 'QUIZ MODE',
        titleKm: 'ជ្រើសរើសមុខវិជ្ជាសម្រាប់ Quiz',
        titleEn: 'Select Subject for Quiz',
        descKm: `មុខវិជ្ជាទាំងអស់សម្រាប់ក្របខណ្ឌ ${currentExamInfo.nameKm}។ ជ្រើសរើសមុខវិជ្ជាដើម្បីចាប់ផ្ដើមធ្វើ Quiz។`,
        descEn: `All available subjects for ${currentExamInfo.nameEn}. Select a subject to start the knowledge assessment quiz.`,
        actionLabelKm: 'ធ្វើ Quiz មុខវិជ្ជានេះ',
        actionLabelEn: 'Start Subject Quiz',
        badgeBg: 'bg-[#00b4f0]/10 text-[#007cf5] border-[#00b4f0]/30',
        cardGradient: 'from-[#00b4f0] via-[#009de8] to-[#007cf5]',
        btnBg: 'bg-[#007cf5] hover:bg-[#006bd1] text-white'
      },
      flashcards: {
        tag: 'FLASHCARDS MODE',
        titleKm: 'ជ្រើសរើសមុខវិជ្ជាសម្រាប់កាតសិក្សា (Flashcards)',
        titleEn: 'Select Subject for Flashcards',
        descKm: `បណ្ណចងចាំរូបមន្ត ពាក្យគន្លឹះ និងទ្រឹស្តីសម្រាប់ក្របខណ្ឌ ${currentExamInfo.nameKm}។`,
        descEn: `Interactive flashcards covering formulas, key terms, and theories for ${currentExamInfo.nameEn}.`,
        actionLabelKm: 'ចូលរៀនបណ្ណចងចាំ',
        actionLabelEn: 'Study Flashcards',
        badgeBg: 'bg-[#245ad6]/10 text-[#1d4ecc] border-[#245ad6]/30',
        cardGradient: 'from-[#245ad6] via-[#1d4ecc] to-[#153ea8]',
        btnBg: 'bg-[#1d4ecc] hover:bg-[#153ea8] text-white'
      },
      'mock-exam': {
        tag: 'MOCK EXAM MODE',
        titleKm: 'ជ្រើសរើសមុខវិជ្ជាសម្រាប់វិញ្ញាសាប្រឡងសាកល្បង',
        titleEn: 'Select Subject for Mock Exam Simulation',
        descKm: 'វិញ្ញាសាប្រឡងសាកល្បងកំណត់ពេលពិតប្រាកដ (មាន ២ ជុំ៖ ជុំទី ១ ជម្រុះបឋម និង ជុំទី ២ កម្រិតពិបាក)។',
        descEn: 'Timed mock examination simulation (2 rounds: Round 1 preliminary and Round 2 advanced harder stage).',
        actionLabelKm: 'ចាប់ផ្តើមប្រឡងសាកល្បង',
        actionLabelEn: 'Start Mock Exam',
        badgeBg: 'bg-[#0c235c]/10 text-[#0c235c] border-[#0c235c]/30',
        cardGradient: 'from-[#0c235c] via-[#091b48] to-[#061438]',
        btnBg: 'bg-[#0c235c] hover:bg-[#061438] text-white'
      }
    }[selectedCategory];

    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50/70 py-8 sm:py-12 animate-fadeIn">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top Navigation & Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setViewMode('hub')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-normal text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/90 shadow-2xs transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'km' ? 'ត្រឡប់ទៅផ្ទាំងអនុវត្ត' : 'Back to Practice Hub'}</span>
            </button>

            {/* Clean Category Badge & 1-Click Switch Button */}
            <div className="inline-flex items-center gap-2 p-1.5 pl-3 pr-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-xs font-normal text-slate-800">
                {currentExamInfo.tag}
              </span>
              <button
                type="button"
                onClick={() => setViewMode('exam-select')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-normal text-indigo-700 bg-indigo-50 hover:bg-indigo-600 hover:text-white border border-indigo-200/70 transition cursor-pointer shadow-2xs group"
              >
                <RefreshCw className="w-3 h-3 text-indigo-600 group-hover:text-white transition-colors" />
                <span>{lang === 'km' ? 'ប្តូរក្របខណ្ឌ' : 'Switch Category'}</span>
              </button>
            </div>
          </div>

          {/* Active Feature Hero Banner */}
          <div className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-r ${categoryInfo.cardGradient} text-white shadow-lg space-y-3 relative overflow-hidden`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-normal">
              <Target className="w-3.5 h-3.5" />
              <span>{categoryInfo.tag} • {currentExamInfo.tag}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-normal text-white leading-snug">
              {lang === 'km' ? categoryInfo.titleKm : categoryInfo.titleEn}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed font-normal">
              {lang === 'km' ? categoryInfo.descKm : categoryInfo.descEn}
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              
              {/* Search Input */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'km' ? 'ស្វែងរកមុខវិជ្ជា ឬប្រធានបទ...' : 'Search subjects or topics...'}
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Button: Select any subject 1 at a time */}
              <div className="relative">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="btn-subject-filter-dropdown"
                    onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
                    className={`inline-flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl text-xs font-normal border transition cursor-pointer shadow-2xs w-full sm:w-auto ${
                      selectedSubjectFilter
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Filter className={`w-3.5 h-3.5 shrink-0 ${selectedSubjectFilter ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="truncate">
                        {selectedSubjectFilter
                          ? (availableSubjectsForExam.find((s) => s.id === selectedSubjectFilter)?.nameKm ||
                             availableSubjectsForExam.find((s) => s.id === selectedSubjectFilter)?.nameEn)
                          : (lang === 'km' ? 'តម្រងតាមមុខវិជ្ជា' : 'Filter by subject')}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                  </button>

                  {selectedSubjectFilter && (
                    <button
                      type="button"
                      onClick={() => setSelectedSubjectFilter(null)}
                      className="text-xs font-normal text-slate-500 hover:text-black shrink-0 cursor-pointer flex items-center gap-1"
                      title={lang === 'km' ? 'កំណត់ឡើងវិញ' : 'Reset'}
                    >
                      <span className="text-slate-400 hover:text-slate-600 underline">
                        {lang === 'km' ? '(កំណត់ឡើងវិញ)' : '(Reset)'}
                      </span>
                    </button>
                  )}
                </div>

                {/* Dropdown Menu */}
                {isFilterDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsFilterDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1.5 w-72 max-h-80 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-1.5 space-y-0.5 animate-fadeIn">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubjectFilter(null);
                          setIsFilterDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-normal flex items-center justify-between transition cursor-pointer ${
                          !selectedSubjectFilter
                            ? 'bg-slate-100 text-black font-medium'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{lang === 'km' ? 'គ្រប់មុខវិជ្ជាទាំងអស់' : 'All Subjects'}</span>
                        {!selectedSubjectFilter && <Check className="w-3.5 h-3.5 text-black" />}
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
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-normal flex items-center justify-between transition cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50 text-indigo-700 font-medium'
                                : 'text-slate-700 hover:bg-slate-50'
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
            </div>
          </div>

          {/* Mock Exam Round Selector (2 Rounds: Round 1 Medium, Round 2 Harder) */}
          {selectedCategory === 'mock-exam' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2 self-start sm:self-auto pl-1 sm:pl-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0c235c]" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  {lang === 'km' ? 'ជ្រើសរើសជុំប្រឡងសាកល្បង (២ ជុំ)៖' : 'Mock Exam Stages (2 Rounds):'}
                </span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setMockExamRound(1)}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-normal transition cursor-pointer flex items-center justify-center gap-2 ${
                    mockExamRound === 1
                      ? 'bg-[#0c235c] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-semibold">{lang === 'km' ? 'ជុំទី ១' : 'Round 1'}</span>
                  <span className="text-[11px] opacity-85">
                    {lang === 'km' ? '(៤៥ នាទី · មធ្យម)' : '(45 Mins · Medium)'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMockExamRound(2)}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-normal transition cursor-pointer flex items-center justify-center gap-2 ${
                    mockExamRound === 2
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-semibold">{lang === 'km' ? 'ជុំទី ២' : 'Round 2'}</span>
                  <span className="text-[11px] opacity-85 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    {lang === 'km' ? '(៦០ នាទី · ពិបាក)' : '(60 Mins · Harder)'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Subjects Vertical List (Rendered for the selected Category - Not Card) */}
          <div className="flex flex-col space-y-3">
            {filteredSubjects.map(subject => {
              const scoreRecord = subjectScores[subject.id] || subjectScores[subject.nameKm];
              const savedQuizScore = scoreRecord?.quizScore;
              const savedMockScore = mockExamRound === 1 ? scoreRecord?.mockExamR1Score : scoreRecord?.mockExamR2Score;

              return (
                <div
                  key={subject.id}
                  id={`subject-row-${subject.id}`}
                  className="bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  {/* Left: Subject Details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h3 className="text-sm sm:text-base font-normal text-slate-800 group-hover:text-black transition leading-snug">
                        {lang === 'km' ? subject.nameKm : subject.nameEn}
                      </h3>
                      <span className="text-xs font-normal text-slate-500">
                        {lang === 'km' ? subject.nameEn : subject.nameKm}
                      </span>

                      {/* Saved Score Badge next to Title */}
                      {selectedCategory === 'quiz' && savedQuizScore !== undefined && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border shadow-2xs ${
                          savedQuizScore >= 50
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          <Trophy className="w-3 h-3 text-current" />
                          <span>{lang === 'km' ? 'ពិន្ទុ' : 'Score'}: {savedQuizScore}%</span>
                        </span>
                      )}
                      {selectedCategory === 'mock-exam' && savedMockScore !== undefined && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border shadow-2xs ${
                          savedMockScore >= (mockExamRound === 1 ? 50 : 60)
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          <Trophy className="w-3 h-3 text-current" />
                          <span>{lang === 'km' ? `ជុំទី ${mockExamRound}` : `Round ${mockExamRound}`}: {savedMockScore}%</span>
                        </span>
                      )}
                    </div>

                    {/* Topics Inline Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {(lang === 'km' ? subject.topicsKm : subject.topicsEn).slice(0, 4).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-normal bg-slate-100/80 text-slate-600 border border-slate-200/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Counters & Action Button */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    <div className="flex items-center gap-3.5 text-xs font-normal text-slate-500">
                      {selectedCategory === 'quiz' && (
                        <>
                          <div className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{subject.questionCount} {lang === 'km' ? 'សំណួរ' : 'Questions'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            <span>10-15 {lang === 'km' ? 'នាទី' : 'Mins'}</span>
                          </div>
                          {savedQuizScore !== undefined && (
                            <div
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold text-xs shadow-2xs ${
                                savedQuizScore >= 50
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                  : 'bg-amber-50 border-amber-200 text-amber-700'
                              }`}
                              title={lang === 'km' ? 'ពិន្ទុដែលបានរក្សាទុក' : 'Saved Percentage'}
                            >
                              <Trophy className="w-3.5 h-3.5 text-current" />
                              <span>{savedQuizScore}%</span>
                            </div>
                          )}
                        </>
                      )}
                      {selectedCategory === 'flashcards' && (
                        <>
                          <div className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{subject.flashcardCount} {lang === 'km' ? 'បណ្ណចងចាំ' : 'Cards'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{lang === 'km' ? 'រូបមន្ត & និយមន័យ' : 'Key Terms'}</span>
                          </div>
                        </>
                      )}
                      {selectedCategory === 'mock-exam' && (
                        <>
                          <div className="flex items-center gap-1.5 font-medium text-slate-800">
                            <Clock className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{mockExamRound === 1 ? '45' : '60'} {lang === 'km' ? 'នាទី' : 'Mins'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 ${
                              mockExamRound === 2
                                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {mockExamRound === 2 && <Flame className="w-3 h-3 text-rose-600" />}
                              {mockExamRound === 1
                                ? (lang === 'km' ? 'ជុំទី ១ · មធ្យម' : 'Round 1 · Medium')
                                : (lang === 'km' ? 'ជុំទី ២ · ពិបាក' : 'Round 2 · Hard')}
                            </span>
                          </div>
                          {savedMockScore !== undefined && (
                            <div
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold text-xs shadow-2xs ${
                                savedMockScore >= (mockExamRound === 1 ? 50 : 60)
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                  : 'bg-amber-50 border-amber-200 text-amber-700'
                              }`}
                              title={lang === 'km' ? `ពិន្ទុជុំទី ${mockExamRound} ដែលបានរក្សាទុក` : `Saved Round ${mockExamRound} Percentage`}
                            >
                              <Trophy className="w-3.5 h-3.5 text-current" />
                              <span>{savedMockScore}%</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      id={`btn-action-subject-${subject.id}`}
                      onClick={() => {
                        if (selectedCategory === 'quiz') handleStartSubjectQuiz(subject);
                        else if (selectedCategory === 'flashcards') handleStartSubjectFlashcards(subject);
                        else if (selectedCategory === 'mock-exam') handleStartSubjectMockExam(subject, mockExamRound);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-normal flex items-center justify-center gap-2 shadow-2xs transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap ${
                        selectedCategory === 'mock-exam' && mockExamRound === 2
                          ? 'bg-rose-700 hover:bg-rose-800 text-white'
                          : categoryInfo.btnBg
                      }`}
                    >
                      {selectedCategory === 'mock-exam' && mockExamRound === 2 ? (
                        <Flame className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                      <span>
                        {selectedCategory === 'mock-exam'
                          ? (lang === 'km'
                              ? (mockExamRound === 1 ? 'ចាប់ផ្តើមជុំទី ១ (៤៥ នាទី)' : 'ចាប់ផ្តើមជុំទី ២ (៦០ នាទី)')
                              : (mockExamRound === 1 ? 'Start Round 1 (45 Mins)' : 'Start Round 2 (60 Mins)'))
                          : (lang === 'km' ? categoryInfo.actionLabelKm : categoryInfo.actionLabelEn)}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSubjects.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-normal text-slate-800">
                {lang === 'km' ? 'រកមិនឃើញមុខវិជ្ជាដែលត្រូវនឹងការស្វែងរកទេ' : 'No matching subjects found'}
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                {lang === 'km' ? 'សូមព្យាយាមស្វែងរកជាមួយពាក្យគន្លឹះផ្សេងទៀត ឬកំណត់តម្រងឡើងវិញ។' : 'Try searching with different keywords or reset filter.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubjectFilter(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-normal text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
              >
                {lang === 'km' ? 'កំណត់តម្រងឡើងវិញ' : 'Reset filters'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: STEP 2 — PRACTICE HUB (3 Main Cards + Category Switcher Bar)
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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100/70 py-10 sm:py-14 lg:py-16 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* ========================================
            PAGE HEADER & CLEAN SEGMENTED CATEGORY SWITCHER
            ======================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-slate-900">
            {lang === 'km' ? 'អនុវត្ត' : 'Practice'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            {lang === 'km'
              ? 'ពង្រឹងចំណេះដឹង និងត្រៀមខ្លួនសម្រាប់ការប្រឡងតាមរយៈការអនុវត្តដែលមានប្រសិទ្ធភាព'
              : 'Strengthen your knowledge and prepare for the national exam through effective interactive practice.'}
          </p>

          {/* Clean Compact Category Badge & 1-Click Switch Button */}
          <div className="pt-2 flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 p-1.5 pl-3 pr-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all max-w-full">
              {/* Category Info */}
              <div className="flex items-center gap-2 pl-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse shrink-0" />
                <span className="text-xs sm:text-sm font-normal text-slate-800 whitespace-nowrap">
                  {currentExamInfo.tag}
                </span>
              </div>

              {/* Clean 1-Click Switch Category Button */}
              <button
                type="button"
                id="btn-switch-exam-category"
                onClick={() => setViewMode('exam-select')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-normal text-indigo-700 bg-indigo-50 hover:bg-indigo-600 hover:text-white border border-indigo-200/70 transition-all duration-200 cursor-pointer shadow-2xs group shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white transition-colors" />
                <span>{lang === 'km' ? 'ប្តូរក្របខណ្ឌ' : 'Switch Category'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================
            THREE MAIN FEATURE CARDS (EXACT MATCH TO DESIGN)
            Desktop: 3 side-by-side
            Tablet: 2 per row
            Mobile: 1 per row
            ======================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          
          {/* ========================================
              CARD 1 — QUIZ (CYAN / SKY BLUE)
              ======================================== */}
          <div
            id="practice-card-quiz"
            onClick={() => {
              setSelectedCategory('quiz');
              setViewMode('subject-select');
            }}
            className="group relative overflow-hidden bg-gradient-to-b from-[#00b4f0] via-[#009de8] to-[#007cf5] rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5 select-none min-h-[460px]"
          >
            <div className="space-y-6">
              {/* White Left-Flush Pill Banner */}
              <div className="w-[88%] -ml-6 sm:-ml-7 pl-6 sm:pl-7 pr-6 py-3.5 sm:py-4 bg-white rounded-r-[26px] shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-normal text-[#009ee8] leading-snug">
                    {lang === 'km' ? 'លំហាត់ Quiz' : 'Quiz Practice'}
                  </h2>
                  <p className="text-[11px] sm:text-xs font-normal text-[#009ee8] mt-0.5">
                    {lang === 'km' ? 'វាយតម្លៃចំណេះដឹងរហ័ស' : 'Quick Assessment'}
                  </p>
                </div>
                {avgQuizScore !== null && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shrink-0 shadow-2xs"
                    title={takenQuizScores.length > 1 ? (lang === 'km' ? 'ពិន្ទុមធ្យម' : 'Average Quiz Score') : (lang === 'km' ? 'ពិន្ទុដែលបានធ្វើ' : 'Quiz Score')}
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>{avgQuizScore}%</span>
                  </div>
                )}
              </div>

              {/* White Bullet Items with Checkmarks */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3 text-white text-xs sm:text-sm font-normal">
                  <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />
                  <span>{lang === 'km' ? 'សំណួរតាមមុខវិជ្ជា' : 'Questions by subject'}</span>
                </div>
                <div className="flex items-center gap-3 text-white text-xs sm:text-sm font-normal">
                  <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />
                  <span>{lang === 'km' ? 'ជ្រើសរើសប្រធានបទ' : 'Custom topics'}</span>
                </div>
                <div className="flex items-center gap-3 text-white text-xs sm:text-sm font-normal">
                  <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />
                  <span>{lang === 'km' ? 'ចម្លើយ & ការពន្យល់ភ្លាមៗ' : 'Immediate feedback'}</span>
                </div>
              </div>

              {/* Saved Score Badge inside Quiz Card */}
              {avgQuizScore !== null && (
                <div className="bg-white/20 backdrop-blur-md border border-white/40 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between text-white shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Trophy className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>
                      {lang === 'km'
                        ? (takenQuizScores.length > 1 ? 'ពិន្ទុមធ្យម (Quiz)៖' : 'ពិន្ទុដែលធ្លាប់បានធ្វើ៖')
                        : (takenQuizScores.length > 1 ? 'Average Quiz Score:' : 'Your Quiz Score:')}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold bg-white text-[#007cf5] px-3 py-0.5 rounded-xl shadow-xs">
                    {avgQuizScore}%
                  </span>
                </div>
              )}
            </div>

            {/* CTA Outline Pill Button */}
            <div className="pt-8">
              <button
                type="button"
                id="btn-start-quiz"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCategory('quiz');
                  setViewMode('subject-select');
                }}
                className="w-full rounded-full border-2 border-white bg-transparent hover:bg-white hover:text-[#007cf5] text-white font-normal text-xs sm:text-sm uppercase py-3.5 px-6 text-center transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md active:scale-[0.98]"
              >
                START NOW
              </button>
            </div>
          </div>

          {/* ========================================
              CARD 2 — FLASHCARDS / STUDY (ROYAL BLUE)
              ======================================== */}
          <div
            id="practice-card-flashcards"
            onClick={() => {
              setSelectedCategory('flashcards');
              setViewMode('subject-select');
            }}
            className="group relative overflow-hidden bg-gradient-to-b from-[#245ad6] via-[#1d4ecc] to-[#153ea8] rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5 select-none min-h-[460px]"
          >
            <div className="space-y-6">
              {/* White Left-Flush Pill Banner */}
              <div className="w-[88%] -ml-6 sm:-ml-7 pl-6 sm:pl-7 pr-6 py-3.5 sm:py-4 bg-white rounded-r-[26px] shadow-xs">
                <h2 className="text-lg sm:text-xl font-normal text-[#1e44a8] leading-snug">
                  {lang === 'km' ? 'បណ្ណចងចាំ' : 'Flashcards'}
                </h2>
                <p className="text-[11px] sm:text-xs font-normal text-[#1e44a8]/80 mt-0.5">
                  {lang === 'km' ? 'ទន្ទេញរូបមន្ត & ពាក្យគន្លឹះ' : 'Formulas & Key Terms'}
                </p>
              </div>

              {/* White Bullet Items with Checkmarks */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3 text-white text-xs sm:text-sm font-normal">
                  <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />
                  <span>{lang === 'km' ? 'ពាក្យគន្លឹះសំខាន់ៗ' : 'Key terms'}</span>
                </div>
                <div className="flex items-center gap-3 text-white text-xs sm:text-sm font-normal">
                  <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />
                  <span>{lang === 'km' ? 'រូបមន្ត' : 'Formulas'}</span>
                </div>
                <div className="flex items-center gap-3 text-white text-xs sm:text-sm font-normal">
                  <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />
                  <span>{lang === 'km' ? 'មេរៀនសង្ខេប' : 'Summary lessons'}</span>
                </div>
              </div>
            </div>

            {/* CTA Outline Pill Button */}
            <div className="pt-8">
              <button
                type="button"
                id="btn-start-flashcards"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCategory('flashcards');
                  setViewMode('subject-select');
                }}
                className="w-full rounded-full border-2 border-white bg-transparent hover:bg-white hover:text-[#1d4ecc] text-white font-normal text-xs sm:text-sm uppercase py-3.5 px-6 text-center transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md active:scale-[0.98]"
              >
                START NOW
              </button>
            </div>
          </div>

          {/* ========================================
              CARD 3 — MOCK EXAM / EXAM (DEEP NAVY BLUE)
              ======================================== */}
          <div
            id="practice-card-mock-exam"
            onClick={() => {
              setSelectedCategory('mock-exam');
              setViewMode('subject-select');
            }}
            className="group relative overflow-hidden bg-gradient-to-b from-[#0c235c] via-[#091b48] to-[#061438] rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5 select-none min-h-[460px]"
          >
            <div className="space-y-6">
              {/* White Left-Flush Pill Banner */}
              <div className="w-[88%] -ml-6 sm:-ml-7 pl-6 sm:pl-7 pr-6 py-3.5 sm:py-4 bg-white rounded-r-[26px] shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-normal text-[#0b1f4f] leading-snug">
                    {lang === 'km' ? 'ការប្រឡងសាកល្បង' : 'Mock Exam'}
                  </h2>
                  <p className="text-[11px] sm:text-xs font-normal text-[#0b1f4f]/80 mt-0.5">
                    {lang === 'km' ? 'វិញ្ញាសាកំណត់ពេលពិត' : 'Timed simulation'}
                  </p>
                </div>
                {overallAvgMock !== null && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shrink-0 shadow-2xs"
                    title={allMockScores.length > 1 ? (lang === 'km' ? 'ពិន្ទុមធ្យម' : 'Average Mock Exam Score') : (lang === 'km' ? 'ពិន្ទុដែលបានធ្វើ' : 'Mock Exam Score')}
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>{overallAvgMock}%</span>
                  </div>
                )}
              </div>

              {/* White Bullet Items with Checkmarks */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3 text-white text-xs sm:text-sm font-normal">
                  <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />
                  <span>{lang === 'km' ? 'កំណត់ពេលវេលាពិត' : 'Timed exam simulation'}</span>
                </div>
                <div className="flex items-center gap-3 text-white text-xs sm:text-sm font-normal">
                  <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />
                  <span>{lang === 'km' ? 'សំណួរច្រើនប្រភេទ' : 'Diverse question types'}</span>
                </div>
                <div className="flex items-center gap-3 text-white text-xs sm:text-sm font-normal">
                  <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />
                  <span>{lang === 'km' ? 'វិភាគសមត្ថភាព' : 'Performance diagnostics'}</span>
                </div>
              </div>

              {/* Saved Score Badge inside Mock Exam Card */}
              {(avgMockR1 !== null || avgMockR2 !== null) && (
                <div className="bg-white/20 backdrop-blur-md border border-white/40 rounded-2xl p-3 sm:p-3.5 space-y-2 text-white shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-300 fill-amber-300" />
                      <span>
                        {lang === 'km'
                          ? (allMockScores.length > 1 ? 'ពិន្ទុមធ្យម (Mock Exam)៖' : 'ពិន្ទុដែលធ្លាប់បានធ្វើ៖')
                          : (allMockScores.length > 1 ? 'Average Mock Score:' : 'Your Mock Score:')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {avgMockR1 !== null && (
                      <span className="text-xs font-bold bg-white text-[#0c235c] px-3 py-1 rounded-xl shadow-xs">
                        {lang === 'km' ? 'ជុំទី ១' : 'Round 1'}: {avgMockR1}%
                      </span>
                    )}
                    {avgMockR2 !== null && (
                      <span className="text-xs font-bold bg-white text-rose-800 px-3 py-1 rounded-xl shadow-xs flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                        <span>{lang === 'km' ? 'ជុំទី ២' : 'Round 2'}: {avgMockR2}%</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Outline Pill Button */}
            <div className="pt-8">
              <button
                type="button"
                id="btn-start-mock-exam"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCategory('mock-exam');
                  setViewMode('subject-select');
                }}
                className="w-full rounded-full border-2 border-white bg-transparent hover:bg-white hover:text-[#0c235c] text-white font-normal text-xs sm:text-sm uppercase py-3.5 px-6 text-center transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md active:scale-[0.98]"
              >
                START NOW
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PracticePage;

