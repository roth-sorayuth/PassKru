import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { mockAnnouncements } from '../../data/mockData';
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Share2,
  Bookmark,
  ShieldCheck,
  CheckCircle2,
  CalendarDays,
  ExternalLink
} from 'lucide-react';

export const AnnouncementDetailPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { selectedAnnouncement, setCurrentPage, setSelectedAnnouncement } = useApp();

  if (!selectedAnnouncement) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-600">No announcement selected.</p>
        <button
          onClick={() => setCurrentPage('exam-info')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold"
        >
          {lang === 'km' ? 'ត្រឡប់ទៅព័ត៌មានប្រឡង' : 'Back to Announcements'}
        </button>
      </div>
    );
  }

  const ann = selectedAnnouncement;
  const relatedAnnouncements = mockAnnouncements.filter(a => a.id !== ann.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={() => setCurrentPage('exam-info')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{lang === 'km' ? 'ត្រឡប់ទៅបញ្ជីសេចក្តីប្រកាស' : 'Back to Announcements List'}</span>
      </button>

      {/* Main Announcement Article */}
      <article className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
        {/* Header meta */}
        <div className="space-y-4 border-b border-slate-100 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
              {ann.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{lang === 'km' ? `ចុះផ្សាយថ្ងៃទី ${ann.date}` : `Published on ${ann.date}`}</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">
              {lang === 'km' ? 'ប្រភពផ្លូវការ៖ ក្រសួងអប់រំ យុវជន និងកីឡា' : 'Official Source: MoEYS'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {ann.title?.[lang] || ann.title?.km || ''}
          </h1>

          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-sm text-indigo-950 font-medium leading-relaxed">
              {ann.summary?.[lang] || ann.summary?.km || ''}
            </p>
          </div>
        </div>

        {/* Important Dates Timeline if available */}
        {ann.importantDates && (
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'km' ? 'កាលបរិច្ឆេទសំខាន់ៗដែលត្រូវកត់សម្គាល់' : 'Important Dates & Deadlines'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ann.importantDates.map((item, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <p className="text-xs text-slate-500 font-medium">{item.label?.[lang] || item.label?.km || ''}</p>
                  <p className="text-sm font-bold text-slate-900">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {ann.content?.[lang] || ann.content?.km || ''}
        </div>

        {/* Attached Resources & Downloads */}
        {ann.attachedPdfs && ann.attachedPdfs.length > 0 && (
          <div className="border-t border-slate-100 pt-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'km' ? 'ឯកសារភ្ជាប់ផ្លូវការ (ទាញយក)' : 'Official Attached Documents (Download)'}</span>
            </h3>
            <div className="space-y-2">
              {ann.attachedPdfs.map((pdf, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">
                      PDF
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{pdf.name}</p>
                      <p className="text-xs text-slate-500">{pdf.size} • {pdf.pages} {lang === 'km' ? 'ទំព័រ' : 'pages'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {}}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-indigo-500 text-slate-700 hover:text-indigo-600 font-bold text-xs shadow-2xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === 'km' ? 'ទាញយក' : 'Download'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Announcements */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          {lang === 'km' ? 'សេចក្តីប្រកាសពាក់ព័ន្ធផ្សេងទៀត' : 'Related Announcements'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {relatedAnnouncements.map(related => (
            <div
              key={related.id}
              onClick={() => {
                setSelectedAnnouncement(related);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-indigo-600">{related.category}</span>
                <span>{related.date}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-indigo-600">
                {related.title?.[lang] || related.title?.km || ''}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2">
                {related.summary?.[lang] || related.summary?.km || ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
