import { api } from '../utils/api';

export const getActiveStudyPlan = () => api('/study-plan');

export const generateStudyPlan = (payload) =>
  api('/study-plan/generate', { method: 'POST', body: payload });

export const getStudyPlanHistory = () => api('/study-plan/history');

export const updateStudyTaskStatus = (planId, taskId, completed) =>
  api(`/study-plan/${planId}/tasks/${taskId}`, { method: 'PATCH', body: { completed } });

/** This week's wrong answers from quizzes and practice, for the Saturday review. */
export const getWeeklyReview = () => api('/study-plan/weekly-review').then((res) => res.review);

/** Submits the re-answered mistakes: { answers: [{ questionId, selectedOptionId }] }. */
export const submitWeeklyReview = (answers) =>
  api('/study-plan/weekly-review', { method: 'POST', body: { answers } }).then((res) => res.result);

/** The AI's proposed changes to next week, or null when there is none. */
export const getWeeklyUpdate = () => api('/study-plan/weekly-update').then((res) => res.update);

/** decision: 'accept' | 'keep' */
export const decideWeeklyUpdate = (updateId, decision) =>
  api(`/study-plan/weekly-update/${updateId}`, { method: 'POST', body: { decision } }).then((res) => res.update);

/** Every AI plan the candidate has (active, paused, finished), newest first. */
export const listMyPlans = () => api('/study-plan/plans').then((res) => res.plans);

/**
 * Continue a paused plan. The server pauses the current plan and switches the
 * candidate's level and subjects to this plan's: { plan, selection }.
 */
export const activateStudyPlan = (planId) => api(`/study-plan/plans/${planId}/activate`, { method: 'POST' });

/** Cancel an active or paused plan; it moves to history and can't be continued. */
export const cancelStudyPlan = (planId) => api(`/study-plan/plans/${planId}/cancel`, { method: 'POST' });
