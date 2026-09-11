import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIStudyPlan, PlacementPreview, PlacementResult, PlacementSession, PlacementStatus } from '../../types/aiStudyPlan';
import { getActiveStudyPlan } from '../../services/studyPlanService';
import { getPlacementPreview, getPlacementStatus, startPlacement } from '../../services/placementService';
import { PlacementIntro } from '../study-plan/PlacementIntro';
import { PlacementTest } from '../study-plan/PlacementTest';
import { PlanGenerating } from '../study-plan/PlanGenerating';
import { PlanView } from '../study-plan/PlanView';
import { WeeklyReview } from '../study-plan/WeeklyReview';
import { ExamSelectionFlow } from '../exam-selection/ExamSelectionFlow';
import { CARD, ErrorBox, useTr } from '../study-plan/shared';

type Phase = 'loading' | 'error' | 'setup' | 'intro' | 'test' | 'generating' | 'plan' | 'review';

const isAIPlan = (plan: any): plan is AIStudyPlan => plan?.items?.version === 2 && Array.isArray(plan?.items?.weeks);

/**
 * The study plan journey:
 *   no placement yet → choose level + subjects → intro (what the test covers) → test → AI generating → plan
 *   plan → Saturday review → plan (with the AI's weekly update on top)
 * Plans from the old generator (no weeks, reading tasks) are rebuilt from the
 * latest placement result rather than shown half-broken.
 */
export const StudyPlanPage: React.FC = () => {
  const { tr } = useTr();
  const { userProfile, highlightTaskId, selectionConfirmedAt } = useApp();

  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<PlacementStatus | null>(null);
  const [session, setSession] = useState<PlacementSession | null>(null);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [plan, setPlan] = useState<AIStudyPlan | null>(null);
  const [starting, setStarting] = useState(false);
  // Saved in the setup step on this page; read through a ref because load() can run from a stale closure.
  const confirmedHere = useRef(false);
  // Retaking from the plan: choose level and subjects again, then a fresh test.
  const [retaking, setRetaking] = useState(false);
  const [retakePreview, setRetakePreview] = useState<PlacementPreview | null>(null);

  const load = async (quiet = false) => {
    if (!quiet) setPhase('loading');
    setError(null);
    try {
      const [placement, planRes] = await Promise.all([getPlacementStatus(), getActiveStudyPlan()]);
      setStatus(placement);
      setResult(placement.result);
      const active = planRes?.plan;

      if (retaking && placement.status === 'completed') {
        // A selection saved mid-retake reloads the page; stay on the retake steps.
        setPhase((p) => (p === 'setup' || p === 'intro' ? p : 'intro'));
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

  const startRetake = () => {
    setRetaking(true);
    setRetakePreview(null);
    setError(null);
    setPhase('setup');
  };

  const afterSetup = async () => {
    confirmedHere.current = true;
    if (!retaking) return load();
    setPhase('loading');
    try {
      setRetakePreview(await getPlacementPreview());
    } catch {
      setRetakePreview(null);
    }
    setPhase('intro');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
                {retaking ? tr('ធ្វើតេស្តវាស់កម្រិតម្តងទៀត · ជំហានទី ១ នៃ ២', 'Retake the placement test · step 1 of 2') : tr('ផែនការសិក្សា · ជំហានទី ១ នៃ ២', 'Study plan · step 1 of 2')}
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
            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
              {tr(
                'ជ្រើសរើសកម្រិត និងមុខវិជ្ជារបស់អ្នកជាមុនសិន។ សំណួរតេស្តវាស់កម្រិត និងផែនការមួយខែ នឹងយកចេញពីមុខវិជ្ជាទាំងនេះ។',
                'Choose your level and subjects first. The placement test questions and the one-month plan come from these subjects.'
              )}
            </p>
          </div>
          <ExamSelectionFlow onSaved={afterSetup} />
        </div>
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
            setPhase('plan');
          }}
        />
      )}

      {phase === 'plan' && plan && (
        <PlanView
          plan={plan}
          onPlanChange={setPlan}
          onOpenReview={() => setPhase('review')}
          onRegenerate={startRetake}
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
    </div>
  );
};
