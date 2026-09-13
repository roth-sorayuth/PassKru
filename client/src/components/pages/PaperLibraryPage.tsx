import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FileText,
  Eye,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  X,
  FolderOpen,
  KeyRound,
} from 'lucide-react';
import { api } from '../../utils/api';
import { useLanguage } from '../../context/LanguageContext';
import { PdfViewerModal } from '../common/PdfViewerModal';
import { PdfThumbnail } from '../common/PdfThumbnail';
import {
  PageShell,
  PageHero,
  PageBody,
  FilterBar,
  SectionHeading,
  EmptyState,
  PRIMARY_BUTTON,
  OUTLINE_BUTTON,
} from '../common/PageLayout';

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
const ALL_LEVELS = 'all';

/**
 * A paper can carry its exam either directly or through its subject, and either
 * as examName or examType. Kept as one helper so the pill counts, the filtered
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

export const PaperLibraryPage: React.FC<PaperLibraryPageProps> = ({ mode, title }) => {
  const { lang } = useLanguage();

  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterExam, setFilterExam] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubjectState] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [previewPdf, setPreviewPdf] = useState<{ url: string; title: string } | null>(null);

  const isPrepare = mode === 'prepare-paper';
  const km = lang === 'km';

  /** Numbers read as Khmer numerals only while the UI is in Khmer. */
  const num = useCallback((n?: number | string) => (km ? toKhmerNum(n) : String(n ?? '')), [km]);

  const setSelectedSubject = (subj: string | null) => {
    setSelectedSubjectState(subj);
    setQuery('');
    document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
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
      setError(err?.message || (km ? 'មិនអាចភ្ជាប់ទៅម៉ាស៊ីនមេបានទេ' : 'Could not reach the server'));
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
    setQuery('');
  }, [mode]);

  // Sort and standardize exams: កម្រិតឧត្តម, កម្រិតមូលដ្ឋាន, កម្រិតបឋម
  const orderedExams = useMemo(() => {
    const list =
      exams.length > 0
        ? exams.slice(0, 3)
        : [
            { examId: 1, examName: 'កម្រិតឧត្តម' },
            { examId: 2, examName: 'កម្រិតមូលដ្ឋាន' },
            { examId: 3, examName: 'កម្រិតបឋម' },
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
  const modePapers = useMemo(
    () => papers.filter((p) => (isPrepare ? p.paperType === 'prepare-paper' : p.paperType !== 'prepare-paper')),
    [papers, isPrepare]
  );

  // ...narrowed further by the selected exam level
  const examFilteredPapers = useMemo(
    () => modePapers.filter((p) => paperMatchesExam(p, filterExam)),
    [modePapers, filterExam]
  );

  // Subjects registered for the level, plus any subject that has papers.
  const availableSubjects = useMemo(() => {
    const subjectsMap = new Map<string, number>();
    const targetLevel = filterExam ? formatExamLevelName(filterExam) : null;

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

    examFilteredPapers.forEach((p) => {
      const name = p.subject?.subjectName || DEFAULT_SUBJECT_NAME;
      subjectsMap.set(name, (subjectsMap.get(name) || 0) + 1);
    });

    return Array.from(subjectsMap.entries()).map(([name, count]) => ({ name, count }));
  }, [examFilteredPapers, subjects, filterExam]);

  const q = query.trim().toLowerCase();

  // A subject matches the search by its own name or by the title of one of its papers.
  const visibleSubjects = useMemo(() => {
    return availableSubjects
      .filter((s) => {
        if (!q) return true;
        if (s.name.toLowerCase().includes(q)) return true;
        return examFilteredPapers.some(
          (p) => (p.subject?.subjectName || DEFAULT_SUBJECT_NAME) === s.name && p.title.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [availableSubjects, examFilteredPapers, q]);

  // The selected subject's papers, narrowed by the search (title or year), newest first.
  const papersInView = useMemo(() => {
    if (!selectedSubject) return [];
    return examFilteredPapers
      .filter((p) => (p.subject?.subjectName || DEFAULT_SUBJECT_NAME).toLowerCase() === selectedSubject.toLowerCase())
      .filter((p) => !q || p.title.toLowerCase().includes(q) || String(p.year).includes(q) || toKhmerNum(p.year).includes(q))
      .sort((a, b) => (b.year || 0) - (a.year || 0));
  }, [examFilteredPapers, selectedSubject, q]);

  const papersByYear = useMemo(() => {
    const groups = new Map<number, PastPaper[]>();
    papersInView.forEach((p) => {
      const y = p.year || 0;
      groups.set(y, [...(groups.get(y) || []), p]);
    });
    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);
  }, [papersInView]);

  const displayTitle = km
    ? title || (isPrepare ? 'វិញ្ញាសាត្រៀមប្រឡង' : 'វិញ្ញាសាចាស់ៗ')
    : isPrepare
      ? 'Preparation Papers'
      : 'Past Exam Papers';

  const activeLevelLabel = filterExam ? formatExamLevelName(filterExam) : km ? 'គ្រប់កម្រិត' : 'All levels';
  const papersWord = (n: number) => (km ? 'វិញ្ញាសា' : n === 1 ? 'paper' : 'papers');

  const levelPills = [
    { id: ALL_LEVELS, label: km ? 'គ្រប់កម្រិត' : 'All levels' },
    ...orderedExams.map((e) => {
      const name = formatExamLevelName(e.examName);
      return { id: name, label: name };
    }),
  ];

  const countValue = selectedSubject ? papersInView.length : examFilteredPapers.length;
  const hasFilters = Boolean(query) || Boolean(filterExam);

  const resetFilters = () => {
    setQuery('');
    setFilterExam(null);
  };

  const thumbGradient = isPrepare ? 'from-[#486581] to-[#0a3263]' : 'from-[#0a3263] to-[#082447]';

  return (
    <PageShell>
      <PageHero
        title={displayTitle}
        description={
          isPrepare
            ? km
              ? 'វិញ្ញាសាត្រៀមដែល PassKru ចងក្រងតាមទម្រង់ប្រឡងពិត។ ជ្រើសរើសកម្រិត រួចជ្រើសមុខវិជ្ជា។'
              : 'Practice papers PassKru built on the real exam format. Pick a level, then a subject.'
            : km
              ? 'វិញ្ញាសាប្រឡងជាក់ស្តែងពីឆ្នាំមុនៗ។ ជ្រើសរើសកម្រិត រួចជ្រើសមុខវិជ្ជា ដើម្បីមើលតាមឆ្នាំ។'
              : 'Real papers from previous exams. Pick a level, then a subject, to browse them by year.'
        }
      />

      <PageBody>
        <FilterBar
          query={query}
          onQueryChange={setQuery}
          placeholder={
            selectedSubject
              ? km
                ? `ស្វែងរកវិញ្ញាសា ${selectedSubject} តាមចំណងជើង ឬឆ្នាំ...`
                : `Search ${selectedSubject} papers by title or year...`
              : km
                ? 'ស្វែងរកមុខវិជ្ជា ឬចំណងជើងវិញ្ញាសា...'
                : 'Search subjects or paper titles...'
          }
          clearSearchLabel={km ? 'សម្អាតការស្វែងរក' : 'Clear search'}
          count={{ icon: FileText, label: `${num(countValue)} ${papersWord(countValue)}` }}
          pills={levelPills}
          activePill={filterExam ? formatExamLevelName(filterExam) : ALL_LEVELS}
          onPillChange={(id) => {
            setFilterExam(id === ALL_LEVELS ? null : id);
            setSelectedSubjectState(null);
          }}
          reset={{ label: km ? 'សម្អាតតម្រង' : 'Reset', onClick: resetFilters, visible: hasFilters }}
        />

        {!loading && error && (
          <EmptyState
            tone="error"
            icon={AlertCircle}
            title={km ? 'មិនអាចទាញយកបញ្ជីវិញ្ញាសាបានទេ' : 'Failed to load the paper library'}
            description={error}
            action={
              <button
                type="button"
                onClick={() => fetchData()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {km ? 'ព្យាយាមម្តងទៀត' : 'Try again'}
              </button>
            }
          />
        )}

        {/* ---------------- Subjects ---------------- */}
        {!error && selectedSubject === null && (
          <section className="space-y-4">
            <SectionHeading
              title={km ? 'ជ្រើសរើសមុខវិជ្ជា' : 'Choose a subject'}
              meta={`${activeLevelLabel} · ${num(visibleSubjects.length)} ${km ? 'មុខវិជ្ជា' : 'subjects'}`}
            />

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-5 bg-white rounded-3xl border border-slate-200 animate-pulse">
                    <div className="w-11 h-11 rounded-2xl bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-slate-200 rounded w-2/3" />
                      <div className="h-3 bg-slate-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : visibleSubjects.length === 0 ? (
              <EmptyState
                icon={FolderOpen}
                title={
                  query
                    ? km ? 'រកមិនឃើញមុខវិជ្ជាទេ' : 'No matching subjects'
                    : km ? 'មិនទាន់មានមុខវិជ្ជាសម្រាប់កម្រិតនេះទេ' : 'No subjects for this level yet'
                }
                description={
                  query
                    ? km ? 'សូមសាកល្បងពាក្យគន្លឹះខ្លីជាងនេះ ឬសម្អាតការស្វែងរក។' : 'Try a shorter keyword, or clear the search.'
                    : km ? 'សាកល្បងប្តូរទៅកម្រិតប្រឡងផ្សេង ឬមើលគ្រប់កម្រិតទាំងអស់។' : 'Try a different exam level, or browse all levels.'
                }
                action={
                  hasFilters ? (
                    <button type="button" onClick={resetFilters} className={`${PRIMARY_BUTTON} px-5 py-2.5`}>
                      <X className="w-3.5 h-3.5" />
                      {km ? 'សម្អាតតម្រង' : 'Clear filters'}
                    </button>
                  ) : null
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleSubjects.map((subj) => (
                  <button
                    type="button"
                    key={subj.name}
                    onClick={() => setSelectedSubject(subj.name)}
                    className="group flex items-center gap-3 p-5 text-left bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:border-[#c9d8ea] hover:shadow-lg transition cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-[#dfeaf8] text-[#0a3263] flex items-center justify-center shrink-0 transition group-hover:bg-[#0a3263] group-hover:text-white">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 truncate">{subj.name}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        {subj.count > 0
                          ? `${num(subj.count)} ${papersWord(subj.count)}`
                          : km ? 'មិនទាន់មានវិញ្ញាសា' : 'No papers yet'}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0a3263] group-hover:translate-x-0.5 transition shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ---------------- Papers of one subject ---------------- */}
        {!error && selectedSubject !== null && (
          <section className="space-y-6">
            <SectionHeading
              title={selectedSubject}
              meta={`${activeLevelLabel} · ${num(papersInView.length)} ${papersWord(papersInView.length)}`}
              action={
                <button type="button" onClick={() => setSelectedSubject(null)} className={`${OUTLINE_BUTTON} px-4 py-2`}>
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{km ? 'ត្រឡប់ទៅមុខវិជ្ជា' : 'Back to subjects'}</span>
                </button>
              }
            />

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden animate-pulse">
                    <div className="aspect-[3/4] w-full bg-slate-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-3.5 bg-slate-200 rounded w-5/6" />
                      <div className="h-3 bg-slate-100 rounded w-1/2 mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : papersInView.length === 0 ? (
              <EmptyState
                icon={FileText}
                title={
                  query
                    ? km ? 'រកមិនឃើញវិញ្ញាសាទេ' : 'No matching papers'
                    : km ? `មិនទាន់មានវិញ្ញាសាសម្រាប់ ${selectedSubject}` : `No papers for ${selectedSubject} yet`
                }
                description={
                  query
                    ? km ? 'សូមសាកល្បងពាក្យគន្លឹះ ឬឆ្នាំផ្សេង។' : 'Try another keyword or year.'
                    : km
                      ? 'មុខវិជ្ជានេះមានក្នុងបញ្ជី ប៉ុន្តែឯកសារមិនទាន់បានបញ្ចូលទេ។'
                      : 'This subject is listed but no files have been uploaded yet.'
                }
                action={
                  <button
                    type="button"
                    onClick={() => (query ? setQuery('') : setSelectedSubject(null))}
                    className={`${PRIMARY_BUTTON} px-5 py-2.5`}
                  >
                    {query ? <X className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                    {query ? (km ? 'សម្អាតការស្វែងរក' : 'Clear search') : km ? 'ជ្រើសរើសមុខវិជ្ជាផ្សេង' : 'Pick another subject'}
                  </button>
                }
              />
            ) : (
              <div className="space-y-8">
                {papersByYear.map(([year, yearPapers]) => (
                  <div key={year} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-bold text-slate-900 shrink-0">
                        {year ? (km ? `ឆ្នាំ ${num(year)}` : `Year ${year}`) : km ? 'មិនបញ្ជាក់ឆ្នាំ' : 'Undated'}
                      </h3>
                      <div className="h-px bg-slate-200 flex-1" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {yearPapers.map((paper) => {
                        const hasFile = !!paper.fileUrl && paper.fileUrl.startsWith('http');
                        const examLabel =
                          formatExamLevelName(paper.subject?.exam?.examName || paper.exam?.examName) ||
                          (km ? 'ក្រសួងអប់រំ' : 'MoEYS');
                        const open = () => hasFile && setPreviewPdf({ url: paper.fileUrl, title: paper.title });

                        return (
                          <div
                            key={paper.paperId}
                            role="button"
                            tabIndex={0}
                            onClick={open}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                open();
                              }
                            }}
                            className="group flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:border-[#c9d8ea] hover:shadow-lg transition overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0a3263]/25"
                          >
                            <div className="relative aspect-[3/4] w-full overflow-hidden border-b border-slate-100">
                              {hasFile ? (
                                <PdfThumbnail
                                  url={paper.fileUrl}
                                  fallbackTitle={paper.title}
                                  className="w-full h-full"
                                  fallbackClassName={`bg-gradient-to-br ${thumbGradient}`}
                                />
                              ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${thumbGradient} flex flex-col items-center justify-center gap-2 p-4 text-center`}>
                                  <FileText className="w-10 h-10 text-white/40" />
                                  <span className="text-xs font-semibold text-white/85 line-clamp-2">{paper.title}</span>
                                </div>
                              )}

                              {hasFile && (
                                <div className="absolute inset-0 z-20 bg-slate-900/70 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold shadow-lg">
                                    <Eye className="w-4 h-4" />
                                    {km ? 'ចុចដើម្បីមើល' : 'Click to preview'}
                                  </span>
                                </div>
                              )}

                              <span className="absolute top-3 left-3 z-30 px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-900 border border-slate-200">
                                {paper.year ? num(paper.year) : km ? 'ឆ្នាំ?' : 'n/a'}
                              </span>

                              {paper.hasAnswerKey && (
                                <span className="absolute top-3 right-3 z-30 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700 text-white">
                                  <KeyRound className="w-3 h-3" />
                                  {km ? 'មានចម្លើយ' : 'Answers'}
                                </span>
                              )}
                            </div>

                            <div className="p-4 flex flex-col flex-1 gap-3">
                              <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 flex-1">{paper.title}</h4>
                              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs font-medium text-slate-500">
                                <span className="truncate" title={examLabel}>{examLabel}</span>
                                <span className="inline-flex items-center gap-1 shrink-0">
                                  <FileText className="w-3 h-3" />
                                  {paper.fileSize || 'PDF'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </PageBody>

      {previewPdf && (
        <PdfViewerModal url={previewPdf.url} title={previewPdf.title} onClose={() => setPreviewPdf(null)} />
      )}
    </PageShell>
  );
};
