import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Award,
  Calendar,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Sparkles,
  BarChart3,
  Target
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { userProfile, setCurrentPage, startMockExamById } = useApp();

  const subjectBreakdown = [
    { subject: { km: 'វប្បធម៌ទូទៅ (General Culture)', en: 'General Culture' }, score: 88, color: 'bg-emerald-500', status: 'strong' },
    { subject: { km: 'ច្បាប់ស្តីពីការអប់រំ (Education Law)', en: 'Education Law' }, score: 82, color: 'bg-blue-500', status: 'good' },
    { subject: { km: 'អក្សរសាស្ត្រខ្មែរ (Khmer Literature)', en: 'Khmer Literature' }, score: 76, color: 'bg-indigo-500', status: 'good' },
    { subject: { km: 'គណិតវិទ្យា & តក្កវិទ្យា (Math & Logic)', en: 'Math & Logic' }, score: 70, color: 'bg-amber-500', status: 'moderate' },
    { subject: { km: 'ចិត្តវិទ្យាអប់រំ (Educational Psychology)', en: 'Educational Psychology' }, score: 42, color: 'bg-rose-500', status: 'weak' },
  ];

  const recentMockHistory = [
    { name: 'Mock Exam #01 (NIE General Culture)', date: '10 សីហា 2026', score: 38, max: 50, percent: 76 },
    { name: 'Mock Exam #02 (NIE Pedagogy Full)', date: '14 សីហា 2026', score: 40, max: 50, percent: 80 },
    { name: 'Mock Exam #03 (State Simulation 2026)', date: '18 សីហា 2026', score: 42, max: 50, percent: 84 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <TrendingUp className="w-4 h-4" />
          <span>{lang === 'km' ? 'ផ្ទាំងតាមដានការរីកចម្រើន' : 'Preparation & Mastery Analytics'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          {t('navProgress')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {lang === 'km'
            ? 'តាមដានការវិវត្តពិន្ទុ Mock Exam ភាពស្ទាត់ជំនាញតាមមុខវិជ្ជា និងសន្ទុះនៃការរៀនសូត្រ។'
            : 'Track mock exam score trajectories, subject-level mastery rates, and consistent study streaks.'}
        </p>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{lang === 'km' ? 'ភាពរួចរាល់សរុប' : 'Exam Readiness'}</span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600">78%</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-600 h-full w-[78%]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{t('recentScore')}</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">84%</p>
          <span className="text-[11px] text-emerald-700 font-semibold">+8% {lang === 'km' ? 'កើនឡើង' : 'improved'}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{t('studyStreak')}</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{userProfile.streakDays} {lang === 'km' ? 'ថ្ងៃ' : 'Days'}</p>
          <span className="text-[11px] text-amber-600 font-medium">{lang === 'km' ? 'ជាប់គ្នាល្អណាស់' : 'Consistent learner'}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{lang === 'km' ? 'សំណួរបានដោះស្រាយ' : 'Questions Solved'}</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-600">{userProfile.completedQuestions}</p>
          <span className="text-[11px] text-slate-500 font-medium">{userProfile.studyHoursTotal} {lang === 'km' ? 'ម៉ោងសរុប' : 'total hours'}</span>
        </div>
      </div>

      {/* Main Breakdown: Subject Mastery & Mock Score Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subject Mastery Progress Bars */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>{lang === 'km' ? 'កម្រិតសមត្ថភាពតាមមុខវិជ្ជា' : 'Subject Mastery Breakdown'}</span>
            </h2>
            <button
              onClick={() => setCurrentPage('weakness')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
            >
              {lang === 'km' ? 'កែលម្អចំណុចខ្សោយ' : 'Fix weak areas'}
            </button>
          </div>

          <div className="space-y-4">
            {subjectBreakdown.map((subj, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{subj.subject[lang]}</span>
                  <span className={`font-bold ${
                    subj.score >= 80 ? 'text-emerald-600' : subj.score >= 60 ? 'text-indigo-600' : 'text-rose-600'
                  }`}>
                    {subj.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${subj.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${subj.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mock Exam History Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>{lang === 'km' ? 'ប្រវត្តិនៃការប្រឡងសាកល្បង Mock' : 'Mock Exam Score Trajectory'}</span>
            </h2>
            <button
              onClick={() => startMockExamById('mock-nie-2026-01')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
            >
              + {lang === 'km' ? 'ប្រឡងថ្មី' : 'New Mock'}
            </button>
          </div>

          <div className="space-y-3">
            {recentMockHistory.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-indigo-600">{m.score}/{m.max}</p>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {m.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => startMockExamById('mock-nie-2026-01')}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{lang === 'km' ? 'ចូលរួមការប្រឡងសាកល្បងបន្ទាប់' : 'Take Next Timed Mock Exam'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
