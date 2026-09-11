import { api } from '../utils/api';

export const getMockExams = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString();
  return api(`/mock-exams${query ? `?${query}` : ''}`);
};

export const getMockExam = (mockExamId) => api(`/mock-exams/${mockExamId}`);

