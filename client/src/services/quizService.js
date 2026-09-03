import { api } from '../utils/api';

/** Quizzes available to take, optionally scoped to a subject or exam. */
export const getQuizzes = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString();
  return api(`/quizzes${query ? `?${query}` : ''}`);
};

/** One quiz with its questions and options (answer key stays server side). */
export const getQuiz = (quizId) => api(`/quizzes/${quizId}`);

export const getMockExams = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString();
  return api(`/mock-exams${query ? `?${query}` : ''}`);
};

export const getMockExam = (mockExamId) => api(`/mock-exams/${mockExamId}`);
