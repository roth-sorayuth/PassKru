import React, { useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, useAuth } from '@clerk/clerk-react';
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
import { ExamRequirementsPage } from './components/ExamRequirementsPage';
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
  const { currentPage, setIsLoggedIn, setCurrentPage } = useApp();
  const { isSignedIn, isLoaded } = useAuth();

  // Synchronize Clerk auth state with local context state
  useEffect(() => {
    if (isLoaded) {
      setIsLoggedIn(!!isSignedIn);
      if (!isSignedIn) {
        // If not signed in, reset to public view state
        setCurrentPage('landing');
      } else if (currentPage === 'landing') {
        // Automatically take authenticated users to the dashboard
        setCurrentPage('dashboard');
      }
    }
  }, [isSignedIn, isLoaded, setIsLoggedIn, setCurrentPage]);

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

  // Premium loading state while Clerk is loading auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans antialiased">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-semibold animate-pulse">Loading PassKru...</p>
      </div>
    );
  }

  return (
    <>
      {/* 1. GUEST STATE: Render a pure info-only landing page (no sidebar, no internal features) */}
      <SignedOut>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white animate-fadeIn">
          {/* Public Header */}
          <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  PK
                </div>
                <span className="font-bold text-lg text-slate-900 tracking-tight">PassKru ជាប់គ្រូ</span>
              </div>

              <div className="flex items-center gap-3">
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer shadow-xs">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </div>
          </header>

          {/* Landing Info Content */}
          <main className="flex-1">
            <section className="relative pt-16 pb-20 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-300/30 via-blue-200/20 to-purple-300/30 blur-3xl -z-10 rounded-full pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs sm:text-sm font-semibold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Teacher Exam Prep 2026: NIE, RTTC, PTTC & Kindergarten</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
                  Prepare Smarter for Your <br />
                  <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 bg-clip-text text-transparent">
                    National Teacher Examination
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                  PassKru brings official exam updates, past papers with full solutions, interactive practice quizzes, realistic mock tests, and personalized study plans into one simple platform.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <SignInButton mode="modal">
                    <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition cursor-pointer flex items-center justify-center">
                      Get Started Now
                    </button>
                  </SignInButton>
                </div>
              </div>
            </section>

            {/* Website Features Info Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Official Curriculum</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Centralized registry of verified MoEYS announcements, registration deadlines, required documents, and provincial intake quotas.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Digital Library & Practice</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Thousands of curated questions across pedagogy, psychology, general knowledge, and specialized subjects with instant solution keys.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Personalized Preparation</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Intelligent daily task generators that diagnose your weak subject areas and deliver actionable revision recommendations.
                  </p>
                </div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-slate-200 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
              <p>© {new Date().getFullYear()} PassKru. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </SignedOut>

      {/* 2. SIGNED IN STATE: Unlock full dashboard layout with all features */}
      <SignedIn>
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden selection:bg-indigo-500 selection:text-white animate-fadeIn">
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
      </SignedIn>
    </>
  );
};

export default App;
