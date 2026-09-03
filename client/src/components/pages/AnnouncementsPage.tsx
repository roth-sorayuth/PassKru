import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Clock, FileText, Calendar, Flame } from 'lucide-react';
import { api } from '../../utils/api';
import { formatKhmerDate } from '../../utils/formatDate';

interface DeadlineInfo {
  dateStr: string;
  formattedDate: string;
  daysRemaining: number;
  status: 'urgent' | 'closing_soon' | 'active' | 'expired';
  label: string;
  badgeBg: string;
  badgeText: string;
  examDate?: string | null;
}

export const formatCategoryKhmer = (cat?: string) => {
  if (!cat) return 'សេចក្តីជូនដំណឹង';
  const c = cat.toLowerCase();
  if (c.includes('recruit')) return 'ជ្រើសរើសគ្រូ';
  if (c.includes('exam')) return 'ការប្រឡង';
  if (c.includes('schedule')) return 'កាលវិភាគប្រឡង';
  if (c.includes('eligibility')) return 'លក្ខខណ្ឌជ្រើសរើស';
  if (c.includes('urgent')) return 'ដំណឹងបន្ទាន់';
  if (c.includes('guide') || c.includes('guideline')) return 'សេចក្តីណែនាំ';
  if (c.includes('general')) return 'ព័ត៌មានទូទៅ';
  if (c.includes('result')) return 'លទ្ធផលប្រឡង';
  if (c.includes('deadline')) return 'កាលបរិច្ឆេទ';
  if (c.includes('notice') || c.includes('announcement')) return 'សេចក្តីប្រកាស';
  return cat;
};

function getCardDeadlineInfo(item: any): DeadlineInfo | null {
  let dateVal: string | null = null;
  let examDateVal: string | null = null;

  // 1. Check importantDates array
  if (Array.isArray(item.importantDates)) {
    const deadlineObj = item.importantDates.find((d: any) => 
      d?.label?.en?.toLowerCase().includes('deadline') || 
      d?.label?.km?.includes('ផុតកំណត់') || 
      d?.label?.km?.includes('ឈប់ទទួល')
    );
    if (deadlineObj?.date) dateVal = deadlineObj.date;
  }

  // 2. Check attachments metadata
  if (!dateVal && item.attachments && typeof item.attachments === 'object') {
    if (!Array.isArray(item.attachments)) {
      if (item.attachments.deadlineDate) dateVal = item.attachments.deadlineDate;
      if (item.attachments.examDate) examDateVal = item.attachments.examDate;
    } else if (Array.isArray(item.attachments)) {
      const meta = item.attachments.find((att: any) => att?.deadlineDate || att?.examDate || att?.type === 'meta');
      if (meta?.deadlineDate) dateVal = meta.deadlineDate;
      if (meta?.examDate) examDateVal = meta.examDate;
    }
  }

  // 3. Fallback: Parse date from summary or content
  if (!dateVal && (item.summary || item.content)) {
    const text = `${typeof item.summary === 'string' ? item.summary : item.summary?.km || ''} ${typeof item.content === 'string' ? item.content : item.content?.km || ''}`;
    const isoMatch = text.match(/\b(202[4-9]-\d{2}-\d{2})\b/);
    if (isoMatch) {
      dateVal = isoMatch[1];
    }
  }

  if (!dateVal) return null;

  try {
    const deadline = new Date(dateVal);
    if (isNaN(deadline.getTime())) {
      return {
        dateStr: dateVal,
        formattedDate: dateVal,
        daysRemaining: 10,
        status: 'active',
        label: `ឈប់ទទួល៖ ${dateVal}`,
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badgeText: 'កំពុងទទួលពាក្យ',
        examDate: examDateVal,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDay = new Date(deadline);
    deadlineDay.setHours(0, 0, 0, 0);

    const diffTime = deadlineDay.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const formattedDate = deadline.toLocaleDateString('km-KH', { month: 'long', day: 'numeric', year: 'numeric' });

    if (daysRemaining < 0) {
      return {
        dateStr: dateVal,
        formattedDate,
        daysRemaining,
        status: 'expired',
        label: `ផុតកំណត់ (${formattedDate})`,
        badgeBg: 'bg-slate-100 text-slate-500 border-slate-200',
        badgeText: 'បានផុតកំណត់',
        examDate: examDateVal,
      };
    } else if (daysRemaining === 0) {
      return {
        dateStr: dateVal,
        formattedDate,
        daysRemaining,
        status: 'urgent',
        label: `ផុតកំណត់ថ្ងៃនេះ! (${formattedDate})`,
        badgeBg: 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse',
        badgeText: 'ថ្ងៃចុងក្រោយ!',
        examDate: examDateVal,
      };
    } else if (daysRemaining <= 3) {
      return {
        dateStr: dateVal,
        formattedDate,
        daysRemaining,
        status: 'urgent',
        label: `នៅសល់ ${daysRemaining} ថ្ងៃទៀត (${formattedDate})`,
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
        badgeText: `នៅសល់ ${daysRemaining} ថ្ងៃ`,
        examDate: examDateVal,
      };
    } else if (daysRemaining <= 7) {
      return {
        dateStr: dateVal,
        formattedDate,
        daysRemaining,
        status: 'closing_soon',
        label: `នៅសល់ ${daysRemaining} ថ្ងៃទៀត (${formattedDate})`,
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        badgeText: `នៅសល់ ${daysRemaining} ថ្ងៃ`,
        examDate: examDateVal,
      };
    } else {
      return {
        dateStr: dateVal,
        formattedDate,
        daysRemaining,
        status: 'active',
        label: `នៅសល់ ${daysRemaining} ថ្ងៃទៀត (${formattedDate})`,
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badgeText: `នៅសល់ ${daysRemaining} ថ្ងៃ`,
        examDate: examDateVal,
      };
    }
  } catch {
    return null;
  }
}

export const AnnouncementsPage: React.FC = () => {
  const { setCurrentPage, setSelectedAnnouncement } = useApp() as any;
  const [filter, setFilter] = useState<'all' | 'new' | 'important'>('all');
  const [liveAnnouncements, setLiveAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const res = await api('/announcements');
        if (res?.announcements && Array.isArray(res.announcements)) {
          setLiveAnnouncements(res.announcements);
        }
      } catch (err) {
        console.warn('Error fetching live announcements from database:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Always sort announcements by newest / latest update first
  const sortedAnnouncements = [...liveAnnouncements].sort((a: any, b: any) => {
    const timeA = new Date(a.publishDate || a.updatedAt || a.date || 0).getTime();
    const timeB = new Date(b.publishDate || b.updatedAt || b.date || 0).getTime();
    if (timeB !== timeA) return timeB - timeA;
    return (b.announcementId || b.id || 0) - (a.announcementId || a.id || 0);
  });

  // Pick the latest updated announcement directly from live database items
  const featuredItem = sortedAnnouncements[0] || null;

  const handleCardClick = (item: any) => {
    if (setSelectedAnnouncement) {
      setSelectedAnnouncement(item);
    }
    setCurrentPage('announcement-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper extraction for featured banner
  const featuredTitle = featuredItem 
    ? (typeof featuredItem.title === 'string' ? featuredItem.title : featuredItem.title?.km || featuredItem.title?.en || '')
    : '';
  const featuredSummary = featuredItem
    ? (typeof featuredItem.summary === 'string' ? featuredItem.summary : featuredItem.summary?.km || featuredItem.summary?.en || featuredItem.content?.km || featuredItem.content || '')
    : '';
  const featuredDate = featuredItem
    ? formatKhmerDate(featuredItem.publishDate || featuredItem.date)
    : '';
  const featuredBadgeText = featuredItem?.isUrgent
    ? 'សេចក្តីប្រកាសសំខាន់'
    : (featuredItem?.category === 'recruitment' ? 'សេចក្តីប្រកាសជ្រើសរើស' : 'សេចក្តីប្រកាសផ្លូវការ');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn max-w-[1400px] mx-auto">
      
      {/* Hero Announcement Card (Directly Clickable) */}
      {featuredItem && (
        <div
          onClick={() => handleCardClick(featuredItem)}
          className="relative overflow-hidden rounded-3xl p-7 sm:p-10 lg:p-12 border border-slate-200 min-h-[260px] sm:min-h-[280px] flex items-center bg-[#f0f4f9] cursor-pointer"
        >
          <img
            src="/announcement-background.jpeg"
            alt="Announcement Card Background"
            className="absolute inset-0 w-full h-full object-cover object-right select-none pointer-events-none"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#eef2f7] via-[#eef2f7]/95 via-45% to-transparent w-full md:w-3/5" />

          <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
            {/* Title from database */}
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-black tracking-tight leading-[1.25]">
              {featuredTitle}
            </h1>

            {/* Content/Detail from database */}
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-xl line-clamp-2">
              {featuredSummary}
            </p>
          </div>
        </div>
      )}

      {/* Section Header: All Announcements (សេចក្តីប្រកាសទាំងអស់) */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-black" />
          <h2 className="text-xl sm:text-2xl font-bold text-black">
            សេចក្តីប្រកាសទាំងអស់
          </h2>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
              <div className="h-12 bg-slate-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : sortedAnnouncements.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-600">មិនទាន់មានសេចក្តីប្រកាសនៅក្នុងប្រព័ន្ធនៅឡើយទេ</p>
        </div>
      ) : (
        /* Announcement Cards Grid (Sorted by newest / latest update first) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedAnnouncements.map((item: any, idx: number) => {
            const title = typeof item.title === 'string' ? item.title : item.title?.km || item.title?.en || '';
            const summary = typeof item.summary === 'string' ? item.summary : item.summary?.km || item.summary?.en || item.content?.km || item.content || '';

            return (
              <div
                key={item.announcementId || item.id || idx}
                onClick={() => handleCardClick(item)}
                className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-3">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-black line-clamp-2">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-normal">
                    {summary}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-black">
                    <span>មើលសេចក្តីលម្អិត</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
