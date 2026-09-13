/**
 * API contract for the AI study plan: placement test → one-month plan built
 * only from real quizzes, practice (mock exams) and papers → Saturday mistake
 * review → weekly AI update. The server implements these shapes; every field
 * is something the database can actually produce.
 */

export type KnowledgeLevel = 'beginner' | 'intermediate' | 'advanced';

/* ------------------------------------------------------------ placement -- */

export interface PlacementOption {
  optionId: number;
  optionText: string;
}

export interface PlacementQuestion {
  questionId: number;
  questionText: string;
  subjectName: string;
  topicName: string;
  options: PlacementOption[];
}

export interface PlacementTopicScore {
  topicId: number;
  topicName: string;
  subjectName: string;
  correct: number;
  total: number;
  percent: number;
}

export interface PlacementResult {
  attemptId: number;
  correct: number;
  total: number;
  percent: number;
  level: KnowledgeLevel;
  /** Average seconds per question = attempt duration / questions. */
  secondsPerQuestion: number | null;
  topicScores: PlacementTopicScore[];
  weakTopics: (PlacementTopicScore & { reason: string })[];
  /** Mistake patterns the AI read from the wrong options chosen. Empty without AI. */
  patterns: string[];
}

export interface PlacementStatus {
  status: 'none' | 'in-progress' | 'completed';
  attemptId: number | null;
  result: PlacementResult | null;
  /** What the next test covers; only sent while no test has started. */
  preview?: PlacementPreview | null;
}

export interface PlacementPreview {
  /** Questions the test will have (can be under maxSize when the bank is small). */
  size: number;
  maxSize: number;
  minutes: number;
  subjects: {
    subjectId: number;
    subjectName: string;
    role: 'major' | 'core' | 'subject';
    /** Gradable questions for this subject in the bank. */
    available: number;
    /** How many of the test's questions come from it. */
    planned: number;
  }[];
  missingMajors: string[];
  usedAllSubjects: boolean;
}

export interface PlacementSession {
  attemptId: number;
  durationMinutes: number;
  startedAt: string;
  questions: PlacementQuestion[];
  /** Answers already saved, so a paused test resumes where it stopped. */
  savedAnswers: Record<number, number>;
}

/* ----------------------------------------------------------------- plan -- */

export type PlanTaskType = 'quiz' | 'practice' | 'paper' | 'review';

export interface PlanTask {
  id: string;
  type: PlanTaskType;
  title: string;
  estimatedMinutes: number;
  /** Why this task is here, in the candidate's language. */
  reason: string;
  completed: boolean;
  completedAt: string | null;
  subjectName?: string | null;
  questionCount?: number | null;
  quizId?: number | null;
  mockExamId?: number | null;
  paperId?: number | null;
  paperType?: 'past-paper' | 'prepare-paper' | null;
  fileUrl?: string | null;
  hasAnswerKey?: boolean | null;
}

export interface PlanDay {
  date: string;
  dayIndex: number;
  weekIndex: number;
  dayType: 'study' | 'review' | 'rest';
  tasks: PlanTask[];
}

export interface PlanWeek {
  weekIndex: number;
  startDate: string;
  endDate: string;
  goal: string;
  target: string;
  /** Weeks after the current one are drafts the AI revises each Saturday. */
  status: 'done' | 'active' | 'draft';
}

export interface PlanDecision {
  label: string;
  value: string;
  note: string;
}

export interface PlanSummary {
  text: string;
  decisions: PlanDecision[];
  content: { quizzes: number; practice: number; papers: number };
}

export interface AIStudyPlanItems {
  version: 2;
  algorithmVersion: string;
  generatedAt: string;
  level: KnowledgeLevel;
  dailyGoalMinutes: number;
  targetSubjects: string[];
  summary: PlanSummary;
  weeks: PlanWeek[];
  days: PlanDay[];
}

export interface AIStudyPlan {
  planId: number;
  startDate: string;
  endDate: string | null;
  status: string;
  items: AIStudyPlanItems;
}

/* --------------------------------------------------------- weekly review -- */

export interface ReviewMistake {
  questionId: number;
  questionText: string;
  subjectName: string;
  topicName: string;
  answeredAt: string;
  source: 'quiz' | 'practice';
  options: PlacementOption[];
  selectedOptionId: number | null;
  correctOptionId: number;
  explanation: string | null;
}

export interface WeeklyReview {
  weekIndex: number;
  weekStart: string;
  weekEnd: string;
  total: number;
  byTopic: { topicName: string; subjectName: string; count: number }[];
  mistakes: ReviewMistake[];
}

export interface WeeklyReviewResult {
  total: number;
  correct: number;
  clearedQuestionIds: number[];
}

/* --------------------------------------------------------- weekly update -- */

export interface WeeklyFinding {
  topicName: string;
  subjectName: string;
  before: number;
  after: number;
  note: string;
}

export interface WeeklyChange {
  kind: 'add' | 'cut' | 'tune';
  what: string;
  detail: string;
  why: string;
}

export interface WeeklyUpdate {
  updateId: string;
  weekIndex: number;
  createdAt: string;
  basis: string;
  findings: WeeklyFinding[];
  pattern: string | null;
  changes: WeeklyChange[];
  readiness: { before: number; after: number };
  weakTopics: { before: number; after: number };
  status: 'pending' | 'accepted' | 'kept';
  /** When a pending update applies by itself if the candidate does nothing. */
  autoApplyAt: string;
}

/* ------------------------------------------------------------ dashboard -- */

export type DashboardState = 'new' | 'weekday' | 'saturday' | 'month-end';

export interface TopicScoreGroup {
  subjectName: string;
  isCore: boolean;
  topics: { topicId: number; topicName: string; percent: number }[];
}

export interface WeekProgress {
  weekIndex: number;
  totalWeeks: number;
  startDate: string;
  endDate: string;
  goal: string;
  /** Tasks ticked in this plan week, of all tasks scheduled for it. */
  done: number;
  total: number;
}

export interface DashboardV2Fields {
  state: DashboardState;
  weekIndex: number | null;
  weekProgress: WeekProgress | null;
  readinessDelta: number | null;
  today: { date: string; dayType: PlanDay['dayType']; tasks: PlanTask[]; planId: number } | null;
  weeklyMistakes: { total: number; byTopic: { topicName: string; count: number }[] } | null;
  dailyGoalMinutes: number;
  topicScores: TopicScoreGroup[];
  /** Content in the database for the candidate's subjects (shown before the first test). */
  contentAvailable: { quizzes: number; practice: number; papers: number } | null;
}

/* ------------------------------------------------------ activity history -- */

export type ActivityKind = 'quiz' | 'practice' | 'placement' | 'review' | 'paper' | 'plan';

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  /** ISO time the activity finished. */
  at: string;
  title: string | null;
  subjectName?: string | null;
  /** Scored attempts only. */
  attemptId?: number;
  score?: number | null;
  correct?: number;
  total?: number;
  durationMinutes?: number | null;
  fileUrl?: string | null;
  level?: KnowledgeLevel | null;
  planId?: number;
  active?: boolean;
}

export interface ActivityPage {
  items: ActivityItem[];
  /** Pass as `before` to load the next (older) page; null when there is no more. */
  nextCursor: string | null;
}

/** GET /attempts/:id — a finished attempt with every answer. */
export interface AttemptReview {
  attemptId: number;
  attemptType: string;
  title: string;
  score: number | null;
  startTime: string | null;
  endTime: string | null;
  answers: {
    questionId: number;
    questionText: string;
    topicName: string | null;
    explanation: string | null;
    selectedOptionId: number | null;
    isCorrect: boolean | null;
    options: { optionId: number; optionText: string; isCorrect: boolean }[];
  }[];
}

/* ------------------------------------------------------------- my plans -- */

export interface MyPlan {
  planId: number;
  /** active: being studied · paused: kept, can be continued · archived: finished or replaced · cancelled: stopped by the candidate */
  status: 'active' | 'paused' | 'archived' | 'cancelled';
  cancelledAt?: string | null;
  examCode: string | null;
  targetSubjects: string[];
  level: KnowledgeLevel | null;
  generatedAt: string | null;
  startDate: string;
  endDate: string;
  finished: boolean;
  pausedAt: string | null;
  weekIndex: number | null;
  totalWeeks: number;
  tasksDone: number;
  tasksTotal: number;
  /** Made for the level and subjects the candidate has selected right now. */
  matchesSelection: boolean;
}
