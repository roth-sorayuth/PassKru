import { api } from '../utils/api';

export const getActiveStudyPlan = () => api('/study-plan');

export const generateStudyPlan = (payload) =>
  api('/study-plan/generate', { method: 'POST', body: payload });

export const getStudyPlanHistory = () => api('/study-plan/history');

export const updateStudyTaskStatus = (planId, taskId, completed) =>
  api(`/study-plan/${planId}/tasks/${taskId}`, { method: 'PATCH', body: { completed } });
