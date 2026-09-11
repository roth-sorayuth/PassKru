import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  NotificationApi,
} from '../../services/notificationService';
import { api } from '../../utils/api';
import { formatKhmerDate } from '../../utils/formatDate';
import {
  Bell,
  Calendar,
  AlertCircle,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  CheckCheck,
  Loader2,
  RefreshCw,
} from 'lucide-react';

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  announcement: <AlertCircle className="w-5 h-5" />,
  exam: <Calendar className="w-5 h-5" />,
  reminder: <Clock className="w-5 h-5" />,
  result: <Award className="w-5 h-5" />,
  tip: <Sparkles className="w-5 h-5" />,
};

const CATEGORY_STYLE: Record<string, string> = {
  announcement: 'bg-indigo-100 text-indigo-700',
  exam: 'bg-blue-100 text-blue-700',
  reminder: 'bg-amber-100 text-amber-700',
  result: 'bg-emerald-100 text-emerald-700',
  tip: 'bg-purple-100 text-purple-700',
};

const CATEGORY_LABEL: Record<string, { km: string; en: string }> = {
  announcement: { km: 'សេចក្តីប្រកាស', en: 'Announcements' },
  exam: { km: 'ការប្រឡង', en: 'Exams' },
  reminder: { km: 'ការរំលឹក', en: 'Reminders' },
  result: { km: 'លទ្ធផល', en: 'Results' },
  tip: { km: 'គន្លឹះ', en: 'Tips' },
};

export const NotificationsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { setCurrentPage, setSelectedAnnouncement } = useApp();

  const [notifications, setNotifications] = useState<NotificationApi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getNotifications();
      if (res?.success && Array.isArray(res.notifications)) {
        setNotifications(res.notifications);
      } else {
        setNotifications([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err);
      setError(err?.message || 'Could not load notifications from server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const categoriesPresent = Array.from(new Set(notifications.map(n => n.category).filter(Boolean))) as string[];
  const filteredNotifications = notifications.filter(notif =>
    activeFilter === 'all' ? true : notif.category === activeFilter
  );
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    // Optimistic — the list is small and this is low-stakes, so just refetch on failure.
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsRead();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      fetchNotifications();
    }
  };

  const handleNotificationClick = async (notif: NotificationApi) => {
    if (!notif.isRead) {
      setNotifications(prev =>
        prev.map(n => (n.notificationId === notif.notificationId ? { ...n, isRead: true } : n))
      );
      markNotificationRead(notif.notificationId).catch(err => {
        console.error('Failed to mark notification as read:', err);
      });
    }

    if (!notif.actionUrl) return;

    // Today the only actionUrl shape the backend generates is
    // "/announcements/{id}" (see announcementService.js) — load that
    // announcement and route to its detail page the same way
    // AnnouncementsPage.tsx does. Anything else just marks read with no nav.
    const match = notif.actionUrl.match(/^\/announcements\/(\d+)$/);
    if (match) {
      try {
        const res = await api(`/announcements/${match[1]}`);
        const announcement = res?.announcement || res;
        if (announcement) {
          setSelectedAnnouncement(announcement);
          setCurrentPage('announcement-detail');
        }
      } catch (err) {
        console.error('Failed to open announcement from notification:', err);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Bell className="w-4 h-4" />
            <span>{lang === 'km' ? 'មជ្ឈមណ្ឌលដំណឹង & ការដាស់តឿន' : 'Notifications & Alerts Center'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('navNotifications')}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchNotifications()}
            title="Refresh"
            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 shadow-2xs transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 text-xs font-bold shadow-2xs transition cursor-pointer flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'km' ? 'សម្គាល់ថាបានអានទាំងអស់' : 'Mark all as read'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs — built from whatever categories actually came back */}
      {categoriesPresent.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {['all', ...categoriesPresent].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-2 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                activeFilter === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'all'
                ? (lang === 'km' ? 'ទាំងអស់' : 'All')
                : (CATEGORY_LABEL[cat]?.[lang] || cat)}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-5 rounded-2xl border border-slate-200 bg-white animate-pulse flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-200 space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="text-sm font-bold text-red-800">
            {lang === 'km' ? 'មិនអាចទាញយកការជូនដំណឹងបានទេ' : 'Failed to load notifications'}
          </h3>
          <p className="text-xs text-red-600">{error}</p>
          <button
            onClick={() => fetchNotifications()}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            {lang === 'km' ? 'ព្យាយាមម្តងទៀត' : 'Try Again'}
          </button>
        </div>
      )}

      {/* Notifications List */}
      {!loading && !error && (
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <Bell className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">
                {lang === 'km' ? 'មិនមានការជូនដំណឹងថ្មីទេ' : 'No notifications in this category'}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notif => {
              const category = notif.category || 'announcement';
              return (
                <div
                  key={notif.notificationId}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer flex items-start gap-4 ${
                    notif.isRead
                      ? 'bg-white border-slate-200 hover:border-slate-300'
                      : 'bg-indigo-50/50 border-indigo-200 hover:border-indigo-400 shadow-2xs'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${CATEGORY_STYLE[category] || 'bg-slate-100 text-slate-700'}`}>
                    {CATEGORY_ICON[category] || <Bell className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-sm ${notif.isRead ? 'font-semibold text-slate-800' : 'font-extrabold text-slate-900'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                        {lang === 'km' ? formatKhmerDate(notif.createdAt) : new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    {notif.message && (
                      <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                    )}

                    {notif.actionUrl && (
                      <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 pt-1">
                        <span>{lang === 'km' ? 'ចូលមើលភ្លាម' : 'View details'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {!notif.isRead && (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0 mt-1" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
