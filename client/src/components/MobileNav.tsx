import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp, ActivePage } from '../context/AppContext';
import { LayoutDashboard, BookOpen, Layers, Award, Sparkles, User, HelpCircle } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { lang, t } = useLanguage();
  const { currentPage, setCurrentPage, isLoggedIn } = useApp();

  if (!isLoggedIn) return null;

  const items: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: lang === 'km' ? 'ទំព័រដើម' : 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'learning', label: lang === 'km' ? 'មេរៀន' : 'Learn', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'practice', label: lang === 'km' ? 'អនុវត្ត' : 'Practice', icon: <Layers className="w-5 h-5" /> },
    { id: 'mock-exam', label: lang === 'km' ? 'Mock' : 'Mock', icon: <Award className="w-5 h-5" /> },
    { id: 'study-plan', label: lang === 'km' ? 'ផែនការ' : 'Plan', icon: <Sparkles className="w-5 h-5" /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg safe-area-inset-bottom">
      <div className="flex items-center justify-around">
        {items.map(item => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition cursor-pointer ${
                isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg transition ${isActive ? 'bg-indigo-50 text-indigo-600 scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[11px] leading-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
