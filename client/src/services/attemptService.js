import { api } from '../utils/api';

/** Opens an attempt so the server can time it and tie answers to it. */
export const startAttempt = (payload) =>
  api('/attempts', { method: 'POST', body: payload });

/**
 * Submits answers for grading. The server scores against its own answer key,
 * updates topic mastery + weak areas, and reshapes the study plan, then
 * returns the breakdown.
 *
 * `sourceTaskId` is the study-plan task this quiz was launched from, when
 * there was one. Without it the server has to guess which task the sitting
 * closed by matching quiz ids, which goes wrong once review tasks reuse them.
 */
export const submitAttempt = (attemptId, answers, sourceTaskId = null) =>
  api(`/attempts/${attemptId}/submit`, {
    method: 'POST',
    body: sourceTaskId ? { answers, sourceTaskId } : { answers },
  });

export const getAttempt = (attemptId) => api(`/attempts/${attemptId}`);

export const getAttempts = () => api('/attempts');
