import React from 'react';
import { Search, UserPlus, Pencil, Trash2, Check, X as XIcon, Ban, RotateCcw, Loader2, User } from 'lucide-react';
import { MentorItem, MentorStatus } from '../../types';

interface MentorModerationTabProps {
  filteredMentors: MentorItem[];
  mentorSearch: string;
  setMentorSearch: (s: string) => void;
  mentorStatusFilter: MentorStatus | 'all';
  setMentorStatusFilter: (status: MentorStatus | 'all') => void;
  loading: boolean;
  onCreateNew: () => void;
  onEdit: (m: MentorItem) => void;
  onDelete: (id: number) => void;
  onSetStatus: (id: number, status: MentorStatus) => void;
}

const STATUS_STYLES: Record<MentorStatus, string> = {
  pending: 'bg-slate-100 text-black border-slate-300',
  approved: 'bg-black text-white border-black',
  rejected: 'bg-slate-100 text-slate-500 border-slate-200',
  suspended: 'bg-slate-100 text-slate-500 border-slate-200',
};

const STATUS_TABS: { value: MentorStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'ទាំងអស់' },
  { value: 'pending', label: 'រង់ចាំពិនិត្យ' },
  { value: 'approved', label: 'បានអនុម័ត' },
  { value: 'rejected', label: 'បានបដិសេធ' }
];

export const formatMentorSubjects = (rawSubjects: any): string[] => {
  if (!rawSubjects) return [];

  let list = rawSubjects;
  if (typeof rawSubjects === 'string') {
    try {
      list = JSON.parse(rawSubjects);
    } catch {
      return rawSubjects
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
  }

  if (Array.isArray(list)) {
    return list
      .map((item: any) => {
        if (!item) return '';
        if (typeof item === 'string') return item.trim();
        if (typeof item === 'object') {
          return (
            item.km ||
            item.en ||
            item.subjectName ||
            item.name ||
            item.subject_name ||
            item.title ||
            ''
          );
        }
        return String(item);
      })
      .filter(Boolean);
  }

  return [];
};

export const MentorModerationTab: React.FC<MentorModerationTabProps> = ({
  filteredMentors,
  mentorSearch,
  setMentorSearch,
  mentorStatusFilter,
  setMentorStatusFilter,
  loading,
  onCreateNew,
  onEdit,
  onDelete,
  onSetStatus,
}) => {
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ស្វែងរកគ្រូបង្រៀន តាមឈ្មោះ ឬជំនាញ..."
              value={mentorSearch}
              onChange={(e) => setMentorSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            />
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-xl text-sm font-normal transition shadow-2xs shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            បន្ថែមគ្រូបង្រៀន
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-normal text-slate-500 uppercase tracking-wider mr-1">ស្ថានភាព:</span>
          {STATUS_TABS.map((s) => (
            <button
              key={s.value}
              onClick={() => setMentorStatusFilter(s.value)}
              className={`px-3 py-1 rounded-lg text-xs font-normal transition cursor-pointer ${
                mentorStatusFilter === s.value
                  ? 'bg-black text-white border border-black shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mentors Card Grid View */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl">
          <Loader2 className="w-6 h-6 animate-spin text-black" />
          <span className="ml-2 text-xs font-normal text-slate-600">កំពុងទាញយកព័ត៌មានគ្រូបង្រៀន...</span>
        </div>
      ) : filteredMentors.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-400 shadow-sm">
          <User className="w-12 h-12 mx-auto mb-3 opacity-30 text-black" />
          <p className="text-sm font-normal text-slate-700">មិនមានគ្រូបង្រៀនដែលត្រូវតាមការស្វែងរកឡើយ។</p>
          <button
            onClick={onCreateNew}
            className="mt-4 px-4 py-2 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal transition shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            + បន្ថែមគ្រូបង្រៀនថ្មី
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredMentors.map((m) => {
            const subjectsList = formatMentorSubjects(m.subjects);
            const statusLabel =
              m.status === 'approved' ? 'បានអនុម័ត' :
              m.status === 'rejected' ? 'បានបដិសេធ' :
              m.status === 'suspended' ? 'បានផ្អាក' : 'រង់ចាំពិនិត្យ';

            return (
              <div key={m.mentorId} className="flex flex-col gap-1.5">
                {/* Header Info Line above Card */}
                <div className="text-xs font-normal text-slate-700 px-1 flex items-center justify-between">
                  <span>បទពិសោធន៍ {m.experienceYears || 0} ឆ្នាំ</span>
                  <span className={`text-[10px] font-normal px-2 py-0.5 rounded-full border ${STATUS_STYLES[m.status]}`}>
                    {statusLabel}
                  </span>
                </div>

                {/* Card Container */}
                <div className="group bg-white border border-slate-200 hover:border-black rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs transition flex flex-col flex-1">
                  {/* Visual Profile Avatar Box */}
                  <div className="h-44 bg-slate-50 border-b border-slate-100 relative overflow-hidden flex items-center justify-center p-4">
                    {m.avatarUrl ? (
                      <img
                        src={m.avatarUrl}
                        alt={`${m.firstName} ${m.lastName}`}
                        className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-slate-200 text-slate-700 border-2 border-white flex items-center justify-center text-2xl font-normal shadow-md group-hover:scale-105 transition">
                        {m.firstName?.[0] || 'M'}
                      </div>
                    )}

                    {m.hourlyRate && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-black text-white text-[9px] font-normal px-2 py-0.5 rounded shadow-xs border border-white/20">
                          {m.hourlyRate}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between bg-white space-y-3">
                    <div>
                      <p className="text-[11px] font-normal text-slate-500 uppercase tracking-wider truncate">
                        {m.title || m.roleLabel || 'គ្រូបង្រៀន'}
                      </p>
                      <h3 className="text-sm font-normal text-black truncate mt-0.5 leading-snug group-hover:text-black transition">
                        {m.firstName} {m.lastName}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 font-normal min-h-[32px]">
                        {subjectsList.length > 0 ? subjectsList.join(', ') : 'គ្មានមុខវិជ្ជាបញ្ជាក់'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-normal">
                      <span>ការកក់សរុប</span>
                      <span className="text-black font-normal">{m._count?.mentorBookings ?? 0} ដង</span>
                    </div>

                    {/* Action Tools Toolbar */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        {m.status !== 'approved' && (
                          <button
                            onClick={() => onSetStatus(m.mentorId, 'approved')}
                            className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="អនុម័តគ្រូបង្រៀន"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {m.status !== 'rejected' && (
                          <button
                            onClick={() => onSetStatus(m.mentorId, 'rejected')}
                            className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="បដិសេធគ្រូបង្រៀន"
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        )}
                        {m.status === 'approved' && (
                          <button
                            onClick={() => onSetStatus(m.mentorId, 'suspended')}
                            className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="ផ្អាកគ្រូបង្រៀន"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        {(m.status === 'suspended' || m.status === 'rejected') && (
                          <button
                            onClick={() => onSetStatus(m.mentorId, 'pending')}
                            className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="ប្តូរទៅរង់ចាំពិនិត្យវិញ"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEdit(m)}
                          className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="កែប្រែគ្រូបង្រៀន"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(m.mentorId)}
                          className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="លុបគ្រូបង្រៀន"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
