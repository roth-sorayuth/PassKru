import { api } from '../utils/api';

export const getDashboardSummary = () => api('/progress/dashboard');
