import React, { useState, useMemo, useEffect } from 'react';
import { FileText, Loader2, Eye, Trash2, ChevronRight, ArrowLeft, BookOpen } from 'lucide-react';
import { PastPaper, Exam, Subject } from '../../types';
import { formatBytes } from '../../utils/formatters';

interface PaperLibraryTabProps {
  papers: PastPaper[];
  exams: Exam[];
  subjects?: Subject[];
  mode?: 'past-paper' | 'prepare-paper' | 'all';
  title?: string;
  filteredPapers?: PastPaper[];
  loading: boolean;
  search?: string;
  setSearch?: (s: string) => void;
  filterExam: string | null;
  setFilterExam: (exam: string | null) => void;
  filterType?: string | null;
  setFilterType?: (type: string | null) => void;
  onUploadNew: () => void;
  onPreviewPdf: (url: string) => void;
  onDeletePaper: (id: number) => void;
}

export const PaperLibraryTab: React.FC<PaperLibraryTabProps> = ({
  papers,
  exams,
  subjects = [],
  mode = 'past-paper',
  title,
  loading,
  filterExam,
  setFilterExam,
  onUploadNew,
  onPreviewPdf,
  onDeletePaper,
}) => {
  const [selectedSubject, setSelectedSubjectState] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('subject') || null;
  });

  const setSelectedSubject = (subj: string | null) => {
    setSelectedSubjectState(subj);
    const url = new URL(window.location.href);
    if (subj) {
      url.searchParams.set('subject', subj);
    } else {
      url.searchParams.delete('subject');
    }
    window.history.pushState({}, '', url.toString());
  };

  /* Sync with browser back/forward buttons */
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedSubjectState(params.get('subject') || null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
      const name = p.subject?.subjectName || 'General';
      subjectsMap.set(name, (subjectsMap.get(name) || 0) + 1);
    });

    return Array.from(subjectsMap.keys());
  }, [examFilteredPapers, subjects, filterExam]);

  // Papers to display for selected subject (sorted by year descending)
  const papersInView = useMemo(() => {
    if (!selectedSubject) return [];
    return examFilteredPapers
      .filter((p) => {
        const name = p.subject?.subjectName || 'General';
        return name.toLowerCase() === selectedSubject.toLowerCase();
      })
      .sort((a, b) => (b.year || 0) - (a.year || 0));
  }, [examFilteredPapers, selectedSubject]);

  const displayTitle = title || (mode === 'prepare-paper' ? 'វិញ្ញាសាត្រៀម' : 'វិញ្ញាសាចាស់ៗ');

  return (
    <div className="space-y-6">
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
          All Exams
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
        /* ================= STEP 1: ORGANIZED SUBJECT LIST (Image 1) ================= */
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
                <span className="text-slate-400">(Reset)</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            {availableSubjects.map((subj) => {
              const count = examFilteredPapers.filter((p) => {
                const name = p.subject?.subjectName || 'General';
                return name.toLowerCase() === subj.toLowerCase();
              }).length;

              return (
                <div
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className="flex items-center justify-between px-4 py-3 bg-slate-50/60 hover:bg-slate-100/70 border border-slate-200 hover:border-black rounded-xl cursor-pointer transition shadow-2xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center group-hover:border-black group-hover:text-black transition">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-normal text-slate-800">{subj}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-normal">
                    <span>{count} វិញ្ញាសា</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================= STEP 2: ACTIVE SUBJECT HEADER + PAPERS BY YEAR (Image 2) ================= */
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
                  <span className="text-[11px] text-slate-500 block font-normal">{filterExam}</span>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedSubject(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal transition cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ត្រឡប់ក្រោយ (Back)</span>
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
              <p className="text-sm font-normal text-slate-700">No papers found for {selectedSubject}</p>
              <p className="text-xs text-slate-400 mt-1 font-normal">Upload a past paper for this subject to see it in the library.</p>
              <button
                onClick={onUploadNew}
                className="mt-4 px-4 py-2 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal transition shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                Upload Past Paper
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {papersInView.map((paper) => (
                <div key={paper.paperId} className="flex flex-col gap-1.5">
                  {/* Year Heading above thumbnail as shown in Image 2 */}
                  <span className="text-xs font-normal text-slate-600 pl-1">{paper.year}</span>

                  <div
                    className="group relative flex flex-col bg-white border border-slate-200 hover:border-black rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer flex-1"
                    onClick={() => {
                      if (paper.fileUrl && paper.fileUrl.startsWith('http')) {
                        onPreviewPdf(paper.fileUrl);
                      }
                    }}
                  >
                    {/* Thumbnail Area */}
                    <div className="aspect-[3/4] w-full bg-slate-100 relative flex flex-col items-center justify-center border-b border-slate-100 overflow-hidden">
                      {paper.fileUrl && paper.fileUrl.startsWith('http') ? (
                        <div className="absolute top-0 left-0 w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none transition-transform duration-500 group-hover:scale-[0.26]">
                          <iframe
                            src={`${paper.fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                            className="w-full h-full border-none"
                            title={`Thumbnail for ${paper.title}`}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-black">
                          <FileText className="w-8 h-8" />
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20 p-4 text-center">
                        <div className="bg-white text-black text-xs font-normal px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 mb-2">
                          <Eye className="w-4 h-4" /> Click to read
                        </div>
                        <h4 className="text-xs font-normal text-white line-clamp-2">{paper.title}</h4>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 z-30">
                        <span className="bg-white text-slate-800 text-[10px] font-normal px-2 py-0.5 rounded-md border border-slate-200 shadow-xs">
                          {paper.year}
                        </span>
                      </div>

                      <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-30">
                        {paper.paperType === 'prepare-paper' && (
                          <span className="bg-black text-white text-[9px] font-normal px-2 py-0.5 rounded shadow-xs border border-white/20">
                            PREPARE
                          </span>
                        )}
                        {paper.hasAnswerKey && (
                          <span className="bg-black text-white text-[9px] font-normal px-2 py-0.5 rounded shadow-xs border border-white/20">
                            KEY
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="p-4 flex flex-col flex-1 justify-between bg-white space-y-3">
                      <div>
                        <p className="text-[11px] font-normal text-slate-600 uppercase tracking-wider truncate">
                          {paper.subject?.subjectName || 'General Subject'}
                        </p>
                        <h3 className="text-sm font-normal text-black line-clamp-2 mt-0.5 leading-snug group-hover:text-black transition">
                          {paper.title}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-normal">
                        <span className="truncate max-w-[120px]" title={paper.subject?.exam?.examName}>
                          {paper.subject?.exam?.examName || 'Official'}
                        </span>
                        <span>{formatBytes(paper.fileSize)}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePaper(paper.paperId);
                        }}
                        className="w-full py-1.5 rounded-xl text-xs font-normal text-slate-400 hover:text-black hover:bg-slate-100 border border-transparent hover:border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Delete Paper"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Paper
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
