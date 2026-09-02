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
} from 'lucide-react';
import { AnnouncementItem } from '../../types';
import { getCategoryBadge, parseAnnouncementDetails } from '../../utils/formatters';

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
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search announcements by title, content, or exam..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            />
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-xl text-sm font-normal transition shadow-2xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Announcement
          </button>
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAnnouncements.length === 0 ? (
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 shadow-sm font-normal">
            No announcements found. Click "Create Announcement" to publish one.
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const badge = getCategoryBadge(ann.category);
            const parsed = parseAnnouncementDetails(ann);
            const isExpanded = Boolean(expandedNotices[ann.announcementId]);

            return (
              <div
                key={ann.announcementId}
                className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Header row: Urgent badge, Category badge, Published date */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {ann.isUrgent && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-normal bg-black text-white border border-black">
                          <AlertCircle className="w-3.5 h-3.5 text-white" />
                          <span>Urgent</span>
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full text-xs font-normal bg-slate-100 text-black border border-slate-200">
                        {badge.label}
                      </span>
                    </div>
                    <span className="text-xs font-normal text-slate-400">
                      {parsed.formattedPublishDate}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-normal text-black leading-snug tracking-tight">
                    {ann.title}
                  </h3>

                  {/* Summary */}
                  {ann.summary && (
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {ann.summary}
                    </p>
                  )}

                  {/* Collapsible Full notice */}
                  {(ann.content || parsed.requirements) && (
                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        onClick={() => toggleExpandNotice(ann.announcementId)}
                        className="text-xs font-normal text-black hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        <span>{isExpanded ? 'Hide notice details' : 'View full notice'}</span>
                      </button>

                      {isExpanded && (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed animate-in fade-in-50 duration-200 space-y-3 font-normal">
                          {parsed.sourceRef && (
                            <p className="font-normal text-black">Reference: {parsed.sourceRef}</p>
                          )}
                          {ann.content && (
                            <div>
                              <p className="font-normal text-black mb-1">Details:</p>
                              <p className="whitespace-pre-wrap font-normal text-slate-700">{ann.content}</p>
                            </div>
                          )}
                          {parsed.requirements && (
                            <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-black font-normal">
                              <p className="font-normal text-black mb-1">Requirements & Eligibility (លក្ខខណ្ឌជ្រើសរើស):</p>
                              <p className="whitespace-pre-wrap font-normal text-slate-700">{parsed.requirements}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions Row */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {parsed.pdfUrl ? (
                      <button
                        onClick={() => onPreviewPdf(parsed.pdfUrl!)}
                        className="px-4 py-2 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-xl text-xs sm:text-sm font-normal transition flex items-center gap-2 shadow-2xs cursor-pointer"
                        title="View PDF Document"
                      >
                        <FileText className="w-4 h-4 text-slate-700" />
                        <span>Detail (PDF)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onViewNotice(ann)}
                        className="px-4 py-2 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-xl text-xs sm:text-sm font-normal transition flex items-center gap-2 shadow-2xs cursor-pointer"
                        title="View Full Notice Details"
                      >
                        <Eye className="w-4 h-4 text-slate-700" />
                        <span>Detail</span>
                      </button>
                    )}

                    {parsed.qrApplyUrl && (
                      <a
                        href={parsed.qrApplyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-white hover:bg-slate-100 text-black border border-slate-200 rounded-xl text-xs sm:text-sm font-normal transition flex items-center gap-2 shadow-xs"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-500" />
                        <span>Apply / QR code</span>
                      </a>
                    )}
                  </div>

                  {/* Admin actions: Edit & Delete */}
                  <div className="flex items-center justify-end gap-1.5 ml-auto">
                    <button
                      onClick={() => onEdit(ann)}
                      className="px-3 py-2 text-slate-700 hover:text-black hover:bg-slate-100 rounded-xl text-xs font-normal border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                      title="Edit Announcement"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(ann.announcementId)}
                      className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-xl transition cursor-pointer"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
