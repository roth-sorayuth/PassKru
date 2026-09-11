import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Loader2 } from 'lucide-react';
import { WeeklyUpdate } from '../../types/aiStudyPlan';
import { decideWeeklyUpdate, getWeeklyUpdate } from '../../services/studyPlanService';
import { AI_CARD, AiLabel, formatDay, useTr } from './shared';

interface Props {
  /** Called after a decision so the plan can reload next week's tasks. */
  onDecided: () => void;
}

/** The AI's Saturday proposal for next week. Renders nothing when there is none. */
export const WeeklyUpdateCard: React.FC<Props> = ({ onDecided }) => {
  const { tr, lang } = useTr();
  const [update, setUpdate] = useState<WeeklyUpdate | null>(null);
  const [busy, setBusy] = useState<'accept' | 'keep' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getWeeklyUpdate()
      .then((u: WeeklyUpdate | null) => alive && setUpdate(u))
      .catch(() => alive && setUpdate(null)); // optional card — a failure just hides it
    return () => {
      alive = false;
    };
  }, []);

  if (!update || update.status !== 'pending') return null;

  const decide = async (decision: 'accept' | 'keep') => {
    setBusy(decision);
    setError(null);
    try {
      const next: WeeklyUpdate = await decideWeeklyUpdate(update.updateId, decision);
      setUpdate(next);
      onDecided();
    } catch (err: any) {
      setError(err?.message || tr('រក្សាទុកមិនបានទេ។', "Couldn't save that."));
    } finally {
      setBusy(null);
    }
  };

  const kindStyle = { add: 'bg-emerald-50 text-emerald-700', cut: 'bg-red-50 text-red-700', tune: 'bg-slate-100 text-slate-700' } as const;
  const kindMark = { add: '+', cut: '−', tune: '=' } as const;

  return (
    <section className={`${AI_CARD} p-5 sm:p-6 flex flex-col gap-4`} aria-labelledby="weekly-update-title">
      <div className="flex flex-col gap-1">
        <AiLabel>{tr('ក្រោយការពិនិត្យកំហុស', 'After the mistake review')}</AiLabel>
        <h2 id="weekly-update-title" className="text-lg font-extrabold text-[#0a2540] text-balance">
          {tr(`AI បានកែសប្តាហ៍ទី ${update.weekIndex + 1} តាមអ្វីដែលអ្នករៀនសប្តាហ៍នេះ`, `The AI adjusted week ${update.weekIndex + 1} from what you learned this week`)}
        </h2>
        <p className="text-[13px] text-slate-500">{update.basis}</p>
      </div>

      {update.findings.length > 0 && (
        <ul className="flex flex-col">
          {update.findings.map((f, i) => {
            const up = f.after >= f.before;
            return (
              <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-center py-3 border-t border-[#dfeaf8]">
                <span className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-[#0a2540]">
                    {f.topicName} <span className="font-medium text-xs text-slate-500">· {f.subjectName}</span>
                  </span>
                  <span className="text-[13px] text-slate-600 leading-relaxed">{f.note}</span>
                </span>
                <span className="flex items-center gap-2 tabular-nums">
                  <span className="text-[13px] text-slate-500">{f.before}%</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
                  <span className="text-base font-bold text-[#0a2540]">{f.after}%</span>
                  <span className={`inline-flex items-center text-xs font-bold ${up ? 'text-emerald-700' : 'text-red-700'}`}>
                    {up ? <ArrowUp className="w-3 h-3" aria-hidden="true" /> : <ArrowDown className="w-3 h-3" aria-hidden="true" />}
                    {Math.abs(f.after - f.before)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {update.pattern && (
        <p className="flex items-start gap-2 text-[13px] text-slate-700 leading-relaxed">
          <span className="px-2 py-0.5 rounded-md bg-[#eef4fb] text-[#0a3263] text-xs font-bold shrink-0">{tr('លំនាំ', 'Pattern')}</span>
          {update.pattern}
        </p>
      )}

      {update.changes.length > 0 && (
        <div className="rounded-xl bg-white border border-slate-200 px-4">
          <h3 className="text-sm font-bold text-[#0a2540] pt-3 pb-1">{tr('ការផ្លាស់ប្តូរសម្រាប់សប្តាហ៍ក្រោយ', 'Changes for next week')}</h3>
          <ul>
            {update.changes.map((c, i) => (
              <li key={i} className="flex gap-3 py-3 border-t border-slate-100 first:border-t-0">
                <span className={`w-6 h-6 rounded-md shrink-0 flex items-center justify-center text-sm font-bold ${kindStyle[c.kind]}`} aria-hidden="true">
                  {kindMark[c.kind]}
                </span>
                <span className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="text-sm font-bold text-slate-800">{c.what}</span>
                    <span className="text-[13px] text-slate-500 tabular-nums">{c.detail}</span>
                  </span>
                  <span className="text-[13px] text-[#0a3263] leading-relaxed">{c.why}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p role="alert" className="text-[13px] font-semibold text-red-700">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => decide('accept')}
          disabled={!!busy}
          className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer disabled:opacity-70"
        >
          {busy === 'accept' && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />}
          {tr('យល់ព្រម', 'Accept')}
        </button>
        <button
          type="button"
          onClick={() => decide('keep')}
          disabled={!!busy}
          className="text-[13px] font-semibold text-slate-500 underline underline-offset-4 hover:text-slate-800 cursor-pointer disabled:opacity-50"
        >
          {busy === 'keep' ? tr('កំពុងរក្សាទុក…', 'Saving…') : tr('រក្សាផែនការដើម', 'Keep the original plan')}
        </button>
        <span className="text-xs text-slate-500">
          {tr(
            `បើមិនជ្រើស ការផ្លាស់ប្តូរចូលជាធរមាន ${formatDay(update.autoApplyAt, lang, { weekday: 'long' })}។`,
            `If you do nothing, the changes apply on ${formatDay(update.autoApplyAt, lang, { weekday: 'long' })}.`
          )}
        </span>
      </div>
    </section>
  );
};
