import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { TopicMasteryData, MasteryStateName } from '../../types/dashboard';
import { MasteryChip } from '../common/MasteryChip';
import { Brain, TrendingUp, AlertTriangle, CalendarClock } from 'lucide-react';

/**
 * The Topic Mastery node of the learning loop, which previously had nowhere
 * to live: the dashboard only ever showed weak areas, so the system appeared
 * to do nothing but find fault, and "mastered" was a binary the candidate
 * could never see the shape of.
 */

const BAR_COLORS: Record<MasteryStateName, string> = {
  untouched: 'bg-slate-300',
  learning: 'bg-red-500',
  developing: 'bg-amber-500',
  proficient: 'bg-sky-500',
  mastered: 'bg-emerald-500',
};

const ORDER: MasteryStateName[] = ['mastered', 'proficient', 'developing', 'learning', 'untouched'];

const LABELS: Record<MasteryStateName, { en: string; km: string }> = {
  untouched: { en: 'Not started', km: 'មិនទាន់ចាប់ផ្តើម' },
  learning: { en: 'Learning', km: 'កំពុងរៀន' },
  developing: { en: 'Developing', km: 'កំពុងរីកចម្រើន' },
  proficient: { en: 'Proficient', km: 'ស្ទាត់ជំនាញ' },
  mastered: { en: 'Mastered', km: 'ជំនាញពេញលេញ' },
};

export const TopicMasteryCard: React.FC<{
  data: TopicMasteryData;
  onReviewWeak?: () => void;
}> = ({ data, onReviewWeak }) => {
  const { lang } = useLanguage();
  const { counts, total, strongTopics, pacing } = data;

  // With no syllabus topics there is nothing to describe — an empty bar and
  // five zeroes would just be noise.
  if (!total) return null;

  const strongCount = counts.mastered + counts.proficient;
  const weakCount = counts.learning + counts.developing;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#0a3263]" />
          {lang === 'km' ? 'កម្រិតជំនាញតាមមេរៀន' : 'Topic mastery'}
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          {total} {lang === 'km' ? 'មេរៀន' : 'topics'}
        </span>
      </div>

      {/* Stacked distribution — one bar, five states, in mastery order. */}
      <div className="space-y-2">
        <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100">
          {ORDER.map((state) =>
            counts[state] > 0 ? (
              <div
                key={state}
                className={BAR_COLORS[state]}
                style={{ width: `${(counts[state] / total) * 100}%` }}
                title={`${LABELS[state][lang === 'km' ? 'km' : 'en']}: ${counts[state]}`}
              />
            ) : null
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {ORDER.filter((s) => counts[s] > 0).map((state) => (
            <span key={state} className="inline-flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className={`w-2 h-2 rounded-full ${BAR_COLORS[state]}`} />
              {LABELS[state][lang === 'km' ? 'km' : 'en']}
              <span className="font-bold text-slate-800">{counts[state]}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Both sides of the fork, side by side. */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {lang === 'km' ? 'រឹងមាំ' : 'Strong'}
          </p>
          <p className="text-2xl font-black text-emerald-800 mt-1">{strongCount}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {lang === 'km' ? 'ត្រូវពង្រឹង' : 'Needs work'}
          </p>
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-2xl font-black text-amber-800 mt-1">{weakCount}</p>
            {weakCount > 0 && onReviewWeak && (
              <button
                type="button"
                onClick={onReviewWeak}
                className="text-[11px] font-bold text-amber-800 hover:underline cursor-pointer"
              >
                {lang === 'km' ? 'ត្រួតពិនិត្យ' : 'Review'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Strongest topics — the Continue half of the fork, which the UI has
          never shown. */}
      {strongTopics.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            {lang === 'km' ? 'មេរៀនរឹងមាំបំផុត' : 'Your strongest topics'}
          </p>
          {strongTopics.map((t) => (
            <div key={t.topicId} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{t.topic}</p>
                <p className="text-[11px] text-slate-500 truncate">{t.subject}</p>
              </div>
              <MasteryChip state={t.state} proficiency={t.proficiency} size="sm" />
            </div>
          ))}
        </div>
      )}

      {/* Pacing: the countdown and the remaining syllabus, finally compared. */}
      {pacing && (
        <div
          className={`rounded-xl border p-3 flex items-start gap-2 ${
            pacing.onTrack
              ? 'border-sky-200 bg-sky-50/60 text-sky-800'
              : 'border-red-200 bg-red-50/60 text-red-800'
          }`}
        >
          <CalendarClock className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            {pacing.topicsRemaining === 0
              ? lang === 'km'
                ? 'អ្នកបានគ្របដណ្តប់មេរៀនទាំងអស់រួចហើយ។'
                : "You've covered every topic in your syllabus."
              : lang === 'km'
              ? `នៅសល់ ${pacing.topicsRemaining} មេរៀន ក្នុងរយៈពេល ${pacing.daysLeft} ថ្ងៃ — ប្រហែល ${pacing.topicsPerDay} មេរៀន/ថ្ងៃ។`
              : `${pacing.topicsRemaining} topics left in ${pacing.daysLeft} days — about ${pacing.topicsPerDay} topics a day.`}
          </p>
        </div>
      )}
    </div>
  );
};
