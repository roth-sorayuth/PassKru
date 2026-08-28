import React, { useState, useEffect } from 'react';
import { useAuth, useUser, SignInButton } from '@clerk/clerk-react';
import { Lock, ArrowLeft, ShieldCheck, ShieldAlert, LogIn } from 'lucide-react';
import { AdminTab, User, ExamInfo, Announcement, PastPaper, LearningMaterial, Question, Quiz, FlashcardDeck, MockExam, UserStatus } from './types';
import { 
  INITIAL_USERS, 
  INITIAL_EXAMS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_PAST_PAPERS, 
  INITIAL_LEARNING_MATERIALS, 
  INITIAL_QUESTIONS, 
  INITIAL_QUIZZES, 
  INITIAL_FLASHCARD_DECKS, 
  INITIAL_MOCK_EXAMS, 
  INITIAL_ADMIN_LOGS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { api } from './utils/api';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

import { DashboardView } from './components/dashboard/DashboardView';
import { UserManagementView } from './components/users/UserManagementView';
import { ExamManagementView } from './components/exams/ExamManagementView';
import { AnnouncementManagementView } from './components/announcements/AnnouncementManagementView';
import { MaterialsManagementView } from './components/materials/MaterialsManagementView';
import { QuestionBankView } from './components/question-bank/QuestionBankView';
import { QuizzesFlashcardsView } from './components/quizzes/QuizzesFlashcardsView';
import { MockExamManagementView } from './components/mock-exams/MockExamManagementView';
import { VerificationCenterView } from './components/verification/VerificationCenterView';
import { NotificationManagerView } from './components/notifications/NotificationManagerView';
import { AnalyticsReportsView } from './components/analytics/AnalyticsReportsView';

const mapBackendToAnnouncement = (b: any): Announcement => {
  return {
    id: String(b.announcement_id || b.announcementId),
    title: b.title || "",
    summary: b.summary || "",
    content: b.content || "",
    category: b.category || "GENERAL",
    priority: b.is_urgent || b.isUrgent ? "URGENT" : "NORMAL",
    status: "PUBLISHED",
    publishDate: b.publish_date || b.publishDate || new Date().toISOString(),
    isPinned: false,
    targetAudience: "ALL",
    viewsCount: 0,
    author: "MoEYS Admin",
  };
};

const mapAnnouncementToBackend = (a: any) => {
  return {
    examId: 1,
    title: a.title,
    summary: a.summary,
    content: a.content,
    category: a.category,
    isUrgent: a.priority === "URGENT",
    attachments: a.attachmentUrl ? [{ url: a.attachmentUrl, name: a.attachmentName }] : []
  };
};

const mapBackendToPastPaper = (b: any): PastPaper => {
  return {
    id: String(b.paper_id || b.paperId),
    title: b.title || "",
    examLevel: "NIE_HIGH_SCHOOL",
    subject: (b.subjectId === 1 ? "MATH" : b.subjectId === 2 ? "PHYSICS" : "CHEMISTRY") as any,
    year: Number(b.year) || 2024,
    session: b.session || "Morning",
    fileSize: b.fileSize || b.file_size || "0 KB",
    pageCount: 10,
    downloadCount: 0,
    verificationStatus: "VERIFIED",
    sourceType: "MOEYS_OFFICIAL",
    hasAnswerKey: true,
    hasDetailedExplanation: false,
    copyrightStatus: "PUBLIC_DOMAIN_GOV",
    uploadedAt: new Date().toISOString(),
    uploadedBy: "MoEYS Admin",
    fileUrl: b.fileUrl || b.file_url || "",
  };
};

const mapPastPaperToBackend = (p: any) => {
  const subjectIdMap: Record<string, number> = {
    "MATH": 1,
    "PHYSICS": 2,
    "CHEMISTRY": 3,
  };
  return {
    subjectId: subjectIdMap[p.subject] || 1,
    year: Number(p.year) || 2024,
    title: p.title,
    session: p.session || "Morning",
    fileUrl: p.fileUrl || "",
    fileSize: p.fileSize || "0 KB",
    hasAnswerKey: true,
    totalQuestions: 50,
  };
};

export default function App() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Navigation State
  const [activeTab, setActiveTab] = useState<AdminTab>('announcements');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showEnglishLabels, setShowEnglishLabels] = useState(true);

  // Entities State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [exams, setExams] = useState<ExamInfo[]>(INITIAL_EXAMS);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [pastPapers, setPastPapers] = useState<PastPaper[]>([]);
  const [materials, setMaterials] = useState<LearningMaterial[]>(INITIAL_LEARNING_MATERIALS);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>(INITIAL_FLASHCARD_DECKS);
  const [mockExams, setMockExams] = useState<MockExam[]>(INITIAL_MOCK_EXAMS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    const checkRoleAndFetch = async () => {
      if (isSignedIn && clerkUser) {
        try {
          const meRes = await api('/auth/me');
          if (meRes?.user?.role) {
            setUserRole(meRes.user.role);
          } else {
            setUserRole('admin');
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
          setUserRole('admin');
        }
      } else {
        setUserRole(null);
      }
      setAuthChecking(false);
    };

    if (isLoaded) {
      checkRoleAndFetch();
    }
  }, [isSignedIn, isLoaded, clerkUser]);

  useEffect(() => {
    if (!isSignedIn) return;

    const fetchData = async () => {
      try {
        const annResponse = await api('/announcements');
        if (annResponse && annResponse.announcements) {
          setAnnouncements(annResponse.announcements.map(mapBackendToAnnouncement));
        }

        const paperResponse = await api('/papers');
        if (paperResponse && paperResponse.papers) {
          setPastPapers(paperResponse.papers.map(mapBackendToPastPaper));
        }
      } catch (err) {
        console.error("Failed to fetch initial data from backend:", err);
      }
    };
    fetchData();
  }, [isSignedIn]);

  // Stats calculation
  const stats = {
    totalCandidates: users.filter((u) => u.role === 'CANDIDATE').length,
    activeMentors: users.filter((u) => u.role === 'MENTOR' && u.status === 'ACTIVE').length,
    totalExams: exams.length,
    totalQuestions: questions.length,
    totalMaterials: pastPapers.length + materials.length,
    totalMockExams: mockExams.length,
    pendingVerifications: 
      users.filter((u) => u.status === 'PENDING_VERIFICATION').length +
      questions.filter((q) => q.verificationStatus === 'PENDING').length +
      pastPapers.filter((p) => p.verificationStatus === 'PENDING').length +
      materials.filter((m) => m.verificationStatus === 'PENDING').length,
  };

  // Pending items for verification center
  const pendingMentors = users.filter((u) => u.role === 'MENTOR' && u.status === 'PENDING_VERIFICATION');
  const pendingQuestions = questions.filter((q) => q.verificationStatus === 'PENDING');
  const pendingPapers = pastPapers.filter((p) => p.verificationStatus === 'PENDING');
  const pendingMaterials = materials.filter((m) => m.verificationStatus === 'PENDING');

  // --- Handlers for Users ---
  const handleUpdateUserStatus = (userId: string, status: UserStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
  };

  const handleVerifyMentor = (mentorId: string, isApproved: boolean, notes?: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === mentorId
          ? {
              ...u,
              status: isApproved ? 'ACTIVE' : 'SUSPENDED',
              mentorVerificationDocUrl: isApproved ? u.mentorVerificationDocUrl : undefined,
            }
          : u
      )
    );
  };

  // --- Handlers for Exams ---
  const handleCreateExam = (exam: Omit<ExamInfo, 'id' | 'lastUpdated'>) => {
    const newExam: ExamInfo = {
      ...exam,
      id: `exam-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setExams([newExam, ...exams]);
  };

  const handleUpdateExam = (exam: ExamInfo) => {
    setExams((prev) => prev.map((e) => (e.id === exam.id ? exam : e)));
  };

  const handleDeleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
  };

  const handleToggleExamOutdated = (id: string) => {
    setExams((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              isOutdated: !e.isOutdated,
              verificationStatus: e.isOutdated ? 'VERIFIED' : 'OUTDATED',
            }
          : e
      )
    );
  };

  // --- Handlers for Announcements ---
  const handleCreateAnnouncement = async (ann: Omit<Announcement, 'id' | 'viewsCount'>) => {
    try {
      const backendAnn = mapAnnouncementToBackend(ann);
      const res = await api('/announcements', {
        method: 'POST',
        body: backendAnn,
      });
      const createdAnn = mapBackendToAnnouncement(res.announcement);
      setAnnouncements(prev => [createdAnn, ...prev]);
    } catch (err) {
      console.error("Failed to create announcement:", err);
    }
  };

  const handleUpdateAnnouncement = async (ann: Announcement) => {
    try {
      const backendAnn = mapAnnouncementToBackend(ann);
      const res = await api(`/announcements/${ann.id}`, {
        method: 'PUT',
        body: backendAnn,
      });
      const updatedAnn = mapBackendToAnnouncement(res.announcement);
      setAnnouncements(prev => prev.map(a => a.id === ann.id ? updatedAnn : a));
    } catch (err) {
      console.error("Failed to update announcement:", err);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await api(`/announcements/${id}`, {
        method: 'DELETE',
      });
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error("Failed to delete announcement:", err);
    }
  };

  const handleTogglePinAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  // --- Handlers for Materials & Past Papers ---
  const handleCreatePastPaper = async (paper: Omit<PastPaper, 'id' | 'downloadCount'>) => {
    try {
      const backendPaper = mapPastPaperToBackend(paper);
      const res = await api('/papers', {
        method: 'POST',
        body: backendPaper,
      });
      const createdPaper = mapBackendToPastPaper(res.paper);
      setPastPapers(prev => [createdPaper, ...prev]);
    } catch (err) {
      console.error("Failed to create past paper:", err);
    }
  };

  const handleCreateMaterial = (mat: Omit<LearningMaterial, 'id' | 'downloadCount'>) => {
    const newMat: LearningMaterial = {
      ...mat,
      id: `mat-${Date.now()}`,
      downloadCount: 0,
    };
    setMaterials([newMat, ...materials]);
  };

  const handleDeletePastPaper = async (id: string) => {
    try {
      await api(`/papers/${id}`, {
        method: 'DELETE',
      });
      setPastPapers(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Failed to delete past paper:", err);
    }
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const handleVerifyResource = (type: 'paper' | 'material', id: string) => {
    if (type === 'paper') {
      setPastPapers((prev) =>
        prev.map((p) => (p.id === id ? { ...p, verificationStatus: 'VERIFIED' } : p))
      );
    } else {
      setMaterials((prev) =>
        prev.map((m) => (m.id === id ? { ...m, verificationStatus: 'VERIFIED' } : m))
      );
    }
  };

  // --- Handlers for Question Bank ---
  const handleCreateQuestion = (q: Omit<Question, 'id' | 'usageCountInExams' | 'correctRatePercentage' | 'createdAt' | 'lastUpdated'>) => {
    const newQ: Question = {
      ...q,
      id: `q-${Date.now()}`,
      usageCountInExams: 0,
      correctRatePercentage: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setQuestions([newQ, ...questions]);
  };

  const handleUpdateQuestion = (q: Question) => {
    setQuestions((prev) => prev.map((item) => (item.id === q.id ? q : item)));
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleVerifyQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, verificationStatus: 'VERIFIED' } : q))
    );
  };

  // --- Handlers for Quizzes & Flashcards ---
  const handleCreateQuiz = (quiz: Omit<Quiz, 'id' | 'participationsCount' | 'averageScorePercentage'>) => {
    const newQuiz: Quiz = {
      ...quiz,
      id: `quiz-${Date.now()}`,
      participationsCount: 0,
      averageScorePercentage: 0,
    };
    setQuizzes([newQuiz, ...quizzes]);
  };

  const handleCreateDeck = (deck: Omit<FlashcardDeck, 'id' | 'viewsCount'>) => {
    const newDeck: FlashcardDeck = {
      ...deck,
      id: `deck-${Date.now()}`,
      viewsCount: 0,
    };
    setFlashcardDecks([newDeck, ...flashcardDecks]);
  };

  const handleDeleteQuiz = (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  const handleDeleteDeck = (id: string) => {
    setFlashcardDecks((prev) => prev.filter((d) => d.id !== id));
  };

  // --- Handlers for Mock Exams ---
  const handleCreateMockExam = (mock: Omit<MockExam, 'id' | 'takersCount' | 'passRatePercentage' | 'averageScore'>) => {
    const newMock: MockExam = {
      ...mock,
      id: `mock-${Date.now()}`,
      takersCount: 0,
      passRatePercentage: 0,
      averageScore: 0,
    };
    setMockExams([newMock, ...mockExams]);
  };

  const handleUpdateMockExam = (mock: MockExam) => {
    setMockExams((prev) => prev.map((m) => (m.id === mock.id ? mock : m)));
  };

  const handleDeleteMockExam = (id: string) => {
    setMockExams((prev) => prev.filter((m) => m.id !== id));
  };

  // Quick Action Handler from Header
  const handleQuickAddAction = (action: string) => {
    if (action === 'question') setActiveTab('question-bank');
    if (action === 'exam') setActiveTab('exams');
    if (action === 'announcement') setActiveTab('announcements');
    if (action === 'material') setActiveTab('materials');
    if (action === 'mock') setActiveTab('mock-exams');
  };

  // Loading state
  if (!isLoaded || (isSignedIn && authChecking)) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] flex flex-col items-center justify-center font-sans antialiased text-[#E0E0E0]">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-semibold animate-pulse">Loading PassKru Admin...</p>
      </div>
    );
  }

  // Not Signed In Gateway Page
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] flex flex-col justify-between font-sans antialiased text-[#E0E0E0] selection:bg-indigo-500 selection:text-white">
        {/* Top bar */}
        <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              PK
            </div>
            <span className="text-lg font-bold text-white tracking-tight">PassKru Admin</span>
          </div>
          <a
            href="http://localhost:3000"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ទំព័រដើមបេក្ខជន / Candidate Landing</span>
          </a>
        </header>

        {/* Center Card */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111317] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight">ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                PassKru Administrator & Content Management Portal. សូមចូលប្រើប្រាស់គណនី Admin ដើម្បីបន្ត។
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <SignInButton mode="modal">
                <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-xl font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>ចូលគណនី Admin / Sign In</span>
                </button>
              </SignInButton>

              <a
                href="http://localhost:3000"
                className="block w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-medium text-xs border border-white/5 transition cursor-pointer"
              >
                ត្រឡប់ទៅកាន់ទំព័រដើម (Public Landing Page)
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-4 text-center text-xs text-slate-500 border-t border-white/5">
          &copy; {new Date().getFullYear()} PassKru Co., Ltd. &middot; Restricted Administrator Access
        </footer>
      </div>
    );
  }

  // Signed In, but NOT an Admin Role
  if (userRole && userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0A0B0D] flex flex-col items-center justify-center p-4 font-sans antialiased text-[#E0E0E0]">
        <div className="w-full max-w-md bg-[#111317] border border-rose-500/20 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">ការអនុញ្ញាតត្រូវបានបដិសេធ</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              គណនីរបស់អ្នក (<span className="text-indigo-400">{clerkUser?.primaryEmailAddress?.emailAddress}</span>) មិនមានសិទ្ធិជា Administrator ទេ។
            </p>
          </div>

          <div className="pt-2">
            <a
              href="http://localhost:3000"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ត្រឡប់ទៅផ្ទាំងបេក្ខជន / Candidate Portal</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0A0B0D] text-[#E0E0E0] font-sans antialiased">
      {/* Main Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingVerificationsCount={stats.pendingVerifications}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        showEnglishLabels={showEnglishLabels}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Fixed Header */}
        <Header
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          pendingCount={stats.pendingVerifications}
          onQuickAction={handleQuickAddAction}
          showEnglishLabels={showEnglishLabels}
          onToggleEnglishLabels={() => setShowEnglishLabels(!showEnglishLabels)}
        />

        {/* Dynamic Route View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              pendingUsers={pendingMentors}
              pendingQuestions={pendingQuestions}
              recentAuditLogs={INITIAL_ADMIN_LOGS}
              onNavigateTab={(tab) => {
                const map: Record<string, AdminTab> = {
                  USERS: 'users',
                  EXAMS: 'exams',
                  ANNOUNCEMENTS: 'announcements',
                  MATERIALS: 'materials',
                  QUESTION_BANK: 'question-bank',
                  QUIZZES_FLASHCARDS: 'quizzes-flashcards',
                  MOCK_EXAMS: 'mock-exams',
                  VERIFICATION: 'verification-center',
                  NOTIFICATIONS: 'notifications',
                  ANALYTICS: 'analytics',
                };
                setActiveTab(map[tab] || 'dashboard');
              }}
              showEnglishLabels={showEnglishLabels}
            />
          )}

          {activeTab === 'users' && (
            <UserManagementView
              users={users}
              onUpdateUserStatus={handleUpdateUserStatus}
              onVerifyMentor={handleVerifyMentor}
              showEnglishLabels={showEnglishLabels}
            />
          )}

          {activeTab === 'exams' && (
            <ExamManagementView
              exams={exams}
              onCreateExam={handleCreateExam}
              onUpdateExam={handleUpdateExam}
              onDeleteExam={handleDeleteExam}
              onToggleOutdated={handleToggleExamOutdated}
              showEnglishLabels={showEnglishLabels}
            />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementManagementView
              announcements={announcements}
              onCreateAnnouncement={handleCreateAnnouncement}
              onUpdateAnnouncement={handleUpdateAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
              onTogglePin={handleTogglePinAnnouncement}
              showEnglishLabels={showEnglishLabels}
            />
          )}

          {activeTab === 'materials' && (
            <MaterialsManagementView
              pastPapers={pastPapers}
              materials={materials}
              onCreatePastPaper={handleCreatePastPaper}
              onCreateMaterial={handleCreateMaterial}
              onDeletePastPaper={handleDeletePastPaper}
              onDeleteMaterial={handleDeleteMaterial}
              onVerifyItem={handleVerifyResource}
              showEnglishLabels={showEnglishLabels}
            />
          )}

          {activeTab === 'question-bank' && (
            <QuestionBankView
              questions={questions}
              onCreateQuestion={handleCreateQuestion}
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onVerifyQuestion={handleVerifyQuestion}
              showEnglishLabels={showEnglishLabels}
            />
          )}

          {activeTab === 'quizzes-flashcards' && (
            <QuizzesFlashcardsView
              quizzes={quizzes}
              flashcardDecks={flashcardDecks}
              onCreateQuiz={handleCreateQuiz}
              onCreateDeck={handleCreateDeck}
              onDeleteQuiz={handleDeleteQuiz}
              onDeleteDeck={handleDeleteDeck}
              showEnglishLabels={showEnglishLabels}
            />
          )}

          {activeTab === 'mock-exams' && (
            <MockExamManagementView
              mockExams={mockExams}
              onCreateMockExam={handleCreateMockExam}
              onUpdateMockExam={handleUpdateMockExam}
              onDeleteMockExam={handleDeleteMockExam}
              showEnglishLabels={showEnglishLabels}
            />
          )}

          {activeTab === 'verification-center' && (
            <VerificationCenterView
              pendingMentors={pendingMentors}
              pendingQuestions={pendingQuestions}
              pendingPapers={pendingPapers}
              pendingMaterials={pendingMaterials}
              onVerifyMentor={handleVerifyMentor}
              onVerifyQuestion={handleVerifyQuestion}
              onVerifyPaper={(id) => handleVerifyResource('paper', id)}
              onVerifyMaterial={(id) => handleVerifyResource('material', id)}
              showEnglishLabels={showEnglishLabels}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationManagerView showEnglishLabels={showEnglishLabels} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsReportsView showEnglishLabels={showEnglishLabels} />
          )}
        </main>
      </div>
    </div>
  );
}
