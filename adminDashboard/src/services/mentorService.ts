import { api } from '../lib/api';
import { MentorItem, MentorStatus } from '../types';

export interface SaveMentorPayload {
  firstName: string;
  lastName: string;
  title?: string | null;
  roleLabel?: string | null;
  avatarUrl?: string | null;
  experienceYears?: number | null;
  bio?: string | null;
  hourlyRate?: string | null;
  socialTelegram?: string | null;
  subjects?: string[] | null;
  availability?: string | null;
  status?: MentorStatus;
}

export interface MentorFilters {
  search?: string;
  subject?: string;
  page?: number;
  limit?: number;
  status?: MentorStatus | 'all';
}

function buildQuery(filters?: MentorFilters): string {
  const params = new URLSearchParams();
  // Default to 'all' so the moderation queue always sees every status,
  // not just the public 'approved' default the candidate site relies on.
  params.set('status', filters?.status || 'all');
  if (filters?.search) params.set('search', filters.search);
  if (filters?.subject) params.set('subject', filters.subject);
  if (filters?.page) params.set('page', String(filters.page));
  if (filters?.limit) params.set('limit', String(filters.limit));
  return `?${params.toString()}`;
}

export const mentorService = {
  async getMentors(filters?: MentorFilters): Promise<MentorItem[]> {
    const res = await api.get<{ mentors: MentorItem[] }>(`/mentors${buildQuery(filters)}`);
    return res?.mentors || [];
  },

  async getMentor(id: number): Promise<MentorItem> {
    const res = await api.get<{ mentor: MentorItem }>(`/mentors/${id}`);
    return res.mentor;
  },

  async createMentor(payload: SaveMentorPayload): Promise<MentorItem> {
    const res = await api.post<{ mentor: MentorItem }>('/mentors', payload);
    return res.mentor;
  },

  async updateMentor(id: number, payload: Partial<SaveMentorPayload>): Promise<MentorItem> {
    const res = await api.put<{ mentor: MentorItem }>(`/mentors/${id}`, payload);
    return res.mentor;
  },

  async updateStatus(id: number, status: MentorStatus): Promise<MentorItem> {
    const res = await api.patch<{ mentor: MentorItem }>(`/mentors/${id}/status`, { status });
    return res.mentor;
  },

  async deleteMentor(id: number): Promise<void> {
    await api.delete(`/mentors/${id}`);
  },
};
