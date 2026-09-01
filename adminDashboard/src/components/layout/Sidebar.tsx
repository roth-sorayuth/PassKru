import React from 'react';
import { Upload, BookOpen, LayoutDashboard, Megaphone, Users, LogOut, X } from 'lucide-react';
import { Tab } from '../../types';

interface SidebarProps {
  tab: Tab;
  setTab: (tab: Tab) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onLogout: () => void;
  userEmail?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  tab,
  setTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onLogout,
  userEmail,
}) => {
  const navItems: { id: Tab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'upload', label: 'Upload Paper', icon: Upload },
    { id: 'dashboard', label: 'Paper Library', icon: LayoutDashboard },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'users', label: 'User Management', icon: Users },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#eef4fc] border-r border-[#dbe6f5] flex flex-col justify-between z-50 transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 flex flex-col h-full">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#dbe6f5]">
            <div className="flex items-center gap-3">
              <img
                src="/PassKru-logo.svg"
                alt="PassKru Logo"
                className="w-9 h-9 object-contain drop-shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/PassKru.svg';
                }}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#0f3360] text-base tracking-tight">PassKru</span>
                  <span className="text-[10px] font-bold bg-[#0a3263] text-white px-1.5 py-0.5 rounded shadow-2xs">ADMIN</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Exam Management Portal</p>
              </div>
            </div>

            {/* Close button on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-white/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#0a3263] text-white shadow-sm'
                      : 'text-[#0f3360] hover:bg-[#dfeaf8] hover:text-[#0a3263]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#0a3263]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Account / Footer Actions */}
          <div className="pt-4 border-t border-[#dbe6f5]">
            <div className="flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-bold text-slate-900 truncate">Admin Account</p>
                <p className="text-[11px] text-slate-500 truncate">{userEmail || 'admin@passkru.com'}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
