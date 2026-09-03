import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
} from 'lucide-react';
import { formatKhmerDate } from '../../utils/formatDate';
import { formatCategoryKhmer } from './AnnouncementsPage';

export const AnnouncementDetailPage: React.FC = () => {
  const { selectedAnnouncement, setCurrentPage } = useApp() as any;

  if (!selectedAnnouncement) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3">
        <p className="text-xs sm:text-sm text-slate-500 font-normal">មិនមានព័ត៌មានសេចក្តីប្រកាសដែលបានជ្រើសរើសទេ។</p>
        <button
          onClick={() => setCurrentPage('announcements')}
          className="px-4 py-2 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal transition shadow-2xs cursor-pointer"
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

  // Extract attached documents
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
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={() => setCurrentPage('announcements')}
        className="inline-flex items-center gap-2 text-xs font-normal text-slate-600 hover:text-black transition cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>ត្រឡប់ទៅបញ្ជីសេចក្តីប្រកាស</span>
      </button>

      {/* Main Announcement Card (Clean Monochrome) */}
      <article className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        
        {/* Header meta */}
        <div className="space-y-3 border-b border-slate-100 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-normal bg-slate-100 text-black border border-slate-200">
              {formatCategoryKhmer(ann.category)}
            </span>
            {ann.isUrgent && (
              <span className="px-3 py-1 rounded-full text-xs font-normal bg-black text-white border border-black">
                សំខាន់
              </span>
            )}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-normal ml-auto">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{dateFormatted}</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-normal text-black leading-snug tracking-tight">
            {title}
          </h1>

          {summary && (
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed pt-1">
              {summary}
            </p>
          )}
        </div>

        {/* Content Body */}
        {content && (
          <div className="space-y-2">
            <h2 className="text-xs font-normal text-slate-400 uppercase tracking-wider">សេចក្តីលម្អិត</h2>
            <div className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
              {content}
            </div>
          </div>
        )}

        {/* Attached PDF Documents (Clean Monochrome) */}
        {attachedDocs.length > 0 && (
          <div className="border-t border-slate-100 pt-6 space-y-3">
            <h2 className="text-xs font-normal text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>ឯកសារភ្ជាប់ (ទាញយក)</span>
            </h2>
            <div className="space-y-2">
              {attachedDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-black flex items-center justify-center font-normal text-[11px] shrink-0">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-normal text-black truncate">{doc.name}</p>
                      <p className="text-[11px] text-slate-400 font-normal">{doc.size}</p>
                    </div>
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-white text-black border border-slate-300 font-normal text-xs flex items-center gap-1.5 shrink-0"
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
