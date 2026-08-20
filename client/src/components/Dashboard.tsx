import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { mockAnnouncements } from '../data/mockData';
import {
  Sparkles,
  Flame,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Play,
  Layers,
  BookOpen,
  Calendar,
  ChevronRight,
  TrendingUp,
  Target,
  FileCheck2,
  Bell,
  Check
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { lang, t } = useLanguage();
  const {
    userProfile,
    studyTasks,
    toggleTaskCompletion,
    weakAreas,
    examCountdownDays,
    setCurrentPage,
    startQuizById,
    startMockExamById,
    setSelectedAnnouncement
  } = useApp();

  const completedCount = studyTasks.filter(t => t.completed).length;
  const totalTasks = studyTasks.length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const getExamTargetTitle = () => {
    switch (userProfile.targetExam) {
      case 'nie':
        return { km: 'វិទ្យាស្ថានជាតិអប់រំ (NIE - គ្រូវិទ្យាល័យ)', en: 'National Institute of Education (NIE 2026)' };
      case 'rttc':
        return { km: 'គរុកោសល្យភូមិភាគ (RTTC - គ្រូអនុ)', en: 'Regional Teacher Training (RTTC 2026)' };
      case 'pttc':
        return { km: 'គរុកោសល្យរាជធានី-ខេត្ត (PTTC - គ្រូបឋម)', en: 'Provincial Teacher Training (PTTC 2026)' };
      default:
        return { km: 'គរុកោសល្យមត្តេយ្យ (គ្រូមត្តេយ្យ)', en: 'Kindergarten Teacher Training 2026' };
    }
  };

  const targetTitle = getExamTargetTitle();

  const handleOpenAnnouncement = (ann: any) => {
    setSelectedAnnouncement(ann);
    setCurrentPage('announcement-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn max-w-[1600px] mx-auto">
      {/* 12-Column Responsive Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Column (8 Cols on desktop) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Hero Banner with Professional Polish Gradient & Circular Progress */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-500 rounded-2xl p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-lg shadow-indigo-500/10">
            <div className="space-y-1">
              <p className="text-indigo-100 text-xs sm:text-sm font-medium">
                {lang === 'km' ? `គោលដៅបច្ចុប្បន្ន៖ ${targetTitle.km}` : `Current Goal: ${targetTitle.en}`}
              </p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {lang === 'km'
                  ? `ថ្ងៃទី ២៥ តុលា ២០២៦ — នៅសល់ ${examCountdownDays} ថ្ងៃ`
                  : `October 25, 2026 — ${examCountdownDays} Days Remaining`}
              </h2>
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => startMockExamById('mock-nie-2026-01')}
                  className="bg-white hover:bg-slate-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition cursor-pointer flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-indigo-600" />
                  <span>{lang === 'km' ? 'ចាប់ផ្តើមរៀនថ្ងៃនេះ' : "Start Today's Session"}</span>
                </button>
                <span className="text-xs sm:text-sm text-indigo-50 font-medium">
                  {userProfile.streakDays}-{lang === 'km' ? 'ថ្ងៃសិក្សាជាប់គ្នា! 🔥' : 'Day Study Streak! 🔥'}
                </span>
              </div>
            </div>

            {/* Circular Readiness Indicator */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center relative shrink-0 self-center sm:self-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-indigo-400/40"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white transition-all duration-1000"
                  strokeDasharray="326.7"
                  strokeDashoffset="75"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl sm:text-2xl font-black italic text-white">77%</span>
                <span className="text-[9px] uppercase tracking-wider text-indigo-100 font-semibold">{lang === 'km' ? 'ត្រៀមខ្លួន' : 'Ready'}</span>
              </div>
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                {t('recentScore')}
              </p>
              <p className="text-2xl font-bold text-slate-800">84%</p>
              <p className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                <span>+4%</span>
                <span className="text-slate-400 font-normal">{lang === 'km' ? 'ធៀបនឹងសប្តាហ៍មុន' : 'from last week'}</span>
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                {lang === 'km' ? 'ម៉ោងសិក្សា' : 'Study Time'}
              </p>
              <p className="text-2xl font-bold text-slate-800">{userProfile.studyHoursTotal}h</p>
              <p className="text-slate-400 text-xs font-medium">
                {lang === 'km' ? 'សរុបសប្តាហ៍នេះ' : 'Total this week'}
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                {lang === 'km' ? 'លំហាត់បានឆ្លើយ' : 'Questions'}
              </p>
              <p className="text-2xl font-bold text-slate-800">{userProfile.completedQuestions}</p>
              <p className="text-indigo-600 text-xs font-medium">
                {lang === 'km' ? 'ចំណាត់ថ្នាក់ #12 ក្នុងវប្បធម៌ទូទៅ' : 'Rank #12 in General Culture'}
              </p>
            </div>
          </div>

          {/* Today's Study Plan Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  {lang === 'km' ? "ផែនការសិក្សាថ្ងៃនេះ" : "Today's Study Plan"}
                </h3>
                <span className="text-xs text-slate-400 font-medium">({completedCount}/{totalTasks})</span>
              </div>
              <button
                onClick={() => setCurrentPage('study-plan')}
                className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold cursor-pointer"
              >
                {lang === 'km' ? 'កែប្រែផែនការ' : 'Edit Plan'}
              </button>
            </div>

            <div className="p-5 space-y-3">
              {studyTasks.map((task, idx) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 p-3.5 rounded-xl border transition ${
                    task.completed
                      ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                      : idx === 0
                      ? 'bg-slate-50 border-slate-200/90 text-slate-800'
                      : 'border-slate-100 hover:border-slate-200 text-slate-800'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 ${
                      task.completed
                        ? 'bg-slate-100 border-slate-200 text-slate-400'
                        : idx === 0
                        ? 'bg-white border-slate-200 text-indigo-600'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    0{idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title?.[lang] || task.title?.km || ''}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {lang === 'km' ? task.subjectKm : task.subject} • {task.estimatedMinutes} {lang === 'km' ? 'នាទី' : 'mins'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {idx === 0 && !task.completed && (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-wider">
                        Priority
                      </span>
                    )}

                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Column (4 Cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Weakness Analysis Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">
                {lang === 'km' ? 'វិភាគចំណុចខ្សោយ' : 'Weakness Analysis'}
              </h3>
              <button
                onClick={() => setCurrentPage('weakness')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                {lang === 'km' ? 'មើលលម្អិត' : 'View all'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-600 uppercase tracking-wider font-semibold">
                    {lang === 'km' ? 'ចិត្តវិទ្យាអប់រំ (PIAGET)' : 'LOGIC & IQ'}
                  </span>
                  <span className="text-rose-500 font-bold">42% {lang === 'km' ? 'ត្រឹមត្រូវ' : 'Accuracy'}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-400 h-full w-[42%] rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-600 uppercase tracking-wider font-semibold">
                    {lang === 'km' ? 'វិធីសាស្ត្របង្រៀន (DIDACTICS)' : 'DIDACTICS'}
                  </span>
                  <span className="text-amber-500 font-bold">58% {lang === 'km' ? 'ត្រឹមត្រូវ' : 'Accuracy'}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[58%] rounded-full" />
                </div>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="p-3.5 bg-indigo-50/80 rounded-xl border border-indigo-100 space-y-1.5">
              <p className="text-xs text-indigo-950 leading-relaxed">
                <span className="font-bold">{lang === 'km' ? 'ការណែនាំ៖ ' : 'Recommendation: '}</span>
                {lang === 'km'
                  ? 'ធ្វើកម្រងសំណួរចិត្តវិទ្យា Piaget ដើម្បីបង្កើនពិន្ទុមុនពេលប្រឡង Mock Exam។'
                  : 'Take the Logic-Specific Quiz to improve your score before the mock exam.'}
              </p>
              <button
                onClick={() => startQuizById('quiz-psy-01')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>{lang === 'km' ? 'អនុវត្តឥឡូវនេះ' : 'Practice Now'}</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>

          {/* Latest Announcements Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">
                  {lang === 'km' ? 'សេចក្តីប្រកាសចុងក្រោយ' : 'Latest Announcements'}
                </h3>
                <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  MoEYS
                </span>
              </div>

              <div className="space-y-3.5">
                {mockAnnouncements.slice(0, 3).map((ann, i) => (
                  <div
                    key={ann.id}
                    onClick={() => handleOpenAnnouncement(ann)}
                    className={`pl-3.5 py-1 transition cursor-pointer hover:opacity-80 ${
                      i === 0 ? 'border-l-4 border-indigo-500' : 'border-l-4 border-slate-200'
                    }`}
                  >
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                      {ann.title?.[lang] || ann.title?.km || ''}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {ann.date} • {lang === 'km' ? 'ក្រសួងអប់រំ យុវជន និងកីឡា' : 'Ministry of Education'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('exam-info')}
              className="w-full mt-3 border border-slate-200 text-slate-700 hover:bg-slate-50 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              {lang === 'km' ? 'មើលសេចក្តីប្រកាសទាំងអស់' : 'View All Announcements'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
