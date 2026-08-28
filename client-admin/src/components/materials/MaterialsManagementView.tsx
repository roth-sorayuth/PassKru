import React, { useState, useRef } from 'react';
import { PastPaper, LearningMaterial, SubjectCategory, ExamTargetLevel, VerificationStatus } from '../../types';
import { supabase } from '../../utils/supabase';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmModal } from '../common/ConfirmModal';
import { EmptyState } from '../common/EmptyState';
import { SUBJECT_LABELS, EXAM_LEVEL_LABELS } from '../../data/mockData';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  ShieldCheck, 
  BookOpen, 
  Upload, 
  Calendar, 
  Check, 
  X,
  Sparkles,
  Layers,
  Copyright
} from 'lucide-react';

interface MaterialsManagementViewProps {
  pastPapers: PastPaper[];
  materials: LearningMaterial[];
  onCreatePastPaper: (paper: Omit<PastPaper, 'id' | 'downloadCount'>) => void;
  onCreateMaterial: (mat: Omit<LearningMaterial, 'id' | 'downloadCount'>) => void;
  onDeletePastPaper: (id: string) => void;
  onDeleteMaterial: (id: string) => void;
  onVerifyItem: (type: 'paper' | 'material', id: string) => void;
  showEnglishLabels: boolean;
}

export const MaterialsManagementView: React.FC<MaterialsManagementViewProps> = ({
  pastPapers,
  materials,
  onCreatePastPaper,
  onCreateMaterial,
  onDeletePastPaper,
  onDeleteMaterial,
  onVerifyItem,
  showEnglishLabels,
}) => {
  const [activeTab, setActiveTab] = useState<'PAST_PAPERS' | 'LEARNING_RESOURCES'>('PAST_PAPERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; type: 'paper' | 'material'; id: string; title: string }>({
    isOpen: false,
    type: 'paper',
    id: '',
    title: '',
  });

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State for Past Paper
  const [paperForm, setPaperForm] = useState<{
    title: string;
    examLevel: ExamTargetLevel;
    subject: SubjectCategory;
    year: number;
    session: string;
    fileSize: string;
    pageCount: number;
    verificationStatus: VerificationStatus;
    sourceType: 'MOEYS_OFFICIAL' | 'NIE_INTERNAL' | 'PASSKRU_ORIGINAL';
    hasAnswerKey: boolean;
    hasDetailedExplanation: boolean;
    copyrightStatus: 'PUBLIC_DOMAIN_GOV' | 'FAIR_USE_EDUCATIONAL' | 'PASSKRU_EXCLUSIVE';
    uploadedAt: string;
    uploadedBy: string;
  }>({
    title: '',
    examLevel: 'NIE_HIGH_SCHOOL',
    subject: 'PEDAGOGY',
    year: 2024,
    session: 'សម័យប្រឡង៖ ២០២៤',
    fileSize: '3.5 MB',
    pageCount: 6,
    verificationStatus: 'VERIFIED',
    sourceType: 'MOEYS_OFFICIAL',
    hasAnswerKey: true,
    hasDetailedExplanation: true,
    copyrightStatus: 'PUBLIC_DOMAIN_GOV',
    uploadedAt: new Date().toISOString().split('T')[0],
    uploadedBy: 'រដ្ឋបាល PassKru',
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'PAST_PAPERS') {
      if (!paperForm.title.trim()) return;

      let fileUrl = '';
      let fileSize = '3.5 MB';

      if (selectedFile) {
        try {
          setIsUploading(true);
          const fileExt = selectedFile.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `past-papers/${fileName}`;

          // Upload to Supabase bucket 'papers'
          const { data, error } = await supabase.storage
            .from('papers')
            .upload(filePath, selectedFile);

          if (error) {
            console.error("Supabase upload error:", error);
            alert("Error uploading file: " + error.message);
            setIsUploading(false);
            return;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('papers')
            .getPublicUrl(filePath);

          fileUrl = publicUrl;
          fileSize = `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`;
        } catch (err: any) {
          console.error("Upload process error:", err);
          alert("Upload process error: " + err.message);
          setIsUploading(false);
          return;
        }
      }

      onCreatePastPaper({
        ...paperForm,
        fileUrl,
        fileSize,
      });
      setSelectedFile(null);
      setIsUploading(false);
    } else {
      onCreateMaterial({
        title: paperForm.title,
        description: 'ឯកសារជំនួយស្មារតីត្រៀមប្រឡង',
        subject: paperForm.subject,
        targetLevel: paperForm.examLevel,
        resourceType: 'PDF_SUMMARY',
        topic: 'ទ្រឹស្ដីគរុកោសល្យ និងវិធីសាស្ត្របង្រៀន',
        fileSize: '4.8 MB',
        verificationStatus: 'VERIFIED',
        author: 'រដ្ឋបាល PassKru',
        uploadedAt: new Date().toISOString().split('T')[0],
        tags: ['គរុកោសល្យ', 'ត្រៀមប្រឡង'],
      });
    }
    setIsAddModalOpen(false);
  };

  const filteredPapers = pastPapers.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.session?.toLowerCase().includes(q)) return false;
    }
    if (selectedSubject !== 'ALL' && p.subject !== selectedSubject) return false;
    if (selectedLevel !== 'ALL' && p.examLevel !== selectedLevel) return false;
    if (selectedYear !== 'ALL' && p.year.toString() !== selectedYear) return false;
    return true;
  });

  const filteredMaterials = materials.filter((m) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!m.title.toLowerCase().includes(q) && !m.description.toLowerCase().includes(q)) return false;
    }
    if (selectedSubject !== 'ALL' && m.subject !== selectedSubject) return false;
    if (selectedLevel !== 'ALL' && m.targetLevel !== selectedLevel) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>វិញ្ញាសាចាស់ៗ & ឯកសាររៀន (Past Papers & Materials)</span>
          </h2>
          <p className="text-xs text-[#8E929E] mt-1">
            ចាត់ចែងបណ្តុំវិញ្ញាសាប្រឡងគ្រូថ្នាក់ជាតិពីឆ្នាំ ២០១៥-២០២៥ និងឯកសារជំនួយស្មារតី
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-[#0D0F12] border border-white/10 rounded-xl">
            <button
              onClick={() => setActiveTab('PAST_PAPERS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'PAST_PAPERS'
                  ? 'bg-[#1A1D24] text-indigo-400 shadow-xs border border-white/10'
                  : 'text-[#8E929E] hover:text-white'
              }`}
            >
              វិញ្ញាសាប្រឡងចាស់ៗ ({pastPapers.length})
            </button>
            <button
              onClick={() => setActiveTab('LEARNING_RESOURCES')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'LEARNING_RESOURCES'
                  ? 'bg-[#1A1D24] text-indigo-400 shadow-xs border border-white/10'
                  : 'text-[#8E929E] hover:text-white'
              }`}
            >
              ឯកសាររៀន & សង្ខេប ({materials.length})
            </button>
          </div>

          <button
            onClick={() => {
              setPaperForm({
                title: '',
                examLevel: 'NIE_HIGH_SCHOOL',
                subject: 'PEDAGOGY',
                year: 2024,
                session: 'សម័យប្រឡង៖ ២០២៤',
                fileSize: '3.2 MB',
                pageCount: 5,
                verificationStatus: 'VERIFIED',
                sourceType: 'MOEYS_OFFICIAL',
                hasAnswerKey: true,
                hasDetailedExplanation: true,
                copyrightStatus: 'PUBLIC_DOMAIN_GOV',
                uploadedAt: new Date().toISOString().split('T')[0],
                uploadedBy: 'រដ្ឋបាល PassKru',
              });
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>បញ្ចូលឯកសារថ្មី</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#111317] p-4 rounded-2xl border border-white/5 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5E6B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ស្វែងរកតាមចំណងជើង..."
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
            <option value="PEDAGOGY">គរុកោសល្យ និងវិធីសាស្ត្របង្រៀន</option>
            <option value="GENERAL_CULTURE">វប្បធម៌ទូទៅ និងចំណេះដឹងទូទៅ</option>
            <option value="EDUCATION_LAW">ច្បាប់ស្ដីពីការអប់រំ</option>
            <option value="KHMER_LIT">អក្សរសាស្ត្រខ្មែរ</option>
            <option value="MATH">គណិតវិទ្យា</option>
            <option value="HISTORY">ប្រវត្តិវិទ្យា</option>
          </select>
        </div>

        <div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none text-[#E0E0E0]"
          >
            <option value="ALL">គ្រប់កម្រិតប្រឡង (ទាំងអស់)</option>
            <option value="NIE_HIGH_SCHOOL">គ្រូវិទ្យាល័យ (NIE)</option>
            <option value="BASIC_SECONDARY">គ្រូអនុវិទ្យាល័យ</option>
            <option value="PRIMARY_SCHOOL">គ្រូបឋមសិក្សា</option>
          </select>
        </div>

        {activeTab === 'PAST_PAPERS' && (
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none text-[#E0E0E0]"
            >
              <option value="ALL">គ្រប់ឆ្នាំប្រឡង (២០១៨ - ២០២៥)</option>
              <option value="2025">ឆ្នាំ ២០២៥</option>
              <option value="2024">ឆ្នាំ ២០២៤</option>
              <option value="2023">ឆ្នាំ ២០២៣</option>
              <option value="2022">ឆ្នាំ ២០២២</option>
              <option value="2018">ឆ្នាំ ២០១៨</option>
            </select>
          </div>
        )}
      </div>

      {/* Content List */}
      {activeTab === 'PAST_PAPERS' ? (
        filteredPapers.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="រកមិនឃើញវិញ្ញាសាចាស់ៗទេ"
            description="មិនមានវិញ្ញាសាដែលត្រូវនឹងលក្ខខណ្ឌចម្រោះខាងលើឡើយ។"
            actionText="បញ្ចូលវិញ្ញាសាថ្មី"
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className="bg-[#111317] p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${SUBJECT_LABELS[paper.subject]?.color || 'bg-white/5 border-white/10 text-white'}`}>
                        {SUBJECT_LABELS[paper.subject]?.km || paper.subject}
                      </span>
                      <span className="text-[10px] font-bold text-[#E0E0E0] bg-[#0D0F12] border border-white/5 px-2 py-0.5 rounded-md">
                        ឆ្នាំ {paper.year}
                      </span>
                    </div>
                    <StatusBadge status={paper.verificationStatus} size="sm" />
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{paper.title}</h3>
                  <p className="text-[11px] text-[#8E929E]">{paper.session} • {EXAM_LEVEL_LABELS[paper.examLevel]?.shortKm}</p>

                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    {paper.hasAnswerKey && (
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-semibold border border-emerald-500/20">
                        ✓ មានចម្លើយ
                      </span>
                    )}
                    {paper.hasDetailedExplanation && (
                      <span className="text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md font-semibold border border-indigo-500/20">
                        ✓ មានការពន្យល់លម្អិត
                      </span>
                    )}
                    <span className="text-[#8E929E] bg-[#0D0F12] border border-white/5 px-2 py-0.5 rounded-md">
                      {paper.fileSize} ({paper.pageCount} ទំព័រ)
                    </span>
                  </div>

                  <div className="pt-2 text-[10px] text-[#5A5E6B] flex items-center justify-between">
                    <span>រក្សាសិទ្ធិ៖ {paper.copyrightStatus === 'PUBLIC_DOMAIN_GOV' ? 'ឯកសាររដ្ឋសាធារណៈ' : 'PassKru Exclusive'}</span>
                    <span>ទាញយក {(paper.downloadCount ?? 0).toLocaleString()} ដង</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-[#8E929E]">បញ្ចូលដោយ៖ {paper.uploadedBy}</span>

                  <div className="flex items-center gap-1.5">
                    {paper.verificationStatus === 'PENDING' && (
                      <button
                        onClick={() => onVerifyItem('paper', paper.id)}
                        className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-[11px] font-bold shadow-2xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>ផ្ទៀងផ្ទាត់</span>
                      </button>
                    )}

                    <button
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          type: 'paper',
                          id: paper.id,
                          title: paper.title,
                        })
                      }
                      className="p-1.5 text-[#8E929E] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Learning Materials Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              className="bg-[#111317] p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${SUBJECT_LABELS[mat.subject]?.color || 'bg-white/5 border-white/10 text-white'}`}>
                    {SUBJECT_LABELS[mat.subject]?.km || mat.subject}
                  </span>
                  <StatusBadge status={mat.verificationStatus} size="sm" />
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{mat.title}</h3>
                <p className="text-xs text-[#8E929E] line-clamp-2 leading-relaxed">{mat.description}</p>

                <div className="flex flex-wrap gap-1">
                  {mat.tags.map((t) => (
                    <span key={t} className="text-[10px] text-[#8E929E] bg-[#0D0F12] border border-white/5 px-2 py-0.5 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-[#8E929E]">អ្នករៀបចំ៖ {mat.author}</span>

                <div className="flex items-center gap-1.5">
                  {mat.verificationStatus === 'PENDING' && (
                    <button
                      onClick={() => onVerifyItem('material', mat.id)}
                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-[11px] font-bold shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>ផ្ទៀងផ្ទាត់</span>
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setDeleteModal({
                        isOpen: true,
                        type: 'material',
                        id: mat.id,
                        title: mat.title,
                      })
                    }
                    className="p-1.5 text-[#8E929E] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload/Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#111317] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 text-[#E0E0E0]">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <h3 className="text-base font-bold text-white">
                {activeTab === 'PAST_PAPERS' ? 'បញ្ចូលវិញ្ញាសាប្រឡងចាស់ថ្មី' : 'បញ្ចូលឯកសារជំនួយស្មារតីថ្មី'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#8E929E] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#8E929E] mb-1">ចំណងជើងឯកសារ *</label>
                <input
                  type="text"
                  required
                  value={paperForm.title}
                  onChange={(e) => setPaperForm({ ...paperForm, title: e.target.value })}
                  placeholder="ឧ. វិញ្ញាសាប្រឡងគ្រូ NIE ឆ្នាំ២០២៤ - គរុកោសល្យ..."
                  className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl text-white placeholder-[#5A5E6B] outline-none focus:border-indigo-500/50 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">មុខវិជ្ជា *</label>
                  <select
                    value={paperForm.subject}
                    onChange={(e) => setPaperForm({ ...paperForm, subject: e.target.value as SubjectCategory })}
                    className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50"
                  >
                    <option value="PEDAGOGY">គរុកោសល្យ និងវិធីសាស្ត្រ</option>
                    <option value="GENERAL_CULTURE">វប្បធម៌ទូទៅ</option>
                    <option value="EDUCATION_LAW">ច្បាប់ស្ដីពីការអប់រំ</option>
                    <option value="KHMER_LIT">អក្សរសាស្ត្រខ្មែរ</option>
                    <option value="MATH">គណិតវិទ្យា</option>
                    <option value="HISTORY">ប្រវត្តិវិទ្យា</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">កម្រិតគ្រូបង្រៀន *</label>
                  <select
                    value={paperForm.examLevel}
                    onChange={(e) => setPaperForm({ ...paperForm, examLevel: e.target.value as ExamTargetLevel })}
                    className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50"
                  >
                    <option value="NIE_HIGH_SCHOOL">គ្រូវិទ្យាល័យ (NIE)</option>
                    <option value="BASIC_SECONDARY">គ្រូអនុវិទ្យាល័យ</option>
                    <option value="PRIMARY_SCHOOL">គ្រូបឋមសិក្សា</option>
                  </select>
                </div>
              </div>

              {activeTab === 'PAST_PAPERS' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#8E929E] mb-1">ឆ្នាំប្រឡង</label>
                    <input
                      type="number"
                      value={paperForm.year}
                      onChange={(e) => setPaperForm({ ...paperForm, year: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#8E929E] mb-1">សម័យប្រឡង</label>
                    <input
                      type="text"
                      value={paperForm.session}
                      onChange={(e) => setPaperForm({ ...paperForm, session: e.target.value })}
                      placeholder="សម័យប្រឡង៖ ២៧ តុលា ២០២៤"
                      className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>
              )}

              {/* Upload Drag & Drop Box */}
              <div>
                <label className="block font-semibold text-[#8E929E] mb-1">ឯកសារ PDF (អតិបរមា 25MB)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/15 hover:border-indigo-500/50 bg-[#0D0F12] rounded-2xl p-6 text-center cursor-pointer transition-colors"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept=".pdf" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setSelectedFile(file);
                    }} 
                  />
                  <Upload className="w-8 h-8 mx-auto text-[#5A5E6B] mb-2" />
                  {selectedFile ? (
                    <div>
                      <p className="text-xs font-bold text-indigo-400 truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-[#8E929E] mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-bold text-[#E0E0E0]">ចុចដើម្បីជ្រើសរើសឯកសារ ឬអូសទម្លាក់នៅទីនេះ</p>
                      <p className="text-[10px] text-[#8E929E] mt-1">គាំទ្រទម្រង់ PDF (មានការស្កេនមេរោគស្វ័យប្រវត្តិ)</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-[#8E929E] bg-[#1A1D24] hover:bg-[#222731] hover:text-white font-semibold rounded-xl cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {isUploading ? 'កំពុងបញ្ជូន...' : 'បញ្ចូលឯកសារ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={() => {
          if (deleteModal.type === 'paper') {
            onDeletePastPaper(deleteModal.id);
          } else {
            onDeleteMaterial(deleteModal.id);
          }
          setDeleteModal({ ...deleteModal, isOpen: false });
        }}
        title="លុបឯកសារ"
        description={`តើអ្នកប្រាកដជាចង់លុប "${deleteModal.title}" មែនទេ?`}
        confirmText="លុបចោល"
        isDestructive={true}
      />
    </div>
  );
};
