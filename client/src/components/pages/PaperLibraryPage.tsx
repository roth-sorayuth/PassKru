import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FileText,
  Eye,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  School,
  LayoutGrid,
  Library,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  X,
  FolderOpen,
  KeyRound,
  Calendar,
} from 'lucide-react';
import { api } from '../../utils/api';
import { useLanguage } from '../../context/LanguageContext';
import { PdfViewerModal } from '../common/PdfViewerModal';
import { PdfThumbnail } from '../common/PdfThumbnail';

export interface PastPaper {
  paperId: number;
  examId?: number;
  subjectId?: number;
  title: string;
  year: number;
  fileUrl: string;
  fileSize?: string;
  paperType?: string;
  totalQuestions?: number;
  hasAnswerKey?: boolean;
  exam?: {
    examId: number;
    examName: string;
    examType?: string;
  };
  subject?: {
    subjectId?: number;
    subjectName: string;
    exam?: {
      examId?: number;
      examName: string;
      examType?: string;
    };
  };
}

export interface Exam {
  examId: number;
  examName: string;
  examType?: string;
}

export interface Subject {
  subjectId: number;
  subjectName: string;
  exam?: Exam;
}

interface PaperLibraryPageProps {
  mode: 'past-paper' | 'prepare-paper';
  title?: string;
}

const khmerNumerals = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

export const toKhmerNum = (num?: number | string) => {
  if (num === undefined || num === null || num === '') return '';
  return String(num)
    .split('')
    .map((c) => {
      const parsed = parseInt(c, 10);
      return isNaN(parsed) ? c : khmerNumerals[parsed];
    })
    .join('');
};

export const formatExamLevelName = (name?: string) => {
  if (!name) return '';
  if (name.includes('គ្រូបឋម')) return 'កម្រិតបឋម';
  if (name.includes('គ្រូអនុវិទ្យាល័យ')) return 'កម្រិតមូលដ្ឋាន';
  if (name.includes('គ្រូវិទ្យាល័យ')) return 'កម្រិតឧត្តម';
  return name;
};

const DEFAULT_SUBJECT_NAME = 'មុខវិជ្ជាទូទៅ';

/** Icon used for each exam level card so the four choices are told apart at a glance. */
const examLevelIcon = (levelName: string) => {
  if (levelName.includes('ឧត្តម')) return GraduationCap;
  if (levelName.includes('មូលដ្ឋាន')) return School;
  if (levelName.includes('បឋម')) return BookOpen;
  return Library;
};

/**
 * A paper can carry its exam either directly or through its subject, and either
 * as examName or examType. Kept as one helper so the card counts, the filtered
 * list and the subject list all agree on what "belongs to this level" means.
 */
const paperMatchesExam = (p: PastPaper, filterExam: string | null) => {
  if (!filterExam) return true;
  const targetLevel = formatExamLevelName(filterExam);
  return (
    p.exam?.examName === filterExam ||
    formatExamLevelName(p.exam?.examName) === targetLevel ||
    p.exam?.examType === filterExam ||
    formatExamLevelName(p.exam?.examType) === targetLevel ||
    p.subject?.exam?.examName === filterExam ||
    formatExamLevelName(p.subject?.exam?.examName) === targetLevel ||
    p.subject?.exam?.examType === filterExam ||
    formatExamLevelName(p.subject?.exam?.examType) === targetLevel
  );
};

export const PaperLibraryPage: React.FC<PaperLibraryPageProps> = ({
  mode,
  title,
}) => {
  const { lang } = useLanguage();

  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterExam, setFilterExam] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubjectState] = useState<string | null>(null);
  const [subjectQuery, setSubjectQuery] = useState('');
  const [previewPdf, setPreviewPdf] = useState<{ url: string; title: string } | null>(null);

  const isPrepare = mode === 'prepare-paper';

  /** Numbers read as Khmer numerals only while the UI is in Khmer. */
  const num = useCallback(
    (n?: number | string) => (lang === 'km' ? toKhmerNum(n) : String(n ?? '')),
    [lang]
  );

  const setSelectedSubject = (subj: string | null) => {
    setSelectedSubjectState(subj);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [papersRes, examsRes, subjectsRes] = await Promise.allSettled([
        api('/papers'),
        api('/exams'),
        api('/subjects'),
      ]);

      if (papersRes.status === 'fulfilled') {
        setPapers(papersRes.value?.papers || []);
      } else {
        // Papers are the whole point of this page, so a papers failure is a
        // page-level error; exams/subjects failing only degrades the filters.
        setPapers([]);
        throw papersRes.reason;
      }

      setExams(examsRes.status === 'fulfilled' ? examsRes.value?.exams || [] : []);
      setSubjects(subjectsRes.status === 'fulfilled' ? subjectsRes.value?.subjects || [] : []);
    } catch (err: any) {
      console.error('Error fetching papers for library:', err);
      setError(
        err?.message ||
          (lang === 'km' ? 'មិនអាចភ្ជាប់ទៅម៉ាស៊ីនមេបានទេ' : 'Could not reach the server')
      );
    } finally {
      setLoading(false);
    }
    // lang only feeds the fallback error copy; refetching on language switch is
    // unnecessary, so it is intentionally not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Both routes render this same component, so React keeps the instance (and its
  // state) alive when the user switches between them. Reset the drill-down so
  // "past papers" never opens on a subject picked in "prepare papers".
  useEffect(() => {
    setFilterExam(null);
    setSelectedSubjectState(null);
    setSubjectQuery('');
  }, [mode]);

  // Sort and standardize exams: កម្រិតឧត្តម, កម្រិតមូលដ្ឋាន, កម្រិតបឋម
  const orderedExams = useMemo(() => {
    const list = exams.length > 0
      ? exams.slice(0, 3)
      : [
          { examId: 1, examName: 'កម្រិតឧត្តម' },
          { examId: 2, examName: 'កម្រិតមូលដ្ឋាន' },
          { examId: 3, examName: 'កម្រិតបឋម' }
        ];

    const orderPriority: Record<string, number> = {
      'កម្រិតឧត្តម': 1,
      'កម្រិតមូលដ្ឋាន': 2,
      'កម្រិតបឋម': 3,
    };

    return [...list].sort((a, b) => {
      const pA = orderPriority[formatExamLevelName(a.examName)] || 99;
      const pB = orderPriority[formatExamLevelName(b.examName)] || 99;
      return pA - pB;
    });
  }, [exams]);

  // Papers belonging to this route's mode (past paper vs prepared paper)
  const modePapers = useMemo(() => {
    return papers.filter((p) =>
      isPrepare ? p.paperType === 'prepare-paper' : p.paperType !== 'prepare-paper'
    );
  }, [papers, isPrepare]);

  // ...narrowed further by the selected exam category
  const examFilteredPapers = useMemo(
    () => modePapers.filter((p) => paperMatchesExam(p, filterExam)),
    [modePapers, filterExam]
  );

  // Paper count per exam level, shown on the selector cards
  const examCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    orderedExams.forEach((e) => {
      const level = formatExamLevelName(e.examName);
      counts[level] = modePapers.filter((p) => paperMatchesExam(p, level)).length;
    });
    return counts;
  }, [orderedExams, modePapers]);

  // Extract available subjects directly from database + papers for current exam category
  const availableSubjects = useMemo(() => {
    const subjectsMap = new Map<string, number>();
    const targetLevel = filterExam ? formatExamLevelName(filterExam) : null;

    // 1. Add all official subjects registered in the database for this exam
    subjects.forEach((s) => {
      if (
        !targetLevel ||
        s.exam?.examName === filterExam ||
        formatExamLevelName(s.exam?.examName) === targetLevel ||
        s.exam?.examType === filterExam ||
        formatExamLevelName(s.exam?.examType) === targetLevel
      ) {
        subjectsMap.set(s.subjectName, 0);
      }
    });

    // 2. Add and count papers uploaded for each subject
    examFilteredPapers.forEach((p) => {
      const name = p.subject?.subjectName || DEFAULT_SUBJECT_NAME;
      subjectsMap.set(name, (subjectsMap.get(name) || 0) + 1);
    });

    return Array.from(subjectsMap.entries()).map(([name, count]) => ({ name, count }));
  }, [examFilteredPapers, subjects, filterExam]);

  // Display order: subjects that actually have papers first, then alphabetical.
  const visibleSubjects = useMemo(() => {
    const q = subjectQuery.trim().toLowerCase();
    return availableSubjects
      .filter((s) => !q || s.name.toLowerCase().includes(q))
      .sort((a, b) => (b.count - a.count) || a.name.localeCompare(b.name));
  }, [availableSubjects, subjectQuery]);

  // Papers to display for selected subject (sorted by year descending)
  const papersInView = useMemo(() => {
    if (!selectedSubject) return [];
    return examFilteredPapers
      .filter((p) => {
        const name = p.subject?.subjectName || DEFAULT_SUBJECT_NAME;
        return name.toLowerCase() === selectedSubject.toLowerCase();
      })
      .sort((a, b) => (b.year || 0) - (a.year || 0));
  }, [examFilteredPapers, selectedSubject]);

  // Group the selected subject's papers into year sections (newest first)
  const papersByYear = useMemo(() => {
    const groups = new Map<number, PastPaper[]>();
    papersInView.forEach((p) => {
      const y = p.year || 0;
      groups.set(y, [...(groups.get(y) || []), p]);
    });
    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);
  }, [papersInView]);

  const yearRange = useMemo(() => {
    const years = modePapers.map((p) => p.year).filter((y): y is number => !!y);
    if (years.length === 0) return null;
    const min = Math.min(...years);
    const max = Math.max(...years);
    return min === max ? num(min) : `${num(min)} – ${num(max)}`;
  }, [modePapers, num]);

  const displayTitle =
    lang === 'km'
      ? title || (isPrepare ? 'វិញ្ញាសាត្រៀមប្រឡង' : 'វិញ្ញាសាចាស់ៗ')
      : isPrepare
        ? 'Preparation Papers'
        : 'Past Exam Papers';

  const allLevelsLabel = lang === 'km' ? 'គ្រប់កម្រិត' : 'All Levels';
  const activeLevelLabel = filterExam ? formatExamLevelName(filterExam) : allLevelsLabel;

  // Mode accents: same system, instantly distinguishable.
  const ModeIcon = isPrepare ? Sparkles : Library;
  const modePillClass = isPrepare
    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
    : 'bg-[#0a3263]/8 border-[#0a3263]/20 text-[#0a3263]';
  const thumbGradient = isPrepare
    ? 'from-indigo-500 to-violet-800'
    : 'from-[#0a3263] to-[#082447]';
  const subjectTileClass = isPrepare
    ? 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-100'
    : 'bg-[#0a3263]/8 text-[#0a3263] border-[#0a3263]/15 group-hover:bg-[#0a3263]/15';

  const resetToAllLevels = () => {
    setFilterExam(null);
    setSelectedSubject(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* ================= PAGE HEADER ================= */}
      <div className="space-y-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${modePillClass}`}>
          <ModeIcon className="w-4 h-4" />
          <span>
            {isPrepare
              ? lang === 'km' ? 'វិញ្ញាសាត្រៀមប្រឡង (ចងក្រងដោយ PassKru)' : 'Preparation Papers — built by PassKru'
              : lang === 'km' ? 'វិញ្ញាសាប្រឡងជាក់ស្តែងឆ្នាំមុនៗ' : 'Real papers from previous examinations'}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {displayTitle}
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              {isPrepare
                ? lang === 'km'
                  ? 'ជ្រើសរើសកម្រិតប្រឡង រួចជ្រើសមុខវិជ្ជា ដើម្បីមើលវិញ្ញាសាត្រៀមដែលចងក្រងតាមទម្រង់ប្រឡងពិត។'
                  : 'Pick your exam level, then a subject, to open practice papers modelled on the real examination format.'
                : lang === 'km'
                  ? 'ជ្រើសរើសកម្រិតប្រឡង រួចជ្រើសមុខវិជ្ជា ដើម្បីមើលវិញ្ញាសាចាស់ៗតាមឆ្នាំនីមួយៗ។'
                  : 'Pick your exam level, then a subject, to browse the original examination papers year by year.'}
            </p>
          </div>

          {/* Library at a glance */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700">
              {num(modePapers.length)} {lang === 'km' ? 'វិញ្ញាសា' : 'papers'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700">
              {num(availableSubjects.length)} {lang === 'km' ? 'មុខវិជ្ជា' : 'subjects'}
            </span>
            {yearRange && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {yearRange}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ================= 1. EXAM CATEGORY SELECTOR ================= */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {lang === 'km' ? 'ជំហានទី ១ · ជ្រើសរើសកម្រិតប្រឡង' : 'Step 1 · Choose your exam level'}
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* All levels */}
          <button
            onClick={resetToAllLevels}
            aria-pressed={!filterExam}
            className={`group relative text-left p-4 rounded-2xl border transition cursor-pointer ${
              !filterExam
                ? 'bg-[#0a3263] border-[#0a3263] text-white shadow-md ring-2 ring-[#0a3263]/20'
                : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                  !filterExam ? 'bg-white/15 border-white/20 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <LayoutGrid className="w-4.5 h-4.5" />
              </div>
              {!filterExam && <CheckCircle2 className="w-4 h-4 text-white/90 shrink-0" />}
            </div>
            <p className={`mt-3 text-sm font-bold truncate ${!filterExam ? 'text-white' : 'text-slate-900'}`}>
              {allLevelsLabel}
            </p>
            <p className={`text-[11px] font-medium mt-0.5 ${!filterExam ? 'text-white/70' : 'text-slate-500'}`}>
              {num(modePapers.length)} {lang === 'km' ? 'វិញ្ញាសា' : 'papers'}
            </p>
          </button>

          {orderedExams.map((e) => {
            const displayName = formatExamLevelName(e.examName);
            const active = !!filterExam && formatExamLevelName(filterExam) === displayName;
            const LevelIcon = examLevelIcon(displayName);
            const count = examCounts[displayName] ?? 0;

            return (
              <button
                key={e.examId}
                onClick={() => {
                  setFilterExam(active ? null : displayName);
                  setSelectedSubject(null);
                }}
                aria-pressed={active}
                title={displayName}
                className={`group relative text-left p-4 rounded-2xl border transition cursor-pointer ${
                  active
                    ? 'bg-[#0a3263] border-[#0a3263] text-white shadow-md ring-2 ring-[#0a3263]/20'
                    : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                      active ? 'bg-white/15 border-white/20 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <LevelIcon className="w-4.5 h-4.5" />
                  </div>
                  {active && <CheckCircle2 className="w-4 h-4 text-white/90 shrink-0" />}
                </div>
                <p className={`mt-3 text-sm font-bold truncate ${active ? 'text-white' : 'text-slate-900'}`}>
                  {displayName}
                </p>
                <p className={`text-[11px] font-medium mt-0.5 ${active ? 'text-white/70' : 'text-slate-500'}`}>
                  {num(count)} {lang === 'km' ? 'វិញ្ញាសា' : 'papers'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= BREADCRUMB ================= */}
      <nav
        aria-label="breadcrumb"
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 flex-wrap"
      >
        <button
          onClick={resetToAllLevels}
          className="inline-flex items-center gap-1.5 hover:text-[#0a3263] transition cursor-pointer"
        >
          <ModeIcon className="w-3.5 h-3.5" />
          <span className="truncate max-w-[140px] sm:max-w-none">{displayTitle}</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

        {selectedSubject ? (
          <button
            onClick={() => setSelectedSubject(null)}
            className="hover:text-[#0a3263] transition cursor-pointer truncate max-w-[120px] sm:max-w-none"
          >
            {activeLevelLabel}
          </button>
        ) : (
          <span className="text-slate-900 font-bold truncate max-w-[140px] sm:max-w-none">{activeLevelLabel}</span>
        )}

        {selectedSubject && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-slate-900 font-bold truncate max-w-[160px] sm:max-w-xs">{selectedSubject}</span>
          </>
        )}
      </nav>

      {/* ================= ERROR STATE ================= */}
      {!loading && error && (
        <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-200 space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="text-sm font-bold text-red-800">
            {lang === 'km' ? 'មិនអាចទាញយកបញ្ជីវិញ្ញាសាបានទេ' : 'Failed to load the paper library'}
          </h3>
          <p className="text-xs text-red-600">{error}</p>
          <button
            onClick={() => fetchData()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {lang === 'km' ? 'ព្យាយាមម្តងទៀត' : 'Try Again'}
          </button>
        </div>
      )}

      {/* ================= 2. STEP 1 — SUBJECT PICKER ================= */}
      {!error && selectedSubject === null && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="space-y-1 min-w-0">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  {lang === 'km' ? 'ជំហានទី ២ · ជ្រើសរើសមុខវិជ្ជា' : 'Step 2 · Choose a subject'}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'km'
                  ? `កំពុងបង្ហាញមុខវិជ្ជាសម្រាប់ ${activeLevelLabel}`
                  : `Showing subjects for ${activeLevelLabel}`}
              </p>
            </div>

            {availableSubjects.length > 5 && (
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={subjectQuery}
                  onChange={(e) => setSubjectQuery(e.target.value)}
                  placeholder={lang === 'km' ? 'ស្វែងរកមុខវិជ្ជា...' : 'Search subjects...'}
                  className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0a3263]/15 focus:border-[#0a3263] transition"
                />
                {subjectQuery && (
                  <button
                    onClick={() => setSubjectQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {loading ? (
            /* Subject skeletons mirroring the real card grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 animate-pulse"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : visibleSubjects.length === 0 ? (
            /* Empty: nothing registered for this level, or search found nothing */
            <div className="p-10 sm:p-12 text-center space-y-4">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {subjectQuery
                  ? lang === 'km' ? 'រកមិនឃើញមុខវិជ្ជាទេ' : 'No matching subjects'
                  : lang === 'km' ? 'មិនទាន់មានមុខវិជ្ជាសម្រាប់កម្រិតនេះទេ' : 'No subjects for this level yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {subjectQuery
                  ? lang === 'km'
                    ? 'សូមសាកល្បងពាក្យគន្លឹះខ្លីជាងនេះ ឬសម្អាតការស្វែងរក។'
                    : 'Try a shorter keyword, or clear the search.'
                  : lang === 'km'
                    ? 'សាកល្បងប្តូរទៅកម្រិតប្រឡងផ្សេង ឬមើលគ្រប់កម្រិតទាំងអស់។'
                    : 'Try a different exam level, or browse all levels at once.'}
              </p>
              {subjectQuery ? (
                <button
                  onClick={() => setSubjectQuery('')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a3263] hover:bg-[#082447] text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  {lang === 'km' ? 'សម្អាតការស្វែងរក' : 'Clear search'}
                </button>
              ) : filterExam ? (
                <button
                  onClick={resetToAllLevels}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a3263] hover:bg-[#082447] text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  {lang === 'km' ? 'មើលគ្រប់កម្រិត' : 'Browse all levels'}
                </button>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {visibleSubjects.map((subj) => (
                <button
                  key={subj.name}
                  onClick={() => setSelectedSubject(subj.name)}
                  className="group flex items-center gap-3 p-4 text-left bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-md transition cursor-pointer"
                >
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition ${subjectTileClass}`}
                  >
                    <FileText className="w-4.5 h-4.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">{subj.name}</p>
                    {subj.count > 0 ? (
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                        {num(subj.count)} {lang === 'km' ? 'វិញ្ញាសា' : subj.count === 1 ? 'paper' : 'papers'}
                      </p>
                    ) : (
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                        {lang === 'km' ? 'មិនទាន់មានវិញ្ញាសា' : 'No papers yet'}
                      </p>
                    )}
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0a3263] group-hover:translate-x-0.5 transition shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= 3. STEP 2 — PAPERS BY YEAR ================= */}
      {!error && selectedSubject !== null && (
        <div className="space-y-6">
          {/* Active subject bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${subjectTileClass}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900 truncate">{selectedSubject}</h2>
                <p className="text-xs text-slate-500 truncate">
                  {activeLevelLabel} · {num(papersInView.length)} {lang === 'km' ? 'វិញ្ញាសា' : papersInView.length === 1 ? 'paper' : 'papers'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedSubject(null)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a3263] hover:bg-[#082447] text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'ត្រឡប់ទៅមុខវិជ្ជា' : 'Back to subjects'}</span>
            </button>
          </div>

          {loading ? (
            /* Paper skeletons mirroring the thumbnail grid */
            <div className="space-y-3">
              <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[3/4] w-full bg-slate-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-3.5 bg-slate-200 rounded w-5/6" />
                      <div className="h-3.5 bg-slate-200 rounded w-2/3" />
                      <div className="h-3 bg-slate-100 rounded w-1/2 mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : papersInView.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {lang === 'km'
                  ? `មិនទាន់មានវិញ្ញាសាសម្រាប់ ${selectedSubject}`
                  : `No papers for ${selectedSubject} yet`}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {lang === 'km'
                  ? 'មុខវិជ្ជានេះមានក្នុងបញ្ជី ប៉ុន្តែឯកសារមិនទាន់បានបញ្ចូលទេ។ សាកល្បងជ្រើសមុខវិជ្ជាផ្សេង ឬប្តូរកម្រិតប្រឡង។'
                  : 'This subject exists in the catalogue but no files have been uploaded yet. Try another subject, or switch the exam level.'}
              </p>
              <button
                onClick={() => setSelectedSubject(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a3263] hover:bg-[#082447] text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {lang === 'km' ? 'ជ្រើសរើសមុខវិជ្ជាផ្សេង' : 'Pick another subject'}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {papersByYear.map(([year, yearPapers]) => (
                <section key={year} className="space-y-3">
                  {/* Year section heading */}
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-slate-900 shrink-0">
                      {year
                        ? lang === 'km' ? `ឆ្នាំ ${num(year)}` : `Year ${year}`
                        : lang === 'km' ? 'មិនបញ្ជាក់ឆ្នាំ' : 'Undated'}
                    </h3>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-600 shrink-0">
                      {num(yearPapers.length)} {lang === 'km' ? 'វិញ្ញាសា' : yearPapers.length === 1 ? 'paper' : 'papers'}
                    </span>
                    <div className="h-px bg-slate-200 flex-1" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {yearPapers.map((paper) => {
                      const hasFile = !!paper.fileUrl && paper.fileUrl.startsWith('http');
                      const examLabel =
                        formatExamLevelName(paper.subject?.exam?.examName || paper.exam?.examName) ||
                        (lang === 'km' ? 'ក្រសួងអប់រំ' : 'MoEYS');

                      return (
                        <div
                          key={paper.paperId}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            if (hasFile) setPreviewPdf({ url: paper.fileUrl, title: paper.title });
                          }}
                          onKeyDown={(e) => {
                            if (hasFile && (e.key === 'Enter' || e.key === ' ')) {
                              e.preventDefault();
                              setPreviewPdf({ url: paper.fileUrl, title: paper.title });
                            }
                          }}
                          className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-md transition overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0a3263]/25"
                        >
                          {/* Thumbnail */}
                          <div className="relative aspect-[3/4] w-full overflow-hidden border-b border-slate-100">
                            {hasFile ? (
                              <PdfThumbnail
                                url={paper.fileUrl}
                                fallbackTitle={paper.title}
                                className="w-full h-full"
                                /* If the PDF itself fails to render, fall back to the
                                   same gradient the file-less cards use, not a grey box. */
                                fallbackClassName={`bg-gradient-to-br ${thumbGradient}`}
                              />
                            ) : (
                              /* No usable file: mode-tinted gradient placeholder,
                                 same idea as the announcement cards. */
                              <div
                                className={`w-full h-full bg-gradient-to-br ${thumbGradient} flex flex-col items-center justify-center gap-2 p-4 text-center`}
                              >
                                <FileText className="w-10 h-10 text-white/30" />
                                <span className="text-[11px] font-semibold text-white/70 line-clamp-2">
                                  {paper.title}
                                </span>
                              </div>
                            )}

                            {/* Hover overlay */}
                            {hasFile && (
                              <div className="absolute inset-0 z-20 bg-slate-900/70 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold shadow-lg">
                                  <Eye className="w-4 h-4" />
                                  {lang === 'km' ? 'ចុចដើម្បីមើល' : 'Click to preview'}
                                </span>
                                <p className="text-[11px] font-medium text-white/80 line-clamp-2">{paper.title}</p>
                              </div>
                            )}

                            {/* Year badge */}
                            <span className="absolute top-2.5 left-2.5 z-30 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-slate-900 border border-slate-200 shadow-2xs">
                              {paper.year ? num(paper.year) : lang === 'km' ? 'ឆ្នាំ?' : 'n/a'}
                            </span>

                            {/* Status badges */}
                            <div className="absolute top-2.5 right-2.5 z-30 flex flex-col items-end gap-1.5">
                              {isPrepare && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/95 text-white border border-indigo-400/40 shadow-2xs">
                                  {lang === 'km' ? 'ត្រៀម' : 'Prep'}
                                </span>
                              )}
                              {paper.hasAnswerKey && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/95 text-white border border-emerald-400/40 shadow-2xs">
                                  <KeyRound className="w-3 h-3" />
                                  {lang === 'km' ? 'មានចម្លើយ' : 'Answers'}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Footer info */}
                          <div className="p-4 flex flex-col flex-1 gap-3">
                            <div className="space-y-1 flex-1">
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate">
                                {paper.subject?.subjectName || DEFAULT_SUBJECT_NAME}
                              </p>
                              <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                                {paper.title}
                              </h4>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px] font-medium text-slate-500">
                              <span className="truncate" title={examLabel}>{examLabel}</span>
                              <span className="inline-flex items-center gap-1 text-slate-400 shrink-0">
                                <FileText className="w-3 h-3" />
                                {paper.fileSize || 'PDF'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PDF Viewer Preview Modal */}
      {previewPdf && (
        <PdfViewerModal
          url={previewPdf.url}
          title={previewPdf.title}
          onClose={() => setPreviewPdf(null)}
        />
      )}
    </div>
  );
};
