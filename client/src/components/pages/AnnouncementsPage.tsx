import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Clock, FileText, Calendar, Flame, AlertCircle } from 'lucide-react';
import { api } from '../../utils/api';

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
      // Return custom formatted label if not standard parseable ISO
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
  const { setCurrentPage, setSelectedAnnouncement, mockAnnouncements } = useApp() as any;
  const [filter, setFilter] = useState<'all' | 'new' | 'important'>('new');
  const [liveAnnouncements, setLiveAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const res = await api('/announcements');
        if (res?.announcements && res.announcements.length > 0) {
          setLiveAnnouncements(res.announcements);
        }
      } catch (err) {
        console.warn('Using mock announcements fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const itemsToDisplay = liveAnnouncements.length > 0 
    ? liveAnnouncements 
    : (mockAnnouncements || []);

  const filteredItems = itemsToDisplay.filter((item: any) => {
    if (filter === 'important') return item.isUrgent === true;
    return true;
  });

  const handleCardClick = (item: any) => {
    if (setSelectedAnnouncement) {
      setSelectedAnnouncement(item);
    }
    setCurrentPage('announcement-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn max-w-[1400px] mx-auto">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-14 shadow-sm border border-slate-100/80 min-h-[340px] flex items-center">
        <img
          src="/announcement-background.jpeg"
          alt="Angkor Wat Banner Background"
          className="absolute inset-0 w-full h-full object-cover object-right"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#eef2f7] via-[#eef2f7]/90 to-transparent w-full md:w-3/5" />

        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fde8e8] text-[#e03131]">
              <span className="text-sm">📢</span> សេចក្តីប្រកាសផ្លូវការ
            </span>
            <span className="text-xs sm:text-sm font-medium text-[#486581]">
              ក្រសួងអប់រំ យុវជន និងកីឡា
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a2540] tracking-tight leading-[1.2]">
            ការប្រឡងជ្រើសរើសគ្រូបង្រៀន ឆ្នាំ២០២៦
          </h1>

          <p className="text-sm sm:text-base text-[#486581] font-medium leading-relaxed max-w-xl">
            សូមស្វាគមន៍មកកាន់ប្រព័ន្ធព័ត៌មានប្រឡងជ្រើសរើសគ្រូបង្រៀន។ បេក្ខជនទាំងអស់អាចពិនិត្យមើលកាលបរិច្ឆេទឈប់ទទួលពាក្យ និងកាលវិភាគប្រឡងជាក់ស្តែងនៅទីនេះ។
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                setCurrentPage('requirements');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#0a3263] hover:bg-[#082447] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <span>ពិនិត្យលក្ខខណ្ឌជ្រើសរើស</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Section Header: សេចក្តីប្រកាសទាំងអស់ */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-[#0a3263]" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
            សេចក្តីប្រកាសទាំងអស់
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              filter === 'all'
                ? 'bg-[#d8e6f8] text-[#0a3263]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ទាំងអស់
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              filter === 'new'
                ? 'bg-[#d8e6f8] text-[#0a3263]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ថ្មីៗ
          </button>
          <button
            onClick={() => setFilter('important')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              filter === 'important'
                ? 'bg-[#d8e6f8] text-[#0a3263]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            សំខាន់ & បន្ទាន់ 🔥
          </button>
        </div>
      </div>

      {/* Announcement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item: any, idx: number) => {
          const deadline = getCardDeadlineInfo(item);
          const title = typeof item.title === 'string' ? item.title : item.title?.km || item.title?.en || '';
          const summary = typeof item.summary === 'string' ? item.summary : item.summary?.km || item.summary?.en || item.content?.km || item.content || '';
          const date = item.publishDate ? new Date(item.publishDate).toLocaleDateString('km-KH') : item.date || 'ថ្មីៗ';
          const examName = item.exam?.examName || 'គ្រប់កម្រិត';

          return (
            <div
              key={item.announcementId || item.id || idx}
              onClick={() => handleCardClick(item)}
              className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border flex flex-col justify-between cursor-pointer group ${
                item.isUrgent ? 'border-rose-300 bg-gradient-to-b from-rose-50/20 to-white' : 'border-slate-200/80 hover:border-indigo-300'
              }`}
            >
              <div className="space-y-4">
                {/* Card Header: Badges & Deadline status */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                      {item.category || 'ដំណឹង'}
                    </span>

                    {item.isUrgent && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                        <Flame className="w-3 h-3 fill-rose-600" /> សំខាន់
                      </span>
                    )}

                    {deadline && (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${deadline.badgeBg}`}>
                        <Clock className="w-3 h-3" />
                        <span>{deadline.badgeText}</span>
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#0a2540] group-hover:text-[#0a3263] transition line-clamp-2 leading-snug">
                  {title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#627d98] line-clamp-2 leading-relaxed font-normal">
                  {summary}
                </p>

                {/* At-a-glance Deadline Highlight Box */}
                {deadline && (
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${deadline.badgeBg}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <Clock className="w-4 h-4 shrink-0 text-indigo-600" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase opacity-80">កាលបរិច្ឆេទផុតកំណត់ទទួលពាក្យ</p>
                        <p className="text-xs font-bold truncate">{deadline.label}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-extrabold px-2.5 py-1 rounded-lg bg-white/80 shadow-2xs">
                      {deadline.daysRemaining >= 0 ? `${deadline.daysRemaining} ថ្ងៃទៀត` : 'ផុតកំណត់'}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-4">
                <span className="text-xs font-semibold text-slate-500">
                  {examName}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0a3263] group-hover:text-[#082447] transition">
                  <span>មើលសេចក្តីលម្អិត</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
