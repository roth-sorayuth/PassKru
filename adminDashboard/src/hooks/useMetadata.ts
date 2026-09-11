import { useState, useEffect, useCallback } from 'react';
import { examService } from '../services/examService';
import { Exam, Subject } from '../types';

export function useMetadata(enabled: boolean = true) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      setError(null);
      const [examsData, subjectsData] = await Promise.all([
        examService.getExams().catch(() => []),
        examService.getSubjects().catch(() => []),
      ]);
      setExams(examsData);
      setSubjects(subjectsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch exam metadata');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  return { exams, subjects, loading, error, refetch: fetchMetadata };
}
