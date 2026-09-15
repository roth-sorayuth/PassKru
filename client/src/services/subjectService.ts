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
  minimal?: boolean;
}

export interface SubjectsResponse {
  success: boolean;
  count: number;
  subjects: ApiSubject[];
}

const subjectCache = new Map<string, SubjectsResponse>();

export const getSubjects = async (params: GetSubjectsParams = {}): Promise<SubjectsResponse> => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '') as [string, string][]
  ).toString();
  
  const cacheKey = query || 'all';
  if (subjectCache.has(cacheKey)) {
    const cached = subjectCache.get(cacheKey)!;
    // Silent background revalidation
    api(`/subjects${query ? `?${query}` : ''}`)
      .then((res) => {
        if (res && res.subjects) subjectCache.set(cacheKey, res);
      })
      .catch(() => {});
    return cached;
  }

  const res = await api(`/subjects${query ? `?${query}` : ''}`);
  if (res && res.subjects) {
    subjectCache.set(cacheKey, res);
  }
  return res;
};

export const getSubjectById = async (id: number | string): Promise<{ success: boolean; subject: ApiSubject }> => {
  return api(`/subjects/${id}`);
};

