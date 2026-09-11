import React from 'react';
import { Search, UserPlus, Pencil, Trash2, Check, X as XIcon, Ban, RotateCcw } from 'lucide-react';
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
  approved: 'bg-slate-100 text-black border-slate-300',
  rejected: 'bg-slate-100 text-slate-500 border-slate-200',
  suspended: 'bg-slate-100 text-slate-500 border-slate-200',
};

const STATUS_TABS: { value: MentorStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'suspended', label: 'Suspended' },
];

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
              placeholder="Search mentors by name or title..."
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
            Create Mentor
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-normal text-slate-500 uppercase tracking-wider mr-1">Status:</span>
          {STATUS_TABS.map((s) => (
            <button
              key={s.value}
              onClick={() => setMentorStatusFilter(s.value)}
              className={`px-3 py-1 rounded-lg text-xs font-normal transition cursor-pointer ${
                mentorStatusFilter === s.value
                  ? 'bg-slate-100 text-black border border-slate-300'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mentors table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-normal text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6 font-normal">Mentor</th>
                <th className="py-3.5 px-4 font-normal">Subjects</th>
                <th className="py-3.5 px-4 font-normal">Status</th>
                <th className="py-3.5 px-4 font-normal">Bookings</th>
                <th className="py-3.5 px-4 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-normal">Loading mentors...</td>
                </tr>
              ) : filteredMentors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-normal">
                    No mentors found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredMentors.map((m) => {
                  const subjectsList = Array.isArray(m.subjects)
                    ? m.subjects
                    : typeof m.subjects === 'string' && m.subjects
                    ? [m.subjects]
                    : [];
                  return (
                    <tr key={m.mentorId} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 text-black border border-slate-200 flex items-center justify-center font-normal text-xs shrink-0 shadow-2xs overflow-hidden">
                            {m.avatarUrl ? (
                              <img src={m.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              m.firstName?.[0] || 'M'
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-normal text-black truncate">{m.firstName} {m.lastName}</p>
                            <p className="text-xs text-slate-500 truncate font-normal">{m.title || m.roleLabel || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-xs text-black font-normal truncate max-w-[200px]">
                          {subjectsList.length > 0 ? subjectsList.join(', ') : '—'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-xs font-normal px-2.5 py-0.5 rounded-full border capitalize ${STATUS_STYLES[m.status]}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 font-normal">
                        {m._count?.mentorBookings ?? 0}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {m.status !== 'approved' && (
                            <button
                              onClick={() => onSetStatus(m.mentorId, 'approved')}
                              className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title="Approve Mentor"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {m.status !== 'rejected' && (
                            <button
                              onClick={() => onSetStatus(m.mentorId, 'rejected')}
                              className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title="Reject Mentor"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          )}
                          {m.status === 'approved' && (
                            <button
                              onClick={() => onSetStatus(m.mentorId, 'suspended')}
                              className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title="Suspend Mentor"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          {(m.status === 'suspended' || m.status === 'rejected') && (
                            <button
                              onClick={() => onSetStatus(m.mentorId, 'pending')}
                              className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title="Reset to Pending"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onEdit(m)}
                            className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Edit Mentor"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(m.mentorId)}
                            className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Delete Mentor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
