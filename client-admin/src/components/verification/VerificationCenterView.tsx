import React, { useState } from 'react';
import { User, ExamInfo, Question, PastPaper, LearningMaterial, VerificationStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText, 
  GraduationCap, 
  HelpCircle, 
  UserCheck, 
  BookOpen, 
  Check, 
  X, 
  AlertCircle
} from 'lucide-react';

interface VerificationCenterViewProps {
  pendingMentors: User[];
  pendingQuestions: Question[];
  pendingPapers: PastPaper[];
  pendingMaterials: LearningMaterial[];
  onVerifyMentor: (mentorId: string, isApproved: boolean, notes?: string) => void;
  onVerifyQuestion: (questionId: string) => void;
  onVerifyPaper: (paperId: string) => void;
  onVerifyMaterial: (materialId: string) => void;
  showEnglishLabels: boolean;
}

export const VerificationCenterView: React.FC<VerificationCenterViewProps> = ({
  pendingMentors,
  pendingQuestions,
  pendingPapers,
  pendingMaterials,
  onVerifyMentor,
  onVerifyQuestion,
  onVerifyPaper,
  onVerifyMaterial,
  showEnglishLabels,
}) => {
  const [activeTab, setActiveTab] = useState<'MENTORS' | 'QUESTIONS' | 'RESOURCES'>('MENTORS');
  const [selectedMentor, setSelectedMentor] = useState<User | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');

  const totalPending = pendingMentors.length + pendingQuestions.length + pendingPapers.length + pendingMaterials.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>មជ្ឈមណ្ឌលផ្ទៀងផ្ទាត់គុណភាព និងសញ្ញាបត្រ (Verification Center)</span>
          </h2>
          <p className="text-xs text-[#8E929E] mt-1">
            ពិនិត្យផ្ទៀងផ្ទាត់សញ្ញាបត្រគរុកោសល្យគ្រូបង្វឹក និងត្រួតពិនិត្យភាពត្រឹមត្រូវនៃវិញ្ញាសា
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
            {totalPending} មុខសញ្ញារង់ចាំការត្រួតពិនិត្យ
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center p-1 bg-[#111317] rounded-2xl border border-white/5 shadow-xs">
        <button
          onClick={() => setActiveTab('MENTORS')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'MENTORS'
              ? 'bg-[#1A1D24] text-amber-400 shadow-xs border border-white/10'
              : 'text-[#8E929E] hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>ផ្ទៀងផ្ទាត់សញ្ញាបត្រគ្រូបង្វឹក ({pendingMentors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('QUESTIONS')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'QUESTIONS'
              ? 'bg-[#1A1D24] text-amber-400 shadow-xs border border-white/10'
              : 'text-[#8E929E] hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>ផ្ទៀងផ្ទាត់សំណួរ & គន្លឹះដោះស្រាយ ({pendingQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('RESOURCES')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'RESOURCES'
              ? 'bg-[#1A1D24] text-amber-400 shadow-xs border border-white/10'
              : 'text-[#8E929E] hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>ផ្ទៀងផ្ទាត់ឯកសារ & វិញ្ញាសា ({pendingPapers.length + pendingMaterials.length})</span>
        </button>
      </div>

      {/* Content depending on active tab */}
      {activeTab === 'MENTORS' && (
        pendingMentors.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="គ្មានគ្រូបង្វឹករង់ចាំការផ្ទៀងផ្ទាត់ទេ"
            description="គ្រប់គណនីគ្រូបង្វឹក និងសាស្ត្រាចារ្យត្រូវបានផ្ទៀងផ្ទាត់សញ្ញាបត្ររួចរាល់ហើយ។"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-[#111317] rounded-2xl border border-amber-500/20 p-5 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                        {mentor.nameKhmer.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{mentor.nameKhmer}</h3>
                        <p className="text-xs text-[#8E929E]">{mentor.nameLatin} • {mentor.phone}</p>
                      </div>
                    </div>
                    <StatusBadge status="PENDING_VERIFICATION" size="sm" />
                  </div>

                  <div className="bg-[#0D0F12] p-3 rounded-xl border border-white/5 text-xs space-y-1 text-[#C5C8D1]">
                    <p><strong className="text-white">កម្រិតសញ្ញាបត្រ៖</strong> {mentor.mentorDegree}</p>
                    <p><strong className="text-white">កន្លែងបម្រើការងារ៖</strong> {mentor.mentorWorkplace}</p>
                    <p><strong className="text-white">រាជធានី-ខេត្ត៖</strong> {mentor.province}</p>
                  </div>

                  {mentor.mentorVerificationDocUrl && (
                    <div className="p-2.5 bg-[#0D0F12] rounded-xl border border-amber-500/20">
                      <span className="text-[10px] font-bold text-amber-400 block mb-1">ឯកសារសញ្ញាបត្រភ្ជាប់មកជាមួយ៖</span>
                      <img
                        src={mentor.mentorVerificationDocUrl}
                        alt="Doc"
                        className="w-full h-32 object-cover rounded-lg border border-white/10"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-white/5">
                  <button
                    onClick={() => onVerifyMentor(mentor.id, false)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors cursor-pointer"
                  >
                    បដិសេធ
                  </button>
                  <button
                    onClick={() => onVerifyMentor(mentor.id, true)}
                    className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    អនុម័តផ្ទៀងផ្ទាត់
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'QUESTIONS' && (
        pendingQuestions.length === 0 ? (
          <EmptyState
            icon={HelpCircle}
            title="គ្មានសំណួររង់ចាំការផ្ទៀងផ្ទាត់ទេ"
            description="គ្រប់សំណួរក្នុងធនាគារសំណួរត្រូវបានត្រួតពិនិត្យភាពត្រឹមត្រូវនៃគរុកោសល្យរួចរាល់។"
          />
        ) : (
          <div className="space-y-4">
            {pendingQuestions.map((q) => (
              <div key={q.id} className="bg-[#111317] p-5 rounded-2xl border border-amber-500/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                      {q.code}
                    </span>
                    <span className="text-xs font-semibold text-[#8E929E]">{q.subject}</span>
                    <StatusBadge status="PENDING" size="sm" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{q.statement}</h3>
                  <p className="text-xs text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                    💡 <strong>ការពន្យល់៖</strong> {q.explanationKhmer}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onVerifyQuestion(q.id)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>អនុម័តសំណួរ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'RESOURCES' && (
        (pendingPapers.length === 0 && pendingMaterials.length === 0) ? (
          <EmptyState
            icon={BookOpen}
            title="គ្មានឯកសាររង់ចាំការផ្ទៀងផ្ទាត់ទេ"
            description="គ្រប់វិញ្ញាសាចាស់ៗ និងឯកសាររៀនត្រូវបានត្រួតពិនិត្យរួចរាល់។"
          />
        ) : (
          <div className="space-y-4">
            {pendingPapers.map((p) => (
              <div key={p.id} className="bg-[#111317] p-5 rounded-2xl border border-amber-500/20 shadow-xs flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">វិញ្ញាសា</span>
                    <span className="text-xs text-[#8E929E]">ឆ្នាំ {p.year}</span>
                    <StatusBadge status="PENDING" size="sm" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{p.title}</h3>
                  <p className="text-xs text-[#8E929E]">{p.session} • បញ្ចូលដោយ {p.uploadedBy}</p>
                </div>

                <button
                  onClick={() => onVerifyPaper(p.id)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>អនុម័ត</span>
                </button>
              </div>
            ))}

            {pendingMaterials.map((m) => (
              <div key={m.id} className="bg-[#111317] p-5 rounded-2xl border border-amber-500/20 shadow-xs flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">ឯកសាររៀន</span>
                    <StatusBadge status="PENDING" size="sm" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{m.title}</h3>
                  <p className="text-xs text-[#8E929E]">អ្នករៀបចំ {m.author}</p>
                </div>

                <button
                  onClick={() => onVerifyMaterial(m.id)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>អនុម័ត</span>
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
