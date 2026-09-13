import React from 'react';
import { X, AlertCircle, Loader2, Plus, Trash2 } from 'lucide-react';
import { QuestionItem, Subject, TopicItem, UploadStatus } from '../../types';

export interface QuestionOptionForm {
  optionText: string;
  isCorrect: boolean;
}

export interface QuestionFormState {
  subjectId: string;
  topicId: string;
  questionText: string;
  questionType: string;
  difficultyLevel: string;
  correctAnswer: string;
  explanation: string;
  referenceNote: string;
  options: QuestionOptionForm[];
}

export const QUESTION_TYPE_OPTIONS = [
  { value: 'multiple-choice', label: 'ជ្រើសរើសចម្លើយ' },
  { value: 'true-false', label: 'ត្រូវ / ខុស' },
  { value: 'short-answer', label: 'ឆ្លើយខ្លី' },
];

export const emptyQuestionForm = (): QuestionFormState => ({
  subjectId: '',
  topicId: '',
  questionText: '',
  questionType: 'multiple-choice',
  difficultyLevel: 'medium',
  correctAnswer: '',
  explanation: '',
  referenceNote: '',
  options: [
    { optionText: '', isCorrect: true },
    { optionText: '', isCorrect: false },
  ],
});

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingQuestion: QuestionItem | null;
  subjects: Subject[];
  topics: TopicItem[];
  questionForm: QuestionFormState;
  setQuestionForm: React.Dispatch<React.SetStateAction<QuestionFormState>>;
  questionError: string;
  questionSubmitStatus: UploadStatus;
  onSubmit: (e: React.FormEvent) => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  editingQuestion,
  subjects,
  topics,
  questionForm,
  setQuestionForm,
  questionError,
  questionSubmitStatus,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const isShortAnswer = questionForm.questionType === 'short-answer';

  const updateOption = (index: number, patch: Partial<QuestionOptionForm>) => {
    setQuestionForm((f) => ({
      ...f,
      options: f.options.map((o, i) => (i === index ? { ...o, ...patch } : o)),
    }));
  };

  const setCorrectOption = (index: number) => {
    setQuestionForm((f) => ({
      ...f,
      options: f.options.map((o, i) => ({ ...o, isCorrect: i === index })),
    }));
  };

  const addOption = () => {
    setQuestionForm((f) => ({
      ...f,
      options: [...f.options, { optionText: '', isCorrect: false }],
    }));
  };

  const removeOption = (index: number) => {
    setQuestionForm((f) => ({
      ...f,
      options: f.options.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-normal text-black">
              {editingQuestion ? 'កែប្រែសំណួរ' : 'បង្កើតសំណួរថ្មី'}
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              បញ្ចូលខ្លឹមសារសំណួរ ចម្លើយត្រឹមត្រូវ និងការបកស្រាយ
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
          {questionError && (
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-black text-xs flex items-center gap-2 font-normal">
              <AlertCircle className="w-4 h-4 shrink-0 text-black" />
              <span>{questionError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">មុខវិជ្ជា *</label>
              <select
                value={questionForm.subjectId}
                onChange={(e) => setQuestionForm((f) => ({ ...f, subjectId: e.target.value, topicId: '' }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                required
              >
                <option value="">ជ្រើសរើសមុខវិជ្ជា...</option>
                {subjects.map((s) => (
                  <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">ប្រធានបទ *</label>
              <select
                value={questionForm.topicId}
                onChange={(e) => setQuestionForm((f) => ({ ...f, topicId: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal disabled:bg-slate-50 disabled:text-slate-400"
                required
                disabled={!questionForm.subjectId}
              >
                <option value="">{questionForm.subjectId ? 'ជ្រើសរើសប្រធានបទ...' : 'ជ្រើសរើសមុខវិជ្ជាជាមុនសិន'}</option>
                {topics.map((t) => (
                  <option key={t.topicId} value={t.topicId}>{t.topicName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">ខ្លឹមសារសំណួរ *</label>
            <textarea
              rows={3}
              placeholder="បញ្ចូលខ្លឹមសារសំណួរ..."
              value={questionForm.questionText}
              onChange={(e) => setQuestionForm((f) => ({ ...f, questionText: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">ប្រភេទសំណួរ</label>
              <select
                value={questionForm.questionType}
                onChange={(e) => setQuestionForm((f) => ({ ...f, questionType: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              >
                {QUESTION_TYPE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">កម្រិតលំបាក</label>
              <select
                value={questionForm.difficultyLevel}
                onChange={(e) => setQuestionForm((f) => ({ ...f, difficultyLevel: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              >
                <option value="easy">ងាយ</option>
                <option value="medium">មធ្យម</option>
                <option value="hard">ពិបាក</option>
              </select>
            </div>
          </div>

          {isShortAnswer ? (
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">ចម្លើយត្រឹមត្រូវ *</label>
              <input
                type="text"
                placeholder="បញ្ចូលអត្ថបទចម្លើយត្រឹមត្រូវ..."
                value={questionForm.correctAnswer}
                onChange={(e) => setQuestionForm((f) => ({ ...f, correctAnswer: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">
                  ជម្រើសចម្លើយ * <span className="normal-case text-slate-400">(ជ្រើសរើសយកមួយជាចម្លើយត្រឹមត្រូវ)</span>
                </label>
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center gap-1 text-xs font-normal text-black hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> បន្ថែមជម្រើស
                </button>
              </div>
              <div className="space-y-2">
                {questionForm.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={opt.isCorrect}
                      onChange={() => setCorrectOption(idx)}
                      className="w-4 h-4 shrink-0 text-black border-slate-300 focus:ring-black"
                      title="ជ្រើសរើសជាចម្លើយត្រឹមត្រូវ"
                    />
                    <input
                      type="text"
                      placeholder={`ជម្រើសទី ${idx + 1}`}
                      value={opt.optionText}
                      onChange={(e) => updateOption(idx, { optionText: e.target.value })}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(idx)}
                      disabled={questionForm.options.length <= 2}
                      className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                      title="លុបជម្រើស"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">ការបកស្រាយ (ពន្យល់ចម្លើយ)</label>
            <textarea
              rows={2}
              placeholder="ពន្យល់មូលហេតុនៃចម្លើយត្រឹមត្រូវ..."
              value={questionForm.explanation}
              onChange={(e) => setQuestionForm((f) => ({ ...f, explanation: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">ចំណាំយោង</label>
            <input
              type="text"
              placeholder="ឧ. មេរៀនទី១ ទំព័រ ២០..."
              value={questionForm.referenceNote}
              onChange={(e) => setQuestionForm((f) => ({ ...f, referenceNote: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-normal transition cursor-pointer"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={questionSubmitStatus === 'saving-db'}
              className="px-5 py-2 bg-white hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal shadow-2xs transition flex items-center gap-2 cursor-pointer"
            >
              {questionSubmitStatus === 'saving-db' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>កំពុងរក្សាទុក...</span>
                </>
              ) : (
                <span>{editingQuestion ? 'រក្សាទុកការកែប្រែ' : 'បង្កើតសំណួរ'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
