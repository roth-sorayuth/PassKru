export type Tab = 'upload' | 'dashboard' | 'prepare-papers' | 'announcements' | 'users';
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
  title: string;
  year: number;
  fileUrl: string;
  fileSize?: string;
  paperType?: string;
  totalQuestions?: number;
  hasAnswerKey?: boolean;
  subject?: {
    subjectName: string;
    exam?: {
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
