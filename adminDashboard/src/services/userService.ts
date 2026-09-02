import { api } from '../lib/api';
import { UserItem } from '../types';

export interface SaveUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  role: string;
  targetExamId?: number | null;
  knowledgeLevel?: string | null;
  dailyGoalMinutes?: number;
}

export const userService = {
  async getUsers(): Promise<UserItem[]> {
    const res = await api.get<{ users: UserItem[] }>('/users');
    return res?.users || [];
  },

  async createUser(payload: SaveUserPayload): Promise<UserItem> {
    const res = await api.post<{ user: UserItem }>('/users', payload);
    return res.user;
  },

  async updateUser(id: number, payload: SaveUserPayload): Promise<UserItem> {
    const res = await api.put<{ user: UserItem }>(`/users/${id}`, payload);
    return res.user;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
