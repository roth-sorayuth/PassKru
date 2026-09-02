import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { StudyPlanRecord, StudyPlanTask, ExamTarget } from '../../types';
import {
  getActiveStudyPlan,
  generateStudyPlan,
  updateStudyTaskStatus,
} from '../../services/studyPlanService';
import {
  Sparkles,
  BookOpen,
  Clock,
  Play,
  Sliders,
  TrendingUp,
  Award,
  Check,
  Loader2,
  AlertTriangle,
  CalendarPlus,
  Wand2,
  ListChecks,
  CheckCircle2,
} from 'lucide-react';

const TASK_TYPE_LABEL: Record<string, { km: string; en: string }> = {
  read: { km: 'អាន', en: 'Read' },
  quiz: { km: 'កម្រងសំណួរ', en: 'Quiz' },
  practice: { km: 'អនុវត្ត', en: 'Practice' },
  mock: { km: 'ប្រឡងសាកល្បង', en: 'Mock Exam' },
  flashcards: { km: 'បណ្ណចងចាំ', en: 'Flashcards' },
};

const MODULE_TYPE_LABEL: Record<string, { km: string; en: string }> = {
  read: { km: 'មេរៀនអាន', en: 'Reading' },
  quiz: { km: 'កម្រងសំណួរ', en: 'Quiz' },
  practice: { km: 'អនុវត្ត', en: 'Practice' },
  mock: { km: 'ប្រឡងសាកល្បង', en: 'Mock Exam' },
  review: { km: 'ពិនិត្យឡើងវិញ', en: 'Review' },
};

function todayDateString(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export const StudyPlanPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { userProfile, setCurrentPage, startQuizById, startMockExamById } = useApp();

  const [plan, setPlan] = useState<StudyPlanRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);

  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const [targetExam, setTargetExam] = useState<ExamTarget>(userProfile.targetExam);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(userProfile.dailyGoalMinutes || 60);
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [examDate, setExamDate] = useState<string>('');

  const loadPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getActiveStudyPlan();
      setPlan(res.plan);
    } catch (err: any) {
      setError(err?.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openSetupModal = () => {
    setExamDate(plan?.items.examDate || '');
    setShowSetupModal(true);
  };

  const handleGeneratePlan = async (resetProgress = false) => {
    if (resetProgress && !window.confirm(
      lang === 'km'
        ? 'តើអ្នកចង់ចាប់ផ្តើមវគ្គសិក្សាឡើងវិញទាំងស្រុងមែនទេ? វឌ្ឍនភាពបច្ចុប្បន្នរបស់អ្នកនឹងបាត់។'
        : 'Start your course completely over? Your current progress will be discarded.'
    )) return;

    setGenerating(true);
    setError(null);
    try {
      const res = await generateStudyPlan({
        targetExam,
        dailyGoalMinutes,
        knowledgeLevel: level,
        examDate: examDate || undefined,
        resetProgress: resetProgress || undefined,
      });
      setPlan(res.plan);
      setShowSetupModal(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate course');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleTask = async (dayDate: string, task: StudyPlanTask) => {
    if (!plan) return;
    const nextCompleted = !task.completed;

    // Optimistic update — also drop the task from the locally-held nextUp
    // list when completing it, so it disappears immediately rather than
    // waiting for the next full reload to re-rank.
    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: {
          ...prev.items,
          days: prev.items.days.map((day) =>
            day.date === dayDate
              ? {
                  ...day,
                  tasks: day.tasks.map((tk) =>
                    tk.id === task.id ? { ...tk, completed: nextCompleted } : tk
                  ),
                }
              : day
          ),
        },
        nextUp: nextCompleted
          ? prev.nextUp?.filter((entry) => entry.task.id !== task.id)
          : prev.nextUp,
      };
    });

    try {
      await updateStudyTaskStatus(plan.planId, task.id, nextCompleted);
    } catch (err) {
      // Revert on failure
      loadPlan();
    }
  };

  const handleStartTask = (task: StudyPlanTask) => {
    // Quiz/mock-exam taking is still driven by frontend mock data (AppContext's
    // startQuizById/startMockExamById look up a local mock dataset, not the
    // real backend quiz/mock-exam a task is now matched to) — wiring that up
    // is a separate, larger piece of work than this course-generation change,
    // so these two branches intentionally still use the placeholder IDs.
    if (task.targetAction === 'quiz') startQuizById('quiz-ped-01');
    else if (task.targetAction === 'mock-exam') startMockExamById('mock-nie-2026-01');
    else if (task.targetAction === 'past-papers') {
      // A real preparation paper is attached when one exists for the
      // subject — open it directly instead of the generic library page.
      if (task.fileUrl) window.open(task.fileUrl, '_blank', 'noopener,noreferrer');
      else setCurrentPage('past-papers');
    } else if (task.targetAction === 'flashcards') setCurrentPage('flashcards' as any);
    else setCurrentPage('learning');
  };

  const allTasks = (plan?.items.days || []).flatMap((day) =>
    day.tasks.map((task) => ({ task, dayDate: day.date }))
  );
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.task.completed).length;
  const progressPercent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  // Prefer the backend's live weak-area-ranked list; fall back to a simple
  // generation-order walk if it's absent (e.g. right after generating, before
  // the plan has been re-fetched via GET /study-plan).
  const nextUpTasks = plan?.nextUp
    ? plan.nextUp.slice(0, 5)
    : allTasks.filter((t) => !t.task.completed).slice(0, 5);

  const modules = plan?.items.days || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'km' ? 'វគ្គសិក្សាផ្ទាល់ខ្លួនឆ្លាតវៃ' : 'Personalized Course'}</span>
            </div>
            {plan?.items.algorithmVersion === 'gemini-v1' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold">
                <Wand2 className="w-3.5 h-3.5" />
                <span>{lang === 'km' ? 'បង្កើតដោយ AI' : 'AI-generated'}</span>
              </div>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('navStudyPlan')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {lang === 'km'
              ? 'វគ្គសិក្សាតម្រូវតាមចំណុចខ្សោយរបស់អ្នក បង្កើតពីលំហាត់ត្រៀម កម្រងសំណួរ និងប្រឡងសាកល្បង។'
              : 'A course built from your weak areas, using preparation materials, quizzes and mock exams — not a fixed exam-date calendar.'}
          </p>
        </div>

        <button
          onClick={openSetupModal}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 text-xs font-bold shadow-2xs transition cursor-pointer flex items-center gap-2"
        >
          <Sliders className="w-4 h-4" />
          <span>{plan ? (lang === 'km' ? 'កែសម្រួលគោលដៅសិក្សា' : 'Adjust Course Settings') : (lang === 'km' ? 'បង្កើតវគ្គសិក្សា' : 'Create My Course')}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : !plan ? (
        <div className="bg-white rounded-3xl border border-dashed border-indigo-300 p-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <CalendarPlus className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {lang === 'km' ? 'អ្នកមិនទាន់មានវគ្គសិក្សាទេ' : "You don't have a course yet"}
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {lang === 'km'
              ? 'កំណត់ក្របខណ្ឌប្រឡងគោលដៅ ដើម្បីបង្កើតវគ្គសិក្សាដំបូងរបស់អ្នក — មិនចាំបាច់ដឹងថ្ងៃប្រឡងទេ។'
              : "Set your target exam to generate your first course — you don't need to know your exam date."}
          </p>
          <button
            onClick={openSetupModal}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'km' ? 'បង្កើតវគ្គសិក្សាឥឡូវនេះ' : 'Generate My Course'}</span>
          </button>
        </div>
      ) : (
        <>
          {/* Top Progress & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{lang === 'km' ? 'វឌ្ឍនភាពវគ្គសិក្សា' : 'Course Completion'}</span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {completedTasks}/{totalTasks}
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
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{lang === 'km' ? 'គោលដៅសិក្សាប្រចាំថ្ងៃ' : 'Daily Study Goal'}</span>
                <Clock className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{plan.items.dailyGoalMinutes}</span>
                <span className="text-xs text-slate-500 font-medium">{lang === 'km' ? 'នាទី / ថ្ងៃ' : 'mins / day'}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'km' ? `ចាប់ផ្តើម: ${plan.startDate?.slice(0, 10)}` : `Started: ${plan.startDate?.slice(0, 10)}`}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{lang === 'km' ? 'ក្របខណ្ឌគោលដៅ' : 'Target Exam'}</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-indigo-700">{userProfile.targetExam.toUpperCase()}</span>
              </div>
              <p className="text-xs text-slate-500">
                {plan.items.examDate
                  ? (lang === 'km' ? `សម័យប្រឡង៖ ${plan.items.examDate}` : `Exam: ${plan.items.examDate}`)
                  : (lang === 'km' ? 'ថ្ងៃប្រឡងមិនទាន់កំណត់ (ស្រេចចិត្ត)' : 'Exam date not set (optional)')}
              </p>
            </div>
          </div>

          {/* 2-Column: Next Up & Course Modules */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Next Up */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-indigo-600" />
                  <span>{t('todayStudyPlan')}</span>
                </h2>
              </div>

              {nextUpTasks.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {lang === 'km' ? 'អ្នកបានបញ្ចប់កិច្ចការទាំងអស់!' : "You've completed everything!"}
                </p>
              ) : (
                <div className="space-y-3">
                  {nextUpTasks.map(({ task, dayDate }) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-2xs transition flex items-center justify-between gap-3 bg-white"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => handleToggleTask(dayDate, task)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center transition cursor-pointer shrink-0 border-2 border-slate-300 hover:border-indigo-500 text-transparent"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate text-slate-800">{task.title}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="text-indigo-600 font-medium">
                              {TASK_TYPE_LABEL[task.type]?.[lang] || task.type}
                            </span>
                            <span>•</span>
                            <span>{task.estimatedMinutes} {lang === 'km' ? 'នាទី' : 'mins'}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartTask(task)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0 transition cursor-pointer flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-indigo-600" />
                        <span>{lang === 'km' ? 'ធ្វើ' : 'Start'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Course Modules */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span>{lang === 'km' ? 'ម៉ូឌុលវគ្គសិក្សា' : 'Course Modules'}</span>
                </h2>
                <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                  {modules.length} {lang === 'km' ? 'ម៉ូឌុល' : 'Modules'}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[32rem] overflow-y-auto pr-1">
                {modules.map((mod) => {
                  const isDone = mod.tasks.length > 0 && mod.tasks.every((t) => t.completed);
                  const summary = mod.tasks.map((t) => t.title).join(' • ') || (lang === 'km' ? 'គ្មានកិច្ចការ' : 'No tasks');
                  const totalMinutes = mod.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
                  const typeLabel = MODULE_TYPE_LABEL[mod.dayType]?.[lang] || mod.dayType;

                  return (
                    <div
                      key={mod.date + mod.dayIndex}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isDone ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50/60 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                            isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {mod.dayIndex + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-slate-800">
                            <span className="text-indigo-600">{typeLabel}</span> — {summary}
                          </p>
                          <span className="text-[11px] text-slate-500">{totalMinutes} {lang === 'km' ? 'នាទី' : 'min'}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded shrink-0 ${
                          isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200/80 text-slate-600'
                        }`}
                      >
                        {isDone ? (lang === 'km' ? 'រួច' : 'Done') : (lang === 'km' ? 'ខាងមុខ' : 'Upcoming')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Setup Wizard Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>{lang === 'km' ? 'កំណត់វគ្គសិក្សា' : 'Configure Your Course'}</span>
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Target Exam */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">{lang === 'km' ? 'ក្របខណ្ឌប្រឡងគោលដៅ' : 'Target Exam Category'}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'nie', km: 'NIE (គ្រូវិទ្យាល័យ)', en: 'NIE (Upper Secondary)' },
                    { id: 'rttc', km: 'RTTC (គ្រូអនុ)', en: 'RTTC (Lower Secondary)' },
                    { id: 'pttc', km: 'PTTC (គ្រូបឋម)', en: 'PTTC (Primary)' },
                    { id: 'kindergarten', km: 'មត្តេយ្យ', en: 'Kindergarten' }
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
                      {lang === 'km' ? ex.km : ex.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Minutes */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">{lang === 'km' ? 'ពេលវេលាអាចរៀនក្នុងមួយថ្ងៃ' : 'Available Daily Study Time'}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 60, 90].map(mins => (
                    <button
                      key={mins}
                      onClick={() => setDailyGoalMinutes(mins)}
                      className={`p-2.5 rounded-xl border font-semibold text-xs transition cursor-pointer ${
                        dailyGoalMinutes === mins
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {mins} {lang === 'km' ? 'នាទី' : 'mins'}
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

              {/* Exam Date */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  {lang === 'km' ? 'ថ្ងៃប្រឡង (ស្រេចចិត្ត)' : 'Exam Date (optional)'}
                </label>
                <input
                  type="date"
                  value={examDate}
                  min={todayDateString()}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                />
                <p className="text-[11px] text-slate-400">
                  {lang === 'km'
                    ? 'ត្រូវការតែពេលអ្នកដឹងច្បាស់ថ្ងៃប្រឡងប៉ុណ្ណោះ — ប្រើសម្រាប់ណែនាំល្បឿនសិក្សាបន្ថែម មិនចាំបាច់ដើម្បីបង្កើតវគ្គសិក្សាទេ។ បើទុកទទេ វគ្គសិក្សានឹងគ្របដណ្តប់មេរៀនទាំងអស់តាមចំណុចខ្សោយរបស់អ្នក។'
                    : "Only needed if you already know your exam date — used for optional pacing hints, not required to generate your course. Leave it blank and the course will cover your full syllabus, weakest topics first."}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              {plan ? (
                <button
                  onClick={() => handleGeneratePlan(true)}
                  disabled={generating}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50"
                >
                  {lang === 'km' ? 'ចាប់ផ្តើមឡើងវិញទាំងស្រុង' : 'Reset course'}
                </button>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSetupModal(false)}
                  disabled={generating}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {t('close')}
                </button>
                <button
                  onClick={() => handleGeneratePlan(false)}
                  disabled={generating}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-xs shadow-xs flex items-center gap-2"
                >
                  {generating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{lang === 'km' ? 'រក្សាទុក & បង្កើតវគ្គសិក្សា' : 'Generate & Save Course'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
