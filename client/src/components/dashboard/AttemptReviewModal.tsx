import React, { useEffect, useRef, useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';
import { getAttempt } from '../../services/attemptService';
import { AttemptReview } from '../../types/aiStudyPlan';
import { MathText } from '../ui/MathText';
import { ErrorBox, useTr } from '../study-plan/shared';

interface Props {
  attemptId: number;
  /** Heading while loading, e.g. the activity title. */
  title: string;
  onClose: () => void;
}

/** A finished attempt question by question: the candidate's answer, the right one, and why. */
export const AttemptReviewModal: React.FC<Props> = ({ attemptId, title, onClose }) => {
  const { tr } = useTr();
  const [review, setReview] = useState<AttemptReview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wrongOnly, setWrongOnly] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const load = async () => {
    setError(null);
    try {
      const res = await getAttempt(attemptId);
      const data: AttemptReview = res.attempt;
      setReview(data);
      setWrongOnly(data.answers.some((a) => !a.isCorrect));
    } catch (err: any) {
      setError(err?.message || tr('ទាញយកចម្លើយមិនបានទេ។', "Couldn't load the answers."));
    }
  };

  useEffect(() => {
    load();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  const answers = review?.answers || [];
  const correct = answers.filter((a) => a.isCorrect).length;
  const shown = wrongOnly ? answers.filter((a) => !a.isCorrect) : answers;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="attempt-review-title"
        className="relative w-full sm:max-w-2xl max-h-[92vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <h2 id="attempt-review-title" className="text-base font-bold text-[#0a2540] break-words">
              {(review?.title && review.title !== 'Attempt' ? review.title : title).replace(/ឈុត/g, 'វិញ្ញាសារ')}
            </h2>
            {review && (
              <span className="text-[13px] text-slate-500 tabular-nums">
                {tr(`ត្រូវ ${correct} ក្នុង ${answers.length}`, `${correct} of ${answers.length} correct`)}
                {review.score != null && ` · ${Math.round(review.score)}%`}
              </span>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={tr('បិទ', 'Close')}
            className="p-2 -mr-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-4 overflow-y-auto flex flex-col gap-4">
          {error && <ErrorBox message={error} onRetry={load} retryLabel={tr('ព្យាយាមម្តងទៀត', 'Try again')} />}
          {!review && !error && (
            <p className="flex items-center gap-2 text-sm text-slate-500 py-8 justify-center" aria-live="polite">
              <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />
              {tr('កំពុងទាញយកចម្លើយ…', 'Loading answers…')}
            </p>
          )}

          {review && answers.length > 0 && (
            <div className="flex gap-0.5 p-0.5 rounded-lg bg-slate-100 self-start" role="group" aria-label={tr('បង្ហាញ', 'Show')}>
              {[
                { on: true, label: tr(`ខុស ${answers.length - correct}`, `Wrong ${answers.length - correct}`) },
                { on: false, label: tr(`ទាំងអស់ ${answers.length}`, `All ${answers.length}`) },
              ].map((b) => (
                <button
                  key={String(b.on)}
                  type="button"
                  aria-pressed={wrongOnly === b.on}
                  onClick={() => setWrongOnly(b.on)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                    wrongOnly === b.on ? 'bg-white text-[#0a2540] shadow-sm' : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          )}

          {review && shown.length === 0 && (
            <p className="text-sm text-emerald-700 font-semibold py-6 text-center">{tr('ត្រូវទាំងអស់ — ល្អណាស់!', 'All correct — well done!')}</p>
          )}

          <ol className="flex flex-col gap-3">
            {shown.map((a) => {
              const number = answers.indexOf(a) + 1;
              return (
                <li key={a.questionId} className="rounded-2xl border border-slate-200 p-4 flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-500">
                      {tr(`សំណួរទី ${number}`, `Question ${number}`)}
                      {a.topicName ? ` · ${a.topicName}` : ''}
                    </span>
                    <MathText as="p" className="text-[15px] font-semibold leading-relaxed text-[#0a2540] whitespace-pre-line break-words" text={a.questionText} />
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {a.options.map((o) => {
                      const picked = o.optionId === a.selectedOptionId;
                      const tone = o.isCorrect
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                        : picked
                          ? 'border-red-300 bg-red-50 text-red-900'
                          : 'border-slate-200 text-slate-600';
                      return (
                        <li key={o.optionId} className={`rounded-xl border px-3 py-2 text-sm flex items-start justify-between gap-3 ${tone}`}>
                          <span className="min-w-0 break-words">
                            <MathText text={o.optionText} />
                          </span>
                          <span className="shrink-0 text-[11px] font-bold">
                            {o.isCorrect ? (
                              <span className="inline-flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                {picked ? tr('ចម្លើយអ្នក', 'Your answer') : tr('ចម្លើយត្រូវ', 'Correct')}
                              </span>
                            ) : picked ? (
                              tr('ចម្លើយអ្នក', 'Your answer')
                            ) : null}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  {a.selectedOptionId == null && <span className="text-xs font-semibold text-slate-500">{tr('មិនបានឆ្លើយ', 'Not answered')}</span>}
                  {a.explanation && (
                    <p className="text-[13px] leading-relaxed text-slate-600 bg-slate-50 rounded-xl px-3 py-2">
                      <MathText text={a.explanation} />
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
};
