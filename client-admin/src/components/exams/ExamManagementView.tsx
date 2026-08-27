import React, { useState } from 'react';
import { ExamInfo, ExamTargetLevel, SubjectCategory, VerificationStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmModal } from '../common/ConfirmModal';
import { EmptyState } from '../common/EmptyState';
import { SUBJECT_LABELS, EXAM_LEVEL_LABELS } from '../../data/mockData';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  FileText, 
  ExternalLink, 
  X,
  BookOpen,
  Award,
  Archive
} from 'lucide-react';

interface ExamManagementViewProps {
  exams: ExamInfo[];
  onCreateExam: (exam: Omit<ExamInfo, 'id' | 'lastUpdated'>) => void;
  onUpdateExam: (exam: ExamInfo) => void;
  onDeleteExam: (id: string) => void;
  onToggleOutdated: (id: string) => void;
  showEnglishLabels: boolean;
}

export const ExamManagementView: React.FC<ExamManagementViewProps> = ({
  exams,
  onCreateExam,
  onUpdateExam,
  onDeleteExam,
  onToggleOutdated,
  showEnglishLabels,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamInfo | null>(null);
  const [viewingExam, setViewingExam] = useState<ExamInfo | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: '',
  });

  // Form State
  const [formState, setFormState] = useState<{
    moeysCode: string;
    titleKhmer: string;
    titleLatin: string;
    level: ExamTargetLevel;
    academicYear: string;
    quotaSeats: number;
    applicationStartDate: string;
    applicationEndDate: string;
    examDate: string;
    resultsDate: string;
    location: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    verificationStatus: VerificationStatus;
    eligibilityRequirements: string[];
    requiredDocuments: string[];
    officialCircularUrl: string;
  }>({
    moeysCode: 'MoEYS-2026-NIE-',
    titleKhmer: '',
    titleLatin: '',
    level: 'NIE_HIGH_SCHOOL',
    academicYear: '២០២៥ - ២០២៦',
    quotaSeats: 400,
    applicationStartDate: '2026-03-01',
    applicationEndDate: '2026-04-15',
    examDate: '2026-05-24',
    resultsDate: '2026-06-20',
    location: 'វិទ្យាស្ថានជាតិអប់រំ (NIE) និងវិទ្យាល័យព្រះស៊ីសុវត្ថិ',
    status: 'PUBLISHED',
    verificationStatus: 'VERIFIED',
    eligibilityRequirements: ['មានសញ្ជាតិខ្មែរ', 'សញ្ញាបត្របរិញ្ញាបត្រឡើងទៅ', 'អាយុក្រោម ៣៥ ឆ្នាំ'],
    requiredDocuments: ['ពាក្យសុំប្រឡង', 'សញ្ញាបត្រច្បាប់ដើម', 'សំបុត្រកំណើត', 'លិខិតថ្កោលទោស'],
    officialCircularUrl: '',
  });

  const [reqInput, setReqInput] = useState('');
  const [docInput, setDocInput] = useState('');

  // Handle open create
  const handleOpenCreate = () => {
    setEditingExam(null);
    setFormState({
      moeysCode: 'MoEYS-2026-NIE-01',
      titleKhmer: '',
      titleLatin: '',
      level: 'NIE_HIGH_SCHOOL',
      academicYear: '២០២៥ - ២០២៦',
      quotaSeats: 450,
      applicationStartDate: '2026-03-01',
      applicationEndDate: '2026-04-15',
      examDate: '2026-05-24',
      resultsDate: '2026-06-20',
      location: 'វិទ្យាស្ថានជាតិអប់រំ NIE',
      status: 'PUBLISHED',
      verificationStatus: 'VERIFIED',
      eligibilityRequirements: ['មានសញ្ជាតិខ្មែរ', 'សញ្ញាបត្របរិញ្ញាបត្រ ឬសមមូល', 'អាយុមិនលើសពី ៣៥ ឆ្នាំ'],
      requiredDocuments: ['ពាក្យសុំប្រឡង', 'សញ្ញាបត្រច្បាប់ដើម', 'សំបុត្រកំណើត', 'ព្រឹត្តិបត្រថ្កោលទោស'],
      officialCircularUrl: 'https://moeys.gov.kh',
    });
    setIsModalOpen(true);
  };

  // Handle open edit
  const handleOpenEdit = (exam: ExamInfo) => {
    setEditingExam(exam);
    setFormState({
      moeysCode: exam.moeysCode,
      titleKhmer: exam.titleKhmer,
      titleLatin: exam.titleLatin,
      level: exam.level,
      academicYear: exam.academicYear,
      quotaSeats: exam.quotaSeats,
      applicationStartDate: exam.applicationStartDate,
      applicationEndDate: exam.applicationEndDate,
      examDate: exam.examDate,
      resultsDate: exam.resultsDate || '',
      location: exam.location,
      status: exam.status,
      verificationStatus: exam.verificationStatus,
      eligibilityRequirements: [...exam.eligibilityRequirements],
      requiredDocuments: [...exam.requiredDocuments],
      officialCircularUrl: exam.officialCircularUrl || '',
    });
    setIsModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.titleKhmer.trim()) return;

    if (editingExam) {
      onUpdateExam({
        ...editingExam,
        ...formState,
        isOutdated: formState.verificationStatus === 'OUTDATED' || formState.status === 'ARCHIVED',
        lastUpdated: new Date().toISOString().split('T')[0],
      });
    } else {
      onCreateExam({
        ...formState,
        isOutdated: false,
        subjects: [
          { subject: 'GENERAL_CULTURE', durationMinutes: 120, coefficient: 2, maxScore: 100 },
          { subject: 'PEDAGOGY', durationMinutes: 90, coefficient: 2, maxScore: 100 },
          { subject: 'KHMER_LIT', durationMinutes: 120, coefficient: 3, maxScore: 100 },
        ],
      });
    }
    setIsModalOpen(false);
  };

  const filteredExams = exams.filter((exam) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = exam.titleKhmer.toLowerCase().includes(q) || exam.titleLatin.toLowerCase().includes(q);
      const matchCode = exam.moeysCode.toLowerCase().includes(q);
      if (!matchTitle && !matchCode) return false;
    }
    if (selectedLevel !== 'ALL' && exam.level !== selectedLevel) return false;
    if (selectedStatus !== 'ALL') {
      if (selectedStatus === 'VERIFIED' && exam.verificationStatus !== 'VERIFIED') return false;
      if (selectedStatus === 'OUTDATED' && !exam.isOutdated) return false;
      if (selectedStatus === 'PENDING' && exam.verificationStatus !== 'PENDING') return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span>ការគ្រប់គ្រងការប្រឡងគ្រូថ្នាក់ជាតិ (National Teacher Exams)</span>
          </h2>
          <p className="text-xs text-[#8E929E] mt-1">
            ចាត់ចែងកាលបរិច្ឆេទប្រឡង កូតាក្របខណ្ឌរដ្ឋ លក្ខខណ្ឌឯកសារ និងវិញ្ញាសាប្រឡង
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>បង្កើតព័ត៌មានប្រឡងថ្មី</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#111317] p-4 rounded-2xl border border-white/5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5E6B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ស្វែងរកតាមឈ្មោះប្រឡង ឬលេខកូដ MoEYS..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl text-white placeholder-[#5A5E6B] focus:border-indigo-500/50 outline-none"
          />
        </div>

        <div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none text-[#E0E0E0]"
          >
            <option value="ALL">គ្រប់កម្រិតបង្រៀន (ទាំងអស់)</option>
            <option value="NIE_HIGH_SCHOOL">គ្រូមធ្យមសិក្សាទុតិយភូមិ (NIE)</option>
            <option value="BASIC_SECONDARY">គ្រូមធ្យមសិក្សាបឋមភូមិ (អនុវិទ្យាល័យ)</option>
            <option value="PRIMARY_SCHOOL">គ្រូបឋមសិក្សា</option>
            <option value="KINDERGARTEN">គ្រូមត្តេយ្យសិក្សា</option>
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
            <option value="OUTDATED">ហួសសម័យ / ចាស់ (Outdated)</option>
          </select>
        </div>
      </div>

      {/* Exams Grid Cards */}
      {filteredExams.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="រកមិនឃើញព័ត៌មានការប្រឡងទេ"
          description="មិនមានការប្រឡងដែលត្រូវនឹងលក្ខខណ្ឌចម្រោះខាងលើឡើយ។"
          actionText="បង្កើតការប្រឡងថ្មី"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className={`rounded-2xl border transition-all p-5 shadow-xs flex flex-col justify-between ${
                exam.isOutdated
                  ? 'border-rose-500/30 bg-rose-950/10'
                  : 'bg-[#111317] border-white/5 hover:border-indigo-500/30'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                        {exam.moeysCode}
                      </span>
                      <StatusBadge status={exam.verificationStatus} size="sm" />
                      {exam.isOutdated && (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                          ទិន្នន័យចាស់
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug">{exam.titleKhmer}</h3>
                    <p className="text-xs text-[#8E929E] mt-0.5">{exam.titleLatin}</p>
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4 bg-[#0D0F12] p-3.5 rounded-xl border border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] text-[#5A5E6B] block font-medium">កូតាក្របខណ្ឌ</span>
                    <span className="font-bold text-emerald-400 text-sm">{exam.quotaSeats} នាក់</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5A5E6B] block font-medium">កាលបរិច្ឆេទប្រឡង</span>
                    <span className="font-bold text-white">{exam.examDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5A5E6B] block font-medium">ផុតកំណត់ទទួលពាក្យ</span>
                    <span className="font-bold text-amber-400">{exam.applicationEndDate}</span>
                  </div>
                </div>

                {/* Location & Subjects Summary */}
                <div className="space-y-2 text-xs text-[#8E929E] mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#5A5E6B] shrink-0" />
                    <span className="truncate text-[#C5C8D1]">{exam.location}</span>
                  </div>

                  {exam.subjects && exam.subjects.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] text-[#5A5E6B] font-medium">មុខវិជ្ជាប្រឡង៖</span>
                      {exam.subjects.map((s, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-white/5 border border-white/10 text-[#C5C8D1] px-2 py-0.5 rounded-md font-medium"
                        >
                          {SUBJECT_LABELS[s.subject]?.km || s.subject} (មេគុណ {s.coefficient})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewingExam(exam)}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>មើលលម្អិត</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onToggleOutdated(exam.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1 cursor-pointer ${
                      exam.isOutdated
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                    }`}
                    title={exam.isOutdated ? 'កំណត់ជាព័ត៌មានបច្ចុប្បន្ន' : 'កំណត់ជាព័ត៌មានហួសសម័យ'}
                  >
                    <Archive className="w-3 h-3" />
                    <span>{exam.isOutdated ? 'ស្តារឡើងវិញ' : 'សម្គាល់ថាចាស់'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(exam)}
                    className="p-1.5 text-[#8E929E] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    title="កែសម្រួល"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      setDeleteModal({
                        isOpen: true,
                        id: exam.id,
                        title: exam.titleKhmer,
                      })
                    }
                    className="p-1.5 text-[#8E929E] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="លុបព័ត៌មាន"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Exam Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#111317] rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 text-[#E0E0E0]">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingExam ? 'កែសម្រួលព័ត៌មានប្រឡង' : 'បង្កើតព័ត៌មានការប្រឡងជ្រើសរើសគ្រូថ្មី'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8E929E] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">លេខកូដប្រកាស MoEYS *</label>
                  <input
                    type="text"
                    required
                    value={formState.moeysCode}
                    onChange={(e) => setFormState({ ...formState, moeysCode: e.target.value })}
                    className="w-full p-2.5 bg-[#0D0F12] border border-white/10 text-white rounded-xl outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">កម្រិតគ្រូបង្រៀន *</label>
                  <select
                    value={formState.level}
                    onChange={(e) => setFormState({ ...formState, level: e.target.value as ExamTargetLevel })}
                    className="w-full p-2.5 bg-[#0D0F12] border border-white/10 text-white rounded-xl outline-none focus:border-indigo-500/50"
                  >
                    <option value="NIE_HIGH_SCHOOL">គ្រូមធ្យមសិក្សាទុតិយភូមិ (NIE)</option>
                    <option value="BASIC_SECONDARY">គ្រូមធ្យមសិក្សាបឋមភូមិ (RTC)</option>
                    <option value="PRIMARY_SCHOOL">គ្រូបឋមសិក្សា (PTTC)</option>
                    <option value="KINDERGARTEN">គ្រូមត្តេយ្យសិក្សា</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#8E929E] mb-1">ចំណងជើងជាភាសាខ្មែរ *</label>
                <input
                  type="text"
                  required
                  value={formState.titleKhmer}
                  onChange={(e) => setFormState({ ...formState, titleKhmer: e.target.value })}
                  placeholder="ឧ. ការប្រឡងជ្រើសរើសគ្រូបង្រៀនកម្រិតឧត្តម NIE ជំនាន់ទី ៣២..."
                  className="w-full p-2.5 bg-[#0D0F12] border border-white/10 text-white placeholder-[#5A5E6B] rounded-xl outline-none focus:border-indigo-500/50 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">ឆ្នាំសិក្សា</label>
                  <input
                    type="text"
                    value={formState.academicYear}
                    onChange={(e) => setFormState({ ...formState, academicYear: e.target.value })}
                    className="w-full p-2 bg-[#0D0F12] border border-white/10 text-white rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">កូតាក្របខណ្ឌ</label>
                  <input
                    type="number"
                    value={formState.quotaSeats}
                    onChange={(e) => setFormState({ ...formState, quotaSeats: Number(e.target.value) })}
                    className="w-full p-2 bg-[#0D0F12] border border-white/10 rounded-xl outline-none font-bold text-emerald-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">ថ្ងៃប្រឡង</label>
                  <input
                    type="date"
                    value={formState.examDate}
                    onChange={(e) => setFormState({ ...formState, examDate: e.target.value })}
                    className="w-full p-2 bg-[#0D0F12] border border-white/10 text-white rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">ថ្ងៃផុតកំណត់ពាក្យ</label>
                  <input
                    type="date"
                    value={formState.applicationEndDate}
                    onChange={(e) => setFormState({ ...formState, applicationEndDate: e.target.value })}
                    className="w-full p-2 bg-[#0D0F12] border border-white/10 text-white rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#8E929E] mb-1">មណ្ឌលប្រឡង / ទីតាំង</label>
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  placeholder="ឧ. វិទ្យាស្ថានជាតិអប់រំ និងវិទ្យាល័យព្រះស៊ីសុវត្ថិ..."
                  className="w-full p-2.5 bg-[#0D0F12] border border-white/10 text-white rounded-xl outline-none"
                />
              </div>

              {/* Eligibility Requirements Builder */}
              <div>
                <label className="block font-semibold text-[#8E929E] mb-1">លក្ខខណ្ឌជ្រើសរើស (Eligibility Requirements)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={reqInput}
                    onChange={(e) => setReqInput(e.target.value)}
                    placeholder="បន្ថែមលក្ខខណ្ឌថ្មី ឧ. អាយុមិនលើសពី ៣៥ ឆ្នាំ..."
                    className="flex-1 p-2 bg-[#0D0F12] border border-white/10 text-white rounded-xl outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (reqInput.trim()) {
                          setFormState({
                            ...formState,
                            eligibilityRequirements: [...formState.eligibilityRequirements, reqInput.trim()],
                          });
                          setReqInput('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (reqInput.trim()) {
                        setFormState({
                          ...formState,
                          eligibilityRequirements: [...formState.eligibilityRequirements, reqInput.trim()],
                        });
                        setReqInput('');
                      }
                    }}
                    className="px-3 py-2 bg-[#1A1D24] hover:bg-[#222731] text-white border border-white/10 font-bold rounded-xl cursor-pointer"
                  >
                    បន្ថែម
                  </button>
                </div>
                <div className="space-y-1">
                  {formState.eligibilityRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-[#0D0F12] p-2 rounded-lg border border-white/5">
                      <span>• {req}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formState.eligibilityRequirements.filter((_, i) => i !== idx);
                          setFormState({ ...formState, eligibilityRequirements: updated });
                        }}
                        className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                      >
                        លុប
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#8E929E] hover:text-white bg-[#1A1D24] hover:bg-[#222731] font-semibold rounded-xl cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingExam ? 'រក្សាទុកការកែប្រែ' : 'បង្កើតព័ត៌មានប្រឡង'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {viewingExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#111317] rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-white/10 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto text-[#E0E0E0]">
            <div className="flex items-start justify-between pb-3 border-b border-white/5">
              <div>
                <StatusBadge status={viewingExam.verificationStatus} size="sm" />
                <h3 className="text-base font-bold text-white mt-2">{viewingExam.titleKhmer}</h3>
                <p className="text-xs text-[#8E929E]">{viewingExam.moeysCode}</p>
              </div>
              <button onClick={() => setViewingExam(null)} className="text-[#8E929E] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#0D0F12] p-3.5 rounded-xl border border-white/5">
                <div>
                  <span className="text-[#5A5E6B] block text-[10px]">កាលបរិច្ឆេទប្រឡង</span>
                  <span className="font-bold text-white">{viewingExam.examDate}</span>
                </div>
                <div>
                  <span className="text-[#5A5E6B] block text-[10px]">កូតាក្របខណ្ឌ</span>
                  <span className="font-bold text-emerald-400">{viewingExam.quotaSeats} នាក់</span>
                </div>
                <div>
                  <span className="text-[#5A5E6B] block text-[10px]">ផុតកំណត់ទទួលពាក្យ</span>
                  <span className="font-bold text-amber-400">{viewingExam.applicationEndDate}</span>
                </div>
                <div>
                  <span className="text-[#5A5E6B] block text-[10px]">មណ្ឌលប្រឡង</span>
                  <span className="font-semibold text-[#E0E0E0]">{viewingExam.location}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1.5">លក្ខខណ្ឌជ្រើសរើស៖</h4>
                <ul className="space-y-1 bg-[#0D0F12] p-3 rounded-xl border border-white/5">
                  {viewingExam.eligibilityRequirements.map((req, i) => (
                    <li key={i} className="text-[#C5C8D1]">• {req}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1.5">ឯកសារតម្រូវ៖</h4>
                <ul className="space-y-1 bg-[#0D0F12] p-3 rounded-xl border border-white/5">
                  {viewingExam.requiredDocuments.map((doc, i) => (
                    <li key={i} className="text-[#C5C8D1]">✓ {doc}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-white/5">
              <button
                onClick={() => setViewingExam(null)}
                className="px-4 py-2 bg-[#1A1D24] hover:bg-[#222731] text-[#8E929E] hover:text-white font-semibold rounded-xl text-xs cursor-pointer"
              >
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
        onConfirm={() => {
          onDeleteExam(deleteModal.id);
          setDeleteModal({ isOpen: false, id: '', title: '' });
        }}
        title="លុបព័ត៌មានការប្រឡង"
        description={`តើអ្នកប្រាកដជាចង់លុបព័ត៌មាន "${deleteModal.title}" ចេញពីប្រព័ន្ធមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`}
        confirmText="លុបចោល"
        isDestructive={true}
      />
    </div>
  );
};
