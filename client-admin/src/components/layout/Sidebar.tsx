import React from 'react';
import { 
  AdminTab 
} from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Megaphone, 
  FileText, 
  HelpCircle, 
  Layers, 
  FileCheck2, 
  ShieldCheck, 
  Bell, 
  BarChart3, 
  Sparkles,
  BookOpenCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  activeTab?: AdminTab;
  currentTab?: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  pendingVerificationsCount: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  showEnglishLabels: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  currentTab,
  onSelectTab,
  pendingVerificationsCount,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile = () => {},
  showEnglishLabels,
}) => {
  const selectedTab = activeTab || currentTab || 'dashboard';

  const navItems: {
    id: AdminTab;
    labelKhmer: string;
    labelEn: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', labelKhmer: 'ផ្ទាំងគ្រប់គ្រងទូទៅ', labelEn: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'verification-center', labelKhmer: 'មជ្ឈមណ្ឌលផ្ទៀងផ្ទាត់', labelEn: 'Verification Center', icon: ShieldCheck, badge: pendingVerificationsCount, badgeColor: 'bg-amber-500 text-slate-950 font-bold animate-pulse' },
    { id: 'exams', labelKhmer: 'ការប្រឡងគ្រូថ្នាក់ជាតិ', labelEn: 'National Teacher Exams', icon: GraduationCap },
    { id: 'question-bank', labelKhmer: 'ធនាគារសំណួរ', labelEn: 'Question Bank', icon: HelpCircle },
    { id: 'materials', labelKhmer: 'វិញ្ញាសាចាស់ៗ & ឯកសារ', labelEn: 'Past Papers & Resources', icon: FileText },
    { id: 'mock-exams', labelKhmer: 'វិញ្ញាសាសាកល្បង', labelEn: 'Mock Examinations', icon: FileCheck2 },
    { id: 'quizzes-flashcards', labelKhmer: 'កម្រងសំណួរ & Flashcards', labelEn: 'Quizzes & Flashcards', icon: Layers },
    { id: 'announcements', labelKhmer: 'សេចក្តីជូនដំណឹង & ក្រសួង', labelEn: 'Official Announcements', icon: Megaphone },
    { id: 'users', labelKhmer: 'បេក្ខជន & គ្រូបង្វឹក', labelEn: 'Candidates & Mentors', icon: Users },
    { id: 'notifications', labelKhmer: 'ការជូនដំណឹងទៅបេក្ខជន', labelEn: 'Push Notifications', icon: Bell },
    { id: 'analytics', labelKhmer: 'របាយការណ៍ & ស្ថិតិ', labelEn: 'Reports & Analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`sticky top-0 h-screen z-40 bg-[#0D0F12] text-[#E0E0E0] flex flex-col border-r border-white/5 shrink-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${isMobileOpen ? 'translate-x-0' : 'max-lg:fixed max-lg:top-0 max-lg:bottom-0 max-lg:-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Logo & Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-amber-500/20 shrink-0">
              <BookOpenCheck className="w-6 h-6 text-slate-950" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-koulen text-xl tracking-wider text-white">ប៉ាសគ្រូ</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.2 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30">Admin</span>
                </div>
                <p className="text-[10px] text-[#8E929E] font-medium truncate max-w-[150px]">
                  PassKru Teacher Exam Admin
                </p>
              </div>
            )}
          </div>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 text-[#8E929E] hover:text-white hover:bg-white/5 rounded-lg transition-colors hidden lg:block"
              title={isCollapsed ? 'ពង្រីកមឺនុយ' : 'បង្រួមមឺនុយ'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#5A5E6B]">
              មឺនុយចាត់ចែងប្រព័ន្ធ / Navigation
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                title={isCollapsed ? item.labelKhmer : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-2.5'} rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-[#8E929E] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} min-w-0`}>
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-slate-950 font-bold' : 'text-[#8E929E] group-hover:text-amber-400'
                    }`}
                  />
                  {!isCollapsed && (
                    <div className="text-left truncate">
                      <div className="truncate text-[13px] leading-tight">{item.labelKhmer}</div>
                      {showEnglishLabels && (
                        <div className={`text-[10px] truncate ${isActive ? 'text-slate-900 font-semibold' : 'text-[#5A5E6B]'}`}>
                          {item.labelEn}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!isCollapsed && (
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-slate-950 text-amber-400' : item.badgeColor || 'bg-amber-500 text-slate-950'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-4 h-4 text-slate-950" />}
                  </div>
                )}

                {/* Collapsed badge indicator dot */}
                {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* AI & Context Helper Card in Sidebar */}
        {!isCollapsed && (
          <div className="p-3 m-3 rounded-2xl bg-[#111317] border border-white/5 text-[#8E929E] shadow-inner">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">ប្រព័ន្ធឆ្លាតវៃ PassKru AI</span>
            </div>
            <p className="text-[11px] text-[#8E929E] leading-relaxed">
              ជំនួយការ AI ពិនិត្យភាពសុក្រឹតនៃសំណួរ និងបង្កើតការពន្យល់គរុកោសល្យស្វ័យប្រវត្តិ។
            </p>
          </div>
        )}

        {/* User / Session Footer */}
        <div className="p-3 border-t border-white/5 flex items-center gap-3 bg-[#0A0B0D]">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
            CS
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">ចាន់ សុភា</p>
              <p className="text-[10px] text-amber-400/90 truncate font-medium">អភិបាលជាន់ខ្ពស់ MoEYS</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
