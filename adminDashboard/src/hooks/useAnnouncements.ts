import { useState, useEffect, useCallback } from 'react';
import { announcementService, SaveAnnouncementPayload } from '../services/announcementService';
import { AnnouncementItem } from '../types';

export function useAnnouncements(enabled: boolean = true) {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      setError(null);
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const createAnnouncement = async (payload: SaveAnnouncementPayload) => {
    const created = await announcementService.createAnnouncement(payload);
    await fetchAnnouncements(); // Refresh list to get relationships/exam names
    return created;
  };

  const updateAnnouncement = async (id: number, payload: SaveAnnouncementPayload) => {
    const updated = await announcementService.updateAnnouncement(id, payload);
    await fetchAnnouncements();
    return updated;
  };

  const deleteAnnouncement = async (id: number) => {
    await announcementService.deleteAnnouncement(id);
    setAnnouncements((prev) => prev.filter((a) => a.announcementId !== id));
  };

  return {
    announcements,
    loading,
    error,
    refetch: fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  };
}
