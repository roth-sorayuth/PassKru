import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { mockAnnouncements } from '../data/mockData';
import { Announcement, ExamTarget } from '../types';
import {
  CalendarDays,
  Search,
  Filter,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Download,
  Calendar
} from 'lucide-react';

export const ExamInfoPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { setSelectedAnnouncement, setCurrentPage } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedExamTarget, setSelectedExamTarget] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: { km: 'ទាំងអស់', en: 'All Categories' } },
    { id: 'recruitment', label: { km: 'សេចក្តីជ្រើសរើស (Recruitment)', en: 'Recruitment' } },
    { id: 'schedule', label: { km: 'កាលវិភាគប្រឡង (Schedule)', en: 'Schedule' } },
    { id: 'guideline', label: { km: 'គោលការណ៍ណែនាំ (Guidelines)', en: 'Guidelines' } },
    { id: 'result', label: { km: 'លទ្ធផលប្រឡង (Results)', en: 'Results' } },
  ];

  const examTargets = [
    { id: 'all', label: { km: 'គ្រប់ក្របខណ្ឌ', en: 'All Levels' } },
    { id: 'nie', label: { km: 'NIE (គ្រូវិទ្យាល័យ)', en: 'NIE (Upper Secondary)' } },
    { id: 'rttc', label: { km: 'RTTC (គ្រូអនុ)', en: 'RTTC (Lower Secondary)' } },
    { id: 'pttc', label: { km: 'PTTC (គ្រូបឋម)', en: 'PTTC (Primary)' } },
    { id: 'kindergarten', label: { km: 'មត្តេយ្យ', en: 'Kindergarten' } },
  ];

  const filteredAnnouncements = mockAnnouncements.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesTarget = selectedExamTarget === 'all' || item.targetExam.includes(selectedExamTarget as ExamTarget);
    const matchesSearch =
      item.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary[lang].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTarget && matchesSearch;
  });

  const handleOpenAnnouncement = (ann: Announcement) => {
    setSelectedAnnouncement(ann);
    setCurrentPage('announcement-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <CalendarDays className="w-4 h-4" />
          <span>{lang === 'km' ? 'មជ្ឈមណ្ឌលព័ត៌មានប្រឡងផ្លូវការ' : 'Official Examination Information Hub'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          {lang === 'km' ? 'ព័ត៌មាន & សេចក្តីប្រកាសប្រឡងគ្រូ ២០២៦' : 'Teacher Exam Announcements & Schedule 2026'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {lang === 'km'
            ? 'បច្ចុប្បន្នភាពផ្លូវការពីក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS) ស្តីពីកាលវិភាគ ឯកសារតម្រូវ និងបទបញ្ជាប្រឡង។'
            : 'Verified official updates on examination timelines, registration procedures, quotas, and MoEYS guidelines.'}
        </p>
      </div>

      {/* Interactive Key Timeline Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              {lang === 'km' ? 'កាលវិភាគសំខាន់ៗ សម័យប្រឡង ២០២៦' : 'Key Official Examination Milestones 2026'}
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('requirements')}
            className="text-xs text-indigo-200 hover:text-white underline flex items-center gap-1 cursor-pointer"
          >
            <span>{lang === 'km' ? 'ពិនិត្យលក្ខខណ្ឌដាក់ពាក្យ' : 'Check Eligibility Rules'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-1 relative">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              {lang === 'km' ? 'ដំណាក់កាលទី ១' : 'Phase 1'}
            </span>
            <h3 className="text-sm font-bold text-white">{lang === 'km' ? 'បើកទទួលពាក្យ' : 'Applications Open'}</h3>
            <p className="text-xl font-black text-amber-400">01 - 30 កញ្ញា 2026</p>
            <p className="text-[11px] text-slate-300">{lang === 'km' ? 'នៅមន្ទីរអប់រំ ឬប្រព័ន្ធអនឡាញ' : 'Provincial offices & portal'}</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-1 relative">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
              {lang === 'km' ? 'ដំណាក់កាលទី ២' : 'Phase 2'}
            </span>
            <h3 className="text-sm font-bold text-white">{lang === 'km' ? 'ផ្សាយបញ្ជីឈ្មោះបេក្ខជន' : 'Candidate Registry'}</h3>
            <p className="text-xl font-black text-indigo-300">15 តុលា 2026</p>
            <p className="text-[11px] text-slate-300">{lang === 'km' ? 'បិទផ្សាយនៅតាមមណ្ឌលប្រឡង' : 'Posted at exam centers'}</p>
          </div>

          <div className="bg-indigo-600/60 rounded-2xl p-4 border border-indigo-400/40 space-y-1 relative ring-2 ring-amber-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <span>★</span> {lang === 'km' ? 'សម័យប្រឡងផ្លូវការ' : 'Official Exam Date'}
            </span>
            <h3 className="text-sm font-bold text-white">{lang === 'km' ? 'ថ្ងៃប្រឡងសំណេរ' : 'Written Examinations'}</h3>
            <p className="text-xl font-black text-amber-300">25 - 26 តុលា 2026</p>
            <p className="text-[11px] text-indigo-100">{lang === 'km' ? 'វប្បធម៌ទូទៅ & មុខវិជ្ជាឯកទេស' : 'General culture & majors'}</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-1 relative">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              {lang === 'km' ? 'ដំណាក់កាលទី ៤' : 'Phase 4'}
            </span>
            <h3 className="text-sm font-bold text-white">{lang === 'km' ? 'ប្រកាសលទ្ធផល' : 'Results Released'}</h3>
            <p className="text-xl font-black text-emerald-400">15 វិច្ឆិកា 2026</p>
            <p className="text-[11px] text-slate-300">{lang === 'km' ? 'ចូលរៀនវគ្គគរុកោសល្យ' : 'Training commencement'}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={lang === 'km' ? 'ស្វែងរកសេចក្តីប្រកាស...' : 'Search announcements...'}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          {/* Target Exam Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {examTargets.map(target => (
              <button
                key={target.id}
                onClick={() => setSelectedExamTarget(target.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedExamTarget === target.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {target.label[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-t border-slate-100 pt-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-base font-bold text-slate-700">
              {lang === 'km' ? 'មិនមានសេចក្តីប្រកាសត្រូវនឹងការស្វែងរកទេ' : 'No announcements match your search'}
            </p>
            <p className="text-xs text-slate-500">
              {lang === 'km' ? 'សូមសាកល្បងជ្រើសរើសតម្រងផ្សេងទៀត។' : 'Try adjusting your filters or search query.'}
            </p>
          </div>
        ) : (
          filteredAnnouncements.map(ann => (
            <div
              key={ann.id}
              onClick={() => handleOpenAnnouncement(ann)}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition cursor-pointer space-y-4 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {ann.isUrgent && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {lang === 'km' ? 'បន្ទាន់ / សំខាន់' : 'Urgent Notice'}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                    {ann.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {ann.targetExam.map(tgt => (
                      <span key={tgt} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 uppercase">
                        {tgt}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ann.date}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  {ann.title[lang]}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {ann.summary[lang]}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-3 text-slate-500">
                  {ann.attachedPdfs && (
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <FileText className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{ann.attachedPdfs.length} {lang === 'km' ? 'ឯកសារភ្ជាប់ PDF' : 'PDF Attachments'}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 font-bold text-indigo-600 group-hover:translate-x-1 transition">
                  <span>{t('viewDetails')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
