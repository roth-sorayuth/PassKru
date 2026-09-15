// Shared page chrome for the library-style pages (announcements, papers,
// practice, mentors): a navy hero, a body that overlaps it, and one
// search + filter-pill bar. Keeping them here keeps those pages identical.
import React from 'react';
import { ArrowLeft, Search, X } from 'lucide-react';

interface PageHeroProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Small chip above the title (e.g. the active exam track). */
  eyebrow?: React.ReactNode;
  /** Buttons under the description. */
  actions?: React.ReactNode;
  back?: { label: string; onClick: () => void };
}

export const PageHero: React.FC<PageHeroProps> = ({ title, description, eyebrow, actions, back }) => (
  <div className="relative overflow-hidden bg-gradient-to-b from-[#0f3360] via-[#0b2446] to-[#0f3360] text-white pt-6 pb-16 px-4 sm:px-6 lg:px-8">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

    <div className="max-w-7xl mx-auto relative z-10">
      {back && (
        <button
          type="button"
          onClick={back.onClick}
          className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold text-white/90 bg-white/10 hover:bg-white/20 border border-white/20 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{back.label}</span>
        </button>
      )}

      <div className="max-w-3xl mx-auto text-center space-y-2.5">
        {eyebrow && (
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-white">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">{title}</h1>
        {description && (
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">{description}</p>
        )}
        {actions && <div className="flex flex-wrap items-center justify-center gap-2 pt-1">{actions}</div>}
      </div>
    </div>
  </div>
);

/** Page content that slides up over the bottom of the hero. */
export const PageBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-6 sm:space-y-8">{children}</div>
);

export const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-full bg-[#f8faff] text-slate-900 pb-20 animate-fadeIn">{children}</div>
);

export interface FilterPill {
  id: string;
  label: string;
}

interface FilterBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  clearSearchLabel: string;
  count?: { icon: React.ElementType; label: string };
  pills?: FilterPill[];
  activePill?: string;
  onPillChange?: (id: string) => void;
  /** Shown as a red "reset" pill while any filter is on. */
  reset?: { label: string; onClick: () => void; visible: boolean };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  query,
  onQueryChange,
  placeholder,
  clearSearchLabel,
  count,
  pills,
  activePill,
  onPillChange,
  reset,
}) => {
  const CountIcon = count?.icon;
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] p-4 sm:p-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="w-full pl-11 pr-10 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-500 bg-slate-50 focus:bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0f3360]/20 focus:border-[#0f3360] transition"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label={clearSearchLabel}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-slate-200/60 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {count && CountIcon && (
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto text-sm font-bold text-slate-600 bg-slate-100/90 px-3.5 py-2.5 rounded-2xl">
            <CountIcon className="w-4 h-4 text-blue-600" />
            <span>{count.label}</span>
          </div>
        )}
      </div>

      {pills && pills.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:none]">
          {pills.map((pill) => {
            const active = activePill === pill.id;
            return (
              <button
                type="button"
                key={pill.id}
                aria-pressed={active}
                onClick={() => onPillChange?.(pill.id)}
                className={`px-4 py-2 rounded-2xl text-sm font-bold whitespace-nowrap transition cursor-pointer border shrink-0 ${
                  active
                    ? 'bg-[#0f3360] text-white border-[#0f3360] shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {pill.label}
              </button>
            );
          })}

          {reset?.visible && (
            <button
              type="button"
              onClick={reset.onClick}
              className="px-3 py-2 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>{reset.label}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/** Heading row above a card grid: title on the left, a quiet count on the right. */
export const SectionHeading: React.FC<{ title: React.ReactNode; meta?: React.ReactNode; action?: React.ReactNode }> = ({
  title,
  meta,
  action,
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-center gap-3 min-w-0">
      <h2 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">{title}</h2>
      {meta && (
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 border border-slate-200 text-slate-600 shrink-0">
          {meta}
        </span>
      )}
    </div>
    {action}
  </div>
);

/** Empty / error block used by every library page. */
export const EmptyState: React.FC<{
  icon: React.ElementType;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  tone?: 'default' | 'error';
}> = ({ icon: Icon, title, description, action, tone = 'default' }) => (
  <div
    className={`p-10 sm:p-12 text-center rounded-3xl border space-y-4 shadow-sm ${
      tone === 'error' ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'
    }`}
  >
    <div
      className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
        tone === 'error' ? 'bg-red-100 text-red-600' : 'bg-[#dfeaf8] text-[#0a3263]'
      }`}
    >
      <Icon className="w-8 h-8" />
    </div>
    <h3 className={`text-lg font-extrabold ${tone === 'error' ? 'text-red-800' : 'text-slate-900'}`}>{title}</h3>
    {description && (
      <p className={`text-sm max-w-md mx-auto leading-relaxed ${tone === 'error' ? 'text-red-700' : 'text-slate-500'}`}>
        {description}
      </p>
    )}
    {action}
  </div>
);

export const PRIMARY_BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f3360] hover:bg-[#0b2446] text-white text-sm font-bold shadow-sm transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed';

export const OUTLINE_BUTTON =
  'inline-flex items-center justify-center gap-1.5 rounded-2xl bg-white hover:bg-slate-50 text-[#0f3360] border border-slate-200 hover:border-slate-300 text-sm font-bold transition cursor-pointer';

export const HERO_BUTTON =
  'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-bold transition border border-white/25 cursor-pointer';
