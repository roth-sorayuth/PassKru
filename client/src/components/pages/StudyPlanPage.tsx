import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { StudyTask, ExamTarget } from '../../types';
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Play,
  RotateCcw,
  Sliders,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  BookOpen,
  Check
} from 'lucide-react';

export const StudyPlanPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const {
    userProfile,
    setUserProfile,
    studyTasks,
    toggleTaskCompletion,
    setCurrentPage,
    startQuizById,
  } = useApp();

  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const [targetExam, setTargetExam] = useState<ExamTarget>(userProfile.targetExam);
  const [dailyHours, setDailyHours] = useState<number>(60);
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [prioritySubjects, setPrioritySubjects] = useState<string[]>(['pedagogy', 'culture']);

  const completedCount = studyTasks.filter(t => t.completed).length;
  const totalTasks = studyTasks.length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const weeklySchedule = [
    { day: { km: 'ច័ន្ទ', en: 'Mon' }, subject: { km: 'គរុកោសល្យទូទៅ & វិធីសាស្ត្រ', en: 'General Pedagogy & Methods' }, duration: '60 min', status: 'done' },
    { day: { km: 'អង្គារ', en: 'Tue' }, subject: { km: 'ចិត្តវិទ្យាអប់រំ (Piaget & Vygotsky)', en: 'Educational Psychology' }, duration: '45 min', status: 'done' },
    { day: { km: 'ពុធ', en: 'Wed' }, subject: { km: 'វប្បធម៌ទូទៅ & ច្បាប់អប់រំកម្ពុជា', en: 'General Culture & MoEYS Law' }, duration: '60 min', status: 'today' },
    { day: { km: 'ព្រហស្បតិ៍', en: 'Thu' }, subject: { km: 'វិញ្ញាសាចាស់ៗ ២០២៤ (MCQ)', en: 'Past Papers 2024 (MCQ)' }, duration: '60 min', status: 'upcoming' },
    { day: { km: 'សុក្រ', en: 'Fri' }, subject: { km: 'មុខវិជ្ជាឯកទេសទី១ (តាមជំនាញ)', en: 'Major Subject Specialization' }, duration: '90 min', status: 'upcoming' },
    { day: { km: 'សៅរ៍', en: 'Sat' }, subject: { km: 'ប្រឡងសាកល្បង Mock Exam (៤៥ នាទី)', en: 'Full Mock Exam Simulation' }, duration: '60 min', status: 'upcoming' },
    { day: { km: 'អាទិត្យ', en: 'Sun' }, subject: { km: 'រំលឹកចំណុចខ្សោយ & Flashcards', en: 'Weakness Review & Flashcards' }, duration: '45 min', status: 'upcoming' },
  ];

  const handleSavePlan = () => {
    setUserProfile(prev => ({
      ...prev,
      targetExam,
      dailyGoalMinutes: dailyHours,
    }));
    setShowSetupModal(false);
  };

  const toggleSubjectPriority = (subj: string) => {
    setPrioritySubjects(prev =>
      prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'km' ? 'ផែនការសិក្សាផ្ទាល់ខ្លួនឆ្លាតវៃ' : 'AI Personalized Study Plan'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('navStudyPlan')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {lang === 'km'
              ? 'កាលវិភាគប្រចាំថ្ងៃ និងប្រចាំសប្តាហ៍ តម្រូវតាមគោលដៅប្រឡង និងពេលវេលារបស់អ្នក។'
              : 'Custom study schedule and daily task breakdown tailored to your target exam.'}
          </p>
        </div>

        <button
          onClick={() => setShowSetupModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 text-xs font-bold shadow-2xs transition cursor-pointer flex items-center gap-2"
        >
          <Sliders className="w-4 h-4" />
          <span>{lang === 'km' ? 'កែសម្រួលគោលដៅសិក្សា' : 'Adjust Study Settings'}</span>
        </button>
      </div>

      {/* Top Progress & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{lang === 'km' ? 'កិច្ចការថ្ងៃនេះ' : "Today's Completion"}</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {completedCount}/{totalTasks}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{progressPercent}%</span>
            <span className="text-xs text-slate-500 font-medium">{lang === 'km' ? 'បានរួចរាល់' : 'completed'}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{lang === 'km' ? 'ពេលវេលាសិក្សាថ្ងៃនេះ' : 'Planned Time Today'}</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{userProfile.dailyGoalMinutes}</span>
            <span className="text-xs text-slate-500 font-medium">{lang === 'km' ? 'នាទី / ថ្ងៃ' : 'mins / day'}</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium">
            {lang === 'km' ? '✓ កំពុងដំណើរការស្របតាមកាលវិភាគ' : '✓ On track for exam readiness'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{lang === 'km' ? 'ក្របខណ្ឌគោលដៅ' : 'Target Exam'}</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-700">{userProfile.targetExam.toUpperCase()}</span>
            <span className="text-xs text-slate-500 font-medium">2026 Cohort</span>
          </div>
          <p className="text-xs text-slate-500">
            {lang === 'km' ? 'សម័យប្រឡង៖ តុលា ២០២៦' : 'Exam: October 2026'}
          </p>
        </div>
      </div>

      {/* 2-Column: Today Tasks & Weekly Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>{t('todayStudyPlan')}</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'km' ? 'ថ្ងៃពុធ ទី ១៩ សីហា' : 'Wednesday, Aug 19'}
            </span>
          </div>

          <div className="space-y-3">
            {studyTasks.map(task => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  task.completed
                    ? 'bg-slate-50 border-slate-200 text-slate-400'
                    : 'bg-white border-slate-200 hover:border-indigo-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition cursor-pointer shrink-0 ${
                      task.completed
                        ? 'bg-emerald-500 text-white'
                        : 'border-2 border-slate-300 hover:border-indigo-500 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title[lang]}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="text-indigo-600 font-medium">{lang === 'km' ? task.subjectKm : task.subject}</span>
                      <span>•</span>
                      <span>{task.estimatedMinutes} {lang === 'km' ? 'នាទី' : 'mins'}</span>
                    </div>
                  </div>
                </div>

                {!task.completed ? (
                  <button
                    onClick={() => {
                      if (task.targetAction === 'quiz') startQuizById('quiz-ped-01');
                      else if (task.targetAction === 'past-papers') setCurrentPage('past-papers');
                      else if (task.targetAction === 'flashcards') setCurrentPage('flashcards');
                      else setCurrentPage('learning');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0 transition cursor-pointer flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-indigo-600" />
                    <span>{lang === 'km' ? 'ធ្វើ' : 'Start'}</span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md shrink-0">
                    {lang === 'km' ? 'រួចរាល់' : 'Done'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>{lang === 'km' ? 'កាលវិភាគប្រចាំសប្តាហ៍' : 'Weekly Schedule Breakdown'}</span>
            </h2>
            <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
              7 Days Active
            </span>
          </div>

          <div className="space-y-2.5">
            {weeklySchedule.map((item, idx) => {
              const isToday = item.status === 'today';
              const isDone = item.status === 'done';
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    isToday
                      ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20'
                      : isDone
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isToday
                          ? 'bg-indigo-600 text-white'
                          : isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.day[lang]}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isToday ? 'text-indigo-950' : 'text-slate-800'}`}>
                        {item.subject[lang]}
                      </p>
                      <span className="text-[11px] text-slate-500">{item.duration}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      isToday
                        ? 'bg-indigo-600 text-white'
                        : isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {isToday ? (lang === 'km' ? 'ថ្ងៃនេះ' : 'Today') : isDone ? (lang === 'km' ? 'រួច' : 'Done') : (lang === 'km' ? 'ខាងមុខ' : 'Upcoming')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Setup Wizard Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>{lang === 'km' ? 'កំណត់ផែនការសិក្សា AI' : 'Configure Your AI Study Plan'}</span>
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Target Exam */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">{lang === 'km' ? 'ក្របខណ្ឌប្រឡងគោលដៅ' : 'Target Exam Category'}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'nie', label: 'NIE (គ្រូវិទ្យាល័យ)' },
                    { id: 'rttc', label: 'RTTC (គ្រូអនុ)' },
                    { id: 'pttc', label: 'PTTC (គ្រូបឋម)' },
                    { id: 'kindergarten', label: 'មត្តេយ្យ' }
                  ].map(ex => (
                    <button
                      key={ex.id}
                      onClick={() => setTargetExam(ex.id as ExamTarget)}
                      className={`p-2.5 rounded-xl border font-semibold text-xs transition cursor-pointer ${
                        targetExam === ex.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Hours */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">{lang === 'km' ? 'ពេលវេលាអាចរៀនក្នុងមួយថ្ងៃ' : 'Available Daily Study Time'}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { mins: 30, label: '30 នាទី' },
                    { mins: 60, label: '60 នាទី' },
                    { mins: 90, label: '90 នាទី' },
                  ].map(h => (
                    <button
                      key={h.mins}
                      onClick={() => setDailyHours(h.mins)}
                      className={`p-2.5 rounded-xl border font-semibold text-xs transition cursor-pointer ${
                        dailyHours === h.mins
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Level */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">{lang === 'km' ? 'កម្រិតចំណេះដឹងបច្ចុប្បន្ន' : 'Current Knowledge Level'}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'beginner', label: lang === 'km' ? 'ទើបចាប់ផ្តើម' : 'Beginner' },
                    { id: 'intermediate', label: lang === 'km' ? 'មធ្យម' : 'Intermediate' },
                    { id: 'advanced', label: lang === 'km' ? 'រឹងមាំ' : 'Advanced' },
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      onClick={() => setLevel(lvl.id as any)}
                      className={`p-2.5 rounded-xl border font-semibold text-xs transition cursor-pointer ${
                        level === lvl.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowSetupModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {t('close')}
              </button>
              <button
                onClick={handleSavePlan}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                {lang === 'km' ? 'រក្សាទុក & បង្កើតកាលវិភាគ' : 'Generate & Save Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
