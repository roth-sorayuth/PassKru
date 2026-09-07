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

export type MasteryStateName = 'untouched' | 'learning' | 'developing' | 'proficient' | 'mastered';

export type MasteryCounts = Record<MasteryStateName, number>;

export interface SubjectDonutItem {
  subjectId: number;
  label: string;
  percent: number;
  completed: number;
  total: number;
  // Per-state split behind the donut's single percentage.
  masteryCounts?: MasteryCounts;
  color: string;
}

export interface StrongTopicItem {
  topicId: number;
  topic: string;
  subject: string;
  state: MasteryStateName;
  branch: 'strong' | 'weak' | 'unknown';
  proficiency: number | null;
  attemptCount: number | null;
}

/**
 * Syllabus left to cover against days left before the exam. Null whenever
 * either half is unknown — there's no honest pacing figure without both.
 */
export interface PacingData {
  daysLeft: number;
  topicsRemaining: number;
  topicsPerDay: number;
  onTrack: boolean;
}

export interface TopicMasteryData {
  counts: MasteryCounts;
  total: number;
  strongTopics: StrongTopicItem[];
  pacing: PacingData | null;
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
  // Both sides of the learning loop's Strong/Weak fork. Optional so an older
  // server response still renders the rest of the dashboard.
  topicMastery?: TopicMasteryData;
  aiInsight: AIInsightData;
  streak: StreakData;
  resourceUsage: ResourceUsageItem[];
  studyTimeDistribution: StudyTimeDistributionItem[];
  hasActivePlan: boolean;
  // Null when there's no active course, or the active course is fully complete.
  nextModule: NextModule | null;
  recentAttempts: RecentAttemptItem[];
}
