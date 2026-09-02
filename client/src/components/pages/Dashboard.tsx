import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { getDashboardSummary } from '../../services/progressService';
import { DashboardResponseData } from '../../types/dashboard';
import { TrendingUp, AlertTriangle, Clock, Calendar, History, Loader2, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';

import { CountdownCard } from '../dashboard/CountdownCard';
import { OverallProgressCard } from '../dashboard/OverallProgressCard';
import { ExamReadinessCard } from '../dashboard/ExamReadinessCard';
import { SubjectDonutChart } from '../dashboard/SubjectDonutChart';
import { AIInsightCard } from '../dashboard/AIInsightCard';
import { StreakCard } from '../dashboard/StreakCard';
import { ResourceUsageCard } from '../dashboard/ResourceUsageCard';
import { StudyTimeDistributionCard } from '../dashboard/StudyTimeDistributionCard';

export const Dashboard: React.FC = () => {
  const { setCurrentPage } = useApp();
  const { lang } = useLanguage();
  const [data, setData] = useState<DashboardResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
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
  };

  useEffect(() => {
    load();
  }, []);

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-16 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-5 py-4 rounded-2xl flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-[#0a3263] animate-spin" />
      </div>
    );
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn max-w-[1400px] mx-auto text-slate-800">

      {/* 0. Next recommended module */}
      {nextModule ? (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4 flex-wrap">
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
            onClick={() => setCurrentPage('study-plan')}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-xs font-bold transition"
          >
            <span>{lang === 'km' ? 'បន្តវគ្គសិក្សា' : 'Continue course'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : hasActivePlan ? (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <p className="text-sm font-medium text-slate-600">
            {lang === 'km' ? 'អ្នកបានបញ្ចប់វគ្គសិក្សានេះទាំងអស់!' : "You're all caught up on your course!"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-5 border border-dashed border-indigo-200 shadow-sm flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm font-medium text-slate-600">
            {lang === 'km' ? 'អ្នកមិនទាន់មានវគ្គសិក្សាទេ' : "You don't have a course yet"}
          </p>
          <button
            onClick={() => setCurrentPage('study-plan')}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
          >
            <span>{lang === 'km' ? 'បង្កើតវគ្គសិក្សា' : 'Create my course'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. SECTION: Activity Summary */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#0a3263]" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
            {lang === 'km' ? 'សង្ខេបសកម្មភាព' : 'Activity Summary'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {countdown ? (
            <CountdownCard days={countdown.days} hours={countdown.hours} minutes={countdown.minutes} />
          ) : (
            <div className="md:col-span-6 bg-[#0a3263] rounded-2xl p-6 text-white flex flex-col justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-300" />
                <h3 className="text-base font-bold tracking-tight">
                  {lang === 'km' ? 'រាប់ថយក្រោយ' : 'Countdown'}
                </h3>
              </div>
              <div className="pt-6">
                <p className="text-xs text-blue-200/80 mb-3">
                  {lang === 'km'
                    ? 'មិនទាន់មានថ្ងៃប្រឡងផ្លូវការនៅឡើយទេ — វគ្គសិក្សារបស់អ្នកដំណើរការទៅតាមវឌ្ឍនភាព មិនមែនតាមកាលបរិច្ឆេទទេ។'
                    : "No confirmed exam date yet — your course is paced by your progress, not a countdown."}
                </p>
                <button
                  onClick={() => setCurrentPage('study-plan')}
                  className="w-full bg-[#12427d] hover:bg-[#184883] transition rounded-xl py-3 px-4 text-xs font-bold border border-blue-400/20"
                >
                  {lang === 'km' ? 'កំណត់ថ្ងៃប្រឡង (ស្រេចចិត្ត)' : 'Set your exam date (optional)'}
                </button>
              </div>
            </div>
          )}

          <OverallProgressCard
            percent={overallProgress.percent}
            lessonsCompleted={overallProgress.lessonsCompleted}
            remaining={overallProgress.remaining}
          />
          <ExamReadinessCard
            score={examReadiness.score}
            maxScore={examReadiness.maxScore}
            statusLabel={examReadiness.statusLabel}
          />
        </div>
      </div>

      {/* 2. SECTION: Assessment & Performance Data */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
          {lang === 'km' ? 'ទិន្នន័យវាយតម្លៃ និងការអនុវត្ត' : 'Assessment & Performance Data'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#0a2540]">
              {lang === 'km' ? 'ចំណេះដឹងតាមមុខវិជ្ជា' : 'Knowledge by Subject'}
            </h3>
            {subjectDonuts.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                {lang === 'km'
                  ? 'កំណត់ក្របខណ្ឌប្រឡងគោលដៅ ដើម្បីមើលចំណេះដឹងតាមមុខវិជ្ជារបស់អ្នក'
                  : 'Set your target exam to see your knowledge by subject'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2 text-center">
                {subjectDonuts.map((s) => (
                  <SubjectDonutChart key={s.subjectId} {...s} />
                ))}
              </div>
            )}
          </div>

          <AIInsightCard
            accuracy={aiInsight.accuracy}
            weeklyChange={aiInsight.weeklyChange}
            weakAreas={aiInsight.weakAreas}
            onReviewWeakAreas={() => setCurrentPage('learning')}
          />
        </div>
      </div>

      {/* 3. SECTION: Study Activity & Behavior */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
          {lang === 'km' ? 'សកម្មភាព និងឥរិយាបថនៃការសិក្សា' : 'Study Activity & Behavior'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StreakCard streakDays={streak.streakDays} activeDayIndices={streak.activeDayIndices} />
          <ResourceUsageCard resources={resourceUsage} />
          <StudyTimeDistributionCard subjects={studyTimeDistribution} />
        </div>
      </div>

      {/* 4. SECTION: Recent Attempts */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0a2540] flex items-center gap-2">
          <History className="w-4 h-4 text-[#0a3263]" />
          <span>{lang === 'km' ? 'ប្រវត្តិការធ្វើតេស្តថ្មីៗ' : 'Recent Attempts'}</span>
        </h3>

        {recentAttempts.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            {lang === 'km' ? 'មិនទាន់មានប្រវត្តិទេ' : 'No history yet'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {recentAttempts.map((a) => (
              <div
                key={a.attemptId}
                className="flex items-center justify-between text-xs bg-slate-50 rounded-xl px-3 py-2 border border-slate-100"
              >
                <span className="font-medium text-slate-700 truncate max-w-[8rem] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {a.title}
                </span>
                <span className="font-bold text-[#0a2540] shrink-0">
                  {a.score !== null ? `${Math.round(a.score)}%` : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
