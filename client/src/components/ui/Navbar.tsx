import React, { useState, useRef, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp, ActivePage } from '../../context/AppContext';
import { getExamCategoryTag } from '../../data/examSelectionData';
import {
  Menu,
  X,
  Bell,
  Sparkles,
  Layers,
  Award,
  BookOpen,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  Target,
  Home,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const {
    currentPage,
    setCurrentPage,
    userProfile,
    unreadNotificationsCount,
    markAllNotificationsAsRead,
    logoutUser,
  } = useApp();

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [headerBottom, setHeaderBottom] = useState(64);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }
    const updateBottom = () => {
      if (headerRef.current) {
        setHeaderBottom(headerRef.current.getBoundingClientRect().bottom);
      }
    };
    updateBottom();
    document.body.style.overflow = 'hidden';
    window.addEventListener('resize', updateBottom);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', updateBottom);
    };
  }, [isMobileMenuOpen]);

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return lang === 'km' ? 'ផ្ទាំងគ្រប់គ្រងទូទៅ' : 'Dashboard Overview';
      case 'announcements':
      case 'exam-info':
        return lang === 'km' ? 'ព័ត៌មាន & សេចក្តីប្រកាសប្រឡង' : 'Exam Announcements';
      case 'announcement-detail':
        return lang === 'km' ? 'ព័ត៌មានលម្អិតសេចក្តីប្រកាស' : 'Announcement Detail';
      case 'learning':
        return lang === 'km' ? 'បណ្ណាល័យមេរៀន & ឯកសារ' : 'Learning Resources Hub';
      case 'past-papers':
        return lang === 'km' ? 'វិញ្ញាសាចាស់ៗ' : 'Past Exam Papers';
      case 'prepare-papers':
        return lang === 'km' ? 'វិញ្ញាសាត្រៀម' : 'Prepared Papers';
      case 'practice':
        return lang === 'km' ? 'ការហ្វឹកហាត់សំណួរ' : 'Question Practice';
      case 'quiz':
        return lang === 'km' ? 'កម្រងសំណួរតាមប្រធានបទ' : 'Subject Quizzes';
      case 'mock-exam':
        return lang === 'km' ? 'ការប្រឡងសាកល្បង Mock Exam' : 'Mock Exam Simulation';
      case 'flashcards':
        return lang === 'km' ? 'បណ្ណចងចាំ Flashcards' : 'Memory Flashcards';
      case 'study-plan':
        return lang === 'km' ? 'វគ្គសិក្សារបស់ខ្ញុំ' : 'My Course';
      case 'weakness':
        return lang === 'km' ? 'ការវិភាគចំណុចខ្សោយ' : 'Weakness Analysis';
      case 'mentors':
        return lang === 'km' ? 'គ្រូបង្វឹក & គរុសិស្សឆ្នើម' : 'Teacher Mentors';
      case 'notifications':
        return lang === 'km' ? 'ការជូនដំណឹង' : 'Notifications';
      case 'profile':
        return lang === 'km' ? 'គណនី & ការកំណត់' : 'Profile & Settings';
      default:
        return lang === 'km' ? 'PassKru ជាប់គ្រូ' : 'PassKru';
    }
  };

  const navItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: 'announcements', label: lang === 'km' ? 'សេចក្តីប្រកាស' : 'Announcements', icon: <Bell className="w-4 h-4" /> },
    { id: 'dashboard', label: t('navDashboard'), icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'past-papers', label: 'វិញ្ញាសាចាស់ៗ', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'prepare-papers', label: 'វិញ្ញាសាត្រៀម', icon: <Layers className="w-4 h-4" /> },
    { id: 'practice', label: t('navPractice'), icon: <Target className="w-4 h-4" /> },
    { id: 'study-plan', label: t('navStudyPlan'), icon: <Sparkles className="w-4 h-4" /> },
    { id: 'weakness', label: t('navWeakness'), icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'mentors', label: t('navMentors'), icon: <Users className="w-4 h-4" /> },
  ];

  const handleNavClick = (page: ActivePage) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayName =
    user?.fullName ||
    user?.firstName ||
    userProfile?.name ||
    'User';

  const lastName =
    user?.lastName ||
    (displayName ? displayName.trim().split(/\s+/).pop() : '') ||
    displayName ||
    'User';

  const userInitials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header ref={headerRef} className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            onClick={() => handleNavClick(isSignedIn ? 'dashboard' : 'landing')}
            className="flex lg:hidden items-center gap-2.5 cursor-pointer select-none"
          >
            <img
              src="/PassKru.svg"
              alt="PassKru"
              className="h-8 sm:h-9 w-auto shrink-0 object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== window.location.origin + '/PassKru-logo.svg') {
                  target.src = '/PassKru-logo.svg';
                }
              }}
            />
            <span className="font-bold text-lg sm:text-xl text-[#0f3360] tracking-tight">PassKru</span>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <h1 className="font-bold text-base text-slate-900">{getPageTitle()}</h1>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-slate-500 text-sm">
              {lang === 'km' ? `សួស្តី ${lastName}!` : `Welcome back, ${lastName}!`}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-4">

          {!isSignedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('login')}
                className="px-3 py-1.5 text-sm font-bold text-slate-700 hover:text-[#0f3360] bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200 transition cursor-pointer"
              >
                {lang === 'km' ? 'ចូលគណនី' : 'Sign In'}
              </button>
              <button
                onClick={() => setCurrentPage('register')}
                className="px-3 py-1.5 text-sm font-bold text-white bg-[#0f3360] hover:bg-[#0a274c] rounded-xl transition cursor-pointer shadow-xs"
              >
                {lang === 'km' ? 'ចុះឈ្មោះ' : 'Sign Up'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Admin Portal Button */}
              {userProfile?.role === 'admin' && (
                <a
                  href={import.meta.env.VITE_ADMIN_URL || `${window.location.protocol}//${window.location.hostname}:3001`}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-sm font-bold transition shadow-2xs"
                  title="Switch to Admin Dashboard"
                >
                  <span>{lang === 'km' ? 'ផ្ទាំងគ្រប់គ្រង Admin ⚙️' : 'Admin Dashboard ⚙️'}</span>
                </a>
              )}

              {/* Notifications */}
              <button
                onClick={() => {
                  markAllNotificationsAsRead();
                  handleNavClick('notifications');
                }}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                title={t('navNotifications')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              {/* Account avatar + dropdown menu */}
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu((v) => !v)}
                  className="w-9 h-9 rounded-full bg-[#0f3360] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden cursor-pointer ring-2 ring-blue-100 hover:ring-blue-300 transition"
                >
                  {userProfile?.avatar ? (
                    <img src={userProfile.avatar} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    userInitials
                  )}
                </button>

                {showAccountMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowAccountMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-lg z-50 overflow-hidden animate-fadeIn">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">{displayName}</p>
                        <p className="text-sm text-slate-500 truncate">{userProfile?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowAccountMenu(false);
                          handleNavClick('profile');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer text-left"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>{lang === 'km' ? 'គណនី & ការកំណត់' : 'Manage account'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowAccountMenu(false);
                          handleNavClick('landing');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer text-left"
                      >
                        <Home className="w-4 h-4 text-slate-400" />
                        <span>{lang === 'km' ? 'គេហទំព័រដើម' : 'Landing Page'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowAccountMenu(false);
                          logoutUser();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer text-left border-t border-slate-100"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{lang === 'km' ? 'ចាកចេញ' : 'Sign out'}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer overlay over the page */}
      {isMobileMenuOpen && (
        <div
          style={{ top: `${headerBottom}px` }}
          className="fixed inset-x-0 bottom-0 z-50 lg:hidden flex flex-col justify-start animate-fadeIn"
        >
          {/* Backdrop overlay covering the page and bottom navigation */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Card Sheet — Clean white background */}
          <div className="relative bg-white text-slate-900 px-4 pt-3 pb-6 rounded-b-3xl shadow-xl border-b border-slate-200 space-y-3 max-h-[85vh] overflow-y-auto">
            {/* User Profile Card */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#0a3263] flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{displayName}</p>
                  <p className="text-xs text-[#0a3263] font-semibold truncate">
                    {getExamCategoryTag(userProfile?.examCategory || userProfile?.targetExam, lang) || (lang === 'km' ? 'បេក្ខជន' : 'Candidate')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleNavClick('profile')}
                  className="text-sm text-[#0a3263] hover:text-[#12427d] font-bold underline cursor-pointer"
                >
                  {t('navProfile')}
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logoutUser();
                  }}
                  className="text-sm text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                >
                  {lang === 'km' ? 'ចាកចេញ' : 'Sign out'}
                </button>
              </div>
            </div>

            {/* Nav Items Grid */}
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-[#0a3263] text-white shadow-sm border border-[#0a3263]'
                        : 'bg-slate-50 hover:bg-slate-100/90 text-slate-700 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
                    }`}
                  >
                    <div className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                      {item.icon}
                    </div>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};