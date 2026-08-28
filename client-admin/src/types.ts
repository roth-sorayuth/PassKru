export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'OUTDATED' | 'DRAFT' | 'PUBLISHED' | 'REJECTED';

export type ExamTargetLevel = 
  | 'NIE_HIGH_SCHOOL' // គ្រូមធ្យមសិក្សាទុតិយភូមិ (វិទ្យាល័យ - NIE)
  | 'BASIC_SECONDARY' // គ្រូមធ្យមសិក្សាបឋមភូមិ (អនុវិទ្យាល័យ - 12+2 / 12+4)
  | 'PRIMARY_SCHOOL' // គ្រូបឋមសិក្សា
  | 'KINDERGARTEN' // គ្រូមត្តេយ្យសិក្សា
  | 'HIGHER_ED'; // សាស្ត្រាចារ្យឧត្តមសិក្សា

export type SubjectCategory = 
  | 'GENERAL_CULTURE' // វប្បធម៌ទូទៅ
  | 'PEDAGOGY' // គរុកោសល្យ និងវិធីសាស្ត្របង្រៀន
  | 'EDUCATION_LAW' // ច្បាប់ស្តីពីការអប់រំ និងបទដ្ឋានគតិយុត្ត
  | 'KHMER_LIT' // អក្សរសាស្ត្រខ្មែរ
  | 'MATH' // គណិតវិទ្យា
  | 'PHYSICS' // រូបវិទ្យា
  | 'CHEMISTRY' // គីមីវិទ្យា
  | 'BIOLOGY' // ជីវវិទ្យា
  | 'HISTORY' // ប្រវត្តិវិទ្យា
  | 'GEOGRAPHY' // ភូមិវិទ្យា
  | 'MORALITY_CIVICS' // សីលធម៌-ពលរដ្ឋវិជ្ជា
  | 'ENGLISH' // ភាសាអង់គ្លេស
  | 'FRENCH' // ភាសាបារាំង
  | 'ICT_TECH'; // បច្ចេកវិទ្យា និងព័ត៌មានវិទ្យា

export type QuestionType = 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'VERY_HARD';

export type UserRole = 'CANDIDATE' | 'MENTOR' | 'ADMIN' | 'SUPER_ADMIN';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'BLOCKED';

export interface User {
  id: string;
  nameKhmer: string;
  nameLatin: string;
  phone: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  province: string; // e.g. រាជធានីភ្នំពេញ, ខេត្តកណ្ដាល, ខេត្តសៀមរាប, ខេត្តបាត់ដំបង
  targetExam?: ExamTargetLevel;
  registeredDate: string;
  lastActive: string;
  // Candidate specifics
  completedQuizzesCount?: number;
  mockExamAverageScore?: number;
  studyStreakDays?: number;
  // Mentor specifics
  mentorSpecialty?: SubjectCategory[];
  mentorDegree?: string; // e.g. បរិញ្ញាបត្រជាន់ខ្ពស់គរុកោសល្យ (NIE), បរិញ្ញាបត្រគណិតវិទ្យា RUPP
  mentorWorkplace?: string; // e.g. វិទ្យាល័យព្រះស៊ីសុវត្ថិ, វិទ្យាស្ថានជាតិអប់រំ (NIE)
  mentorVerifiedDate?: string;
  mentorVerificationDocUrl?: string;
  mentorRating?: number;
  mentoredCandidatesCount?: number;
}

export interface ExamInfo {
  id: string;
  moeysCode: string; // e.g. MoEYS-2026-NIE-01
  titleKhmer: string;
  titleLatin: string;
  level: ExamTargetLevel;
  academicYear: string;
  quotaSeats: number; // ចំនួនក្របខណ្ឌជ្រើសរើស (e.g. 350 នាក់)
  applicationStartDate: string;
  applicationEndDate: string;
  examDate: string;
  resultsDate?: string;
  verificationStatus: VerificationStatus;
  isOutdated: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  location: string; // មណ្ឌលប្រឡង e.g. វិទ្យាល័យជាស៊ីមសន្ធរម៉ុក, វិទ្យាស្ថានជាតិអប់រំ
  eligibilityRequirements: string[];
  requiredDocuments: string[];
  subjects: {
    subject: SubjectCategory;
    durationMinutes: number;
    coefficient: number; // មេគុណ
    maxScore: number;
  }[];
  officialCircularUrl?: string; // លិខិតប្រកាសផ្លូវការ
  verifiedBy?: string;
  verifiedAt?: string;
  lastUpdated: string;
}

export interface Announcement {
  id: string;
  referenceNumber?: string; // លេខលិខិតផ្លូវការ
  title: string;
  summary: string;
  content: string;
  category: 'EXAM_DATE' | 'REGISTRATION' | 'RESULT' | 'REGULATION' | 'GENERAL';
  priority: 'URGENT' | 'IMPORTANT' | 'NORMAL';
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  publishDate: string;
  isPinned: boolean;
  targetAudience: ExamTargetLevel[] | 'ALL';
  attachmentUrl?: string;
  attachmentName?: string;
  viewsCount: number;
  author: string;
}

export interface PastPaper {
  id: string;
  title: string;
  examLevel: ExamTargetLevel;
  subject: SubjectCategory;
  year: number;
  session?: string; // សម័យប្រឡង e.g. សម័យប្រឡង៖ ២៥ តុលា ២០២៤
  fileSize: string;
  pageCount: number;
  downloadCount: number;
  verificationStatus: VerificationStatus;
  sourceType: 'MOEYS_OFFICIAL' | 'NIE_INTERNAL' | 'PASSKRU_ORIGINAL';
  hasAnswerKey: boolean;
  hasDetailedExplanation: boolean;
  copyrightStatus: 'PUBLIC_DOMAIN_GOV' | 'FAIR_USE_EDUCATIONAL' | 'PASSKRU_EXCLUSIVE';
  uploadedAt: string;
  uploadedBy: string;
  fileUrl?: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  subject: SubjectCategory;
  targetLevel: ExamTargetLevel;
  resourceType: 'PDF_SUMMARY' | 'PEDAGOGY_GUIDE' | 'AUDIO_LECTURE' | 'INFOGRAPHIC' | 'CHEL_CHEAT';
  topic: string;
  fileSize: string;
  verificationStatus: VerificationStatus;
  downloadCount: number;
  author: string;
  uploadedAt: string;
  tags: string[];
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  code: string; // e.g. Q-PED-2026-089
  statement: string;
  type: QuestionType;
  options: QuestionOption[];
  correctAnswerText?: string; // for short answer / essay
  explanationKhmer: string; // ការពន្យល់ក្បោះក្បាយ
  pedagogicalReference?: string; // ឯកសារយោង (e.g. សៀវភៅគរុកោសល្យទូទៅ ទំព័រ ៤៥)
  subject: SubjectCategory;
  topic: string;
  targetLevel: ExamTargetLevel;
  difficulty: DifficultyLevel;
  verificationStatus: VerificationStatus;
  usageCountInExams: number;
  correctRatePercentage: number; // អត្រាឆ្លើយត្រូវរបស់បេក្ខជន (%)
  createdAt: string;
  createdBy: string;
  lastUpdated: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: SubjectCategory;
  targetLevel: ExamTargetLevel;
  questionCount: number;
  timeLimitMinutes: number;
  passingScorePercentage: number;
  difficulty: DifficultyLevel;
  questionIds: string[];
  status: 'PUBLISHED' | 'DRAFT';
  participationsCount: number;
  averageScorePercentage: number;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  deckId: string;
  frontKhmer: string; // សំណួរ ឬពាក្យគន្លឹះ
  backKhmer: string; // ចម្លើយ ឬនិយមន័យ
  hint?: string;
  subject: SubjectCategory;
  topic: string;
  difficulty: DifficultyLevel;
  masteryRatePercentage: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  subject: SubjectCategory;
  targetLevel: ExamTargetLevel;
  cardCount: number;
  viewsCount: number;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
}

export interface MockExam {
  id: string;
  code: string; // e.g. MOCK-NIE-2026-V1
  title: string;
  targetLevel: ExamTargetLevel;
  academicYear: string;
  durationMinutes: number;
  totalQuestions: number;
  maxScore: number;
  passScore: number;
  subjectsBreakdown: {
    subject: SubjectCategory;
    questionCount: number;
    pointsPerQuestion: number;
  }[];
  questionIds: string[];
  status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED';
  verificationStatus: VerificationStatus;
  scheduledPublishDate?: string;
  takersCount: number;
  passRatePercentage: number;
  averageScore: number;
  createdAt: string;
  instructions: string[];
}

export interface VerificationItem {
  id: string;
  type: 'EXAM_INFO' | 'ANNOUNCEMENT' | 'QUESTION' | 'MATERIAL' | 'MENTOR_PROFILE';
  title: string;
  submittedBy: string;
  submittedRole: string;
  submittedDate: string;
  status: VerificationStatus;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  categoryKhmer: string;
  reviewNotes?: string;
  itemDataId: string;
  flagReason?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  targetGroup: 'ALL_CANDIDATES' | 'NIE_CANDIDATES' | 'PRIMARY_CANDIDATES' | 'ALL_MENTORS';
  channel: 'PUSH_AND_INAPP' | 'INAPP_ONLY' | 'URGENT_POPUP';
  status: 'SENT' | 'SCHEDULED' | 'DRAFT';
  scheduledTime?: string;
  sentTime?: string;
  recipientCount: number;
  openRatePercentage: number;
  createdBy: string;
}

export interface AdminActivityLog {
  id: string;
  adminName: string;
  adminRole: string;
  action: 'VERIFIED' | 'CREATED' | 'UPDATED' | 'DELETED' | 'PUBLISHED' | 'REJECTED' | 'OUTDATED_FLAG';
  targetType: string;
  targetTitle: string;
  timestamp: string;
  details?: string;
}

export type AdminTab = 
  | 'dashboard' 
  | 'users' 
  | 'exams' 
  | 'announcements' 
  | 'materials' 
  | 'question-bank' 
  | 'quizzes-flashcards' 
  | 'mock-exams' 
  | 'verification-center' 
  | 'notifications' 
  | 'analytics';
