import { api } from '../utils/api';

const quizCache = new Map();
const mockExamCache = new Map();

/** Quizzes available to take, optionally scoped to a subject or exam. */
export const getQuizzes = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString();
  const cacheKey = query || 'all';

  if (quizCache.has(cacheKey)) {
    const cached = quizCache.get(cacheKey);
    // Silent background revalidation
    api(`/quizzes${query ? `?${query}` : ''}`)
      .then((res) => {
        if (res && res.quizzes) quizCache.set(cacheKey, res);
      })
      .catch(() => {});
    return Promise.resolve(cached);
  }

  return api(`/quizzes${query ? `?${query}` : ''}`).then((res) => {
    if (res && res.quizzes) quizCache.set(cacheKey, res);
    return res;
  });
};

/** One quiz with its questions and options (answer key stays server side). */
export const getQuiz = (quizId) => api(`/quizzes/${quizId}`);

export const getMockExams = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString();
  const cacheKey = query || 'all';

  if (mockExamCache.has(cacheKey)) {
    const cached = mockExamCache.get(cacheKey);
    // Silent background revalidation
    api(`/mock-exams${query ? `?${query}` : ''}`)
      .then((res) => {
        if (res && res.mockExams) mockExamCache.set(cacheKey, res);
      })
      .catch(() => {});
    return Promise.resolve(cached);
  }

  return api(`/mock-exams${query ? `?${query}` : ''}`).then((res) => {
    if (res && res.mockExams) mockExamCache.set(cacheKey, res);
    return res;
  });
};

export const getMockExam = (mockExamId) => api(`/mock-exams/${mockExamId}`);
