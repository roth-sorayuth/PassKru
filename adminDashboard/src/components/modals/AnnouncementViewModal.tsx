import React from 'react';
import { X, Clock, FileText, Trash2, Eye, Calendar, MapPin, BookOpen } from 'lucide-react';
import { AnnouncementItem } from '../../types';
import { getCategoryBadgeKhmer, getDeadlineInfo, formatDateKhmer, parseAnnouncementDetails } from '../../utils/formatters';
import { PdfThumbnail } from '../common/PdfThumbnail';

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

  const parsed = parseAnnouncementDetails(announcement);
  const deadline = getDeadlineInfo(announcement);
  const aboutExam = announcement.aboutExam;
  const examWhen = aboutExam?.when || aboutExam?.examDate;
  const examWhere = aboutExam?.where || aboutExam?.examLocation;
  const examSubjects = Array.isArray(aboutExam?.whatSubject)
    ? aboutExam.whatSubject.join(', ')
    : (aboutExam?.whatSubject || aboutExam?.examSubjects);
  const hasAboutExam = Boolean(examWhen || examWhere || examSubjects);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 font-normal">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-black rounded-3xl overflow-hidden flex flex-col z-10 font-normal">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-normal px-3 py-1 rounded-full border border-gray-300 bg-white text-black">
              {getCategoryBadgeKhmer(announcement.category)}
            </span>
            {announcement.isUrgent && (
              <span className="text-xs font-normal px-3 py-1 rounded-full bg-white text-red-600 border border-gray-300">
                បន្ទាន់
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-black hover:bg-black hover:text-white rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 font-normal">
          {/* Top PDF Thumbnail preview if available */}
          {parsed.pdfUrl && (
            <div 
              onClick={() => onPreviewPdf(parsed.pdfUrl!)}
              className="relative aspect-[210/297] max-h-[450px] mx-auto bg-white rounded-2xl overflow-hidden border border-black cursor-pointer group"
              title="ចុចដើម្បីបើកមើលឯកសារ PDF"
            >
              <PdfThumbnail url={parsed.pdfUrl} fallbackTitle={announcement.title} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-normal border border-black flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-white" /> បើកមើល PDF ផ្លូវការ
                </span>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg sm:text-xl font-normal text-black leading-snug">{announcement.title}</h2>
            <div className="flex items-center gap-3 text-xs text-black mt-2 font-normal">
              <span>គោលដៅ: {announcement.exam?.examName || 'បេក្ខជនទាំងអស់'}</span>
              <span>•</span>
              <span>ផ្សាយ: {formatDateKhmer(announcement.publishDate)}</span>
            </div>
          </div>

          {/* About Exam Section */}
          {hasAboutExam && (
            <div className="p-4 rounded-2xl border border-black bg-white space-y-3 font-normal">
              <span className="text-xs font-normal text-black flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-black" /> ព័ត៌មានអំពីការប្រឡង (About Exam)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-normal">
                {examWhen && (
                  <div className="space-y-0.5">
                    <span className="text-black font-normal flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-black" /> កាលបរិច្ឆេទ / ពេល
                    </span>
                    <p className="font-normal text-black">{examWhen}</p>
                  </div>
                )}
                {examWhere && (
                  <div className="space-y-0.5">
                    <span className="text-black font-normal flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-black" /> ទីតាំង / មណ្ឌល
                    </span>
                    <p className="font-normal text-black">{examWhere}</p>
                  </div>
                )}
                {examSubjects && (
                  <div className="sm:col-span-2 space-y-0.5 pt-1 border-t border-black">
                    <span className="text-black font-normal flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-black" /> មុខវិជ្ជាប្រឡង
                    </span>
                    <p className="font-normal text-black">{examSubjects}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {deadline && (
            <div className="p-4 rounded-2xl border border-black bg-white space-y-2 font-normal">
              <div className="flex items-center justify-between">
                <span className="text-xs font-normal text-black flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-black" /> កាលបរិច្ឆេទឈប់ទទួលពាក្យ
                </span>
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-white text-black border border-black">
                  {deadline.label}
                </span>
              </div>
              <p className="text-sm font-normal text-black">{deadline.formattedDate}</p>
            </div>
          )}

          {announcement.summary && (
            <div className="p-4 bg-white rounded-2xl border border-black font-normal">
              <p className="text-xs font-normal text-black mb-1">សេចក្តីសង្ខេប</p>
              <p className="text-sm text-black leading-relaxed font-normal">{announcement.summary}</p>
            </div>
          )}

          {announcement.content && (
            <div className="space-y-1.5 font-normal">
              <p className="text-xs font-normal text-black">ខ្លឹមសារសេចក្តីប្រកាស</p>
              <div className="text-sm text-black whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-2xl border border-black font-normal">
                {announcement.content}
              </div>
            </div>
          )}

          {/* Requirements Display */}
          {parsed.requirements && (
            <div className="space-y-1.5 font-normal">
              <p className="text-xs font-normal text-black">លក្ខខណ្ឌជ្រើសរើស និងសិទ្ធិប្រឡង</p>
              <div className="text-sm text-black whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-2xl border border-black font-normal">
                {parsed.requirements}
              </div>
            </div>
          )}

          {/* Attached Documents */}
          {parsed.pdfUrl && (
            <div className="space-y-2 pt-2 font-normal">
              <p className="text-xs font-normal text-black">ឯកសារភ្ជាប់ផ្លូវការ</p>
              <div className="flex items-center justify-between p-3.5 bg-white border border-black rounded-2xl">
                <div className="flex items-center gap-2 text-xs text-black font-normal">
                  <FileText className="w-4 h-4 text-black" />
                  <span>ឯកសារប្រកាសផ្លូវការ (PDF)</span>
                </div>
                <button
                  onClick={() => onPreviewPdf(parsed.pdfUrl!)}
                  className="px-3.5 py-1.5 bg-black hover:bg-white hover:text-black border border-black text-white rounded-xl text-xs font-normal transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> បើកមើល PDF
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-black bg-white flex items-center justify-between font-normal">
          <button
            onClick={() => {
              if (window.confirm('តើអ្នកពិតជាចង់លុបសេចក្តីប្រកាសនេះមែនទេ?')) {
                onDelete(announcement.announcementId);
                onClose();
              }
            }}
            className="text-xs font-normal text-black hover:bg-black hover:text-white px-3 py-2 rounded-xl border border-black flex items-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> លុបសេចក្តីប្រកាស
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-black hover:bg-white hover:text-black border border-black text-white rounded-xl text-xs font-normal transition cursor-pointer"
          >
            បិទ
          </button>
        </div>
      </div>
    </div>
  );
};
