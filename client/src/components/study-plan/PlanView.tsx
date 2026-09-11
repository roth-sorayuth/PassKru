import React, { useEffect, useMemo, useState } from 'react';
import { Check, ExternalLink, Play, RefreshCw, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIStudyPlan, PlanDay, PlanTask } from '../../types/aiStudyPlan';
import { updateStudyTaskStatus } from '../../services/studyPlanService';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { WeeklyUpdateCard } from './WeeklyUpdateCard';
import { AiLabel, CARD, TASK_TYPE_META, formatDay, levelLabel, todayIso, useTr } from './shared';

interface Props {
  plan: AIStudyPlan;
  onPlanChange: (plan: AIStudyPlan) => void;
  onOpenReview: () => void;
  onRegenerate: () => void;
  onReload: () => void;
}

export const PlanView: React.FC<Props> = ({ plan, onPlanChange, onOpenReview, onRegenerate, onReload }) => {
  const { tr, lang } = useTr();
  const { startQuizById, startMockExamById, setCurrentPage, highlightTaskId, setHighlightTaskId } = useApp();
  const { items } = plan;
  const today = todayIso();

  const currentWeek = useMemo(() => {
    const w = items.weeks.find((wk) => today >= wk.startDate && today <= wk.endDate);
    return w ? w.weekIndex : items.weeks.findIndex((wk) => wk.status === 'active') >= 0 ? items.weeks.findIndex((wk) => wk.status === 'active') : 0;
  }, [items.weeks, today]);

  const [week, setWeek] = useState(currentWeek);
  const [openWhy, setOpenWhy] = useState<Record<string, boolean>>({});
  const [taskError, setTaskError] = useState<string | null>(null);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  // Dashboard deep link: open the week holding the task and scroll to it.
  useEffect(() => {
    if (!highlightTaskId) return;
    const day = items.days.find((d) => d.tasks.some((t) => t.id === highlightTaskId));
    if (day) setWeek(day.weekIndex);
    setFlash(highlightTaskId);
    setHighlightTaskId(null);
    const scroll = window.setTimeout(() => document.getElementById(`task-${highlightTaskId}`)?.scrollIntoView({ block: 'center' }), 120);
    const clear = window.setTimeout(() => setFlash(null), 4000);
    return () => {
      window.clearTimeout(scroll);
      window.clearTimeout(clear);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightTaskId]);

  const toggleTask = async (day: PlanDay, task: PlanTask) => {
    const completed = !task.completed;
    setTaskError(null);
    const patch = (value: boolean): AIStudyPlan => ({
      ...plan,
      items: {
        ...items,
        days: items.days.map((d) =>
          d.date !== day.date ? d : { ...d, tasks: d.tasks.map((t) => (t.id === task.id ? { ...t, completed: value } : t)) }
        ),
      },
    });
    onPlanChange(patch(completed));
    try {
      await updateStudyTaskStatus(plan.planId, task.id, completed);
    } catch (err: any) {
      onPlanChange(patch(!completed));
      setTaskError(err?.message || tr('រក្សាទុកស្ថានភាពកិច្ចការមិនបានទេ។ សូមព្យាយាមម្តងទៀត។', "Couldn't save that task. Please try again."));
    }
  };

  const startTask = (task: PlanTask) => {
    if (task.type === 'quiz') return task.quizId ? startQuizById(task.quizId) : setCurrentPage('quiz');
    if (task.type === 'practice') return task.mockExamId ? startMockExamById(task.mockExamId) : setCurrentPage('practice');
    if (task.type === 'review') return onOpenReview();
    if (task.fileUrl) window.open(task.fileUrl, '_blank', 'noopener,noreferrer');
    else setCurrentPage(task.paperType === 'prepare-paper' ? 'prepare-papers' : 'past-papers');
  };

  const actionLabel = (task: PlanTask) =>
    task.type === 'paper' ? tr('បើក PDF', 'Open PDF') : task.type === 'review' ? tr('ពិនិត្យ', 'Review') : task.completed ? tr('ធ្វើម្ដងទៀត', 'Redo') : tr('ធ្វើ', 'Start');

  const taskMeta = (task: PlanTask) => {
    const bits: string[] = [];
    if (task.questionCount) bits.push(tr(`${task.questionCount} សំណួរ`, `${task.questionCount} questions`));
    bits.push(tr(`${task.estimatedMinutes} នាទី`, `${task.estimatedMinutes} min`));
    if (task.type === 'paper') bits.push(task.hasAnswerKey ? tr('PDF · មានចម្លើយ', 'PDF · answer key') : 'PDF');
    if (task.type === 'practice') bits.push(tr('មានពិន្ទុ', 'scored'));
    return bits.join(' · ');
  };

  const selected = items.weeks[week] || items.weeks[0];
  const days = items.days.filter((d) => d.weekIndex === selected.weekIndex);
  const { summary } = items;
  // Four short facts, each in its own box.
  const startFrom = summary.decisions[1]?.value;
  const facts = [
    { label: tr('កម្រិត', 'Level'), value: levelLabel(items.level, lang) },
    ...(startFrom ? [{ label: tr('ចាប់ផ្តើមពី', 'Starts with'), value: startFrom }] : []),
    { label: tr('ប្រចាំថ្ងៃ', 'Daily'), value: tr(`${items.dailyGoalMinutes} នាទី`, `${items.dailyGoalMinutes} min`) },
    {
      label: tr('ខ្លឹមសារ', 'Content'),
      value: tr(
        `កម្រងសំណួរ ${summary.content.quizzes} · អនុវត្ត ${summary.content.practice} · វិញ្ញាសា ${summary.content.papers}`,
        `${summary.content.quizzes} quizzes · ${summary.content.practice} practice · ${summary.content.papers} papers`
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <AiLabel>
            {tr('បង្កើតដោយ AI', 'Generated by AI')} · {formatDay(items.generatedAt, lang, { day: 'numeric', month: 'long' })}
          </AiLabel>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#0a2540]">{tr('ផែនការមួយខែរបស់អ្នក', 'Your one-month plan')}</h1>
        </div>
        <button
          type="button"
          onClick={() => setConfirmRegenerate(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-300 text-sm font-bold transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          {tr('វាស់កម្រិតឡើងវិញ', 'Retake placement')}
        </button>
      </div>

      <WeeklyUpdateCard onDecided={onReload} />

      <dl className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {facts.map((f) => (
          <div key={f.label} className={`${CARD} px-4 py-3.5 flex flex-col gap-1 min-w-0`}>
            <dt className="text-xs text-slate-500">{f.label}</dt>
            <dd className="text-[15px] font-bold leading-snug text-[#0a2540] break-words">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5" role="tablist" aria-label={tr('សប្តាហ៍', 'Weeks')}>
        {items.weeks.map((w) => {
          const on = w.weekIndex === selected.weekIndex;
          const statusText = w.status === 'done' ? tr('បានបញ្ចប់', 'Done') : w.status === 'active' ? tr('កំពុងដំណើរការ', 'In progress') : tr('ព្រាង', 'Draft');
          return (
            <button
              key={w.weekIndex}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setWeek(w.weekIndex)}
              className={`text-left rounded-xl border-[1.5px] px-3.5 py-3 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0a3263]/40 ${
                on ? 'border-[#0a3263] bg-white' : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className={`text-sm font-bold ${on ? 'text-[#0a2540]' : 'text-slate-600'}`}>{tr(`សប្តាហ៍ទី ${w.weekIndex + 1}`, `Week ${w.weekIndex + 1}`)}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${w.status === 'active' ? 'bg-[#dfeaf8] text-[#0a3263]' : w.status === 'done' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {statusText}
                </span>
              </span>
              <span className="text-xs text-slate-500">
                {formatDay(w.startDate, lang, { day: 'numeric', month: 'short' })} – {formatDay(w.endDate, lang, { day: 'numeric', month: 'short' })}
              </span>
            </button>
          );
        })}
      </div>

      {taskError && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
          {taskError}
        </p>
      )}

      <section className={`${CARD} p-5 sm:p-6`} role="tabpanel">
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs font-bold text-[#486581]">{tr('គោលដៅសប្តាហ៍ដែល AI កំណត់', "The AI's goal for this week")}</span>
            <h2 className="text-lg font-bold text-[#0a2540] text-balance">{selected.goal}</h2>
            <span className="text-[13px] text-slate-500">{selected.target}</span>
          </div>
          {selected.status === 'draft' && (
            <span className="shrink-0 px-3 py-1.5 rounded-lg border border-dashed border-[#c9d8ea] bg-[#f8fbff] text-xs text-[#0a3263]">
              {tr('ព្រាង — AI នឹងកែនៅថ្ងៃសៅរ៍មុន', 'Draft — the AI revises it the Saturday before')}
            </span>
          )}
        </div>

        <ol>
          {days.map((day) => {
            const isToday = day.date === today;
            const minutes = day.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
            return (
              <li key={day.date} className={`grid grid-cols-1 sm:grid-cols-[110px_minmax(0,1fr)] gap-2 sm:gap-4 py-4 border-t border-slate-100 ${isToday ? 'bg-[#f4f8fd]/40 -mx-5 sm:-mx-6 px-5 sm:px-6' : ''}`}>
                <div className="flex sm:flex-col gap-2 sm:gap-0.5 items-baseline sm:items-start">
                  <span className="text-sm font-bold text-[#0a2540]">{formatDay(day.date, lang, { weekday: 'long', day: 'numeric' })}</span>
                  <span className="text-xs text-slate-500 tabular-nums">
                    {day.dayType === 'rest' ? tr('សម្រាក', 'Rest') : tr(`${minutes} នាទី`, `${minutes} min`)}
                    {isToday && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-[#dfeaf8] text-[#0a3263] font-bold">{tr('ថ្ងៃនេះ', 'Today')}</span>}
                  </span>
                </div>

                <div className="flex flex-col gap-2 min-w-0">
                  {day.dayType === 'rest' && <span className="text-[13px] text-slate-500">{tr('ថ្ងៃសម្រាក — AI មិនដាក់កិច្ចការទេ', 'Rest day — no tasks')}</span>}
                  {day.tasks.map((task) => {
                    const meta = TASK_TYPE_META[task.type];
                    const whyOpen = !!openWhy[task.id];
                    return (
                      <div
                        key={task.id}
                        id={`task-${task.id}`}
                        className={`rounded-xl border px-3.5 py-3 flex flex-col gap-2 transition ${flash === task.id ? 'border-[#0a3263] ring-2 ring-[#0a3263]/20' : 'border-slate-200'}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={task.completed}
                            aria-label={tr(`សម្គាល់ថារួច៖ ${task.title}`, `Mark done: ${task.title}`)}
                            onClick={() => toggleTask(day, task)}
                            className={`w-6 h-6 rounded-lg border-2 shrink-0 flex items-center justify-center transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0a3263]/40 ${
                              task.completed ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 hover:border-[#0a3263]'
                            }`}
                          >
                            {task.completed && <Check className="w-3.5 h-3.5 text-white" aria-hidden="true" />}
                          </button>
                          <span className="flex flex-col min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${meta.chip}`}>{lang === 'km' ? meta.km : meta.en}</span>
                              <span className={`text-sm font-semibold break-words ${task.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{task.title}</span>
                            </span>
                            <span className="text-xs text-slate-500 tabular-nums">{taskMeta(task)}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setOpenWhy((prev) => ({ ...prev, [task.id]: !whyOpen }))}
                            aria-expanded={whyOpen}
                            className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-[#0a3263] hover:bg-[#eef4fb] transition cursor-pointer shrink-0"
                          >
                            <Sparkles className="w-3 h-3" aria-hidden="true" />
                            {whyOpen ? tr('លាក់ហេតុផល', 'Hide reason') : tr('ហេតុអ្វី?', 'Why?')}
                          </button>
                          <button
                            type="button"
                            onClick={() => startTask(task)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                              task.completed && task.type !== 'paper' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-[#0a3263] text-white hover:bg-[#12427d]'
                            }`}
                          >
                            {task.type === 'paper' ? <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> : <Play className="w-3 h-3" aria-hidden="true" />}
                            {actionLabel(task)}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOpenWhy((prev) => ({ ...prev, [task.id]: !whyOpen }))}
                          aria-expanded={whyOpen}
                          className="sm:hidden self-start inline-flex items-center gap-1 text-xs font-bold text-[#0a3263] cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" aria-hidden="true" />
                          {whyOpen ? tr('លាក់ហេតុផល', 'Hide reason') : tr('ហេតុអ្វី?', 'Why?')}
                        </button>
                        {whyOpen && (
                          <p className="rounded-lg bg-[#f4f8fd] border border-[#dfeaf8] px-3 py-2 text-[13px] leading-relaxed text-[#0a2540]">{task.reason}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <ConfirmDialog
        open={confirmRegenerate}
        title={tr('វាស់កម្រិតឡើងវិញ?', 'Retake the placement test?')}
        message={tr(
          'ជ្រើសរើសកម្រិត និងមុខវិជ្ជាម្តងទៀត (ឬរក្សាដដែល) រួចធ្វើតេស្តថ្មី ហើយ AI នឹងបង្កើតផែនការថ្មី។ កិច្ចការដែលបានធ្វើរួចនៅតែរក្សាទុក។',
          "Choose your level and subjects again (or keep them), take a new test, and the AI builds a new plan. Tasks you've finished are kept."
        )}
        confirmLabel={tr('បន្ត', 'Continue')}
        cancelLabel={tr('បោះបង់', 'Cancel')}
        onConfirm={() => {
          setConfirmRegenerate(false);
          onRegenerate();
        }}
        onCancel={() => setConfirmRegenerate(false)}
      />
    </div>
  );
};
