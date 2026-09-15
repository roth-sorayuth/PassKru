import React, { Suspense, lazy, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/ui/Sidebar';
import { Navbar } from './components/ui/Navbar';
import { MobileNav } from './components/ui/MobileNav';
import { useAuth } from '@clerk/clerk-react';
import { Eye } from 'lucide-react';
import { ExamSelectionFlow } from './components/exam-selection/ExamSelectionFlow';

// Pages load on demand so the first visit doesn't download every page (and
// heavy libraries like the PDF viewer) up front.
const AuthPage = lazy(() => import('./components/pages/AuthPage').then((m) => ({ default: m.AuthPage })));
const PublicLandingPage = lazy(() => import('./components/pages/PublicLandingPage').then((m) => ({ default: m.PublicLandingPage })));
const Dashboard = lazy(() => import('./components/pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const AnnouncementsPage = lazy(() => import('./components/pages/AnnouncementsPage').then((m) => ({ default: m.AnnouncementsPage })));
const AnnouncementDetailPage = lazy(() => import('./components/pages/AnnouncementDetailPage').then((m) => ({ default: m.AnnouncementDetailPage })));
const QuizPage = lazy(() => import('./components/pages/QuizPage').then((m) => ({ default: m.QuizPage })));
const StudyPlanPage = lazy(() => import('./components/pages/StudyPlanPage').then((m) => ({ default: m.StudyPlanPage })));
const MentorsPage = lazy(() => import('./components/pages/MentorsPage').then((m) => ({ default: m.MentorsPage })));
const NotificationsPage = lazy(() => import('./components/pages/NotificationsPage').then((m) => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import('./components/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const PaperLibraryPage = lazy(() => import('./components/pages/PaperLibraryPage').then((m) => ({ default: m.PaperLibraryPage })));
const PracticePage = lazy(() => import('./components/pages/PracticePage').then((m) => ({ default: m.PracticePage })));
const FlashcardsPage = lazy(() => import('./components/pages/FlashcardsPage').then((m) => ({ default: m.FlashcardsPage })));
const WeaknessPage = lazy(() => import('./components/pages/WeaknessPage').then((m) => ({ default: m.WeaknessPage })));

const PageFallback: React.FC = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-7 h-7 border-3 border-black/10 border-t-black rounded-full animate-spin" />
  </div>
);

export const App: React.FC = () => {
  const { currentPage, setCurrentPage, isLoading, userProfile } = useApp();
  const { isSignedIn, isLoaded } = useAuth();

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainContainer = document.getElementById('main-scroll-container');
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const renderPage = () => {
    // Check if new user hasn't completed exam & subject selection
    const isPersonalizedPage = [
      'dashboard',
      'practice',
      'quiz',
      'mock-exam',
      'flashcards',
    ].includes(currentPage);
    // The study plan page runs its own level → subjects → placement test steps.

    if (isPersonalizedPage && !userProfile?.hasCompletedExamSelection) {
      return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn max-w-5xl mx-auto">
          <ExamSelectionFlow />
        </div>
      );
    }
    switch (currentPage) {
      case 'announcements':
        return <AnnouncementsPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'announcement-detail':
        return <AnnouncementDetailPage />;
      case 'past-papers':
        return <PaperLibraryPage mode="past-paper" title="វិញ្ញាសាចាស់ៗ" />;
      case 'prepare-papers':
      case 'learning':
        return <PaperLibraryPage mode="prepare-paper" title="វិញ្ញាសាត្រៀម" />;
      case 'practice':
        return <PracticePage />;
      case 'quiz':
        return <QuizPage />;
      case 'mock-exam':
        return <QuizPage />;
      case 'flashcards':
        return <FlashcardsPage />;
      case 'study-plan':
        return <StudyPlanPage />;
      case 'mentors':
        return <MentorsPage />;
      case 'weakness':
        return <WeaknessPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <AnnouncementsPage />;
    }
  };

  // Loading or verifying user role
  if (!isLoaded || isLoading || (isSignedIn && !userProfile?.role)) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 select-none font-sans">
        <div className="relative flex flex-col items-center justify-center space-y-4">
          <img 
            src="/PassKru-logo.svg" 
            alt="PassKru" 
            className="w-28 sm:w-32 h-28 sm:h-32 object-contain animate-pulse"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== window.location.origin + '/PassKru.svg') {
                target.src = '/PassKru.svg';
              }
            }}
          />
          <div className="w-7 h-7 border-3 border-black/10 border-t-black rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const isViewingAsUser = sessionStorage.getItem('viewAsUser') === 'true';

  const exitViewAsUser = () => {
    sessionStorage.removeItem('viewAsUser');
    const adminUrl = import.meta.env.VITE_ADMIN_URL || `${window.location.protocol}//${window.location.hostname}:3001`;
    window.location.href = adminUrl;
  };

  // ===================== EXPLICIT LANDING PAGE =====================
  if (currentPage === 'landing') {
    return <Suspense fallback={<PageFallback />}><PublicLandingPage /></Suspense>;
  }

  // ===================== NOT LOGGED IN =====================
  if (!isSignedIn) {
    if (currentPage === 'login') {
      return <Suspense fallback={<PageFallback />}><AuthPage initialMode="login" /></Suspense>;
    }
    if (currentPage === 'register') {
      return <Suspense fallback={<PageFallback />}><AuthPage initialMode="register" /></Suspense>;
    }
    return <Suspense fallback={<PageFallback />}><PublicLandingPage /></Suspense>;
  }

  // ===================== LOGGED IN =====================
  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased overflow-hidden selection:bg-[#0a3263] selection:text-white animate-fadeIn flex-col">
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
        <div className="hidden lg:flex shrink-0">
          <Sidebar />
        </div>

        {/* Main Right Content Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Top Header */}
          <Navbar />

          {/* Scrollable Main Content */}
          <main
            id="main-scroll-container"
            className="flex-1 overflow-y-auto pb-20 lg:pb-8 bg-[#f8fafc]"
          >
            <Suspense fallback={<PageFallback />}>{renderPage()}</Suspense>
          </main>

          {/* Mobile bottom navigation */}
          <MobileNav />
        </div>
      </div>
    </div>
  );
};

export default App;