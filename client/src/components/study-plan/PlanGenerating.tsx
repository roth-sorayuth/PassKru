import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIStudyPlan, PlacementResult } from '../../types/aiStudyPlan';
import { generateStudyPlan } from '../../services/studyPlanService';
import { subjectLabel } from '../../data/examSelectionData';
import { AI_CARD, AiLabel, CARD, ErrorBox, prefersReducedMotion, useTr } from './shared';

interface Props {
  result: PlacementResult | null;
  onReady: (plan: AIStudyPlan) => void;
}

/**
 * Shows the AI's work while POST /study-plan/generate runs. Steps 1–4 are
 * facts already known from the placement result; steps 5–6 complete when the
 * generated plan arrives, with the real content counts from the database.
 */
export const PlanGenerating: React.FC<Props> = ({ result, onReady }) => {
  const { tr, lang } = useTr();
  const { userProfile } = useApp();
  const [tick, setTick] = useState(prefersReducedMotion() ? 4 : 0);
  const [plan, setPlan] = useState<AIStudyPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  const run = async () => {
    setError(null);
    try {
      const res = await generateStudyPlan({});
      setPlan(res.plan);
    } catch (err: any) {
      setError(err?.message || tr('បង្កើតផែនការមិនបានទេ។', "Couldn't generate the plan."));
    }
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Advance through the known steps; hold at step 4 until the plan exists.
  useEffect(() => {
    if (error) return;
    const limit = plan ? 6 : 4;
    if (tick >= limit) return;
    const t = window.setTimeout(() => setTick((v) => v + 1), prefersReducedMotion() ? 0 : 900);
    return () => window.clearTimeout(t);
  }, [tick, plan, error]);

  const keys = userProfile.selectedSubjects || [];
  // Mirrors the weighting in server/src/config/examSubjects.js.
  // Each subject with its own share; General Knowledge is sat by every level.
  const gk = subjectLabel('generalCulture', lang);
  const labels = keys.map((k) => subjectLabel(k, lang));
  const weighting = keys.includes('generalist')
    ? tr('គ្រប់មុខវិជ្ជាស្មើៗគ្នា', 'All subjects evenly')
    : userProfile.targetExam === 'pttc'
      ? [...labels, gk].map((name) => `${name} 25%`).join(' · ')
      : keys.length === 2
        ? `${labels[0]} 40% · ${labels[1]} 40% · ${gk} 20%`
        : `${labels[0] || ''} 80% · ${gk} 20%`;

  const strong = result?.topicScores.filter((t) => t.percent >= 70).length ?? 0;
  const weak = result?.topicScores.filter((t) => t.percent < 55).length ?? 0;
  const firstWeak = result?.weakTopics[0];
  const content = plan?.items.summary.content;

  const steps = [
    {
      title: tr(`អានចម្លើយទាំង ${result?.total ?? ''}`, `Read all ${result?.total ?? ''} answers`),
      detail: result
        ? tr(
            `ត្រូវ ${result.correct} · ខុស ${result.total - result.correct}${result.secondsPerQuestion ? ` · ជាមធ្យម ${result.secondsPerQuestion} វិនាទីក្នុងមួយសំណួរ` : ''}`,
            `${result.correct} right · ${result.total - result.correct} wrong${result.secondsPerQuestion ? ` · ${result.secondsPerQuestion}s per question on average` : ''}`
          )
        : '',
    },
    {
      title: tr('វាស់ពិន្ទុតាមប្រធានបទ', 'Score each topic'),
      detail: result ? tr(`${result.topicScores.length} ប្រធានបទ · ខ្លាំង ${strong} · ខ្សោយ ${weak}`, `${result.topicScores.length} topics · ${strong} strong · ${weak} weak`) : '',
    },
    {
      title: tr('រកចំណុចខ្សោយ', 'Find weak spots'),
      detail: result?.patterns[0] || (firstWeak ? `${firstWeak.topicName} ${firstWeak.percent}%` : ''),
    },
    { title: tr('កំណត់ទម្ងន់មុខវិជ្ជា', 'Set subject weighting'), detail: weighting },
    {
      title: tr('ជ្រើសខ្លឹមសារពីមូលដ្ឋានទិន្នន័យ', 'Pick content from the database'),
      detail: content
        ? tr(
            `កម្រងសំណួរ ${content.quizzes} ឈុត · អនុវត្ត ${content.practice} · វិញ្ញាសា ${content.papers}`,
            `${content.quizzes} quiz sets · ${content.practice} practice · ${content.papers} papers`
          )
        : '',
    },
    {
      title: tr('រៀបចំ ៤ សប្តាហ៍', 'Lay out 4 weeks'),
      detail: tr('ច័ន្ទ–សុក្រ សិក្សា · សៅរ៍ ពិនិត្យកំហុស · អាទិត្យ សម្រាក', 'Mon–Fri study · Sat mistake review · Sun rest'),
    },
  ];

  const done = !!plan && tick >= 6;
  const weeksShown = done ? plan!.items.weeks.length : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <AiLabel>{tr('ផែនការសិក្សាដោយ AI', 'AI study plan')}</AiLabel>
        <h1 className="text-2xl font-extrabold text-[#0a2540]" aria-live="polite">
          {done ? tr('ផែនការមួយខែរបស់អ្នករួចរាល់', 'Your one-month plan is ready') : tr('AI កំពុងរៀបចំផែនការមួយខែរបស់អ្នក', 'The AI is building your one-month plan')}
        </h1>
      </div>

      {error && <ErrorBox message={error} onRetry={run} retryLabel={tr('ព្យាយាមម្តងទៀត', 'Try again')} />}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-4 items-start">
        <section className={`${AI_CARD} p-6`}>
          <h2 className="text-[15px] font-bold text-[#0a2540] pb-3">{tr('អ្វីដែល AI កំពុងធ្វើ', 'What the AI is doing')}</h2>
          <ol>
            {steps.map((s, i) => {
              const isDone = tick > i || (i === 5 && done);
              const active = tick === i && !done;
              return (
                <li key={i} className="flex gap-3.5 py-3 border-t border-[#dfeaf8]">
                  <span
                    className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      isDone ? 'bg-emerald-600 border-emerald-600' : active ? 'bg-[#eef4fb] border-[#0a3263]' : 'bg-white border-slate-200'
                    }`}
                    aria-hidden="true"
                  >
                    {isDone ? <Check className="w-3.5 h-3.5 text-white" /> : active ? <span className="w-2 h-2 rounded-full bg-[#eef4fb]0" /> : null}
                  </span>
                  <span className="flex flex-col min-w-0">
                    <span className={`text-sm font-bold ${isDone || active ? 'text-[#0a2540]' : 'text-slate-500'}`}>{s.title}</span>
                    {(isDone || active) && s.detail && (
                      <span className={`text-[13px] leading-relaxed ${isDone ? 'text-slate-600' : 'text-[#0a3263]'}`}>{s.detail}</span>
                    )}
                    {active && !s.detail && <span className="text-[13px] text-[#0a3263]">{tr('កំពុងដំណើរការ…', 'Working…')}</span>}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <section className={`${CARD} p-5 flex flex-col gap-3`}>
          <h2 className="text-[15px] font-bold text-[#0a2540]">{tr('ផែនការកំពុងលេចឡើង', 'The plan taking shape')}</h2>
          {[0, 1, 2, 3].map((w) => {
            const week = plan?.items.weeks[w];
            const on = w < weeksShown;
            return (
              <div key={w} className="flex flex-col gap-1">
                <div className="grid grid-cols-[72px_repeat(7,minmax(0,1fr))] gap-1 items-center">
                  <span className="text-xs font-bold text-slate-600">{tr(`សប្តាហ៍ទី ${w + 1}`, `Week ${w + 1}`)}</span>
                  {Array.from({ length: 7 }).map((_, d) => {
                    const day = plan?.items.days.find((x) => x.weekIndex === w && new Date(`${x.date}T00:00:00Z`).getUTCDay() === (d + 1) % 7);
                    const kind = day?.dayType === 'rest' ? 'bg-slate-200' : day?.dayType === 'review' ? 'bg-amber-300' : day?.tasks.some((t) => t.type === 'practice') ? 'bg-[#0a3263]' : day?.tasks.some((t) => t.type === 'paper') ? 'bg-slate-300' : 'bg-[#7394c6]';
                    return <span key={d} className={`h-6 rounded-md transition-colors duration-500 motion-reduce:transition-none ${on && day ? kind : 'bg-slate-100'}`} />;
                  })}
                </div>
                <span className={`pl-[76px] text-xs ${on ? 'text-slate-600' : 'text-slate-500'}`}>{on && week ? week.goal : tr('កំពុងរៀបចំ…', 'Preparing…')}</span>
              </div>
            );
          })}
          <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#7394c6]" />{tr('កម្រងសំណួរ', 'Quiz')}</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-300" />{tr('វិញ្ញាសា', 'Paper')}</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#0a3263]" />{tr('អនុវត្ត', 'Practice')}</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-300" />{tr('ពិនិត្យកំហុស', 'Review')}</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-200" />{tr('សម្រាក', 'Rest')}</span>
          </div>
        </section>
      </div>

      {done ? (
        <div>
          <button
            type="button"
            onClick={() => onReady(plan!)}
            className="inline-flex items-center gap-2 px-6 py-3 min-h-[48px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0a3263]/40"
          >
            {tr('មើលផែនការរបស់ខ្ញុំ', 'View my plan')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        !error && (
          <p className="text-[13px] text-slate-500">
            {tr(
              'AI មិនបង្កើតខ្លឹមសារថ្មីទេ — វាជ្រើសពីកម្រងសំណួរ អនុវត្ត និងវិញ្ញាសាដែលមានក្នុង PassKru តែប៉ុណ្ណោះ។',
              'The AI writes no new content — it only picks from the quizzes, practice exams and papers already in PassKru.'
            )}
          </p>
        )
      )}
    </div>
  );
};
