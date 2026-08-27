import React, { useEffect, useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/ui/Sidebar';
import { Navbar } from './components/ui/Navbar';
import { MobileNav } from './components/ui/MobileNav';
import { ChevronLeft, ChevronRight, Search, ShoppingCart, X, Eye, EyeOff } from 'lucide-react';

// Pages
import { PublicLandingPage } from './components/pages/PublicLandingPage';
import { LandingPage } from './components/pages/LandingPage';
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
  const {
    currentPage,
    setCurrentPage,
    isLoggedIn,
    isLoading,
    isLoginModalOpen,
    setLoginModalOpen,
    isRegisterModalOpen,
    setRegisterModalOpen,
    loginUser,
    registerUser
  } = useApp();

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainContainer = document.getElementById('main-scroll-container');
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  // Login Modal form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Modal form states
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regError, setRegError] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await loginUser(loginEmail, loginPassword);
      setLoginModalOpen(false);
      setLoginEmail('');
      setLoginPassword('');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    try {
      await registerUser({
        firstName: regFirstName,
        lastName: regLastName,
        email: regEmail,
        password: regPassword,
        phoneNumber: regPhone
      });
      setRegisterModalOpen(false);
      setRegFirstName('');
      setRegLastName('');
      setRegEmail('');
      setRegPassword('');
      setRegPhone('');
    } catch (err: any) {
      setRegError(err.message || 'Registration failed. Please check your fields.');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
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
      {/* 1. GUEST STATE: Render a pure info-only landing page (no sidebar, no internal features) */}
      {!isLoggedIn ? (
        <PublicLandingPage />
      ) : (
        /* 2. SIGNED IN STATE: Unlock full dashboard layout with all features */
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
      )}

      {/* 3. CUSTOM SIGN IN MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 text-white">
            <button
              onClick={() => { setLoginModalOpen(false); setLoginError(''); }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400 text-sm mb-6">Enter your credentials to access your study hub.</p>

            {loginError && (
              <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] transition pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#ff0000] hover:bg-red-700 font-bold text-sm tracking-wide text-white transition shadow-lg shadow-red-600/10 uppercase cursor-pointer"
              >
                Sign In
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                onClick={() => { setLoginModalOpen(false); setRegisterModalOpen(true); setLoginError(''); }}
                className="text-[#ff0000] font-bold hover:underline bg-transparent border-none cursor-pointer"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      )}

      {/* 4. CUSTOM SIGN UP MODAL */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 text-white">
            <button
              onClick={() => { setRegisterModalOpen(false); setRegError(''); }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Create Account</h2>
            <p className="text-slate-400 text-sm mb-6">Join PassKru to boost your teacher exam preparation.</p>

            {regError && (
              <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                {regError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    required
                    placeholder="John"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    required
                    placeholder="Doe"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] transition pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+855 123 456"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#ff0000] hover:bg-red-700 font-bold text-sm tracking-wide text-white transition shadow-lg shadow-red-600/10 uppercase cursor-pointer"
              >
                Sign Up
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <button
                onClick={() => { setRegisterModalOpen(false); setLoginModalOpen(true); setRegError(''); }}
                className="text-[#ff0000] font-bold hover:underline bg-transparent border-none cursor-pointer"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
