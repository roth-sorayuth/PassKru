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

export interface DashboardResponseData {
  countdown: CountdownData;
  overallProgress: OverallProgressData;
  examReadiness: ExamReadinessData;
  subjectDonuts: SubjectDonutItem[];
  aiInsight: AIInsightData;
  streak: StreakData;
  resourceUsage: ResourceUsageItem[];
  studyTimeDistribution: StudyTimeDistributionItem[];
}
