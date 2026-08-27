import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ExamInfoPage } from './components/ExamInfoPage';
import { AnnouncementDetailPage } from './components/AnnouncementDetailPage';
import { ExamRequirementsPage } from './components/pages/ExamRequirementsPage';
import { LearningPage } from './components/LearningPage';
import { PastPapersPage } from './components/PastPapersPage';
import { QuestionPracticePage } from './components/QuestionPracticePage';
import { QuizPage } from './components/QuizPage';
import { MockExamPage } from './components/MockExamPage';
import { FlashcardsPage } from './components/FlashcardsPage';
import { StudyPlanPage } from './components/StudyPlanPage';
import { ProgressPage } from './components/ProgressPage';
import { WeaknessAnalysisPage } from './components/WeaknessAnalysisPage';
import { MentorsPage } from './components/MentorsPage';
import { NotificationsPage } from './components/NotificationsPage';
import { ProfilePage } from './components/ProfilePage';

export const App: React.FC = () => {
  const { currentPage, isLoggedIn } = useApp();

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainContainer = document.getElementById('main-scroll-container');
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'exam-info':
        return <ExamInfoPage />;
      case 'announcement-detail':
        return <AnnouncementDetailPage />;
      case 'requirements':
        return <ExamRequirementsPage />;
      case 'learning':
        return <LearningPage />;
      case 'past-papers':
        return <PastPapersPage />;
      case 'practice':
        return <QuestionPracticePage />;
      case 'quiz':
        return <QuizPage />;
      case 'mock-exam':
        return <MockExamPage />;
      case 'flashcards':
        return <FlashcardsPage />;
      case 'study-plan':
        return <StudyPlanPage />;
      case 'progress':
        return <ProgressPage />;
      case 'weakness':
        return <WeaknessAnalysisPage />;
      case 'mentors':
        return <MentorsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <Dashboard />;
    }
  };

  // If viewing public landing page in guest mode
  if (currentPage === 'landing' && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <LandingPage />
        </main>
        <Footer />
      </div>
    );
  }

  // Professional Polish App Layout with Dark Sidebar & Light Main Canvas
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar (slate-900) */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Right Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top Header */}
        <Navbar />

        {/* Scrollable Main Content */}
        <main
          id="main-scroll-container"
          className="flex-1 overflow-y-auto pb-20 lg:pb-8 bg-slate-50"
        >
          {renderPage()}
        </main>

        {/* Mobile bottom navigation */}
        <MobileNav />
      </div>
    </div>
  );
};

export default App;
