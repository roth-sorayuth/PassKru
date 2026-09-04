import React, { useEffect, useState } from 'react';
import { X, Search, Loader2, AlertCircle, CheckSquare, Square } from 'lucide-react';
import { QuestionItem } from '../../types';
import { questionService } from '../../services/questionService';

interface QuestionPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: number | null;
  subjectName?: string;
  initialSelectedIds: number[];
  title?: string;
  onSave: (questionIds: number[]) => Promise<void>;
}

export const QuestionPickerModal: React.FC<QuestionPickerModalProps> = ({
  isOpen,
  onClose,
  subjectId,
  subjectName,
  initialSelectedIds,
  title = 'Assign Questions',
  onSave,
}) => {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isOpen || !subjectId) return;
    setSelected(new Set(initialSelectedIds));
    setSearch('');
    setError('');
    setLoading(true);
    questionService
      .getQuestions({ subjectId })
      .then(setQuestions)
      .catch((err: any) => setError(err.message || 'Failed to load questions'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, subjectId]);

  if (!isOpen) return null;

  const filtered = questions.filter(
    (q) => search === '' || q.questionText.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await onSave(Array.from(selected));
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save question assignment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-normal text-black">{title}</h2>
            <p className="text-xs text-slate-500 font-normal">
              {subjectName ? `Questions from ${subjectName}` : 'Select questions to include'} — {selected.size} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-black rounded-lg hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-4">
          {error && (
            <div className="mb-3 p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-black text-xs flex items-center gap-2 font-normal">
              <AlertCircle className="w-4 h-4 shrink-0 text-black" />
              <span>{error}</span>
            </div>
          )}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            />
          </div>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-2 flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-400 text-sm font-normal gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading questions...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm font-normal">
              No questions found for this subject.
            </div>
          ) : (
            filtered.map((q) => {
              const isSelected = selected.has(q.questionId);
              return (
                <button
                  type="button"
                  key={q.questionId}
                  onClick={() => toggle(q.questionId)}
                  className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                    isSelected ? 'bg-slate-100 border-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm text-black font-normal truncate">{q.questionText}</p>
                    <p className="text-xs text-slate-500 font-normal">
                      {q.topicName || '—'} · {q.questionType} {q.difficultyLevel ? `· ${q.difficultyLevel}` : ''}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-normal transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="px-5 py-2 bg-white hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal shadow-2xs transition flex items-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Selection ({selected.size})</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
