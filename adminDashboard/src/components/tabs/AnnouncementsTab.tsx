import React, { useState } from 'react';
import {
  Search,
  Plus,
  AlertCircle,
  ChevronDown,
  ExternalLink,
  FileText,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  BookOpen,
} from 'lucide-react';
import { AnnouncementItem } from '../../types';
import {
  parseAnnouncementDetails,
  getCategoryBadgeKhmer,
} from '../../utils/formatters';
import { PdfThumbnail } from '../common/PdfThumbnail';

interface AnnouncementsTabProps {
  announcements: AnnouncementItem[];
  filteredAnnouncements: AnnouncementItem[];
  search: string;
  setSearch: (s: string) => void;
  onCreateNew: () => void;
  onEdit: (ann: AnnouncementItem) => void;
  onDelete: (id: number) => void;
  onViewNotice: (ann: AnnouncementItem) => void;
  onPreviewPdf: (url: string) => void;
}

export const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({
  filteredAnnouncements,
  search,
  setSearch,
  onCreateNew,
  onEdit,
  onDelete,
  onViewNotice,
  onPreviewPdf,
}) => {
  const [expandedNotices, setExpandedNotices] = useState<Record<number, boolean>>({});

  const toggleExpandNotice = (id: number) => {
    setExpandedNotices((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-5 font-normal">
      {/* Search & Actions Bar (Pure White & Black) */}
      <div className="bg-white border border-black rounded-2xl p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ស្វែងរកសេចក្តីប្រកាស តាមរយៈចំណងជើង ខ្លឹមសារ ឬការប្រឡង..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-black rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-black placeholder:text-black/60 focus:outline-none focus:ring-1 focus:ring-black font-normal"
            />
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-black hover:bg-white hover:text-black border border-black text-white rounded-xl text-xs sm:text-sm font-normal transition shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>បង្កើតសេចក្តីប្រកាសថ្មី</span>
          </button>
        </div>
      </div>

      {/* Compact Announcements Grid (3-4 Columns on larger screens) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredAnnouncements.length === 0 ? (
          <div className="col-span-full bg-white border border-black rounded-2xl p-10 text-center text-black font-normal space-y-2">
            <FileText className="w-8 h-8 text-black mx-auto stroke-1" />
            <p className="text-xs sm:text-sm text-black font-normal">មិនទាន់មានសេចក្តីប្រកាសនៅឡើយទេ</p>
            <p className="text-[11px] text-black font-normal">ចុចប៊ូតុង «បង្កើតសេចក្តីប្រកាសថ្មី» ខាងលើ ដើម្បីផ្សព្វផ្សាយដំណឹងប្រឡងដំបូងរបស់អ្នក។</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const parsed = parseAnnouncementDetails(ann);
            const isExpanded = Boolean(expandedNotices[ann.announcementId]);

            const about = ann.aboutExam;
            const examWhen = about?.when || about?.examDate;
            const examWhere = about?.where || about?.examLocation;
            const examSubjects = Array.isArray(about?.whatSubject)
              ? about.whatSubject.join(', ')
              : (about?.whatSubject || about?.examSubjects);
            const hasAbout = Boolean(examWhen || examWhere || examSubjects);

            return (
              <div
                key={ann.announcementId}
                className="bg-white border border-black rounded-2xl overflow-hidden transition flex flex-col justify-between group font-normal"
              >
                {/* 1. TOP: PDF THUMBNAIL CONTAINER (A4 Paper Ratio, Compact) */}
                <div className="relative aspect-[210/297] w-full bg-white overflow-hidden">
                  {parsed.pdfUrl ? (
                    <div 
                      onClick={() => onPreviewPdf(parsed.pdfUrl!)}
                      className="w-full h-full cursor-pointer group/pdf"
                      title="ចុចដើម្បីបើកមើលឯកសារ PDF"
                    >
                      <PdfThumbnail
                        url={parsed.pdfUrl}
                        fallbackTitle={ann.title}
                        className="w-full h-full object-cover object-top transition duration-300 group-hover/pdf:scale-102"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/pdf:bg-black/10 transition flex items-center justify-center opacity-0 group-hover/pdf:opacity-100">
                        <span className="px-2.5 py-1 rounded-lg bg-black text-white text-[11px] font-normal border border-black flex items-center gap-1">
                          <Eye className="w-3 h-3 text-white" /> បើកមើល PDF
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none bg-white">
                      <div className="w-9 h-9 rounded-xl bg-white border border-black flex items-center justify-center text-black mb-1.5">
                        <FileText className="w-4 h-4 text-black stroke-[1.5]" />
                      </div>
                      <p className="text-[11px] text-black font-normal line-clamp-1">{ann.title}</p>
                      <span className="text-[10px] text-black font-normal mt-0.5">ឯកសារប្រកាសផ្លូវការ</span>
                    </div>
                  )}

                  {/* Top Overlay Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-normal bg-white text-black border border-gray-300">
                      {getCategoryBadgeKhmer(ann.category)}
                    </span>
                    {ann.isUrgent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-normal bg-white text-red-600 border border-gray-300 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5 text-red-600" />
                        បន្ទាន់
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. BOTTOM: CONTENT & DETAILS (Compact) */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3 font-normal">
                  <div className="space-y-2.5">
                    {/* Title */}
                    <h3 className="text-xs sm:text-sm font-normal text-black leading-snug tracking-tight line-clamp-2">
                      {ann.title}
                    </h3>

                    {/* Summary */}
                    {ann.summary && (
                      <p className="text-[11px] text-black leading-relaxed font-normal line-clamp-2">
                        {ann.summary}
                      </p>
                    )}

                    {/* About Exam Section */}
                    {hasAbout && (
                      <div className="p-2.5 bg-white border border-black rounded-xl space-y-1.5 text-[10px] sm:text-[11px] font-normal">
                        <p className="text-black font-normal flex items-center gap-1 text-[11px]">
                          <BookOpen className="w-3 h-3 text-black" />
                          <span>ព័ត៌មានប្រឡង (About Exam)</span>
                        </p>
                        <div className="space-y-1 text-black pt-0.5">
                          {examWhen && (
                            <div className="flex items-start gap-1">
                              <Calendar className="w-3 h-3 text-black shrink-0 mt-0.5" />
                              <span className="truncate">កាលបរិច្ឆេទ: {examWhen}</span>
                            </div>
                          )}
                          {examWhere && (
                            <div className="flex items-start gap-1">
                              <MapPin className="w-3 h-3 text-black shrink-0 mt-0.5" />
                              <span className="truncate">ទីតាំង: {examWhere}</span>
                            </div>
                          )}
                          {examSubjects && (
                            <div className="flex items-start gap-1 pt-1 border-t border-black">
                              <BookOpen className="w-3 h-3 text-black shrink-0 mt-0.5" />
                              <span className="line-clamp-1">មុខវិជ្ជា: {examSubjects}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Collapsible Full Notice Details */}
                    {(ann.content || parsed.requirements || parsed.sourceRef) && (
                      <div className="space-y-1.5 pt-0.5 font-normal">
                        <button
                          type="button"
                          onClick={() => toggleExpandNotice(ann.announcementId)}
                          className="text-[11px] font-normal text-black underline flex items-center gap-1 cursor-pointer"
                        >
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          <span>{isExpanded ? 'លាក់ព័ត៌មានលម្អិត' : 'បង្ហាញលម្អិត'}</span>
                        </button>

                        {isExpanded && (
                          <div className="p-3 rounded-xl bg-white border border-black text-[11px] text-black whitespace-pre-wrap leading-relaxed space-y-2 font-normal">
                            {parsed.sourceRef && (
                              <p className="font-normal text-black">លិខិតយោង: {parsed.sourceRef}</p>
                            )}
                            {ann.content && (
                              <div>
                                <p className="font-normal text-black mb-0.5">ខ្លឹមសារលម្អិត:</p>
                                <p className="whitespace-pre-wrap text-black font-normal">{ann.content}</p>
                              </div>
                            )}
                            {parsed.requirements && (
                              <div className="p-2 bg-white border border-black rounded-lg text-black">
                                <p className="font-normal text-black mb-0.5">លក្ខខណ្ឌជ្រើសរើស:</p>
                                <p className="whitespace-pre-wrap text-black font-normal">{parsed.requirements}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-black flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {parsed.pdfUrl ? (
                        <button
                          onClick={() => onPreviewPdf(parsed.pdfUrl!)}
                          className="px-2.5 py-1.5 bg-white hover:bg-black hover:text-white text-black border border-black rounded-lg text-[11px] font-normal transition flex items-center gap-1 cursor-pointer"
                          title="បើកមើលឯកសារ PDF ផ្លូវការ"
                        >
                          <FileText className="w-3 h-3" />
                          <span>មើល PDF</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onViewNotice(ann)}
                          className="px-2.5 py-1.5 bg-white hover:bg-black hover:text-white text-black border border-black rounded-lg text-[11px] font-normal transition flex items-center gap-1 cursor-pointer"
                          title="មើលព័ត៌មានលម្អិត"
                        >
                          <Eye className="w-3 h-3" />
                          <span>មើលលម្អិត</span>
                        </button>
                      )}

                      {parsed.qrApplyUrl && (
                        <a
                          href={parsed.qrApplyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1.5 bg-white hover:bg-black hover:text-white text-black border border-black rounded-lg text-[11px] font-normal transition flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>QR</span>
                        </a>
                      )}
                    </div>

                    {/* Admin Actions: Edit & Delete */}
                    <div className="flex items-center justify-end gap-1 ml-auto">
                      <button
                        onClick={() => onEdit(ann)}
                        className="px-2 py-1.5 text-black bg-white hover:bg-black hover:text-white rounded-lg text-[11px] font-normal border border-black transition flex items-center gap-1 cursor-pointer"
                        title="កែសម្រួលសេចក្តីប្រកាស"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>កែប្រែ</span>
                      </button>
                      <button
                        onClick={() => onDelete(ann.announcementId)}
                        className="p-1.5 text-black bg-white hover:bg-black hover:text-white border border-black rounded-lg transition cursor-pointer"
                        title="លុបសេចក្តីប្រកាស"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
