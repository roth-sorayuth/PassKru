import { api } from '../utils/api';

export const getDashboardSummary = () => api('/progress/dashboard');

/**
 * One page of study history, newest first. Pass the previous page's
 * `nextCursor` as `before` to load older items.
 * @param {{ before?: string | null, limit?: number }} [options]
 */
export const getActivity = ({ before, limit = 8 } = {}) =>
  api(`/progress/activity?limit=${limit}${before ? `&before=${encodeURIComponent(before)}` : ''}`);
