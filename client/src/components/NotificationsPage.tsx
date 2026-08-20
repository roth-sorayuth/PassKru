import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  Award,
  ArrowRight,
  Filter,
  CheckCheck
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setCurrentPage,
    setSelectedAnnouncement,
    startQuizById,
    startMockExamById
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'announcement' | 'reminder' | 'result'>('all');

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'all') return true;
    return notif.type === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notif: any) => {
    markNotificationAsRead(notif.id);
    if (notif.linkToPage === 'announcement-detail' && notif.targetId) {
      setCurrentPage('exam-info');
    } else if (notif.linkToPage === 'quiz') {
      startQuizById(notif.targetId || 'quiz-ped-01');
    } else if (notif.linkToPage === 'mock-exam') {
      startMockExamById(notif.targetId || 'mock-nie-2026-01');
    } else if (notif.linkToPage === 'requirements') {
      setCurrentPage('requirements');
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

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 text-xs font-bold shadow-2xs transition cursor-pointer flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4 text-indigo-600" />
            <span>{lang === 'km' ? 'សម្គាល់ថាបានអានទាំងអស់' : 'Mark all as read'}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: { km: 'ទាំងអស់', en: 'All' } },
          { id: 'announcement', label: { km: 'សេចក្តីប្រកាសផ្លូវការ', en: 'Announcements' } },
          { id: 'reminder', label: { km: 'ការរំលឹកកាលវិភាគ', en: 'Reminders' } },
          { id: 'result', label: { km: 'លទ្ធផល & របាយការណ៍', en: 'Results' } },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              activeFilter === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label[lang]}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Bell className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">
              {lang === 'km' ? 'មិនមានការជូនដំណឹងថ្មីទេ' : 'No notifications in this category'}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer flex items-start gap-4 ${
                notif.read
                  ? 'bg-white border-slate-200 hover:border-slate-300'
                  : 'bg-indigo-50/50 border-indigo-200 hover:border-indigo-400 shadow-2xs'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.type === 'announcement'
                    ? 'bg-indigo-100 text-indigo-700'
                    : notif.type === 'reminder'
                    ? 'bg-amber-100 text-amber-700'
                    : notif.type === 'result'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {notif.type === 'announcement' ? (
                  <AlertCircle className="w-5 h-5" />
                ) : notif.type === 'reminder' ? (
                  <Clock className="w-5 h-5" />
                ) : notif.type === 'result' ? (
                  <Award className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-sm ${notif.read ? 'font-semibold text-slate-800' : 'font-extrabold text-slate-900'}`}>
                    {notif.title[lang]}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">{notif.timestamp}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {notif.message[lang]}
                </p>

                {notif.linkToPage && (
                  <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 pt-1">
                    <span>{lang === 'km' ? 'ចូលមើលភ្លាម' : 'View details'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>

              {!notif.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0 mt-1" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
