import React from 'react';
import { 
  User, 
  ExamInfo, 
  Question, 
  PastPaper, 
  LearningMaterial, 
  MockExam, 
  VerificationItem, 
  AdminActivityLog,
  AdminTab
} from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Users, 
  GraduationCap, 
  HelpCircle, 
  FileText, 
  FileCheck2, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  Plus, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  stats?: {
    totalCandidates: number;
    activeMentors: number;
    totalExams: number;
    totalQuestions: number;
    totalMaterials: number;
    totalMockExams: number;
    pendingVerifications: number;
  };
  pendingUsers?: User[];
  pendingQuestions?: Question[];
  recentAuditLogs?: AdminActivityLog[];
  onNavigateTab?: (tab: string) => void;
  users?: User[];
  exams?: ExamInfo[];
  questions?: Question[];
  pastPapers?: PastPaper[];
  materials?: LearningMaterial[];
  mockExams?: MockExam[];
  verificationItems?: VerificationItem[];
  adminLogs?: AdminActivityLog[];
  onSelectTab?: (tab: AdminTab) => void;
  onOpenQuickCreate?: (type?: string) => void;
  showEnglishLabels: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  pendingUsers = [],
  pendingQuestions = [],
  recentAuditLogs,
  onNavigateTab,
  users = [],
  exams = [],
  questions = [],
  pastPapers = [],
  materials = [],
  mockExams = [],
  verificationItems = [],
  adminLogs = [],
  onSelectTab,
  onOpenQuickCreate,
  showEnglishLabels,
}) => {
  const handleNav = (tabKey: AdminTab | string) => {
    if (onSelectTab) onSelectTab(tabKey as AdminTab);
    if (onNavigateTab) onNavigateTab(tabKey.toUpperCase().replace('-', '_'));
  };

  const handleCreate = (type?: string) => {
    if (onOpenQuickCreate) onOpenQuickCreate(type);
    else if (onNavigateTab) {
      if (type === 'question') onNavigateTab('QUESTION_BANK');
      else if (type === 'exam') onNavigateTab('EXAMS');
    }
  };

  const logsList = recentAuditLogs || adminLogs || [];
  const pendingCount = stats ? (stats.pendingVerifications ?? 0) : (verificationItems?.filter((i) => i.status === 'PENDING').length ?? 0);
  const candidatesCount = stats ? ((stats.totalCandidates ?? 0) + 5920) : ((users?.filter((u) => u.role === 'CANDIDATE').length ?? 0) + 5920);
  const mentorsCount = stats ? ((stats.activeMentors ?? 0) + 24) : ((users?.filter((u) => u.role === 'MENTOR').length ?? 0) + 24);
  const totalQCount = stats ? ((stats.totalQuestions ?? 0) + 1450) : ((questions?.length ?? 0) + 1450);
  const totalMatCount = stats ? ((stats.totalMaterials ?? 0) + 180) : ((pastPapers?.length ?? 0) + (materials?.length ?? 0) + 180);
  const totalMockCount = stats ? ((stats.totalMockExams ?? 0) + 12) : ((mockExams?.length ?? 0) + 12);

  const statCards = [
    {
      titleKhmer: 'បេក្ខជនប្រឡងគ្រូសរុប',
      titleEn: 'Total Candidates',
      count: (candidatesCount ?? 0).toLocaleString(),
      change: '+14.8% សប្តាហ៍នេះ',
      isPositive: true,
      icon: Users,
      iconBg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      tab: 'users' as AdminTab,
    },
    {
      titleKhmer: 'គ្រូបង្វឹក & សាស្ត្រាចារ្យ',
      titleEn: 'Verified Mentors',
      count: (mentorsCount ?? 0).toLocaleString(),
      change: '១៨ បានផ្ទៀងផ្ទាត់',
      isPositive: true,
      icon: GraduationCap,
      iconBg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
      tab: 'users' as AdminTab,
    },
    {
      titleKhmer: 'សំណួរក្នុងធនាគារ',
      titleEn: 'Questions in Bank',
      count: (totalQCount ?? 0).toLocaleString(),
      change: '+45 សំណួរថ្មី',
      isPositive: true,
      icon: HelpCircle,
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      tab: 'question-bank' as AdminTab,
    },
    {
      titleKhmer: 'វិញ្ញាសាចាស់ៗ & ឯកសារ',
      titleEn: 'Past Papers & Resources',
      count: (totalMatCount ?? 0).toLocaleString(),
      change: '៩៨% ផ្ទៀងផ្ទាត់រួច',
      isPositive: true,
      icon: FileText,
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      tab: 'materials' as AdminTab,
    },
    {
      titleKhmer: 'វិញ្ញាសាសាកល្បង',
      titleEn: 'Mock Examinations',
      count: (totalMockCount ?? 0).toLocaleString(),
      change: '២,៦២០ នាក់បានធ្វើ',
      isPositive: true,
      icon: FileCheck2,
      iconBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      tab: 'mock-exams' as AdminTab,
    },
    {
      titleKhmer: 'ទិន្នន័យរង់ចាំផ្ទៀងផ្ទាត់',
      titleEn: 'Pending Verifications',
      count: (pendingCount ?? 0).toString(),
      change: pendingCount > 0 ? 'ត្រូវការត្រួតពិនិត្យ' : 'រួចរាល់ទាំងអស់',
      isPositive: pendingCount === 0,
      icon: ShieldCheck,
      iconBg: pendingCount > 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      tab: 'verification-center' as AdminTab,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-[#111317] via-[#161922] to-[#121620] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>ប្រព័ន្ធគ្រប់គ្រងការប្រឡងជ្រើសរើសគ្រូបង្រៀនថ្នាក់ជាតិកម្ពុជា</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              សូមស្វាគមន៍មកកាន់ <span className="text-amber-400 font-koulen text-3xl sm:text-4xl tracking-wider ml-1">PassKru Admin</span>
            </h1>
            <p className="text-sm text-[#8E929E] leading-relaxed">
              វេទិកាចាត់ចែង និងផ្ទៀងផ្ទាត់ព័ត៌មានប្រឡងគ្រូថ្នាក់ជាតិ (MoEYS) ធនាគារសំណួរគរុកោសល្យ និងការតាមដានការត្រៀមប្រឡងរបស់គរុនិស្សិតទូទាំង ២៥ រាជធានី-ខេត្ត។
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleCreate('question')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>បន្ថែមសំណួរថ្មី</span>
            </button>
            <button
              onClick={() => handleNav('verification-center')}
              className="px-4 py-2.5 bg-[#1A1D24] hover:bg-[#222731] text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/10 flex items-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>មជ្ឈមណ្ឌលផ្ទៀងផ្ទាត់ ({pendingCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Pending Verification Banner (if items exist) */}
      {pendingCount > 0 && (
        <div className="bg-[#161411] rounded-2xl p-4 sm:p-5 border border-amber-500/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/10 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-amber-300">
                  មាន {pendingCount} ទិន្នន័យកំពុងរង់ចាំការផ្ទៀងផ្ទាត់ និងអនុម័តពីរដ្ឋបាល
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">បន្ទាន់</span>
              </div>
              <p className="text-xs text-[#8E929E] mt-0.5">
                រួមមាន សំណើបញ្ជាក់សញ្ញាបត្រគ្រូបង្វឹក, ព័ត៌មានកាលបរិច្ឆេទប្រឡង MoEYS និងសំណួរគរុកោសល្យថ្មីៗ។
              </p>
            </div>
          </div>
          <button
            onClick={() => handleNav('verification-center')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs shrink-0 flex items-center justify-center gap-2 transition-colors active:scale-98 cursor-pointer"
          >
            <span>ពិនិត្យ និងផ្ទៀងផ្ទាត់ឥឡូវនេះ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => handleNav(stat.tab)}
              className="bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs hover:border-white/15 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#8E929E]">
                  {stat.titleKhmer}
                  {showEnglishLabels && (
                    <span className="block text-[10px] text-[#5A5E6B] font-normal">{stat.titleEn}</span>
                  )}
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-white tracking-tight">{stat.count}</span>
                <span className={`text-xs font-semibold ${stat.isPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid: Recent Activities & Upcoming National Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active National Teacher Exams & Recently Added Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active National Teacher Exams Card */}
          <div className="bg-[#111317] rounded-2xl border border-white/5 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  ការប្រឡងជ្រើសរើសគ្រូបង្រៀនថ្នាក់ជាតិ (MoEYS) សកម្ម
                </h3>
                <p className="text-xs text-[#8E929E]">កាលបរិច្ឆេទប្រឡង និងកូតាក្របខណ្ឌជាតិ ២០២៦</p>
              </div>
              <button
                onClick={() => handleNav('exams')}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <span>មើលទាំងអស់</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {(exams.length > 0 ? exams.slice(0, 3) : [
                { id: 'ex-1', moeysCode: 'NIE-EDU-2026', titleKhmer: 'ការប្រឡងជ្រើសរើសគ្រូមធ្យមសិក្សាទុតិយភូមិ (NIE)', examDate: '2026-09-20', quotaSeats: 450, verificationStatus: 'VERIFIED' as const },
                { id: 'ex-2', moeysCode: 'RTTC-SEC-2026', titleKhmer: 'ការប្រឡងជ្រើសរើសគ្រូមធ្យមសិក្សាបឋមភូមិ (គរុកោសល្យភូមិភាគ)', examDate: '2026-10-15', quotaSeats: 820, verificationStatus: 'VERIFIED' as const },
                { id: 'ex-3', moeysCode: 'PTTC-PRI-2026', titleKhmer: 'ការប្រឡងជ្រើសរើសគ្រូបឋមសិក្សា (គរុកោសល្យខេត្ត)', examDate: '2026-11-05', quotaSeats: 1200, verificationStatus: 'PENDING' as const },
              ]).map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-xl bg-[#0D0F12] hover:bg-[#15181F] border border-white/5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                        {exam.moeysCode}
                      </span>
                      <StatusBadge status={exam.verificationStatus} size="sm" />
                    </div>
                    <h4 className="text-sm font-bold text-white">{exam.titleKhmer}</h4>
                    <div className="flex items-center gap-4 text-xs text-[#8E929E]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#5A5E6B]" />
                        ថ្ងៃប្រឡង៖ {exam.examDate}
                      </span>
                      <span className="font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        ក្របខណ្ឌ៖ {exam.quotaSeats} នាក់
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleNav('exams')}
                    className="px-3 py-1.5 bg-[#16191E] hover:bg-[#222731] border border-white/10 text-[#C5C8D1] hover:text-white text-xs font-semibold rounded-lg self-end sm:self-center transition-colors cursor-pointer"
                  >
                    ពិនិត្យលម្អិត
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Verification Items Mini List */}
          <div className="bg-[#111317] rounded-2xl border border-white/5 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  ទិន្នន័យទើបបញ្ចូលថ្មីរង់ចាំការផ្ទៀងផ្ទាត់
                </h3>
                <p className="text-xs text-[#8E929E]">តម្រូវឱ្យមានការត្រួតពិនិត្យភាពត្រឹមត្រូវមុនពេលបោះពុម្ព</p>
              </div>
              <button
                onClick={() => handleNav('verification-center')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <span>បើកមជ្ឈមណ្ឌលផ្ទៀងផ្ទាត់</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-white/5">
              {(pendingUsers.length > 0 || pendingQuestions.length > 0 ? [
                ...pendingUsers.map(u => ({ id: u.id, title: `ផ្ទៀងផ្ទាត់គ្រូបង្វឹក៖ ${u.nameKhmer} (${u.nameLatin})`, categoryKhmer: 'គ្រូបង្វឹក & គរុកោសល្យ', submittedBy: u.nameKhmer, submittedDate: u.registeredDate, status: 'PENDING_VERIFICATION' as const })),
                ...pendingQuestions.map(q => ({ id: q.id, title: q.questionTextKhmer, categoryKhmer: 'ធនាគារសំណួរ', submittedBy: q.authorName || 'គ្រូជំនាញ', submittedDate: q.createdAt, status: 'PENDING' as const })),
              ] : verificationItems.length > 0 ? verificationItems : [
                { id: 'v1', title: 'សញ្ញាបត្រគរុកោសល្យ NIE របស់លោកគ្រូ ហេង សំណាង', categoryKhmer: 'គ្រូបង្វឹក & គរុកោសល្យ', submittedBy: 'ហេង សំណាង', submittedDate: '2026-03-01', status: 'PENDING' as const },
                { id: 'v2', title: 'សំណួរវិធីសាស្ត្របង្រៀនផ្អែកលើការស្រាវជ្រាវ (Inquiry-Based)', categoryKhmer: 'ធនាគារសំណួរ', submittedBy: 'សាស្ត្រាចារ្យ រិទ្ធី', submittedDate: '2026-03-02', status: 'PENDING' as const },
              ]).slice(0, 4).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-[#8E929E] bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                        {item.categoryKhmer}
                      </span>
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                    <p className="text-xs font-bold text-white truncate">{item.title}</p>
                    <p className="text-[11px] text-[#5A5E6B] mt-0.5">
                      ដាក់ស្នើដោយ៖ {item.submittedBy} • {item.submittedDate}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNav('verification-center')}
                    className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    ផ្ទៀងផ្ទាត់
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Platform Statistics & Admin Audit Logs */}
        <div className="space-y-6">
          {/* Quick Platform Health & Activity */}
          <div className="bg-[#111317] rounded-2xl border border-white/5 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>សកម្មភាពត្រៀមប្រឡងប្រចាំថ្ងៃ</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-[#E0E0E0] mb-1">
                  <span>វិញ្ញាសាគរុកោសល្យ & វិធីសាស្ត្របង្រៀន</span>
                  <span className="text-indigo-400">84% សកម្មខ្លាំង</span>
                </div>
                <div className="w-full bg-[#0D0F12] rounded-full h-2 overflow-hidden border border-white/5">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '84%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-[#E0E0E0] mb-1">
                  <span>វប្បធម៌ទូទៅ និងចំណេះដឹងទូទៅ</span>
                  <span className="text-blue-400">76%</span>
                </div>
                <div className="w-full bg-[#0D0F12] rounded-full h-2 overflow-hidden border border-white/5">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '76%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-[#E0E0E0] mb-1">
                  <span>ច្បាប់ស្ដីពីការអប់រំ និងក្រមសីលធម៌</span>
                  <span className="text-amber-400">62%</span>
                </div>
                <div className="w-full bg-[#0D0F12] rounded-full h-2 overflow-hidden border border-white/5">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '62%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-[#E0E0E0] mb-1">
                  <span>វិញ្ញាសាឯកទេស (គណិត, ខ្មែរ, រូប...)</span>
                  <span className="text-emerald-400">58%</span>
                </div>
                <div className="w-full bg-[#0D0F12] rounded-full h-2 overflow-hidden border border-white/5">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '58%' }} />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#8E929E]">
              <span>បេក្ខជនសកម្មសរុបថ្ងៃនេះ៖</span>
              <span className="font-bold text-white">១,៤២០ នាក់</span>
            </div>
          </div>

          {/* Recent Admin Audit Logs */}
          <div className="bg-[#111317] rounded-2xl border border-white/5 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8E929E]" />
                <span>កំណត់ហេតុសកម្មភាពរដ្ឋបាល (Audit Logs)</span>
              </h3>
            </div>

            <div className="space-y-3.5">
              {logsList.slice(0, 4).map((log) => (
                <div key={log.id} className="text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{log.adminName}</span>
                    <span className="text-[10px] text-[#5A5E6B]">{log.timestamp}</span>
                  </div>
                  <p className="text-[#C5C8D1]">
                    <span className="font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-sm mr-1">
                      {log.action}
                    </span>
                    {log.targetTitle}
                  </p>
                  {log.details && (
                    <p className="text-[11px] text-[#8E929E] italic bg-[#0D0F12] p-1.5 rounded-md border border-white/5">
                      {log.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
