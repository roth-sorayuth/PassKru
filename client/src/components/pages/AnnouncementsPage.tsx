import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, ArrowRight, Clock } from 'lucide-react';
import { api } from '../../utils/api';
import {
  AnnouncementCard,
  formatCategoryKhmer,
  parseAnnouncementPdf,
} from '../common/AnnouncementCard';
import { AnnouncementBadges } from '../common/AnnouncementBadges';

// Re-export helpers for backward compatibility with other pages like AnnouncementDetailPage
export { formatCategoryKhmer, parseAnnouncementPdf };

const textOf = (value: any): string => (typeof value === 'string' ? value : value?.km || value?.en || '');

const KHMER_MONTHS = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
const khmerDigits = (value: number | string) => String(value).replace(/[0-9]/g, (d) => '០១២៣៤៥៦៧៨៩'[Number(d)]);

/** "១០ កញ្ញា ២០២៦", or null when the announcement has no usable date. */
const formatKhmerDate = (item: any): string | null => {
  const raw = item.publishDate || item.date || item.updatedAt;
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return null;
  return `${khmerDigits(d.getDate())} ${KHMER_MONTHS[d.getMonth()]} ${khmerDigits(d.getFullYear())}`;
};

const ALL = 'all';

export const AnnouncementsPage: React.FC = () => {
  const { openAnnouncement } = useApp() as any;
  const [liveAnnouncements, setLiveAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setFailed(false);
      try {
        const res = await api('/announcements');
        if (res?.announcements && Array.isArray(res.announcements)) {
          setLiveAnnouncements(res.announcements);
        }
      } catch (err) {
        console.warn('Error fetching live announcements from database:', err);
        setFailed(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Sort announcements by newest
  const sortedAnnouncements = useMemo(
    () =>
      [...liveAnnouncements].sort((a: any, b: any) => {
        const timeA = new Date(a.publishDate || a.updatedAt || a.date || 0).getTime();
        const timeB = new Date(b.publishDate || b.updatedAt || b.date || 0).getTime();
        if (timeB !== timeA) return timeB - timeA;
        return (b.announcementId || b.id || 0) - (a.announcementId || a.id || 0);
      }),
    [liveAnnouncements]
  );

  const categories = useMemo(
    () => Array.from(new Set(sortedAnnouncements.map((a) => formatCategoryKhmer(a.category)))),
    [sortedAnnouncements]
  );

  const featuredItem = sortedAnnouncements[0] || null;
  const featuredTitle = featuredItem
    ? (typeof featuredItem.title === 'string' ? featuredItem.title : featuredItem.title?.km || featuredItem.title?.en || '')
    : '';
  const featuredSummary = featuredItem
    ? (typeof featuredItem.summary === 'string' ? featuredItem.summary : featuredItem.summary?.km || featuredItem.summary?.en || featuredItem.content?.km || featuredItem.content || '')
    : '';
  const featuredDate = featuredItem ? formatKhmerDate(featuredItem) : null;

  const handleCardClick = (item: any) => {
    openAnnouncement(item);
    document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onKeyActivate = (fn: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* 1. TOP HERO FEATURED CARD with background image */}
      {featuredItem && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleCardClick(featuredItem)}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-200 min-h-[220px] sm:min-h-[250px] flex items-center bg-white cursor-pointer group shadow-xs hover:shadow-md transition"
        >
          <img
            src="/announcement-background.jpeg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-right select-none pointer-events-none transition duration-500 group-hover:scale-[1.02]"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-45% to-transparent w-full md:w-3/5" />

          <div className="relative z-10 max-w-2xl space-y-3 font-normal">
            <AnnouncementBadges category={featuredItem.category} isUrgent={featuredItem.isUrgent} size="md" />

            {/* Title */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight leading-snug">
              {featuredTitle}
            </h1>

            {featuredSummary && (
              <p className="text-xs sm:text-sm text-gray-700 font-normal leading-relaxed max-w-xl line-clamp-2">
                {featuredSummary}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold">
                មើលសេចក្តីលម្អិត
                <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
              </span>
              {featuredDate && (
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-700">
                  <Clock className="w-3.5 h-3.5" />
                  {featuredDate}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. SECTION TITLE: All Announcements in Khmer */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          សេចក្តីប្រកាសទាំងអស់
        </h2>
      </div>

      {/* 3. LIST OF ANNOUNCEMENTS (Two columns on medium and above) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse flex flex-col sm:flex-row gap-3.5 items-center">
              <div className="w-full sm:w-[38%] aspect-[3/4] bg-gray-100 rounded-xl" />
              <div className="w-full sm:w-[62%] space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-24 bg-gray-100 rounded-xl" />
                <div className="h-7 bg-gray-200 rounded w-1/3 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : sortedAnnouncements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 space-y-2 font-normal">
          <FileText className="w-8 h-8 text-gray-400 mx-auto stroke-1" />
          <p className="text-xs sm:text-sm text-gray-600 font-normal">មិនទាន់មានសេចក្តីប្រកាសនៅក្នុងប្រព័ន្ធនៅឡើយទេ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {sortedAnnouncements.map((item: any, idx: number) => (
            <AnnouncementCard
              key={item.announcementId || item.id || idx}
              item={item}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
