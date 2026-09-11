import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Clock, Loader2 } from 'lucide-react';
import { PlacementResult, PlacementSession } from '../../types/aiStudyPlan';
import { savePlacementAnswer, submitPlacement } from '../../services/placementService';
import { CARD, useTr } from './shared';
import { MathText } from '../ui/MathText';

interface Props {
  session: PlacementSession;
  onPause: () => void;
  onSubmitted: (result: PlacementResult) => void;
}

const LETTERS = ['ក', 'ខ', 'គ', 'ឃ', 'ង', 'ច'];

export const PlacementTest: React.FC<Props> = ({ session, onPause, onSubmitted }) => {
  const { tr } = useTr();
  const total = session.questions.length;
  const [answers, setAnswers] = useState<Record<number, number>>(session.savedAnswers || {});
  const [index, setIndex] = useState(() => {
    const firstOpen = session.questions.findIndex((q) => answers[q.questionId] == null);
    return firstOpen < 0 ? 0 : firstOpen;
  });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmUnanswered, setConfirmUnanswered] = useState(false);

  // Countdown is informational: running out never throws answers away.
  const deadline = useMemo(
    () => new Date(session.startedAt).getTime() + session.durationMinutes * 60000,
    [session.startedAt, session.durationMinutes]
  );
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const remaining = Math.max(0, Math.floor((deadline - now) / 1000));
  const clock = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;

  const question = session.questions[index];
  const picked = answers[question.questionId];
  const answeredCount = session.questions.filter((q) => answers[q.questionId] != null).length;
  const isLast = index === total - 1;

  const pick = (optionId: number) => {
    setAnswers((prev) => ({ ...prev, [question.questionId]: optionId }));
    setSaveError(null);
    savePlacementAnswer(session.attemptId, question.questionId, optionId).catch(() =>
      setSaveError(tr('រក្សាទុកចម្លើយមិនបានទេ — វានឹងព្យាយាមម្តងទៀតពេលដាក់ស្នើ។', "Couldn't save that answer — it will be sent again on submit."))
    );
  };

  const submit = async () => {
    const unanswered = total - answeredCount;
    if (unanswered > 0 && !confirmUnanswered) {
      setConfirmUnanswered(true);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Re-send every answer first so a dropped autosave can't cost a point.
      await Promise.all(
        Object.entries(answers).map(([qid, oid]) => savePlacementAnswer(session.attemptId, Number(qid), oid))
      );
      const result = await submitPlacement(session.attemptId);
      onSubmitted(result);
    } catch (err: any) {
      setSubmitError(err?.message || tr('ដាក់ស្នើមិនបានទេ។ សូមព្យាយាមម្តងទៀត។', "Couldn't submit. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-xs font-bold text-slate-500">{tr('តេស្តវាស់កម្រិត', 'Placement test')}</span>
          <h1 className="text-2xl font-extrabold text-[#0a2540]">
            {tr('សំណួរទី', 'Question')} <span className="tabular-nums">{index + 1}</span> {tr('ក្នុងចំណោម', 'of')} {total}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold tabular-nums ${
              remaining === 0 ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-slate-200 bg-white text-slate-600'
            }`}
            aria-live="off"
          >
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            {remaining === 0 ? tr('ហួសពេល — អាចដាក់ស្នើបាន', 'Time up — you can still submit') : `${tr('នៅសល់', 'Left')} ${clock}`}
          </span>
          <button
            type="button"
            onClick={onPause}
            className="px-3.5 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-300 text-xs font-bold transition cursor-pointer"
          >
            {tr('រក្សាទុក និងបន្តពេលក្រោយ', 'Save & finish later')}
          </button>
        </div>
      </div>

      <div
        className="h-1.5 rounded-full bg-slate-100 overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answeredCount}
        aria-label={tr('ចំនួនសំណួរដែលបានឆ្លើយ', 'Questions answered')}
      >
        <div className="h-full rounded-full bg-[#0a3263] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(answeredCount / total) * 100}%` }} />
      </div>

      <section className={`${CARD} p-6 sm:p-8 flex flex-col gap-5`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#eef4fb] text-[#0a3263] text-xs font-bold">{question.subjectName}</span>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">{question.topicName}</span>
        </div>

        <MathText as="h2" className="text-lg sm:text-xl font-semibold leading-relaxed text-[#0a2540] whitespace-pre-line break-words" text={question.questionText} />

        <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={tr('ជម្រើស', 'Options')}>
          {question.options.map((option, i) => {
            const on = picked === option.optionId;
            return (
              <button
                key={option.optionId}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => pick(option.optionId)}
                className={`w-full text-left flex items-center gap-3.5 px-4 py-3.5 min-h-[56px] rounded-2xl border-[1.5px] transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a3263]/40 ${
                  on ? 'border-[#0a3263] bg-[#f4f8fd] shadow-[0_0_0_3px_rgba(10,50,99,0.12)]' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-[13px] font-bold ${
                    on ? 'bg-[#0a3263] text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                  aria-hidden="true"
                >
                  {LETTERS[i] || i + 1}
                </span>
                <span className={`text-[15px] leading-relaxed break-words ${on ? 'font-bold text-[#0a2540]' : 'text-slate-700'}`}><MathText text={option.optionText} /></span>
              </button>
            );
          })}
        </div>

        {saveError && <p className="text-xs font-semibold text-amber-700" role="status">{saveError}</p>}

        {confirmUnanswered && (
          <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
            {tr(
              `អ្នកនៅមិនទាន់ឆ្លើយ ${total - answeredCount} សំណួរ។ ចុច «ដាក់ស្នើ» ម្តងទៀតដើម្បីបញ្ជាក់ — សំណួរដែលមិនឆ្លើយរាប់ថាខុស។`,
              `${total - answeredCount} questions are unanswered. Press Submit again to confirm — unanswered questions count as wrong.`
            )}
          </p>
        )}
        {submitError && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
            {submitError}
          </p>
        )}

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0 || submitting}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-300 text-sm font-bold transition cursor-pointer disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            {tr('សំណួរមុន', 'Previous')}
          </button>
          {isLast ? (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 min-h-[44px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer disabled:opacity-70"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />}
              {submitting ? tr('កំពុងដាក់ស្នើ…', 'Submitting…') : tr('ដាក់ស្នើ', 'Submit')}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
              className="inline-flex items-center gap-2 px-6 py-2.5 min-h-[44px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer"
            >
              {picked == null ? tr('រំលង', 'Skip') : tr('សំណួរបន្ទាប់', 'Next')}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      <p className="text-[13px] text-slate-500 text-center">
        {tr('បានឆ្លើយ', 'Answered')} <span className="tabular-nums font-bold text-slate-700">{answeredCount}</span> / {total} ·{' '}
        {tr('ចម្លើយរក្សាទុកដោយស្វ័យប្រវត្តិ', 'Answers save automatically')}
      </p>
    </div>
  );
};
