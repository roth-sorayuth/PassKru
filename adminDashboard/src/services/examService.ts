import { api } from '../lib/api';
import { Exam, Subject } from '../types';

export const examService = {
  async getExams(): Promise<Exam[]> {
    const res = await api.get<{ exams: Exam[] }>('/exams');
    return res?.exams || [];
  },

  async getSubjects(): Promise<Subject[]> {
    const res = await api.get<{ subjects: Subject[] }>('/subjects');
    return res?.subjects || [];
  },
};
