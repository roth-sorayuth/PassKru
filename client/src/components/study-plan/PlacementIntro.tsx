import React from 'react';
import { AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCategoryConfig, subjectLabel } from '../../data/examSelectionData';
import { PlacementPreview } from '../../types/aiStudyPlan';
import { CARD, useTr } from './shared';

interface Props {
  resuming: boolean;
  starting: boolean;
  /** Question split per subject for a test that hasn't started. */
  preview: PlacementPreview | null;
  onStart: () => void;
  /** Back to the level/subject step. */
  onChangeSelection: () => void;
}

/** After choosing level and subjects: shows what the test covers and starts (or resumes) it. */
export const PlacementIntro: React.FC<Props> = ({ resuming, starting, preview, onStart, onChangeSelection }) => {
  const { tr, lang } = useTr();
  const { userProfile } = useApp();
  const num = (n: number) => n.toLocaleString(lang === 'km' ? 'km-KH' : 'en-US');
  const size = preview?.size ?? 20;
  const empty = (preview?.subjects || []).filter((s) => s.available === 0);
  const roleLabel = (role: string) =>
    role === 'major' ? tr('មុខវិជ្ជាឯកទេស', 'major') : role === 'core' ? tr('មុខវិជ្ជាស្នូល', 'core') : '';
  const track = getCategoryConfig(userProfile.targetExam);
  const subjects = (userProfile.selectedSubjects || []).map((k) => subjectLabel(k, lang)).join(' + ');

  const steps = [
    {
      n: '១',
      title: tr('អ្នកធ្វើតេស្ត', 'You take the test'),
      body: tr(
        `សំណួរ ${num(size)} ពីមុខវិជ្ជាដែលអ្នកបានជ្រើស ដកចេញពីធនាគារសំណួររបស់ PassKru — មិនមែន AI សរសេរថ្មីទេ។`,
        `${size} questions from your chosen subjects, taken from the PassKru question bank — nothing is written by AI.`
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
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-slate-500">{tr('ផែនការសិក្សា', 'Study plan')}</span>
        <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#0a2540] leading-snug text-balance">
          {resuming ? tr('បន្តតេស្តវាស់កម្រិតរបស់អ្នក', 'Continue your placement test') : tr('ចាប់ផ្តើមដោយវាស់កម្រិតរបស់អ្នកសិន', "First, let's find your level")}
        </h1>
      </div>

      <section className={`${CARD} p-6 sm:p-8 flex flex-col gap-6`}>
        <p className="text-[15px] leading-relaxed text-slate-600 max-w-2xl">
          {tr(
            'តេស្តនេះវាស់កម្រិតរបស់អ្នកក្នុងមុខវិជ្ជាដែលបានជ្រើស។ ផែនការមួយខែទាំងមូលនឹងបង្កើតឡើងតាមអ្វីដែលអ្នកឆ្លើយខុស។',
            'This test measures your level in the subjects you chose. Your whole month is then built from what you get wrong.'
          )}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#eef4fb] text-[#0a3263] text-xs font-bold">{tr(`សំណួរ ${num(size)}`, `${size} questions`)}</span>
          <span className="px-3 py-1 rounded-full bg-[#eef4fb] text-[#0a3263] text-xs font-bold">{tr('ប្រហែល ១៥ នាទី', 'About 15 minutes')}</span>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">{tr('ផ្អាក និងបន្តពេលក្រោយបាន', 'Pause and resume anytime')}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-slate-100 py-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-slate-500">{tr('ក្របខណ្ឌប្រឡង', 'Exam track')}</span>
            <span className="text-[15px] font-bold text-[#0a2540]">{track ? tr(track.titleKm, track.titleEn) : '—'}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-slate-500">{tr('មុខវិជ្ជា', 'Subjects')}</span>
            <span className="text-[15px] font-bold text-[#0a2540]">{subjects || '—'}</span>
          </div>
          <button
            type="button"
            onClick={onChangeSelection}
            className="ml-auto text-[13px] font-bold text-[#0a3263] underline underline-offset-4 hover:text-[#12427d] cursor-pointer"
          >
            {tr('ផ្លាស់ប្តូរ', 'Change')}
          </button>
        </div>

        {preview && preview.subjects.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-[#0a2540]">{tr('សំណួរតេស្តតាមមុខវិជ្ជា', 'Test questions by subject')}</h2>
            <ul className="flex flex-col gap-2.5">
              {preview.subjects.map((s) => (
                <li key={s.subjectId} className="flex flex-col gap-1">
                  <span className="flex items-baseline justify-between gap-3 text-[13px]">
                    <span className="min-w-0 truncate">
                      <span className="font-semibold text-slate-700">{s.subjectName}</span>
                      {roleLabel(s.role) && <span className="text-slate-500"> · {roleLabel(s.role)}</span>}
                    </span>
                    <span className={`shrink-0 tabular-nums ${s.available === 0 ? 'text-amber-700' : 'text-slate-500'}`}>
                      {s.available === 0
                        ? tr('មិនទាន់មានសំណួរ', 'no questions yet')
                        : tr(`${num(s.planned)} សំណួរ · មាន ${num(s.available)} ក្នុងធនាគារ`, `${s.planned} questions · ${s.available} in the bank`)}
                    </span>
                  </span>
                  <span className="h-1.5 rounded-full bg-slate-100 overflow-hidden" aria-hidden="true">
                    <span className="block h-full rounded-full bg-[#0a3263]" style={{ width: `${size ? (s.planned / size) * 100 : 0}%` }} />
                  </span>
                </li>
              ))}
            </ul>
            {empty.length > 0 && (
              <p className="text-xs leading-relaxed text-amber-800">
                {tr(
                  `${empty.map((s) => s.subjectName).join(' និង ')} មិនទាន់មានសំណួរក្នុងធនាគារទេ ដូច្នេះតេស្តនេះមិនអាចវាស់មុខវិជ្ជានោះបាន។ វានឹងចូលក្នុងតេស្តដោយស្វ័យប្រវត្តិ ពេលមានសំណួរ។`,
                  `${empty.map((s) => s.subjectName).join(' and ')}: no questions in the bank yet, so this test can't measure it. It joins the test automatically once questions are added.`
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

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onStart}
            disabled={starting}
            className="inline-flex items-center gap-2 px-6 py-3 min-h-[48px] rounded-xl bg-[#0a3263] hover:bg-[#12427d] text-white text-sm font-bold transition cursor-pointer disabled:opacity-70 focus-visible:ring-2 focus-visible:ring-[#0a3263]/40"
          >
            {starting && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />}
            {resuming ? tr('បន្តតេស្ត', 'Resume test') : tr('ចាប់ផ្តើមតេស្តវាស់កម្រិត', 'Start placement test')}
            {!starting && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </section>

      <p className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
        {tr(
          'ផែនការសិក្សាត្រូវការលទ្ធផលតេស្តនេះ ដើម្បីដឹងថាប្រធានបទណាត្រូវផ្តោត។',
          'The study plan needs this result to know which topics to focus on.'
        )}
      </p>
    </div>
  );
};
