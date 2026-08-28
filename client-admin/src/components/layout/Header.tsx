import React, { useState } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { 
  AdminTab 
} from '../../types';
import { 
  Menu, 
  Search, 
  Plus, 
  ShieldAlert, 
  Languages, 
  Bell, 
  HelpCircle, 
  GraduationCap, 
  Megaphone,
  FileText,
  BookOpen,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onToggleMobileSidebar?: () => void;
  onSelectTab?: (tab: AdminTab) => void;
  pendingCount?: number;
  showEnglishLabels: boolean;
  onToggleEnglishLabels: () => void;
  onQuickAction?: (type: string) => void;
  onOpenQuickCreate?: (type?: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onToggleMobileSidebar,
  onSelectTab,
  pendingCount = 0,
  showEnglishLabels,
  onToggleEnglishLabels,
  onQuickAction,
  onOpenQuickCreate,
  searchQuery = '',
  onSearchChange,
}) => {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleToggle = onToggleSidebar || onToggleMobileSidebar || (() => {});
  const handleAction = (type: string) => {
    if (onQuickAction) onQuickAction(type);
    if (onOpenQuickCreate) onOpenQuickCreate(type);
  };

  const handleSearch = (val: string) => {
    setLocalSearch(val);
    if (onSearchChange) onSearchChange(val);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0D0F12]/85 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={handleToggle}
          className="p-2 rounded-xl text-[#8E929E] hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A5E6B]" />
          <input
            type="text"
            value={onSearchChange ? searchQuery : localSearch}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="ស្វែងរកបេក្ខជន, វិញ្ញាសា, សំណួរ, សេចក្តីជូនដំណឹង... (Ctrl + K)"
            className="w-full pl-10 pr-4 py-2 bg-[#111317] hover:bg-[#15181F] focus:bg-[#13161C] text-sm text-white placeholder-[#5A5E6B] rounded-xl border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none"
          />
          {(onSearchChange ? searchQuery : localSearch) && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8E929E] hover:text-white font-bold"
            >
              សម្អាត
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions, Badges & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Verification Alert Pill */}
        {pendingCount > 0 && onSelectTab && (
          <button
            onClick={() => onSelectTab('verification-center')}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-98"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>
              <span className="font-bold text-amber-300">{pendingCount}</span> រង់ចាំផ្ទៀងផ្ទាត់
            </span>
          </button>
        )}

        {/* English Helper Mode Toggle */}
        <button
          onClick={onToggleEnglishLabels}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showEnglishLabels
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-2xs'
              : 'bg-[#16191E] border-white/10 text-[#8E929E] hover:bg-[#1F232B] hover:text-white'
          }`}
          title="បើក/បិទ ការបង្ហាញអក្សរអង់គ្លេសជំនួយ (Toggle English helper subtitles)"
        >
          <Languages className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{showEnglishLabels ? 'EN បើក' : 'EN បិទ'}</span>
        </button>

        {/* Quick Add Menu */}
        <div className="relative">
          <button
            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">បង្កើតថ្មី</span>
          </button>

          {isCreateMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsCreateMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-[#111317] rounded-2xl shadow-2xl border border-white/10 py-2 z-40 animate-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#5A5E6B] uppercase tracking-wider">
                  បន្ថែមមាតិកាថ្មី / Create New
                </div>
                <button
                  onClick={() => {
                    setIsCreateMenuOpen(false);
                    handleAction('question');
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#E0E0E0] hover:bg-white/5 hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <div>សំណួរថ្មីក្នុងធនាគារ</div>
                    <div className="text-[10px] text-[#8E929E] font-normal">New Question with Explanation</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIsCreateMenuOpen(false);
                    handleAction('exam');
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#E0E0E0] hover:bg-white/5 hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <div>ព័ត៌មានប្រឡងគ្រូជាតិថ្មី</div>
                    <div className="text-[10px] text-[#8E929E] font-normal">National Teacher Exam Details</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIsCreateMenuOpen(false);
                    handleAction('announcement');
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#E0E0E0] hover:bg-white/5 hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <Megaphone className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div>សេចក្តីជូនដំណឹង / ប្រកាសក្រសួង</div>
                    <div className="text-[10px] text-[#8E929E] font-normal">Official MoEYS Announcement</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIsCreateMenuOpen(false);
                    handleAction('material');
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#E0E0E0] hover:bg-white/5 hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div>វិញ្ញាសាចាស់ ឬឯកសាររៀន</div>
                    <div className="text-[10px] text-[#8E929E] font-normal">Past Paper or PDF Material</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIsCreateMenuOpen(false);
                    handleAction('mock');
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#E0E0E0] hover:bg-white/5 hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <div>វិញ្ញាសាសាកល្បងថ្មី (Mock Exam)</div>
                    <div className="text-[10px] text-[#8E929E] font-normal">Full Mock Exam Set</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
            className="p-2 rounded-xl text-[#8E929E] hover:text-white hover:bg-white/5 relative transition-colors"
            title="ការជូនដំណឹងប្រព័ន្ធ"
          >
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-[#0D0F12]"></span>
          </button>

          {isNotifMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsNotifMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-[#111317] rounded-2xl shadow-2xl border border-white/10 p-3 z-40 animate-in zoom-in-95 duration-150 text-[#E0E0E0]">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-xs font-bold text-white">ការជូនដំណឹងរដ្ឋបាលថ្មីៗ</span>
                  <span className="text-[10px] text-indigo-400 font-semibold cursor-pointer hover:underline">សម្គាល់ថាបានអាន</span>
                </div>
                <div className="divide-y divide-white/5 py-1 max-h-72 overflow-y-auto">
                  <div className="py-2.5 px-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                      <div>
                        <p className="text-xs font-bold text-white">មានសំណើផ្ទៀងផ្ទាត់គ្រូបង្វឹកថ្មី</p>
                        <p className="text-[11px] text-[#8E929E]">អ្នកគ្រូ លីនដា ឈឹម បានដាក់ស្នើសញ្ញាបត្រ NIE</p>
                        <span className="text-[10px] text-[#5A5E6B]">30 នាទីមុន</span>
                      </div>
                    </div>
                  </div>
                  <div className="py-2.5 px-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                      <div>
                        <p className="text-xs font-bold text-white">បេក្ខជន ១២០ នាក់បានចុះឈ្មោះថ្ងៃនេះ</p>
                        <p className="text-[11px] text-[#8E929E]">ភាគច្រើនជាបេក្ខជនប្រឡងគ្រូ NIE</p>
                        <span className="text-[10px] text-[#5A5E6B]">2 ម៉ោងមុន</span>
                      </div>
                    </div>
                  </div>
                </div>
                {onSelectTab && (
                  <button
                    onClick={() => {
                      setIsNotifMenuOpen(false);
                      onSelectTab('notifications');
                    }}
                    className="w-full mt-2 py-1.5 text-center text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl transition-colors"
                  >
                    គ្រប់គ្រងការផ្ញើសារជូនដំណឹង
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        {/* Link to Candidate Portal */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-white/10 transition shadow-2xs"
          title="Open Candidate Portal"
        >
          <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
          <span>ទំព័របេក្ខជន (Candidate App)</span>
        </a>

        {/* Clerk User Avatar */}
        <div className="flex items-center pl-1">
          <UserButton afterSignOutUrl="http://localhost:3000" />
        </div>
      </div>
    </header>
  );
};
