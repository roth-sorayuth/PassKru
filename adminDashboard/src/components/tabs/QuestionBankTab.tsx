import React from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { QuestionItem, Subject } from '../../types';

interface QuestionBankTabProps {
  subjects: Subject[];
  filteredQuestions: QuestionItem[];
  questionSearch: string;
  setQuestionSearch: (s: string) => void;
  questionSubjectFilter: string | null;
  setQuestionSubjectFilter: (id: string | null) => void;
  questionTypeFilter: string | null;
  setQuestionTypeFilter: (t: string | null) => void;
  onCreateNew: () => void;
  onEdit: (q: QuestionItem) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  'multiple-choice': 'Multiple Choice',
  'true-false': 'True / False',
  'short-answer': 'Short Answer',
};

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: 'bg-slate-100 text-black border-slate-200',
  medium: 'bg-slate-100 text-black border-slate-200',
  hard: 'bg-slate-100 text-black border-slate-200',
};

export const QuestionBankTab: React.FC<QuestionBankTabProps> = ({
  subjects,
  filteredQuestions,
  questionSearch,
  setQuestionSearch,
  questionSubjectFilter,
  setQuestionSubjectFilter,
  questionTypeFilter,
  setQuestionTypeFilter,
  onCreateNew,
  onEdit,
  onDelete,
  loading,
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
              placeholder="Search questions by text..."
              value={questionSearch}
              onChange={(e) => setQuestionSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            />
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-xl text-sm font-normal transition shadow-2xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Question
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-normal text-slate-500 uppercase tracking-wider">Subject:</span>
            <select
              value={questionSubjectFilter || ''}
              onChange={(e) => setQuestionSubjectFilter(e.target.value || null)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-normal text-slate-500 uppercase tracking-wider">Type:</span>
            <select
              value={questionTypeFilter || ''}
              onChange={(e) => setQuestionTypeFilter(e.target.value || null)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            >
              <option value="">All Types</option>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-normal text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6 font-normal">Question</th>
                <th className="py-3.5 px-4 font-normal">Subject / Topic</th>
                <th className="py-3.5 px-4 font-normal">Type</th>
                <th className="py-3.5 px-4 font-normal">Difficulty</th>
                <th className="py-3.5 px-4 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-normal">
                    Loading questions...
                  </td>
                </tr>
              ) : filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-normal">
                    No questions found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((q) => (
                  <tr key={q.questionId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 sm:px-6 max-w-md">
                      <p className="font-normal text-black truncate">{q.questionText}</p>
                      {q.options?.length > 0 && (
                        <p className="text-xs text-slate-500 truncate font-normal">
                          {q.options.length} option{q.options.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-xs text-black font-normal">{q.subjectName || '—'}</p>
                      <p className="text-xs text-slate-500 font-normal">{q.topicName || '—'}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-slate-100 text-black border border-slate-200">
                        {TYPE_LABELS[q.questionType] || q.questionType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {q.difficultyLevel ? (
                        <span className={`text-xs font-normal px-2.5 py-0.5 rounded-full border capitalize ${DIFFICULTY_STYLES[q.difficultyLevel] || 'bg-slate-100 text-black border-slate-200'}`}>
                          {q.difficultyLevel}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-normal">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(q)}
                          className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Edit Question"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(q.questionId)}
                          className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
