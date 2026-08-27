import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp, ActivePage } from '../context/AppContext';
import {
  TrendingUp,
  BookOpen,
  Layers,
  Award,
  Users,
  CalendarDays,
  Sparkles,
  FileCheck2,
  FileText,
  ShieldCheck,
  LifeBuoy,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { lang, t } = useLanguage();
  const { currentPage, setCurrentPage, isLoggedIn, setIsLoggedIn, userProfile } = useApp();

  const navItems: { id: ActivePage; labelEn: string; labelKm: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      labelEn: 'Dashboard',
      labelKm: 'ផ្ទាំងគ្រប់គ្រង',
      icon: (
        <svg className="w-5 h-5 opacity-90 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      id: 'exam-info',
      labelEn: 'Exam Info',
      labelKm: 'ព័ត៌មានប្រឡង',
      icon: <CalendarDays className="w-5 h-5 opacity-90 shrink-0" />
    },
    {
      id: 'learning',
      labelEn: 'Learning',
      labelKm: 'ការរៀនសូត្រ',
      icon: (
        <svg className="w-5 h-5 opacity-90 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: 'practice',
      labelEn: 'Practice',
      labelKm: 'ការអនុវត្ត',
      icon: (
        <svg className="w-5 h-5 opacity-90 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    },
    {
      id: 'past-papers',
      labelEn: 'Past Papers',
      labelKm: 'វិញ្ញាសាចាស់ៗ',
      icon: <FileText className="w-5 h-5 opacity-90 shrink-0" />
    },
    {
      id: 'mock-exam',
      labelEn: 'Mock Exam',
      labelKm: 'ការប្រឡងសាក',
      icon: (
        <svg className="w-5 h-5 opacity-90 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'flashcards',
      labelEn: 'Flashcards',
      labelKm: 'បណ្ណចងចាំ',
      icon: <Sparkles className="w-5 h-5 opacity-90 shrink-0" />
    },
    {
      id: 'study-plan',
      labelEn: 'Study Plan',
      labelKm: 'ផែនការសិក្សា',
      icon: <FileCheck2 className="w-5 h-5 opacity-90 shrink-0" />
    },
    {
      id: 'progress',
      labelEn: 'Progress',
      labelKm: 'ការវិវត្ត',
      icon: <TrendingUp className="w-5 h-5 opacity-90 shrink-0" />
    },
    {
      id: 'mentors',
      labelEn: 'Mentors',
      labelKm: 'គ្រូណែនាំ',
      icon: (
        <svg className="w-5 h-5 opacity-90 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 min-h-screen select-none border-r border-slate-800">
      {/* Brand Header */}
      <div
        onClick={() => setCurrentPage(isLoggedIn ? 'dashboard' : 'landing')}
        className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-95 transition"
      >
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-extrabold text-white text-lg shadow-md shadow-indigo-600/30">
          PK
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
            PassKru
          </span>
          <span className="text-xs block text-slate-400 font-medium">
            {lang === 'km' ? 'ផាសគ្រូ • ប្រឡងគ្រូ ២០២៦' : 'Teacher Exam Prep'}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {(userProfile?.role === 'admin' 
          ? navItems.filter(item => item.id === 'past-papers') 
          : navItems
        ).map(item => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer text-left ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="truncate">
                {lang === 'km' ? item.labelKm : item.labelEn}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Support / Quick Help card */}
      {userProfile?.role !== 'admin' && (
        <div className="mt-auto p-4 border-t border-slate-800">
          <div className="bg-slate-800/80 rounded-xl p-3.5 text-center border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <LifeBuoy className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'km' ? 'ជំនួយ & ការគាំទ្រ' : 'Support ជំនួយ'}</span>
            </div>
            <button
              onClick={() => setCurrentPage('requirements')}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              {lang === 'km' ? 'លក្ខខណ្ឌដាក់ពាក្យ' : 'Help & Eligibility'}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
