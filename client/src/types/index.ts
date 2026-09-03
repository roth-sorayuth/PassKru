export type Language = 'km' | 'en';

export type ExamTarget = 'nie' | 'rttc' | 'pttc' | 'kindergarten';

export interface UserProfile {
  name: string;
  email: string;
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
  id?: string | number;
  mentorId?: number;
  firstName?: string;
  lastName?: string;
  name?: { km: string; en: string } | string;
  title: { km: string; en: string } | string;
  role?: { km: string; en: string } | string;
  roleLabel?: string;
  avatar?: string;
  avatarUrl?: string;
  subjects?: ({ km?: string; en?: string } | string)[];
  experienceYears?: number;
  rating?: number | string;
  reviewsCount?: number;
  studentsTrained?: number;
  availability?: { km: string; en: string } | string;
  bio?: { km: string; en: string } | string;
  badges?: { km: string; en: string }[] | string[];
  hourlyRate?: string;
  socialTelegram?: string;
  _count?: {
    mentorBookings?: number;
  };
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
  // Real content the backend matched this task to (subject-level, from
  // preparation papers — never past-exam papers — quizzes and mock exams).
  // Absent when no matching content exists yet for that subject.
  paperId?: number;
  paperTitle?: string;
  fileUrl?: string | null;
  quizId?: number;
  mockExamId?: number;
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

export interface StudyPlanNextUpEntry {
  task: StudyPlanTask;
  dayDate: string;
}

export interface StudyPlanRecord {
  planId: number;
  userId: number;
  startDate: string;
  endDate: string | null;
  status: string;
  items: StudyPlanItems;
  // Live-ranked incomplete tasks (current weak-area/proficiency state, not
  // the static generation-time order) — only present on the active plan
  // returned by GET /study-plan, not on history entries.
  nextUp?: StudyPlanNextUpEntry[];
}

export interface AppNotification {
  id: string;
  title: { km: string; en: string };
  message: { km: string; en: string };
  category?: 'announcement' | 'exam' | 'reminder' | 'result' | 'tip';
  type?: 'announcement' | 'exam' | 'reminder' | 'result' | 'tip';
  timestamp: string;
  isRead?: boolean;
  read?: boolean;
  actionUrl?: string;
  linkToPage?: string;
  targetId?: string;
}
