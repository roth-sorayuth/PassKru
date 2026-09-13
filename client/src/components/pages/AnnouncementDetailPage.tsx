import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp, announcementIdFromPath } from '../../context/AppContext';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Download,
  Eye,
  FileText,
  Link2,
  Loader2,
  MapPin,
} from 'lucide-react';
import { api } from '../../utils/api';
import { parseAnnouncementPdf } from './AnnouncementsPage';
import { PdfThumbnail } from '../common/PdfThumbnail';
import { PdfViewerModal } from '../common/PdfViewerModal';
import { AnnouncementBadges } from '../common/AnnouncementBadges';

const textOf = (value: any): string => (typeof value === 'string' ? value : value?.km || value?.en || '');

const KHMER_MONTHS = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
const khmerDigits = (value: number | string) => String(value).replace(/[0-9]/g, (d) => '០១២៣៤៥៦៧៨៩'[Number(d)]);

/** "១០ កញ្ញា ២០២៦", or null when the announcement has no usable date. */
const formatKhmerDate = (item: any): string | null => {
  const raw = item.publishDate || item.date || item.updatedAt;
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return null;
  return `${khmerDigits(d.getDate())} ${KHMER_MONTHS[d.getMonth()]} ${khmerDigits(d.getFullYear())}`;
};

/** Plain text with any http(s) address turned into a link. */
const Linkified: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
      /^https?:\/\//.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="text-[#0f3360] underline underline-offset-2 break-all hover:text-[#12427d]"
        >
          {part}
        </a>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      )
    )}
  </>
);

const CARD = 'bg-white rounded-2xl border border-gray-200 shadow-xs';

export const AnnouncementDetailPage: React.FC = () => {
  const { selectedAnnouncement, setSelectedAnnouncement, setCurrentPage } = useApp() as any;
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const backToList = () => setCurrentPage('announcements');

  if (needsFetch && !notFound) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center gap-3 text-center" aria-busy="true">
        <Loader2 className="w-7 h-7 text-[#0f3360] animate-spin" />
        <p className="text-sm text-gray-600">កំពុងទាញយកសេចក្តីប្រកាស…</p>
      </div>
    );
  }

  if (notFound || !selectedAnnouncement) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className={`${CARD} p-10 text-center space-y-4`}>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0f3360] flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">
            {notFound ? 'រកមិនឃើញសេចក្តីប្រកាសនេះទេ' : 'មិនមានសេចក្តីប្រកាសដែលបានជ្រើសរើស'}
          </h1>
          {notFound && <p className="text-sm text-gray-600">វាអាចត្រូវបានលុបចេញ ឬតំណភ្ជាប់មិនត្រឹមត្រូវ។</p>}
          <button
            type="button"
            onClick={backToList}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f3360] hover:bg-[#12427d] text-white text-sm font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            ត្រឡប់ទៅសេចក្តីប្រកាស
          </button>
        </div>
      </div>
    );
  }

  const ann = selectedAnnouncement;
  const title = textOf(ann.title);
  const summary = textOf(ann.summary);
  const content = textOf(ann.content);
  const pdfUrl = parseAnnouncementPdf(ann);
  const publishedOn = formatKhmerDate(ann);

  const about = ann.aboutExam;
  const examWhen = about?.when || about?.examDate;
  const examWhere = about?.where || about?.examLocation;
  const examSubjects = Array.isArray(about?.whatSubject)
    ? about.whatSubject.join(', ')
    : about?.whatSubject || about?.examSubjects;
  const facts = [
    examWhen && { icon: Calendar, label: 'កាលបរិច្ឆេទ', value: examWhen },
    examWhere && { icon: MapPin, label: 'ទីតាំងប្រឡង', value: examWhere },
    examSubjects && { icon: BookOpen, label: 'មុខវិជ្ជាប្រឡង', value: examSubjects },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];

  // The summary is the lead; skip the body when it only repeats it.
  const body = content && content.trim() !== summary.trim() ? content : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure origin); the address bar still has the link.
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fadeIn">
      <button
        type="button"
        onClick={backToList}
        className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-xl text-sm font-medium text-gray-600 hover:text-[#0f3360] hover:bg-blue-50 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        ត្រឡប់ទៅបញ្ជីសេចក្តីប្រកាស
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        {/* ---------- Main column ---------- */}
        <article className="space-y-5 min-w-0">
          <header className={`${CARD} p-6 sm:p-8 space-y-4`}>
            <AnnouncementBadges category={ann.category} isUrgent={ann.isUrgent} size="md" />
            <h1 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-gray-900 leading-snug tracking-tight">
              {title}
            </h1>
            {publishedOn && (
              <p className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                ចេញផ្សាយ {publishedOn}
              </p>
            )}
            {summary && (
              <p className="text-[15px] text-gray-700 leading-8 pt-4 border-t border-gray-100">
                <Linkified text={summary} />
              </p>
            )}
          </header>

          {facts.length > 0 && (
            <section aria-label="ព័ត៌មានប្រឡង" className={`grid grid-cols-1 ${facts.length > 1 ? 'md:grid-cols-2' : ''} gap-3`}>
              {facts.map(({ icon: Icon, label, value }, i) => (
                <div
                  key={label}
                  className={`${CARD} p-4 flex gap-3 ${facts.length === 3 && i === 2 ? 'md:col-span-2' : ''}`}
                >
                  <span className="w-10 h-10 rounded-xl bg-blue-50 text-[#0f3360] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-semibold text-gray-500">{label}</p>
                    <p className="text-sm text-gray-900 leading-relaxed">{value}</p>
                  </div>
                </div>
              ))}
            </section>
          )}

          {body && (
            <section className={`${CARD} p-6 sm:p-8 space-y-3`}>
              <h2 className="text-base font-bold text-gray-900">ខ្លឹមសារសេចក្តីប្រកាស</h2>
              <div className="text-[15px] text-gray-700 leading-8 whitespace-pre-wrap">
                <Linkified text={body} />
              </div>
            </section>
          )}
        </article>

        {/* ---------- Side column ---------- */}
        <aside className="space-y-4 lg:sticky lg:top-6">
          {pdfUrl && (
            <section className={`${CARD} p-4 space-y-3`}>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0f3360]" />
                ឯកសារផ្លូវការ
              </h2>
              <button
                type="button"
                onClick={() => setPreviewPdfUrl(pdfUrl)}
                title="បើកមើលឯកសារ PDF"
                className="relative block w-full aspect-[210/297] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer group"
              >
                <PdfThumbnail url={pdfUrl} fallbackTitle={title} className="w-full h-full object-contain" />
                <span className="absolute inset-0 bg-[#0f3360]/0 group-hover:bg-[#0f3360]/60 transition flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#0f3360] text-xs font-semibold">
                    <Eye className="w-3.5 h-3.5" /> បើកមើលពេញអេក្រង់
                  </span>
                </span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewPdfUrl(pdfUrl)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#0f3360] hover:bg-[#12427d] text-white text-sm font-semibold transition cursor-pointer"
                >
                  <Eye className="w-4 h-4" /> បើកមើល
                </button>
                <a
                  href={pdfUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 text-sm font-semibold transition"
                >
                  <Download className="w-4 h-4" /> ទាញយក
                </a>
              </div>
            </section>
          )}

          <button
            type="button"
            onClick={copyLink}
            className={`${CARD} w-full px-4 py-3 flex items-center justify-center gap-2 text-sm font-semibold transition cursor-pointer ${
              copied ? 'text-emerald-700' : 'text-gray-700 hover:text-[#0f3360] hover:border-blue-200'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            {copied ? 'បានចម្លងតំណភ្ជាប់' : 'ចម្លងតំណភ្ជាប់'}
          </button>
        </aside>
      </div>

      {previewPdfUrl && (
        <PdfViewerModal url={previewPdfUrl} title={title || 'ឯកសារប្រកាសផ្លូវការ'} onClose={() => setPreviewPdfUrl(null)} />
      )}
    </div>
  );
};
