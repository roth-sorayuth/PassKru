import { api } from '../lib/api';
import { QuizAdminDetail, QuizAdminItem } from '../types';

export interface SaveQuizPayload {
  subjectId: number;
  title: string;
  difficultyLevel?: string | null;
  durationMinutes?: number | null;
}

export interface QuizFilters {
  subjectId?: number;
  examId?: number;
}

function buildQuery(filters?: QuizFilters): string {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.subjectId) params.set('subjectId', String(filters.subjectId));
  if (filters.examId) params.set('examId', String(filters.examId));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const quizService = {
  async getQuizzes(filters?: QuizFilters): Promise<QuizAdminItem[]> {
    const res = await api.get<{ quizzes: QuizAdminItem[] }>(`/quizzes${buildQuery(filters)}`);
    return res?.quizzes || [];
  },

  async getQuiz(quizId: number): Promise<QuizAdminDetail> {
    const res = await api.get<{ quiz: QuizAdminDetail }>(`/quizzes/${quizId}`);
    return res.quiz;
  },

  async createQuiz(payload: SaveQuizPayload): Promise<QuizAdminItem> {
    const res = await api.post<{ quiz: QuizAdminItem }>('/quizzes', payload);
    return res.quiz;
  },

  async updateQuiz(quizId: number, payload: Partial<SaveQuizPayload>): Promise<QuizAdminItem> {
    const res = await api.put<{ quiz: QuizAdminItem }>(`/quizzes/${quizId}`, payload);
    return res.quiz;
  },

  async deleteQuiz(quizId: number): Promise<void> {
    await api.delete(`/quizzes/${quizId}`);
  },

  async setQuizQuestions(quizId: number, questionIds: number[]): Promise<QuizAdminDetail> {
    const res = await api.put<{ quiz: QuizAdminDetail }>(`/quizzes/${quizId}/questions`, { questionIds });
    return res.quiz;
  },
};
