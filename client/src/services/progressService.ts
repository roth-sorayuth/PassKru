import { api } from '../utils/api';
import { DashboardResponseData } from '../types/dashboard';

/**
 * Fetch all aggregated dashboard data for the authenticated user
 * @param token Optional Clerk session token
 */
export const getDashboardData = async (token?: string | null): Promise<DashboardResponseData> => {
  const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await api('/progress/dashboard', options);
  return response.data;
};

/**
 * Record user study progress / proficiency on a specific topic
 * @param topicId 
 * @param proficiencyScore (0 - 100)
 * @param token Optional Clerk session token
 */
export const recordTopicProgress = async (
  topicId: number | string,
  proficiencyScore: number,
  token?: string | null
) => {
  const options: any = {
    method: 'POST',
    body: { proficiencyScore },
  };
  if (token) {
    options.headers = { Authorization: `Bearer ${token}` };
  }
  return await api(`/progress/topics/${topicId}`, options);
};

/**
 * Update user's target exam ID
 * @param examId 
 * @param token Optional Clerk session token
 */
export const setTargetExam = async (
  examId: number | string,
  token?: string | null
) => {
  const options: any = {
    method: 'PUT',
    body: { examId: Number(examId) },
  };
  if (token) {
    options.headers = { Authorization: `Bearer ${token}` };
  }
  return await api('/progress/target-exam', options);
};
