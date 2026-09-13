import React, { useEffect, useState } from 'react';
import { ChevronRight, ClipboardCheck, Clock, FileText, History, ListChecks, Loader2, RotateCcw, Sparkles, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getActivity } from '../../services/progressService';
import { ActivityItem, ActivityKind, ActivityPage } from '../../types/aiStudyPlan';
import { CARD, ErrorBox, formatDay, levelLabel, todayIso, useTr } from '../study-plan/shared';
import { AttemptReviewModal } from './AttemptReviewModal';

const PAGE_SIZE = 8;
const APP_TZ = 'Asia/Phnom_Penh';

const KIND_META: Record<ActivityKind, { km: string; en: string; icon: React.ElementType; tone: string }> = {
  quiz: { km: 'កម្រងសំណួរ', en: 'Quiz', icon: ListChecks, tone: 'bg-[#eef4fb] text-[#0a3263] ring-[#dfeaf8]' },
  practice: { km: 'អនុវត្ត', en: 'Practice', icon: ClipboardCheck, tone: 'bg-[#0a3263] text-white ring-[#c9d8ea]' },
  placement: { km: 'តេស្តវាស់កម្រិត', en: 'Placement test', icon: Target, tone: 'bg-[#dfeaf8] text-[#082447] ring-[#c9d8ea]' },
  review: { km: 'ពិនិត្យកំហុស', en: 'Mistake review', icon: RotateCcw, tone: 'bg-amber-50 text-amber-800 ring-amber-100' },
  paper: { km: 'វិញ្ញាសា', en: 'Paper', icon: FileText, tone: 'bg-slate-100 text-slate-700 ring-slate-200' },
  plan: { km: 'ផែនការសិក្សា', en: 'Study plan', icon: Sparkles, tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
};

const SCORED: ActivityKind[] = ['quiz', 'practice', 'placement', 'review'];

type FilterId = 'all' | 'scored' | 'paper' | 'plan';
const FILTERS: { id: FilterId; km: string; en: string; kinds: ActivityKind[] | null }[] = [
  { id: 'all', km: 'ទាំងអស់', en: 'All', kinds: null },
  { id: 'scored', km: 'តេស្ត & កម្រងសំណួរ', en: 'Tests & quizzes', kinds: SCORED },
  { id: 'paper', km: 'វិញ្ញាសា', en: 'Papers', kinds: ['paper'] },
  { id: 'plan', km: 'ផែនការ', en: 'Plans', kinds: ['plan'] },
];

/** App-calendar day (UTC+7) of an ISO instant. */
const appDay = (iso: string) => new Date(new Date(iso).getTime() + 7 * 3600 * 1000).toISOString().slice(0, 10);

const scoreStyle = (score: number) =>
  score >= 70
    ? { pill: 'bg-emerald-50 text-emerald-700', bar: 'bg-emerald-500' }
    : score >= 50
      ? { pill: 'bg-amber-50 text-amber-800', bar: 'bg-amber-500' }
      : { pill: 'bg-red-50 text-red-700', bar: 'bg-red-500' };

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
  const [filter, setFilter] = useState<FilterId>('all');

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

  const num = (n: number) => n.toLocaleString(lang === 'km' ? 'km-KH' : 'en-US');

  const titleOf = (item: ActivityItem) => {
    if (item.kind === 'placement') return tr('តេស្តវាស់កម្រិត', 'Placement test');
    if (item.kind === 'review') return tr('ពិនិត្យកំហុសប្រចាំសប្តាហ៍', 'Weekly mistake review');
    if (item.kind === 'plan') return tr('បង្កើតផែនការសិក្សាមួយខែ', 'Created a one-month study plan');
    return item.title || (lang === 'km' ? KIND_META[item.kind].km : KIND_META[item.kind].en);
  };

  /** Secondary line: subject, level or duration — the kind itself is the chip. */
  const metaOf = (item: ActivityItem) => {
    const parts: string[] = [];
    if (item.subjectName && !titleOf(item).includes(item.subjectName)) parts.push(item.subjectName);
    if (item.kind === 'plan') parts.push(tr(`កម្រិត ${levelLabel(item.level, lang)}`, `Level: ${levelLabel(item.level, lang)}`));
    return parts;
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

  const activeKinds = FILTERS.find((f) => f.id === filter)?.kinds ?? null;
  const visible = (items || []).filter((i) => !activeKinds || activeKinds.includes(i.kind));

  const groups: { day: string; items: ActivityItem[] }[] = [];
  for (const item of visible) {
    const day = appDay(item.at);
    const last = groups[groups.length - 1];
    if (last?.day === day) last.items.push(item);
    else groups.push({ day, items: [item] });
  }

  return (
    <section className={`${CARD} p-5 sm:p-6 flex flex-col gap-5`} aria-labelledby="activity-title">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-[#eef4fb] text-[#0a3263] flex items-center justify-center shrink-0" aria-hidden="true">
            <History className="w-5 h-5" />
          </span>
          <div className="flex flex-col">
            <h2 id="activity-title" className="text-base font-bold text-[#0a2540]">{tr('ប្រវត្តិសកម្មភាព', 'Activity history')}</h2>
            <span className="text-xs text-slate-500">{tr('ចុចលើតេស្ត ឬកម្រងសំណួរ ដើម្បីមើលចម្លើយឡើងវិញ', 'Tap a test or quiz to go back over your answers')}</span>
          </div>
        </div>

        {items && items.length > 0 && (
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#f4f8fd] border border-[#dfeaf8] overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label={tr('តម្រងប្រវត្តិ', 'History filter')}>
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    active ? 'bg-white text-[#0a3263] shadow-sm' : 'text-slate-600 hover:text-[#0a3263]'
                  }`}
                >
                  {lang === 'km' ? f.km : f.en}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && <ErrorBox message={error} onRetry={items ? loadMore : loadFirst} retryLabel={tr('ព្យាយាមម្តងទៀត', 'Try again')} />}

      {!items && !error && (
        <div className="flex flex-col gap-2" aria-busy="true" aria-label={tr('កំពុងទាញយក…', 'Loading…')}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse motion-reduce:animate-none" />
          ))}
        </div>
      )}

      {items && visible.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <span className="w-12 h-12 rounded-2xl bg-[#f4f8fd] text-[#486581] flex items-center justify-center" aria-hidden="true">
            <History className="w-6 h-6" />
          </span>
          <p className="text-[13px] text-slate-500 max-w-sm">
            {items.length === 0
              ? tr('មិនទាន់មានសកម្មភាពទេ — កម្រងសំណួរ តេស្ត និងវិញ្ញាសាដែលអ្នកធ្វើនឹងលេចឡើងនៅទីនេះ។', 'No activity yet — quizzes, tests and papers you finish show up here.')
              : tr('មិនមានសកម្មភាពប្រភេទនេះក្នុងបញ្ជីដែលបានបង្ហាញទេ។', 'Nothing of this type in the loaded history.')}
          </p>
        </div>
      )}

      {groups.map((g) => (
        <div key={g.day} className="flex flex-col gap-2">
          <div className="flex items-center gap-3 px-1">
            <h3 className="text-xs font-bold text-[#0a2540] shrink-0">{dayLabel(g.day)}</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600 shrink-0">{num(g.items.length)}</span>
            <span className="h-px bg-slate-200 flex-1" aria-hidden="true" />
          </div>

          <ul className="relative flex flex-col">
            {/* timeline rail behind the icons */}
            <span className="absolute left-[27px] top-6 bottom-6 w-px bg-[#dfeaf8]" aria-hidden="true" />
            {g.items.map((item) => {
              const meta = KIND_META[item.kind];
              const Icon = meta.icon;
              const clickable = (SCORED.includes(item.kind) && !!item.attemptId) || (item.kind === 'paper' && !!item.fileUrl) || item.kind === 'plan';
              const style = item.score != null ? scoreStyle(item.score) : null;
              const extra = metaOf(item);

              const body = (
                <>
                  <span className={`relative z-10 w-10 h-10 rounded-xl ring-4 ring-white flex items-center justify-center shrink-0 ${meta.tone}`} aria-hidden="true">
                    <Icon className="w-[18px] h-[18px]" />
                  </span>

                  <span className="flex flex-col min-w-0 flex-1 text-left gap-1">
                    <span className="text-sm font-semibold text-slate-800 truncate">{titleOf(item)}</span>
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600">
                        {lang === 'km' ? meta.km : meta.en}
                      </span>
                      {extra.map((e) => (
                        <span key={e} className="truncate">{e}</span>
                      ))}
                      {item.kind === 'plan' && item.active && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[11px] font-semibold text-emerald-700">{tr('កំពុងប្រើ', 'Current')}</span>
                      )}
                      {!!item.durationMinutes && (
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          {tr(`${num(item.durationMinutes)} នាទី`, `${item.durationMinutes} min`)}
                        </span>
                      )}
                    </span>
                  </span>

                  <span className="flex flex-col items-end gap-1 shrink-0">
                    {style && item.score != null ? (
                      <>
                        <span className="flex items-center gap-2">
                          {item.total ? (
                            <span className="text-xs font-semibold text-slate-500 tabular-nums">{num(item.correct ?? 0)}/{num(item.total)}</span>
                          ) : null}
                          <span className={`px-2 py-0.5 rounded-lg text-sm font-bold tabular-nums ${style.pill}`}>{num(item.score)}%</span>
                        </span>
                        <span className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden" aria-hidden="true">
                          <span className={`block h-full rounded-full ${style.bar}`} style={{ width: `${Math.max(3, Math.min(100, item.score))}%` }} />
                        </span>
                      </>
                    ) : item.kind === 'paper' ? (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">{tr('បានធីក', 'Ticked')}</span>
                    ) : null}
                    <span className="text-[11px] text-slate-500 tabular-nums">{timeOf(item.at)}</span>
                  </span>

                  {clickable && (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 transition group-hover:translate-x-0.5 group-hover:text-[#0a3263]" aria-hidden="true" />
                  )}
                </>
              );

              return (
                <li key={item.id}>
                  {clickable ? (
                    <button
                      type="button"
                      onClick={() => open(item)}
                      className="group w-full flex items-center gap-3 px-2 py-2.5 rounded-2xl hover:bg-[#f4f8fd] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a3263]/30 transition cursor-pointer"
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
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[40px] rounded-xl border border-[#dfeaf8] bg-[#f4f8fd] text-[13px] font-bold text-[#0a3263] hover:bg-[#eef4fb] transition cursor-pointer disabled:opacity-60"
        >
          {loadingMore && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />}
          {tr('មើលសកម្មភាពមុនៗ', 'Show earlier activity')}
        </button>
      )}

      {reviewing?.attemptId && <AttemptReviewModal attemptId={reviewing.attemptId} title={titleOf(reviewing)} onClose={() => setReviewing(null)} />}
    </section>
  );
};
