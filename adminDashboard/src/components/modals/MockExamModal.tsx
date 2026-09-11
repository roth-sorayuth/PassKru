import React from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { Exam, MockExamAdminItem, UploadStatus } from '../../types';

export interface MockExamFormState {
  examId: string;
  title: string;
  description: string;
  year: string;
  durationMinutes: string;
  totalMarks: string;
  passingMarks: string;
}

export const emptyMockExamForm = (): MockExamFormState => ({
  examId: '',
  title: '',
  description: '',
  year: String(new Date().getFullYear()),
  durationMinutes: '',
  totalMarks: '',
  passingMarks: '',
});

interface MockExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMockExam: MockExamAdminItem | null;
  exams: Exam[];
  mockExamForm: MockExamFormState;
  setMockExamForm: React.Dispatch<React.SetStateAction<MockExamFormState>>;
  mockExamError: string;
  mockExamSubmitStatus: UploadStatus;
  onSubmit: (e: React.FormEvent) => void;
}

export const MockExamModal: React.FC<MockExamModalProps> = ({
  isOpen,
  onClose,
  editingMockExam,
  exams,
  mockExamForm,
  setMockExamForm,
  mockExamError,
  mockExamSubmitStatus,
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
              {editingMockExam ? 'Edit Mock Exam' : 'Create New Mock Exam'}
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Configure the mock exam's target exam, timing, and marks
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
          {mockExamError && (
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-black text-xs flex items-center gap-2 font-normal">
              <AlertCircle className="w-4 h-4 shrink-0 text-black" />
              <span>{mockExamError}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Title *</label>
            <input
              type="text"
              placeholder="e.g. 2026 National Police Mock Exam"
              value={mockExamForm.title}
              onChange={(e) => setMockExamForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Target Exam *</label>
            <select
              value={mockExamForm.examId}
              onChange={(e) => setMockExamForm((f) => ({ ...f, examId: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              required
            >
              <option value="">Select exam...</option>
              {exams.map((e) => (
                <option key={e.examId} value={e.examId}>{e.examName}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="Short description of this mock exam..."
              value={mockExamForm.description}
              onChange={(e) => setMockExamForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Year</label>
              <input
                type="number"
                value={mockExamForm.year}
                onChange={(e) => setMockExamForm((f) => ({ ...f, year: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Duration (Mins)</label>
              <input
                type="number"
                min={1}
                placeholder="e.g. 90"
                value={mockExamForm.durationMinutes}
                onChange={(e) => setMockExamForm((f) => ({ ...f, durationMinutes: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Total Marks</label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 100"
                value={mockExamForm.totalMarks}
                onChange={(e) => setMockExamForm((f) => ({ ...f, totalMarks: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Passing Marks</label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 50"
                value={mockExamForm.passingMarks}
                onChange={(e) => setMockExamForm((f) => ({ ...f, passingMarks: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              />
            </div>
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
              disabled={mockExamSubmitStatus === 'saving-db'}
              className="px-5 py-2 bg-white hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal shadow-2xs transition flex items-center gap-2 cursor-pointer"
            >
              {mockExamSubmitStatus === 'saving-db' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingMockExam ? 'Save Changes' : 'Create Mock Exam'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
