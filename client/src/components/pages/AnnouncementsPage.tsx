import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Eye,
  ArrowRight,
  AlertCircle,
  Calendar,
  MapPin,
  BookOpen,
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

export const AnnouncementsPage: React.FC = () => {
  const { setCurrentPage, setSelectedAnnouncement } = useApp() as any;
  const [liveAnnouncements, setLiveAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const res = await api('/announcements');
        if (res?.announcements && Array.isArray(res.announcements)) {
          setLiveAnnouncements(res.announcements);
        }
      } catch (err) {
        console.warn('Error fetching live announcements from database:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Sort announcements by newest
  const sortedAnnouncements = [...liveAnnouncements].sort((a: any, b: any) => {
    const timeA = new Date(a.publishDate || a.updatedAt || a.date || 0).getTime();
    const timeB = new Date(b.publishDate || b.updatedAt || b.date || 0).getTime();
    if (timeB !== timeA) return timeB - timeA;
    return (b.announcementId || b.id || 0) - (a.announcementId || a.id || 0);
  });

  const featuredItem = sortedAnnouncements[0] || null;
  const featuredTitle = featuredItem 
    ? (typeof featuredItem.title === 'string' ? featuredItem.title : featuredItem.title?.km || featuredItem.title?.en || '')
    : '';
  const featuredSummary = featuredItem
    ? (typeof featuredItem.summary === 'string' ? featuredItem.summary : featuredItem.summary?.km || featuredItem.summary?.en || featuredItem.content?.km || featuredItem.content || '')
    : '';

  const handleCardClick = (item: any) => {
    if (setSelectedAnnouncement) {
      setSelectedAnnouncement(item);
    }
    setCurrentPage('announcement-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto font-normal">
      {/* 1. TOP HERO FEATURED CARD with background image */}
      {featuredItem && (
        <div
          onClick={() => handleCardClick(featuredItem)}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 border border-black min-h-[220px] sm:min-h-[250px] flex items-center bg-white cursor-pointer group"
        >
          <img
            src="/announcement-background.jpeg"
            alt="Announcement Background"
            className="absolute inset-0 w-full h-full object-cover object-right select-none pointer-events-none transition duration-500 group-hover:scale-102"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-45% to-transparent w-full md:w-3/5" />

          <div className="relative z-10 max-w-2xl space-y-3 font-normal">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-normal bg-white text-black border border-black">
              <span>{formatCategoryKhmer(featuredItem.category)}</span>
            </div>

            {/* Title */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-normal text-black tracking-tight leading-snug">
              {featuredTitle}
            </h1>

            {/* Summary */}
            {featuredSummary && (
              <p className="text-xs sm:text-sm text-black font-normal leading-relaxed max-w-xl line-clamp-2">
                {featuredSummary}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 2. SECTION TITLE: All Announcements in Khmer */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-xl sm:text-2xl font-normal text-black">
          សេចក្តីប្រកាសទាំងអស់
        </h2>
      </div>

      {/* 3. GRID OF ANNOUNCEMENTS (3-4 Columns, Compact A4 Cards) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-black animate-pulse space-y-3 font-normal">
              <div className="aspect-[210/297] bg-black/5 rounded-xl w-full"></div>
              <div className="h-3.5 bg-black/10 rounded w-3/4"></div>
              <div className="h-8 bg-black/5 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : sortedAnnouncements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-black space-y-2 font-normal">
          <FileText className="w-8 h-8 text-black mx-auto stroke-1" />
          <p className="text-xs sm:text-sm text-black font-normal">មិនទាន់មានសេចក្តីប្រកាសនៅក្នុងប្រព័ន្ធនៅឡើយទេ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {sortedAnnouncements.map((item: any, idx: number) => {
            const title = typeof item.title === 'string' ? item.title : item.title?.km || item.title?.en || '';
            const summary = typeof item.summary === 'string' ? item.summary : item.summary?.km || item.summary?.en || item.content?.km || item.content || '';
            const pdfUrl = parseAnnouncementPdf(item);

            const about = item.aboutExam;
            const examWhen = about?.when || about?.examDate;
            const examWhere = about?.where || about?.examLocation;
            const examSubjects = Array.isArray(about?.whatSubject)
              ? about.whatSubject.join(', ')
              : (about?.whatSubject || about?.examSubjects);
            const hasAbout = Boolean(examWhen || examWhere || examSubjects);

            return (
              <div
                key={item.announcementId || item.id || idx}
                className="bg-white border border-black rounded-2xl overflow-hidden transition flex flex-col justify-between group font-normal"
              >
                {/* 1. TOP: PDF THUMBNAIL CONTAINER (A4 Paper Ratio, Compact) */}
                <div className="relative aspect-[210/297] w-full bg-white overflow-hidden">
                  {pdfUrl ? (
                    <div 
                      onClick={() => setPreviewPdfUrl(pdfUrl)}
                      className="w-full h-full cursor-pointer group/pdf"
                      title="ចុចដើម្បីបើកមើលឯកសារ PDF"
                    >
                      <PdfThumbnail
                        url={pdfUrl}
                        fallbackTitle={title}
                        className="w-full h-full object-cover object-top transition duration-300 group-hover/pdf:scale-102"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/pdf:bg-black/10 transition flex items-center justify-center opacity-0 group-hover/pdf:opacity-100">
                        <span className="px-2.5 py-1 rounded-lg bg-black text-white text-[11px] font-normal border border-black flex items-center gap-1">
                          <Eye className="w-3 h-3 text-white" /> បើកមើល PDF
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => handleCardClick(item)}
                      className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none bg-white cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white border border-black flex items-center justify-center text-black mb-1.5">
                        <FileText className="w-4 h-4 text-black stroke-[1.5]" />
                      </div>
                      <p className="text-[11px] text-black font-normal line-clamp-1">{title}</p>
                      <span className="text-[10px] text-black font-normal mt-0.5">ឯកសារប្រកាសផ្លូវការ</span>
                    </div>
                  )}

                  {/* Top Overlay Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-normal bg-white text-black border border-black">
                      {formatCategoryKhmer(item.category)}
                    </span>
                    {item.isUrgent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-normal bg-black text-white border border-black flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5 text-white" />
                        បន្ទាន់
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. BOTTOM: CONTENT & DETAILS */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3 font-normal">
                  <div className="space-y-2.5">
                    {/* Title */}
                    <h3 
                      onClick={() => handleCardClick(item)}
                      className="text-xs sm:text-sm font-normal text-black leading-snug tracking-tight line-clamp-2 cursor-pointer hover:underline"
                    >
                      {title}
                    </h3>

                    {/* Summary */}
                    {summary && (
                      <p className="text-[11px] text-black leading-relaxed font-normal line-clamp-2">
                        {summary}
                      </p>
                    )}

                    {/* About Exam Section */}
                    {hasAbout && (
                      <div className="p-2.5 bg-white border border-black rounded-xl space-y-1.5 text-[10px] sm:text-[11px] font-normal">
                        <p className="text-black font-normal flex items-center gap-1 text-[11px]">
                          <BookOpen className="w-3.5 h-3.5 text-black" />
                          <span>ព័ត៌មានប្រឡង (About Exam)</span>
                        </p>
                        <div className="space-y-1 text-black pt-0.5">
                          {examWhen && (
                            <div className="flex items-start gap-1">
                              <Calendar className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                              <span className="truncate">កាលបរិច្ឆេទ: {examWhen}</span>
                            </div>
                          )}
                          {examWhere && (
                            <div className="flex items-start gap-1">
                              <MapPin className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                              <span className="truncate">ទីតាំង: {examWhere}</span>
                            </div>
                          )}
                          {examSubjects && (
                            <div className="flex items-start gap-1 pt-1 border-t border-black">
                              <BookOpen className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                              <span className="line-clamp-1">មុខវិជ្ជា: {examSubjects}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-black flex items-center justify-between gap-2 font-normal">
                    {pdfUrl ? (
                      <button
                        onClick={() => setPreviewPdfUrl(pdfUrl)}
                        className="px-2.5 py-1.5 bg-white hover:bg-black hover:text-white text-black border border-black rounded-lg text-[11px] font-normal transition flex items-center gap-1 cursor-pointer"
                        title="បើកមើលឯកសារ PDF ផ្លូវការ"
                      >
                        <FileText className="w-3 h-3" />
                        <span>មើល PDF</span>
                      </button>
                    ) : (
                      <div></div>
                    )}

                    <button
                      onClick={() => handleCardClick(item)}
                      className="px-2.5 py-1.5 bg-white hover:bg-black hover:text-white text-black border border-black rounded-lg text-[11px] font-normal transition flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <span>មើលសេចក្តីលម្អិត</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
