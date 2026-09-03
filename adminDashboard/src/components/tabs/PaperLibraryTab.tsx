import React, { useState, useMemo, useEffect } from 'react';
import { FileText, Loader2, Eye, Trash2, ChevronRight, ArrowLeft, BookOpen } from 'lucide-react';
import { PastPaper, Exam, Subject } from '../../types';
import { formatBytes } from '../../utils/formatters';
import { examService } from '../../services/examService';
import { PdfThumbnail } from '../common/PdfThumbnail';

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
  onRefreshMetadata?: () => void;
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
  onRefreshMetadata,
}) => {
  const [selectedSubject, setSelectedSubjectState] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('subject') || null;
  });
  const [isDeletingSubject, setIsDeletingSubject] = useState(false);

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
      const name = p.subject?.subjectName;
      if (name) {
        subjectsMap.set(name, (subjectsMap.get(name) || 0) + 1);
      }
    });

    return Array.from(subjectsMap.keys());
  }, [examFilteredPapers, subjects, filterExam]);

  // Papers to display for selected subject (sorted by year descending)
  const papersInView = useMemo(() => {
    if (!selectedSubject) return [];
    return examFilteredPapers
      .filter((p) => {
        const name = p.subject?.subjectName;
        return name && name.toLowerCase() === selectedSubject.toLowerCase();
      })
      .sort((a, b) => (b.year || 0) - (a.year || 0));
  }, [examFilteredPapers, selectedSubject]);

  const currentSubjectObj = useMemo(() => {
    if (!selectedSubject) return null;
    return subjects.find(
      (s) => s.subjectName.toLowerCase() === selectedSubject.toLowerCase()
    );
  }, [subjects, selectedSubject]);

  const handleDeleteSubject = async () => {
    if (!currentSubjectObj) return;
    const confirmMessage = `តើអ្នកប្រាកដជាចង់លុបមុខវិជ្ជា "${selectedSubject}" នេះចេញពីប្រព័ន្ធមែនទេ?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      setIsDeletingSubject(true);
      await examService.deleteSubject(currentSubjectObj.subjectId);
      setSelectedSubject(null);
      if (onRefreshMetadata) {
        onRefreshMetadata();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete subject');
    } finally {
      setIsDeletingSubject(false);
    }
  };

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
          <div className="flex items-center justify-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="font-normal">គ្រប់កម្រិត</span>
          </div>
          <span className="text-[10px] block opacity-70 mt-0.5">
            (ទាំងអស់)
          </span>
        </button>

        {exams.map((exam) => {
          const isSelected = filterExam === exam.examName || filterExam === exam.examType;
          return (
            <button
              key={exam.examId}
              onClick={() => {
                setFilterExam(exam.examName);
                setSelectedSubject(null);
              }}
              className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-normal text-center transition border cursor-pointer ${
                isSelected
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <span className="block font-normal">{exam.examName}</span>
              <span className="text-[10px] block opacity-70 mt-0.5">
                (កម្រិតប្រឡង)
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Main Content Area */}
      {!selectedSubject ? (
        /* ================= STEP 1: SUBJECT LIST VIEW (Image 1) ================= */
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-normal text-black">
                {displayTitle} {filterExam ? `· ${filterExam}` : '· គ្រប់កម្រិត'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                ជ្រើសរើសមុខវិជ្ជាដើម្បីពិនិត្យ និងគ្រប់គ្រងវិញ្ញាសា
              </p>
            </div>
            <button
              onClick={onUploadNew}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal transition cursor-pointer shadow-2xs"
            >
              + បញ្ចូលវិញ្ញាសាថ្មី
            </button>
          </div>

          <div className="space-y-2">
            {availableSubjects.map((subj) => {
              const count = examFilteredPapers.filter((p) => {
                const name = p.subject?.subjectName;
                return name && name.toLowerCase() === subj.toLowerCase();
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
          {/* Active Subject Bar with Delete & Back Buttons */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 sm:p-4 flex items-center justify-between shadow-2xs gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0 truncate">
                <span className="text-sm font-normal text-black truncate">{selectedSubject}</span>
                {filterExam && (
                  <span className="text-[11px] text-slate-500 block font-normal truncate">{filterExam}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {currentSubjectObj && (
                <button
                  onClick={handleDeleteSubject}
                  disabled={isDeletingSubject}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-700 hover:text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal transition cursor-pointer shadow-2xs"
                  title="Delete Subject"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeletingSubject ? 'កំពុងលុប...' : 'លុបមុខវិជ្ជា (Delete)'}</span>
                </button>
              )}
              <button
                onClick={() => setSelectedSubject(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal transition cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ត្រឡប់ក្រោយ (Back)</span>
              </button>
            </div>
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
              <p className="text-xs text-slate-400 mt-1 font-normal">សូមបញ្ចូលវិញ្ញាសាថ្មីសម្រាប់មុខវិជ្ជានេះដើម្បីបង្ហាញក្នុងបណ្ណាល័យ។</p>
              <button
                onClick={onUploadNew}
                className="mt-4 px-4 py-2 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal transition shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                + បញ្ចូលវិញ្ញាសាថ្មី
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {papersInView.map((paper) => (
                <div key={paper.paperId} className="flex flex-col gap-1.5">
                  {/* Exam Year Header above Card */}
                  <div className="text-xs font-normal text-slate-700 px-1 flex items-center justify-between">
                    <span>ឆ្នាំ {paper.year || 'មិនបញ្ជាក់'}</span>
                    {paper.hasAnswerKey && (
                      <span className="text-[10px] text-slate-500 font-normal">មានចម្លើយ</span>
                    )}
                  </div>

                  {/* Card Container */}
                  <div
                    onClick={() => paper.fileUrl && onPreviewPdf(paper.fileUrl)}
                    className="group bg-white border border-slate-200 hover:border-black rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs transition flex flex-col cursor-pointer"
                  >
                    {/* Visual Live PDF Page 1 Preview */}
                    <div className="h-44 bg-slate-100 border-b border-slate-100 relative overflow-hidden group">
                      <PdfThumbnail
                        url={paper.fileUrl}
                        fallbackTitle={paper.title}
                        className="w-full h-full"
                      />

                      {/* Hover Overlay with Eye Icon */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[0.5px]">
                        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-md transform group-hover:scale-105 transition">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Badges Overlay */}
                      <div className="absolute top-3 right-3 flex flex-col items-end gap-1 z-10">
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
                          {paper.subject?.subjectName || 'វិញ្ញាសា'}
                        </p>
                        <h3 className="text-sm font-normal text-black line-clamp-2 mt-0.5 leading-snug group-hover:text-black transition">
                          {paper.title}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-normal">
                        <span className="truncate max-w-[120px]" title={paper.exam?.examName || paper.subject?.exam?.examName}>
                          {paper.exam?.examName || paper.subject?.exam?.examName || 'ផ្លូវការ'}
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
                        <Trash2 className="w-3.5 h-3.5" /> លុបវិញ្ញាសា
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
