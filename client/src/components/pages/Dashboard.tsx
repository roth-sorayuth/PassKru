import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { getDashboardSummary } from '../../services/progressService';
import { DashboardResponseData } from '../../types/dashboard';
import { ExamReadinessCard } from '../dashboard/ExamReadinessCard';
import { OverallProgressCard } from '../dashboard/OverallProgressCard';
import { SubjectDonutChart } from '../dashboard/SubjectDonutChart';
import { AIInsightCard } from '../dashboard/AIInsightCard';
import { ResourceUsageCard } from '../dashboard/ResourceUsageCard';
import { StudyTimeDistributionCard } from '../dashboard/StudyTimeDistributionCard';
import { StreakCard } from '../dashboard/StreakCard';
import { CountdownCard } from '../dashboard/CountdownCard';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  RefreshCw,
} from 'lucide-react';

/** One pulsing placeholder block — the app's established skeleton look. */
const SkeletonCard: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className = '',
  children,
}) => (
  <div className={`bg-white rounded-2xl border border-slate-200 p-6 animate-pulse ${className}`}>
    {children}
  </div>
);

const DashboardSkeleton: React.FC = () => (
  <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-[1100px] mx-auto">
    {/* Header */}
    <div className="flex flex-wrap items-center justify-between gap-3 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-24 bg-slate-200 rounded" />
        <div className="h-6 w-56 bg-slate-200 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-24 bg-slate-200 rounded-full" />
        <div className="h-8 w-28 bg-slate-200 rounded-full" />
      </div>
    </div>

    {/* Hero */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {[0, 1].map((i) => (
        <SkeletonCard key={i} className="space-y-4">
          <div className="h-3 w-28 bg-slate-200 rounded" />
          <div className="h-10 w-24 bg-slate-200 rounded" />
          <div className="h-2 w-full bg-slate-100 rounded-full" />
          <div className="h-3 w-40 bg-slate-100 rounded" />
        </SkeletonCard>
      ))}
    </div>

    {/* Subject donuts */}
    <SkeletonCard className="space-y-5">
      <div className="h-4 w-40 bg-slate-200 rounded" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full bg-slate-200" />
            <div className="h-3 w-20 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </SkeletonCard>

    {/* Insight + usage + streak */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {[0, 1, 2, 3].map((i) => (
        <SkeletonCard key={i} className="space-y-3">
          <div className="h-4 w-36 bg-slate-200 rounded" />
          <div className="h-3 w-full bg-slate-100 rounded" />
          <div className="h-3 w-5/6 bg-slate-100 rounded" />
          <div className="h-3 w-2/3 bg-slate-100 rounded" />
          <div className="h-16 w-full bg-slate-100 rounded-xl" />
        </SkeletonCard>
      ))}
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { setCurrentPage, setHighlightTaskId, userProfile } = useApp();
  const { lang } = useLanguage();
  const [data, setData] = useState<DashboardResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardSummary();
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1100px] mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-red-700 text-sm font-semibold min-w-0">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="min-w-0">{error}</span>
          </div>
          <button
            onClick={load}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-xs font-bold transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'ព្យាយាមម្ដងទៀត' : 'Try again'}</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  const {
    countdown,
    overallProgress,
    examReadiness,
    subjectDonuts,
    aiInsight,
    streak,
    resourceUsage,
    studyTimeDistribution,
    hasActivePlan,
    nextModule,
    recentAttempts,
  } = data;

  const firstName = (userProfile?.name || '').trim().split(/\s+/)[0] || '';
  const readinessStatus =
    lang === 'en' && examReadiness.statusLabelEn
      ? examReadiness.statusLabelEn
      : examReadiness.statusLabel;

  /**
   * "Continue course" promises a specific task, so hand the study-plan page
   * that task's id — it scrolls to and highlights it on arrival instead of
   * dropping the candidate at the top of the page.
   */
  const goToNextModule = () => {
    setHighlightTaskId(nextModule?.taskId ?? null);
    setCurrentPage('study-plan');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 animate-fadeIn max-w-[1100px] mx-auto text-slate-800">

      {/* 1. Compact header: greeting + streak + countdown badge */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {lang === 'km' ? 'ផ្ទាំងគ្រប់គ្រង' : 'Dashboard'}
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a2540] truncate">
            {firstName
              ? lang === 'km'
                ? `សួស្ដី ${firstName}!`
                : `Hi ${firstName}!`
              : lang === 'km'
                ? 'សួស្ដី!'
                : 'Welcome back!'}
          </h1>
        </div>

        {/* Badge row — wraps rather than overflowing on a ~360px screen */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold whitespace-nowrap">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
            {lang === 'km'
              ? `${streak.streakDays} ថ្ងៃជាប់ៗគ្នា`
              : `${streak.streakDays} day streak`}
          </span>
          {/* Only rendered when a real exam date is known — never fabricated. */}
          {countdown && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a3263] text-white text-xs font-bold whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              {lang === 'km'
                ? `នៅ ${countdown.days} ថ្ងៃទៀត`
                : `${countdown.days} days to exam`}
            </span>
          )}
        </div>
      </header>

      {/* 2. Hero: the headline metric plus the progress that feeds into it */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ExamReadinessCard
          score={examReadiness.score}
          maxScore={examReadiness.maxScore}
          statusLabel={readinessStatus}
          accuracy={aiInsight.accuracy}
          courseProgress={overallProgress.percent}
        />
        <OverallProgressCard
          percent={overallProgress.percent}
          lessonsCompleted={overallProgress.lessonsCompleted}
          totalLessons={overallProgress.totalLessons}
          remaining={overallProgress.remaining}
        />
      </section>

      {/* 3. Subject mastery donuts */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <h2 className="text-base font-bold text-[#0a2540] mb-1">
          {lang === 'km' ? 'ចំណេះដឹងតាមមុខវិជ្ជា' : 'Subject mastery'}
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          {lang === 'km'
            ? 'ភាគរយប្រធានបទដែលអ្នកបានស្ទាត់ជំនាញក្នុងមុខវិជ្ជានីមួយៗ'
            : 'Share of topics you have mastered in each subject'}
        </p>

        {subjectDonuts.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            {lang === 'km'
              ? 'កំណត់ក្របខណ្ឌប្រឡងគោលដៅ ដើម្បីមើលចំណេះដឹងតាមមុខវិជ្ជារបស់អ្នក'
              : 'Set your target exam to see your knowledge by subject'}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
            {subjectDonuts.map((s) => (
              <SubjectDonutChart
                key={s.subjectId}
                percent={s.percent}
                label={s.label}
                completed={s.completed}
                total={s.total}
                color={s.color}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Weak areas, as its own card with a route into the weakness page */}
      <section>
        <AIInsightCard
          accuracy={aiInsight.accuracy}
          weeklyChange={aiInsight.weeklyChange}
          weakAreas={aiInsight.weakAreas}
          onReviewWeakAreas={() => setCurrentPage('weakness')}
        />
      </section>

      {/* 5. Resource usage + study time — both real, both previously unshown */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ResourceUsageCard resources={resourceUsage} />
        <StudyTimeDistributionCard subjects={studyTimeDistribution} />
      </section>

      {/* 6. Streak + countdown detail + recent attempts. The countdown card is
          only present when a real exam date is known, so the row is a 2-up
          without it and a 3-up with it. */}
      <section
        className={`grid grid-cols-1 gap-5 ${
          countdown ? 'md:grid-cols-2 lg:grid-cols-3' : 'lg:grid-cols-2'
        }`}
      >
        <StreakCard streakDays={streak.streakDays} activeDayIndices={streak.activeDayIndices} />

        {countdown && (
          <CountdownCard
            days={countdown.days}
            hours={countdown.hours}
            minutes={countdown.minutes}
          />
        )}

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
          <h3 className="text-base font-bold text-[#0a2540] mb-4">
            {lang === 'km' ? 'ប្រវត្តិការធ្វើតេស្តថ្មីៗ' : 'Recent attempts'}
          </h3>
          {recentAttempts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              {lang === 'km' ? 'មិនទាន់មានប្រវត្តិទេ' : 'No history yet'}
            </p>
          ) : (
            <div className="space-y-2.5">
              {recentAttempts.map((a) => (
                <div key={a.attemptId} className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-600 truncate min-w-0">{a.title}</span>
                  <span className="font-bold text-[#0a2540] shrink-0">
                    {a.score !== null ? `${Math.round(a.score)}%` : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. Next-module banner: 3-way (next task / all caught up / no course) */}
      {nextModule ? (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {lang === 'km' ? 'ត្រូវធ្វើបន្ទាប់' : 'Next up in your course'}
              </p>
              <p className="text-sm font-bold text-[#0a2540] truncate">{nextModule.title}</p>
            </div>
          </div>
          <button
            onClick={goToNextModule}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-xs font-bold transition cursor-pointer"
          >
            <span>{lang === 'km' ? 'បន្តវគ្គសិក្សា' : 'Continue course'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : hasActivePlan ? (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <p className="text-sm font-medium text-slate-600">
            {lang === 'km'
              ? 'អ្នកបានបញ្ចប់វគ្គសិក្សានេះទាំងអស់!'
              : "You're all caught up on your course!"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-5 border border-dashed border-indigo-200 shadow-2xs flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm font-medium text-slate-600">
            {lang === 'km' ? 'អ្នកមិនទាន់មានវគ្គសិក្សាទេ' : "You don't have a course yet"}
          </p>
          <button
            onClick={() => setCurrentPage('study-plan')}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
          >
            <span>{lang === 'km' ? 'បង្កើតវគ្គសិក្សា' : 'Create my course'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
