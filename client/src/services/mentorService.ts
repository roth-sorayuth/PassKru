import { api } from '../utils/api';
import { Mentor } from '../types';

export interface GetMentorsResponse {
  success: boolean;
  count: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  mentors: Mentor[];
}

const mentorCache = new Map<string, GetMentorsResponse>();

export const getMentors = async (params?: { search?: string; subject?: string; page?: number; limit?: number }): Promise<GetMentorsResponse> => {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.subject && params.subject !== 'all') query.set('subject', params.subject);
  if (params?.page) query.set('page', params.page.toString());
  if (params?.limit) query.set('limit', params.limit.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const cacheKey = queryString || 'all';

  if (mentorCache.has(cacheKey)) {
    const cached = mentorCache.get(cacheKey)!;
    // Silent background revalidation
    api(`/mentors${queryString}`)
      .then((res) => {
        if (res && res.mentors) mentorCache.set(cacheKey, res);
      })
      .catch(() => {});
    return cached;
  }

  const res = await api(`/mentors${queryString}`);
  if (res && res.mentors) {
    mentorCache.set(cacheKey, res);
  }
  return res;
};

export const getMentorById = async (id: number | string): Promise<{ success: boolean; mentor: Mentor }> => {
  return await api(`/mentors/${id}`);
};

export interface CreateBookingPayload {
  sessionDate?: string;
  timeSlot?: string;
  note?: string;
}

export const createBooking = async (
  mentorId: number | string,
  payload: CreateBookingPayload
): Promise<{ success: boolean; message: string; booking: any }> => {
  return await api(`/mentors/${mentorId}/bookings`, { method: 'POST', body: payload });
};
