import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  ShieldCheck,
  CalendarDays,
  ExternalLink,
  Clock,
  Layers
} from 'lucide-react';
import { formatKhmerDate } from '../../utils/formatDate';

export const AnnouncementDetailPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { selectedAnnouncement, setCurrentPage, setSelectedAnnouncement, mockAnnouncements } = useApp() as any;

  if (!selectedAnnouncement) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-600">មិនមានព័ត៌មានសេចក្តីប្រកាសដែលបានជ្រើសរើសទេ។</p>
        <button
          onClick={() => setCurrentPage('announcements')}
          className="mt-4 px-5 py-2.5 bg-[#0a3263] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#0f2955] transition cursor-pointer"
        >
          ត្រឡប់ទៅសេចក្តីប្រកាស
        </button>
      </div>
    );
  }

  const ann = selectedAnnouncement;
  const title = typeof ann.title === 'string' ? ann.title : ann.title?.km || ann.title?.en || '';
  const summary = typeof ann.summary === 'string' ? ann.summary : ann.summary?.km || ann.summary?.en || '';
  const content = typeof ann.content === 'string' ? ann.content : ann.content?.km || ann.content?.en || '';
  const dateFormatted = formatKhmerDate(ann.publishDate || ann.date);
  const examName = ann.exam?.examName || 'ក្រសួងអប់រំ យុវជន និងកីឡា';

  // Extract metadata and attached documents
  let requirementsText = '';
  let deadlineDate = '';
  let examDate = '';
  let attachedDocs: Array<{ name: string; url: string; size?: string }> = [];

  if (Array.isArray(ann.attachments)) {
    ann.attachments.forEach((att: any) => {
      if (att?.url || att?.pdfUrl) {
        attachedDocs.push({
          name: att.name || 'ឯកសារប្រកាសផ្លូវការ (PDF)',
          url: att.pdfUrl || att.url,
          size: att.size || 'PDF',
        });
      }
      if (att?.requirements) requirementsText = att.requirements;
      if (att?.deadlineDate || att?.registration_deadline) deadlineDate = att.deadlineDate || att.registration_deadline;
      if (att?.examDate) examDate = att.examDate;
    });
  } else if (ann.attachments && typeof ann.attachments === 'object') {
    const attObj = ann.attachments as any;
    if (attObj.url || attObj.pdfUrl) {
      attachedDocs.push({
        name: attObj.name || 'ឯកសារប្រកាសផ្លូវការ (PDF)',
        url: attObj.pdfUrl || attObj.url,
        size: attObj.size || 'PDF',
      });
    }
    if (attObj.requirements) requirementsText = attObj.requirements;
    if (attObj.deadlineDate || attObj.registration_deadline) deadlineDate = attObj.deadlineDate || attObj.registration_deadline;
    if (attObj.examDate) examDate = attObj.examDate;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={() => setCurrentPage('announcements')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0a3263] transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>ត្រឡប់ទៅបញ្ជីសេចក្តីប្រកាស</span>
      </button>

      {/* Main Announcement Article */}
      <article className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
        {/* Header meta */}
        <div className="space-y-4 border-b border-slate-100 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
              {ann.category || 'សេចក្តីជូនដំណឹង'}
            </span>
            {ann.isUrgent && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                📢 សំខាន់ / បន្ទាន់
              </span>
            )}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{dateFormatted}</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">
              {examName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a2540] tracking-tight leading-snug">
            {title}
          </h1>

          {summary && (
            <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-950 font-medium leading-relaxed">
                {summary}
              </p>
            </div>
          )}
        </div>

        {/* Important Dates Timeline if available */}
        {(deadlineDate || examDate) && (
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-600" />
              <span>កាលបរិច្ឆេទសំខាន់ៗ</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {deadlineDate && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <p className="text-xs text-slate-500 font-semibold">កាលបរិច្ឆេទឈប់ទទួលពាក្យ</p>
                  <p className="text-sm font-bold text-rose-600">{formatKhmerDate(deadlineDate)}</p>
                </div>
              )}
              {examDate && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <p className="text-xs text-slate-500 font-semibold">កាលបរិច្ឆេទប្រឡងជាក់ស្តែង</p>
                  <p className="text-sm font-bold text-[#0a3263]">{formatKhmerDate(examDate)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Body */}
        {content && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0a2540] uppercase tracking-wider">សេចក្តីលម្អិត</h3>
            <div className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal bg-slate-50/60 p-6 rounded-2xl border border-slate-100">
              {content}
            </div>
          </div>
        )}

        {/* Requirements Section if available */}
        {requirementsText && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0a2540] flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>លក្ខខណ្ឌជ្រើសរើស និងលក្ខខណ្ឌតម្រូវ</span>
              </h3>
              <button
                onClick={() => {
                  setCurrentPage('requirements');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                មើលលក្ខខណ្ឌទូទៅ →
              </button>
            </div>
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-sm text-indigo-950 whitespace-pre-wrap leading-relaxed">
              {requirementsText}
            </div>
          </div>
        )}

        {/* Attached Resources & Downloads */}
        {attachedDocs.length > 0 && (
          <div className="border-t border-slate-100 pt-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>ឯកសារភ្ជាប់ផ្លូវការ (ទាញយក)</span>
            </h3>
            <div className="space-y-2">
              {attachedDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{doc.name}</p>
                      <p className="text-xs text-slate-500">{doc.size}</p>
                    </div>
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#0a3263] hover:bg-[#0f2955] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ទាញយក / បើកមើល</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

