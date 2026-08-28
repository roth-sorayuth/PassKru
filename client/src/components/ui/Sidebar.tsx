import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp, ActivePage } from '../../context/AppContext';
import {
  Megaphone,
  LayoutGrid,
  GitBranch,
  BookOpen,
  HelpCircle,
  Users,
  User as UserIcon
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { lang } = useLanguage();
  const { currentPage, setCurrentPage, isLoggedIn, userProfile } = useApp();

  const navItems: { id: ActivePage; labelKm: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      id: 'announcements',
      labelKm: 'សេចក្តីប្រកាស',
      labelEn: 'Announcements',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7c-.63 0-1.23.11-1.785.312z" />
        </svg>
      )
    },
    {
      id: 'dashboard',
      labelKm: 'ផ្ទាំងគ្រប់គ្រង',
      labelEn: 'Dashboard',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      id: 'study-plan',
      labelKm: 'ផែនការសិក្សា',
      labelEn: 'Study Plan',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'learning',
      labelKm: 'មេរៀន',
      labelEn: 'Lessons',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: 'mock-exam',
      labelKm: 'ប្រឡងសាកល្បង',
      labelEn: 'Mock Exam',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'mentors',
      labelKm: 'គ្រូបង្វឹក',
      labelEn: 'Mentors',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      )
    },
  ];

  return (
    <aside className="w-64 bg-[#eef4fc] flex flex-col shrink-0 min-h-screen select-none border-r border-[#dbe6f5]">
      {/* Brand Header */}
      <div
        onClick={() => setCurrentPage(isLoggedIn ? 'announcements' : 'landing')}
        className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
      >
        <img src="/PassKru.svg" alt="PassKru" className="h-9 w-auto" onError={(e) => (e.currentTarget.src = '/PassKru.svg')} />
        <span className="text-2xl font-bold tracking-tight text-[#0f3360]">
          PassKru
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer text-left ${
                isActive
                  ? 'bg-[#0a3263] text-white shadow-md'
                  : 'text-[#486581] hover:bg-[#dfeaf8] hover:text-[#0a3263]'
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

      {/* User Profile Card at bottom */}
      <div className="p-4 mt-auto">
        <div
          onClick={() => setCurrentPage('profile')}
          className="bg-[#dce8f8] hover:bg-[#d0e0f5] p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition border border-[#cbdcf2]"
        >
          <div className="w-10 h-10 rounded-full bg-[#0a3263] flex items-center justify-center text-white shrink-0 shadow-sm">
            <UserIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#0a3263] truncate">
              {userProfile.name || 'បេក្ខជនគ្រូ'}
            </p>
            <p className="text-[11px] text-[#627d98] truncate">
              teacher.candidate@passkru.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
