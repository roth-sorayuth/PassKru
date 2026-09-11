import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Info, Loader2, X } from 'lucide-react';
import { ReviewMistake, WeeklyReview as WeeklyReviewData, WeeklyReviewResult } from '../../types/aiStudyPlan';
import { getWeeklyReview, submitWeeklyReview } from '../../services/studyPlanService';
import { CARD, ErrorBox, formatDay, useTr } from './shared';
import { MathText } from '../ui/MathText';

interface Props {
  onBack: () => void;
}

const LETTERS = ['ក', 'ខ', 'គ', 'ឃ', 'ង', 'ច'];

/** Deterministic shuffle so re-answering tests the content, not the position. */
const shuffled = <T,>(items: T[], seed: number) => {
  const arr = [...items];
  let s = seed || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Saturday review: the candidate's own wrong answers from this week's quizzes
 * and practice. First read them (your answer, correct answer, explanation),
 * then answer them again.
 */
export const WeeklyReview: React.FC<Props> = ({ onBack }) => {
  const { tr, lang } = useTr();
  const [review, setReview] = useState<WeeklyReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'read' | 'redo' | 'done'>('read');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<WeeklyReviewResult | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setReview(await getWeeklyReview());
    } catch (err: any) {
      setError(err?.message || tr('ទាញយកកំហុសមិនបានទេ។', "Couldn't load your mistakes."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mistakes = review?.mistakes || [];
  const current: ReviewMistake | undefined = mistakes[index];
  const redoOptions = useMemo(() => (current ? shuffled(current.options, current.questionId) : []), [current]);

  const finish = async () => {
    setSubmitting(true);
    try {
      const res: WeeklyReviewResult = await submitWeeklyReview(
        Object.entries(answers).map(([questionId, selectedOptionId]) => ({ questionId: Number(questionId), selectedOptionId }))
      );
      setResult(res);
      setMode('done');
    } catch (err: any) {
      setError(err?.message || tr('ដាក់ស្នើមិនបានទេ។', "Couldn't submit."));
    } finally {
      setSubmitting(false);
    }
  };

  const backButton = (
    <button type="button" onClick={onBack} className="self-start inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer">
      <ArrowLeft className="w-4 h-4" />
      {tr('ត្រឡប់ទៅផែនការ', 'Back to plan')}
    </button>
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        {backButton}
        <div className={`${CARD} p-6 h-48 animate-pulse motion-reduce:animate-none`} />
      </div>
    );
  }

  if (error && !review) {
    return (
      <div className="flex flex-col gap-4">
        {backButton}
        <ErrorBox message={error} onRetry={load} retryLabel={tr('ព្យាយាមម្តងទៀត', 'Try again')} />
      </div>
    );
  }

  if (!review || review.total === 0) {
    return (
      <div className="flex flex-col gap-4">
        {backButton}
        <section className={`${CARD} p-8 text-center flex flex-col items-center gap-2`}>
          <span className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
            <Check className="w-6 h-6 text-emerald-600" aria-hidden="true" />
          </span>
          <h1 className="text-lg font-bold text-[#0a2540]">{tr('គ្មានកំហុសត្រូវពិនិត្យសប្តាហ៍នេះទេ', 'No mistakes to review this week')}</h1>
          <p className="text-sm text-slate-500 max-w-md">
            {tr('កំហុសពីកម្រងសំណួរ និងអនុវត្តនឹងលេចឡើងនៅទីនេះ។ វិញ្ញាសាមិនរួមបញ្ចូលទេ ព្រោះគ្មានពិន្ទុ។', 'Mistakes from quizzes and practice appear here. Papers are not included because they have no score.')}
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {backButton}

      <section className="rounded-2xl bg-gradient-to-r from-[#78350f] to-[#b45309] text-white p-6 sm:p-7 flex flex-wrap items-center justify-between gap-5">
        <div className="flex flex-col gap-2 min-w-0 max-w-2xl">
          <span className="self-start px-2.5 py-0.5 rounded-full bg-amber-300 text-amber-950 text-xs font-bold">
            {tr(`សប្តាហ៍ទី ${review.weekIndex + 1}`, `Week ${review.weekIndex + 1}`)} · {formatDay(review.weekStart, lang, { day: 'numeric', month: 'short' })}–{formatDay(review.weekEnd, lang, { day: 'numeric', month: 'short' })}
          </span>
          <h1 className="text-2xl font-extrabold">{tr('ពិនិត្យកំហុសរបស់អ្នកឡើងវិញ', 'Review your mistakes')}</h1>
          <p className="text-sm leading-relaxed text-amber-50">
            {tr(
              `សំណួរទាំង ${review.total} ជាសំណួរដដែលដែលអ្នកឆ្លើយខុសក្នុងកម្រងសំណួរ និងអនុវត្តសប្តាហ៍នេះ។ មិនមានសំណួរថ្មីទេ។`,
              `These ${review.total} are the exact questions you got wrong in this week's quizzes and practice. Nothing new.`
            )}
          </p>
        </div>
        <span className="w-24 h-24 rounded-full bg-white/15 border border-white/25 flex flex-col items-center justify-center shrink-0">
          <span className="text-3xl font-extrabold">{review.total}</span>
          <span className="text-[11px] font-bold text-amber-100">{tr('កំហុស', 'mistakes')}</span>
        </span>
      </section>

      {review.byTopic.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500">{tr('តាមប្រធានបទ៖', 'By topic:')}</span>
          {review.byTopic.map((t) => (
            <span key={`${t.subjectName}-${t.topicName}`} className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold">
              {t.topicName} · {t.count}
            </span>
          ))}
        </div>
      )}

      {error && <p role="alert" className="text-[13px] font-semibold text-red-700">{error}</p>}

      {mode === 'read' && (
        <>
          <ol className="flex flex-col gap-4">
            {mistakes.map((m, i) => {
              const yours = m.options.find((o) => o.optionId === m.selectedOptionId);
              const correct = m.options.find((o) => o.optionId === m.correctOptionId);
              return (
                <li key={m.questionId} className={`${CARD} p-5 sm:p-6 flex flex-col gap-4`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-red-50 text-red-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#eef4fb] text-[#0a3263] text-xs font-bold">{m.subjectName}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">{m.topicName}</span>
                    <span className="ml-auto text-xs text-slate-500">
                      {m.source === 'practice' ? tr('អនុវត្ត', 'Practice') : tr('កម្រងសំណួរ', 'Quiz')} · {formatDay(m.answeredAt, lang, { weekday: 'long' })}
                    </span>
                  </div>
                  <MathText as="p" className="text-base font-semibold leading-relaxed text-[#0a2540] whitespace-pre-line break-words" text={m.questionText} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                      <span className="text-xs font-bold text-red-700">{tr('ចម្លើយរបស់អ្នក', 'Your answer')}</span>
                      <p className="flex items-center gap-2 text-sm font-semibold text-red-900 mt-1">
                        <X className="w-4 h-4 shrink-0" aria-hidden="true" />
                        {yours ? <MathText text={yours.optionText} /> : tr('មិនបានឆ្លើយ', 'Not answered')}
                      </p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                      <span className="text-xs font-bold text-emerald-700">{tr('ចម្លើយត្រឹមត្រូវ', 'Correct answer')}</span>
                      <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900 mt-1">
                        <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <MathText text={correct?.optionText} />
                      </p>
                    </div>
                  </div>
                  {m.explanation && (
                    <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                      <Info className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" aria-hidden="true" />
                      <span className="flex flex-col">
                        <span className="text-xs font-bold text-slate-500">{tr('ការពន្យល់ចម្លើយត្រឹមត្រូវ', 'Explanation')}</span>
                        <span className="text-[13px] leading-relaxed text-slate-600 whitespace-pre-line"><MathText text={m.explanation} /></span>
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setIndex(0);
                setAnswers({});
                setMode('redo');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[48px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer"
            >
              {tr('ចាប់ផ្តើមធ្វើឡើងវិញ', 'Answer them again')}
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-[13px] text-slate-500">{tr('ឆ្លើយត្រូវ — សំណួរចេញពីបញ្ជីកំហុស។', 'Answer correctly and the question leaves your mistake list.')}</span>
          </div>
        </>
      )}

      {mode === 'redo' && current && (
        <section className={`${CARD} p-6 sm:p-8 flex flex-col gap-5`}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-500 tabular-nums">
              {index + 1} / {mistakes.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">{current.topicName}</span>
          </div>
          <MathText as="h2" className="text-lg font-semibold leading-relaxed text-[#0a2540] whitespace-pre-line break-words" text={current.questionText} />
          <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={tr('ជម្រើស', 'Options')}>
            {redoOptions.map((option, i) => {
              const picked = answers[current.questionId];
              const revealed = picked != null;
              const isPicked = picked === option.optionId;
              const isCorrect = option.optionId === current.correctOptionId;
              const tone = !revealed
                ? 'border-slate-200 bg-white hover:border-slate-300'
                : isCorrect
                  ? 'border-emerald-500 bg-emerald-50'
                  : isPicked
                    ? 'border-red-400 bg-red-50'
                    : 'border-slate-200 bg-white opacity-60';
              return (
                <button
                  key={option.optionId}
                  type="button"
                  role="radio"
                  aria-checked={isPicked}
                  disabled={revealed}
                  onClick={() => setAnswers((prev) => ({ ...prev, [current.questionId]: option.optionId }))}
                  className={`w-full text-left flex items-center gap-3.5 px-4 py-3.5 min-h-[56px] rounded-2xl border-[1.5px] transition cursor-pointer disabled:cursor-default ${tone}`}
                >
                  <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 shrink-0 flex items-center justify-center text-[13px] font-bold" aria-hidden="true">
                    {LETTERS[i] || i + 1}
                  </span>
                  <span className="text-[15px] leading-relaxed text-slate-800 break-words"><MathText text={option.optionText} /></span>
                </button>
              );
            })}
          </div>
          {answers[current.questionId] != null && (
            <p className="text-sm font-bold" aria-live="polite">
              {answers[current.questionId] === current.correctOptionId ? (
                <span className="text-emerald-700">{tr('ត្រឹមត្រូវ!', 'Correct!')}</span>
              ) : (
                <span className="text-red-700">{tr('មិនទាន់ត្រឹមត្រូវទេ — សំណួរនេះនៅក្នុងបញ្ជីកំហុស។', 'Not yet — this one stays on your list.')}</span>
              )}
            </p>
          )}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-bold transition cursor-pointer disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" />
              {tr('សំណួរមុន', 'Previous')}
            </button>
            {index < mistakes.length - 1 ? (
              <button
                type="button"
                onClick={() => setIndex((i) => i + 1)}
                className="inline-flex items-center gap-2 px-6 py-2.5 min-h-[44px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer"
              >
                {tr('សំណួរបន្ទាប់', 'Next')}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 min-h-[44px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer disabled:opacity-70"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />}
                {tr('បញ្ចប់ការពិនិត្យ', 'Finish review')}
              </button>
            )}
          </div>
        </section>
      )}

      {mode === 'done' && result && (
        <section className={`${CARD} p-8 flex flex-col items-center text-center gap-3`}>
          <span className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
            <Check className="w-6 h-6 text-emerald-600" aria-hidden="true" />
          </span>
          <h2 className="text-xl font-extrabold text-[#0a2540]">
            {tr(`ត្រូវ ${result.correct} ក្នុងចំណោម ${result.total}`, `${result.correct} of ${result.total} correct`)}
          </h2>
          <p className="text-sm text-slate-500 max-w-md">
            {tr(
              `កំហុស ${result.clearedQuestionIds.length} ចេញពីបញ្ជីហើយ។ AI នឹងប្រើលទ្ធផលនេះដើម្បីកែសប្តាហ៍ក្រោយ។`,
              `${result.clearedQuestionIds.length} mistakes cleared. The AI uses this to adjust next week.`
            )}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 min-h-[48px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer"
          >
            {tr('មើលការកែសប្តាហ៍ក្រោយ', "See next week's changes")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}
    </div>
  );
};
