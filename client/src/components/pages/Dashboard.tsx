import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getDashboardSummary } from '../../services/progressService';
import { DashboardSummary } from '../../types';
import {
  TrendingUp,
  Award,
  Clock,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Loader2,
  ListChecks,
  History,
} from 'lucide-react';

const PRIORITY_COLOR: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-slate-400',
};

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
      setError(err?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-[#0a3263] animate-spin" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="max-w-lg mx-auto mt-16 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-5 py-4 rounded-2xl flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 shrink-0" />
        <span>{error || 'No dashboard data available.'}</span>
      </div>
    );
  }

  const { profile, examCountdown, studyPlan, subjectProficiency, weakAreas, recentAttempts, weeklyActivity } = summary;
  const displayedSubjects = subjectProficiency.slice(0, 6);
  const attemptAverage = recentAttempts.length
    ? Math.round(recentAttempts.filter((a) => a.score !== null).reduce((s, a) => s + (a.score || 0), 0) / (recentAttempts.filter((a) => a.score !== null).length || 1))
    : null;
  const weekLabels = ['អា', 'ច', 'អ', 'ព', 'ព្រ', 'សុ', 'ស'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn max-w-[1400px] mx-auto text-slate-800">

      {/* 1. SECTION: សង្ខេបសកម្មភាព */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#0a3263]" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
            សង្ខេបសកម្មភាព
          </h2>
        </div>

        {/* Top 3 Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 1: រាប់ថយក្រោយ (Countdown) - 6 cols */}
          <div className="md:col-span-6 bg-[#0a3263] rounded-2xl p-6 text-white flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <h3 className="text-base font-bold tracking-tight">រាប់ថយក្រោយ</h3>
              <p className="text-xs text-blue-200/80 mt-0.5">ពេលវេលានៅសល់សម្រាប់ការប្រឡង</p>
            </div>

            {examCountdown && !examCountdown.isPast ? (
              <div className="grid grid-cols-3 gap-3 pt-6 text-center">
                <div className="bg-[#12427d] rounded-xl py-3 px-2 border border-blue-400/20">
                  <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight">{examCountdown.days}</span>
                  <span className="text-[11px] text-blue-200">ថ្ងៃ</span>
                </div>
                <div className="bg-[#12427d] rounded-xl py-3 px-2 border border-blue-400/20">
                  <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight">{examCountdown.hours}</span>
                  <span className="text-[11px] text-blue-200">ម៉ោង</span>
                </div>
                <div className="bg-[#12427d] rounded-xl py-3 px-2 border border-blue-400/20">
                  <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight">{examCountdown.minutes}</span>
                  <span className="text-[11px] text-blue-200">នាទី</span>
                </div>
              </div>
            ) : (
              <div className="pt-6">
                <button
                  onClick={() => setCurrentPage('study-plan')}
                  className="w-full bg-[#12427d] hover:bg-[#184883] transition rounded-xl py-3 px-4 text-xs font-bold border border-blue-400/20"
                >
                  {examCountdown?.isPast ? 'ថ្ងៃប្រឡងបានកន្លងផុតទៅ' : 'កំណត់ថ្ងៃប្រឡងក្នុងផែនការសិក្សា'}
                </button>
              </div>
            )}
          </div>

          {/* Card 2: វឌ្ឍនភាពសរុប (Progress) - 3 cols */}
          <div className="md:col-span-3 bg-[#0a3263] rounded-2xl p-6 text-white flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-200/80">វឌ្ឍនភាពសរុប</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-1">{studyPlan.percent}%</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#184883] flex items-center justify-center text-blue-200">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <div className="w-full bg-[#12427d] rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-400 h-2 rounded-full" style={{ width: `${studyPlan.percent}%` }}></div>
              </div>
              <div className="flex justify-between text-[11px] text-blue-200">
                <span>{studyPlan.completedTasks} កិច្ចការបានបញ្ចប់</span>
                <span>{studyPlan.totalTasks} សរុប</span>
              </div>
            </div>
          </div>

          {/* Card 3: ពិន្ទុត្រៀមប្រឡង (Score) - 3 cols */}
          <div className="md:col-span-3 bg-white rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">ពិន្ទុត្រៀមប្រឡង</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#0a2540]">{Math.round(profile.averageScore)}</span>
                  <span className="text-xs text-slate-400 font-bold">/១០០</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="pt-6 flex items-center gap-1.5 text-xs font-bold">
              {recentAttempts.length === 0 ? (
                <span className="text-slate-500">មិនទាន់មានប្រវត្តិប្រឡងសាកល្បងទេ</span>
              ) : profile.averageScore >= 70 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">ឱកាសជាប់ប្រឡងខ្ពស់</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-600">ត្រូវខិតខំបន្ថែម</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION: ទិន្នន័យវាយតម្លៃ និងការអនុវត្ត */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
          ទិន្នន័យវាយតម្លៃ និងការអនុវត្ត
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card: ចំណេះដឹងតាមមុខវិជ្ជា (8 cols) */}
          <div className="md:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#0a2540]">
              ចំណេះដឹងតាមមុខវិជ្ជា
            </h3>

            {displayedSubjects.length === 0 ? (
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

          {/* Card: អត្រាភាពត្រឹមត្រូវ & ចំណុចខ្វះខាត (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#0a2540]">
                អត្រាភាពត្រឹមត្រូវនៃការប្រឡងសាកល្បង
              </h3>
              {attemptAverage !== null ? (
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-[#0a2540]">{attemptAverage}%</span>
                  <span className="text-xs text-slate-500 font-medium">ពី {recentAttempts.length} លើកចុងក្រោយ</span>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-2">មិនទាន់មានប្រវត្តិប្រឡងសាកល្បងទេ</p>
              )}
            </div>

            {/* ចំណុចខ្វះខាត */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#e03131]">
                <AlertTriangle className="w-4 h-4" />
                <span>ចំណុចខ្វះខាត</span>
              </div>
              {weakAreas.length === 0 ? (
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

      {/* 3. SECTION: សកម្មភាព និងឥរិយាបថនៃការសិក្សា */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
          សកម្មភាព និងឥរិយាបថនៃការសិក្សា
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: ការសិក្សាជាប់ៗគ្នា (Streak) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
            <h3 className="text-base font-bold text-[#0a2540]">
              ការសិក្សាជាប់ៗគ្នា
            </h3>

            <div className="flex items-center justify-center gap-2 text-[#0a2540] py-2">
              <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
              <span className="text-2xl font-extrabold">{profile.streakDays} ថ្ងៃ</span>
            </div>

            {/* Days of week indicators (last 7 days, real activity) */}
            <div className="flex justify-between items-center pt-2">
              {weeklyActivity.map((day, idx) => (
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

          {/* Card 2: ប្រវត្តិប្រឡងសាកល្បង */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col space-y-4">
            <h3 className="text-base font-bold text-[#0a2540] flex items-center gap-2">
              <History className="w-4 h-4 text-[#0a3263]" />
              <span>ប្រវត្តិប្រឡងសាកល្បងថ្មីៗ</span>
            </h3>

            {recentAttempts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">មិនទាន់មានប្រវត្តិទេ</p>
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

          {/* Card 3: ផែនការសិក្សាថ្ងៃនេះ */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col space-y-4">
            <h3 className="text-base font-bold text-[#0a2540] flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-[#0a3263]" />
              <span>កិច្ចការសិក្សាថ្ងៃនេះ</span>
            </h3>

            {!studyPlan.hasActivePlan ? (
              <button
                onClick={() => setCurrentPage('study-plan')}
                className="text-xs font-bold text-white bg-[#0a3263] hover:bg-[#12427d] rounded-xl py-3 transition"
              >
                បង្កើតផែនការសិក្សា
              </button>
            ) : studyPlan.todayTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">មិនមានកិច្ចការសម្រាប់ថ្ងៃនេះទេ</p>
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
                  មើលផែនការទាំងអស់ →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
