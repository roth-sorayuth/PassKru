import React, { useState } from 'react';
import { UserButton, useAuth, useUser } from '@clerk/clerk-react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp, ActivePage } from '../../context/AppContext';
import {
  Menu,
  X,
  Sparkles,
  Layers,
  Award,
  BookOpen,
  CalendarDays,
  TrendingUp,
  Users,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const {
    currentPage,
    setCurrentPage,
    userProfile,
    unreadNotificationsCount,
  } = useApp();

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return lang === 'km' ? 'ផ្ទាំងគ្រប់គ្រងទូទៅ' : 'Dashboard Overview';
      case 'exam-info':
        return lang === 'km' ? 'ព័ត៌មាន & សេចក្តីប្រកាសប្រឡង' : 'Exam Announcements';
      case 'announcement-detail':
        return lang === 'km' ? 'ព័ត៌មានលម្អិតសេចក្តីប្រកាស' : 'Announcement Detail';
      case 'requirements':
        return lang === 'km' ? 'លក្ខខណ្ឌ & ឯកសារតម្រូវ' : 'Eligibility & Requirements';
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
        return lang === 'km' ? 'ផែនការសិក្សា AI' : 'AI Study Plan';
      case 'progress':
        return lang === 'km' ? 'របាយការណ៍ការវិវត្ត' : 'Progress & Analytics';
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
    { id: 'dashboard', label: t('navDashboard'), icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'exam-info', label: t('navExamInfo'), icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'past-papers', label: 'វិញ្ញាសាចាស់ៗ', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'prepare-papers', label: 'វិញ្ញាសាត្រៀម', icon: <Layers className="w-4 h-4" /> },
    { id: 'mock-exam', label: t('navMockExam'), icon: <Award className="w-4 h-4" /> },
    { id: 'study-plan', label: t('navStudyPlan'), icon: <Sparkles className="w-4 h-4" /> },
    { id: 'progress', label: t('navProgress'), icon: <TrendingUp className="w-4 h-4" /> },
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

  const userInitials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            onClick={() => handleNavClick(isSignedIn ? 'dashboard' : 'landing')}
            className="flex lg:hidden items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              PK
            </div>
            <span className="font-bold text-base text-slate-900 tracking-tight">PassKru</span>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <h1 className="font-bold text-base text-slate-900">{getPageTitle()}</h1>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-slate-500 text-xs sm:text-sm">
              {lang === 'km' ? `សួស្តី ${displayName}!` : `Welcome back, ${displayName}!`}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-4">

          {!isSignedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('login')}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition cursor-pointer"
              >
                {lang === 'km' ? 'ចូលគណនី' : 'Sign In'}
              </button>
              <button
                onClick={() => setCurrentPage('register')}
                className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer shadow-xs"
              >
                {lang === 'km' ? 'ចុះឈ្មោះ' : 'Sign Up'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Admin Portal Button */}
              {userProfile?.role === 'admin' && (
                <a
                  href={`${window.location.protocol}//${window.location.hostname}:3001`}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition shadow-2xs"
                  title="Open Admin Dashboard in new tab"
                >
                  <span>{lang === 'km' ? 'ផ្ទាំងគ្រប់គ្រង Admin ⚙️' : 'Admin Dashboard ⚙️'}</span>
                </a>
              )}
              {/* Notifications */}
              <button
                onClick={() => handleNavClick('notifications')}
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

              {/* Clerk avatar + Sign out menu */}
              <div className="flex items-center">
                <UserButton afterSignOutUrl="/" />
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

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 text-white px-4 pt-3 pb-6 space-y-2 border-b border-slate-800 animate-fadeIn">
          <div className="p-3 bg-slate-800 rounded-xl mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                {userInitials}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{displayName}</p>
                <p className="text-[10px] text-indigo-300 uppercase">
                  {userProfile?.targetExam || 'Student'}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNavClick('profile')}
              className="text-xs text-indigo-400 font-medium underline"
            >
              {t('navProfile')}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};