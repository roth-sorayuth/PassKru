import { api } from '../utils/api';

/** Opens an attempt so the server can time it and tie answers to it. */
export const startAttempt = (payload) =>
  api('/attempts', { method: 'POST', body: payload });

/**
 * Submits answers for grading. The server scores against its own answer key
 * and updates topic proficiency + weak areas, then returns the breakdown.
 */
export const submitAttempt = (attemptId, answers) =>
  api(`/attempts/${attemptId}/submit`, { method: 'POST', body: { answers } });

export const getAttempt = (attemptId) => api(`/attempts/${attemptId}`);

export const getAttempts = () => api('/attempts');
