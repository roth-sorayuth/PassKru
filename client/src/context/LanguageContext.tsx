import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

export const translations: Record<string, { km: string; en: string }> = {
  // Brand & General
  appName: { km: 'ប៉ាសគ្រូ (PassKru)', en: 'PassKru' },
  tagline: { km: 'វេទិកាត្រៀមប្រឡងគ្រូបង្រៀនទូទាំងប្រទេសកម្ពុជា', en: 'All-in-One Platform for Cambodian National Teacher Examination' },
  cambodiaMoEYS: { km: 'ស្របតាមកម្មវិធីក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)', en: 'Aligned with Ministry of Education, Youth and Sport Standards' },
  
  // Navigation
  navHome: { km: 'ទំព័រដើម', en: 'Home' },
  navDashboard: { km: 'ផ្ទាំងគ្រប់គ្រង', en: 'Dashboard' },
  navExamInfo: { km: 'ព័ត៌មានប្រឡង', en: 'Exam Info' },
  navRequirements: { km: 'លក្ខខណ្ឌប្រឡង', en: 'Requirements' },
  navLearning: { km: 'មេរៀន និងឯកសារ', en: 'Learning Hub' },
  navPastPapers: { km: 'វិញ្ញាសាចាស់ៗ', en: 'Past Papers' },
  navPractice: { km: 'អនុវត្តលំហាត់', en: 'Practice' },
  navQuiz: { km: 'កម្រងកម្រងសំណួរ (Quiz)', en: 'Quizzes' },
  navMockExam: { km: 'ប្រឡងសាកល្បង', en: 'Mock Exam' },
  navFlashcards: { km: 'បណ្ណចងចាំ (Flashcards)', en: 'Flashcards' },
  navStudyPlan: { km: 'វគ្គសិក្សារបស់ខ្ញុំ', en: 'My Course' },
  navProgress: { km: 'វឌ្ឍនភាព', en: 'Progress' },
  navWeakness: { km: 'វិភាគចំណុចខ្សោយ', en: 'Weak Areas' },
  navMentors: { km: 'គ្រូបង្វឹក (Mentors)', en: 'Mentors' },
  navNotifications: { km: 'ការជូនដំណឹង', en: 'Notifications' },
  navProfile: { km: 'គណនីរបស់ខ្ញុំ', en: 'Profile' },
  
  // Landing Page
  heroTitle: { km: 'ត្រៀមប្រឡងគ្រូបង្រៀនក្របខណ្ឌរដ្ឋ ប្រកបដោយទំនុកចិត្ត និងប្រសិទ្ធភាព', en: 'Prepare Smarter for Your National Teacher Examination' },
  heroSubtitle: { km: 'ប្រមូលផ្តុំព័ត៌មានប្រឡងផ្លូវការ វិញ្ញាសាឆ្នាំចាស់ៗ លំហាត់អនុវត្ត ការប្រឡងសាកល្បង និងផែនការសិក្សាផ្ទាល់ខ្លួនក្នុងវេទិកាតែមួយ។', en: 'PassKru brings official exam updates, past papers with full explanations, interactive practice, mock tests, and personalized study guidance into one platform.' },
  btnStartPrep: { km: 'ចាប់ផ្តើមត្រៀមឥឡូវនេះ', en: 'Start Preparing Now' },
  btnExploreResources: { km: 'ស្វែងរកឯកសារឥតគិតថ្លៃ', en: 'Explore Free Resources' },
  btnTryMockExam: { km: 'សាកល្បងប្រឡង Mock Exam', en: 'Try Mock Exam' },
  
  whyPassKruTitle: { km: 'ហេតុអ្វីជ្រើសរើស PassKru?', en: 'Why Choose PassKru?' },
  whyPassKruSub: { km: 'រចនាឡើងពិសេសសម្រាប់បេក្ខជនប្រឡងគ្រូ NIE, RTTC, PTTC និងមត្តេយ្យ', en: 'Specifically built for Cambodian teacher exam candidates (NIE, RTTC, PTTC, Kindergarten)' },
  
  benefit1Title: { km: 'ព័ត៌មានប្រឡងផ្លូវការ & ឆាប់រហ័ស', en: 'Reliable Exam Announcements' },
  benefit1Desc: { km: 'ទទួលព័ត៌មានកាលបរិច្ឆេទ លក្ខខណ្ឌ និងឯកសារដាក់ពាក្យផ្លូវការពីក្រសួងដោយមិនបារម្ភខកខាន។', en: 'Instant verified notifications on registration dates, guidelines, and document requirements.' },
  
  benefit2Title: { km: 'បណ្តុំវិញ្ញាសា & ចម្លើយពន្យល់ក្បោះក្បាយ', en: 'Organized Learning & Past Papers' },
  benefit2Desc: { km: 'វិញ្ញាសាចាស់ៗពីឆ្នាំ ២០១៨ ដល់ ២០២៥ គ្រប់មុខវិជ្ជា ជាមួយការបកស្រាយគរុកោសល្យច្បាស់លាស់។', en: 'Comprehensive past examination papers (2018-2025) with detailed pedagogical step-by-step solutions.' },
  
  benefit3Title: { km: 'លំហាត់អនុវត្ត & កម្រងសំណួរឆ្លាតវៃ', en: 'Interactive Practice & Quizzes' },
  benefit3Desc: { km: 'ពង្រឹងចំណេះដឹងតាមប្រធានបទ ជាមួយប្រព័ន្ធត្រួតពិនិត្យចម្លើយភ្លាមៗ និងការពន្យល់ស៊ីជម្រៅ។', en: 'Topic-based exercises with real-time feedback, explanations, and bookmarking features.' },
  
  benefit4Title: { km: 'ការប្រឡងសាកល្បងដូចពិតៗ', en: 'Realistic Timed Mock Exams' },
  benefit4Desc: { km: 'កំណត់ពេល និងរចនាសម្ព័ន្ធវិញ្ញាសាដូចការប្រឡងជាក់ស្តែង ដើម្បីហ្វឹកហាត់ផ្លូវចិត្ត និងល្បឿនធ្វើ។', en: 'Simulate real exam pressure, time limits, and scoring formulas to build ultimate exam readiness.' },
  
  benefit5Title: { km: 'ផែនការសិក្សាផ្ទាល់ខ្លួន (AI Plan)', en: 'Personalized Study Plans' },
  benefit5Desc: { km: 'រៀបចំកាលវិភាគស្វ័យប្រវត្តិតាមពេលវេលាដែលអ្នកមាន និងកំណត់គោលដៅមុខវិជ្ជាដែលត្រូវបង្កើនពិន្ទុ។', en: 'Custom daily study checklists tailored to your available hours and target examination category.' },
  
  benefit6Title: { km: 'តាមដានចំណុចខ្សោយ និងវឌ្ឍនភាព', en: 'Weakness Analysis & Progress Tracking' },
  benefit6Desc: { km: 'មើលដឹងច្បាស់ពីប្រធានបទដែលខ្សោយ រួមទាំងការណែនាំលំហាត់ជាក់លាក់ដើម្បីកែលម្អភ្លាមៗ។', en: 'Pinpoint weak topics and receive prioritized study recommendations to boost your passing odds.' },

  howItWorksTitle: { km: 'របៀបរៀន ៣ ជំហានងាយៗ', en: 'How It Works in 3 Simple Steps' },
  step1Title: { km: '១. រៀន (Learn)', en: '1. Learn' },
  step1Desc: { km: 'សិក្សាទ្រឹស្តី គរុកោសល្យ ចិត្តវិទ្យា និងឯកទេសតាមសង្ខេបមេរៀនច្បាស់ៗ។', en: 'Review core pedagogy, educational psychology, general culture, and specialized subjects.' },
  step2Title: { km: '២. អនុវត្ត (Practice)', en: '2. Practice' },
  step2Desc: { km: 'ធ្វើលំហាត់តាមប្រធានបទ វិញ្ញាសាចាស់ៗ និងប្រឡងសាកល្បងកំណត់ម៉ោង។', en: 'Solve topic quizzes, previous exam papers, and time-restricted full mock simulations.' },
  step3Title: { km: '៣. កែលម្អ (Improve)', en: '3. Improve' },
  step3Desc: { km: 'វិភាគចំណុចខ្សោយ និងទទួលការណែនាំពីគ្រូបង្វឹកជើងចាស់ដើម្បីជោគជ័យ។', en: 'Identify your gaps, follow daily customized action tasks, and consult verified teacher mentors.' },

  // Exam Targets
  examTargetNIE: { km: 'វិទ្យាស្ថានជាតិអប់រំ (NIE - គ្រូវិទ្យាល័យ)', en: 'National Institute of Education (NIE - Upper Secondary)' },
  examTargetRTTC: { km: 'គរុកោសល្យភូមិភាគ (RTTC - គ្រូអនុវិទ្យាល័យ)', en: 'Regional Teacher Training Center (RTTC - Lower Secondary)' },
  examTargetPTTC: { km: 'គរុកោសល្យរាជធានី-ខេត្ត (PTTC - គ្រូបឋម)', en: 'Provincial Teacher Training Center (PTTC - Primary)' },
  examTargetKindergarten: { km: 'គរុកោសល្យមត្តេយ្យ (គ្រូមត្តេយ្យ)', en: 'Preschool Teacher Training Center (Kindergarten)' },

  // Dashboard specifics
  daysRemainingLabel: { km: 'ថ្ងៃនៅសល់ដល់ថ្ងៃប្រឡង', en: 'Days Remaining Until Exam' },
  todayStudyPlan: { km: 'បន្ទាប់ត្រូវធ្វើ', en: 'Next Up' },
  recentScore: { km: 'ពិន្ទុ Mock ចុងក្រោយ', en: 'Latest Mock Score' },
  studyStreak: { km: 'ថ្ងៃរៀនជាប់គ្នា', en: 'Study Streak' },
  weakTopicsAlert: { km: 'ប្រធានបទត្រូវការកែលម្អជាបន្ទាន់', en: 'Weak Topics Needing Immediate Focus' },
  recommendedForYou: { km: 'អនុសាសន៍សម្រាប់អ្នកថ្ងៃនេះ', en: 'Recommended For You Today' },
  quickPractice: { km: 'ចាប់ផ្តើមអនុវត្តរហ័ស', en: 'Quick Practice' },
  enterMockExam: { km: 'ចូលរួមប្រឡងសាកល្បង', en: 'Take Full Mock Exam' },

  // Actions
  viewDetails: { km: 'មើលលម្អិត', en: 'View Details' },
  practiceNow: { km: 'អនុវត្តឥឡូវនេះ', en: 'Practice Now' },
  startQuiz: { km: 'ចាប់ផ្តើមកម្រងសំណួរ', en: 'Start Quiz' },
  startExam: { km: 'ចាប់ផ្តើមប្រឡង', en: 'Start Exam' },
  submitAnswer: { km: 'បញ្ជាក់ចម្លើយ', en: 'Submit Answer' },
  submitExam: { km: 'ប្រគល់វិញ្ញាសាប្រឡង', en: 'Submit Exam Paper' },
  nextQuestion: { km: 'សំណួរបន្ទាប់', en: 'Next Question' },
  prevQuestion: { km: 'សំណួរមុន', en: 'Previous Question' },
  explanation: { km: 'ការពន្យល់ចម្លើយត្រឹមត្រូវ', en: 'Answer Explanation' },
  markForReview: { km: 'ចំណាំទុកត្រួតពិនិត្យពេលក្រោយ', en: 'Mark for Review' },
  allQuestions: { km: 'សំណួរទាំងអស់', en: 'All Questions' },
  downloadPdf: { km: 'ទាញយកឯកសារ PDF', en: 'Download PDF Paper' },
  viewAnswerKey: { km: 'មើលគន្លឹះចម្លើយ', en: 'View Answer Key' },
  bookConsultation: { km: 'ណាត់ជួបគ្រូបង្វឹក', en: 'Book Consultation' },

  // Stats
  totalCandidates: { km: 'បេក្ខជនរៀបចំប្រឡង', en: 'Active Candidates' },
  successRate: { km: 'អត្រាប្រឡងជាប់គរុ', en: 'Target Pass Rate' },
  verifiedQuestions: { km: 'សំណួរវិញ្ញាសាមានចម្លើយ', en: 'Verified Questions & Solutions' },
  experiencedMentors: { km: 'គ្រូបង្វឹកជើងចាស់', en: 'Experienced Mentors' },

  // Common UI
  searchPlaceholder: { km: 'ស្វែងរកវិញ្ញាសា មេរៀន ឬប្រធានបទ...', en: 'Search past papers, topics, subjects...' },
  filterBySubject: { km: 'តម្រៀបតាមមុខវិជ្ជា', en: 'Filter by Subject' },
  filterByYear: { km: 'តម្រៀបតាមឆ្នាំ', en: 'Filter by Year' },
  filterByCategory: { km: 'តម្រៀបតាមប្រភេទ', en: 'Filter by Category' },
  allSubjects: { km: 'គ្រប់មុខវិជ្ជា', en: 'All Subjects' },
  allYears: { km: 'គ្រប់ឆ្នាំ', en: 'All Years' },
  allCategories: { km: 'គ្រប់ប្រភេទ', en: 'All Categories' },
  saveBookmark: { km: 'រក្សាទុក', en: 'Bookmark' },
  saved: { km: 'បានរក្សាទុក', en: 'Saved' },
  completed: { km: 'បានបញ្ចប់', en: 'Completed' },
  pending: { km: 'មិនទាន់ធ្វើ', en: 'Pending' },
  correct: { km: 'ត្រឹមត្រូវ!', en: 'Correct!' },
  incorrect: { km: 'មិនទាន់ត្រឹមត្រូវទេ', en: 'Incorrect' },
  accuracy: { km: 'ភាពត្រឹមត្រូវ', en: 'Accuracy' },
  timeSpent: { km: 'រយៈពេលចំណាយ', en: 'Time Spent' },
  overallScore: { km: 'ពិន្ទុសរុប', en: 'Overall Score' },
  passed: { km: 'ជាប់កម្រិតស្តង់ដារ', en: 'Qualified' },
  needImprovement: { km: 'ត្រូវខិតខំបន្ថែម', en: 'Needs Improvement' },
  retry: { km: 'សាកល្បងម្តងទៀត', en: 'Try Again' },
  backToDashboard: { km: 'ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង', en: 'Back to Dashboard' },
  close: { km: 'បិទ', en: 'Close' },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'km',
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('passkru_lang');
    return (saved === 'en' || saved === 'km') ? saved : 'km';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('passkru_lang', newLang);
    document.documentElement.lang = newLang;
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][lang] || translations[key].km || key;
    }
    return key;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
