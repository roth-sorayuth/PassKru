import { useState, useEffect, useCallback } from 'react';
import { topicService } from '../services/topicService';
import { TopicItem } from '../types';

export function useTopics(enabled: boolean = true, subjectId?: number) {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      setError(null);
      const data = await topicService.getTopics(subjectId);
      setTopics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch topics');
    } finally {
      setLoading(false);
    }
  }, [enabled, subjectId]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return { topics, loading, error, refetch: fetchTopics };
}
