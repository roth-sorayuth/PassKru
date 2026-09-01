import { api } from '../lib/api';
import { AnnouncementItem } from '../types';

export interface SaveAnnouncementPayload {
  examId: number;
  title: string;
  summary?: string | null;
  content?: string | null;
  category?: string;
  isUrgent?: boolean;
  attachments?: any;
}

export const announcementService = {
  async getAnnouncements(): Promise<AnnouncementItem[]> {
    const res = await api.get<{ announcements: AnnouncementItem[] }>('/announcements');
    return res?.announcements || [];
  },

  async createAnnouncement(payload: SaveAnnouncementPayload): Promise<AnnouncementItem> {
    const res = await api.post<{ announcement: AnnouncementItem }>('/announcements', payload);
    return res.announcement;
  },

  async updateAnnouncement(id: number, payload: SaveAnnouncementPayload): Promise<AnnouncementItem> {
    const res = await api.put<{ announcement: AnnouncementItem }>(`/announcements/${id}`, payload);
    return res.announcement;
  },

  async deleteAnnouncement(id: number): Promise<void> {
    await api.delete(`/announcements/${id}`);
  },
};
