import { useState, useEffect, useCallback } from 'react';
import { mockExamService, SaveMockExamPayload } from '../services/mockExamService';
import { MockExamAdminItem } from '../types';

export function useMockExams(enabled: boolean = true, examId?: number) {
  const [mockExams, setMockExams] = useState<MockExamAdminItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMockExams = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      setError(null);
      const data = await mockExamService.getMockExams(examId);
      setMockExams(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch mock exams');
    } finally {
      setLoading(false);
    }
  }, [enabled, examId]);

  useEffect(() => {
    fetchMockExams();
  }, [fetchMockExams]);

  const createMockExam = async (payload: SaveMockExamPayload) => {
    const created = await mockExamService.createMockExam(payload);
    await fetchMockExams();
    return created;
  };

  const updateMockExam = async (id: number, payload: Partial<SaveMockExamPayload>) => {
    const updated = await mockExamService.updateMockExam(id, payload);
    await fetchMockExams();
    return updated;
  };

  const deleteMockExam = async (id: number) => {
    await mockExamService.deleteMockExam(id);
    setMockExams((prev) => prev.filter((m) => m.mockExamId !== id));
  };

  return {
    mockExams,
    loading,
    error,
    refetch: fetchMockExams,
    createMockExam,
    updateMockExam,
    deleteMockExam,
  };
}
