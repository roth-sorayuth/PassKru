import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Info, Loader2, RefreshCw, Sparkles, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { EXAM_CATEGORIES, ExamCategoryConfig, getCategoryConfig, subjectLabel } from '../../data/examSelectionData';
import {
  ContentCounts,
  getSubjectOptions,
  getTrackAvailability,
  hasAnyContent,
  isSubjectSelectionValid,
  pairMatchesKeys,
  SubjectOption,
  SubjectOptions,
  TrackAvailability,
} from '../../services/subjectOptionsService';

interface ExamSelectionFlowProps {
  isModal?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  /**
   * Used inside the study plan journey: called after saving instead of
   * navigating, and the last step's button leads on to the placement test.
   */
  onSaved?: () => void;
}

type Step = 'track' | 'subject' | 'review';

/**
 * Step 1: exam track. Step 1.5: NIE picks exactly one subject, RTTC picks one
 * pairing, PTTC / kindergarten skip straight to review with ["generalist"].
 * What gets saved is subject keys, validated again by the server.
 */
export const ExamSelectionFlow: React.FC<ExamSelectionFlowProps> = ({ isModal = false, onClose, onSuccess, onSaved }) => {
  const { lang } = useLanguage();
  const tr = (km: string, en: string) => (lang === 'km' ? km : en);
  const { userProfile, saveExamSelection, setCurrentPage } = useApp();

  const initial = getCategoryConfig(userProfile.targetExam);
  const [category, setCategory] = useState<ExamCategoryConfig | null>(
    userProfile.hasCompletedExamSelection ? initial || null : null
  );
  const [picked, setPicked] = useState<string[]>(
    userProfile.hasCompletedExamSelection ? (userProfile.selectedSubjects || []).filter((k) => k !== 'generalist') : []
  );
  const [step, setStep] = useState<Step>('track');

  const [options, setOptions] = useState<SubjectOptions | null>(null);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const fetchSeq = useRef(0);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Content per track from the database. If it can't load, every track stays selectable.
  const [tracks, setTracks] = useState<Record<string, TrackAvailability> | null>(null);
  useEffect(() => {
    let alive = true;
    getTrackAvailability()
      .then((res) => alive && setTracks(Object.fromEntries(res.tracks.map((t) => [t.code, t]))))
      .catch(() => alive && setTracks({}));
    return () => {
      alive = false;
    };
  }, []);
  const trackOf = (cat: ExamCategoryConfig) => tracks?.[cat.targetExam];
  const trackOpen = (cat: ExamCategoryConfig) => trackOf(cat)?.available !== false;

  const mode = category?.selectionMode ?? null;

  const loadOptions = async (cat: ExamCategoryConfig) => {
    if (cat.selectionMode === 'none') return;
    const seq = ++fetchSeq.current;
    setOptions(null);
    setOptionsError(null);
    setOptionsLoading(true);
    try {
      const res = await getSubjectOptions(cat.targetExam);
      if (seq !== fetchSeq.current) return;
      setOptions(res.options);
      // Keep an earlier choice only if it is still valid for this track.
      setPicked((prev) => (isSubjectSelectionValid(res.options, prev) ? prev : []));
    } catch (err: any) {
      if (seq !== fetchSeq.current) return;
      setOptionsError(err?.message || tr('មិនអាចទាញយកបញ្ជីមុខវិជ្ជាបានទេ។', "Couldn't load the subject list."));
    } finally {
      if (seq === fetchSeq.current) setOptionsLoading(false);
    }
  };

  useEffect(() => {
    if (category) loadOptions(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category?.id]);

  const chooseCategory = (cat: ExamCategoryConfig) => {
    if (!trackOpen(cat)) return;
    if (cat.id !== category?.id) setPicked([]);
    setCategory(cat);
    setSaveError(null);
  };

  const subjectValid = mode === 'none' || isSubjectSelectionValid(options, picked);
  const canContinue = step === 'track' ? !!category && trackOpen(category) : step === 'subject' ? subjectValid : true;

  const num = (n: number) => n.toLocaleString(lang === 'km' ? 'km-KH' : 'en-US');
  const countsText = (c: ContentCounts) =>
    [
      c.questions ? tr(`សំណួរ ${num(c.questions)}`, `${num(c.questions)} questions`) : null,
      c.quizzes ? tr(`កម្រងសំណួរ ${num(c.quizzes)}`, `${num(c.quizzes)} quizzes`) : null,
      c.papers ? tr(`វិញ្ញាសា ${num(c.papers)}`, `${num(c.papers)} papers`) : null,
    ]
      .filter(Boolean)
      .join(' · ') || tr('មិនទាន់មានខ្លឹមសារ', 'No content yet');
  const subjectName = (s: SubjectOption) => (lang === 'km' ? s.km : s.en);
  // Only questions feed the placement test and scoring; papers alone can't.
  const noQuestions = (s: SubjectOption) => !!s.content && s.content.questions === 0 && s.content.quizzes === 0;
  const thinSubjects = (options?.selectionMode === 'single'
    ? options.subjects.filter((s) => picked.includes(s.key))
    : options?.selectionMode === 'pair'
      ? options.pairs.flatMap((p) => p.subjects).filter((s, i, all) => picked.includes(s.key) && all.findIndex((x) => x.key === s.key) === i)
      : []
  ).filter(noQuestions);

  const next = () => {
    if (!canContinue || !category) return;
    if (step === 'track') setStep(mode === 'none' ? 'review' : 'subject');
    else if (step === 'subject') setStep('review');
  };
  const back = () => {
    setSaveError(null);
    if (step === 'subject') setStep('track');
    else if (step === 'review') setStep(mode === 'none' ? 'track' : 'subject');
  };

  const savedKeys = mode === 'none' ? ['generalist'] : picked;
  const subjectsText = savedKeys.map((k) => subjectLabel(k, lang)).join(' + ');

  const save = async () => {
    if (!category) return;
    setSaving(true);
    setSaveError(null);
    try {
      await saveExamSelection({
        examCategory: category.titleKm,
        selectedSubjects: savedKeys,
        targetExam: category.targetExam,
      });
      onSuccess?.();
      onClose?.();
      // Next step of the journey: the placement test lives on the study plan page.
      if (onSaved) onSaved();
      else setCurrentPage('study-plan');
    } catch (err: any) {
      setSaveError(err?.message || tr('រក្សាទុកមិនបានទេ។ សូមព្យាយាមម្តងទៀត។', "Couldn't save. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const stepIndex = step === 'track' ? 0 : step === 'subject' ? 1 : 2;
  const skipped = mode === 'none';
  const steps = [
    { label: tr('ក្របខណ្ឌប្រឡង', 'Exam track') },
    { label: skipped ? tr('មុខវិជ្ជា · រំលង', 'Subjects · skipped') : tr('មុខវិជ្ជា', 'Subjects') },
    { label: onSaved ? tr('តេស្តវាស់កម្រិត', 'Placement test') : tr('ពិនិត្យ & រក្សាទុក', 'Review & save') },
  ];

  const heading =
    step === 'track'
      ? [tr('តើអ្នកកំពុងត្រៀមប្រឡងកម្រិតណា?', 'Which level are you preparing for?'), tr('ជម្រើសនេះកំណត់មុខវិជ្ជា សំណួរតេស្ត និងខ្លឹមសារនៃផែនការសិក្សារបស់អ្នក។', 'This decides your subjects, the test questions and what your study plan contains.')]
      : step === 'subject'
        ? mode === 'pair'
          ? [tr('ជ្រើសរើសគូមុខវិជ្ជារបស់អ្នក', 'Choose your subject pairing'), tr('កម្រិតមូលដ្ឋានបង្រៀនមុខវិជ្ជាពីរ។ ជ្រើសរើស ១ គូ។', 'Basic level teaches two subjects. Pick one pairing.')]
          : [tr('ជ្រើសរើសមុខវិជ្ជាឯកទេសរបស់អ្នក', 'Choose your major subject'), tr('កម្រិតឧត្តមប្រឡងលើមុខវិជ្ជាឯកទេសតែមួយ។ ជ្រើសរើស ១ មុខវិជ្ជា។', 'Higher level examines one major. Pick exactly one.')]
        : [tr('ពិនិត្យជម្រើសរបស់អ្នក', 'Review your choice'), tr('អ្នកអាចផ្លាស់ប្តូរជម្រើសនេះពេលក្រោយនៅទំព័រប្រវត្តិរូប។', 'You can change this later from your profile.')];

  const radio = (on: boolean) => (
    <span
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${on ? 'border-[#0a3263]' : 'border-slate-300'}`}
      aria-hidden="true"
    >
      {on && <span className="w-2.5 h-2.5 rounded-full bg-[#0a3263]" />}
    </span>
  );
  const optionClass = (on: boolean) =>
    `w-full text-left rounded-2xl border-[1.5px] transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a3263]/40 ${
      on ? 'border-[#0a3263] bg-[#f4f8fd] shadow-[0_0_0_3px_rgba(10,50,99,0.12)]' : 'border-slate-200 bg-white hover:border-slate-300'
    }`;

  return (
    <div
      className={`w-full ${
        isModal ? 'max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]' : 'max-w-3xl mx-auto'
      }`}
    >
      <div className={`${isModal ? 'p-5 sm:p-7 overflow-y-auto' : 'py-2'} flex flex-col gap-6`}>
        {/* Stepper */}
        <div className="flex items-center gap-3">
          <ol className="flex items-center flex-1 min-w-0" aria-label={tr('ជំហាន', 'Steps')}>
            {steps.map((s, i) => {
              const isSkip = i === 1 && skipped && stepIndex >= 2;
              const done = stepIndex > i && !isSkip;
              const current = stepIndex === i;
              return (
                <li key={i} className={`flex items-center ${i < 2 ? 'flex-1' : ''} min-w-0`} aria-current={current ? 'step' : undefined}>
                  <span className="flex items-center gap-2 shrink-0">
                    <span
                      className={`w-6 h-6 rounded-full border-[1.5px] text-xs font-bold flex items-center justify-center ${
                        current ? 'bg-[#0a3263] border-[#0a3263] text-white' : done ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300 text-slate-500'
                      }`}
                    >
                      {done ? <Check className="w-3.5 h-3.5" /> : isSkip ? '–' : ['១', '២', '៣'][i]}
                    </span>
                    <span className={`hidden sm:inline text-[13px] ${current ? 'font-bold text-[#0a2540]' : done ? 'font-semibold text-slate-700' : 'font-semibold text-slate-500'}`}>
                      {s.label}
                    </span>
                  </span>
                  {i < 2 && <span className={`flex-1 h-0.5 mx-3 rounded ${stepIndex > i ? 'bg-emerald-600' : 'bg-slate-200'}`} />}
                </li>
              );
            })}
          </ol>
          {isModal && userProfile.hasCompletedExamSelection && onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={tr('បិទ', 'Close')}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold text-[#0a2540] leading-snug text-balance">{heading[0]}</h2>
          <p className="text-sm text-slate-500 leading-relaxed">{heading[1]}</p>
        </div>

        {/* Step 1 — track */}
        {step === 'track' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label={tr('ក្របខណ្ឌប្រឡង', 'Exam track')}>
            {EXAM_CATEGORIES.map((cat) => {
              const on = category?.id === cat.id;
              const track = trackOf(cat);
              const open = trackOpen(cat);
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-disabled={!open}
                  onClick={() => chooseCategory(cat)}
                  className={`${optionClass(on)} p-5 flex flex-col gap-3 min-h-[132px] ${open ? '' : 'opacity-55 cursor-not-allowed hover:border-slate-200'}`}
                >
                  <span className="flex items-start justify-between gap-3 w-full">
                    <span className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-base font-bold text-[#0a2540] leading-snug">{tr(cat.titleKm, cat.titleEn)}</span>
                      <span className="text-[13px] text-slate-500">{tr(cat.levelKm, cat.levelEn)}</span>
                    </span>
                    {radio(on)}
                  </span>
                  <span
                    className={`self-start px-3 py-1 rounded-full text-xs font-bold ${
                      cat.selectionMode === 'none' ? 'bg-slate-100 text-slate-600' : 'bg-[#eef4fb] text-[#0a3263]'
                    }`}
                  >
                    {tr(cat.ruleKm, cat.ruleEn)}
                  </span>
                  <span className={`text-xs ${open ? 'text-slate-500' : 'font-semibold text-amber-700'}`}>
                    {!tracks
                      ? tr('កំពុងរាប់ខ្លឹមសារ…', 'Counting content…')
                      : !track
                        ? ''
                        : open
                          ? `${countsText(track.content)}${track.content.practice ? tr(` · អនុវត្ត ${num(track.content.practice)}`, ` · ${num(track.content.practice)} practice`) : ''}`
                          : tr('មិនទាន់មានសំណួរសម្រាប់ក្របខណ្ឌនេះទេ', 'No questions for this track yet')}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 1.5 — subjects */}
        {step === 'subject' && (
          <div className="flex flex-col gap-3">
            {optionsLoading && (
              <p className="flex items-center gap-2 text-sm text-slate-500" aria-live="polite">
                <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />
                {tr('កំពុងទាញយកមុខវិជ្ជា…', 'Loading subjects…')}
              </p>
            )}

            {optionsError && (
              <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold text-red-700">{optionsError}</span>
                <button
                  type="button"
                  onClick={() => category && loadOptions(category)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-xs font-bold transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {tr('ព្យាយាមម្តងទៀត', 'Try again')}
                </button>
              </div>
            )}

            {options?.selectionMode === 'single' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5" role="radiogroup" aria-label={tr('មុខវិជ្ជាឯកទេស', 'Major subject')}>
                {options.subjects.map((subject) => {
                  const on = picked.length === 1 && picked[0] === subject.key;
                  const open = hasAnyContent(subject.content);
                  return (
                    <button
                      key={subject.key}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      aria-disabled={!open}
                      onClick={() => open && setPicked([subject.key])}
                      className={`${optionClass(on)} px-4 py-3 min-h-[64px] flex items-center justify-between gap-2.5 ${open ? '' : 'opacity-55 cursor-not-allowed hover:border-slate-200'}`}
                    >
                      <span className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-[#0a2540]">{subjectName(subject)}</span>
                        <span className={`text-xs ${noQuestions(subject) ? 'text-amber-700' : 'text-slate-500'}`}>
                          {subject.content ? countsText(subject.content) : lang === 'km' ? subject.en : subject.km}
                        </span>
                      </span>
                      {radio(on)}
                    </button>
                  );
                })}
              </div>
            )}

            {options?.selectionMode === 'pair' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup" aria-label={tr('គូមុខវិជ្ជា', 'Subject pairing')}>
                {options.pairs.map((pair) => {
                  const on = pairMatchesKeys(pair, picked);
                  const open = pair.subjects.some((s) => hasAnyContent(s.content));
                  return (
                    <button
                      key={pair.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      aria-disabled={!open}
                      onClick={() => open && setPicked(pair.subjects.map((s) => s.key))}
                      className={`${optionClass(on)} px-4 py-3 min-h-[64px] flex items-center justify-between gap-2.5 ${open ? '' : 'opacity-55 cursor-not-allowed hover:border-slate-200'}`}
                    >
                      <span className="flex flex-col gap-1 min-w-0">
                        <span className="flex flex-wrap items-center gap-1.5">
                          {pair.subjects.map((s, i) => (
                            <React.Fragment key={s.key}>
                              {i > 0 && <span className="text-sm font-bold text-slate-500">+</span>}
                              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-[13px] font-semibold text-[#0a2540]">
                                {lang === 'km' ? s.km : s.en}
                              </span>
                            </React.Fragment>
                          ))}
                        </span>
                        <span className="flex flex-col text-xs">
                          {pair.subjects.map((s) => (
                            <span key={s.key} className={noQuestions(s) ? 'text-amber-700' : 'text-slate-500'}>
                              {s.content ? `${subjectName(s)}: ${countsText(s.content)}` : lang === 'km' ? s.en : s.km}
                            </span>
                          ))}
                        </span>
                      </span>
                      {radio(on)}
                    </button>
                  );
                })}
              </div>
            )}

            {options && (
              <p className={`text-[13px] font-semibold ${subjectValid ? 'text-emerald-700' : 'text-slate-500'}`} aria-live="polite">
                {subjectValid
                  ? `${tr('បានជ្រើសរើស៖', 'Selected:')} ${subjectsText}`
                  : mode === 'pair'
                    ? tr('មិនទាន់ជ្រើសរើសគូ', 'No pairing selected yet')
                    : tr('មិនទាន់ជ្រើសរើសមុខវិជ្ជា', 'No subject selected yet')}
              </p>
            )}

            {thinSubjects.length > 0 && (
              <p className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900 leading-relaxed">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                {tr(
                  `${thinSubjects.map(subjectName).join(' និង ')} មិនទាន់មានសំណួរ ឬកម្រងសំណួរទេ។ តេស្តវាស់កម្រិត និងផែនការនឹងប្រើមុខវិជ្ជាផ្សេងទៀតនៃក្របខណ្ឌនេះជំនួស រហូតដល់មានខ្លឹមសារ។`,
                  `${thinSubjects.map(subjectName).join(' and ')} has no questions or quizzes yet. The placement test and plan use this track's other subjects until content is added.`
                )}
              </p>
            )}
          </div>
        )}

        {/* Review */}
        {step === 'review' && category && (
          <div className="flex flex-col gap-3">
            <dl className="rounded-2xl border border-slate-200 bg-white px-5">
              <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-100">
                <dt className="text-[13px] text-slate-500">{tr('ក្របខណ្ឌប្រឡង', 'Exam track')}</dt>
                <dd className="flex flex-col items-end">
                  <span className="text-[15px] font-bold text-[#0a2540]">{tr(category.titleKm, category.titleEn)}</span>
                  <span className="text-xs text-slate-500">{tr(category.levelKm, category.levelEn)}</span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-[13px] text-slate-500">{tr('មុខវិជ្ជា', 'Subjects')}</dt>
                <dd className="text-[15px] font-bold text-[#0a2540] text-right">{subjectsText}</dd>
              </div>
            </dl>

            {skipped && (
              <p className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-600 leading-relaxed">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />
                {tr(
                  'ក្របខណ្ឌនេះបង្រៀនគ្រប់មុខវិជ្ជា ដូច្នេះជំហានជ្រើសរើសមុខវិជ្ជាត្រូវបានរំលង។',
                  'This track teaches every subject, so the subject step was skipped.'
                )}
              </p>
            )}

            <p className="flex items-start gap-2.5 rounded-xl border border-[#c9d8ea] bg-[#f4f8fd] px-4 py-3 text-[13px] text-[#0a2540] leading-relaxed">
              <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-[#486581]" />
              {tr(
                'បន្ទាប់ពីរក្សាទុក អ្នកនឹងធ្វើតេស្តវាស់កម្រិត ២០ សំណួរ ហើយ AI នឹងវិភាគចម្លើយដើម្បីបង្កើតផែនការមួយខែ។',
                "After saving you'll take a 20-question placement test, and the AI analyses your answers to build a one-month plan."
              )}
            </p>

            {saveError && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
                {saveError}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div>
            {step !== 'track' && (
              <button
                type="button"
                onClick={back}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-300 text-sm font-bold transition cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                {tr('ថយក្រោយ', 'Back')}
              </button>
            )}
          </div>
          {step === 'review' ? (
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 min-h-[44px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer disabled:opacity-70"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />}
              {saving ? tr('កំពុងរក្សាទុក…', 'Saving…') : onSaved ? tr('បន្តទៅតេស្ត', 'Continue to the test') : tr('រក្សាទុក', 'Save')}
              {!saving && onSaved && <ArrowRight className="w-4 h-4" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              aria-disabled={!canContinue}
              className={`inline-flex items-center gap-2 px-6 py-2.5 min-h-[44px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer ${
                canContinue ? '' : 'opacity-45 cursor-not-allowed'
              }`}
            >
              {step === 'track' ? tr('បន្ត', 'Continue') : tr('ពិនិត្យជម្រើស', 'Review')}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
