import React from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { QuizAdminItem, Subject, UploadStatus } from '../../types';

export interface QuizFormState {
  subjectId: string;
  title: string;
  difficultyLevel: string;
  durationMinutes: string;
}

export const emptyQuizForm = (): QuizFormState => ({
  subjectId: '',
  title: '',
  difficultyLevel: 'medium',
  durationMinutes: '',
});

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingQuiz: QuizAdminItem | null;
  subjects: Subject[];
  quizForm: QuizFormState;
  setQuizForm: React.Dispatch<React.SetStateAction<QuizFormState>>;
  quizError: string;
  quizSubmitStatus: UploadStatus;
  onSubmit: (e: React.FormEvent) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  editingQuiz,
  subjects,
  quizForm,
  setQuizForm,
  quizError,
  quizSubmitStatus,
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
              {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Configure the quiz subject, difficulty, and duration
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
          {quizError && (
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-black text-xs flex items-center gap-2 font-normal">
              <AlertCircle className="w-4 h-4 shrink-0 text-black" />
              <span>{quizError}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Title *</label>
            <input
              type="text"
              placeholder="e.g. Khmer Grammar Practice Quiz"
              value={quizForm.title}
              onChange={(e) => setQuizForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Subject *</label>
            <select
              value={quizForm.subjectId}
              onChange={(e) => setQuizForm((f) => ({ ...f, subjectId: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              required
            >
              <option value="">Select subject...</option>
              {subjects.map((s) => (
                <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Difficulty</label>
              <select
                value={quizForm.difficultyLevel}
                onChange={(e) => setQuizForm((f) => ({ ...f, difficultyLevel: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Duration (Mins)</label>
              <input
                type="number"
                min={1}
                placeholder="e.g. 15"
                value={quizForm.durationMinutes}
                onChange={(e) => setQuizForm((f) => ({ ...f, durationMinutes: e.target.value }))}
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
              disabled={quizSubmitStatus === 'saving-db'}
              className="px-5 py-2 bg-white hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal shadow-2xs transition flex items-center gap-2 cursor-pointer"
            >
              {quizSubmitStatus === 'saving-db' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingQuiz ? 'Save Changes' : 'Create Quiz'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
