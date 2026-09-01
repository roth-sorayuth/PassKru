import React, { useState } from 'react';
import {
  Search,
  Plus,
  AlertCircle,
  Users,
  Tag,
  Clock,
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a3263]/20 focus:border-[#0a3263]"
            />
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0a3263] hover:bg-[#0f3360] text-white rounded-xl text-sm font-semibold transition shadow-sm shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Announcement
          </button>
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAnnouncements.length === 0 ? (
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 shadow-sm">
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
                className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Header row: Urgent badge, Category badge, Published date */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {ann.isUrgent && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Urgent</span>
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {badge.label}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                      {parsed.formattedPublishDate}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug tracking-tight">
                    {ann.title}
                  </h3>

                  {/* Summary */}
                  {ann.summary && (
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {ann.summary}
                    </p>
                  )}

                  {/* 3 Stat metric cards row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {/* Total slots */}
                    <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5 flex flex-col justify-between">
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-slate-400" /> Total slots
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5">
                        {parsed.totalSlots || '2,696'}
                      </span>
                    </div>

                    {/* Starting salary */}
                    <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5 flex flex-col justify-between">
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-slate-400" /> Starting salary
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5">
                        {parsed.startingSalary || '1.5M ៛'}
                      </span>
                    </div>

                    {/* Deadline */}
                    <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-3.5 flex flex-col justify-between text-rose-900">
                      <span className="text-xs font-medium text-rose-700 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-rose-500" /> Deadline
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-rose-800 mt-1.5">
                        {parsed.deadlineDisplay || 'Oct 19'}
                      </span>
                    </div>
                  </div>

                  {/* Quota by province chips */}
                  {parsed.quotas.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-xs font-semibold text-slate-500">Quota by province</p>
                      <div className="flex flex-wrap gap-2">
                        {parsed.quotas.map((q, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100/90 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200/60"
                          >
                            {q.label} — {q.count}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Collapsible Full notice */}
                  {ann.content && (
                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        onClick={() => toggleExpandNotice(ann.announcementId)}
                        className="text-xs font-semibold text-[#0a3263] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        <span>{isExpanded ? 'Hide notice details' : 'View full notice'}</span>
                      </button>

                      {isExpanded && (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed animate-in fade-in-50 duration-200">
                          {parsed.sourceRef && (
                            <p className="font-semibold text-slate-800 mb-2">Reference: {parsed.sourceRef}</p>
                          )}
                          {ann.content}
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
                        className="px-4 py-2 bg-[#0a3263] hover:bg-[#0f3360] text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-xs cursor-pointer"
                        title="View PDF Document"
                      >
                        <FileText className="w-4 h-4 text-sky-200" />
                        <span>Detail (PDF)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onViewNotice(ann)}
                        className="px-4 py-2 bg-[#0a3263] hover:bg-[#0f3360] text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-xs cursor-pointer"
                        title="View Full Notice Details"
                      >
                        <Eye className="w-4 h-4 text-sky-200" />
                        <span>Detail</span>
                      </button>
                    )}

                    {parsed.qrApplyUrl && (
                      <a
                        href={parsed.qrApplyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-xs"
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
                      className="px-3 py-2 text-slate-600 hover:text-[#0a3263] hover:bg-[#eef4fc] rounded-xl text-xs font-semibold border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                      title="Edit Announcement"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(ann.announcementId)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition cursor-pointer"
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
