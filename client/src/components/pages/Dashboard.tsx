<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { getDashboardSummary } from '../../services/progressService';
import { DashboardSummary } from '../../types';
import {
  TrendingUp,
  Award,
  Clock,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ListChecks,
  History,
} from 'lucide-react';
=======
import React from 'react';
import { TrendingUp } from 'lucide-react';

import { CountdownCard } from '../dashboard/CountdownCard';
import { OverallProgressCard } from '../dashboard/OverallProgressCard';
import { ExamReadinessCard } from '../dashboard/ExamReadinessCard';
import { SubjectDonutChart } from '../dashboard/SubjectDonutChart';
import { AIInsightCard } from '../dashboard/AIInsightCard';
import { StreakCard } from '../dashboard/StreakCard';
import { ResourceUsageCard } from '../dashboard/ResourceUsageCard';
import { StudyTimeDistributionCard } from '../dashboard/StudyTimeDistributionCard';

// ---------------------------------------------------------------------------
// Mock Data (Static frontend demonstration)
// ---------------------------------------------------------------------------

const COUNTDOWN_DATA = {
  days: 75,
  hours: 14,
  minutes: 30,
};

const OVERALL_PROGRESS = {
  percent: 68,
  lessonsCompleted: 63,
  remaining: 32,
};

const EXAM_READINESS = {
  score: 75,
  maxScore: 100,
  statusLabel: 'ឱកាសជាប់ប្រឡងខ្ពស់',
};

const SUBJECT_DONUTS = [
  { percent: 75, label: 'គណិតវិទ្យា', completed: 15, total: 20, color: '#0a3263' },
  { percent: 40, label: 'រូបវិទ្យា',   completed: 8,  total: 20, color: '#5c3818' },
  { percent: 90, label: 'វប្បធម៌ទូទៅ', completed: 18, total: 20, color: '#0d7652' },
];

const AI_INSIGHT = {
  accuracy: 82,
  weeklyChange: 5,
  weakAreas: [
    { subject: 'គរុកោសល្យ', topic: 'វិធីសាស្ត្របង្រៀន', color: '#ef4444' },
    { subject: 'ប្រវត្តិវិទ្យា', topic: 'ប្រវត្តិសាស្ត្រទំនើប', color: '#b45309' },
  ],
};

const STREAK_DATA = {
  streakDays: 12,
  activeDayIndices: [0, 1, 2, 3], // Mon-Thu
};

const RESOURCES = [
  { label: 'វីដេអូ',       percent: 75, color: '#0a3263' },
  { label: 'កម្រងសំណួរ', percent: 50, color: '#5c3818' },
  { label: 'ឯកសារអាន',   percent: 45, color: '#0d7652' },
];

const STUDY_TIME_SUBJECTS = [
  { label: 'គណិតវិទ្យា', percent: 50, hours: 62, color: '#0a3263', strokeOffset: 0     },
  { label: 'រូបវិទ្យា',   percent: 30, hours: 37, color: '#5c3818', strokeOffset: 119.3 },
  { label: 'វប្បធម៌ទូទៅ', percent: 20, hours: 25, color: '#0d7652', strokeOffset: 167   },
];

// ---------------------------------------------------------------------------
>>>>>>> 81522dd978733767bfecec89305fca9883cd408e

const PRIORITY_COLOR: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-slate-400',
};

// Placeholder shown in place of a value while the dashboard summary is loading,
// so only the numbers/lists inside each card block — not the whole page — read as "loading".
const Skel: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`inline-block animate-pulse bg-slate-200/70 rounded-md align-middle ${className}`} />
);

const EMPTY_SUMMARY: DashboardSummary = {
  profile: { streakDays: 0, averageScore: 0, studyHoursTotal: 0, completedQuestions: 0, dailyGoalMinutes: 0, targetExamName: null },
  examCountdown: null,
  studyPlan: {
    hasActivePlan: false,
    planId: null,
    totalTasks: 0,
    completedTasks: 0,
    percent: 0,
    todayTotalTasks: 0,
    todayCompletedTasks: 0,
    todayPercent: 0,
    todayDate: null,
    todayTasks: [],
  },
  subjectProficiency: [],
  weakAreas: [],
  recentAttempts: [],
  weeklyActivity: [],
};

export const Dashboard: React.FC = () => {
<<<<<<< HEAD
  const { setCurrentPage } = useApp();
  const { lang } = useLanguage();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardSummary();
      setSummary(res);
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

  // The page layout renders immediately; only the values inside each card
  // swap to skeleton placeholders while `loading` is true, so a slow
  // /progress/dashboard response doesn't blank the whole section.
  const { profile, examCountdown, studyPlan, subjectProficiency, weakAreas, recentAttempts, weeklyActivity } = summary || EMPTY_SUMMARY;
  const displayedSubjects = subjectProficiency.slice(0, 6);
  const attemptAverage = recentAttempts.length
    ? Math.round(recentAttempts.filter((a) => a.score !== null).reduce((s, a) => s + (a.score || 0), 0) / (recentAttempts.filter((a) => a.score !== null).length || 1))
    : null;
  const weekLabels = lang === 'km' ? ['អា', 'ច', 'អ', 'ព', 'ព្រ', 'សុ', 'ស'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn max-w-[1400px] mx-auto text-slate-800">

      {/* 1. SECTION: Activity Summary */}
=======
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn max-w-[1400px] mx-auto text-slate-800">

      {/* ─── Section 1: សង្ខេបសកម្មភាព ─── */}
>>>>>>> 81522dd978733767bfecec89305fca9883cd408e
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#0a3263]" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
            {lang === 'km' ? 'សង្ខេបសកម្មភាព' : 'Activity Summary'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
<<<<<<< HEAD
          {/* Card 1: Countdown - 6 cols */}
          <div className="md:col-span-6 bg-[#0a3263] rounded-2xl p-6 text-white flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <h3 className="text-base font-bold tracking-tight">{lang === 'km' ? 'រាប់ថយក្រោយ' : 'Countdown'}</h3>
              <p className="text-xs text-blue-200/80 mt-0.5">{lang === 'km' ? 'ពេលវេលានៅសល់សម្រាប់ការប្រឡង' : 'Time remaining until your exam'}</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-3 gap-3 pt-6 text-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-[#12427d] rounded-xl py-3 px-2 border border-blue-400/20 space-y-1.5">
                    <Skel className="h-7 w-10 mx-auto" />
                    <Skel className="h-2.5 w-6 mx-auto" />
                  </div>
                ))}
              </div>
            ) : examCountdown && !examCountdown.isPast ? (
              <div className="grid grid-cols-3 gap-3 pt-6 text-center">
                <div className="bg-[#12427d] rounded-xl py-3 px-2 border border-blue-400/20">
                  <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight">{examCountdown.days}</span>
                  <span className="text-[11px] text-blue-200">{lang === 'km' ? 'ថ្ងៃ' : 'Days'}</span>
                </div>
                <div className="bg-[#12427d] rounded-xl py-3 px-2 border border-blue-400/20">
                  <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight">{examCountdown.hours}</span>
                  <span className="text-[11px] text-blue-200">{lang === 'km' ? 'ម៉ោង' : 'Hours'}</span>
                </div>
                <div className="bg-[#12427d] rounded-xl py-3 px-2 border border-blue-400/20">
                  <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight">{examCountdown.minutes}</span>
                  <span className="text-[11px] text-blue-200">{lang === 'km' ? 'នាទី' : 'Minutes'}</span>
                </div>
              </div>
            ) : (
              <div className="pt-6">
                <button
                  onClick={() => setCurrentPage('study-plan')}
                  className="w-full bg-[#12427d] hover:bg-[#184883] transition rounded-xl py-3 px-4 text-xs font-bold border border-blue-400/20"
                >
                  {examCountdown?.isPast
                    ? (lang === 'km' ? 'ថ្ងៃប្រឡងបានកន្លងផុតទៅ' : 'Exam date has passed')
                    : (lang === 'km' ? 'កំណត់ថ្ងៃប្រឡងក្នុងផែនការសិក្សា' : 'Set your exam date in Study Plan')}
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Overall Progress - 3 cols */}
          <div className="md:col-span-3 bg-[#0a3263] rounded-2xl p-6 text-white flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-200/80">{lang === 'km' ? 'វឌ្ឍនភាពសរុប' : 'Overall Progress'}</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  {loading ? <Skel className="h-7 w-14" /> : `${studyPlan.percent}%`}
                </h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#184883] flex items-center justify-center text-blue-200">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <div className="w-full bg-[#12427d] rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-400 h-2 rounded-full" style={{ width: `${loading ? 0 : studyPlan.percent}%` }}></div>
              </div>
              <div className="flex justify-between text-[11px] text-blue-200">
                {loading ? (
                  <>
                    <Skel className="h-3 w-20 bg-blue-200/20" />
                    <Skel className="h-3 w-10 bg-blue-200/20" />
                  </>
                ) : (
                  <>
                    <span>{studyPlan.completedTasks} {lang === 'km' ? 'កិច្ចការបានបញ្ចប់' : 'tasks completed'}</span>
                    <span>{studyPlan.totalTasks} {lang === 'km' ? 'សរុប' : 'total'}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Exam Readiness Score - 3 cols */}
          <div className="md:col-span-3 bg-white rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">{lang === 'km' ? 'ពិន្ទុត្រៀមប្រឡង' : 'Exam Readiness Score'}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  {loading ? (
                    <Skel className="h-8 w-12" />
                  ) : (
                    <>
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#0a2540]">{Math.round(profile.averageScore)}</span>
                      <span className="text-xs text-slate-400 font-bold">{lang === 'km' ? '/១០០' : '/100'}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="pt-6 flex items-center gap-1.5 text-xs font-bold">
              {loading ? (
                <Skel className="h-4 w-32" />
              ) : recentAttempts.length === 0 ? (
                <span className="text-slate-500">{lang === 'km' ? 'មិនទាន់មានប្រវត្តិប្រឡងសាកល្បងទេ' : 'No mock exam history yet'}</span>
              ) : profile.averageScore >= 70 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">{lang === 'km' ? 'ឱកាសជាប់ប្រឡងខ្ពស់' : 'High chance of passing'}</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-600">{lang === 'km' ? 'ត្រូវខិតខំបន្ថែម' : 'Needs more effort'}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION: Assessment & Performance Data */}
=======
          <CountdownCard
            days={COUNTDOWN_DATA.days}
            hours={COUNTDOWN_DATA.hours}
            minutes={COUNTDOWN_DATA.minutes}
          />
          <OverallProgressCard
            percent={OVERALL_PROGRESS.percent}
            lessonsCompleted={OVERALL_PROGRESS.lessonsCompleted}
            remaining={OVERALL_PROGRESS.remaining}
          />
          <ExamReadinessCard
            score={EXAM_READINESS.score}
            maxScore={EXAM_READINESS.maxScore}
            statusLabel={EXAM_READINESS.statusLabel}
          />
        </div>
      </div>

      {/* ─── Section 2: ទិន្នន័យវាយតម្លៃ និងការអនុវត្ត ─── */}
>>>>>>> 81522dd978733767bfecec89305fca9883cd408e
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
          {lang === 'km' ? 'ទិន្នន័យវាយតម្លៃ និងការអនុវត្ត' : 'Assessment & Performance Data'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
<<<<<<< HEAD
          {/* Card: Knowledge by Subject (8 cols) */}
          <div className="md:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#0a2540]">
              {lang === 'km' ? 'ចំណេះដឹងតាមមុខវិជ្ជា' : 'Knowledge by Subject'}
            </h3>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-2 text-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex flex-col items-center space-y-3">
                    <Skel className="w-24 h-24 rounded-full" />
                    <div className="space-y-1.5 flex flex-col items-center">
                      <Skel className="h-3.5 w-20" />
                      <Skel className="h-3 w-14" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedSubjects.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                {lang === 'km' ? 'ធ្វើកម្រងសំណួរ ដើម្បីមើលចំណេះដឹងតាមមុខវិជ្ជារបស់អ្នក' : 'Take a quiz to see your knowledge by subject'}
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-2 text-center">
                {displayedSubjects.map((s) => {
                  const circumference = 251.2;
                  const pct = Math.max(0, Math.min(100, s.proficiency));
                  return (
                    <div key={s.subjectId} className="flex flex-col items-center space-y-3">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#0a3263"
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference * (1 - pct / 100)}
                            strokeLinecap="round"
                            fill="none"
                          />
                        </svg>
                        <span className="absolute text-lg font-bold text-[#0a2540]">{pct}%</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#0a2540] truncate max-w-[8rem]">{s.subjectName}</p>
                        <p className="text-xs text-slate-400">{s.topicsTracked}/{s.topicsTotal} {lang === 'km' ? 'ប្រធានបទ' : 'topics'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card: Mock Accuracy & Weak Areas (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#0a2540]">
                {lang === 'km' ? 'អត្រាភាពត្រឹមត្រូវនៃការប្រឡងសាកល្បង' : 'Mock Exam Accuracy Rate'}
              </h3>
              {loading ? (
                <Skel className="h-8 w-24 mt-2" />
              ) : attemptAverage !== null ? (
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-[#0a2540]">{attemptAverage}%</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {lang === 'km' ? `ពី ${recentAttempts.length} លើកចុងក្រោយ` : `from the last ${recentAttempts.length} attempts`}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-2">{lang === 'km' ? 'មិនទាន់មានប្រវត្តិប្រឡងសាកល្បងទេ' : 'No mock exam history yet'}</p>
              )}
            </div>

            {/* Weak Areas */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#e03131]">
                <AlertTriangle className="w-4 h-4" />
                <span>{lang === 'km' ? 'ចំណុចខ្វះខាត' : 'Weak Areas'}</span>
              </div>
              {loading ? (
                <div className="space-y-2">
                  {[0, 1, 2].map((i) => <Skel key={i} className="h-8 w-full rounded-xl" />)}
                </div>
              ) : weakAreas.length === 0 ? (
                <p className="text-xs text-slate-400">{lang === 'km' ? 'មិនទាន់រកឃើញចំណុចខ្សោយទេ' : 'No weak areas found yet'}</p>
              ) : (
                <div className="space-y-2">
                  {weakAreas.slice(0, 3).map((w) => (
                    <div key={w.weakAreaId} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-[#0a2540] flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_COLOR[w.priority || 'low'] || 'bg-slate-400'}`}></span>
                      <span className="truncate">{w.subjectName}: {w.topicName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECTION: Study Activity & Behavior */}
=======
          {/* Subject knowledge donuts — 8 cols */}
          <div className="md:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#0a2540]">ចំណេះដឹងតាមមុខវិជ្ជា</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2 text-center">
              {SUBJECT_DONUTS.map((s) => (
                <SubjectDonutChart key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* AI Insight — 4 cols */}
          <AIInsightCard
            accuracy={AI_INSIGHT.accuracy}
            weeklyChange={AI_INSIGHT.weeklyChange}
            weakAreas={AI_INSIGHT.weakAreas}
          />
        </div>
      </div>

      {/* ─── Section 3: សកម្មភាព និងឥរិយាបថនៃការសិក្សា ─── */}
>>>>>>> 81522dd978733767bfecec89305fca9883cd408e
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
          {lang === 'km' ? 'សកម្មភាព និងឥរិយាបថនៃការសិក្សា' : 'Study Activity & Behavior'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
<<<<<<< HEAD
          {/* Card 1: Study Streak */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
            <h3 className="text-base font-bold text-[#0a2540]">
              {lang === 'km' ? 'ការសិក្សាជាប់ៗគ្នា' : 'Study Streak'}
            </h3>

            <div className="flex items-center justify-center gap-2 text-[#0a2540] py-2">
              <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
              {loading ? <Skel className="h-7 w-16" /> : <span className="text-2xl font-extrabold">{profile.streakDays} {lang === 'km' ? 'ថ្ងៃ' : 'days'}</span>}
            </div>

            {/* Days of week indicators (last 7 days, real activity) */}
            <div className="flex justify-between items-center pt-2">
              {loading
                ? [0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <Skel className="w-7 h-7 rounded-full" />
                    </div>
                  ))
                : weeklyActivity.map((day) => (
                    <div key={day.date} className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                          day.active
                            ? 'bg-[#0a3263] text-white'
                            : day.isToday
                            ? 'bg-white border-2 border-[#0a3263] text-[#0a3263]'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {weekLabels[new Date(`${day.date}T00:00:00`).getDay()]}
                      </div>
                      <span className={`w-1.5 h-1.5 rounded-full ${day.active ? 'bg-[#0a3263]' : 'bg-transparent'}`} />
                    </div>
                  ))}
            </div>
          </div>

          {/* Card 2: Recent Mock Exam History */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col space-y-4">
            <h3 className="text-base font-bold text-[#0a2540] flex items-center gap-2">
              <History className="w-4 h-4 text-[#0a3263]" />
              <span>{lang === 'km' ? 'ប្រវត្តិប្រឡងសាកល្បងថ្មីៗ' : 'Recent Mock Exam History'}</span>
            </h3>

            {loading ? (
              <div className="space-y-2.5">
                {[0, 1, 2].map((i) => <Skel key={i} className="h-9 w-full rounded-xl" />)}
              </div>
            ) : recentAttempts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">{lang === 'km' ? 'មិនទាន់មានប្រវត្តិទេ' : 'No history yet'}</p>
            ) : (
              <div className="space-y-2.5">
                {recentAttempts.map((a) => (
                  <div key={a.attemptId} className="flex items-center justify-between text-xs bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                    <span className="font-medium text-slate-700 truncate max-w-[10rem]">{a.title}</span>
                    <span className="font-bold text-[#0a2540]">{a.score !== null ? `${Math.round(a.score)}%` : '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 3: Today's Study Tasks */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col space-y-4">
            <h3 className="text-base font-bold text-[#0a2540] flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-[#0a3263]" />
              <span>{lang === 'km' ? 'កិច្ចការសិក្សាថ្ងៃនេះ' : "Today's Study Tasks"}</span>
            </h3>

            {loading ? (
              <div className="space-y-2.5">
                {[0, 1, 2].map((i) => <Skel key={i} className="h-9 w-full rounded-xl" />)}
              </div>
            ) : !studyPlan.hasActivePlan ? (
              <button
                onClick={() => setCurrentPage('study-plan')}
                className="text-xs font-bold text-white bg-[#0a3263] hover:bg-[#12427d] rounded-xl py-3 transition"
              >
                {lang === 'km' ? 'បង្កើតផែនការសិក្សា' : 'Create Study Plan'}
              </button>
            ) : studyPlan.todayTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">{lang === 'km' ? 'មិនមានកិច្ចការសម្រាប់ថ្ងៃនេះទេ' : 'No tasks scheduled for today'}</p>
            ) : (
              <div className="space-y-2.5">
                {studyPlan.todayTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between text-xs bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                    <span className={`font-medium truncate max-w-[9rem] ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.title}</span>
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setCurrentPage('study-plan')}
                  className="w-full text-xs font-bold text-[#0a3263] hover:underline pt-1"
                >
                  {lang === 'km' ? 'មើលផែនការទាំងអស់ →' : 'View Full Plan →'}
                </button>
              </div>
            )}
          </div>
=======
          <StreakCard
            streakDays={STREAK_DATA.streakDays}
            activeDayIndices={STREAK_DATA.activeDayIndices}
          />
          <ResourceUsageCard resources={RESOURCES} />
          <StudyTimeDistributionCard subjects={STUDY_TIME_SUBJECTS} />
>>>>>>> 81522dd978733767bfecec89305fca9883cd408e
        </div>
      </div>

    </div>
  );
};
