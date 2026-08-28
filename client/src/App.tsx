import React, { useEffect, useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/ui/Sidebar';
import { Navbar } from './components/ui/Navbar';
import { MobileNav } from './components/ui/MobileNav';
import { ChevronLeft, ChevronRight, Search, ShoppingCart, X, Eye, EyeOff } from 'lucide-react';

import { AuthPage } from './components/pages/AuthPage';
import { PublicLandingPage } from './components/pages/PublicLandingPage';
import { Dashboard } from './components/pages/Dashboard';
import { AnnouncementsPage } from './components/pages/AnnouncementsPage';
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
  const {
    currentPage,
    setCurrentPage,
    isLoggedIn,
    isLoading
  } = useApp();

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
      case 'announcements':
        return <AnnouncementsPage />;
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
        return <AnnouncementsPage />;
    }
  };

  // Premium loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans antialiased">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-semibold animate-pulse">Loading PassKru...</p>
      </div>
    );
  }

  return (
    <>
      {/* 1. GUEST STATE: Render a pure info-only landing page or auth page */}
      {!isLoggedIn ? (
        currentPage === 'login' ? (
          <AuthPage initialMode="login" />
        ) : currentPage === 'register' ? (
          <AuthPage initialMode="register" />
        ) : (
          <PublicLandingPage />
        )
      ) : (
        /* 2. SIGNED IN STATE: Sidebar on left + Clean main content area without top navbar */
        <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased overflow-hidden selection:bg-[#0a3263] selection:text-white animate-fadeIn">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex shrink-0">
            <Sidebar />
          </div>

          {/* Main Right Content Area */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Scrollable Main Content */}
            <main
              id="main-scroll-container"
              className="flex-1 overflow-y-auto pb-20 lg:pb-8 bg-[#f8fafc]"
            >
              {renderPage()}
            </main>

            {/* Mobile bottom navigation */}
            <MobileNav />
          </div>
        </div>
      )}
    </>
  );
};

export default App;
