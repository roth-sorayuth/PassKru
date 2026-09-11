import { api } from '../utils/api';

export interface NotificationApi {
  notificationId: number;
  userId: number;
  announcementId: number | null;
  title: string;
  message: string | null;
  category: 'announcement' | 'exam' | 'reminder' | 'result' | 'tip' | string | null;
  actionUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = (): Promise<{ success: boolean; count: number; notifications: NotificationApi[] }> =>
  api('/notifications');

export const markNotificationRead = (id: number): Promise<{ success: boolean; notification: NotificationApi }> =>
  api(`/notifications/${id}/read`, { method: 'PUT' });

export const markAllNotificationsRead = (): Promise<{ success: boolean }> =>
  api('/notifications/read-all', { method: 'PUT' });

export const deleteNotification = (id: number): Promise<{ success: boolean }> =>
  api(`/notifications/${id}`, { method: 'DELETE' });
