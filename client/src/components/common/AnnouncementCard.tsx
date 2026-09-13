import React from 'react';
import {
  FileText,
  ArrowRight,
  Calendar,
  MapPin,
  BookOpen,
} from 'lucide-react';
import { PdfThumbnail } from './PdfThumbnail';
import { AnnouncementBadges } from './AnnouncementBadges';

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
  if (ann?.attachments) {
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

interface AnnouncementCardProps {
  item: any;
  onClick?: (item: any) => void;
  className?: string;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  item,
  onClick,
  className = '',
}) => {
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

  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <div
      className={`bg-white border border-gray-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md transition duration-300 font-normal flex flex-col justify-between ${className}`}
    >
      {/* 1. TOP HEADER: BADGES */}
      <AnnouncementBadges category={item.category} isUrgent={item.isUrgent} className="mb-3" />

      {/* 2. MAIN BODY: LEFT POSTER + RIGHT DETAILS (Vertically Centered) */}
      <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-center flex-1 my-auto">
        {/* Left Column: Framed Poster */}
        <div className="w-full sm:w-[38%] shrink-0 flex flex-col justify-center">
          <div
            onClick={handleClick}
            className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#063324] border border-gray-200/80 shadow-xs cursor-pointer group"
            title="ចុចដើម្បីមើលសេចក្តីលម្អិត"
          >
            {pdfUrl ? (
              <PdfThumbnail
                url={pdfUrl}
                fallbackTitle={title}
                className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-103"
              />
            ) : (
              <div className="w-full h-full bg-[#063324] text-white p-3 flex flex-col items-center justify-between text-center select-none">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-7 h-7 rounded-full border border-yellow-500/40 flex items-center justify-center mb-1 text-yellow-400">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-[9px] text-yellow-400 font-medium">ក្រសួងមុខងារសាធារណៈ</p>
                  <p className="text-[8px] text-yellow-400/80 uppercase">Civil Service</p>
                </div>
                <div className="space-y-0.5 my-auto">
                  <p className="text-xs font-bold text-yellow-300">សេចក្តីជូនដំណឹង</p>
                  <p className="text-[10px] text-yellow-200/90">ស្ដីពី</p>
                  <p className="text-[10px] text-white line-clamp-2 px-1 leading-snug">{title}</p>
                </div>
                <p className="text-[9px] text-white/60">រាជធានីភ្នំពេញ</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Title + Exam Details + Primary Button */}
        <div className="w-full sm:w-[62%] flex flex-col justify-center space-y-2.5 min-w-0 gap-8">
          <div className="space-y-4 min-w-0">
            {/* Title */}
            <h3
              onClick={handleClick}
              className="text-xs sm:text-[13px] font-bold text-gray-900 leading-snug tracking-tight hover:text-[#0f3360] cursor-pointer transition line-clamp-2"
            >
              {title}
            </h3>

            {/* About Exam Section */}
            {hasAbout ? (
              <div className="bg-[#f8fafc] border border-gray-200/80 rounded-xl p-2.5 space-y-1.5 text-[10px] sm:text-[11px]">
                <div className="flex items-center gap-1.5 text-[#0f3360] font-bold pb-1 border-b border-gray-200/70">
                  <BookOpen className="w-3 h-3 text-[#0f3360] shrink-0" />
                  <span className="truncate">ព័ត៌មានប្រឡង</span>
                </div>

                <div className="space-y-1 text-gray-700">
                  {examWhen && (
                    <div className="flex items-start gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Calendar className="w-2.5 h-2.5 text-[#0f3360]" />
                      </div>
                      <div className="leading-snug truncate">
                        <span className="font-semibold text-gray-900">កាលបរិច្ឆេទ: </span>
                        <span>{examWhen}</span>
                      </div>
                    </div>
                  )}

                  {examWhere && (
                    <div className="flex items-start gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-[#0f3360]" />
                      </div>
                      <div className="leading-snug truncate">
                        <span className="font-semibold text-gray-900">ទីតាំង: </span>
                        <span>{examWhere}</span>
                      </div>
                    </div>
                  )}

                  {examSubjects && (
                    <div className="flex items-start gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-2.5 h-2.5 text-[#0f3360]" />
                      </div>
                      <div className="leading-snug">
                        <span className="font-semibold text-gray-900">មុខវិជ្ជា: </span>
                        <span className="line-clamp-1">{examSubjects}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : summary ? (
              <div className="bg-[#f8fafc] border border-gray-200/80 rounded-xl p-2.5 text-[10px] sm:text-[11px] text-gray-700 leading-relaxed line-clamp-3">
                {summary}
              </div>
            ) : null}
          </div>

          {/* Bottom Actions Row: Primary Button on right */}
          <div className="pt-1.5 flex items-center justify-end mt-auto">
            <button
              type="button"
              onClick={handleClick}
              className="ml-auto px-3.5 py-1.5 rounded-lg bg-[#0f3360] hover:bg-[#0b2446] text-white font-medium text-[10px] sm:text-[11px] transition flex items-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
            >
              <span>មើលសេចក្តីលម្អិត</span>
              <ArrowRight className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
