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
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-100 text-black">
              {badge.label}
            </span>
            {announcement.isUrgent && (
              <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-black text-white border border-black">
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
            <h2 className="text-lg sm:text-xl font-medium text-black leading-snug">{announcement.title}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 font-normal">
              <span>Target: <strong className="text-black font-medium">{announcement.exam?.examName || 'All Candidates'}</strong></span>
              <span>•</span>
              <span>Published: {new Date(announcement.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {deadline && (
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-black flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" /> Application Timeline & Deadline
                </span>
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-white text-black border border-slate-200">
                  {deadline.label}
                </span>
              </div>
              <p className="text-sm font-normal text-black">{deadline.formattedDate}</p>
            </div>
          )}

          {announcement.summary && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Summary</p>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">{announcement.summary}</p>
            </div>
          )}

          {announcement.content && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Announcement Content</p>
              <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-normal">
                {announcement.content}
              </div>
            </div>
          )}

          {/* Requirements Display if available */}
          {(() => {
            let reqText = '';
            if (Array.isArray(announcement.attachments)) {
              const meta = announcement.attachments.find((item: any) => item?.requirements);
              if (meta?.requirements) reqText = meta.requirements;
            } else if (announcement.attachments && typeof announcement.attachments === 'object') {
              reqText = (announcement.attachments as any).requirements || '';
            }
            if (!reqText) return null;
            return (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-black uppercase tracking-wider">Requirements & Eligibility (លក្ខខណ្ឌជ្រើសរើស)</p>
                <div className="text-sm text-black whitespace-pre-wrap leading-relaxed bg-slate-100 p-4 rounded-2xl border border-slate-200 font-normal">
                  {reqText}
                </div>
              </div>
            );
          })()}

          {/* Attachments */}
          {announcement.attachments && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Attached Documents</p>
              {Array.isArray(announcement.attachments) ? (
                announcement.attachments
                  .filter((att: any) => att?.url || att?.pdfUrl)
                  .map((att: any, idx: number) => {
                    const fileUrl = att.pdfUrl || att.url;
                    return (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-2 text-xs text-black">
                          <FileText className="w-4 h-4 text-slate-600" />
                          <span className="font-normal">{att.name || 'Official Document'}</span>
                        </div>
                        <button
                          onClick={() => onPreviewPdf(fileUrl)}
                          className="px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-lg text-xs font-normal transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-300" /> View PDF
                        </button>
                      </div>
                    );
                  })
              ) : typeof announcement.attachments === 'string' && announcement.attachments.startsWith('http') ? (
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-black">
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span className="font-normal">Attached PDF Document</span>
                  </div>
                  <button
                    onClick={() => onPreviewPdf(announcement.attachments)}
                    className="px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-lg text-xs font-normal transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-300" /> View PDF
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
            className="text-xs font-normal text-slate-500 hover:text-black flex items-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Announcement
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-black rounded-xl text-xs font-normal transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
