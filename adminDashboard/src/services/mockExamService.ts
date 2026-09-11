import { api } from '../lib/api';
import { MockExamAdminDetail, MockExamAdminItem, MockExamSectionItem } from '../types';

export interface SaveMockExamPayload {
  examId: number;
  title: string;
  description?: string | null;
  year?: number | null;
  durationMinutes?: number | null;
  totalMarks?: number | null;
  passingMarks?: number | null;
  instructions?: string | null;
}

export const mockExamService = {
  async getMockExams(examId?: number): Promise<MockExamAdminItem[]> {
    const qs = examId ? `?examId=${examId}` : '';
    const res = await api.get<{ mockExams: MockExamAdminItem[] }>(`/mock-exams${qs}`);
    return res?.mockExams || [];
  },

  async getMockExam(mockExamId: number): Promise<MockExamAdminDetail> {
    const res = await api.get<{ mockExam: MockExamAdminDetail }>(`/mock-exams/${mockExamId}`);
    return res.mockExam;
  },

  async createMockExam(payload: SaveMockExamPayload): Promise<MockExamAdminItem> {
    const res = await api.post<{ mockExam: MockExamAdminItem }>('/mock-exams', payload);
    return res.mockExam;
  },

  async updateMockExam(mockExamId: number, payload: Partial<SaveMockExamPayload>): Promise<MockExamAdminItem> {
    const res = await api.put<{ mockExam: MockExamAdminItem }>(`/mock-exams/${mockExamId}`, payload);
    return res.mockExam;
  },

  async deleteMockExam(mockExamId: number): Promise<void> {
    await api.delete(`/mock-exams/${mockExamId}`);
  },

  async addSection(mockExamId: number, payload: { subjectId: number; numberOfQuestions?: number }): Promise<MockExamSectionItem> {
    const res = await api.post<{ section: MockExamSectionItem }>(`/mock-exams/${mockExamId}/sections`, payload);
    return res.section;
  },

  async updateSection(mockExamId: number, sectionId: number, numberOfQuestions: number): Promise<MockExamSectionItem> {
    const res = await api.put<{ section: MockExamSectionItem }>(
      `/mock-exams/${mockExamId}/sections/${sectionId}`,
      { numberOfQuestions }
    );
    return res.section;
  },

  async deleteSection(mockExamId: number, sectionId: number): Promise<void> {
    await api.delete(`/mock-exams/${mockExamId}/sections/${sectionId}`);
  },

  async setSectionQuestions(mockExamId: number, sectionId: number, questionIds: number[]): Promise<MockExamSectionItem> {
    const res = await api.put<{ section: MockExamSectionItem }>(
      `/mock-exams/${mockExamId}/sections/${sectionId}/questions`,
      { questionIds }
    );
    return res.section;
  },
};
