export type Language = 'km' | 'en';

export type ExamTarget = 'nie' | 'rttc' | 'pttc' | 'kindergarten';

export interface UserProfile {
  name: string;
  avatar: string;
  targetExam: ExamTarget;
  targetSubject: string;
  dailyGoalMinutes: number;
  streakDays: number;
  completedQuestions: number;
  averageScore: number;
  studyHoursTotal: number;
  role?: string;
}

export interface Announcement {
  id: string;
  title: { km: string; en: string };
  category: 'recruitment' | 'schedule' | 'eligibility' | 'result' | 'guideline';
  date: string;
  isUrgent?: boolean;
  summary: { km: string; en: string };
  content: { km: string; en: string };
  targetExam: ExamTarget[];
  attachedPdfs?: { name: string; size: string; pages: number }[];
  importantDates?: { label: { km: string; en: string }; date: string }[];
}

export interface Question {
  id: string;
  subject: string;
  subjectKm: string;
  topic: string;
  topicKm: string;
  year?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  question: { km: string; en: string };
  options: { id: string; text: { km: string; en: string } }[];
  correctAnswerId: string;
  explanation: { km: string; en: string };
  reference?: string;
}

export interface Quiz {
  id: string;
  title: { km: string; en: string };
  subject: string;
  subjectKm: string;
  topic: string;
  topicKm: string;
  targetExam: ExamTarget[];
  questionsCount: number;
  durationMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
}

export interface MockExam {
  id: string;
  title: { km: string; en: string };
  description?: { km: string; en: string };
  targetExam: ExamTarget;
  subject: string;
  subjectKm: string;
  year: number;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  instructions: { km: string[]; en: string[] };
  questions: Question[];
}

export interface PastPaper {
  id: string;
  title: { km: string; en: string };
  targetExam: ExamTarget;
  subject: string;
  subjectKm: string;
  year: number;
  session?: string;
  fileSize: string;
  hasAnswerKey: boolean;
  totalQuestions: number;
  downloadUrl?: string;
  questions?: Question[];
}

export interface Flashcard {
  id: string;
  subject: string;
  subjectKm: string;
  category: string;
  front: { km: string; en: string };
  back: { km: string; en: string };
  hint?: { km: string; en: string };
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface StudyTask {
  id: string;
  title: { km: string; en: string };
  subject: string;
  subjectKm: string;
  topic: string;
  estimatedMinutes: number;
  completed: boolean;
  type: 'read' | 'practice' | 'quiz' | 'mock';
  targetAction?: string;
}

export interface WeakArea {
  id: string;
  subject: string;
  subjectKm: string;
  topic: string;
  topicKm: string;
  accuracyRate: number; // e.g. 42%
  priority: 'high' | 'medium' | 'low';
  failedQuestionsCount: number;
  recommendation: { km: string; en: string };
  actionQuizId?: string;
  actionReadTopic?: string;
}

export interface Mentor {
  id: string;
  name: { km: string; en: string };
  title: { km: string; en: string };
  role: { km: string; en: string };
  avatar: string;
  subjects: { km: string; en: string }[];
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  studentsTrained: number;
  availability: { km: string; en: string };
  bio: { km: string; en: string };
  badges: { km: string; en: string }[];
  hourlyRate?: string;
  socialTelegram?: string;
}

export interface StudyPlanTask {
  id: string;
  type: 'read' | 'quiz' | 'practice' | 'mock' | 'flashcards';
  targetAction: 'learning' | 'quiz' | 'past-papers' | 'flashcards' | 'mock-exam';
  subjectId: number | null;
  subjectName: string;
  topicId: number | null;
  topicName: string;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
  completedAt: string | null;
}

export interface StudyPlanDay {
  date: string;
  dayIndex: number;
  dayType: 'read' | 'quiz' | 'practice' | 'mock' | 'review';
  tasks: StudyPlanTask[];
}

export interface StudyPlanItems {
  algorithmVersion: string;
  generatedAt: string;
  examDate: string | null;
  dailyGoalMinutes: number;
  knowledgeLevel: string;
  days: StudyPlanDay[];
}

export interface StudyPlanRecord {
  planId: number;
  userId: number;
  startDate: string;
  endDate: string | null;
  status: string;
  items: StudyPlanItems;
}

export interface DashboardSummary {
  profile: {
    streakDays: number;
    averageScore: number;
    studyHoursTotal: number;
    completedQuestions: number;
    dailyGoalMinutes: number;
    targetExamName: string | null;
  };
  examCountdown: { days: number; hours: number; minutes: number; isPast: boolean } | null;
  studyPlan: {
    hasActivePlan: boolean;
    planId: number | null;
    totalTasks: number;
    completedTasks: number;
    percent: number;
    todayTotalTasks: number;
    todayCompletedTasks: number;
    todayPercent: number;
    todayDate: string | null;
    todayTasks: StudyPlanTask[];
  };
  subjectProficiency: {
    subjectId: number;
    subjectName: string;
    proficiency: number;
    topicsTracked: number;
    topicsTotal: number;
  }[];
  weakAreas: {
    weakAreaId: number;
    subjectName: string;
    topicName: string;
    accuracyRate: number | null;
    priority: string | null;
    failedQuestionsCount: number;
    recommendation: string | null;
  }[];
  recentAttempts: {
    attemptId: number;
    attemptType: string;
    title: string;
    score: number | null;
    startTime: string | null;
    endTime: string | null;
  }[];
  weeklyActivity: { date: string; active: boolean; isToday: boolean }[];
}

export interface AppNotification {
  id: string;
  title: { km: string; en: string };
  message: { km: string; en: string };
  category: 'announcement' | 'exam' | 'reminder' | 'result' | 'tip';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}
