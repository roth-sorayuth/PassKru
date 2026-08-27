import React, { useState } from 'react';
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

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showEnglishLabels, setShowEnglishLabels] = useState(true);

  // Entities State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [exams, setExams] = useState<ExamInfo[]>(INITIAL_EXAMS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [pastPapers, setPastPapers] = useState<PastPaper[]>(INITIAL_PAST_PAPERS);
  const [materials, setMaterials] = useState<LearningMaterial[]>(INITIAL_LEARNING_MATERIALS);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>(INITIAL_FLASHCARD_DECKS);
  const [mockExams, setMockExams] = useState<MockExam[]>(INITIAL_MOCK_EXAMS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

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
  const handleCreateAnnouncement = (ann: Omit<Announcement, 'id' | 'viewsCount'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      viewsCount: 0,
    };
    setAnnouncements([newAnn, ...announcements]);
  };

  const handleUpdateAnnouncement = (ann: Announcement) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === ann.id ? ann : a)));
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const handleTogglePinAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  // --- Handlers for Materials & Past Papers ---
  const handleCreatePastPaper = (paper: Omit<PastPaper, 'id' | 'downloadCount'>) => {
    const newPaper: PastPaper = {
      ...paper,
      id: `pp-${Date.now()}`,
      downloadCount: 0,
    };
    setPastPapers([newPaper, ...pastPapers]);
  };

  const handleCreateMaterial = (mat: Omit<LearningMaterial, 'id' | 'downloadCount'>) => {
    const newMat: LearningMaterial = {
      ...mat,
      id: `mat-${Date.now()}`,
      downloadCount: 0,
    };
    setMaterials([newMat, ...materials]);
  };

  const handleDeletePastPaper = (id: string) => {
    setPastPapers((prev) => prev.filter((p) => p.id !== id));
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
