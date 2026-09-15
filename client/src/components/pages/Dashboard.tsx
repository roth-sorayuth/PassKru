import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, BookOpen, Check, Clock, Flame, Play, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getDashboardSummary } from '../../services/progressService';
import { DashboardResponseData } from '../../types/dashboard';
import { DashboardState, PlanTask } from '../../types/aiStudyPlan';
import { getCategoryConfig, subjectLabel } from '../../data/examSelectionData';
import { KpiTile, TodayTasks, WeakTopics } from '../dashboard/DashboardParts';
import { ActivityHistory } from '../dashboard/ActivityHistory';
import { CARD, ErrorBox, useTr } from '../study-plan/shared';

/**
 * Only what a candidate acts on:
 *   1. three numbers — exam readiness, this week's tasks, study streak
 *   2. the one thing to do now (today's tasks, the Saturday review, or the month-end retest)
 *      next to the topics that need work
 *   3. activity history, where any quiz opens its answers
 */
const loadCachedDashboard = (): DashboardResponseData | null => {
  try {
    const saved = sessionStorage.getItem('passkru_cached_dashboard');
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};

let cachedDashboardData: DashboardResponseData | null = loadCachedDashboard();

/**
 * Only what a candidate acts on:
 *   1. three numbers — exam readiness, this week's tasks, study streak
 *   2. the one thing to do now (today's tasks, the Saturday review, or the month-end retest)
 *      next to the topics that need work
 *   3. activity history, where any quiz opens its answers
 */
export const Dashboard: React.FC = () => {
  const { tr, lang } = useTr();
  const { userProfile, setCurrentPage } = useApp();
  const [data, setData] = useState<DashboardResponseData | null>(() => cachedDashboardData);
  const [error, setError] = useState<string | null>(null);
  const [todayTasks, setTodayTasks] = useState<PlanTask[]>(() => cachedDashboardData?.today?.tasks || []);

  const load = useCallback(async () => {
    if (!cachedDashboardData) setError(null);
    try {
      const res: DashboardResponseData = await getDashboardSummary();
      cachedDashboardData = res;
      try {
        sessionStorage.setItem('passkru_cached_dashboard', JSON.stringify(res));
      } catch {}
      setData(res);
      setTodayTasks(res.today?.tasks || []);
    } catch (err: any) {
      if (!cachedDashboardData) {
        setError(err?.message || tr('ទាញយកផ្ទាំងគ្រប់គ្រងមិនបានទេ។', "Couldn't load the dashboard."));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load, userProfile.targetExam, (userProfile.selectedSubjects || []).join(',')]);

  if (error && !data) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <ErrorBox message={error} onRetry={load} retryLabel={tr('ព្យាយាមម្តងទៀត', 'Try again')} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-4" aria-busy="true" aria-label={tr('កំពុងទាញយក…', 'Loading…')}>
        <div className="h-10 w-72 rounded-lg bg-slate-200 animate-pulse motion-reduce:animate-none" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => <div key={i} className={`${CARD} h-28 animate-pulse motion-reduce:animate-none`} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-3">
          <div className={`${CARD} h-72 animate-pulse motion-reduce:animate-none`} />
          <div className={`${CARD} h-72 animate-pulse motion-reduce:animate-none`} />
        </div>
      </div>
    );
  }

  const state: DashboardState = data.state ?? (data.hasActivePlan ? 'weekday' : 'new');
  const lastName = (userProfile?.name || '').trim().split(/\s+/).pop() || '';
  const track = getCategoryConfig(userProfile.targetExam);
  const subjects = (userProfile.selectedSubjects || []).map((k) => subjectLabel(k, lang)).join(', ');
  const readinessLabel = lang === 'en' && data.examReadiness.statusLabelEn ? data.examReadiness.statusLabelEn : data.examReadiness.statusLabel;
  const doneToday = todayTasks.filter((t) => t.completed).length;
  const week = data.weekProgress;
  // Ticking a task on this page moves the week's count without a reload.
  const serverDoneToday = (data.today?.tasks || []).filter((t) => t.completed).length;
  const weekDone = week ? week.done + (doneToday - serverDoneToday) : 0;

  const header = (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs font-bold text-slate-500">{tr('ផ្ទាំងគ្រប់គ្រង', 'Dashboard')}</span>
        <h1 className="text-2xl font-bold text-[#0a2540] truncate">{lastName ? tr(`សួស្ដី ${lastName}!`, `Hi ${lastName}!`) : tr('សួស្ដី!', 'Hello!')}</h1>
        <span className="text-[13px] text-slate-500 truncate">
          {track ? tr(track.titleKm, track.titleEn) : ''}
          {subjects ? ` · ${subjects}` : ''}
        </span>
      </div>
      {data.countdown && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 tabular-nums">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          {tr(`នៅ ${data.countdown.days} ថ្ងៃទៀតដល់ការប្រឡង`, `${data.countdown.days} days to the exam`)}
        </span>
      )}
    </header>
  );

  /* New candidate: one action, what's waiting, and any history they already have. */
  if (state === 'new') {
    const c = data.contentAvailable;
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-4 animate-fadeIn">
        {header}
        <section className={`${CARD} p-6 flex flex-wrap items-center justify-between gap-5`}>
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <h2 className="text-xl font-bold text-[#0a2540]">{tr('ចាប់ផ្តើមដោយតេស្តវាស់កម្រិត', 'Start with the placement test')}</h2>
            <p className="text-sm leading-relaxed text-slate-500">
              {tr(
                'ជ្រើសកម្រិត និងមុខវិជ្ជា ធ្វើតេស្តខ្លីមួយ រួច AI បង្កើតផែនការមួយខែសម្រាប់អ្នក។',
                'Choose your level and subjects, take one short test, and the AI builds your one-month plan.'
              )}
            </p>
            {c && (
              <p className="text-xs text-slate-500">
                {tr(
                  `កំពុងរង់ចាំអ្នក៖ កម្រងសំណួរ ${c.quizzes} · អនុវត្ត ${c.practice} · វិញ្ញាសា ${c.papers}`,
                  `Waiting for you: ${c.quizzes} quizzes · ${c.practice} practice · ${c.papers} papers`
                )}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setCurrentPage('study-plan')}
            className="inline-flex items-center gap-2 px-6 py-3 min-h-[48px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer"
          >
            {tr('ចាប់ផ្តើម', 'Get started')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
        <ActivityHistory />
      </div>
    );
  }

  const stats = (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <KpiTile
        label={tr('ពិន្ទុត្រៀមប្រឡង', 'Exam readiness')}
        badge={{
          text: readinessLabel,
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
          color: data.examReadiness.score < 50 ? 'amber' : data.examReadiness.score < 75 ? 'blue' : 'emerald',
        }}
        value={data.examReadiness.score}
        unit="/100"
        delta={data.readinessDelta}
        context={tr(`កម្រិតជោគជ័យ: ${data.examReadiness.score}%`, `Success rate: ${data.examReadiness.score}%`)}
        progress={data.examReadiness.score / 100}
        progressColor={data.examReadiness.score < 50 ? 'bg-[#f59e0b]' : data.examReadiness.score < 75 ? 'bg-blue-600' : 'bg-emerald-500'}
      />
      <KpiTile
        label={week ? tr(`សប្តាហ៍ទី ${week.weekIndex + 1} នៃ ${week.totalWeeks}`, `Week ${week.weekIndex + 1} of ${week.totalWeeks}`) : tr('សប្តាហ៍នេះ', 'This week')}
        badge={
          week
            ? {
                text:
                  weekDone >= week.total
                    ? tr('បានបញ្ចប់', 'Completed')
                    : weekDone > 0
                    ? tr(`${Math.round((weekDone / (week.total || 1)) * 100)}% រួចរាល់`, `${Math.round((weekDone / (week.total || 1)) * 100)}% done`)
                    : tr('ចាប់ផ្តើមរៀន', 'Get started'),
                icon:
                  weekDone >= week.total ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <BookOpen className={`w-3.5 h-3.5 ${weekDone > 0 ? 'text-blue-600' : 'text-slate-500'} shrink-0`} />
                  ),
                color: weekDone >= week.total ? 'emerald' : weekDone > 0 ? 'blue' : 'slate',
              }
            : null
        }
        value={week ? weekDone : null}
        unit={week ? tr(`/${week.total} កិច្ចការ`, `/${week.total} tasks`) : undefined}
        context={week ? week.goal : tr('គ្មានផែនការសកម្ម', 'No active plan')}
        progress={week && week.total ? weekDone / week.total : 0}
        progressColor="bg-[#0a3263]"
      />
      <KpiTile
        label={tr('ថ្ងៃរៀនជាប់គ្នា', 'Study streak')}
        badge={{
          text: data.streak.streakDays > 0 ? tr('កំពុងបន្ត', 'Active') : tr('ចាប់ផ្តើម', 'Start streak'),
          icon: <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />,
          color: 'orange',
        }}
        value={data.streak.streakDays}
        unit={tr('ថ្ងៃ', 'days')}
        context={tr('ថ្ងៃអាទិត្យមិនកាត់ផ្តាច់', 'Sundays never break it')}
        progress={Math.min(1, Math.max(0.14, ((data.streak.streakDays % 7 || (data.streak.streakDays > 0 ? 7 : 0)) / 7)))}
        progressColor="bg-orange-500"
      />
    </div>
  );

  const mistakes = data.weeklyMistakes;
  const mainAction =
    state === 'saturday' && mistakes && mistakes.total > 0 ? (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-amber-700">{tr('ពិនិត្យកំហុសប្រចាំសប្តាហ៍', 'Weekly mistake review')}</span>
          <h2 className="text-xl font-bold text-[#0a2540]">{tr(`កំហុស ${mistakes.total} ត្រូវធ្វើឡើងវិញ`, `${mistakes.total} mistakes to redo`)}</h2>
          <p className="text-xs text-amber-900">{tr('សំណួរដដែលដែលអ្នកឆ្លើយខុសក្នុងសប្តាហ៍នេះ', 'The questions you got wrong this week')}</p>
        </div>
        <ul className="flex flex-col gap-2.5">
          {mistakes.byTopic.slice(0, 5).map((t) => {
            const max = Math.max(...mistakes.byTopic.map((b) => b.count));
            return (
              <li key={t.topicName} className="flex flex-col gap-1">
                <span className="flex justify-between gap-2 text-[13px]">
                  <span className="font-semibold text-slate-700 truncate">{t.topicName}</span>
                  <span className="font-bold text-[#0a2540] tabular-nums">{t.count}</span>
                </span>
                <span className="h-1.5 rounded-full bg-amber-100 overflow-hidden" aria-hidden="true">
                  <span className="block h-full rounded-full bg-[#0a3263]" style={{ width: `${(t.count / max) * 100}%` }} />
                </span>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() => setCurrentPage('study-plan')}
          className="self-start inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer"
        >
          <Play className="w-3.5 h-3.5" aria-hidden="true" />
          {tr('ចាប់ផ្តើមធ្វើឡើងវិញ', 'Start the review')}
        </button>
      </section>
    ) : state === 'month-end' ? (
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 flex flex-col gap-3">
        <span className="text-xs font-bold text-emerald-700">{tr('បញ្ចប់ខែ', 'Month complete')}</span>
        <h2 className="text-xl font-bold text-[#0a2540]">{tr('វាស់កម្រិតឡើងវិញ', 'Retake the placement test')}</h2>
        <p className="text-[13px] leading-relaxed text-emerald-900">
          {tr('ផែនការ ៤ សប្តាហ៍បានបញ្ចប់។ តេស្តខ្លីមួយនឹងវាស់ពិន្ទុឡើងវិញ ហើយ AI បង្កើតខែទី ២ ពីលទ្ធផលថ្មី។', 'Your 4-week plan is done. A short test re-scores every topic and the AI builds month 2 from the new result.')}
        </p>
        <button
          type="button"
          onClick={() => setCurrentPage('study-plan')}
          className="self-start inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          {tr('ចាប់ផ្តើមតេស្ត', 'Start the test')}
        </button>
      </section>
    ) : data.today ? (
      <TodayTasks tasks={todayTasks} planId={data.today.planId} date={data.today.date} onChange={setTodayTasks} />
    ) : (
      <section className={`${CARD} p-5 flex flex-col gap-3`}>
        <h2 className="text-[15px] font-bold text-[#0a2540]">{tr('ថ្ងៃនេះ', 'Today')}</h2>
        <p className="text-[13px] text-slate-500">{tr('មិនទាន់មានផែនការសិក្សាសកម្មទេ។', 'You have no active study plan yet.')}</p>
        <button
          type="button"
          onClick={() => setCurrentPage('study-plan')}
          className="self-start inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer"
        >
          {tr('បើកផែនការសិក្សា', 'Open the study plan')}
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-4 animate-fadeIn">
      {header}
      {error && <ErrorBox message={error} onRetry={load} retryLabel={tr('ព្យាយាមម្តងទៀត', 'Try again')} />}
      {stats}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-3 items-start">
        {mainAction}
        <WeakTopics groups={data.topicScores || []} />
      </div>
      <ActivityHistory refreshKey={doneToday} />
    </div>
  );
};
