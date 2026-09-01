import { api } from '../lib/api';
import { PastPaper } from '../types';

export interface CreatePaperPayload {
  title: string;
  subjectId: number;
  year: number;
  fileUrl: string;
  fileSize?: string;
  paperType?: string;
  totalQuestions?: number | null;
  hasAnswerKey?: boolean;
}

export const paperService = {
  async getPapers(): Promise<PastPaper[]> {
    const res = await api.get<{ papers: PastPaper[] }>('/papers');
    return res?.papers || [];
  },

  async createPaper(payload: CreatePaperPayload): Promise<PastPaper> {
    const res = await api.post<{ paper: PastPaper }>('/papers', payload);
    return res.paper;
  },

  async deletePaper(paperId: number): Promise<void> {
    await api.delete(`/papers/${paperId}`);
  },
};
