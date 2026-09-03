import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getDashboardSummary } from '../../services/progressService';
import { DashboardSummary } from '../../types';
import {
  TrendingUp,
  AlertTriangle,
  Flame,
  ListChecks,
  History,
} from 'lucide-react';

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

const KH_WEEK_DAYS = ['អា', 'ច', 'អ', 'ព', 'ព្រ', 'សុ', 'ស'];

export const Dashboard: React.FC = () => {
  const { setCurrentPage } = useApp();
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
      setError(err?.message || 'បរាជ័យក្នុងការទាញយកទិន្នន័យផ្ទាំងគ្រប់គ្រង');
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

  const { profile, examCountdown, studyPlan, subjectProficiency, weakAreas, recentAttempts, weeklyActivity } = summary || EMPTY_SUMMARY;
  const displayedSubjects = subjectProficiency.slice(0, 6);
  const attemptAverage = recentAttempts.length
    ? Math.round(recentAttempts.filter((a) => a.score !== null).reduce((s, a) => s + (a.score || 0), 0) / (recentAttempts.filter((a) => a.score !== null).length || 1))
    : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn max-w-[1400px] mx-auto text-slate-800">

      {/* 1. SECTION: Activity Summary (សង្ខេបសកម្មភាព) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#0a3263]" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
            សង្ខេបសកម្មភាព
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 1: Countdown - 6 cols */}
          <div className="md:col-span-6 bg-[#0a3263] rounded-2xl p-6 text-white flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <h3 className="text-base font-bold tracking-tight">រាប់ថយក្រោយ</h3>
              <p className="text-xs text-blue-200/80 mt-0.5">ពេលវេលានៅសល់សម្រាប់ការប្រឡង</p>
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
                  <span className="text-3xl sm:text-4xl font-extrabold block">{examCountdown.days}</span>
                  <span className="text-xs text-blue-200/70 font-semibold">ថ្ងៃ</span>
                </div>
                <div className="bg-[#12427d] rounded-xl py-3 px-2 border border-blue-400/20">
                  <span className="text-3xl sm:text-4xl font-extrabold block">{examCountdown.hours}</span>
                  <span className="text-xs text-blue-200/70 font-semibold">ម៉ោង</span>
                </div>
                <div className="bg-[#12427d] rounded-xl py-3 px-2 border border-blue-400/20">
                  <span className="text-3xl sm:text-4xl font-extrabold block">{examCountdown.minutes}</span>
                  <span className="text-xs text-blue-200/70 font-semibold">នាទី</span>
                </div>
              </div>
            ) : (
              <div className="pt-6">
                <p className="text-xs text-blue-200/80">
                  {profile.targetExamName
                    ? `ការប្រឡង ${profile.targetExamName} មិនទាន់មានកាលវិភាគជាក់លាក់នៅឡើយទេ`
                    : 'សូមជ្រើសរើសការប្រឡងគោលដៅនៅក្នុងកម្រងព័ត៌មានរបស់អ្នក'}
                </p>
              </div>
            )}

            <div className="pt-6 flex justify-between items-center text-xs text-blue-200/70 border-t border-blue-400/20 mt-4">
              <span className="truncate">{profile.targetExamName || 'មិនទាន់កំណត់ការប្រឡង'}</span>
              <span className="font-semibold text-white shrink-0">
                {examCountdown && !examCountdown.isPast ? 'ថ្ងៃប្រឡង' : 'ស្ថានភាព'}
              </span>
            </div>
          </div>

          {/* Card 2: Overall Progress - 3 cols */}
          <div className="md:col-span-3 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0a2540]">វឌ្ឍនភាពសរុប</h3>
              <p className="text-xs text-slate-400 mt-0.5">កិច្ចការនៃផែនការសិក្សា</p>
            </div>

            <div className="py-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#0a2540]">
                  {loading ? <Skel className="h-10 w-20" /> : `${studyPlan.percent}%`}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3 overflow-hidden">
                <div
                  className="bg-[#0a3263] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, studyPlan.percent))}%` }}
                />
              </div>
            </div>

            <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>បានបញ្ចប់:</span>
                <span className="font-bold text-[#0a2540]">
                  {loading ? <Skel className="h-3 w-6" /> : studyPlan.completedTasks}
                </span>
              </div>
              <div className="flex justify-between">
                <span>នៅសល់:</span>
                <span className="font-bold text-[#0a2540]">
                  {loading ? <Skel className="h-3 w-6" /> : Math.max(0, studyPlan.totalTasks - studyPlan.completedTasks)}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Today's Tasks - 3 cols */}
          <div className="md:col-span-3 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0a2540]">កិច្ចការថ្ងៃនេះ</h3>
                <p className="text-xs text-slate-400 mt-0.5">ផែនការសិក្សាប្រចាំថ្ងៃ</p>
              </div>
              <ListChecks className="w-5 h-5 text-indigo-600" />
            </div>

            <div className="py-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#0a2540]">
                  {loading ? <Skel className="h-9 w-16" /> : `${studyPlan.todayCompletedTasks}/${studyPlan.todayTotalTasks}`}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {loading ? '' : `(${studyPlan.todayPercent}%)`}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentPage('study-plan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full text-center py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition cursor-pointer"
            >
              {studyPlan.hasActivePlan
                ? 'មើលផែនការសិក្សា →'
                : 'បង្កើតផែនការសិក្សា →'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. SECTION: Knowledge & Mastery (ចំណេះដឹង និងការស្ទាត់ជំនាញ) */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
          ចំណេះដឹង និងការស្ទាត់ជំនាញ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card: Knowledge by Subject (8 cols) */}
          <div className="md:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#0a2540]">
              ចំណេះដឹងតាមមុខវិជ្ជា
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
                ធ្វើកម្រងសំណួរ ដើម្បីមើលចំណេះដឹងតាមមុខវិជ្ជារបស់អ្នក
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
                        <p className="text-xs text-slate-400">{s.topicsTracked}/{s.topicsTotal} ប្រធានបទ</p>
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
                អត្រាភាពត្រឹមត្រូវនៃការប្រឡងសាកល្បង
              </h3>
              {loading ? (
                <Skel className="h-8 w-24 mt-2" />
              ) : attemptAverage !== null ? (
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-[#0a2540]">{attemptAverage}%</span>
                  <span className="text-xs text-slate-500 font-medium">
                    ពី {recentAttempts.length} លើកចុងក្រោយ
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-2">មិនទាន់មានប្រវត្តិប្រឡងសាកល្បងទេ</p>
              )}
            </div>

            {/* Weak Areas */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#e03131]">
                <AlertTriangle className="w-4 h-4" />
                <span>ចំណុចខ្វះខាត</span>
              </div>
              {loading ? (
                <div className="space-y-2">
                  {[0, 1, 2].map((i) => <Skel key={i} className="h-8 w-full rounded-xl" />)}
                </div>
              ) : weakAreas.length === 0 ? (
                <p className="text-xs text-slate-400">មិនទាន់រកឃើញចំណុចខ្សោយទេ</p>
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

      {/* 3. SECTION: Study Activity & Behavior (សកម្មភាព និងឥរិយាបថនៃការសិក្សា) */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
          សកម្មភាព និងឥរិយាបថនៃការសិក្សា
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Study Streak */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
            <h3 className="text-base font-bold text-[#0a2540]">
              ការសិក្សាជាប់ៗគ្នា
            </h3>

            <div className="flex items-center justify-center gap-2 text-[#0a2540] py-2">
              <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
              {loading ? <Skel className="h-7 w-16" /> : <span className="text-2xl font-extrabold">{profile.streakDays} ថ្ងៃ</span>}
            </div>

            {/* Days of week indicators (last 7 days, real activity in Khmer) */}
            <div className="flex justify-between items-center pt-2">
              {weeklyActivity.map((day, idx) => (
                <div key={day.date} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      day.active ? 'bg-[#0a3263] text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {KH_WEEK_DAYS[idx] || day.dayOfWeek}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Questions & Study Stats */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <h3 className="text-base font-bold text-[#0a2540]">
              ស្ថិតិនៃការរៀន
            </h3>

            <div className="space-y-3 py-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-600 font-medium">សំណួរដែលបានធ្វើ</span>
                <span className="text-base font-extrabold text-[#0a2540]">
                  {loading ? <Skel className="h-5 w-12" /> : profile.completedQuestions}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-600 font-medium">ម៉ោងសិក្សាសរុប</span>
                <span className="text-base font-extrabold text-[#0a2540]">
                  {loading ? <Skel className="h-5 w-10" /> : `${profile.studyHoursTotal} ម៉ោង`}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              គោលដៅប្រចាំថ្ងៃ៖ {profile.dailyGoalMinutes} នាទី
            </p>
          </div>

          {/* Card 3: Recent Activity Log */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0a2540]">
                សកម្មភាពថ្មីៗ
              </h3>
              <History className="w-4 h-4 text-slate-400" />
            </div>

            {loading ? (
              <div className="space-y-2 py-2">
                {[0, 1, 2].map((i) => <Skel key={i} className="h-10 w-full rounded-xl" />)}
              </div>
            ) : recentAttempts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                មិនទាន់មានសកម្មភាពថ្មីៗទេ
              </p>
            ) : (
              <div className="space-y-2 py-1">
                {recentAttempts.slice(0, 3).map((a) => (
                  <div key={a.attemptId} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-[#0a2540] truncate">{a.title || 'ការសាកល្បង'}</p>
                      <p className="text-[10px] text-slate-400">{new Date(a.startTime).toLocaleDateString('km-KH')}</p>
                    </div>
                    <span className="font-extrabold text-sm text-[#0a3263] shrink-0">
                      {a.score !== null ? `${a.score}%` : '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                setCurrentPage('quizzes');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full text-center py-2 text-xs font-bold text-[#0a3263] hover:text-[#082447] transition cursor-pointer"
            >
              ធ្វើកម្រងសំណួរបន្ថែម →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
