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
  statusLabelEn?: string | null;
}

export interface SubjectDonutItem {
  subjectId: number;
  label: string;
  percent: number;
  completed: number;
  total: number;
  color: string;
}

export type WeakAreaSeverity = 'high' | 'medium' | 'low';

export interface WeakAreaInsight {
  subject: string;
  topic: string;
  // Derived from the real severity, not from the item's position in the list.
  severityLevel: WeakAreaSeverity;
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
  // Server-authored labels ship an English twin; DB-sourced ones don't.
  labelEn?: string | null;
  percent: number;
  color: string;
}

export interface StudyTimeDistributionItem {
  label: string;
  labelEn?: string | null;
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
  // Study-plan task id (e.g. "d3-t1") so the dashboard can deep-link to it.
  // Null on older plans whose tasks predate task ids.
  taskId: string | null;
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
