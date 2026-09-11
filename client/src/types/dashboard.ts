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

export interface StreakData {
  streakDays: number;
}

/**
 * GET /progress/dashboard. The state-driven fields are optional so the page
 * still renders against a server that predates them — see types/aiStudyPlan.ts.
 * Study history is not in here; it is paged from GET /progress/activity.
 */
export interface DashboardResponseData extends Partial<import('./aiStudyPlan').DashboardV2Fields> {
  // Null when no real exam date is known yet — never a fabricated fallback date.
  countdown: CountdownData | null;
  overallProgress: OverallProgressData;
  examReadiness: ExamReadinessData;
  /** Average of the last 10 scored attempts. */
  averageScore: number;
  streak: StreakData;
  hasActivePlan: boolean;
}
