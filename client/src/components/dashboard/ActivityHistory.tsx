import React, { useEffect, useState } from 'react';
import { ChevronRight, ClipboardCheck, FileText, ListChecks, Loader2, RotateCcw, Sparkles, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getActivity } from '../../services/progressService';
import { ActivityItem, ActivityKind, ActivityPage } from '../../types/aiStudyPlan';
import { CARD, ErrorBox, formatDay, levelLabel, todayIso, useTr } from '../study-plan/shared';
import { AttemptReviewModal } from './AttemptReviewModal';

const PAGE_SIZE = 8;
const APP_TZ = 'Asia/Phnom_Penh';

const KIND_META: Record<ActivityKind, { km: string; en: string; icon: React.ElementType; tone: string }> = {
  quiz: { km: 'កម្រងសំណួរ', en: 'Quiz', icon: ListChecks, tone: 'bg-[#eef4fb] text-[#0a3263]' },
  practice: { km: 'អនុវត្ត', en: 'Practice', icon: ClipboardCheck, tone: 'bg-[#0a3263] text-white' },
  placement: { km: 'តេស្តវាស់កម្រិត', en: 'Placement test', icon: Target, tone: 'bg-[#dfeaf8] text-[#082447]' },
  review: { km: 'ពិនិត្យកំហុស', en: 'Mistake review', icon: RotateCcw, tone: 'bg-amber-50 text-amber-800' },
  paper: { km: 'វិញ្ញាសា', en: 'Paper', icon: FileText, tone: 'bg-slate-100 text-slate-700' },
  plan: { km: 'ផែនការសិក្សា', en: 'Study plan', icon: Sparkles, tone: 'bg-emerald-50 text-emerald-700' },
};

const SCORED: ActivityKind[] = ['quiz', 'practice', 'placement', 'review'];

/** App-calendar day (UTC+7) of an ISO instant. */
const appDay = (iso: string) => new Date(new Date(iso).getTime() + 7 * 3600 * 1000).toISOString().slice(0, 10);

const scoreTone = (score: number) => (score >= 70 ? 'text-emerald-700' : score >= 50 ? 'text-amber-700' : 'text-red-700');

/**
 * Everything the candidate has done, newest first, grouped by day. Scored
 * attempts open their answers; papers open the file; plans open the plan.
 */
export const ActivityHistory: React.FC<{ refreshKey?: unknown }> = ({ refreshKey }) => {
  const { tr, lang } = useTr();
  const { setCurrentPage } = useApp();
  const [items, setItems] = useState<ActivityItem[] | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<ActivityItem | null>(null);

  const loadFirst = async () => {
    setError(null);
    try {
      const page: ActivityPage = await getActivity({ limit: PAGE_SIZE });
      setItems(page.items);
      setCursor(page.nextCursor);
    } catch (err: any) {
      setError(err?.message || tr('ទាញយកប្រវត្តិមិនបានទេ។', "Couldn't load your history."));
    }
  };

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      const page: ActivityPage = await getActivity({ before: cursor, limit: PAGE_SIZE });
      setItems((prev) => [...(prev || []), ...page.items.filter((i) => !(prev || []).some((p) => p.id === i.id))]);
      setCursor(page.nextCursor);
    } catch (err: any) {
      setError(err?.message || tr('ទាញយកប្រវត្តិមិនបានទេ។', "Couldn't load your history."));
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadFirst();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const titleOf = (item: ActivityItem) => {
    if (item.kind === 'placement') return tr('តេស្តវាស់កម្រិត', 'Placement test');
    if (item.kind === 'review') return tr('ពិនិត្យកំហុសប្រចាំសប្តាហ៍', 'Weekly mistake review');
    if (item.kind === 'plan') return tr('បង្កើតផែនការសិក្សាមួយខែ', 'Created a one-month study plan');
    return item.title || (lang === 'km' ? KIND_META[item.kind].km : KIND_META[item.kind].en);
  };

  const metaOf = (item: ActivityItem) => {
    const parts: string[] = [];
    if (item.kind === 'quiz' || item.kind === 'practice' || item.kind === 'paper') parts.push(lang === 'km' ? KIND_META[item.kind].km : KIND_META[item.kind].en);
    if (item.subjectName) parts.push(item.subjectName);
    if (item.kind === 'plan') {
      parts.push(tr(`កម្រិត ${levelLabel(item.level, lang)}`, `Level: ${levelLabel(item.level, lang)}`));
      if (item.active) parts.push(tr('កំពុងប្រើ', 'current'));
    }
    if (item.durationMinutes) parts.push(tr(`${item.durationMinutes} នាទី`, `${item.durationMinutes} min`));
    return parts.join(' · ');
  };

  const timeOf = (iso: string) =>
    new Intl.DateTimeFormat(lang === 'km' ? 'km-KH' : 'en-GB', { hour: '2-digit', minute: '2-digit', timeZone: APP_TZ }).format(new Date(iso));

  const dayLabel = (day: string) => {
    const today = todayIso();
    const yesterday = new Date(new Date(`${today}T00:00:00Z`).getTime() - 86400000).toISOString().slice(0, 10);
    if (day === today) return tr('ថ្ងៃនេះ', 'Today');
    if (day === yesterday) return tr('ម្សិលមិញ', 'Yesterday');
    return formatDay(day, lang, { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const open = (item: ActivityItem) => {
    if (SCORED.includes(item.kind) && item.attemptId) return setReviewing(item);
    if (item.kind === 'paper' && item.fileUrl) return window.open(item.fileUrl, '_blank', 'noopener,noreferrer');
    if (item.kind === 'plan') return setCurrentPage('study-plan');
  };

  const groups: { day: string; items: ActivityItem[] }[] = [];
  for (const item of items || []) {
    const day = appDay(item.at);
    const last = groups[groups.length - 1];
    if (last?.day === day) last.items.push(item);
    else groups.push({ day, items: [item] });
  }

  return (
    <section className={`${CARD} p-5 flex flex-col gap-4`} aria-labelledby="activity-title">
      <div className="flex flex-col">
        <h2 id="activity-title" className="text-[15px] font-bold text-[#0a2540]">{tr('ប្រវត្តិសកម្មភាព', 'Activity history')}</h2>
        <span className="text-xs text-slate-500">{tr('ចុចលើកម្រងសំណួរ ដើម្បីមើលចម្លើយរបស់អ្នកឡើងវិញ', 'Tap a quiz to go back over your answers')}</span>
      </div>

      {error && <ErrorBox message={error} onRetry={items ? loadMore : loadFirst} retryLabel={tr('ព្យាយាមម្តងទៀត', 'Try again')} />}

      {!items && !error && (
        <div className="flex flex-col gap-2" aria-busy="true" aria-label={tr('កំពុងទាញយក…', 'Loading…')}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse motion-reduce:animate-none" />
          ))}
        </div>
      )}

      {items && items.length === 0 && (
        <p className="text-[13px] text-slate-500 py-6 text-center">
          {tr('មិនទាន់មានសកម្មភាពទេ — កម្រងសំណួរ តេស្ត និងវិញ្ញាសាដែលអ្នកធ្វើនឹងលេចឡើងនៅទីនេះ។', 'No activity yet — quizzes, tests and papers you finish show up here.')}
        </p>
      )}

      {groups.map((g) => (
        <div key={g.day} className="flex flex-col gap-1">
          <h3 className="text-xs font-bold text-slate-500 px-1">{dayLabel(g.day)}</h3>
          <ul className="flex flex-col">
            {g.items.map((item) => {
              const meta = KIND_META[item.kind];
              const Icon = meta.icon;
              const clickable = (SCORED.includes(item.kind) && !!item.attemptId) || (item.kind === 'paper' && !!item.fileUrl) || item.kind === 'plan';
              const body = (
                <>
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.tone}`} aria-hidden="true">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="flex flex-col min-w-0 flex-1 text-left">
                    <span className="text-sm font-semibold text-slate-800 truncate">{titleOf(item)}</span>
                    <span className="text-xs text-slate-500 truncate">{metaOf(item)}</span>
                  </span>
                  <span className="flex flex-col items-end shrink-0">
                    {item.score != null ? (
                      <span className={`text-sm font-bold tabular-nums ${scoreTone(item.score)}`}>
                        {item.score}%
                        {item.total ? <span className="ml-1 text-xs font-semibold text-slate-500">{item.correct}/{item.total}</span> : null}
                      </span>
                    ) : item.kind === 'paper' ? (
                      <span className="text-xs font-semibold text-slate-500">{tr('បានធីក', 'Ticked')}</span>
                    ) : null}
                    <span className="text-[11px] text-slate-500 tabular-nums">{timeOf(item.at)}</span>
                  </span>
                  {clickable && <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" aria-hidden="true" />}
                </>
              );
              return (
                <li key={item.id}>
                  {clickable ? (
                    <button
                      type="button"
                      onClick={() => open(item)}
                      className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a3263]/30 transition cursor-pointer"
                    >
                      {body}
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 px-2 py-2.5">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {cursor && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="self-center inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-xl border border-slate-200 text-[13px] font-bold text-[#0a3263] hover:bg-slate-50 transition cursor-pointer disabled:opacity-60"
        >
          {loadingMore && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />}
          {tr('មើលបន្ថែម', 'Show more')}
        </button>
      )}

      {reviewing?.attemptId && <AttemptReviewModal attemptId={reviewing.attemptId} title={titleOf(reviewing)} onClose={() => setReviewing(null)} />}
    </section>
  );
};
