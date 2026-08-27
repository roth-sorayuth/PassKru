import React, { useState } from 'react';
import { MockExam, ExamTargetLevel, SubjectCategory } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmModal } from '../common/ConfirmModal';
import { EmptyState } from '../common/EmptyState';
import { EXAM_LEVEL_LABELS, SUBJECT_LABELS } from '../../data/mockData';
import { 
  Trophy, 
  Plus, 
  Search, 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  Layers, 
  Sparkles, 
  BarChart, 
  X,
  ShieldCheck
} from 'lucide-react';

interface MockExamManagementViewProps {
  mockExams: MockExam[];
  onCreateMockExam: (mock: Omit<MockExam, 'id' | 'takersCount' | 'passRatePercentage' | 'averageScore'>) => void;
  onUpdateMockExam: (mock: MockExam) => void;
  onDeleteMockExam: (id: string) => void;
  showEnglishLabels: boolean;
}

export const MockExamManagementView: React.FC<MockExamManagementViewProps> = ({
  mockExams,
  onCreateMockExam,
  onUpdateMockExam,
  onDeleteMockExam,
  showEnglishLabels,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<MockExam | null>(null);
  const [viewingExam, setViewingExam] = useState<MockExam | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: '',
  });

  // Form State
  const [formState, setFormState] = useState<{
    code: string;
    title: string;
    targetLevel: ExamTargetLevel;
    academicYear: string;
    totalQuestions: number;
    durationMinutes: number;
    maxScore: number;
    passScore: number;
    status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED';
    verificationStatus: any;
    subjectsBreakdown: { subject: SubjectCategory; questionCount: number; pointsPerQuestion: number }[];
    questionIds: string[];
    instructions: string[];
    createdAt: string;
  }>({
    code: 'MOCK-2026-NEW',
    title: '',
    targetLevel: 'NIE_HIGH_SCHOOL',
    academicYear: '២០២៥ - ២០២៦',
    totalQuestions: 60,
    durationMinutes: 120,
    maxScore: 100,
    passScore: 65,
    status: 'PUBLISHED',
    verificationStatus: 'VERIFIED',
    subjectsBreakdown: [
      { subject: 'PEDAGOGY', questionCount: 25, pointsPerQuestion: 2.0 },
      { subject: 'GENERAL_CULTURE', questionCount: 20, pointsPerQuestion: 1.5 },
      { subject: 'EDUCATION_LAW', questionCount: 15, pointsPerQuestion: 1.33 },
    ],
    questionIds: ['Q-001', 'Q-002'],
    instructions: [
      'បេក្ខជនមានថិរវេលា ១២០ នាទីដើម្បីបំពេញវិញ្ញាសា។',
      'ពិន្ទុសរុបគឺ ១០០ ពិន្ទុ។ ពិន្ទុជាប់កំណត់ត្រឹម ៦៥ ពិន្ទុឡើងទៅ។'
    ],
    createdAt: '2026-03-01',
  });

  const handleOpenCreate = () => {
    setEditingExam(null);
    setFormState({
      code: `MOCK-NIE-${Date.now().toString().slice(-4)}`,
      title: '',
      targetLevel: 'NIE_HIGH_SCHOOL',
      academicYear: '២០២៥ - ២០២៦',
      totalQuestions: 60,
      durationMinutes: 120,
      maxScore: 100,
      passScore: 65,
      status: 'PUBLISHED',
      verificationStatus: 'VERIFIED',
      subjectsBreakdown: [
        { subject: 'PEDAGOGY', questionCount: 25, pointsPerQuestion: 2.0 },
        { subject: 'GENERAL_CULTURE', questionCount: 20, pointsPerQuestion: 1.5 },
        { subject: 'EDUCATION_LAW', questionCount: 15, pointsPerQuestion: 1.33 },
      ],
      questionIds: ['Q-001', 'Q-002'],
      instructions: [
        'បេក្ខជនមានថិរវេលា ១២០ នាទីដើម្បីបំពេញវិញ្ញាសា។',
        'ហាមបើកមើលឯកសារ ឬប្រើប្រាស់កម្មវិធីជំនួយអំឡុងពេលធ្វើវិញ្ញាសា។'
      ],
      createdAt: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exam: MockExam) => {
    setEditingExam(exam);
    setFormState({
      code: exam.code,
      title: exam.title,
      targetLevel: exam.targetLevel,
      academicYear: exam.academicYear,
      totalQuestions: exam.totalQuestions,
      durationMinutes: exam.durationMinutes,
      maxScore: exam.maxScore,
      passScore: exam.passScore,
      status: exam.status,
      verificationStatus: exam.verificationStatus,
      subjectsBreakdown: [...exam.subjectsBreakdown],
      questionIds: [...exam.questionIds],
      instructions: [...exam.instructions],
      createdAt: exam.createdAt,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) return;

    if (editingExam) {
      onUpdateMockExam({
        ...editingExam,
        ...formState,
      });
    } else {
      onCreateMockExam(formState);
    }
    setIsModalOpen(false);
  };

  // Filter
  const filteredExams = mockExams.filter((exam) => {
    const matchesSearch = 
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'ALL' || exam.targetLevel === selectedLevel;
    const matchesStatus = selectedStatus === 'ALL' || exam.status === selectedStatus;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-400" />
            <span>គ្រប់គ្រងវិញ្ញាសាប្រឡងសាកល្បងថ្នាក់ជាតិ (National Mock Exams)</span>
          </h2>
          <p className="text-xs text-[#8E929E] mt-1">
            រៀបចំវិញ្ញាសាក្លែងក្លាយតាមស្តង់ដារក្រសួងអប់រំ កំណត់ម៉ោងប្រឡង និងប្រព័ន្ធកាត់ពិន្ទុស្វ័យប្រវត្តិ
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>បង្កើតវិញ្ញាសាសាកល្បងថ្មី</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-[#111317] rounded-2xl border border-white/5 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A5E6B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ស្វែងរកតាមចំណងជើង ឬលេខកូដ..."
            className="w-full pl-9 pr-4 py-2 bg-[#0D0F12] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-[#5A5E6B] focus:border-indigo-500/50 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 bg-[#0D0F12] border border-white/10 rounded-xl text-xs font-semibold text-[#E0E0E0] focus:border-indigo-500/50 outline-none"
          >
            <option value="ALL">គ្រប់កម្រិតប្រឡង</option>
            <option value="NIE_HIGH_SCHOOL">គ្រូវិទ្យាល័យ (NIE)</option>
            <option value="BASIC_SECONDARY">គ្រូអនុវិទ្យាល័យ (RTC)</option>
            <option value="PRIMARY_SCHOOL">គ្រូបឋមសិក្សា (PTTC)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#0D0F12] border border-white/10 rounded-xl text-xs font-semibold text-[#E0E0E0] focus:border-indigo-500/50 outline-none"
          >
            <option value="ALL">គ្រប់ស្ថានភាព</option>
            <option value="PUBLISHED">បានផ្សាយ (Published)</option>
            <option value="DRAFT">សេចក្តីព្រាង (Draft)</option>
            <option value="SCHEDULED">កំណត់ពេល (Scheduled)</option>
          </select>
        </div>
      </div>

      {/* Grid of Mock Exams */}
      {filteredExams.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="មិនមានវិញ្ញាសាសាកល្បងទេ"
          description="មិនមានទិន្នន័យត្រូវនឹងការស្វែងរករបស់អ្នកឡើយ។"
          actionText="បង្កើតវិញ្ញាសាថ្មី"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-[#111317] rounded-2xl border border-white/5 shadow-xs hover:border-indigo-500/30 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                    {exam.code}
                  </span>
                  <StatusBadge status={exam.status} size="sm" />
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm leading-snug line-clamp-2">
                    {exam.title}
                  </h3>
                  <p className="text-[11px] text-[#8E929E] mt-1">
                    {EXAM_LEVEL_LABELS[exam.targetLevel]?.shortKm} • ឆ្នាំសិក្សា {exam.academicYear}
                  </p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#0D0F12] rounded-xl border border-white/5 text-center">
                  <div>
                    <span className="text-[10px] text-[#5A5E6B] font-medium block">សំណួរ</span>
                    <span className="text-xs font-bold text-white">{exam.totalQuestions}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5A5E6B] font-medium block">ថិរវេលា</span>
                    <span className="text-xs font-bold text-white">{exam.durationMinutes} នាទី</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5A5E6B] font-medium block">ពិន្ទុជាប់</span>
                    <span className="text-xs font-bold text-emerald-400">{exam.passScore}/{exam.maxScore}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-[#8E929E] pt-1">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#5A5E6B]" />
                    <span>{(exam.takersCount ?? 0).toLocaleString()} នាក់បានប្រឡង</span>
                  </span>
                  {exam.passRatePercentage > 0 && (
                    <span className="font-semibold text-emerald-400">
                      ជាប់៖ {exam.passRatePercentage}%
                    </span>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-5 py-3 bg-[#0D0F12]/60 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => setViewingExam(exam)}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>មើលលម្អិត</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(exam)}
                    className="p-1.5 text-[#8E929E] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, id: exam.id, title: exam.title })}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {viewingExam && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111317] rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-white/10 space-y-4 my-8 animate-in zoom-in-95 duration-150 text-[#E0E0E0]">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                  {viewingExam.code}
                </span>
                <StatusBadge status={viewingExam.status} size="sm" />
              </div>
              <button
                onClick={() => setViewingExam(null)}
                className="p-2 text-[#8E929E] hover:text-white rounded-full hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-base font-bold text-white">{viewingExam.title}</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0D0F12] p-3.5 rounded-2xl border border-white/5 text-xs">
              <div>
                <span className="text-[#5A5E6B] block text-[10px]">កម្រិតប្រឡង</span>
                <strong className="text-white">{EXAM_LEVEL_LABELS[viewingExam.targetLevel]?.shortKm}</strong>
              </div>
              <div>
                <span className="text-[#5A5E6B] block text-[10px]">ថិរវេលា</span>
                <strong className="text-white">{viewingExam.durationMinutes} នាទី</strong>
              </div>
              <div>
                <span className="text-[#5A5E6B] block text-[10px]">ចំនួនសំណួរ</span>
                <strong className="text-white">{viewingExam.totalQuestions} សំណួរ</strong>
              </div>
              <div>
                <span className="text-[#5A5E6B] block text-[10px]">ពិន្ទុជាប់</span>
                <strong className="text-emerald-400">{viewingExam.passScore} / {viewingExam.maxScore}</strong>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white mb-2">ការបែងចែកមុខវិជ្ជាក្នុងវិញ្ញាសា៖</h4>
              <div className="space-y-1.5">
                {viewingExam.subjectsBreakdown.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 bg-[#0D0F12] rounded-xl border border-white/5">
                    <span className="font-semibold text-white">{SUBJECT_LABELS[s.subject]?.km}</span>
                    <span className="text-[#8E929E] font-mono">{s.questionCount} សំណួរ ({s.pointsPerQuestion} ពិន្ទុ/សំណួរ)</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white mb-1">សេចក្តីណែនាំបេក្ខជន៖</h4>
              <ul className="list-disc list-inside text-xs text-[#8E929E] space-y-1 bg-[#0D0F12] p-3 rounded-xl border border-white/5">
                {viewingExam.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setViewingExam(null)}
                className="px-5 py-2 bg-[#1A1D24] hover:bg-[#222731] text-white font-bold rounded-xl text-xs cursor-pointer border border-white/10"
              >
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111317] rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-white/10 space-y-4 my-8 animate-in zoom-in-95 duration-150 text-[#E0E0E0]">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-400" />
                <span>{editingExam ? 'កែសម្រួលវិញ្ញាសាសាកល្បង' : 'បង្កើតវិញ្ញាសាសាកល្បងថ្មី'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#8E929E] hover:text-white rounded-full hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#8E929E] mb-1">ចំណងជើងវិញ្ញាសាសាកល្បង *</label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  placeholder="ឧ. វិញ្ញាសាសាកល្បងថ្នាក់ជាតិ ត្រៀមប្រឡងគ្រូ NIE លើកទី ៣..."
                  className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none font-bold text-white placeholder-[#5A5E6B] focus:border-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">កម្រិតប្រឡងគោលដៅ</label>
                  <select
                    value={formState.targetLevel}
                    onChange={(e) => setFormState({ ...formState, targetLevel: e.target.value as any })}
                    className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none text-white focus:border-indigo-500/50"
                  >
                    <option value="NIE_HIGH_SCHOOL">គ្រូវិទ្យាល័យ (NIE)</option>
                    <option value="BASIC_SECONDARY">គ្រូអនុវិទ្យាល័យ (RTC)</option>
                    <option value="PRIMARY_SCHOOL">គ្រូបឋមសិក្សា (PTTC)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">ឆ្នាំសិក្សា</label>
                  <input
                    type="text"
                    value={formState.academicYear}
                    onChange={(e) => setFormState({ ...formState, academicYear: e.target.value })}
                    className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none text-white focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">ចំនួនសំណួរ</label>
                  <input
                    type="number"
                    value={formState.totalQuestions}
                    onChange={(e) => setFormState({ ...formState, totalQuestions: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none text-white focus:border-indigo-500/50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">ថិរវេលា (នាទី)</label>
                  <input
                    type="number"
                    value={formState.durationMinutes}
                    onChange={(e) => setFormState({ ...formState, durationMinutes: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none text-white focus:border-indigo-500/50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">ពិន្ទុជាប់ / សរុប</label>
                  <input
                    type="number"
                    value={formState.passScore}
                    onChange={(e) => setFormState({ ...formState, passScore: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none text-emerald-400 font-bold focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#8E929E] hover:text-white bg-[#1A1D24] hover:bg-[#222731] rounded-xl font-bold cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingExam ? 'រក្សាទុកការកែប្រែ' : 'បង្កើតវិញ្ញាសា'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="លុបវិញ្ញាសាសាកល្បង?"
        description={`តើអ្នកពិតជាចង់លុបវិញ្ញាសា «${deleteModal.title}» មែនទេ?`}
        confirmText="លុបវិញ្ញាសា"
        cancelText="បោះបង់"
        isDestructive={true}
        onConfirm={() => {
          onDeleteMockExam(deleteModal.id);
          setDeleteModal({ isOpen: false, id: '', title: '' });
        }}
        onClose={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
      />
    </div>
  );
};
