import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { StudyPlanRecord, StudyPlanTask, StudyPlanDay, ExamTarget } from '../../types';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import {
  getActiveStudyPlan,
  generateStudyPlan,
  updateStudyTaskStatus,
} from '../../services/studyPlanService';
import {
  getSubjectOptions,
  flattenSubjectOptions,
  isSubjectSelectionValid,
  pairMatchesKeys,
  SubjectOptions,
} from '../../services/subjectOptionsService';
import {
  Sparkles,
  BookOpen,
  Clock,
  Play,
  Sliders,
  Award,
  Check,
  Loader2,
  AlertTriangle,
  CalendarPlus,
  Wand2,
  ListChecks,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  CalendarDays,
  RefreshCw,
  Layers,
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

const EXAM_OPTIONS: { id: ExamTarget; km: string; en: string }[] = [
  { id: 'nie', km: 'NIE (គ្រូវិទ្យាល័យ)', en: 'NIE (Upper Secondary)' },
  { id: 'rttc', km: 'RTTC (គ្រូអនុ)', en: 'RTTC (Lower Secondary)' },
  { id: 'pttc', km: 'PTTC (គ្រូបឋម)', en: 'PTTC (Primary)' },
  { id: 'kindergarten', km: 'មត្តេយ្យ', en: 'Kindergarten' },
];

const LEVEL_OPTIONS: { id: 'beginner' | 'intermediate' | 'advanced'; km: string; en: string }[] = [
  { id: 'beginner', km: 'ទើបចាប់ផ្តើម', en: 'Beginner' },
  { id: 'intermediate', km: 'មធ្យម', en: 'Intermediate' },
  { id: 'advanced', km: 'រឹងមាំ', en: 'Advanced' },
];

const DAILY_MINUTE_OPTIONS = [30, 60, 90];

// ProfilePage drops this key right before routing here, so a candidate who
// just changed their target exam / daily goal lands directly in the wizard
// instead of having to hunt for "Adjust Course Settings" again.
const OPEN_WIZARD_KEY = 'passkru_open_study_plan_wizard';

// Wizard steps are addressed by stable id rather than by position, because the
// subject step is conditionally skipped for generalist tracks (PTTC /
// kindergarten). The visible sequence — and therefore the dot indicator, the
// "Step X of N" counter and both Back and Next — is derived from these at
// render time, so a skipped step can never be landed on from either direction.
const STEP_EXAM = 0;
const STEP_SUBJECTS = 1;
const STEP_DAILY = 2;
const STEP_LEVEL = 3;
const STEP_DATE = 4;
const STEP_REVIEW = 5;

const ALL_WIZARD_STEPS = [STEP_EXAM, STEP_SUBJECTS, STEP_DAILY, STEP_LEVEL, STEP_DATE, STEP_REVIEW];
const WIZARD_STEPS_WITHOUT_SUBJECTS = ALL_WIZARD_STEPS.filter((s) => s !== STEP_SUBJECTS);

function todayDateString(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function isKnowledgeLevel(value: unknown): value is 'beginner' | 'intermediate' | 'advanced' {
  return value === 'beginner' || value === 'intermediate' || value === 'advanced';
}

/**
 * The generator persists the majors a course was built for on
 * `items.targetSubjects`. It is not declared on StudyPlanItems yet, so read it
 * defensively rather than trusting the type.
 */
function readPlanSubjects(source: StudyPlanRecord | null): string[] {
  const raw = (source?.items as { targetSubjects?: unknown } | undefined)?.targetSubjects;
  if (!Array.isArray(raw)) return [];
  return raw.filter((k): k is string => typeof k === 'string' && k.length > 0);
}

export const StudyPlanPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const {
    userProfile,
    setCurrentPage,
    startQuizById,
    startMockExamById,
    highlightTaskId,
    setHighlightTaskId,
  } = useApp();

  const [plan, setPlan] = useState<StudyPlanRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  // Toggling a task used to fail silently (it just re-fetched), so a failed
  // tick looked like nothing happened at all.
  const [taskError, setTaskError] = useState<string | null>(null);

  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(0);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const [targetExam, setTargetExam] = useState<ExamTarget>(userProfile.targetExam);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(userProfile.dailyGoalMinutes || 60);
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [examDate, setExamDate] = useState<string>('');

  // Subject step — the selectable options depend entirely on the exam track,
  // so they're fetched on every exam change rather than once on mount.
  const [targetSubjects, setTargetSubjects] = useState<string[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<SubjectOptions | null>(null);
  const [subjectOptionsLoading, setSubjectOptionsLoading] = useState<boolean>(false);
  const [subjectOptionsError, setSubjectOptionsError] = useState<string | null>(null);
  // Set when the track has no rules configured (404) or the candidate chose to
  // continue past a fetch failure — the step is dropped and no subject list is
  // submitted, so the server keeps whatever is already on the profile.
  const [subjectStepDismissed, setSubjectStepDismissed] = useState<boolean>(false);
  const [showSubjectHint, setShowSubjectHint] = useState<boolean>(false);
  // Guards against a slow NIE response landing after a fast RTTC one.
  const subjectFetchSeq = useRef(0);

  // Day-detail view: the "Course Modules" list is now clickable, so a
  // candidate can open day 14 and act on it rather than only being able to
  // touch the auto-ranked top-5 "Next Up".
  const [openDayDate, setOpenDayDate] = useState<string | null>(null);
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);
  const deepLinkHandled = useRef(false);

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

  // Seed the wizard from whatever the plan (or profile) actually says, so
  // "Adjust Course Settings" opens showing the current configuration rather
  // than a hardcoded default.
  const seedWizardFields = (source: StudyPlanRecord | null) => {
    setTargetExam(userProfile.targetExam);
    setDailyGoalMinutes(source?.items.dailyGoalMinutes || userProfile.dailyGoalMinutes || 60);
    const storedLevel = source?.items.knowledgeLevel;
    setLevel(isKnowledgeLevel(storedLevel) ? storedLevel : 'intermediate');
    setExamDate(source?.items.examDate || '');
    // Pre-select the majors the current course was actually generated with —
    // same class of bug as knowledgeLevel, which used to reset to
    // 'intermediate' every time the wizard re-opened. Falls back to the
    // profile so a first-time candidate still starts from their saved choice.
    const planSubjects = readPlanSubjects(source);
    setTargetSubjects(
      planSubjects.length
        ? planSubjects
        : (userProfile.targetSubjects || []).filter(Boolean)
    );
    setSubjectStepDismissed(false);
    setShowSubjectHint(false);
  };

  const openSetupModal = () => {
    setError(null);
    seedWizardFields(plan);
    setWizardStep(0);
    setShowSetupModal(true);
  };

  // Profile → Study Plan handoff. Runs once the plan has loaded so the wizard
  // opens pre-filled with the plan's real settings.
  useEffect(() => {
    if (loading) return;
    let requested = false;
    try {
      requested = sessionStorage.getItem(OPEN_WIZARD_KEY) === '1';
      if (requested) sessionStorage.removeItem(OPEN_WIZARD_KEY);
    } catch {
      // Private-mode / blocked storage — nothing to do, just skip the handoff.
    }
    if (requested) {
      seedWizardFields(plan);
      setWizardStep(0);
      setShowSetupModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Dashboard's "Continue course" promises a specific task — land on it.
  useEffect(() => {
    if (!plan || !highlightTaskId || deepLinkHandled.current) return;
    const taskId = highlightTaskId;
    deepLinkHandled.current = true;

    const day = plan.items.days.find((d) => d.tasks.some((tk) => tk.id === taskId));
    if (day) setOpenDayDate(day.date);
    setHighlightedTaskId(taskId);
    setHighlightTaskId(null);

    const scrollTimer = window.setTimeout(() => {
      const el =
        document.getElementById(`day-task-${taskId}`) || document.getElementById(`task-${taskId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
    const fadeTimer = window.setTimeout(() => setHighlightedTaskId(null), 6000);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(fadeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, highlightTaskId]);

  // ------------------------------------------------ subject-step machinery --
  // "Skipped" covers both the generalist tracks (selectionMode 'none') and the
  // degraded cases — an exam code with no rules configured (404), or a fetch
  // the candidate chose to move past. In every skipped case the step is absent
  // from the visible sequence entirely, so Back from "Daily study time" lands
  // on the exam step rather than on a blank question.
  // Settled with no options at all (nothing fetched yet, or a response we
  // couldn't use): there is no question to ask, so don't put an empty step in
  // the sequence.
  const subjectOptionsMissing =
    !subjectOptions && !subjectOptionsLoading && !subjectOptionsError;
  const skipSubjectStep =
    subjectStepDismissed || subjectOptionsMissing || subjectOptions?.selectionMode === 'none';
  const visibleWizardSteps = skipSubjectStep ? WIZARD_STEPS_WITHOUT_SUBJECTS : ALL_WIZARD_STEPS;
  const wizardPosition = Math.max(0, visibleWizardSteps.indexOf(wizardStep));
  const subjectSelectionValid = isSubjectSelectionValid(subjectOptions, targetSubjects);

  const subjectLabelByKey = new Map(
    flattenSubjectOptions(subjectOptions).map((s) => [s.key, s])
  );
  const selectedSubjectLabels = targetSubjects.map((key) => {
    const found = subjectLabelByKey.get(key);
    return found ? (lang === 'km' ? found.km : found.en) : key;
  });

  const loadSubjectOptions = async (exam: ExamTarget) => {
    const seq = ++subjectFetchSeq.current;
    // Drop the previous track's options immediately so nothing (step title,
    // review summary, option list) renders RTTC data under an NIE heading
    // while the new request is in flight.
    setSubjectOptions(null);
    setSubjectOptionsLoading(true);
    setSubjectOptionsError(null);
    setSubjectStepDismissed(false);
    setShowSubjectHint(false);
    try {
      const res = await getSubjectOptions(exam);
      if (seq !== subjectFetchSeq.current) return; // a newer exam won the race
      const opts = res?.options || null;
      setSubjectOptions(opts);
      if (opts?.selectionMode === 'none') {
        // Generalist track — decided for the candidate, silently.
        setTargetSubjects((opts.defaultSubjects || []).map((s) => s.key));
      } else {
        // A selection made for the previous track is very unlikely to be valid
        // for this one (an NIE single major is not an RTTC pairing), so drop it
        // unless it still checks out against the new rules.
        setTargetSubjects((prev) => (isSubjectSelectionValid(opts, prev) ? prev : []));
      }
    } catch (err: any) {
      if (seq !== subjectFetchSeq.current) return;
      setSubjectOptions(null);
      if (err?.statusCode === 404) {
        // No rules configured for this exam code — skip the step instead of
        // blocking the wizard on a question we can't ask.
        setSubjectStepDismissed(true);
        setTargetSubjects([]);
      } else {
        setSubjectOptionsError(
          err?.message ||
            (lang === 'km'
              ? 'មិនអាចទាញយកបញ្ជីមុខវិជ្ជាបានទេ។'
              : "Couldn't load the subject list.")
        );
      }
    } finally {
      if (seq === subjectFetchSeq.current) setSubjectOptionsLoading(false);
    }
  };

  // Refetch on every exam change, not once on mount — switching NIE → RTTC has
  // to swap the whole step from single-select to pairings.
  useEffect(() => {
    if (!showSetupModal) return;
    loadSubjectOptions(targetExam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSetupModal, targetExam]);

  // The candidate can reach the subject step while the fetch is still in
  // flight (Next straight off the exam step). If it resolves to a skipped
  // track, move them along instead of leaving them on a step that no longer
  // exists in the sequence.
  useEffect(() => {
    if (showSetupModal && wizardStep === STEP_SUBJECTS && skipSubjectStep) {
      setWizardStep(STEP_DAILY);
    }
  }, [showSetupModal, wizardStep, skipSubjectStep]);

  const goToNextStep = () => {
    // Hard gate: the subject step can't be passed without a complete choice.
    if (wizardStep === STEP_SUBJECTS && !skipSubjectStep && !subjectSelectionValid) {
      setShowSubjectHint(true);
      return;
    }
    const next = visibleWizardSteps[wizardPosition + 1];
    if (next !== undefined) setWizardStep(next);
  };

  const goToPreviousStep = () => {
    if (wizardPosition <= 0) {
      setShowSetupModal(false);
      return;
    }
    setWizardStep(visibleWizardSteps[wizardPosition - 1]);
  };

  const handleGeneratePlan = async (resetProgress = false) => {
    setGenerating(true);
    setError(null);
    try {
      const res = await generateStudyPlan({
        targetExam,
        // Keys, never display labels. Omitted entirely when we have nothing
        // valid to send (unknown exam code / skipped after a fetch failure) so
        // the server falls back to the subjects already on the profile rather
        // than being told to clear them.
        targetSubjects: targetSubjects.length ? targetSubjects : undefined,
        dailyGoalMinutes,
        knowledgeLevel: level,
        examDate: examDate || undefined,
        resetProgress: resetProgress || undefined,
      });
      setPlan(res.plan);
      setShowSetupModal(false);
      setShowResetConfirm(false);
      setOpenDayDate(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate course');
      // Drop back to the wizard so the failure message is actually visible
      // instead of sitting behind the confirm dialog.
      setShowResetConfirm(false);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleTask = async (dayDate: string, task: StudyPlanTask) => {
    if (!plan) return;
    const nextCompleted = !task.completed;
    setTaskError(null);

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
    } catch (err: any) {
      // Revert on failure — and say so, instead of the tick silently undoing
      // itself with no explanation.
      setTaskError(
        err?.message ||
          (lang === 'km'
            ? 'មិនអាចរក្សាទុកស្ថានភាពកិច្ចការបានទេ។ សូមព្យាយាមម្តងទៀត។'
            : "Couldn't save that task — please try again.")
      );
      loadPlan();
    }
  };

  const handleStartTask = (task: StudyPlanTask) => {
    // Each task carries the real quiz/mock-exam the generator matched it to,
    // so starting one opens that exact quiz — and the attempt it produces
    // feeds back into topic proficiency and weak areas. Tasks generated
    // before content existed may have no id; those fall through to the
    // picker rather than launching something unrelated.
    if (task.targetAction === 'quiz') {
      if (task.quizId) startQuizById(task.quizId);
      else setCurrentPage('quiz');
    } else if (task.targetAction === 'mock-exam') {
      if (task.mockExamId) startMockExamById(task.mockExamId);
      else setCurrentPage('practice');
    } else if (task.targetAction === 'past-papers') {
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
  const openDay: StudyPlanDay | null =
    (openDayDate && modules.find((d) => d.date === openDayDate)) || null;

  /** Shared task row — identical in "Next Up" and the day-detail view. */
  const renderTaskRow = (
    task: StudyPlanTask,
    dayDate: string,
    idPrefix: 'task' | 'day-task'
  ) => {
    const isHighlighted = highlightedTaskId === task.id;
    return (
      <div
        key={`${idPrefix}-${task.id}`}
        id={`${idPrefix}-${task.id}`}
        className={`p-4 rounded-2xl border shadow-2xs transition flex items-center justify-between gap-3 ${
          isHighlighted
            ? 'border-[#0a3263] ring-2 ring-[#0a3263]/25 bg-[#0a3263]/[0.04]'
            : 'border-slate-200 hover:border-[#0a3263]/40 bg-white'
        }`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => handleToggleTask(dayDate, task)}
            aria-label={task.completed ? 'Mark as not done' : 'Mark as done'}
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition cursor-pointer shrink-0 border-2 ${
              task.completed
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 hover:border-[#0a3263] text-transparent'
            }`}
          >
            <Check className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <p
              className={`text-sm font-semibold truncate ${
                task.completed ? 'text-slate-400 line-through' : 'text-slate-800'
              }`}
            >
              {task.title}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="text-indigo-600 font-medium">
                {TASK_TYPE_LABEL[task.type]?.[lang] || task.type}
              </span>
              <span>•</span>
              <span>
                {task.estimatedMinutes} {lang === 'km' ? 'នាទី' : 'mins'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => handleStartTask(task)}
          className="px-3 py-1.5 rounded-lg bg-[#0a3263] hover:bg-[#082447] text-white text-xs font-bold shrink-0 transition cursor-pointer flex items-center gap-1"
        >
          <Play className="w-3 h-3 fill-white" />
          <span>{lang === 'km' ? 'ធ្វើ' : 'Start'}</span>
        </button>
      </div>
    );
  };

  // ---------------------------------------------------------------- wizard --
  // Keyed by step id (not position) so the conditional subject step can drop
  // out without shifting every later step's copy onto the wrong question.
  const wizardStepMeta: Record<number, { title: string; hint: string }> = {
    [STEP_EXAM]: {
      title: lang === 'km' ? 'ក្របខណ្ឌប្រឡងគោលដៅ' : 'Target exam category',
      hint:
        lang === 'km'
          ? 'ជ្រើសរើសក្របខណ្ឌដែលអ្នកកំពុងត្រៀម។'
          : "Which teacher-recruitment exam are you preparing for?",
    },
    [STEP_SUBJECTS]: {
      title:
        subjectOptions?.selectionMode === 'pair'
          ? lang === 'km'
            ? 'គូមុខវិជ្ជាឯកទេស'
            : 'Your subject pairing'
          : lang === 'km'
          ? 'មុខវិជ្ជាឯកទេស'
          : 'Your major subject',
      hint:
        subjectOptions?.selectionMode === 'pair'
          ? lang === 'km'
            ? 'RTTC ផ្តល់សញ្ញាបត្រតាមគូមុខវិជ្ជាកំណត់ជាមុន — ជ្រើសរើសមួយគូ។'
            : 'RTTC certifies in predefined subject pairings — pick one pairing.'
          : lang === 'km'
          ? 'វគ្គសិក្សានឹងផ្តោតលើមុខវិជ្ជានេះ។'
          : 'Your course will be weighted towards this subject.',
    },
    [STEP_DAILY]: {
      title: lang === 'km' ? 'ពេលវេលារៀនក្នុងមួយថ្ងៃ' : 'Daily study time',
      hint:
        lang === 'km'
          ? 'យើងនឹងកំណត់ទំហំកិច្ចការប្រចាំថ្ងៃតាមពេលវេលានេះ។'
          : "We'll size each day's tasks to fit this.",
    },
    [STEP_LEVEL]: {
      title: lang === 'km' ? 'កម្រិតចំណេះដឹងបច្ចុប្បន្ន' : 'Current knowledge level',
      hint:
        lang === 'km'
          ? 'ជួយកំណត់ចំណុចចាប់ផ្តើម និងល្បឿននៃវគ្គសិក្សា។'
          : 'Sets the starting point and pace of your course.',
    },
    [STEP_DATE]: {
      title: lang === 'km' ? 'ថ្ងៃប្រឡង (ស្រេចចិត្ត)' : 'Exam date (optional)',
      hint:
        lang === 'km'
          ? 'ទុកទទេបាន បើអ្នកមិនទាន់ដឹងថ្ងៃប្រឡង។'
          : "Leave it blank if you don't know it yet.",
    },
    [STEP_REVIEW]: {
      title: lang === 'km' ? 'ពិនិត្យ & បង្កើត' : 'Review & generate',
      hint:
        lang === 'km'
          ? 'ពិនិត្យជម្រើសរបស់អ្នកមុនបង្កើតវគ្គសិក្សា។'
          : 'Check your choices before generating the course.',
    },
  };

  const optionButtonClass = (selected: boolean) =>
    `p-3 rounded-xl border font-semibold text-xs transition cursor-pointer ${
      selected
        ? 'bg-[#0a3263] text-white border-[#0a3263]'
        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
    }`;

  const reviewRow = (label: string, value: string) => (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <span className="text-xs font-bold text-slate-900 text-right">{value}</span>
    </div>
  );

  // Selected state has to be unmistakable at a glance: navy fill + ring + an
  // explicit CheckCircle2 marker, not just a border tint.
  const subjectCardClass = (selected: boolean) =>
    `w-full text-left p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a3263]/40 ${
      selected
        ? 'bg-[#0a3263] border-[#0a3263] text-white ring-2 ring-[#0a3263]/25 shadow-md'
        : 'bg-white border-slate-200 text-slate-800 shadow-2xs hover:border-slate-300 hover:shadow-md'
    }`;

  const renderSubjectStep = () => {
    if (subjectOptionsLoading) {
      return (
        <div className="space-y-2" aria-busy="true">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center gap-3 animate-pulse"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-2/3" />
                <div className="h-2.5 bg-slate-100 rounded w-1/3" />
              </div>
            </div>
          ))}
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin" />
            {lang === 'km' ? 'កំពុងទាញយកមុខវិជ្ជា...' : 'Loading subjects…'}
          </p>
        </div>
      );
    }

    if (subjectOptionsError) {
      // Never a hard block — retry, or move on and let the server keep the
      // subjects already saved on the profile.
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 space-y-3">
          <p className="text-xs font-semibold text-red-700 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-px" />
            <span>{subjectOptionsError}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => loadSubjectOptions(targetExam)}
              className="px-3 py-2 rounded-xl bg-[#0a3263] hover:bg-[#082447] text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ព្យាយាមម្តងទៀត' : 'Try again'}</span>
            </button>
            <button
              onClick={() => {
                setSubjectStepDismissed(true);
                setSubjectOptionsError(null);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              {lang === 'km' ? 'បន្តដោយមិនជ្រើសរើស' : 'Continue without choosing'}
            </button>
          </div>
        </div>
      );
    }

    if (!subjectOptions || subjectOptions.selectionMode === 'none') {
      // Only reachable for a frame or two — the skip effect moves on.
      return null;
    }

    const hintBlock =
      showSubjectHint && !subjectSelectionValid ? (
        <p className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
          <span>
            {subjectOptions.selectionMode === 'pair'
              ? lang === 'km'
                ? 'សូមជ្រើសរើសគូមុខវិជ្ជាមួយ មុនបន្តទៅជំហានបន្ទាប់។'
                : 'Pick one subject pairing before continuing.'
              : lang === 'km'
              ? 'សូមជ្រើសរើសមុខវិជ្ជាមួយ មុនបន្តទៅជំហានបន្ទាប់។'
              : 'Pick one subject before continuing.'}
          </span>
        </p>
      ) : null;

    if (subjectOptions.selectionMode === 'pair') {
      // One card per pairing — the candidate picks the pair as a unit, these
      // are fixed combinations rather than any two subjects.
      return (
        <div className="space-y-2.5">
          <p className="text-[11px] text-slate-400">
            {lang === 'km'
              ? `ជ្រើសរើស ១ គូ (${subjectOptions.requiredCount} មុខវិជ្ជា)`
              : `Choose 1 pairing (${subjectOptions.requiredCount} subjects)`}
          </p>
          <div className="grid grid-cols-1 gap-2 max-h-[19rem] overflow-y-auto pr-1">
            {(subjectOptions.pairs || []).map((pair) => {
              const selected = pairMatchesKeys(pair, targetSubjects);
              const names = (pair.subjects || []).map((s) => (lang === 'km' ? s.km : s.en));
              const altNames = (pair.subjects || []).map((s) => (lang === 'km' ? s.en : s.km));
              return (
                <button
                  key={pair.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setTargetSubjects((pair.subjects || []).map((s) => s.key));
                    setShowSubjectHint(false);
                  }}
                  className={subjectCardClass(selected)}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        selected ? 'bg-white/15 text-white' : 'bg-[#0a3263]/10 text-[#0a3263]'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold leading-snug break-words">
                        {names.join(' + ')}
                      </span>
                      <span
                        className={`block text-[11px] leading-snug break-words ${
                          selected ? 'text-white/70' : 'text-slate-500'
                        }`}
                      >
                        {altNames.join(' + ')}
                      </span>
                    </span>
                  </span>
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 ${selected ? 'text-white' : 'text-slate-200'}`}
                  />
                </button>
              );
            })}
          </div>
          {hintBlock}
        </div>
      );
    }

    return (
      <div className="space-y-2.5">
        <p className="text-[11px] text-slate-400">
          {lang === 'km'
            ? `ជ្រើសរើស ${subjectOptions.requiredCount} មុខវិជ្ជា`
            : `Choose exactly ${subjectOptions.requiredCount} subject`}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[19rem] overflow-y-auto pr-1">
          {(subjectOptions.subjects || []).map((subject) => {
            const selected = targetSubjects.length === 1 && targetSubjects[0] === subject.key;
            return (
              <button
                key={subject.key}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setTargetSubjects([subject.key]);
                  setShowSubjectHint(false);
                }}
                className={subjectCardClass(selected)}
              >
                <span className="min-w-0">
                  <span className="block text-xs font-bold leading-snug break-words">
                    {lang === 'km' ? subject.km : subject.en}
                  </span>
                  <span
                    className={`block text-[11px] leading-snug break-words ${
                      selected ? 'text-white/70' : 'text-slate-500'
                    }`}
                  >
                    {lang === 'km' ? subject.en : subject.km}
                  </span>
                </span>
                <CheckCircle2
                  className={`w-5 h-5 shrink-0 ${selected ? 'text-white' : 'text-slate-200'}`}
                />
              </button>
            );
          })}
        </div>
        {hintBlock}
      </div>
    );
  };

  const renderWizardStep = () => {
    switch (wizardStep) {
      case STEP_EXAM:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {EXAM_OPTIONS.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setTargetExam(ex.id)}
                className={optionButtonClass(targetExam === ex.id)}
              >
                {lang === 'km' ? ex.km : ex.en}
              </button>
            ))}
          </div>
        );
      case STEP_SUBJECTS:
        return renderSubjectStep();
      case STEP_DAILY:
        return (
          <div className="grid grid-cols-3 gap-2">
            {DAILY_MINUTE_OPTIONS.map((mins) => (
              <button
                key={mins}
                onClick={() => setDailyGoalMinutes(mins)}
                className={optionButtonClass(dailyGoalMinutes === mins)}
              >
                {mins} {lang === 'km' ? 'នាទី' : 'mins'}
              </button>
            ))}
          </div>
        );
      case STEP_LEVEL:
        return (
          <div className="grid grid-cols-3 gap-2">
            {LEVEL_OPTIONS.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setLevel(lvl.id)}
                className={optionButtonClass(level === lvl.id)}
              >
                {lang === 'km' ? lvl.km : lvl.en}
              </button>
            ))}
          </div>
        );
      case STEP_DATE:
        return (
          <div className="space-y-2">
            <input
              type="date"
              value={examDate}
              min={todayDateString()}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0a3263]/25 focus:border-[#0a3263]"
            />
            {examDate && (
              <button
                onClick={() => setExamDate('')}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                {lang === 'km' ? 'សម្អាតថ្ងៃប្រឡង' : 'Clear exam date'}
              </button>
            )}
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {lang === 'km'
                ? 'ត្រូវការតែពេលអ្នកដឹងច្បាស់ថ្ងៃប្រឡងប៉ុណ្ណោះ — ប្រើសម្រាប់ណែនាំល្បឿនសិក្សាបន្ថែម មិនចាំបាច់ដើម្បីបង្កើតវគ្គសិក្សាទេ។ បើទុកទទេ វគ្គសិក្សានឹងគ្របដណ្តប់មេរៀនទាំងអស់តាមចំណុចខ្សោយរបស់អ្នក។'
                : "Only needed if you already know your exam date — used for optional pacing hints, not required to generate your course. Leave it blank and the course will cover your full syllabus, weakest topics first."}
            </p>
          </div>
        );
      default: {
        const examLabel = EXAM_OPTIONS.find((e) => e.id === targetExam);
        const levelLabel = LEVEL_OPTIONS.find((l) => l.id === level);
        return (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-1">
              {reviewRow(
                lang === 'km' ? 'ក្របខណ្ឌប្រឡង' : 'Target exam',
                examLabel ? (lang === 'km' ? examLabel.km : examLabel.en) : targetExam.toUpperCase()
              )}
              {reviewRow(
                subjectOptions?.selectionMode === 'pair'
                  ? lang === 'km'
                    ? 'គូមុខវិជ្ជា'
                    : 'Subject pairing'
                  : lang === 'km'
                  ? 'មុខវិជ្ជា'
                  : 'Subject',
                selectedSubjectLabels.length
                  ? selectedSubjectLabels.join(' + ')
                  : lang === 'km'
                  ? 'មិនបានកំណត់'
                  : 'Not set'
              )}
              {reviewRow(
                lang === 'km' ? 'ពេលវេលាប្រចាំថ្ងៃ' : 'Daily study time',
                `${dailyGoalMinutes} ${lang === 'km' ? 'នាទី' : 'mins'}`
              )}
              {reviewRow(
                lang === 'km' ? 'កម្រិតចំណេះដឹង' : 'Knowledge level',
                levelLabel ? (lang === 'km' ? levelLabel.km : levelLabel.en) : level
              )}
              {reviewRow(
                lang === 'km' ? 'ថ្ងៃប្រឡង' : 'Exam date',
                examDate || (lang === 'km' ? 'មិនបានកំណត់' : 'Not set')
              )}
            </div>
            {plan && (
              <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 leading-relaxed">
                {lang === 'km'
                  ? 'ការបង្កើតឡើងវិញនឹងរៀបចំកិច្ចការថ្មីតាមការកំណត់ខាងលើ ដោយរក្សាវឌ្ឍនភាពដែលអ្នកបានធ្វើរួច។'
                  : 'Generating rebuilds your task list from the settings above while keeping the progress you have already made.'}
              </p>
            )}
          </div>
        );
      }
    }
  };

  const isLastStep = wizardStep === STEP_REVIEW;
  // Gate only the subject step; every other step always has a usable value.
  const nextBlocked =
    wizardStep === STEP_SUBJECTS && !skipSubjectStep && !subjectSelectionValid;

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
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#0a3263]/50 text-slate-700 hover:text-[#0a3263] text-xs font-bold shadow-2xs transition cursor-pointer flex items-center gap-2"
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

      {taskError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="truncate">{taskError}</span>
          </span>
          <button
            onClick={() => setTaskError(null)}
            className="p-1 rounded-md hover:bg-red-100 transition cursor-pointer shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {loading ? (
        /* Skeleton loaders — same animate-pulse card pattern as MentorsPage */
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-slate-200 rounded w-2/5" />
                  <div className="h-3 bg-slate-200 rounded w-10" />
                </div>
                <div className="h-8 bg-slate-200 rounded w-1/2" />
                <div className="h-2 bg-slate-100 rounded-full w-full" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((col) => (
              <div
                key={col}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-4 animate-pulse"
              >
                <div className="h-5 bg-slate-200 rounded w-1/3" />
                <div className="h-px bg-slate-100" />
                {[1, 2, 3, 4].map((row) => (
                  <div key={row} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/3" />
                    </div>
                    <div className="h-8 w-16 bg-slate-100 rounded-lg shrink-0" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : !plan ? (
        <div className="bg-white rounded-3xl border border-dashed border-[#0a3263]/40 p-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0a3263]/10 text-[#0a3263] flex items-center justify-center mx-auto">
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
            className="px-5 py-2.5 rounded-xl bg-[#0a3263] hover:bg-[#082447] text-white font-bold text-xs shadow-xs transition cursor-pointer inline-flex items-center gap-2"
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
                <span className="text-xs font-bold text-[#0a3263] bg-[#0a3263]/10 px-2 py-0.5 rounded">
                  {completedTasks}/{totalTasks}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{progressPercent}%</span>
                <span className="text-xs text-slate-500 font-medium">{lang === 'km' ? 'បានរួចរាល់' : 'completed'}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0a3263] h-full rounded-full transition-all duration-300"
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
                <span className="text-2xl font-black text-[#0a3263]">{userProfile.targetExam.toUpperCase()}</span>
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
                  <ListChecks className="w-5 h-5 text-[#0a3263]" />
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
                  {nextUpTasks.map(({ task, dayDate }) => renderTaskRow(task, dayDate, 'task'))}
                </div>
              )}
            </div>

            {/* Course Modules — every day row opens a day-detail view */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#0a3263]" />
                  <span>{lang === 'km' ? 'ម៉ូឌុលវគ្គសិក្សា' : 'Course Modules'}</span>
                </h2>
                <span className="text-xs text-[#0a3263] font-semibold bg-[#0a3263]/10 px-2 py-0.5 rounded">
                  {modules.length} {lang === 'km' ? 'ម៉ូឌុល' : 'Modules'}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 -mt-2">
                {lang === 'km'
                  ? 'ចុចលើថ្ងៃណាមួយ ដើម្បីមើល និងធ្វើកិច្ចការទាំងអស់ក្នុងថ្ងៃនោះ។'
                  : 'Tap any day to open its full task list and start from there.'}
              </p>

              <div className="space-y-2.5 max-h-[32rem] overflow-y-auto pr-1">
                {modules.map((mod) => {
                  const isDone = mod.tasks.length > 0 && mod.tasks.every((t) => t.completed);
                  const doneCount = mod.tasks.filter((t) => t.completed).length;
                  const summary = mod.tasks.map((t) => t.title).join(' • ') || (lang === 'km' ? 'គ្មានកិច្ចការ' : 'No tasks');
                  const totalMinutes = mod.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
                  const typeLabel = MODULE_TYPE_LABEL[mod.dayType]?.[lang] || mod.dayType;

                  return (
                    <button
                      key={mod.date + mod.dayIndex}
                      type="button"
                      onClick={() => setOpenDayDate(mod.date)}
                      aria-label={`${lang === 'km' ? 'ថ្ងៃទី' : 'Day'} ${mod.dayIndex + 1}`}
                      className={`w-full text-left p-3 rounded-xl border flex items-center justify-between gap-3 transition cursor-pointer hover:shadow-2xs ${
                        isDone
                          ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400'
                          : 'bg-slate-50/60 border-slate-200 hover:border-[#0a3263]/50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                            isDone ? 'bg-emerald-600 text-white' : 'bg-[#0a3263] text-white'
                          }`}
                        >
                          {mod.dayIndex + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-slate-800">
                            <span className="text-indigo-600">{typeLabel}</span> — {summary}
                          </p>
                          <span className="text-[11px] text-slate-500">
                            {totalMinutes} {lang === 'km' ? 'នាទី' : 'min'} • {doneCount}/{mod.tasks.length}{' '}
                            {lang === 'km' ? 'រួច' : 'done'}
                          </span>
                        </div>
                      </div>

                      <span className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200/80 text-slate-600'
                          }`}
                        >
                          {isDone ? (lang === 'km' ? 'រួច' : 'Done') : (lang === 'km' ? 'ខាងមុខ' : 'Upcoming')}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Day Detail Modal */}
      {openDay && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-[#0a3263] text-white flex items-center justify-center font-black shrink-0">
                  {openDay.dayIndex + 1}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-extrabold text-slate-900 truncate">
                    {lang === 'km' ? `ថ្ងៃទី ${openDay.dayIndex + 1}` : `Day ${openDay.dayIndex + 1}`}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>{openDay.date}</span>
                    <span>•</span>
                    <span className="text-indigo-600 font-semibold">
                      {MODULE_TYPE_LABEL[openDay.dayType]?.[lang] || openDay.dayType}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpenDayDate(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
                aria-label={t('close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {openDay.tasks.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">
                {lang === 'km' ? 'គ្មានកិច្ចការសម្រាប់ថ្ងៃនេះទេ។' : 'No tasks scheduled for this day.'}
              </p>
            ) : (
              <div className="space-y-3">
                {openDay.tasks.map((task) => renderTaskRow(task, openDay.date, 'day-task'))}
              </div>
            )}

            {/* Prev / next day navigation, so browsing doesn't mean closing
                and re-opening the modal for every day. */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  const idx = modules.findIndex((d) => d.date === openDay.date);
                  if (idx > 0) setOpenDayDate(modules[idx - 1].date);
                }}
                disabled={modules.findIndex((d) => d.date === openDay.date) <= 0}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{lang === 'km' ? 'ថ្ងៃមុន' : 'Previous day'}</span>
              </button>
              <button
                onClick={() => {
                  const idx = modules.findIndex((d) => d.date === openDay.date);
                  if (idx >= 0 && idx < modules.length - 1) setOpenDayDate(modules[idx + 1].date);
                }}
                disabled={
                  modules.findIndex((d) => d.date === openDay.date) >= modules.length - 1
                }
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span>{lang === 'km' ? 'ថ្ងៃបន្ទាប់' : 'Next day'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Setup Wizard Modal — one question per step */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-3">
              <div className="min-w-0 space-y-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#0a3263]" />
                  <span>{lang === 'km' ? 'កំណត់វគ្គសិក្សា' : 'Configure Your Course'}</span>
                </h3>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {lang === 'km'
                    ? `ជំហានទី ${wizardPosition + 1} ក្នុងចំណោម ${visibleWizardSteps.length}`
                    : `Step ${wizardPosition + 1} of ${visibleWizardSteps.length}`}
                </p>
              </div>
              <button
                onClick={() => setShowSetupModal(false)}
                disabled={generating}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0 disabled:opacity-50"
                aria-label={t('close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step dots */}
            <div className="flex items-center gap-1.5">
              {visibleWizardSteps.map((step, i) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === wizardPosition
                      ? 'bg-[#0a3263] w-8'
                      : i < wizardPosition
                      ? 'bg-[#0a3263]/40 w-4'
                      : 'bg-slate-200 w-4'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-3 text-xs sm:text-sm min-h-[9rem]">
              <div className="space-y-0.5">
                <label className="block font-bold text-slate-800 text-sm">
                  {wizardStepMeta[wizardStep]?.title}
                </label>
                <p className="text-[11px] text-slate-500">{wizardStepMeta[wizardStep]?.hint}</p>
              </div>
              {renderWizardStep()}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold px-3 py-2 rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={goToPreviousStep}
                disabled={generating}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50 flex items-center gap-1"
              >
                {wizardPosition === 0 ? (
                  <span>{t('close')}</span>
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4" />
                    <span>{lang === 'km' ? 'ថយក្រោយ' : 'Back'}</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-3">
                {isLastStep && plan && (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    disabled={generating}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
                  >
                    {lang === 'km' ? 'ចាប់ផ្តើមឡើងវិញទាំងស្រុង' : 'Reset course'}
                  </button>
                )}
                {isLastStep ? (
                  <button
                    onClick={() => handleGeneratePlan(false)}
                    disabled={generating}
                    className="px-5 py-2 rounded-xl bg-[#0a3263] hover:bg-[#082447] disabled:opacity-60 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-2"
                  >
                    {generating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{lang === 'km' ? 'រក្សាទុក & បង្កើតវគ្គសិក្សា' : 'Generate & Save Course'}</span>
                  </button>
                ) : (
                  <button
                    onClick={goToNextStep}
                    // Deliberately still clickable when blocked: pressing it
                    // surfaces the inline hint saying what's missing, which
                    // beats a dead button with no explanation.
                    aria-disabled={nextBlocked}
                    className={`px-5 py-2 rounded-xl bg-[#0a3263] hover:bg-[#082447] text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1 ${
                      nextBlocked ? 'opacity-60' : ''
                    }`}
                  >
                    <span>{lang === 'km' ? 'បន្ទាប់' : 'Next'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showResetConfirm}
        destructive
        busy={generating}
        title={lang === 'km' ? 'ចាប់ផ្តើមវគ្គសិក្សាឡើងវិញ?' : 'Reset your course?'}
        message={
          lang === 'km'
            ? 'វគ្គសិក្សានឹងត្រូវបង្កើតឡើងវិញទាំងស្រុង ហើយវឌ្ឍនភាពបច្ចុប្បន្នរបស់អ្នកនឹងបាត់។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។'
            : 'Your course will be rebuilt from scratch and your current progress will be discarded. This cannot be undone.'
        }
        confirmLabel={lang === 'km' ? 'បាទ/ចាស ចាប់ផ្តើមឡើងវិញ' : 'Yes, reset course'}
        cancelLabel={lang === 'km' ? 'បោះបង់' : 'Cancel'}
        onConfirm={() => handleGeneratePlan(true)}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};
