import { api } from '../utils/api';

export const getExams = () => api('/exams');

export const getExamById = (id) => api(`/exams/${id}`);

