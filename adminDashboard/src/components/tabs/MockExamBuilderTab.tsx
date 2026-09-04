import React from 'react';
import { Search, Plus, Pencil, Trash2, ListChecks, ClipboardList } from 'lucide-react';
import { MockExamAdminItem, QuizAdminItem } from '../../types';

export type BuilderSubMode = 'mock-exams' | 'quizzes';

interface MockExamBuilderTabProps {
  subMode: BuilderSubMode;
  setSubMode: (mode: BuilderSubMode) => void;

  /* Mock Exams */
  filteredMockExams: MockExamAdminItem[];
  mockExamSearch: string;
  setMockExamSearch: (s: string) => void;
  mockExamsLoading: boolean;
  onCreateMockExam: () => void;
  onEditMockExam: (m: MockExamAdminItem) => void;
  onDeleteMockExam: (id: number) => void;
  onManageSections: (m: MockExamAdminItem) => void;

  /* Quizzes */
  filteredQuizzes: QuizAdminItem[];
  quizSearch: string;
  setQuizSearch: (s: string) => void;
  quizzesLoading: boolean;
  onCreateQuiz: () => void;
  onEditQuiz: (q: QuizAdminItem) => void;
  onDeleteQuiz: (id: number) => void;
  onAssignQuizQuestions: (q: QuizAdminItem) => void;
}

export const MockExamBuilderTab: React.FC<MockExamBuilderTabProps> = ({
  subMode,
  setSubMode,
  filteredMockExams,
  mockExamSearch,
  setMockExamSearch,
  mockExamsLoading,
  onCreateMockExam,
  onEditMockExam,
  onDeleteMockExam,
  onManageSections,
  filteredQuizzes,
  quizSearch,
  setQuizSearch,
  quizzesLoading,
  onCreateQuiz,
  onEditQuiz,
  onDeleteQuiz,
  onAssignQuizQuestions,
}) => {
  return (
    <div className="space-y-6">
      {/* Sub-mode toggle */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm w-fit">
        <button
          onClick={() => setSubMode('mock-exams')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-normal transition cursor-pointer ${
            subMode === 'mock-exams' ? 'bg-slate-100 text-black border border-slate-300' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <ClipboardList className="w-4 h-4" /> Mock Exams
        </button>
        <button
          onClick={() => setSubMode('quizzes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-normal transition cursor-pointer ${
            subMode === 'quizzes' ? 'bg-slate-100 text-black border border-slate-300' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <ListChecks className="w-4 h-4" /> Practice Quizzes
        </button>
      </div>

      {subMode === 'mock-exams' ? (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search mock exams by title..."
                  value={mockExamSearch}
                  onChange={(e) => setMockExamSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                />
              </div>
              <button
                onClick={onCreateMockExam}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-xl text-sm font-normal transition shadow-2xs shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Mock Exam
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-normal text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6 font-normal">Title</th>
                    <th className="py-3.5 px-4 font-normal">Exam</th>
                    <th className="py-3.5 px-4 font-normal">Duration</th>
                    <th className="py-3.5 px-4 font-normal">Questions</th>
                    <th className="py-3.5 px-4 text-right font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockExamsLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400 font-normal">Loading mock exams...</td>
                    </tr>
                  ) : filteredMockExams.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400 font-normal">
                        No mock exams found. Click "Create Mock Exam" to add one.
                      </td>
                    </tr>
                  ) : (
                    filteredMockExams.map((m) => (
                      <tr key={m.mockExamId} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 sm:px-6">
                          <p className="font-normal text-black truncate">{m.title}</p>
                          {m.year && <p className="text-xs text-slate-500 font-normal">{m.year}</p>}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-black font-normal">{m.examName || '—'}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-600 font-normal">
                          {m.durationMinutes ? `${m.durationMinutes} mins` : '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-slate-100 text-black border border-slate-200">
                            {m.totalQuestions}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onManageSections(m)}
                              className="px-3 py-1.5 text-slate-700 hover:text-black hover:bg-slate-100 rounded-lg text-xs font-normal border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                              title="Manage Sections & Questions"
                            >
                              <ListChecks className="w-3.5 h-3.5" /> Sections
                            </button>
                            <button
                              onClick={() => onEditMockExam(m)}
                              className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title="Edit Mock Exam"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteMockExam(m.mockExamId)}
                              className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title="Delete Mock Exam"
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
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search quizzes by title..."
                  value={quizSearch}
                  onChange={(e) => setQuizSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                />
              </div>
              <button
                onClick={onCreateQuiz}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-xl text-sm font-normal transition shadow-2xs shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Quiz
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-normal text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6 font-normal">Title</th>
                    <th className="py-3.5 px-4 font-normal">Subject</th>
                    <th className="py-3.5 px-4 font-normal">Difficulty</th>
                    <th className="py-3.5 px-4 font-normal">Duration</th>
                    <th className="py-3.5 px-4 font-normal">Questions</th>
                    <th className="py-3.5 px-4 text-right font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quizzesLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400 font-normal">Loading quizzes...</td>
                    </tr>
                  ) : filteredQuizzes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400 font-normal">
                        No quizzes found. Click "Create Quiz" to add one.
                      </td>
                    </tr>
                  ) : (
                    filteredQuizzes.map((q) => (
                      <tr key={q.quizId} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 sm:px-6">
                          <p className="font-normal text-black truncate">{q.title}</p>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-black font-normal">{q.subjectName || '—'}</td>
                        <td className="py-3.5 px-4">
                          {q.difficultyLevel ? (
                            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-slate-100 text-black border border-slate-200 capitalize">
                              {q.difficultyLevel}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 font-normal">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600 font-normal">
                          {q.durationMinutes ? `${q.durationMinutes} mins` : '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-slate-100 text-black border border-slate-200">
                            {q.totalQuestions}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onAssignQuizQuestions(q)}
                              className="px-3 py-1.5 text-slate-700 hover:text-black hover:bg-slate-100 rounded-lg text-xs font-normal border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                              title="Assign Questions"
                            >
                              <ListChecks className="w-3.5 h-3.5" /> Questions
                            </button>
                            <button
                              onClick={() => onEditQuiz(q)}
                              className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title="Edit Quiz"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteQuiz(q.quizId)}
                              className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title="Delete Quiz"
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
      )}
    </div>
  );
};
