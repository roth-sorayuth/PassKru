import { api } from '../utils/api';

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  targetExamId?: number | null;
  /** Preferred over targetExamId — the server resolves the exam row itself. */
  targetExamCode?: string | null;
  targetSubject?: string | null;
  targetSubjects?: string[];
  knowledgeLevel?: string | null;
  availableStudyHours?: number | null;
  dailyGoalMinutes?: number;
}

export const getMe = (): Promise<{ success: boolean; user: any }> => api('/auth/me');

export const updateProfile = (
  payload: UpdateProfilePayload
): Promise<{ success: boolean; message: string; user: any }> =>
  api('/auth/me', { method: 'PATCH', body: payload });
