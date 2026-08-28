import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/ui/Sidebar';
import { Navbar } from './components/ui/Navbar';
import { MobileNav } from './components/ui/MobileNav';
import { useAuth } from '@clerk/clerk-react';
import { Eye } from 'lucide-react';

import { AuthPage } from './components/pages/AuthPage';
import { PublicLandingPage } from './components/pages/PublicLandingPage';
import { Dashboard } from './components/pages/Dashboard';
import { AnnouncementDetailPage } from './components/pages/AnnouncementDetailPage';
import { ExamRequirementsPage } from './components/pages/ExamRequirementsPage';
import { LearningPage } from './components/pages/LearningPage';
import { QuizPage } from './components/pages/QuizPage';
import { MockExamPage } from './components/pages/MockExamPage';
import { StudyPlanPage } from './components/pages/StudyPlanPage';
import { MentorsPage } from './components/pages/MentorsPage';
import { NotificationsPage } from './components/pages/NotificationsPage';
import { ProfilePage } from './components/pages/ProfilePage';

export const App: React.FC = () => {
  const { currentPage, setCurrentPage, isLoading } = useApp();
  const { isSignedIn, isLoaded } = useAuth();

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainContainer = document.getElementById('main-scroll-container');
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  // After login → dashboard
  useEffect(() => {
    if (isSignedIn && (currentPage === 'login' || currentPage === 'register' || currentPage === 'landing')) {
      setCurrentPage('dashboard');
    }
  }, [isSignedIn, currentPage, setCurrentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'announcement-detail':
        return <AnnouncementDetailPage />;
      case 'requirements':
        return <ExamRequirementsPage />;
      case 'learning':
        return <LearningPage />;
      case 'quiz':
        return <QuizPage />;
      case 'mock-exam':
        return <MockExamPage />;
      case 'study-plan':
        return <StudyPlanPage />;
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

  // Loading
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans antialiased">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-semibold animate-pulse">Loading PassKru...</p>
      </div>
    );
  }

  const isViewingAsUser = sessionStorage.getItem('viewAsUser') === 'true';

  const exitViewAsUser = () => {
    sessionStorage.removeItem('viewAsUser');
    const currentPort = window.location.port;
    const adminPort = currentPort === '3000' ? '3001' : '3000';
    window.location.href = `${window.location.protocol}//${window.location.hostname}:${adminPort}`;
  };

  // ===================== NOT LOGGED IN =====================
  if (!isSignedIn) {
    if (currentPage === 'login') {
      return <AuthPage initialMode="login" />;
    }
    if (currentPage === 'register') {
      return <AuthPage initialMode="register" />;
    }
    return <PublicLandingPage />;
  }

  // ===================== LOGGED IN =====================
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden selection:bg-indigo-500 selection:text-white animate-fadeIn flex-col">
      {/* View As User Top Banner */}
      {isViewingAsUser && (
        <div className="bg-indigo-600 text-white text-xs lg:text-sm py-2.5 px-4 flex items-center justify-between shadow-sm z-50 shrink-0 font-medium select-none">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-200" />
            <span>You are currently viewing this website with Candidate Role (View As User mode).</span>
          </div>
          <button 
            onClick={exitViewAsUser}
            className="bg-white text-indigo-700 hover:bg-indigo-50 px-3 py-1 rounded-md text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Return to Admin Dashboard
          </button>
        </div>
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop Sidebar */}
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
    </div>
  );
};

export default App;