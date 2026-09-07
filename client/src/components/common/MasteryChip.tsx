import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Mastery states, mirroring server-side masteryService. A topic must read the
 * same on the quiz result screen, the course page and the dashboard — before
 * this, each surface described mastery in its own words (and against its own
 * threshold), so the same topic could look "mastered" in one place and
 * "needs work" in another.
 */
export type MasteryState = 'untouched' | 'learning' | 'developing' | 'proficient' | 'mastered';

export interface MasteryDescriptor {
  state: MasteryState;
  branch: 'strong' | 'weak' | 'unknown';
  label: string;
  labelKm: string;
  proficiency: number | null;
  attemptCount: number | null;
}

const STYLES: Record<MasteryState, string> = {
  untouched: 'bg-slate-50 text-slate-600 border-slate-200',
  learning: 'bg-red-50 text-red-700 border-red-200',
  developing: 'bg-amber-50 text-amber-700 border-amber-200',
  proficient: 'bg-sky-50 text-sky-700 border-sky-200',
  mastered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const LABELS: Record<MasteryState, { en: string; km: string }> = {
  untouched: { en: 'Not started', km: 'មិនទាន់ចាប់ផ្តើម' },
  learning: { en: 'Learning', km: 'កំពុងរៀន' },
  developing: { en: 'Developing', km: 'កំពុងរីកចម្រើន' },
  proficient: { en: 'Proficient', km: 'ស្ទាត់ជំនាញ' },
  mastered: { en: 'Mastered', km: 'ជំនាញពេញលេញ' },
};

export const MasteryChip: React.FC<{
  state: MasteryState;
  proficiency?: number | null;
  size?: 'sm' | 'md';
}> = ({ state, proficiency = null, size = 'md' }) => {
  const { lang } = useLanguage();
  const label = lang === 'km' ? LABELS[state].km : LABELS[state].en;
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold whitespace-nowrap ${pad} ${STYLES[state]}`}
    >
      {label}
      {proficiency !== null && <span className="opacity-70">{proficiency}%</span>}
    </span>
  );
};

export const masteryLabel = (state: MasteryState, lang: string) =>
  lang === 'km' ? LABELS[state].km : LABELS[state].en;
