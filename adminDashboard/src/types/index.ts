export type Tab = 'upload' | 'dashboard' | 'prepare-papers' | 'announcements' | 'users' | 'questions' | 'mock-exams' | 'mentors';
export type UploadStatus = 'idle' | 'uploading-storage' | 'saving-db' | 'success' | 'error';

export interface Exam {
  examId: number;
  examName: string;
  examType?: string;
  description?: string;
}

export interface Subject {
  subjectId: number;
  subjectName: string;
  exam?: Exam;
}

export interface PastPaper {
  paperId: number;
  examId?: number;
  subjectId?: number;
  title: string;
  year: number;
  fileUrl: string;
  fileSize?: string;
  paperType?: string;
  totalQuestions?: number;
  hasAnswerKey?: boolean;
  exam?: {
    examId: number;
    examName: string;
    examType?: string;
  };
  subject?: {
    subjectId?: number;
    subjectName: string;
    exam?: {
      examId?: number;
      examName: string;
      examType?: string;
    };
  };
}

export interface AnnouncementItem {
  announcementId: number;
  examId: number;
  title: string;
  summary?: string | null;
  content?: string | null;
  publishDate: string;
  category?: string | null;
  isUrgent: boolean;
  attachments?: any;
  thumbnailUrl?: string | null;
  exam?: {
    examId: number;
    examName: string;
    examType?: string;
  };
}

export interface UserItem {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  role: string;
  avatarUrl?: string | null;
  targetExamId?: number | null;
  targetSubject?: string | null;
  knowledgeLevel?: string | null;
  dailyGoalMinutes?: number;
  streakDays?: number;
  createdAt: string;
  targetExam?: Exam | null;
}

export interface DeadlineInfo {
  dateStr: string;
  formattedDate: string;
  daysRemaining: number;
  status: 'urgent' | 'closing_soon' | 'active' | 'expired';
  label: string;
  badgeBg: string;
  examDate?: string | null;
}

export interface ParsedAnnouncementDetails {
  totalSlots: string | null;
  startingSalary: string | null;
  deadlineDisplay: string | null;
  deadlineDateStr: string | null;
  quotas: Array<{ label: string; count: string }>;
  sourceRef: string | null;
  qrApplyUrl: string | null;
  pdfUrl: string | null;
  requirements: string | null;
  formattedPublishDate: string;
}

/* ---------------- Topics (used to populate Question Bank dropdowns) ---------------- */

export interface TopicItem {
  topicId: number;
  subjectId: number;
  topicName: string;
  description?: string | null;
  subject?: {
    subjectId: number;
    subjectName: string;
    examId?: number;
  };
}

/* ---------------- Question Bank ---------------- */

export interface QuestionOption {
  optionId?: number;
  optionText: string;
  isCorrect: boolean;
}

export interface QuestionItem {
  questionId: number;
  topicId: number;
  topicName?: string;
  subjectId?: number;
  subjectName?: string;
  questionText: string;
  questionType: string;
  difficultyLevel?: string | null;
  correctAnswer?: string | null;
  explanation?: string | null;
  referenceNote?: string | null;
  options: QuestionOption[];
}

/* ---------------- Quizzes ---------------- */

export interface QuizAdminItem {
  quizId: number;
  title: string;
  difficultyLevel?: string | null;
  durationMinutes?: number | null;
  subjectId: number;
  subjectName?: string;
  examId?: number;
  totalQuestions: number;
}

export interface QuizQuestionItem {
  questionId: number;
  topicId?: number;
  topicName?: string;
  subjectId?: number;
  questionText: string;
  questionType: string;
  difficultyLevel?: string | null;
  questionOrder?: number;
  options: { optionId: number; optionText: string }[];
}

export interface QuizAdminDetail extends QuizAdminItem {
  questions: QuizQuestionItem[];
}

/* ---------------- Mock Exams ---------------- */

export interface MockExamAdminItem {
  mockExamId: number;
  title: string;
  description?: string | null;
  year?: number | null;
  durationMinutes?: number | null;
  totalMarks?: number | null;
  passingMarks?: number | null;
  examId: number;
  examName?: string;
  totalQuestions: number;
}

export interface MockExamQuestionItem {
  questionId: number;
  topicId?: number;
  topicName?: string;
  subjectId?: number;
  questionText: string;
  questionType: string;
  difficultyLevel?: string | null;
  questionOrder?: number;
  options: { optionId: number; optionText: string }[];
}

export interface MockExamSectionItem {
  sectionId: number;
  mockExamId?: number;
  subjectId: number;
  subjectName?: string;
  numberOfQuestions?: number;
  questions?: MockExamQuestionItem[];
}

export interface MockExamAdminDetail extends MockExamAdminItem {
  sections: MockExamSectionItem[];
}

/* ---------------- Mentors ---------------- */

export type MentorStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface MentorItem {
  mentorId: number;
  firstName: string;
  lastName: string;
  title?: string | null;
  roleLabel?: string | null;
  avatarUrl?: string | null;
  experienceYears?: number | null;
  rating?: number | null;
  reviewsCount?: number | null;
  studentsTrained?: number | null;
  availability?: string | null;
  bio?: string | null;
  hourlyRate?: string | null;
  socialTelegram?: string | null;
  subjects?: string[] | string | null;
  status: MentorStatus;
  _count?: { mentorBookings: number };
}
