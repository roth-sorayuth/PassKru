import { useState, useEffect, useCallback } from 'react';
import { quizService, SaveQuizPayload, QuizFilters } from '../services/quizService';
import { QuizAdminItem } from '../types';

export function useQuizzes(enabled: boolean = true, filters?: QuizFilters) {
  const [quizzes, setQuizzes] = useState<QuizAdminItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtersKey = JSON.stringify(filters || {});

  const fetchQuizzes = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      setError(null);
      const data = await quizService.getQuizzes(filters);
      setQuizzes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, filtersKey]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const createQuiz = async (payload: SaveQuizPayload) => {
    const created = await quizService.createQuiz(payload);
    await fetchQuizzes();
    return created;
  };

  const updateQuiz = async (id: number, payload: Partial<SaveQuizPayload>) => {
    const updated = await quizService.updateQuiz(id, payload);
    await fetchQuizzes();
    return updated;
  };

  const deleteQuiz = async (id: number) => {
    await quizService.deleteQuiz(id);
    setQuizzes((prev) => prev.filter((q) => q.quizId !== id));
  };

  return {
    quizzes,
    loading,
    error,
    refetch: fetchQuizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz,
  };
}
