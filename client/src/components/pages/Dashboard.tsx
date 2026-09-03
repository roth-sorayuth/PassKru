import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { getDashboardSummary } from '../../services/progressService';
import { DashboardResponseData } from '../../types/dashboard';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Loader2,
  TrendingUp,
} from 'lucide-react';

const WEEKDAY_DOTS_KM = ['ច', 'អ', 'ព', 'ព្រ', 'សុ', 'ស', 'អា'];

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
    hasActivePlan,
    nextModule,
    recentAttempts,
  } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 animate-fadeIn max-w-[1100px] mx-auto text-slate-800">

      {/* Next recommended module */}
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

      {/* Hero: readiness is the one headline metric, everything else here is supporting context */}
      <div className="bg-[#0a3263] rounded-3xl p-6 sm:p-8 text-white shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-300 mb-1.5">
              {lang === 'km' ? 'ពិន្ទុត្រៀមប្រឡង' : 'Exam readiness'}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold leading-none">{examReadiness.score}</span>
              <span className="text-sm text-blue-200">/{examReadiness.maxScore} · {examReadiness.statusLabel}</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-[#12427d] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${overallProgress.percent}%` }} />
                </div>
                <span className="text-xs text-blue-200">
                  {overallProgress.percent}% {lang === 'km' ? 'ស្ទាត់ជំនាញ' : 'topics mastered'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-blue-200">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{streak.streakDays} {lang === 'km' ? 'ថ្ងៃជាប់ៗគ្នា' : 'day streak'}</span>
              </div>
              {countdown && (
                <div className="flex items-center gap-1.5 text-xs text-blue-200">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{countdown.days} {lang === 'km' ? 'ថ្ងៃទៀតដល់ថ្ងៃប្រឡង' : 'days to your exam'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">

        {/* Subject mastery */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#0a2540]">
              {lang === 'km' ? 'ចំណេះដឹងតាមមុខវិជ្ជា' : 'Subject mastery'}
            </h3>
            <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-[11px] font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>{aiInsight.accuracy}% {lang === 'km' ? 'ត្រឹមត្រូវ' : 'accuracy'} · {aiInsight.weeklyChange >= 0 ? '+' : ''}{aiInsight.weeklyChange}%</span>
            </div>
          </div>

          {subjectDonuts.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              {lang === 'km'
                ? 'កំណត់ក្របខណ្ឌប្រឡងគោលដៅ ដើម្បីមើលចំណេះដឹងតាមមុខវិជ្ជារបស់អ្នក'
                : 'Set your target exam to see your knowledge by subject'}
            </p>
          ) : (
            <div className="space-y-3">
              {subjectDonuts.map((s) => (
                <div key={s.subjectId}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{s.label}</span>
                    <span className="text-slate-400">{s.percent}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.percent}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {aiInsight.weakAreas.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
              {aiInsight.weakAreas.map((w, idx) => (
                <span
                  key={`${w.subject}-${w.topic}-${idx}`}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ color: w.color, backgroundColor: `${w.color}1a` }}
                >
                  {w.subject}: {w.topic}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* This week: activity strip + recent attempts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="text-sm font-bold text-[#0a2540] mb-4">
            {lang === 'km' ? 'សប្តាហ៍នេះ' : 'This week'}
          </h3>

          <div className="flex justify-between mb-5">
            {WEEKDAY_DOTS_KM.map((label, idx) => {
              const active = streak.activeDayIndices.includes(idx);
              return (
                <div
                  key={idx}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    active ? 'bg-[#0a3263] text-white' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {label}
                </div>
              );
            })}
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {lang === 'km' ? 'ប្រវត្តិការធ្វើតេស្តថ្មីៗ' : 'Recent attempts'}
          </p>
          {recentAttempts.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">
              {lang === 'km' ? 'មិនទាន់មានប្រវត្តិទេ' : 'No history yet'}
            </p>
          ) : (
            <div className="space-y-1.5">
              {recentAttempts.map((a) => (
                <div key={a.attemptId} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 truncate max-w-[9rem]">{a.title}</span>
                  <span className="font-bold text-[#0a2540] shrink-0">
                    {a.score !== null ? `${Math.round(a.score)}%` : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
