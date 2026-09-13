import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Layers, Loader2, Play, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIStudyPlan, MyPlan, PlacementPreview, PlacementResult, PlacementSession, PlacementStatus } from '../../types/aiStudyPlan';
import { ExamTarget } from '../../types';
import { activateStudyPlan, getActiveStudyPlan, listMyPlans } from '../../services/studyPlanService';
import { getPlacementPreview, getPlacementStatus, startPlacement } from '../../services/placementService';
import { PlacementIntro } from '../study-plan/PlacementIntro';
import { PlacementTest } from '../study-plan/PlacementTest';
import { PlanGenerating } from '../study-plan/PlanGenerating';
import { PlanView } from '../study-plan/PlanView';
import { WeeklyReview } from '../study-plan/WeeklyReview';
import { MyPlansSheet } from '../study-plan/MyPlansSheet';
import { ExamSelectionFlow } from '../exam-selection/ExamSelectionFlow';
import { getCategoryConfig, subjectLabel } from '../../data/examSelectionData';
import { CARD, ErrorBox, levelLabel, useTr } from '../study-plan/shared';

type Phase = 'loading' | 'error' | 'setup' | 'resume' | 'intro' | 'test' | 'generating' | 'plan' | 'review';

const isAIPlan = (plan: any): plan is AIStudyPlan => plan?.items?.version === 2 && Array.isArray(plan?.items?.weeks);

/**
 * The study plan journey:
 *   no placement yet → choose level + subjects → intro (what the test covers) → test → AI generating → plan
 *   plan → Saturday review → plan (with the AI's weekly update on top)
 * Plans work like courses: "My plans" keeps every plan, one is studied at a
 * time, and a paused plan for the chosen subjects can be continued.
 */
export const StudyPlanPage: React.FC = () => {
  const { tr, lang } = useTr();
  const { userProfile, highlightTaskId, selectionConfirmedAt, applyExamSelection } = useApp();

  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<PlacementStatus | null>(null);
  const [session, setSession] = useState<PlacementSession | null>(null);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [plan, setPlan] = useState<AIStudyPlan | null>(null);
  const [starting, setStarting] = useState(false);
  // Saved in the setup step on this page; read through a ref because load() can run from a stale closure.
  const confirmedHere = useRef(false);
  // A new plan: choose level and subjects (again), then a fresh test.
  const [retaking, setRetaking] = useState(false);
  const [retakePreview, setRetakePreview] = useState<PlacementPreview | null>(null);

  // My plans
  const [plans, setPlans] = useState<MyPlan[] | null>(null);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [plansOpen, setPlansOpen] = useState(false);
  const [switchingId, setSwitchingId] = useState<number | null>(null);
  // The candidate chose to start fresh instead of continuing a paused plan.
  const startFresh = useRef(false);

  const pausedMatch = (list: MyPlan[] | null) => (list || []).find((p) => p.status === 'paused' && p.matchesSelection) || null;

  const loadPlans = useCallback(async () => {
    setPlansError(null);
    try {
      const list: MyPlan[] = await listMyPlans();
      setPlans(list);
      return list;
    } catch (err: any) {
      setPlansError(err?.message || tr('ទាញយកផែនការមិនបានទេ។', "Couldn't load your plans."));
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async (quiet = false) => {
    if (!quiet) setPhase('loading');
    setError(null);
    try {
      const [placement, planRes] = await Promise.all([getPlacementStatus(), getActiveStudyPlan()]);
      const list = await loadPlans();
      setStatus(placement);
      setResult(placement.result);
      const active = planRes?.plan;

      if (retaking && placement.status === 'completed') {
        // A selection saved mid-way through a new plan reloads the page; stay on those steps.
        setPhase((p) => (p === 'setup' || p === 'intro' || p === 'resume' ? p : 'intro'));
      } else if (!isAIPlan(active) && pausedMatch(list) && !startFresh.current) {
        // A paused plan already exists for these subjects: offer to continue it.
        setPhase('resume');
      } else if (placement.status === 'none' && !selectionConfirmedAt && !confirmedHere.current) {
        // The test is drawn from the chosen level and subjects, so confirm them first.
        setPhase('setup');
      } else if (placement.status !== 'completed') {
        setPhase('intro');
      } else if (isAIPlan(active)) {
        setPlan(active);
        setPhase((p) => (quiet && p === 'review' ? p : 'plan'));
      } else {
        setPhase('generating');
      }
    } catch (err: any) {
      setError(err?.message || tr('ទាញយកផែនការសិក្សាមិនបានទេ។', "Couldn't load your study plan."));
      setPhase('error');
    }
  };

  // Reload whenever the track or subjects change — a new track needs its own placement.
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile.targetExam, (userProfile.selectedSubjects || []).join(',')]);

  // A dashboard deep link to a task should land on the plan, not the review.
  useEffect(() => {
    if (highlightTaskId && phase === 'review') setPhase('plan');
  }, [highlightTaskId, phase]);

  const beginTest = async () => {
    setStarting(true);
    setError(null);
    try {
      setSession(await startPlacement());
      setRetaking(false);
      setPhase('test');
    } catch (err: any) {
      setError(err?.message || tr('ចាប់ផ្តើមតេស្តមិនបានទេ។', "Couldn't start the test."));
      setPhase('intro');
    } finally {
      setStarting(false);
    }
  };

  const startNewPlan = () => {
    setPlansOpen(false);
    setRetaking(true);
    setRetakePreview(null);
    startFresh.current = false;
    setError(null);
    setPhase('setup');
  };

  const showFreshIntro = async () => {
    setPhase('loading');
    try {
      setRetakePreview(await getPlacementPreview());
    } catch {
      setRetakePreview(null);
    }
    setRetaking(true);
    setPhase('intro');
  };

  const afterSetup = async () => {
    confirmedHere.current = true;
    if (!retaking) return load();
    const list = await loadPlans();
    if (pausedMatch(list)) return setPhase('resume');
    await showFreshIntro();
  };

  const continuePlan = async (target: MyPlan) => {
    setSwitchingId(target.planId);
    setPlansError(null);
    try {
      const res = await activateStudyPlan(target.planId);
      setPlan(res.plan);
      setRetaking(false);
      startFresh.current = false;
      setPlansOpen(false);
      setPhase('plan');
      // Mirrors the server's switch; if the selection changed this reloads the page on the new plan.
      applyExamSelection({ targetExam: res.selection.targetExamCode as ExamTarget, selectedSubjects: res.selection.targetSubjects });
      loadPlans();
    } catch (err: any) {
      setPlansError(err?.message || tr('ប្តូរផែនការមិនបានទេ។', "Couldn't switch plans."));
      if (phase === 'resume') setError(err?.message || tr('ប្តូរផែនការមិនបានទេ។', "Couldn't switch plans."));
    } finally {
      setSwitchingId(null);
    }
  };

  const otherPlans = (plans || []).filter((p) => p.status !== 'archived' && p.planId !== plan?.planId).length;
  const resumable = pausedMatch(plans);

  // Small entry to "My plans" on the steps before a plan exists.
  const plansLink =
    (plans || []).length > 0 && (phase === 'setup' || phase === 'intro') ? (
      <button
        type="button"
        onClick={() => setPlansOpen(true)}
        className="self-end inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0a3263] hover:text-[#12427d] cursor-pointer"
      >
        <Layers className="w-4 h-4" aria-hidden="true" />
        {tr(`ផែនការរបស់ខ្ញុំ (${plans!.length})`, `My plans (${plans!.length})`)}
      </button>
    ) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-3">
      {plansLink}

      {phase === 'loading' && (
        <div className="flex flex-col gap-4" aria-busy="true" aria-label={tr('កំពុងទាញយក…', 'Loading…')}>
          <div className="h-8 w-64 rounded-lg bg-slate-200 animate-pulse motion-reduce:animate-none" />
          <div className={`${CARD} h-40 animate-pulse motion-reduce:animate-none`} />
          <div className={`${CARD} h-72 animate-pulse motion-reduce:animate-none`} />
        </div>
      )}

      {phase === 'error' && error && <ErrorBox message={error} onRetry={() => load()} retryLabel={tr('ព្យាយាមម្តងទៀត', 'Try again')} />}

      {phase === 'setup' && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-500">
                {retaking ? tr('បង្កើតផែនការថ្មី · ជំហានទី ១ នៃ ២', 'New plan · step 1 of 2') : tr('ផែនការសិក្សា · ជំហានទី ១ នៃ ២', 'Study plan · step 1 of 2')}
              </span>
              {retaking && plan && (
                <button
                  type="button"
                  onClick={() => {
                    setRetaking(false);
                    setPhase('plan');
                  }}
                  className="text-[13px] font-bold text-[#0a3263] underline underline-offset-4 hover:text-[#12427d] cursor-pointer"
                >
                  {tr('ត្រឡប់ទៅផែនការ', 'Back to the plan')}
                </button>
              )}
            </span>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              {tr(
                'ជ្រើសរើសកម្រិត និងមុខវិជ្ជារបស់អ្នកជាមុនសិន។ សំណួរតេស្តវាស់កម្រិត និងផែនការមួយខែ នឹងយកចេញពីមុខវិជ្ជាទាំងនេះ។',
                'Choose your level and subjects first. The placement test questions and the one-month plan come from these subjects.'
              )}
            </p>
          </div>
          <ExamSelectionFlow onSaved={afterSetup} />
        </div>
      )}

      {phase === 'resume' && resumable && (
        <section className={`${CARD} p-6 flex flex-col gap-4 max-w-2xl`}>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-amber-800">{tr('មានផែនការដែលបានផ្អាក', 'You have a paused plan')}</span>
            <h1 className="text-xl font-bold text-[#0a2540]">
              {resumable.targetSubjects.map((k) => subjectLabel(k, lang)).join(' + ') ||
                (resumable.examCode ? tr(getCategoryConfig(resumable.examCode)?.titleKm || '', getCategoryConfig(resumable.examCode)?.titleEn || '') : '')}
            </h1>
            <p className="text-sm text-slate-600">
              {tr(
                `កម្រិត ${levelLabel(resumable.level, lang)} · ${resumable.weekIndex != null ? `សប្តាហ៍ទី ${resumable.weekIndex + 1} នៃ ${resumable.totalWeeks} · ` : ''}${resumable.tasksDone}/${resumable.tasksTotal} កិច្ចការរួច`,
                `Level: ${levelLabel(resumable.level, lang)} · ${resumable.weekIndex != null ? `week ${resumable.weekIndex + 1} of ${resumable.totalWeeks} · ` : ''}${resumable.tasksDone}/${resumable.tasksTotal} tasks done`
              )}
            </p>
          </div>
          <span className="h-1.5 rounded-full bg-[#dfeaf8] overflow-hidden" aria-hidden="true">
            <span
              className="block h-full rounded-full bg-[#0a3263]"
              style={{ width: `${resumable.tasksTotal ? Math.round((resumable.tasksDone / resumable.tasksTotal) * 100) : 0}%` }}
            />
          </span>
          {error && <ErrorBox message={error} retryLabel="" />}
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => continuePlan(resumable)}
              disabled={switchingId != null}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer disabled:opacity-60"
            >
              {switchingId === resumable.planId ? <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" /> : <Play className="w-4 h-4" aria-hidden="true" />}
              {tr('បន្តផែនការនេះ', 'Continue this plan')}
            </button>
            <button
              type="button"
              onClick={() => {
                startFresh.current = true;
                setError(null);
                showFreshIntro();
              }}
              disabled={switchingId != null}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 bg-white text-[#0a3263] hover:border-[#0a3263] text-sm font-bold transition cursor-pointer disabled:opacity-60"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              {tr('ធ្វើតេស្ត និងបង្កើតថ្មី', 'Take the test and start fresh')}
            </button>
          </div>
          <p className="text-xs text-slate-500">
            {tr('បង្កើតថ្មីនឹងដាក់ផែនការដែលបានផ្អាកនេះទៅក្នុងប្រវត្តិ។', 'Starting fresh moves this paused plan to your history.')}
          </p>
        </section>
      )}

      {phase === 'intro' && (
        <div className="flex flex-col gap-4">
          {error && <ErrorBox message={error} retryLabel="" />}
          <PlacementIntro
            resuming={!retaking && status?.status === 'in-progress'}
            starting={starting}
            preview={retaking ? retakePreview : status?.preview || null}
            onStart={beginTest}
            onChangeSelection={() => setPhase('setup')}
          />
        </div>
      )}

      {phase === 'test' && session && (
        <PlacementTest
          session={session}
          onPause={() => load()}
          onSubmitted={(res) => {
            setResult(res);
            setPhase('generating');
          }}
        />
      )}

      {phase === 'generating' && (
        <PlanGenerating
          result={result}
          onReady={(next) => {
            setPlan(next);
            startFresh.current = false;
            setPhase('plan');
            loadPlans();
          }}
        />
      )}

      {phase === 'plan' && plan && (
        <PlanView
          plan={plan}
          onPlanChange={setPlan}
          onOpenReview={() => setPhase('review')}
          onOpenPlans={() => {
            setPlansOpen(true);
            loadPlans();
          }}
          otherPlans={otherPlans}
          onNewPlan={startNewPlan}
          onReload={() => load(true)}
        />
      )}

      {phase === 'review' && (
        <WeeklyReview
          onBack={() => {
            setPhase('plan');
            load(true);
          }}
        />
      )}

      {plansOpen && (
        <MyPlansSheet
          plans={plans}
          error={plansError}
          switchingId={switchingId}
          onRetry={loadPlans}
          onContinue={continuePlan}
          onNewPlan={startNewPlan}
          onClose={() => setPlansOpen(false)}
        />
      )}
    </div>
  );
};
