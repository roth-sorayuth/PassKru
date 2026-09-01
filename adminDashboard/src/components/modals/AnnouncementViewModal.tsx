import React from 'react';
import { X, Clock, FileText, Trash2, Eye } from 'lucide-react';
import { AnnouncementItem } from '../../types';
import { getCategoryBadge, getDeadlineInfo } from '../../utils/formatters';

interface AnnouncementViewModalProps {
  announcement: AnnouncementItem | null;
  onClose: () => void;
  onDelete: (id: number) => void;
  onPreviewPdf: (url: string) => void;
}

export const AnnouncementViewModal: React.FC<AnnouncementViewModalProps> = ({
  announcement,
  onClose,
  onDelete,
  onPreviewPdf,
}) => {
  if (!announcement) return null;

  const badge = getCategoryBadge(announcement.category);
  const deadline = getDeadlineInfo(announcement);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
              {badge.label}
            </span>
            {announcement.isUrgent && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                Urgent
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-black rounded-lg hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{announcement.title}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
              <span>Target: <strong className="text-[#0a3263]">{announcement.exam?.examName || 'All Candidates'}</strong></span>
              <span>•</span>
              <span>Published: {new Date(announcement.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {deadline && (
            <div className={`p-4 rounded-2xl border ${deadline.badgeBg} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Application Timeline & Deadline
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/80 border border-current">
                  {deadline.label}
                </span>
              </div>
              <p className="text-sm font-semibold">{deadline.formattedDate}</p>
            </div>
          )}

          {announcement.summary && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Summary</p>
              <p className="text-sm text-slate-700 leading-relaxed">{announcement.summary}</p>
            </div>
          )}

          {announcement.content && (
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Announcement Content</p>
              <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-normal">
                {announcement.content}
              </div>
            </div>
          )}

          {/* Attachments */}
          {announcement.attachments && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attached Documents</p>
              {Array.isArray(announcement.attachments) ? (
                announcement.attachments
                  .filter((att: any) => att?.url || att?.pdfUrl)
                  .map((att: any, idx: number) => {
                    const fileUrl = att.pdfUrl || att.url;
                    return (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-2 text-xs text-slate-800">
                          <FileText className="w-4 h-4 text-[#0a3263]" />
                          <span className="font-medium">{att.name || 'Official Document'}</span>
                        </div>
                        <button
                          onClick={() => onPreviewPdf(fileUrl)}
                          className="px-3 py-1.5 bg-[#0a3263] hover:bg-[#0f3360] text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> View PDF
                        </button>
                      </div>
                    );
                  })
              ) : typeof announcement.attachments === 'string' && announcement.attachments.startsWith('http') ? (
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-slate-800">
                    <FileText className="w-4 h-4 text-[#0a3263]" />
                    <span className="font-medium">Attached PDF Document</span>
                  </div>
                  <button
                    onClick={() => onPreviewPdf(announcement.attachments)}
                    className="px-3 py-1.5 bg-[#0a3263] hover:bg-[#0f3360] text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" /> View PDF
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              onDelete(announcement.announcementId);
              onClose();
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Announcement
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
