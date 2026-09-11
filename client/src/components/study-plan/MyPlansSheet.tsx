import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import { MyPlan } from '../../types/aiStudyPlan';
import { getCategoryConfig, subjectLabel } from '../../data/examSelectionData';
import { ErrorBox, formatDay, levelLabel, useTr } from './shared';

interface Props {
  plans: MyPlan[] | null;
  error: string | null;
  /** planId being switched to, while the request runs. */
  switchingId: number | null;
  onRetry: () => void;
  onContinue: (plan: MyPlan) => void;
  onNewPlan: () => void;
  onClose: () => void;
}

/** Plans are like courses: several can be kept, one is studied at a time. */
export const MyPlansSheet: React.FC<Props> = ({ plans, error, switchingId, onRetry, onContinue, onNewPlan, onClose }) => {
  const { tr, lang } = useTr();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  // The plan being studied first, then paused plans (newest first).
  const current = (plans || []).filter((p) => p.status !== 'archived').sort((a, b) => (a.status === 'active' ? -1 : b.status === 'active' ? 1 : 0));
  const history = (plans || []).filter((p) => p.status === 'archived');
  const hasActive = current.some((p) => p.status === 'active');

  const nameOf = (p: MyPlan) => {
    const track = p.examCode ? getCategoryConfig(p.examCode) : undefined;
    const subjects = p.targetSubjects.map((k) => subjectLabel(k, lang)).join(' + ');
    return { track: track ? tr(track.titleKm, track.titleEn) : tr('ផែនការសិក្សា', 'Study plan'), subjects };
  };

  const statusChip = (p: MyPlan) =>
    p.status === 'active'
      ? { label: tr('កំពុងរៀន', 'Studying'), cls: 'bg-[#0a3263] text-white' }
      : p.status === 'paused'
        ? { label: tr('បានផ្អាក', 'Paused'), cls: 'bg-amber-100 text-amber-900' }
        : p.finished
          ? { label: tr('បានបញ្ចប់', 'Finished'), cls: 'bg-emerald-50 text-emerald-800' }
          : { label: tr('ជំនួសដោយផែនការថ្មី', 'Replaced'), cls: 'bg-slate-100 text-slate-600' };

  const PlanCard: React.FC<{ p: MyPlan }> = ({ p }) => {
    const { track, subjects } = nameOf(p);
    const chip = statusChip(p);
    const pct = p.tasksTotal ? Math.round((p.tasksDone / p.tasksTotal) * 100) : 0;
    const dates = `${formatDay(p.startDate, lang, { day: 'numeric', month: 'short' })} – ${formatDay(p.endDate, lang, { day: 'numeric', month: 'short' })}`;
    const busy = switchingId === p.planId;
    return (
      <li className={`rounded-2xl border p-4 flex flex-col gap-3 ${p.status === 'active' ? 'border-[#0a3263] bg-white' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-bold text-[#0a2540] break-words">{subjects || track}</span>
            <span className="text-xs text-slate-500">
              {track} · {tr(`កម្រិត ${levelLabel(p.level, lang)}`, `Level: ${levelLabel(p.level, lang)}`)}
            </span>
          </div>
          <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold ${chip.cls}`}>{chip.label}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="flex items-baseline justify-between gap-2 text-xs text-slate-600">
            <span>
              {p.weekIndex != null && !p.finished
                ? tr(`សប្តាហ៍ទី ${p.weekIndex + 1} នៃ ${p.totalWeeks}`, `Week ${p.weekIndex + 1} of ${p.totalWeeks}`)
                : dates}
            </span>
            <span className="font-semibold tabular-nums">{tr(`${p.tasksDone}/${p.tasksTotal} កិច្ចការ`, `${p.tasksDone}/${p.tasksTotal} tasks`)}</span>
          </span>
          <span className="h-1.5 rounded-full bg-[#dfeaf8] overflow-hidden" aria-hidden="true">
            <span className="block h-full rounded-full bg-[#0a3263]" style={{ width: `${pct}%` }} />
          </span>
          {p.status === 'paused' && p.pausedAt && (
            <span className="text-xs text-slate-500">
              {tr(`ផ្អាកតាំងពី ${formatDay(p.pausedAt, lang, { day: 'numeric', month: 'long' })}`, `Paused since ${formatDay(p.pausedAt, lang, { day: 'numeric', month: 'long' })}`)}
            </span>
          )}
        </div>

        {p.status === 'paused' && (
          <button
            type="button"
            onClick={() => onContinue(p)}
            disabled={switchingId != null}
            className="self-start inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-[13px] font-bold transition cursor-pointer disabled:opacity-60"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />}
            {tr('បន្តផែនការនេះ', 'Continue this plan')}
          </button>
        )}
      </li>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="my-plans-title"
        className="relative w-full sm:max-w-lg max-h-[90vh] bg-[#f8fafc] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <h2 id="my-plans-title" className="text-base font-bold text-[#0a2540]">{tr('ផែនការរបស់ខ្ញុំ', 'My plans')}</h2>
            <span className="text-xs text-slate-500">{tr('រៀនម្តងមួយផែនការ · ផែនការផ្សេងទៀតរក្សាទុកវឌ្ឍនភាព', 'Study one plan at a time · the others keep their progress')}</span>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={tr('បិទ', 'Close')}
            className="p-2 -mr-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto flex flex-col gap-3">
          {error && <ErrorBox message={error} onRetry={onRetry} retryLabel={tr('ព្យាយាមម្តងទៀត', 'Try again')} />}
          {!plans && !error && (
            <p className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500" aria-live="polite">
              <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />
              {tr('កំពុងទាញយក…', 'Loading…')}
            </p>
          )}

          {plans && (
            <>
              {current.length > 0 ? (
                <ul className="flex flex-col gap-2.5">{current.map((p) => <PlanCard key={p.planId} p={p} />)}</ul>
              ) : (
                <p className="text-[13px] text-slate-500 py-2">{tr('មិនទាន់មានផែនការសកម្ម ឬផ្អាកទេ។', 'No active or paused plans.')}</p>
              )}

              {history.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    aria-expanded={showHistory}
                    onClick={() => setShowHistory((v) => !v)}
                    className="self-start text-[13px] font-bold text-[#0a3263] hover:text-[#12427d] cursor-pointer"
                  >
                    {showHistory ? tr('លាក់ប្រវត្តិ', 'Hide history') : tr(`ប្រវត្តិ (${history.length})`, `History (${history.length})`)}
                  </button>
                  {showHistory && <ul className="flex flex-col gap-2.5">{history.map((p) => <PlanCard key={p.planId} p={p} />)}</ul>}
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-5 py-4 bg-white border-t border-slate-100 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={onNewPlan}
            disabled={switchingId != null}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer disabled:opacity-60"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            {tr('បង្កើតផែនការថ្មី', 'Create a new plan')}
          </button>
          <span className="text-xs text-slate-500 text-center">
            {hasActive
              ? tr('ជ្រើសកម្រិត និងមុខវិជ្ជា រួចធ្វើតេស្ត។ ផែនការបច្ចុប្បន្ននឹងត្រូវផ្អាក ប្រសិនបើមុខវិជ្ជាខុសគ្នា។', 'Choose level and subjects, then take the test. Your current plan is paused if the subjects differ.')
              : tr('ជ្រើសកម្រិត និងមុខវិជ្ជា រួចធ្វើតេស្ត។', 'Choose level and subjects, then take the test.')}
          </span>
        </div>
      </div>
    </div>
  );
};
