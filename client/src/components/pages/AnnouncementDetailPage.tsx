import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp, announcementIdFromPath } from '../../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  MapPin,
  BookOpen,
  Eye,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { api } from '../../utils/api';
import { formatCategoryKhmer, parseAnnouncementPdf } from './AnnouncementsPage';
import { PdfThumbnail } from '../common/PdfThumbnail';
import { PdfViewerModal } from '../common/PdfViewerModal';
import { AnnouncementBadges } from '../common/AnnouncementBadges';

export const AnnouncementDetailPage: React.FC = () => {
  const { selectedAnnouncement, setSelectedAnnouncement, setCurrentPage } = useApp() as any;
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);

  // The address is the source of truth: after a refresh or from a shared link,
  // load the announcement named in /announcements/:id.
  const { pathname } = useLocation();
  const urlId = announcementIdFromPath(pathname);
  const selectedId = selectedAnnouncement ? String(selectedAnnouncement.announcementId ?? selectedAnnouncement.id) : null;
  const needsFetch = !!urlId && selectedId !== urlId;
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!needsFetch || !urlId) return;
    let alive = true;
    setNotFound(false);
    api(`/announcements/${encodeURIComponent(urlId)}`)
      .then((res: any) => {
        const found = res?.announcement || res;
        if (!alive) return;
        if (found && (found.announcementId ?? found.id) != null) setSelectedAnnouncement(found);
        else setNotFound(true);
      })
      .catch(() => alive && setNotFound(true));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlId]);

  if (needsFetch && !notFound) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center gap-3 text-center" aria-busy="true">
        <Loader2 className="w-6 h-6 text-black animate-spin" />
        <p className="text-xs sm:text-sm text-black">កំពុងទាញយកសេចក្តីប្រកាស…</p>
      </div>
    );
  }

  if (notFound || !selectedAnnouncement) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3 font-normal">
        <p className="text-xs sm:text-sm text-black font-normal">
          {notFound ? 'រកមិនឃើញសេចក្តីប្រកាសនេះទេ។ វាអាចត្រូវបានលុបចេញ។' : 'មិនមានព័ត៌មានសេចក្តីប្រកាសដែលបានជ្រើសរើសទេ។'}
        </p>
        <button
          onClick={() => setCurrentPage('announcements')}
          className="px-4 py-2 bg-white hover:bg-black hover:text-white text-black border border-black rounded-2xl text-xs font-normal transition cursor-pointer"
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
  const pdfUrl = parseAnnouncementPdf(ann);

  const about = ann.aboutExam;
  const examWhen = about?.when || about?.examDate;
  const examWhere = about?.where || about?.examLocation;
  const examSubjects = Array.isArray(about?.whatSubject)
    ? about.whatSubject.join(', ')
    : (about?.whatSubject || about?.examSubjects);
  const hasAboutExam = Boolean(examWhen || examWhere || examSubjects);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn font-normal">
      {/* Back button */}
      <button
        onClick={() => setCurrentPage('announcements')}
        className="inline-flex items-center gap-2 text-xs font-normal text-black hover:underline transition cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>ត្រឡប់ទៅបញ្ជីសេចក្តីប្រកាស</span>
      </button>

      {/* Main Announcement Card (Pure Black & White) */}
      <article className="bg-white rounded-3xl border border-black overflow-hidden font-normal space-y-0">
        {/* Top Full A4 PDF Page (Whole Paper Size) */}
        {pdfUrl && (
          <div className="w-full bg-white p-4 sm:p-8 flex justify-center">
            <div 
              onClick={() => setPreviewPdfUrl(pdfUrl)}
              className="relative aspect-[210/297] w-full max-w-2xl bg-white border border-black rounded-2xl overflow-hidden cursor-pointer group"
              title="ចុចដើម្បីបើកមើលឯកសារ PDF"
            >
              <PdfThumbnail url={pdfUrl} fallbackTitle={title} className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-normal border border-black flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-white" /> បើកមើល PDF ពេញអេក្រង់
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-10 space-y-6 font-normal">
          {/* Header Badges & Title */}
          <div className="space-y-3 border-b border-black pb-6 font-normal">
            <AnnouncementBadges category={ann.category} isUrgent={ann.isUrgent} size="md" />

            <h1 className="text-xl sm:text-2xl font-normal text-black leading-snug tracking-tight">
              {title}
            </h1>

            {summary && (
              <p className="text-xs sm:text-sm text-black font-normal leading-relaxed pt-1">
                {summary}
              </p>
            )}
          </div>

          {/* About Exam Card */}
          {hasAboutExam && (
            <div className="p-5 rounded-2xl bg-white border border-black space-y-3 font-normal">
              <div className="text-xs font-normal text-black flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-black" />
                <span>ព័ត៌មានអំពីការប្រឡង (About Exam)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-normal">
                {examWhen && (
                  <div className="space-y-1">
                    <span className="text-xs text-black font-normal flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-black" /> កាលបរិច្ឆេទ / ពេលវេលា (When)
                    </span>
                    <p className="text-black font-normal">{examWhen}</p>
                  </div>
                )}
                {examWhere && (
                  <div className="space-y-1">
                    <span className="text-xs text-black font-normal flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-black" /> មណ្ឌលប្រឡង / ទីតាំង (Where)
                    </span>
                    <p className="text-black font-normal">{examWhere}</p>
                  </div>
                )}
                {examSubjects && (
                  <div className="sm:col-span-2 space-y-1 pt-1 border-t border-black">
                    <span className="text-xs text-black font-normal flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-black" /> មុខវិជ្ជាប្រឡង (What Subject to Exam)
                    </span>
                    <p className="text-black font-normal">{examSubjects}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content Body */}
          {content && (
            <div className="space-y-2 font-normal">
              <h2 className="text-xs font-normal text-black">ខ្លឹមសារសេចក្តីប្រកាស</h2>
              <div className="text-black text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal bg-white p-5 rounded-2xl border border-black">
                {content}
              </div>
            </div>
          )}

          {/* Attached PDF Documents */}
          {pdfUrl && (
            <div className="border-t border-black pt-6 space-y-3 font-normal">
              <h2 className="text-xs font-normal text-black flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-black" />
                <span>ឯកសារភ្ជាប់ផ្លូវការ</span>
              </h2>
              <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-black">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white border border-black text-black flex items-center justify-center font-normal text-[11px] shrink-0">
                    PDF
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-normal text-black truncate">{title}</p>
                    <p className="text-[11px] text-black font-normal">ឯកសារផ្លូវការ</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setPreviewPdfUrl(pdfUrl)}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-black hover:text-white text-black border border-black font-normal text-xs flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>បើកមើល</span>
                  </button>
                  <a
                    href={pdfUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-white hover:text-black text-white border border-black font-normal text-xs flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ទាញយក</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* PDF Viewer Modal */}
      {previewPdfUrl && (
        <PdfViewerModal
          url={previewPdfUrl}
          title="មើលឯកសារប្រកាសផ្លូវការ (PDF)"
          onClose={() => setPreviewPdfUrl(null)}
        />
      )}
    </div>
  );
};
