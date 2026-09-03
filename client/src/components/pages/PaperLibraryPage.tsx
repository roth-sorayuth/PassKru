import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Loader2, Eye, ChevronRight, ArrowLeft, BookOpen } from 'lucide-react';
import { api } from '../../utils/api';
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

export const PaperLibraryPage: React.FC<PaperLibraryPageProps> = ({
  mode,
  title,
}) => {
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterExam, setFilterExam] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubjectState] = useState<string | null>(null);
  const [previewPdf, setPreviewPdf] = useState<{ url: string; title: string } | null>(null);

  const setSelectedSubject = (subj: string | null) => {
    setSelectedSubjectState(subj);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [papersRes, examsRes, subjectsRes] = await Promise.all([
          api('/papers').catch(() => ({ papers: [] })),
          api('/exams').catch(() => ({ exams: [] })),
          api('/subjects').catch(() => ({ subjects: [] })),
        ]);

        if (papersRes?.papers) {
          setPapers(papersRes.papers);
        }
        if (examsRes?.exams) {
          setExams(examsRes.exams);
        }
        if (subjectsRes?.subjects) {
          setSubjects(subjectsRes.subjects);
        }
      } catch (err) {
        console.error('Error fetching papers for library:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter papers by mode (past paper vs prepared paper) and selected exam category
  const examFilteredPapers = useMemo(() => {
    return papers.filter((p) => {
      // 1. Mode check
      if (mode === 'prepare-paper' && p.paperType !== 'prepare-paper') {
        return false;
      }
      if (mode === 'past-paper' && p.paperType === 'prepare-paper') {
        return false;
      }

      // 2. Exam check
      if (!filterExam) return true;
      return (
        p.exam?.examName === filterExam ||
        p.exam?.examType === filterExam ||
        p.subject?.exam?.examName === filterExam ||
        p.subject?.exam?.examType === filterExam
      );
    });
  }, [papers, mode, filterExam]);

  // Extract available subjects directly from database + papers for current exam category
  const availableSubjects = useMemo(() => {
    const subjectsMap = new Map<string, number>();

    // 1. Add all official subjects registered in the database for this exam
    subjects.forEach((s) => {
      if (
        !filterExam ||
        s.exam?.examName === filterExam ||
        s.exam?.examType === filterExam
      ) {
        subjectsMap.set(s.subjectName, 0);
      }
    });

    // 2. Add and count papers uploaded for each subject
    examFilteredPapers.forEach((p) => {
      const name = p.subject?.subjectName || 'មុខវិជ្ជាទូទៅ';
      subjectsMap.set(name, (subjectsMap.get(name) || 0) + 1);
    });

    return Array.from(subjectsMap.entries()).map(([name, count]) => ({ name, count }));
  }, [examFilteredPapers, subjects, filterExam]);

  // Papers to display for selected subject (sorted by year descending)
  const papersInView = useMemo(() => {
    if (!selectedSubject) return [];
    return examFilteredPapers
      .filter((p) => {
        const name = p.subject?.subjectName || 'មុខវិជ្ជាទូទៅ';
        return name.toLowerCase() === selectedSubject.toLowerCase();
      })
      .sort((a, b) => (b.year || 0) - (a.year || 0));
  }, [examFilteredPapers, selectedSubject]);

  const displayTitle = title || (mode === 'prepare-paper' ? 'វិញ្ញាសាត្រៀមប្រឡង' : 'វិញ្ញាសាចាស់ៗ');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto animate-fadeIn">
      {/* 1. Exam Category Selector Cards (Top Header) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <button
          onClick={() => {
            setFilterExam(null);
            setSelectedSubject(null);
          }}
          className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-normal text-center transition border cursor-pointer ${
            !filterExam
              ? 'bg-black text-white border-black shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          គ្រប់កម្រិត
        </button>
        {exams.slice(0, 3).map((e) => {
          const active = filterExam === e.examName;

          return (
            <button
              key={e.examId}
              onClick={() => {
                setFilterExam(active ? null : e.examName);
                setSelectedSubject(null);
              }}
              className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-normal text-center transition border cursor-pointer truncate ${
                active
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title={e.examName}
            >
              {e.examName}
            </button>
          );
        })}
      </div>

      {/* 2. MAIN CONTENT AREA: Step 1 (Subject List) or Step 2 (Selected Subject + Thumbnails by Year) */}
      {selectedSubject === null ? (
        /* ================= STEP 1: ORGANIZED SUBJECT LIST ================= */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-black" />
              <h2 className="text-lg font-normal text-black tracking-tight">{displayTitle}</h2>
            </div>
            {filterExam && (
              <button
                onClick={() => setFilterExam(null)}
                className="text-xs font-normal text-slate-500 hover:text-black flex items-center gap-1 cursor-pointer"
              >
                <span>{filterExam}</span>
                <span className="text-slate-400">(កំណត់ឡើងវិញ)</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            </div>
          ) : availableSubjects.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm font-normal">
              មិនទាន់មានមុខវិជ្ជា ឬវិញ្ញាសានៅឡើយទេ
            </div>
          ) : (
            <div className="space-y-2">
              {availableSubjects.map((subj) => (
                <div
                  key={subj.name}
                  onClick={() => setSelectedSubject(subj.name)}
                  className="flex items-center justify-between px-4 py-3 bg-slate-50/60 hover:bg-slate-100/70 border border-slate-200 hover:border-black rounded-xl cursor-pointer transition shadow-2xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center group-hover:border-black group-hover:text-black transition">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-normal text-slate-800">{subj.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-normal">
                    <span>{toKhmerNum(subj.count)} វិញ្ញាសា</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ================= STEP 2: ACTIVE SUBJECT HEADER + PAPERS BY YEAR ================= */
        <div className="space-y-6 animate-fadeIn">
          {/* Active Subject Bar with Back Button */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 sm:p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-normal text-black">{selectedSubject}</span>
                {filterExam && (
                  <span className="text-[11px] text-slate-500 block font-normal">
                    {filterExam}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedSubject(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal transition cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ត្រឡប់ក្រោយ</span>
            </button>
          </div>

          {/* Papers Thumbnail Grid with Year Heading above each */}
          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl">
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            </div>
          ) : papersInView.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-400 shadow-sm">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30 text-black" />
              <p className="text-sm font-normal text-slate-700">មិនទាន់មានវិញ្ញាសាសម្រាប់មុខវិជ្ជា {selectedSubject} នៅឡើយទេ</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {papersInView.map((paper) => (
                <div key={paper.paperId} className="flex flex-col gap-1.5">
                  {/* Year Heading above thumbnail */}
                  <span className="text-xs font-normal text-slate-600 pl-1">
                    ឆ្នាំ {toKhmerNum(paper.year)}
                  </span>

                  <div
                    className="group relative flex flex-col bg-white border border-slate-200 hover:border-black rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer flex-1"
                    onClick={() => {
                      if (paper.fileUrl && paper.fileUrl.startsWith('http')) {
                        setPreviewPdf({ url: paper.fileUrl, title: paper.title });
                      }
                    }}
                  >
                    {/* Thumbnail Area */}
                    <div className="aspect-[3/4] w-full bg-slate-100 relative flex flex-col items-center justify-center border-b border-slate-100 overflow-hidden">
                      <PdfThumbnail
                        url={paper.fileUrl}
                        fallbackTitle={paper.title}
                        className="w-full h-full"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20 p-4 text-center">
                        <div className="bg-white text-black text-xs font-normal px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 mb-2">
                          <Eye className="w-4 h-4" /> ចុចដើម្បីមើល
                        </div>
                        <h4 className="text-xs font-normal text-white line-clamp-2">{paper.title}</h4>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 z-30">
                        <span className="bg-white text-slate-800 text-[10px] font-normal px-2 py-0.5 rounded-md border border-slate-200 shadow-xs">
                          {toKhmerNum(paper.year)}
                        </span>
                      </div>

                      <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-30">
                        {paper.paperType === 'prepare-paper' && (
                          <span className="bg-black text-white text-[9px] font-normal px-2 py-0.5 rounded shadow-xs border border-white/20">
                            ត្រៀមប្រឡង
                          </span>
                        )}
                        {paper.hasAnswerKey && (
                          <span className="bg-black text-white text-[9px] font-normal px-2 py-0.5 rounded shadow-xs border border-white/20">
                            មានចម្លើយ
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="p-4 flex flex-col flex-1 justify-between bg-white space-y-3">
                      <div>
                        <p className="text-[11px] font-normal text-slate-600 uppercase tracking-wider truncate">
                          {paper.subject?.subjectName || 'មុខវិជ្ជាទូទៅ'}
                        </p>
                        <h3 className="text-sm font-normal text-black line-clamp-2 mt-0.5 leading-snug group-hover:text-black transition">
                          {paper.title}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-normal">
                        <span className="truncate max-w-[140px]" title={paper.subject?.exam?.examName}>
                          {paper.subject?.exam?.examName || 'ក្រសួងអប់រំ'}
                        </span>
                        <span className="text-slate-400">{paper.fileSize || 'ឯកសារ PDF'}</span>
                      </div>
                    </div>
                  </div>
                </div>
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
