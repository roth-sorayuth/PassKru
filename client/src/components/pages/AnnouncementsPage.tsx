import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, Clock, FileText } from 'lucide-react';

interface AnnouncementItem {
  id: string;
  badge: {
    type: 'deadline' | 'general' | 'urgent';
    text: { km: string; en: string };
    subText?: { km: string; en: string };
  };
  timeAgo: { km: string; en: string };
  title: { km: string; en: string };
  description: { km: string; en: string };
  authorInitial: string;
  authorBg: string;
  hasLeftBorder?: boolean;
  borderColor?: string;
}

export const AnnouncementsPage: React.FC = () => {
  const { setCurrentPage, setSelectedAnnouncement, mockAnnouncements } = useApp() as any;
  const { lang } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'new' | 'important'>('new');

  const announcementList: AnnouncementItem[] = [
    {
      id: 'ann-1',
      badge: {
        type: 'deadline',
        text: { km: 'កាលបរិច្ឆេទឈប់ទទួល៖ 12', en: 'Deadline: 12' },
        subText: { km: 'ថ្ងៃនៅសល់', en: 'Days Left' },
      },
      timeAgo: { km: '2 ម៉ោង មុន', en: '2 hours ago' },
      title: { km: 'ការណែនាំស្តីពីការបំពេញទម្រង់ពាក្យប្រឡង', en: 'Guidelines for Completing the Exam Application Form' },
      description: {
        km: 'សូមអានការណែនាំនេះឱ្យបានលម្អិតមុនពេលចាប់ផ្តើមបំពេញទម្រង់ពាក្យ ដើម្បីចៀសវាងកំហុសឆ្គងដែលអាច...',
        en: 'Please read these guidelines carefully before filling out the application form, to avoid possible mistakes...',
      },
      authorInitial: 'គ',
      authorBg: 'bg-[#1b4d89]',
      hasLeftBorder: true,
      borderColor: 'border-l-emerald-500',
    },
    {
      id: 'ann-2',
      badge: {
        type: 'general',
        text: { km: 'ព័ត៌មានទូទៅ', en: 'General Information' },
      },
      timeAgo: { km: 'ម្សិលមិញ', en: 'Yesterday' },
      title: { km: 'ឯកសារយោងសម្រាប់ការត្រៀមប្រឡង', en: 'Reference Materials for Exam Preparation' },
      description: {
        km: 'ក្រសួងបានបញ្ចេញនូវបញ្ជីឯកសារយោង និងសៀវភៅសិក្សាដែលបេក្ខជនគួរអាន ដើម្បីត្រៀមខ្លួនសម្រាប់ការប្រឡងជ្រើសរើសគ្រូបង្រៀនឆ្នាំនេះ។',
        en: "The Ministry has released a list of reference materials and study books candidates should read to prepare for this year's teacher recruitment exam.",
      },
      authorInitial: 'H',
      authorBg: 'bg-[#824d1a]',
      hasLeftBorder: true,
      borderColor: 'border-l-[#0a3263]',
    },
  ];

  const handleCardClick = (id: string) => {
    if (setSelectedAnnouncement && mockAnnouncements) {
      const found = mockAnnouncements.find((a: any) => a.id === id) || mockAnnouncements[0];
      setSelectedAnnouncement(found);
    }
    setCurrentPage('announcement-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn max-w-[1400px] mx-auto">
      
      {/* Hero Banner with Angkor Wat landscape styling using announcement-background.jpeg */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-14 shadow-sm border border-slate-100/80 min-h-[340px] flex items-center">
        
        {/* Real image background */}
        <img
          src="/announcement-background.jpeg"
          alt="Angkor Wat Banner Background"
          className="absolute inset-0 w-full h-full object-cover object-right"
        />

        {/* Gradient Overlay on Left Side for High Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#eef2f7] via-[#eef2f7]/90 to-transparent w-full md:w-3/5"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl space-y-5">
          {/* Badge & Date */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fde8e8] text-[#e03131]">
              <span className="text-sm">📢</span> {lang === 'km' ? 'សេចក្តីប្រកាសសំខាន់' : 'Important Announcement'}
            </span>
            <span className="text-xs sm:text-sm font-medium text-[#486581]">
              {lang === 'km' ? 'ថ្ងៃទី ២៤ តុលា ២០២៣' : 'October 24, 2023'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a2540] tracking-tight leading-[1.2]">
            {lang === 'km' ? 'ការចុះឈ្មោះប្រឡងគ្រូបង្រៀនបើកជាផ្លូវការហើយ!' : 'Teacher Exam Registration Is Now Officially Open!'}
          </h1>

          {/* Subtitle / Description */}
          <p className="text-sm sm:text-base text-[#486581] font-medium leading-relaxed max-w-xl">
            {lang === 'km'
              ? 'សូមស្វាគមន៍មកកាន់ប្រព័ន្ធប្រឡងជ្រើសរើសគ្រូបង្រៀន។ បេក្ខជនទាំងអស់អាចចាប់ផ្តើមដាក់ពាក្យប្រឡងចាប់ពីថ្ងៃនេះតទៅ។ សូមរួសរាន់ឡើង ចំនួនមានកំណត់!'
              : "Welcome to the teacher recruitment exam system. All candidates can start applying from today. Hurry, seats are limited!"}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                setCurrentPage('requirements');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#0a3263] hover:bg-[#082447] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <span>{lang === 'km' ? 'ចុះឈ្មោះឥឡូវនេះ' : 'Register Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setCurrentPage('requirements');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#0a3263] hover:text-[#082447] font-bold text-sm px-4 py-3 transition cursor-pointer"
            >
              {lang === 'km' ? 'មើលលក្ខខណ្ឌ' : 'View Requirements'}
            </button>
          </div>
        </div>
      </div>

      {/* Section Header: All Announcements */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-[#0a3263]" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
            {lang === 'km' ? 'សេចក្តីប្រកាសទាំងអស់' : 'All Announcements'}
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              filter === 'new'
                ? 'bg-[#d8e6f8] text-[#0a3263]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {lang === 'km' ? 'ថ្មីៗ' : 'New'}
          </button>
          <button
            onClick={() => setFilter('important')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              filter === 'important'
                ? 'bg-[#d8e6f8] text-[#0a3263]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {lang === 'km' ? 'សំខាន់' : 'Important'}
          </button>
        </div>
      </div>

      {/* Announcement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcementList.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item.id)}
            className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200/80 flex flex-col justify-between cursor-pointer group ${
              item.hasLeftBorder ? `border-l-4 ${item.borderColor}` : ''
            }`}
          >
            <div className="space-y-4">
              {/* Card Header: Badge & Time */}
              <div className="flex items-center justify-between gap-2">
                {item.badge.type === 'deadline' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#d4f8e8] text-[#0e7048]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.badge.text[lang]}</span>
                    {item.badge.subText && (
                      <span className="text-[11px] font-semibold opacity-85">
                        {item.badge.subText[lang]}
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#e8eef8] text-[#33568a]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.badge.text[lang]}</span>
                  </span>
                )}

                <span className="text-xs font-medium text-slate-400">
                  {item.timeAgo[lang]}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#0a2540] group-hover:text-[#0a3263] transition line-clamp-2">
                {item.title[lang]}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#627d98] line-clamp-3 leading-relaxed font-normal">
                {item.description[lang]}
              </p>
            </div>

            {/* Card Footer: Author & Read More */}
            <div className="pt-6 flex items-center justify-between border-t border-slate-100 mt-4">
              <div className={`w-8 h-8 rounded-full ${item.authorBg} text-white flex items-center justify-center text-xs font-bold shadow-2xs`}>
                {item.authorInitial}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0a3263] group-hover:text-[#082447] transition">
                <span>{lang === 'km' ? 'អានបន្ថែម' : 'Read More'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
