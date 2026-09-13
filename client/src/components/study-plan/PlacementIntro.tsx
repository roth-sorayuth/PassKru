import React from 'react';
import { ArrowLeft, ArrowRight, Loader2, Pencil } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCategoryConfig, subjectLabel } from '../../data/examSelectionData';
import { PlacementPreview, PlacementProgress } from '../../types/aiStudyPlan';
import { CARD, useTr } from './shared';

interface Props {
  resuming: boolean;
  starting: boolean;
  /** Question split per subject for a test that hasn't started. */
  preview: PlacementPreview | null;
  /** How far an open test is, when resuming. */
  progress?: PlacementProgress | null;
  onStart: () => void;
  /** Back to the level/subject step. */
  onChangeSelection: () => void;
  /** The back button at the top; defaults to the level/subject step. */
  onBack?: () => void;
}

/**
 * Before the placement test. A new test explains what it covers; an open test
 * shows how far it is. Either way the level and subjects (and "Change") sit
 * together at the top, and one button starts or resumes.
 */
export const PlacementIntro: React.FC<Props> = ({ resuming, starting, preview, progress, onStart, onChangeSelection, onBack }) => {
  const { tr, lang } = useTr();
  const { userProfile } = useApp();
  const num = (n: number) => n.toLocaleString(lang === 'km' ? 'km-KH' : 'en-US');
  const track = getCategoryConfig(userProfile.targetExam);
  const subjects = (userProfile.selectedSubjects || []).map((k) => subjectLabel(k, lang)).join(', ');

  const size = preview?.size ?? 0;
  // No question in the bank for any chosen subject: the test can't start.
  const noQuestions = !resuming && preview != null && preview.size === 0;
  const empty = (preview?.subjects || []).filter((s) => s.available === 0);
  const roleLabel = (role: string) =>
    role === 'major' ? tr('មុខវិជ្ជាឯកទេស', 'major') : role === 'core' ? tr('មុខវិជ្ជាស្នូល', 'core') : '';
  const chip = 'px-3 py-1 rounded-full bg-[#eef4fb] text-[#0a3263] text-xs font-bold tabular-nums';
  const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

  const steps = [
    {
      n: '១',
      title: tr('អ្នកធ្វើតេស្ត', 'You take the test'),
      body: tr(
        'សំណួរ ១៥ ក្នុងមុខវិជ្ជានីមួយៗ ដកចេញពីធនាគារសំណួររបស់ PassKru — មិនមែន AI សរសេរថ្មីទេ។',
        '15 questions per subject from the PassKru question bank — nothing is written by AI.'
      ),
      tone: 'bg-[#0a3263]',
    },
    {
      n: '២',
      title: tr('AI វិភាគលទ្ធផល', 'AI analyses the result'),
      body: tr('ដាក់ពិន្ទុតាមប្រធានបទនីមួយៗ ហើយរៀបលំដាប់ចំណុចខ្សោយ។', 'Scores each topic separately and ranks your weak spots.'),
      tone: 'bg-[#486581]',
    },
    {
      n: '៣',
      title: tr('ផែនការមួយខែ', 'A one-month plan'),
      body: tr('កម្រងសំណួរ អនុវត្ត និងវិញ្ញាសា ច័ន្ទ–សុក្រ · ពិនិត្យកំហុសថ្ងៃសៅរ៍។', 'Quizzes, practice and papers Mon–Fri · mistake review on Saturday.'),
      tone: 'bg-emerald-600',
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={onBack || onChangeSelection}
        className="self-start inline-flex items-center gap-1.5 px-3 py-2 -ml-3 min-h-[40px] rounded-xl text-sm font-bold text-[#0a3263] hover:bg-[#eef4fb] transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0a3263]/40"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        {tr('ថយក្រោយ', 'Back')}
      </button>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-slate-500">{tr('តេស្តវាស់កម្រិត', 'Placement test')}</span>
        <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#0a2540] leading-snug text-balance">
          {resuming ? tr('បន្តតេស្តវាស់កម្រិតរបស់អ្នក', 'Continue your placement test') : tr('ចាប់ផ្តើមដោយវាស់កម្រិតរបស់អ្នកសិន', "First, let's find your level")}
        </h1>
      </div>

      <section className={`${CARD} p-6 sm:p-8 flex flex-col gap-6`}>
        {/* What the test is for — level and subjects, changeable right here */}
        <div className="flex flex-wrap items-end gap-x-8 gap-y-3 pb-5 border-b border-slate-100">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-slate-500">{tr('កម្រិត', 'Level')}</span>
            <span className="text-[15px] font-bold text-[#0a2540]">{track ? tr(track.titleKm, track.titleEn) : '—'}</span>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs font-bold text-slate-500">{tr('មុខវិជ្ជា', 'Subjects')}</span>
            <span className="text-[15px] font-bold text-[#0a2540] break-words">{subjects || '—'}</span>
          </div>
          <button
            type="button"
            onClick={onChangeSelection}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-[#0a3263] hover:border-[#0a3263] transition cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0a3263]/40"
          >
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
            {tr('ផ្លាស់ប្តូរ', 'Change')}
          </button>
        </div>

        {resuming ? (
          /* Resume: how far the open test is */
          progress ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-500">{tr('បានឆ្លើយ', 'Answered')}</span>
                  <span className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#0a2540] tabular-nums">{num(progress.answered)}</span>
                    <span className="text-sm font-semibold text-slate-500 tabular-nums">/ {num(progress.total)} {tr('សំណួរ', 'questions')}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={chip}>{tr(`នៅសល់ ${num(progress.total - progress.answered)} សំណួរ`, `${progress.total - progress.answered} left`)}</span>
                  <span className={chip}>{tr(`ប្រហែល ${num(progress.minutes)} នាទី`, `About ${progress.minutes} minutes`)}</span>
                </div>
              </div>
              <span className="h-2 rounded-full bg-[#dfeaf8] overflow-hidden" aria-hidden="true">
                <span className="block h-full rounded-full bg-[#0a3263]" style={{ width: `${pct(progress.answered, progress.total)}%` }} />
              </span>
              {progress.subjects.length > 1 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {progress.subjects.map((s) => (
                    <li key={s.subjectName} className="flex flex-col gap-1">
                      <span className="flex items-baseline justify-between gap-3 text-[13px]">
                        <span className="font-semibold text-slate-700 truncate">{s.subjectName}</span>
                        <span className="text-slate-500 tabular-nums shrink-0">{num(s.answered)}/{num(s.total)}</span>
                      </span>
                      <span className="h-1.5 rounded-full bg-slate-100 overflow-hidden" aria-hidden="true">
                        <span className="block h-full rounded-full bg-[#486581]" style={{ width: `${pct(s.answered, s.total)}%` }} />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-[13px] text-slate-600">
                {tr('ចម្លើយរបស់អ្នករក្សាទុករួចហើយ។ ម៉ោងចាប់ផ្តើមឡើងវិញពេលអ្នកបន្ត។', 'Your answers are saved. The timer restarts when you continue.')}
              </p>
            </div>
          ) : (
            <p className="text-[15px] text-slate-600">{tr('ចម្លើយរបស់អ្នករក្សាទុករួចហើយ។', 'Your answers are saved.')}</p>
          )
        ) : (
          /* New test: what it covers */
          <>
            <div className="flex flex-col gap-3">
              <p className="text-[15px] leading-relaxed text-slate-600 max-w-2xl">
                {tr(
                  'តេស្តនេះវាស់កម្រិតរបស់អ្នកក្នុងមុខវិជ្ជាដែលបានជ្រើស។ ផែនការមួយខែទាំងមូលនឹងបង្កើតឡើងតាមអ្វីដែលអ្នកឆ្លើយខុស។',
                  'This test measures your level in the subjects you chose. Your whole month is then built from what you get wrong.'
                )}
              </p>
              {preview && size > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className={chip}>{tr(`សំណួរ ${num(size)}`, `${size} questions`)}</span>
                  <span className={chip}>{tr(`ប្រហែល ${num(preview.minutes)} នាទី`, `About ${preview.minutes} minutes`)}</span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">{tr('ផ្អាក និងបន្តពេលក្រោយបាន', 'Pause and resume anytime')}</span>
                </div>
              )}
            </div>

            {preview && preview.subjects.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2 className="text-sm font-bold text-[#0a2540]">{tr('សំណួរតេស្តតាមមុខវិជ្ជា', 'Test questions by subject')}</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {preview.subjects.map((s) => (
                    <li key={s.subjectId} className="flex flex-col gap-1">
                      <span className="flex items-baseline justify-between gap-3 text-[13px]">
                        <span className="min-w-0 truncate">
                          <span className="font-semibold text-slate-700">{s.subjectName}</span>
                          {roleLabel(s.role) && <span className="text-slate-500"> · {roleLabel(s.role)}</span>}
                        </span>
                        <span className={`shrink-0 tabular-nums ${s.available === 0 ? 'text-amber-700' : 'text-slate-500'}`}>
                          {s.available === 0 ? tr('មិនទាន់មានសំណួរ', 'no questions yet') : tr(`${num(s.planned)} សំណួរ`, `${s.planned} questions`)}
                        </span>
                      </span>
                      <span className="h-1.5 rounded-full bg-slate-100 overflow-hidden" aria-hidden="true">
                        <span className="block h-full rounded-full bg-[#0a3263]" style={{ width: `${pct(s.planned, size)}%` }} />
                      </span>
                    </li>
                  ))}
                </ul>
                {empty.length > 0 && (
                  <p className="text-xs leading-relaxed text-amber-800">
                    {tr(
                      `${empty.map((s) => s.subjectName).join(', ')} មិនទាន់មានសំណួរក្នុងធនាគារទេ — វានឹងចូលក្នុងតេស្តដោយស្វ័យប្រវត្តិ ពេលមានសំណួរ។`,
                      `${empty.map((s) => s.subjectName).join(', ')}: no questions in the bank yet — added to the test automatically once there are.`
                    )}
                  </p>
                )}
                {preview.usedAllSubjects && (
                  <p className="text-xs leading-relaxed text-amber-800">
                    {tr(
                      'មុខវិជ្ជាដែលអ្នកជ្រើសមិនទាន់មានសំណួរ ដូច្នេះតេស្តប្រើមុខវិជ្ជាទាំងអស់នៃកម្រិតនេះជំនួស។',
                      'Your chosen subject has no questions yet, so the test uses every subject of this level instead.'
                    )}
                  </p>
                )}
              </div>
            )}

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {steps.map((s) => (
                <li key={s.n} className="rounded-2xl border border-slate-200 p-4 flex flex-col gap-2">
                  <span className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-lg ${s.tone} text-white text-xs font-bold flex items-center justify-center`}>{s.n}</span>
                    <span className="text-sm font-bold text-[#0a2540]">{s.title}</span>
                  </span>
                  <span className="text-[13px] leading-relaxed text-slate-500">{s.body}</span>
                </li>
              ))}
            </ol>
          </>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <button
            type="button"
            onClick={onStart}
            disabled={starting || noQuestions}
            className="inline-flex items-center gap-2 px-6 py-3 min-h-[48px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer disabled:opacity-70 focus-visible:ring-2 focus-visible:ring-[#0a3263]/40"
          >
            {starting && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />}
            {resuming ? tr('បន្តតេស្ត', 'Continue test') : tr('ចាប់ផ្តើមតេស្ត', 'Start the test')}
            {!starting && <ArrowRight className="w-4 h-4" />}
          </button>
          {noQuestions && (
            <span className="text-[13px] font-semibold text-amber-800">
              {tr('មុខវិជ្ជាទាំងនេះមិនទាន់មានសំណួរទេ — ចុច «ផ្លាស់ប្តូរ» ដើម្បីជ្រើសរើសមុខវិជ្ជាផ្សេង។', 'These subjects have no questions yet — use “Change” to choose other subjects.')}
            </span>
          )}
        </div>
      </section>
    </div>
  );
};
