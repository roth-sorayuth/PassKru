export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
}

export interface OverallProgressData {
  percent: number;
  lessonsCompleted: number;
  totalLessons: number;
  remaining: number;
}

export interface ExamReadinessData {
  score: number;
  maxScore: number;
  statusLabel: string;
}

export interface SubjectDonutItem {
  subjectId: number;
  label: string;
  percent: number;
  completed: number;
  total: number;
  color: string;
}

export interface WeakAreaInsight {
  subject: string;
  topic: string;
  color: string;
}

export interface AIInsightData {
  accuracy: number;
  weeklyChange: number;
  weakAreas: WeakAreaInsight[];
}

export interface StreakData {
  streakDays: number;
  activeDayIndices: number[];
}

export interface ResourceUsageItem {
  label: string;
  percent: number;
  color: string;
}

export interface StudyTimeDistributionItem {
  label: string;
  percent: number;
  hours: number;
  color: string;
  strokeOffset: number;
}

export interface RecentAttemptItem {
  attemptId: number;
  attemptType: string;
  title: string;
  score: number | null;
  startTime: string | null;
  endTime: string | null;
}

export interface NextModule {
  title: string;
  type: string;
  subjectName: string;
  topicName: string;
}

export interface DashboardResponseData {
  // Null when no real exam date is known yet (e.g. no official announcement
  // this year) — never a fabricated fallback date.
  countdown: CountdownData | null;
  overallProgress: OverallProgressData;
  examReadiness: ExamReadinessData;
  subjectDonuts: SubjectDonutItem[];
  aiInsight: AIInsightData;
  streak: StreakData;
  resourceUsage: ResourceUsageItem[];
  studyTimeDistribution: StudyTimeDistributionItem[];
  hasActivePlan: boolean;
  // Null when there's no active course, or the active course is fully complete.
  nextModule: NextModule | null;
  recentAttempts: RecentAttemptItem[];
}
