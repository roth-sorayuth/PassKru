import React, { useState } from 'react';
import { ArrowRight, ArrowUp, Check, ExternalLink, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlanTask, TopicScoreGroup } from '../../types/aiStudyPlan';
import { updateStudyTaskStatus } from '../../services/studyPlanService';
import { CARD, TASK_TYPE_META, formatDay, useTr } from '../study-plan/shared';

/* ------------------------------------------------------------------ KPI -- */

export const KpiTile: React.FC<{
  label: string;
  value: string | number | null;
  unit?: string;
  delta?: number | null;
  context: string;
  /** 0–1: draws a thin progress bar under the value. */
  progress?: number | null;
}> = ({ label, value, unit, delta, context, progress }) => (
  <div className={`${CARD} px-5 py-4 flex flex-col gap-1 min-w-0`}>
    <span className="text-[13px] text-slate-500">{label}</span>
    <span className="flex items-baseline gap-1">
      <span className={`text-3xl font-bold tracking-tight tabular-nums ${value == null ? 'text-slate-500' : 'text-[#0a2540]'}`}>{value ?? '—'}</span>
      {value != null && unit && <span className="text-[13px] font-semibold text-slate-500">{unit}</span>}
    </span>
    {progress != null && (
      <span className="h-1.5 my-1 rounded-full bg-[#dbe5f1] overflow-hidden" aria-hidden="true">
        <span className="block h-full rounded-full bg-[#0a3263]" style={{ width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` }} />
      </span>
    )}
    <span className="flex items-center gap-1.5 text-xs min-w-0">
      {delta != null && delta !== 0 && (
        <span className={`inline-flex items-center font-bold shrink-0 ${delta > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
          <ArrowUp className={`w-3 h-3 ${delta < 0 ? 'rotate-180' : ''}`} aria-hidden="true" />
          {Math.abs(delta)}
        </span>
      )}
      <span className="text-slate-500 truncate">{context}</span>
    </span>
  </div>
);

/* ------------------------------------------------------ today's tasks -- */

export const TodayTasks: React.FC<{ tasks: PlanTask[]; planId: number; date: string; onChange: (tasks: PlanTask[]) => void }> = ({
  tasks,
  planId,
  date,
  onChange,
}) => {
  const { tr, lang } = useTr();
  const { startQuizById, startMockExamById, setCurrentPage, setHighlightTaskId } = useApp();
  const [error, setError] = useState<string | null>(null);
  const done = tasks.filter((t) => t.completed).length;
  const minutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const currentId = tasks.find((t) => !t.completed)?.id;

  const toggle = async (task: PlanTask) => {
    const next = tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t));
    onChange(next);
    setError(null);
    try {
      await updateStudyTaskStatus(planId, task.id, !task.completed);
    } catch (err: any) {
      onChange(tasks);
      setError(err?.message || tr('រក្សាទុកមិនបានទេ។', "Couldn't save."));
    }
  };

  const start = (task: PlanTask) => {
    if (task.type === 'quiz') return task.quizId ? startQuizById(task.quizId) : setCurrentPage('quiz');
    if (task.type === 'practice') return task.mockExamId ? startMockExamById(task.mockExamId) : setCurrentPage('practice');
    if (task.type === 'paper' && task.fileUrl) return window.open(task.fileUrl, '_blank', 'noopener,noreferrer');
    setHighlightTaskId(task.id);
    setCurrentPage('study-plan');
  };

  return (
    <section className={`${CARD} p-5 flex flex-col gap-3`} aria-labelledby="today-title">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <h2 id="today-title" className="text-[15px] font-bold text-[#0a2540]">{tr('ថ្ងៃនេះ', 'Today')}</h2>
          <span className="text-xs text-slate-500">
            {formatDay(date, lang, { weekday: 'long', day: 'numeric', month: 'long' })} · {tr(`${minutes} នាទី`, `${minutes} min`)}
          </span>
        </div>
        <span className="text-[13px] font-bold text-emerald-700 tabular-nums" aria-label={tr('កិច្ចការរួច', 'Tasks done')}>
          {done}/{tasks.length}
        </span>
      </div>

      {tasks.length === 0 ? (
        <p className="text-[13px] text-slate-500 py-4">{tr('ថ្ងៃសម្រាក — គ្មានកិច្ចការទេ', 'Rest day — no tasks')}</p>
      ) : (
        <ol className="flex flex-col">
          {tasks.map((task, i) => {
            const meta = TASK_TYPE_META[task.type];
            const current = task.id === currentId;
            return (
              <li key={task.id} className="flex gap-3">
                <span className="flex flex-col items-center w-6 shrink-0">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={task.completed}
                    aria-label={tr(`សម្គាល់ថារួច៖ ${task.title}`, `Mark done: ${task.title}`)}
                    onClick={() => toggle(task)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition focus-visible:ring-2 focus-visible:ring-[#0a3263]/40 ${
                      task.completed ? 'bg-emerald-600 border-emerald-600' : current ? 'border-[#0a3263] bg-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 text-white" aria-hidden="true" />}
                  </button>
                  {i < tasks.length - 1 && <span className="w-0.5 flex-1 my-1 bg-slate-100" aria-hidden="true" />}
                </span>
                <span className="flex flex-col gap-0.5 pb-4 min-w-0 flex-1">
                  <span className={`text-sm font-semibold break-words ${task.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{task.title}</span>
                  <span className="text-xs text-slate-500">
                    {lang === 'km' ? meta.km : meta.en} · {tr(`${task.estimatedMinutes} នាទី`, `${task.estimatedMinutes} min`)}
                    {task.type === 'paper' ? ` · ${tr('ធីកពេលធ្វើរួច', 'tick when done')}` : ''}
                  </span>
                  {current && (
                    <button
                      type="button"
                      onClick={() => start(task)}
                      className="self-start mt-1.5 inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[36px] rounded-lg bg-[#0a3263] hover:bg-[#12427d] text-white text-xs font-bold transition cursor-pointer"
                    >
                      {task.type === 'paper' ? <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> : <Play className="w-3 h-3" aria-hidden="true" />}
                      {task.type === 'paper' ? tr('បើក PDF', 'Open PDF') : task.type === 'review' ? tr('ពិនិត្យ', 'Review') : tr('ធ្វើ', 'Start')}
                    </button>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      )}
      {error && <p role="alert" className="text-xs font-semibold text-red-700">{error}</p>}
      <button
        type="button"
        onClick={() => setCurrentPage('study-plan')}
        className="self-start inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0a3263] hover:text-[#12427d] cursor-pointer"
      >
        {tr('មើលផែនការសិក្សាទាំងមូល', 'View the whole plan')}
        <ArrowRight className="w-4 h-4" />
      </button>
    </section>
  );
};

/* -------------------------------------------------------- weak topics -- */

const MASTERED = 70;
const barTone = (p: number) => (p < 40 ? 'bg-red-500' : p < 55 ? 'bg-amber-500' : p < MASTERED ? 'bg-[#4a72ad]' : 'bg-emerald-600');

/** The few topics that need work most — the ones the daily tasks are aimed at. */
export const WeakTopics: React.FC<{ groups: TopicScoreGroup[]; limit?: number }> = ({ groups, limit = 5 }) => {
  const { tr } = useTr();
  const { setCurrentPage } = useApp();
  const all = groups.flatMap((g) => g.topics.map((t) => ({ ...t, subjectName: g.subjectName })));
  const below = all.filter((t) => t.percent < MASTERED).sort((a, b) => a.percent - b.percent);
  const mastered = all.length - below.length;

  return (
    <section className={`${CARD} p-5 flex flex-col gap-4`} aria-labelledby="weak-topics-title">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <h2 id="weak-topics-title" className="text-[15px] font-bold text-[#0a2540]">{tr('ប្រធានបទត្រូវពង្រឹង', 'Topics to strengthen')}</h2>
          <span className="text-xs text-slate-500">{tr('ក្រោម ៧០% · ផ្តោតក្នុងកិច្ចការប្រចាំថ្ងៃ', 'Below 70% · targeted by your daily tasks')}</span>
        </div>
        {all.length > 0 && (
          <span className="text-xs font-semibold text-slate-500 tabular-nums shrink-0">{tr(`ស្ទាត់ ${mastered}/${all.length}`, `${mastered}/${all.length} mastered`)}</span>
        )}
      </div>

      {all.length === 0 ? (
        <p className="text-[13px] text-slate-500 py-2">{tr('ពិន្ទុប្រធានបទនឹងលេចឡើងក្រោយតេស្ត ឬកម្រងសំណួរដំបូង', 'Topic scores appear after your first test or quiz')}</p>
      ) : below.length === 0 ? (
        <p className="text-[13px] font-semibold text-emerald-700 py-2">{tr('គ្រប់ប្រធានបទលើស ៧០% — ល្អណាស់!', 'Every topic is above 70% — well done!')}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {below.slice(0, limit).map((t) => (
            <li key={t.topicId} className="flex flex-col gap-1">
              <span className="flex items-baseline justify-between gap-3 text-[13px]">
                <span className="min-w-0 truncate">
                  <span className="font-semibold text-slate-700">{t.topicName}</span>
                  <span className="text-slate-500"> · {t.subjectName}</span>
                </span>
                <span className="font-bold text-[#0a2540] tabular-nums shrink-0">{t.percent}%</span>
              </span>
              <span className="h-1.5 rounded-full bg-slate-100 overflow-hidden" aria-hidden="true">
                <span className={`block h-full rounded-full ${barTone(t.percent)}`} style={{ width: `${Math.max(3, t.percent)}%` }} />
              </span>
            </li>
          ))}
        </ul>
      )}

      {below.length > limit && (
        <span className="text-xs text-slate-500">{tr(`និង ${below.length - limit} ប្រធានបទទៀត`, `and ${below.length - limit} more`)}</span>
      )}
      {all.length > 0 && (
        <button
          type="button"
          onClick={() => setCurrentPage('weakness')}
          className="self-start inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0a3263] hover:text-[#12427d] cursor-pointer"
        >
          {tr('វិភាគចំណុចខ្សោយ', 'Weakness analysis')}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </section>
  );
};
