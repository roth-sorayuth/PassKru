import React, { useRef } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { AnnouncementItem, Exam, UploadStatus } from '../../types';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAnnouncement: AnnouncementItem | null;
  exams: Exam[];
  announcementForm: {
    examId: string;
    title: string;
    summary: string;
    content: string;
    requirements: string;
    totalSlots: string;
    category: string;
    isUrgent: boolean;
    deadlineDate: string;
    examDate: string;
    attachmentUrl: string;
  };
  setAnnouncementForm: React.Dispatch<React.SetStateAction<{
    examId: string;
    title: string;
    summary: string;
    content: string;
    requirements: string;
    totalSlots: string;
    category: string;
    isUrgent: boolean;
    deadlineDate: string;
    examDate: string;
    attachmentUrl: string;
  }>>;
  announcementFile: File | null;
  setAnnouncementFile: (file: File | null) => void;
  announcementError: string;
  announcementSubmitStatus: UploadStatus;
  onSubmit: (e: React.FormEvent) => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  editingAnnouncement,
  exams,
  announcementForm,
  setAnnouncementForm,
  announcementFile,
  setAnnouncementFile,
  announcementError,
  announcementSubmitStatus,
  onSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-lg font-medium text-black">
              {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Broadcast official dates, recruitment info, and notices to candidates
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
          {announcementError && (
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-black text-xs flex items-center gap-2 font-normal">
              <AlertCircle className="w-4 h-4 shrink-0 text-black" />
              <span>{announcementError}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Announcement Title *</label>
            <input
              type="text"
              placeholder="e.g. Official Ministry Exam Date Schedule 2026"
              value={announcementForm.title}
              onChange={e => setAnnouncementForm(f => ({ ...f, title: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Target Exam *</label>
              <select
                value={announcementForm.examId}
                onChange={e => setAnnouncementForm(f => ({ ...f, examId: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                required
              >
                <option value="">Select target exam...</option>
                {exams.map(e => (
                  <option key={e.examId} value={e.examId}>{e.examName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Category</label>
              <select
                value={announcementForm.category}
                onChange={e => setAnnouncementForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              >
                <option value="recruitment">Recruitment / Jobs</option>
                <option value="schedule">Exam Schedule</option>
                <option value="eligibility">Eligibility & Criteria</option>
                <option value="result">Exam Results</option>
                <option value="guideline">Guidelines & Rules</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Application Deadline</label>
              <input
                type="date"
                value={announcementForm.deadlineDate}
                onChange={e => setAnnouncementForm(f => ({ ...f, deadlineDate: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Actual Exam Date</label>
              <input
                type="date"
                value={announcementForm.examDate}
                onChange={e => setAnnouncementForm(f => ({ ...f, examDate: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Total Quota / Slots (ចំនួនជ្រើសរើស)</label>
              <input
                type="text"
                placeholder="e.g. 3,233 កន្លែង ឬ 2,696"
                value={announcementForm.totalSlots}
                onChange={e => setAnnouncementForm(f => ({ ...f, totalSlots: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Short Summary (សេចក្តីសង្ខេប)</label>
            <textarea
              rows={2}
              placeholder="Brief 1-2 sentence overview for candidates..."
              value={announcementForm.summary}
              onChange={e => setAnnouncementForm(f => ({ ...f, summary: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Full Announcement Details (ព័ត៌មានលម្អិត)</label>
            <textarea
              rows={4}
              placeholder="Full details, instructions, locations, timeline..."
              value={announcementForm.content}
              onChange={e => setAnnouncementForm(f => ({ ...f, content: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Candidate Requirements & Eligibility (លក្ខខណ្ឌជ្រើសរើស)</label>
            <textarea
              rows={3}
              placeholder="e.g. Degree requirements, age limits, required certifications, citizen status..."
              value={announcementForm.requirements}
              onChange={e => setAnnouncementForm(f => ({ ...f, requirements: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            />
          </div>

          {/* PDF File Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Attached PDF Document (Optional)</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-black bg-slate-50/50 hover:bg-slate-100/60 rounded-xl p-4 text-center cursor-pointer transition"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={e => setAnnouncementFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              {announcementFile ? (
                <div className="flex items-center justify-center gap-2 text-black text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>{announcementFile.name} ({(announcementFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-normal">
                  <Upload className="w-4 h-4 text-slate-700" />
                  <span>Upload official circular / announcement PDF</span>
                </div>
              )}
            </div>
          </div>

          {/* External URL or existing link */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 uppercase tracking-wider">Or External Document URL</label>
            <input
              type="url"
              placeholder="https://... official PDF URL"
              value={announcementForm.attachmentUrl}
              onChange={e => setAnnouncementForm(f => ({ ...f, attachmentUrl: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={announcementForm.isUrgent}
                onChange={e => setAnnouncementForm(f => ({ ...f, isUrgent: e.target.checked }))}
                className="w-4 h-4 rounded text-black border-slate-300 focus:ring-black"
              />
              <span className="text-xs font-medium text-black">Mark as URGENT Announcement</span>
            </label>
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
              disabled={announcementSubmitStatus === 'uploading-storage' || announcementSubmitStatus === 'saving-db'}
              className="px-5 py-2 bg-white hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal shadow-2xs transition flex items-center gap-2 cursor-pointer"
            >
              {announcementSubmitStatus === 'uploading-storage' || announcementSubmitStatus === 'saving-db' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Saving Announcement...</span>
                </>
              ) : (
                <span>{editingAnnouncement ? 'Save Changes' : 'Publish Announcement'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
