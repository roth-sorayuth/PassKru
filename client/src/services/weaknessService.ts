import { api } from '../utils/api';

export interface WeakAreaApi {
  weakAreaId: number;
  topicId: number;
  topicName: string | null;
  subjectId: number | null;
  subjectName: string | null;
  severityLevel: 'high' | 'medium' | 'low' | null;
  priority: 'high' | 'medium' | 'low' | null;
  accuracyRate: number | null;
  failedQuestionsCount: number;
  recommendation: string | null;
  actionQuizId: number | null;
  actionQuizTitle: string | null;
  actionReadTopicId: number | null;
  identifiedDate: string;
}

export interface WeaknessSummarySubject {
  subjectId: number | null;
  subjectName: string | null;
  weakTopicsCount: number;
  averageAccuracy: number | null;
}

export interface WeaknessSummary {
  totalWeakTopics: number;
  highPriorityCount: number;
  subjects: WeaknessSummarySubject[];
}

export const getWeakAreas = (): Promise<{ success: boolean; count: number; weakAreas: WeakAreaApi[] }> =>
  api('/weakness');

export const getWeaknessSummary = (): Promise<{ success: boolean; summary: WeaknessSummary }> =>
  api('/weakness/summary');
