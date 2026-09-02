import { useState, useEffect, useCallback } from 'react';
import { paperService, CreatePaperPayload } from '../services/paperService';
import { PastPaper } from '../types';

export function usePapers(enabled: boolean = true) {
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPapers = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      setError(null);
      const data = await paperService.getPapers();
      setPapers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch past papers');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  const createPaper = async (payload: CreatePaperPayload) => {
    const created = await paperService.createPaper(payload);
    setPapers((prev) => [created, ...prev]);
    return created;
  };

  const deletePaper = async (paperId: number) => {
    await paperService.deletePaper(paperId);
    setPapers((prev) => prev.filter((p) => p.paperId !== paperId));
  };

  return {
    papers,
    loading,
    error,
    refetch: fetchPapers,
    createPaper,
    deletePaper,
  };
}
