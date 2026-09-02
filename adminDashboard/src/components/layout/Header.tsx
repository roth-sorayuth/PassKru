import React from 'react';
import { Menu, ExternalLink } from 'lucide-react';
import { Tab } from '../../types';

interface HeaderProps {
  tab: Tab;
  setIsMobileMenuOpen: (open: boolean) => void;
  userInitial?: string;
}

export const Header: React.FC<HeaderProps> = ({
  tab,
  setIsMobileMenuOpen,
  userInitial = 'A',
}) => {
  const getTabTitles = () => {
    switch (tab) {
      case 'upload':
        return {
          title: 'Upload Past Paper',
          subtitle: 'Upload official exam PDFs to Supabase Storage and publish metadata to the database',
        };
      case 'dashboard':
        return {
          title: 'Past Papers',
          subtitle: 'Browse and manage official past exam papers organized by exam, subject, and year',
        };
      case 'prepare-papers':
        return {
          title: 'Prepared Papers',
          subtitle: 'Browse and manage preparatory practice papers organized by exam, subject, and year',
        };
      case 'announcements':
        return {
          title: 'Exam Announcements',
          subtitle: 'Broadcast official exams, recruitment, and schedule updates to registered candidates',
        };
      case 'users':
        return {
          title: 'User Management',
          subtitle: 'Manage candidate profiles, exam assignments, study progress, and roles',
        };
    }
  };

  const { title, subtitle } = getTabTitles();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-normal text-black tracking-tight">{title}</h1>
          <p className="text-xs text-slate-500 hidden sm:block font-normal">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            const host = window.location.hostname || 'localhost';
            const protocol = window.location.protocol || 'http:';
            window.location.href = `${protocol}//${host}:3000/announcements?viewAsUser=true`;
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-normal bg-white text-black hover:bg-slate-100 border border-slate-300 hover:border-black transition shadow-2xs cursor-pointer"
          title="Switch to User Dashboard (Port 3000)"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>User Dashboard</span>
        </button>
      </div>
    </header>
  );
};
