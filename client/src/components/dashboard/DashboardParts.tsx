import React, { useState } from 'react';
import { ArrowRight, ArrowUp, Check, ExternalLink, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlanTask, TopicScoreGroup } from '../../types/aiStudyPlan';
import { updateStudyTaskStatus } from '../../services/studyPlanService';
import { CARD, TASK_TYPE_META, formatDay, useTr } from '../study-plan/shared';

/* ------------------------------------------------------------------ KPI -- */

export interface KpiTileProps {
  label: string;
  badge?: {
    text: string;
    icon?: React.ReactNode;
    color?: 'amber' | 'blue' | 'emerald' | 'orange' | 'slate';
  } | null;
  value: string | number | null;
  unit?: string;
  delta?: number | null;
  context: string;
  /** 0–1: draws a progress bar on the bottom right. */
  progress?: number | null;
  progressColor?: string;
}

export const KpiTile: React.FC<KpiTileProps> = ({
  label,
  badge,
  value,
  unit,
  delta,
  context,
  progress,
  progressColor,
}) => {
  const getBadgeStyle = () => {
    switch (badge?.color) {
      case 'amber':
        return 'bg-white text-[#b45309] border-[#fde68a]';
      case 'blue':
        return 'bg-white text-[#1d4ed8] border-[#bfdbfe]';
      case 'emerald':
        return 'bg-white text-[#047857] border-[#a7f3d0]';
      case 'orange':
        return 'bg-white text-[#c2410c] border-[#fed7aa]';
      case 'slate':
      default:
        return 'bg-white text-slate-700 border-slate-200';
    }
  };

  return (
    <div className={`${CARD} p-5 flex flex-col justify-between min-w-0 shadow-xs hover:shadow-sm transition duration-200`}>
      {/* Top row: Left (Title + Badge) & Right (Big value + unit) */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2 min-w-0">
          <span className="text-sm sm:text-[15px] font-bold text-[#0a2540] truncate tracking-tight">{label}</span>
          {badge && (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold self-start border ${getBadgeStyle()}`}
            >
              {badge.icon}
              <span className="truncate">{badge.text}</span>
            </span>
          )}
        </div>

        <div className="flex items-baseline pl-3 sm:pl-5 border-l border-slate-100 shrink-0 self-center">
          <span
            className={`text-3xl sm:text-5xl font-black tracking-tight tabular-nums ${value == null ? 'text-slate-400' : 'text-[#0a2540]'
              }`}
          >
            {value ?? '—'}
          </span>
          {value != null && unit && (
            <span className="text-base sm:text-xl font-bold text-slate-400 tabular-nums ml-1">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-slate-100 my-3.5" />

      {/* Bottom row: Context on left, progress bar on right */}
      <div className="flex items-center justify-between gap-3 text-xs min-w-0">
        <div className="flex items-center gap-1.5 min-w-0 truncate text-slate-500 font-medium">
          {delta != null && delta !== 0 && (
            <span className={`inline-flex items-center font-bold shrink-0 ${delta > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              <ArrowUp className={`w-3 h-3 ${delta < 0 ? 'rotate-180' : ''}`} aria-hidden="true" />
              {Math.abs(delta)}
            </span>
          )}
          <span className="truncate">{context.replace(/ឈុត/g, 'វិញ្ញាសារ')}</span>
        </div>

        {progress != null && (
          <div className="w-28 sm:w-32 h-1.5 rounded-full bg-slate-100 overflow-hidden shrink-0" aria-hidden="true">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor || 'bg-[#f59e0b]'}`}
              style={{ width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------ today's tasks -- */

export const TodayTasks: React.FC<{ tasks: PlanTask[]; planId: number; date: string; onChange: (tasks: PlanTask[]) => void }> = ({
  tasks,
  planId,
  date,
  onChange,
}) => {
  const { tr, lang } = useTr();
  const { startQuizById, startMockExamById, startMockQuizById, startFlashcardDeck, setCurrentPage, setHighlightTaskId } = useApp();
  const [error, setError] = useState<string | null>(null);
  const done = tasks.filter((t) => t.completed).length;
  const minutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const currentId = tasks.find((t) => !t.completed)?.id;

  const activeTask = tasks.find((t) => !t.completed) || tasks[0];

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
    if (task.type === 'practice') {
      if (task.mockExamId) return startMockExamById(task.mockExamId);
      if (task.quizId) return startMockQuizById(task.quizId);
    }
    if (task.type === 'flashcards' && task.deckId && task.subjectName) {
      return startFlashcardDeck({ deckId: task.deckId, subjectName: task.subjectName });
    }
    if (task.type === 'paper' && task.fileUrl) return window.open(task.fileUrl, '_blank', 'noopener,noreferrer');
    setHighlightTaskId(task.id);
    setCurrentPage('study-plan');
  };

  return (
    <section className={`${CARD} p-5 sm:p-6 flex flex-col gap-4 shadow-xs`} aria-labelledby="today-title">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <h2 id="today-title" className="text-base sm:text-[17px] font-bold text-[#0a2540]">{tr('ថ្ងៃនេះ', 'Today')}</h2>
          <span className="text-xs text-slate-500 pt-0.5">
            {formatDay(date, lang, { weekday: 'long', day: 'numeric', month: 'long' })} · {tr(`${minutes} នាទី`, `${minutes} min`)}
          </span>
        </div>
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 tabular-nums"
          aria-label={tr('កិច្ចការរួច', 'Tasks done')}
        >
          {done}/{tasks.length}
        </span>
      </div>

      {tasks.length === 0 ? (
        <p className="text-[13px] text-slate-500 py-4">{tr('ថ្ងៃសម្រាក — គ្មានកិច្ចការទេ', 'Rest day — no tasks')}</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {tasks.map((task, i) => {
            const meta = TASK_TYPE_META[task.type];
            return (
              <li key={task.id} className="flex gap-3 items-start">
                <span className="flex flex-col items-center w-6 shrink-0 pt-0.5">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={task.completed}
                    aria-label={tr(`សម្គាល់ថារួច៖ ${task.title}`, `Mark done: ${task.title}`)}
                    onClick={() => toggle(task)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition focus-visible:ring-2 focus-visible:ring-[#0a3263]/40 ${task.completed ? 'bg-emerald-600 border-emerald-600' : 'border-slate-500 hover:border-slate-800 bg-white'
                      }`}
                  >
                    {task.completed && <Check className="w-3 h-3 text-white stroke-[3]" aria-hidden="true" />}
                  </button>
                  {i < tasks.length - 1 && <span className="w-0.5 flex-1 my-1 bg-slate-100" aria-hidden="true" />}
                </span>
                <span className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className={`text-sm font-bold break-words ${task.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                    {(task.title || '').replace(/ឈុត/g, 'វិញ្ញាសារ')}
                  </span>
                  <span className="text-xs text-slate-500">
                    {lang === 'km' ? meta.km : meta.en} · {tr(`${task.estimatedMinutes} នាទី`, `${task.estimatedMinutes} min`)}
                    {task.type === 'paper' || task.type === 'flashcards' ? ` · ${tr('ធីកពេលធ្វើរួច', 'tick when done')}` : ''}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {error && <p role="alert" className="text-xs font-semibold text-red-700">{error}</p>}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 mt-auto pt-2">
        <button
          type="button"
          onClick={() => setCurrentPage('study-plan')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-[#0a2540] bg-white text-xs sm:text-[13px] font-bold text-[#0a2540] hover:bg-[#0a2540]/5 transition cursor-pointer shrink-0"
        >
          <span>{tr('មើលផែនការសិក្សាទាំងមូល', 'View the whole plan')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {activeTask && (
          <button
            type="button"
            onClick={() => start(activeTask)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#0a2540] hover:bg-[#12365e] text-white text-xs sm:text-[13px] font-bold transition shadow-xs cursor-pointer shrink-0"
          >
            {activeTask.type === 'paper' ? (
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white" aria-hidden="true" />
            )}
            <span>
              {activeTask.type === 'paper'
                ? tr('បើក PDF', 'Open PDF')
                : activeTask.type === 'review'
                  ? tr('ពិនិត្យ', 'Review')
                  : activeTask.completed
                    ? tr('ធ្វើម្ដងទៀត', 'Redo')
                    : tr('ធ្វើ', 'Start')}
            </span>
          </button>
        )}
      </div>
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
