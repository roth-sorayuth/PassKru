import { useState, useEffect, useCallback } from 'react';
import { mentorService, SaveMentorPayload, MentorFilters } from '../services/mentorService';
import { MentorItem, MentorStatus } from '../types';

export function useMentors(enabled: boolean = true, filters?: MentorFilters) {
  const [mentors, setMentors] = useState<MentorItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtersKey = JSON.stringify(filters || {});

  const fetchMentors = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      setError(null);
      const data = await mentorService.getMentors(filters);
      setMentors(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch mentors');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, filtersKey]);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  const createMentor = async (payload: SaveMentorPayload) => {
    const created = await mentorService.createMentor(payload);
    await fetchMentors();
    return created;
  };

  const updateMentor = async (id: number, payload: Partial<SaveMentorPayload>) => {
    const updated = await mentorService.updateMentor(id, payload);
    await fetchMentors();
    return updated;
  };

  const updateMentorStatus = async (id: number, status: MentorStatus) => {
    const updated = await mentorService.updateStatus(id, status);
    setMentors((prev) => prev.map((m) => (m.mentorId === id ? { ...m, status: updated.status } : m)));
    return updated;
  };

  const deleteMentor = async (id: number) => {
    await mentorService.deleteMentor(id);
    setMentors((prev) => prev.filter((m) => m.mentorId !== id));
  };

  return {
    mentors,
    loading,
    error,
    refetch: fetchMentors,
    createMentor,
    updateMentor,
    updateMentorStatus,
    deleteMentor,
  };
}
