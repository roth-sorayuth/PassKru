import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Eye,
  ArrowRight,
  AlertCircle,
  Calendar,
  MapPin,
  BookOpen,
  Search,
  X,
  Clock,
} from 'lucide-react';
import { api } from '../../utils/api';
import { PdfThumbnail } from '../common/PdfThumbnail';
import { PdfViewerModal } from '../common/PdfViewerModal';

export const formatCategoryKhmer = (cat?: string) => {
  if (!cat) return 'សេចក្តីប្រកាស';
  const c = cat.toLowerCase();
  if (c.includes('recruit')) return 'ជ្រើសរើសគ្រូ';
  if (c.includes('exam')) return 'ការប្រឡង';
  if (c.includes('schedule')) return 'កាលវិភាគប្រឡង';
  if (c.includes('eligibility')) return 'លក្ខខណ្ឌជ្រើសរើស';
  if (c.includes('urgent')) return 'ដំណឹងបន្ទាន់';
  if (c.includes('guide') || c.includes('guideline')) return 'សេចក្តីណែនាំ';
  if (c.includes('general')) return 'ព័ត៌មានទូទៅ';
  if (c.includes('result')) return 'លទ្ធផលប្រឡង';
  if (c.includes('deadline')) return 'កាលបរិច្ឆេទ';
  if (c.includes('notice') || c.includes('announcement')) return 'សេចក្តីប្រកាស';
  return cat;
};

export const parseAnnouncementPdf = (ann: any) => {
  let pdfUrl: string | null = null;
  if (ann.attachments) {
    if (typeof ann.attachments === 'string') {
      try {
        const parsed = JSON.parse(ann.attachments);
        pdfUrl = parsed?.pdfUrl || parsed?.url || (Array.isArray(parsed) ? parsed[0]?.url || parsed[0]?.pdfUrl : null);
      } catch {
        if (ann.attachments.startsWith('http') || ann.attachments.endsWith('.pdf')) {
          pdfUrl = ann.attachments;
        }
      }
    } else if (typeof ann.attachments === 'object') {
      if (Array.isArray(ann.attachments)) {
        const found = ann.attachments.find((a: any) => a?.url || a?.pdfUrl);
        pdfUrl = found?.url || found?.pdfUrl || null;
      } else {
        pdfUrl = ann.attachments.pdfUrl || ann.attachments.url || null;
      }
    }
  }
  return pdfUrl;
};

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

const ALL = 'all';

export const AnnouncementsPage: React.FC = () => {
  const { openAnnouncement } = useApp() as any;
  const [liveAnnouncements, setLiveAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setFailed(false);
      try {
        const res = await api('/announcements');
        if (res?.announcements && Array.isArray(res.announcements)) {
          setLiveAnnouncements(res.announcements);
        }
      } catch (err) {
        console.warn('Error fetching live announcements from database:', err);
        setFailed(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Sort announcements by newest
  const sortedAnnouncements = useMemo(
    () =>
      [...liveAnnouncements].sort((a: any, b: any) => {
        const timeA = new Date(a.publishDate || a.updatedAt || a.date || 0).getTime();
        const timeB = new Date(b.publishDate || b.updatedAt || b.date || 0).getTime();
        if (timeB !== timeA) return timeB - timeA;
        return (b.announcementId || b.id || 0) - (a.announcementId || a.id || 0);
      }),
    [liveAnnouncements]
  );

  const categories = useMemo(
    () => Array.from(new Set(sortedAnnouncements.map((a) => formatCategoryKhmer(a.category)))),
    [sortedAnnouncements]
  );

  const q = query.trim().toLowerCase();
  const filteredAnnouncements = sortedAnnouncements.filter((item) => {
    if (category !== ALL && formatCategoryKhmer(item.category) !== category) return false;
    if (!q) return true;
    return `${textOf(item.title)} ${textOf(item.summary)} ${textOf(item.content)}`.toLowerCase().includes(q);
  });
  const hasFilters = Boolean(q) || category !== ALL;

  const featuredItem = sortedAnnouncements[0] || null;
  const featuredTitle = featuredItem ? textOf(featuredItem.title) : '';
  const featuredSummary = featuredItem ? textOf(featuredItem.summary) || textOf(featuredItem.content) : '';
  const featuredDate = featuredItem ? formatKhmerDate(featuredItem) : null;

  const resetFilters = () => {
    setQuery('');
    setCategory(ALL);
  };

  const handleCardClick = (item: any) => {
    openAnnouncement(item);
    document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onKeyActivate = (fn: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* 1. TOP HERO FEATURED CARD with background image */}
      {featuredItem && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleCardClick(featuredItem)}
          onKeyDown={onKeyActivate(() => handleCardClick(featuredItem))}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 border border-black min-h-[220px] sm:min-h-[260px] flex items-center bg-white cursor-pointer group transition hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          <img
            src="/announcement-background.jpeg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-right select-none pointer-events-none transition duration-500 group-hover:scale-[1.02]"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-45% to-transparent w-full md:w-3/5" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black text-white border border-black">
                ថ្មីបំផុត
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-white text-black border border-black">
                {formatCategoryKhmer(featuredItem.category)}
              </span>
              {featuredItem.isUrgent && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
                  <AlertCircle className="w-3 h-3" />
                  បន្ទាន់
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-black tracking-tight leading-snug">
              {featuredTitle}
            </h1>

            {featuredSummary && (
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl line-clamp-2">{featuredSummary}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold">
                មើលសេចក្តីលម្អិត
                <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
              </span>
              {featuredDate && (
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-700">
                  <Clock className="w-3.5 h-3.5" />
                  {featuredDate}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. SECTION TITLE + search and category chips */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-black flex items-baseline gap-2">
            សេចក្តីប្រកាសទាំងអស់
            {!loading && (
              <span className="text-sm font-normal text-slate-600">({khmerDigits(filteredAnnouncements.length)})</span>
            )}
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ស្វែងរកសេចក្តីប្រកាស..."
              aria-label="ស្វែងរកសេចក្តីប្រកាស"
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-black rounded-xl text-sm text-black placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-black/15 transition"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="សម្អាតការស្វែងរក"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-600 hover:text-black hover:bg-black/5 transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {[ALL, ...categories].map((cat) => {
              const active = category === cat;
              return (
                <button
                  type="button"
                  key={cat}
                  aria-pressed={active}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap border border-black transition cursor-pointer shrink-0 ${
                    active ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
                  }`}
                >
                  {cat === ALL ? 'ទាំងអស់' : cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. GRID OF ANNOUNCEMENTS (Compact A4 Cards) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-black/20 animate-pulse space-y-3">
              <div className="aspect-[210/297] bg-black/5 rounded-xl w-full"></div>
              <div className="h-3.5 bg-black/10 rounded w-3/4"></div>
              <div className="h-8 bg-black/5 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : failed || filteredAnnouncements.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white rounded-2xl border border-black space-y-3">
          {failed ? (
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          ) : (
            <FileText className="w-8 h-8 text-black mx-auto stroke-1" />
          )}
          <p className="text-sm text-black">
            {failed
              ? 'មិនអាចទាញយកសេចក្តីប្រកាសបានទេ សូមព្យាយាមម្តងទៀត'
              : hasFilters
                ? 'រកមិនឃើញសេចក្តីប្រកាសដែលត្រូវនឹងការស្វែងរក'
                : 'មិនទាន់មានសេចក្តីប្រកាសនៅក្នុងប្រព័ន្ធនៅឡើយទេ'}
          </p>
          {hasFilters && !failed && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-black hover:text-white text-black border border-black rounded-lg text-xs transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              សម្អាតការស្វែងរក
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredAnnouncements.map((item: any, idx: number) => {
            const title = textOf(item.title);
            const summary = textOf(item.summary) || textOf(item.content);
            const pdfUrl = parseAnnouncementPdf(item);
            const date = formatKhmerDate(item);

            const about = item.aboutExam;
            const examWhen = about?.when || about?.examDate;
            const examWhere = about?.where || about?.examLocation;
            const examSubjects = Array.isArray(about?.whatSubject)
              ? about.whatSubject.join(', ')
              : about?.whatSubject || about?.examSubjects;
            const hasAbout = Boolean(examWhen || examWhere || examSubjects);

            return (
              <div
                key={item.announcementId || item.id || idx}
                className="bg-white border border-black rounded-2xl overflow-hidden flex flex-col group transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.3)]"
              >
                {/* TOP: PDF THUMBNAIL (A4 ratio) */}
                <div className="relative aspect-[210/297] w-full bg-white overflow-hidden border-b border-black">
                  {pdfUrl ? (
                    <button
                      type="button"
                      onClick={() => setPreviewPdfUrl(pdfUrl)}
                      className="w-full h-full cursor-pointer group/pdf"
                      title="ចុចដើម្បីបើកមើលឯកសារ PDF"
                    >
                      <PdfThumbnail url={pdfUrl} fallbackTitle={title} className="w-full h-full object-cover object-top" />
                      <span className="absolute inset-0 bg-black/0 group-hover/pdf:bg-black/10 transition flex items-center justify-center opacity-0 group-hover/pdf:opacity-100">
                        <span className="px-3 py-1.5 rounded-lg bg-black text-white text-xs flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" /> បើកមើល PDF
                        </span>
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCardClick(item)}
                      className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none bg-white cursor-pointer"
                    >
                      <span className="w-10 h-10 rounded-xl bg-white border border-black flex items-center justify-center text-black mb-2">
                        <FileText className="w-5 h-5 stroke-[1.5]" />
                      </span>
                      <span className="text-xs text-black line-clamp-2">{title}</span>
                      <span className="text-[11px] text-slate-600 mt-1">ឯកសារប្រកាសផ្លូវការ</span>
                    </button>
                  )}

                  {/* Top overlay badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex flex-wrap items-center gap-1.5 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-white text-black border border-black">
                      {formatCategoryKhmer(item.category)}
                    </span>
                    {item.isUrgent && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-600 text-white flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        បន្ទាន់
                      </span>
                    )}
                  </div>
                </div>

                {/* BOTTOM: CONTENT & DETAILS */}
                <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                  <div className="space-y-2">
                    {date && (
                      <p className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <Clock className="w-3 h-3" />
                        {date}
                      </p>
                    )}

                    <h3
                      role="link"
                      tabIndex={0}
                      onClick={() => handleCardClick(item)}
                      onKeyDown={onKeyActivate(() => handleCardClick(item))}
                      className="text-sm font-semibold text-black leading-snug tracking-tight line-clamp-2 cursor-pointer hover:underline focus:outline-none focus-visible:underline"
                    >
                      {title}
                    </h3>

                    {summary && <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">{summary}</p>}

                    {hasAbout && (
                      <div className="p-2.5 bg-white border border-black rounded-xl space-y-1.5 text-[11px]">
                        <p className="text-black font-semibold flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>ព័ត៌មានប្រឡង</span>
                        </p>
                        <div className="space-y-1 text-black">
                          {examWhen && (
                            <div className="flex items-start gap-1">
                              <Calendar className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span className="truncate">កាលបរិច្ឆេទ: {examWhen}</span>
                            </div>
                          )}
                          {examWhere && (
                            <div className="flex items-start gap-1">
                              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span className="truncate">ទីតាំង: {examWhere}</span>
                            </div>
                          )}
                          {examSubjects && (
                            <div className="flex items-start gap-1 pt-1 border-t border-black">
                              <BookOpen className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">មុខវិជ្ជា: {examSubjects}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions row */}
                  <div className="pt-3 border-t border-black flex items-center gap-2">
                    {pdfUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewPdfUrl(pdfUrl)}
                        className="px-2.5 py-1.5 bg-white hover:bg-black hover:text-white text-black border border-black rounded-lg text-[11px] transition flex items-center gap-1 cursor-pointer"
                        title="បើកមើលឯកសារ PDF ផ្លូវការ"
                      >
                        <FileText className="w-3 h-3" />
                        <span>មើល PDF</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCardClick(item)}
                      className="px-2.5 py-1.5 bg-black hover:bg-slate-800 text-white border border-black rounded-lg text-[11px] transition flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <span>មើលសេចក្តីលម្អិត</span>
                      <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
