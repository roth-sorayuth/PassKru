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
          title: 'បង្ហោះវិញ្ញាសា',
          subtitle: 'បង្ហោះឯកសារ PDF វិញ្ញាសាផ្លូវការ និងរក្សាទុកទិន្នន័យក្នុងប្រព័ន្ធ',
        };
      case 'dashboard':
        return {
          title: 'វិញ្ញាសាចាស់ៗ',
          subtitle: 'ស្វែងរក និងគ្រប់គ្រងវិញ្ញាសាប្រឡងផ្លូវការតាមប្រភេទប្រឡង មុខវិជ្ជា និងឆ្នាំ',
        };
      case 'prepare-papers':
        return {
          title: 'វិញ្ញាសាត្រៀម',
          subtitle: 'ស្វែងរក និងគ្រប់គ្រងវិញ្ញាសាអនុវត្តត្រៀមប្រឡងតាមប្រភេទប្រឡង មុខវិជ្ជា និងឆ្នាំ',
        };
      case 'announcements':
        return {
          title: 'សេចក្តីជូនដំណឹងប្រឡង',
          subtitle: 'ផ្សព្វផ្សាយព័ត៌មានប្រឡងផ្លូវការ ការរើសបេក្ខជន និងកាលវិភាគដល់បេក្ខជន',
        };
      case 'users':
        return {
          title: 'គ្រប់គ្រងអ្នកប្រើប្រាស់',
          subtitle: 'គ្រប់គ្រងព័ត៌មានបេក្ខជន ការប្រឡង ដំណើរការសិក្សា និងតួនាទី',
        };
      case 'questions':
        return {
          title: 'ឃ្លាំងសំណួរ',
          subtitle: 'បង្កើត និងគ្រប់គ្រងសំណួរសម្រាប់ប្រើប្រាស់ក្នុង Quiz និងវិញ្ញាសាសាកល្បង',
        };
      case 'mock-exams':
        return {
          title: 'បង្កើតវិញ្ញាសាសាកល្បង',
          subtitle: 'បង្កើតវិញ្ញាសាប្រឡងសាកល្បង និង Quiz អនុវត្ត ព្រមទាំងដាក់បញ្ចូលសំណួរ',
        };
      case 'mentors':
        return {
          title: 'គ្រប់គ្រងគ្រូបង្រៀន',
          subtitle: 'ពិនិត្យ អនុម័ត និងគ្រប់គ្រងព័ត៌មាន និងពាក្យសុំរបស់គ្រូបង្រៀន',
        };
      default:
        return {
          title: 'PassKru Admin',
          subtitle: '',
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
            const clientUrl = (import.meta.env.VITE_CLIENT_URL || `${window.location.protocol}//${window.location.hostname || 'localhost'}:3000`).replace(/\/+$/, '');
            window.location.href = `${clientUrl}/announcements?viewAsUser=true`;
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-normal bg-white text-black hover:bg-slate-100 border border-slate-300 hover:border-black transition shadow-2xs cursor-pointer"
          title="ផ្លាស់ប្តូរទៅផ្ទាំងអ្នកប្រើប្រាស់"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>ផ្ទាំងអ្នកប្រើប្រាស់</span>
        </button>
      </div>
    </header>
  );
};
