import { useState, useEffect, useCallback } from 'react';
import { questionService, SaveQuestionPayload, QuestionFilters } from '../services/questionService';
import { QuestionItem } from '../types';

export function useQuestions(enabled: boolean = true, filters?: QuestionFilters) {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtersKey = JSON.stringify(filters || {});

  const fetchQuestions = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      setError(null);
      const data = await questionService.getQuestions(filters);
      setQuestions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, filtersKey]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const createQuestion = async (payload: SaveQuestionPayload) => {
    const created = await questionService.createQuestion(payload);
    await fetchQuestions();
    return created;
  };

  const updateQuestion = async (id: number, payload: Partial<SaveQuestionPayload>) => {
    const updated = await questionService.updateQuestion(id, payload);
    await fetchQuestions();
    return updated;
  };

  const deleteQuestion = async (id: number) => {
    await questionService.deleteQuestion(id);
    setQuestions((prev) => prev.filter((q) => q.questionId !== id));
  };

  return {
    questions,
    loading,
    error,
    refetch: fetchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  };
}
