import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { KnowledgeLevel, PlanTaskType } from '../../types/aiStudyPlan';

export type Lang = 'km' | 'en';

export const useTr = () => {
  const { lang } = useLanguage();
  const tr = (km: string, en: string) => (lang === 'km' ? km : en);
  return { lang: lang as Lang, tr };
};

/** Everything the AI produced wears the same marker: sparkle + PassKru navy. */
export const AiLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs font-bold text-[#0a3263] ${className}`}>
    <Sparkles className="w-3.5 h-3.5 text-[#486581] shrink-0" aria-hidden="true" />
    {children}
  </span>
);

export const AI_CARD = 'bg-[#f8fbff] border border-[#c9d8ea] rounded-2xl';
export const CARD = 'bg-white border border-slate-200/80 rounded-2xl';

export const TASK_TYPE_META: Record<PlanTaskType, { km: string; en: string; chip: string }> = {
  quiz: { km: 'កម្រងសំណួរ', en: 'Quiz', chip: 'bg-[#eef4fb] text-[#0a3263]' },
  practice: { km: 'អនុវត្ត', en: 'Practice', chip: 'bg-[#0a3263] text-white' },
  paper: { km: 'វិញ្ញាសា', en: 'Paper', chip: 'bg-slate-100 text-slate-700' },
  review: { km: 'ពិនិត្យកំហុស', en: 'Review', chip: 'bg-amber-50 text-amber-800' },
};

export const levelLabel = (level: KnowledgeLevel | null | undefined, lang: Lang) => {
  const labels: Record<KnowledgeLevel, [string, string]> = {
    beginner: ['ទើបចាប់ផ្តើម', 'Beginner'],
    intermediate: ['មធ្យម', 'Intermediate'],
    advanced: ['រឹងមាំ', 'Advanced'],
  };
  const pair = level ? labels[level] : null;
  return pair ? (lang === 'km' ? pair[0] : pair[1]) : '—';
};

/** Dates are plan-calendar days ("2026-05-12"); render them in the app's timezone-free form. */
export const formatDay = (isoDate: string, lang: Lang, options: Intl.DateTimeFormatOptions) => {
  const date = new Date(`${isoDate.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(lang === 'km' ? 'km-KH' : 'en-GB', { timeZone: 'UTC', ...options }).format(date);
};

export const todayIso = () => {
  // Cambodia (UTC+7) calendar day, matching the server's plan dates.
  const now = new Date(Date.now() + 7 * 3600 * 1000);
  return now.toISOString().slice(0, 10);
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const ErrorBox: React.FC<{ message: string; onRetry?: () => void; retryLabel: string }> = ({ message, onRetry, retryLabel }) => (
  <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
    <span className="text-sm font-semibold text-red-700 min-w-0">{message}</span>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="shrink-0 px-4 py-2 rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-xs font-bold transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0a3263]/40"
      >
        {retryLabel}
      </button>
    )}
  </div>
);
