import { api } from '../utils/api';

export interface ApiSubject {
  subjectId: number;
  examId: number | null;
  subjectName: string;
  description: string | null;
  quizCount: number;
  questionCount: number;
  flashcardCount: number;
  pastPaperCount: number;
  topics: string[];
  exam?: {
    examId: number;
    examName: string;
    targetCode: string;
  };
  _count?: {
    topics?: number;
    pastPapers?: number;
    quizzes?: number;
    flashcardDecks?: number;
  };
}

export interface GetSubjectsParams {
  examId?: number | string;
  targetExam?: string;
}

export interface SubjectsResponse {
  success: boolean;
  count: number;
  subjects: ApiSubject[];
}

export const getSubjects = async (params: GetSubjectsParams = {}): Promise<SubjectsResponse> => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '') as [string, string][]
  ).toString();
  return api(`/subjects${query ? `?${query}` : ''}`);
};

export const getSubjectById = async (id: number | string): Promise<{ success: boolean; subject: ApiSubject }> => {
  return api(`/subjects/${id}`);
};

