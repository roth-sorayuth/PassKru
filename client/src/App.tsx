import React, { useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, useAuth } from '@clerk/clerk-react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';
import { ChevronLeft, ChevronRight, Search, ShoppingCart } from 'lucide-react';

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
        <div className="min-h-screen bg-[#030408] text-white font-sans antialiased flex flex-col selection:bg-red-600 selection:text-white animate-fadeIn">
          {/* TailStore Style Dark Header */}
          <header className="sticky top-0 z-40 bg-[#090b15] border-b border-slate-900 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              {/* Logo: PassKru. TEMPLATE */}
              <div className="flex flex-col items-start cursor-pointer select-none">
                <span className="font-bold text-2xl text-white tracking-tight leading-none flex items-center">
                  PassKru<span className="text-[#ff0000] text-3xl font-extrabold ml-0.5">.</span>
                </span>
                <span className="text-[9px] text-slate-400 font-bold tracking-[0.25em] mt-1.5 uppercase flex items-center gap-1 leading-none">
                  TEMPLATE <span className="w-1.5 h-1.5 bg-[#ff0000]"></span>
                </span>
              </div>

              {/* Navigation Menu: Home, About, Contact */}
              <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
                <a href="#" className="hover:text-white transition">Home</a>
                <a href="#" className="hover:text-white transition">About</a>
                <a href="#" className="hover:text-white transition">Contact</a>
              </nav>

              {/* Buttons and Icons */}
              <div className="flex items-center gap-4">
                <SignUpButton mode="modal">
                  <button className="px-5 py-2 text-xs font-bold text-white bg-[#ff0000] hover:bg-red-700 rounded-full transition cursor-pointer">
                    Register
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="px-5 py-2 text-xs font-bold text-white bg-[#ff0000] hover:bg-red-700 rounded-full transition cursor-pointer">
                    Login
                  </button>
                </SignInButton>
                
                {/* Cart & Search Icons */}
                <div className="flex items-center gap-3 text-slate-300 ml-1">
                  <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-white transition" />
                  <Search className="w-5 h-5 cursor-pointer hover:text-white transition" />
                </div>
              </div>
            </div>
          </header>

          {/* Landing Info Content */}
          <main className="flex-1">
            {/* Hero Slider Section */}
            <section className="relative h-[650px] w-full bg-[#0a0a0c] flex items-center overflow-hidden">
              {/* Watercolor Teacher Image Background */}
              <img 
                src="/teacher.jpg" 
                alt="PassKru Teacher" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-lighten"
              />
              {/* Smooth Dark Gradient Overlays for High Contrast Text */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-black/30" />

              {/* Slider Left Arrow */}
              <button className="absolute left-4 z-20 p-2 text-white/50 hover:text-white transition cursor-pointer">
                <ChevronLeft className="w-12 h-12 stroke-[1.5]" />
              </button>

              {/* Hero Content Overlay */}
              <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full z-10">
                <div className="max-w-2xl space-y-6">
                  <h1 className="text-6xl sm:text-8xl font-bold tracking-tight text-white">
                    PassKru
                  </h1>
                  <p className="text-xl sm:text-2xl text-slate-200 font-light leading-relaxed max-w-xl">
                    centralize everything about teacher examination
                  </p>
                  <div className="pt-4">
                    <SignUpButton mode="modal">
                      <button className="px-8 py-3.5 rounded-full bg-[#ff0000] hover:bg-red-700 text-white font-bold text-sm tracking-wide transition cursor-pointer shadow-lg shadow-red-600/20 uppercase">
                        Shop now
                      </button>
                    </SignUpButton>
                  </div>
                </div>
              </div>

              {/* Slider Right Arrow */}
              <button className="absolute right-4 z-20 p-2 text-white/50 hover:text-white transition cursor-pointer">
                <ChevronRight className="w-12 h-12 stroke-[1.5]" />
              </button>
            </section>
          </main>

          {/* Footer */}
          <footer className="bg-[#090b15] border-t border-slate-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
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
