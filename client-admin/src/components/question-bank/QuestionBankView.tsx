import React, { useState } from 'react';
import { Question, QuestionType, DifficultyLevel, SubjectCategory, ExamTargetLevel, VerificationStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmModal } from '../common/ConfirmModal';
import { EmptyState } from '../common/EmptyState';
import { Pagination } from '../common/Pagination';
import { SUBJECT_LABELS, EXAM_LEVEL_LABELS } from '../../data/mockData';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  Sparkles, 
  BookOpen, 
  Check, 
  X, 
  AlertCircle,
  BarChart,
  Copy
} from 'lucide-react';

interface QuestionBankViewProps {
  questions: Question[];
  onCreateQuestion: (q: Omit<Question, 'id' | 'usageCountInExams' | 'correctRatePercentage' | 'createdAt' | 'lastUpdated'>) => void;
  onUpdateQuestion: (q: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onVerifyQuestion: (id: string) => void;
  showEnglishLabels: boolean;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  questions,
  onCreateQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onVerifyQuestion,
  showEnglishLabels,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [previewingQuestion, setPreviewingQuestion] = useState<Question | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; code: string }>({
    isOpen: false,
    id: '',
    code: '',
  });

  // Form State
  const [formState, setFormState] = useState<{
    code: string;
    statement: string;
    type: QuestionType;
    options: { id: string; text: string; isCorrect: boolean }[];
    correctAnswerText: string;
    explanationKhmer: string;
    pedagogicalReference: string;
    subject: SubjectCategory;
    topic: string;
    targetLevel: ExamTargetLevel;
    difficulty: DifficultyLevel;
    verificationStatus: VerificationStatus;
    createdBy: string;
  }>({
    code: 'Q-PED-2026-089',
    statement: '',
    type: 'MCQ',
    options: [
      { id: 'opt-1', text: '', isCorrect: true },
      { id: 'opt-2', text: '', isCorrect: false },
      { id: 'opt-3', text: '', isCorrect: false },
      { id: 'opt-4', text: '', isCorrect: false },
    ],
    correctAnswerText: '',
    explanationKhmer: '',
    pedagogicalReference: '',
    subject: 'PEDAGOGY',
    topic: 'វិធីសាស្ត្របង្រៀន និងទ្រឹស្ដីគរុកោសល្យ',
    targetLevel: 'NIE_HIGH_SCHOOL',
    difficulty: 'MEDIUM',
    verificationStatus: 'VERIFIED',
    createdBy: 'រដ្ឋបាល PassKru',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Open Create
  const handleOpenCreate = () => {
    setEditingQuestion(null);
    setFormState({
      code: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
      statement: '',
      type: 'MCQ',
      options: [
        { id: 'opt-1', text: '', isCorrect: true },
        { id: 'opt-2', text: '', isCorrect: false },
        { id: 'opt-3', text: '', isCorrect: false },
        { id: 'opt-4', text: '', isCorrect: false },
      ],
      correctAnswerText: '',
      explanationKhmer: '',
      pedagogicalReference: '',
      subject: 'PEDAGOGY',
      topic: 'វិធីសាស្ត្របង្រៀន',
      targetLevel: 'NIE_HIGH_SCHOOL',
      difficulty: 'MEDIUM',
      verificationStatus: 'VERIFIED',
      createdBy: 'រដ្ឋបាល PassKru',
    });
    setIsModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    setFormState({
      code: q.code,
      statement: q.statement,
      type: q.type,
      options: q.options.length > 0 ? [...q.options] : [
        { id: 'opt-1', text: '', isCorrect: true },
        { id: 'opt-2', text: '', isCorrect: false },
      ],
      correctAnswerText: q.correctAnswerText || '',
      explanationKhmer: q.explanationKhmer,
      pedagogicalReference: q.pedagogicalReference || '',
      subject: q.subject,
      topic: q.topic,
      targetLevel: q.targetLevel,
      difficulty: q.difficulty,
      verificationStatus: q.verificationStatus,
      createdBy: q.createdBy,
    });
    setIsModalOpen(true);
  };

  // AI Helper generator for explanations & options
  const handleAiAutoGenerate = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      if (formState.statement.includes('Bloom') || formState.statement.includes('ប្ល៊ូម') || formState.subject === 'PEDAGOGY') {
        setFormState((prev) => ({
          ...prev,
          explanationKhmer: 'ការពន្យល់ស្វ័យប្រវត្តិដោយ AI៖ ផ្អែកលើស្តង់ដារគរុកោសល្យ វិធីសាស្ត្របង្រៀនផ្តោតលើសិស្សជាមជ្ឈមណ្ឌលជំរុញឱ្យសិស្សមានការគិតត្រិះរិះពិចារណា (Critical Thinking) និងសហការជាក្រុម។',
          pedagogicalReference: 'សៀវភៅគរុកោសល្យទូទៅ វិទ្យាស្ថានជាតិអប់រំ NIE ទំព័រ ៧៨',
        }));
      } else {
        setFormState((prev) => ({
          ...prev,
          explanationKhmer: 'ការពន្យល់ស្វ័យប្រវត្តិដោយ AI៖ ចម្លើយត្រឹមត្រូវត្រូវបានផ្ទៀងផ្ទាត់ដោយយោងតាមសៀវភៅគោលរបស់ក្រសួងអប់រំ យុវជន និងកីឡា។',
          pedagogicalReference: 'ឯកសារជំនួយស្មារតីត្រៀមប្រឡងគ្រូ MoEYS',
        }));
      }
      setIsAiGenerating(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.statement.trim()) return;

    if (editingQuestion) {
      onUpdateQuestion({
        ...editingQuestion,
        ...formState,
        lastUpdated: new Date().toISOString().split('T')[0],
      });
    } else {
      onCreateQuestion(formState);
    }
    setIsModalOpen(false);
  };

  const filteredQuestions = questions.filter((q) => {
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      if (!q.statement.toLowerCase().includes(search) && !q.code.toLowerCase().includes(search)) return false;
    }
    if (selectedSubject !== 'ALL' && q.subject !== selectedSubject) return false;
    if (selectedDifficulty !== 'ALL' && q.difficulty !== selectedDifficulty) return false;
    if (selectedStatus !== 'ALL' && q.verificationStatus !== selectedStatus) return false;
    return true;
  });

  const paginatedQuestions = filteredQuestions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <span>ធនាគារសំណួរ និងចម្លើយពន្យល់ (Question Bank)</span>
          </h2>
          <p className="text-xs text-[#8E929E] mt-1">
            គ្រប់គ្រងសំណួរពហុជ្រើសរើស គន្លឹះដោះស្រាយ និងឯកសារយោងគរុកោសល្យ
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>បង្កើតសំណួរថ្មី</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#111317] p-4 rounded-2xl border border-white/5 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5E6B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ស្វែងរកខ្លឹមសារសំណួរ ឬកូដ..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl text-white placeholder-[#5A5E6B] focus:border-indigo-500/50 outline-none"
          />
        </div>

        <div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none text-[#E0E0E0]"
          >
            <option value="ALL">គ្រប់មុខវិជ្ជា (ទាំងអស់)</option>
            <option value="PEDAGOGY">គរុកោសល្យ និងវិធីសាស្ត្រ</option>
            <option value="EDUCATION_LAW">ច្បាប់ស្ដីពីការអប់រំ</option>
            <option value="GENERAL_CULTURE">វប្បធម៌ទូទៅ</option>
            <option value="KHMER_LIT">អក្សរសាស្ត្រខ្មែរ</option>
            <option value="MATH">គណិតវិទ្យា</option>
          </select>
        </div>

        <div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none text-[#E0E0E0]"
          >
            <option value="ALL">គ្រប់កម្រិតលំបាក (ទាំងអស់)</option>
            <option value="EASY">ងាយស្រួល (Easy)</option>
            <option value="MEDIUM">មធ្យម (Medium)</option>
            <option value="HARD">លំបាក (Hard)</option>
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none text-[#E0E0E0]"
          >
            <option value="ALL">គ្រប់ស្ថានភាពផ្ទៀងផ្ទាត់</option>
            <option value="VERIFIED">ផ្ទៀងផ្ទាត់រួច (Verified)</option>
            <option value="PENDING">រង់ចាំផ្ទៀងផ្ទាត់ (Pending)</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="រកមិនឃើញសំណួរទេ"
          description="មិនមានសំណួរណាដែលត្រូវនឹងការស្វែងរករបស់អ្នកឡើយ។"
          actionText="បង្កើតសំណួរថ្មី"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="bg-[#111317] rounded-2xl border border-white/5 shadow-xs overflow-hidden">
          <div className="divide-y divide-white/5">
            {paginatedQuestions.map((q) => (
              <div key={q.id} className="p-5 hover:bg-white/[0.02] transition-colors space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                        {q.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${SUBJECT_LABELS[q.subject]?.color || 'bg-white/5 border-white/10 text-white'}`}>
                        {SUBJECT_LABELS[q.subject]?.km || q.subject}
                      </span>
                      <span className="text-[10px] font-semibold text-[#8E929E] bg-[#0D0F12] border border-white/5 px-2 py-0.5 rounded-md">
                        កម្រិត៖ {q.difficulty === 'EASY' ? 'ងាយ' : q.difficulty === 'MEDIUM' ? 'មធ្យម' : 'លំបាក'}
                      </span>
                      <StatusBadge status={q.verificationStatus} size="sm" />
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug pt-1">{q.statement}</h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setPreviewingQuestion(q)}
                      className="p-1.5 text-[#8E929E] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      title="មើលគំរូ"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(q)}
                      className="p-1.5 text-[#8E929E] hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      title="កែសម្រួល"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, id: q.id, code: q.code })}
                      className="p-1.5 text-[#8E929E] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="លុប"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Options Preview for MCQs */}
                {q.type === 'MCQ' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    {q.options.map((opt, i) => (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                          opt.isCorrect
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold'
                            : 'bg-[#0D0F12] border-white/5 text-[#8E929E]'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                          opt.isCorrect ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-[#1A1D24] text-[#8E929E]'
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="truncate">{opt.text}</span>
                        {opt.isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />}
                      </div>
                    ))}
                  </div>
                )}

                {/* Explanation Card */}
                {q.explanationKhmer && (
                  <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-xs text-[#E0E0E0] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>ការពន្យល់ និងគន្លឹះគរុកោសល្យ៖</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#C5C8D1]">{q.explanationKhmer}</p>
                    {q.pedagogicalReference && (
                      <span className="inline-block text-[10px] text-amber-400/80 italic pt-0.5">
                        📖 ឯកសារយោង៖ {q.pedagogicalReference}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-[#5A5E6B] pt-1">
                  <span>អ្នកបង្កើត៖ <strong className="text-[#8E929E]">{q.createdBy}</strong></span>
                  <div className="flex items-center gap-3">
                    <span>ប្រើក្នុងវិញ្ញាសា៖ <strong className="text-[#C5C8D1]">{q.usageCountInExams}</strong> ដង</span>
                    {q.correctRatePercentage > 0 && (
                      <span className="text-emerald-400 font-semibold">អត្រាឆ្លើយត្រូវ៖ {q.correctRatePercentage}%</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredQuestions.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Create / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#111317] rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 text-[#E0E0E0]">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingQuestion ? 'កែសម្រួលសំណួរ' : 'បង្កើតសំណួរថ្មីក្នុងធនាគារ'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8E929E] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">កូដសំណួរ</label>
                  <input
                    type="text"
                    value={formState.code}
                    onChange={(e) => setFormState({ ...formState, code: e.target.value })}
                    className="w-full p-2 bg-[#0D0F12] border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">មុខវិជ្ជា *</label>
                  <select
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value as SubjectCategory })}
                    className="w-full p-2 bg-[#0D0F12] border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50"
                  >
                    <option value="PEDAGOGY">គរុកោសល្យ</option>
                    <option value="EDUCATION_LAW">ច្បាប់អប់រំ</option>
                    <option value="GENERAL_CULTURE">វប្បធម៌ទូទៅ</option>
                    <option value="KHMER_LIT">អក្សរសាស្ត្រខ្មែរ</option>
                    <option value="MATH">គណិតវិទ្យា</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">កម្រិតលំបាក</label>
                  <select
                    value={formState.difficulty}
                    onChange={(e) => setFormState({ ...formState, difficulty: e.target.value as DifficultyLevel })}
                    className="w-full p-2 bg-[#0D0F12] border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50"
                  >
                    <option value="EASY">ងាយស្រួល</option>
                    <option value="MEDIUM">មធ្យម</option>
                    <option value="HARD">លំបាក</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">ប្រភេទសំណួរ</label>
                  <select
                    value={formState.type}
                    onChange={(e) => setFormState({ ...formState, type: e.target.value as QuestionType })}
                    className="w-full p-2 bg-[#0D0F12] border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50"
                  >
                    <option value="MCQ">ពហុជ្រើសរើស (MCQ)</option>
                    <option value="SHORT_ANSWER">សំណួរខ្លី</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#8E929E] mb-1">ខ្លឹមសារសំណួរ (Statement) *</label>
                <textarea
                  required
                  rows={3}
                  value={formState.statement}
                  onChange={(e) => setFormState({ ...formState, statement: e.target.value })}
                  placeholder="ឧ. តើទ្រឹស្ដីតាក់សូណូមីប្ល៊ូម (Bloom's Taxonomy) កំណែទម្រង់ថ្មី..."
                  className="w-full p-2.5 bg-[#0D0F12] border border-white/10 text-white rounded-xl outline-none focus:border-indigo-500/50 font-bold"
                />
              </div>

              {/* Options for MCQ */}
              {formState.type === 'MCQ' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-[#8E929E]">ជម្រើសចម្លើយ (ជ្រើសរើសចម្លើយដែលត្រឹមត្រូវ)</label>
                    <span className="text-[10px] text-[#5A5E6B]">ចុចលើប៊ូតុងរង្វង់ដើម្បីកំណត់ជាចម្លើយត្រូវ</span>
                  </div>
                  {formState.options.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formState.options.map((o, i) => ({
                            ...o,
                            isCorrect: i === idx,
                          }));
                          setFormState({ ...formState, options: updated });
                        }}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                          opt.isCorrect ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400' : 'bg-[#1A1D24] text-[#8E929E] hover:bg-[#222731]'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </button>
                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...formState.options];
                          updated[idx].text = e.target.value;
                          setFormState({ ...formState, options: updated });
                        }}
                        placeholder={`ជម្រើស ${String.fromCharCode(65 + idx)}...`}
                        className={`flex-1 p-2 bg-[#0D0F12] border rounded-xl outline-none text-xs text-white ${
                          opt.isCorrect ? 'border-emerald-500/50 bg-emerald-950/20 font-semibold' : 'border-white/10 focus:border-indigo-500/50'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* AI Auto-generate / Polish Trigger */}
              <div className="p-3 bg-[#0D0F12] rounded-2xl border border-amber-500/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">ជំនួយការ PassKru AI សម្រាប់គរុកោសល្យ</span>
                </div>
                <button
                  type="button"
                  onClick={handleAiAutoGenerate}
                  disabled={isAiGenerating}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-98 shadow-xs cursor-pointer"
                >
                  {isAiGenerating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
                      <span>កំពុងបង្កើត...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>បង្កើតការពន្យល់ & ឯកសារយោង</span>
                    </>
                  )}
                </button>
              </div>

              {/* Explanation & Reference */}
              <div>
                <label className="block font-semibold text-[#8E929E] mb-1">ការពន្យល់លម្អិតជាភាសាខ្មែរ (Explanation) *</label>
                <textarea
                  required
                  rows={3}
                  value={formState.explanationKhmer}
                  onChange={(e) => setFormState({ ...formState, explanationKhmer: e.target.value })}
                  placeholder="សរសេរការពន្យល់លម្អិតពីមូលហេតុដែលចម្លើយនេះត្រឹមត្រូវ..."
                  className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none focus:border-indigo-500/50 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#8E929E] mb-1">ឯកសារយោងគរុកោសល្យ (Reference)</label>
                <input
                  type="text"
                  value={formState.pedagogicalReference}
                  onChange={(e) => setFormState({ ...formState, pedagogicalReference: e.target.value })}
                  placeholder="ឧ. សៀវភៅគរុកោសល្យទូទៅ NIE ទំព័រ ៥២..."
                  className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none focus:border-indigo-500/50 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#8E929E] bg-[#1A1D24] hover:bg-[#222731] hover:text-white font-semibold rounded-xl cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingQuestion ? 'រក្សាទុកការកែប្រែ' : 'បន្ថែមសំណួរទៅធនាគារ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#111317] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/10 animate-in zoom-in-95 text-[#E0E0E0]">
            <div className="flex items-start justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md">
                {previewingQuestion.code}
              </span>
              <button onClick={() => setPreviewingQuestion(null)} className="text-[#8E929E] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white">{previewingQuestion.statement}</h3>

              <div className="space-y-2">
                {previewingQuestion.options.map((opt, i) => (
                  <div
                    key={opt.id}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      opt.isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold'
                        : 'bg-[#0D0F12] border-white/5 text-[#8E929E]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        opt.isCorrect ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-[#1A1D24] text-[#8E929E]'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                    {opt.isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[#E0E0E0]">
                <span className="font-bold text-amber-400 block mb-1">ការពន្យល់៖</span>
                <p className="text-[11px] leading-relaxed text-[#C5C8D1]">{previewingQuestion.explanationKhmer}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-white/5">
              <button
                onClick={() => setPreviewingQuestion(null)}
                className="px-4 py-2 bg-[#1A1D24] hover:bg-[#222731] text-[#8E929E] hover:text-white font-semibold rounded-xl text-xs cursor-pointer"
              >
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '', code: '' })}
        onConfirm={() => {
          onDeleteQuestion(deleteModal.id);
          setDeleteModal({ isOpen: false, id: '', code: '' });
        }}
        title="លុបសំណួរ"
        description={`តើអ្នកប្រាកដជាចង់លុបសំណួរកូដ "${deleteModal.code}" ចេញពីធនាគារសំណួរមែនទេ?`}
        confirmText="លុបសំណួរ"
        isDestructive={true}
      />
    </div>
  );
};
