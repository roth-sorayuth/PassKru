import React from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { MentorItem, MentorStatus, UploadStatus } from '../../types';

export interface MentorFormState {
  firstName: string;
  lastName: string;
  title: string;
  roleLabel: string;
  avatarUrl: string;
  experienceYears: string;
  bio: string;
  hourlyRate: string;
  socialTelegram: string;
  subjects: string; // comma-separated in the form, converted to string[] on submit
  availability: string;
  status: MentorStatus;
}

export const emptyMentorForm = (): MentorFormState => ({
  firstName: '',
  lastName: '',
  title: '',
  roleLabel: '',
  avatarUrl: '',
  experienceYears: '',
  bio: '',
  hourlyRate: '',
  socialTelegram: '',
  subjects: '',
  availability: '',
  status: 'pending',
});

interface MentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMentor: MentorItem | null;
  mentorForm: MentorFormState;
  setMentorForm: React.Dispatch<React.SetStateAction<MentorFormState>>;
  mentorError: string;
  mentorSubmitStatus: UploadStatus;
  onSubmit: (e: React.FormEvent) => void;
}

export const MentorModal: React.FC<MentorModalProps> = ({
  isOpen,
  onClose,
  editingMentor,
  mentorForm,
  setMentorForm,
  mentorError,
  mentorSubmitStatus,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-normal text-black">
              {editingMentor ? 'Edit Mentor Profile' : 'Create New Mentor'}
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Manage mentor profile details and moderation status
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-black rounded-lg hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {mentorError && (
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-black text-xs flex items-center gap-2 font-normal">
              <AlertCircle className="w-4 h-4 shrink-0 text-black" />
              <span>{mentorError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">First Name *</label>
              <input
                type="text"
                placeholder="e.g. Dara"
                value={mentorForm.firstName}
                onChange={(e) => setMentorForm((f) => ({ ...f, firstName: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Last Name *</label>
              <input
                type="text"
                placeholder="e.g. Sok"
                value={mentorForm.lastName}
                onChange={(e) => setMentorForm((f) => ({ ...f, lastName: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Title</label>
              <input
                type="text"
                placeholder="e.g. Senior Police Instructor"
                value={mentorForm.title}
                onChange={(e) => setMentorForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Role Label</label>
              <input
                type="text"
                placeholder="e.g. Exam Prep Mentor"
                value={mentorForm.roleLabel}
                onChange={(e) => setMentorForm((f) => ({ ...f, roleLabel: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Avatar URL (Optional)</label>
            <input
              type="text"
              placeholder="https://..."
              value={mentorForm.avatarUrl}
              onChange={(e) => setMentorForm((f) => ({ ...f, avatarUrl: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Subjects (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Khmer, Law, Physical Fitness"
              value={mentorForm.subjects}
              onChange={(e) => setMentorForm((f) => ({ ...f, subjects: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Bio (Optional)</label>
            <textarea
              rows={3}
              placeholder="Short mentor biography..."
              value={mentorForm.bio}
              onChange={(e) => setMentorForm((f) => ({ ...f, bio: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Experience (Years)</label>
              <input
                type="number"
                min={0}
                value={mentorForm.experienceYears}
                onChange={(e) => setMentorForm((f) => ({ ...f, experienceYears: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Hourly Rate</label>
              <input
                type="text"
                placeholder="e.g. $10/hr"
                value={mentorForm.hourlyRate}
                onChange={(e) => setMentorForm((f) => ({ ...f, hourlyRate: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Availability</label>
              <input
                type="text"
                placeholder="e.g. Weekdays 6-9PM"
                value={mentorForm.availability}
                onChange={(e) => setMentorForm((f) => ({ ...f, availability: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Telegram (Optional)</label>
              <input
                type="text"
                placeholder="@username"
                value={mentorForm.socialTelegram}
                onChange={(e) => setMentorForm((f) => ({ ...f, socialTelegram: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Moderation Status</label>
            <select
              value={mentorForm.status}
              onChange={(e) => setMentorForm((f) => ({ ...f, status: e.target.value as MentorStatus }))}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-normal transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mentorSubmitStatus === 'saving-db'}
              className="px-5 py-2 bg-white hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal shadow-2xs transition flex items-center gap-2 cursor-pointer"
            >
              {mentorSubmitStatus === 'saving-db' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingMentor ? 'Save Changes' : 'Create Mentor'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
