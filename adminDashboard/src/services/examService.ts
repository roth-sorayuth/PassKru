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

  async createSubject(payload: { examId?: number; subjectName: string; description?: string }): Promise<Subject> {
    const res = await api.post<{ subject: Subject }>('/subjects', payload);
    return res.subject;
  },

  async deleteSubject(subjectId: number): Promise<void> {
    await api.delete(`/subjects/${subjectId}`);
  },
};
