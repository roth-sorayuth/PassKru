import { api } from '../lib/api';
import { QuestionItem } from '../types';

export interface QuestionOptionPayload {
  optionText: string;
  isCorrect: boolean;
}

export interface SaveQuestionPayload {
  topicId: number;
  questionText: string;
  questionType: string;
  difficultyLevel?: string | null;
  correctAnswer?: string | null;
  explanation?: string | null;
  referenceNote?: string | null;
  options: QuestionOptionPayload[];
}

export interface QuestionFilters {
  topicId?: number;
  subjectId?: number;
  questionType?: string;
  difficultyLevel?: string;
  search?: string;
}

function buildQuery(filters?: QuestionFilters): string {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.topicId) params.set('topicId', String(filters.topicId));
  if (filters.subjectId) params.set('subjectId', String(filters.subjectId));
  if (filters.questionType) params.set('questionType', filters.questionType);
  if (filters.difficultyLevel) params.set('difficultyLevel', filters.difficultyLevel);
  if (filters.search) params.set('search', filters.search);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const questionService = {
  async getQuestions(filters?: QuestionFilters): Promise<QuestionItem[]> {
    const res = await api.get<{ questions: QuestionItem[] }>(`/questions${buildQuery(filters)}`);
    return res?.questions || [];
  },

  async getQuestion(id: number): Promise<QuestionItem> {
    const res = await api.get<{ question: QuestionItem }>(`/questions/${id}`);
    return res.question;
  },

  async createQuestion(payload: SaveQuestionPayload): Promise<QuestionItem> {
    const res = await api.post<{ question: QuestionItem }>('/questions', payload);
    return res.question;
  },

  async updateQuestion(id: number, payload: Partial<SaveQuestionPayload>): Promise<QuestionItem> {
    const res = await api.put<{ question: QuestionItem }>(`/questions/${id}`, payload);
    return res.question;
  },

  async deleteQuestion(id: number): Promise<void> {
    await api.delete(`/questions/${id}`);
  },
};
