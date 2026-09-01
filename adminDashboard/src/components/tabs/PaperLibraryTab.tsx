import React from 'react';
import { Search, Plus, Filter, FileText, Loader2, Eye, Trash2 } from 'lucide-react';
import { PastPaper, Exam } from '../../types';
import { formatBytes } from '../../utils/formatters';

interface PaperLibraryTabProps {
  papers: PastPaper[];
  exams: Exam[];
  filteredPapers: PastPaper[];
  loading: boolean;
  search: string;
  setSearch: (s: string) => void;
  filterExam: string | null;
  setFilterExam: (exam: string | null) => void;
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  onUploadNew: () => void;
  onPreviewPdf: (url: string) => void;
  onDeletePaper: (id: number) => void;
}

export const PaperLibraryTab: React.FC<PaperLibraryTabProps> = ({
  papers,
  exams,
  filteredPapers,
  loading,
  search,
  setSearch,
  filterExam,
  setFilterExam,
  filterType,
  setFilterType,
  onUploadNew,
  onPreviewPdf,
  onDeletePaper,
}) => {
  return (
    <div className="space-y-6">
      {/* Big Exam Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setFilterExam(null)}
          className={`bg-white rounded-2xl p-4 cursor-pointer transition-all border-2 shadow-xs ${
            !filterExam ? 'border-[#0a3263] ring-2 ring-[#0a3263]/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${!filterExam ? 'text-[#0a3263]' : 'text-slate-500'}`}>All Exams</p>
          <p className={`text-2xl sm:text-3xl font-black ${!filterExam ? 'text-[#0f3360]' : 'text-slate-700'}`}>{papers.length}</p>
        </div>
        {exams.slice(0, 3).map((e) => {
          const count = papers.filter(
            (p) => p.subject?.exam?.examName === e.examName || p.subject?.exam?.examType === e.examName
          ).length;
          const active = filterExam === e.examName;
          return (
            <div
              key={e.examId}
              onClick={() => setFilterExam(active ? null : e.examName)}
              className={`bg-white rounded-2xl p-4 cursor-pointer transition-all border-2 shadow-xs ${
                active ? 'border-[#0a3263] ring-2 ring-[#0a3263]/10' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <p className={`text-xs font-bold uppercase tracking-wider mb-1 truncate ${active ? 'text-[#0a3263]' : 'text-slate-500'}`} title={e.examName}>
                {e.examName}
              </p>
              <p className={`text-2xl sm:text-3xl font-black ${active ? 'text-[#0f3360]' : 'text-slate-700'}`}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Top controls: Search & Type Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search papers by title, subject, or year..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a3263]/20 focus:border-[#0a3263]"
            />
          </div>
          <button
            onClick={onUploadNew}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0a3263] hover:bg-[#0f3360] text-white rounded-xl text-sm font-semibold transition shadow-sm shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Upload New
          </button>
        </div>

        {/* Type Filter chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Type:
          </span>
          <button
            onClick={() => setFilterType(null)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              !filterType ? 'bg-[#0a3263] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Types ({papers.length})
          </button>
          <button
            onClick={() => setFilterType(filterType === 'past-paper' ? null : 'past-paper')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterType === 'past-paper' ? 'bg-[#0a3263] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Past Papers
          </button>
          <button
            onClick={() => setFilterType(filterType === 'mock-exam' ? null : 'mock-exam')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterType === 'mock-exam' ? 'bg-[#0a3263] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Mock Exams
          </button>
          <button
            onClick={() => setFilterType(filterType === 'prepare-paper' ? null : 'prepare-paper')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterType === 'prepare-paper' ? 'bg-[#0a3263] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Prepare Papers
          </button>
        </div>
      </div>

      {/* Papers Thumbnail Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#0a3263]" />
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-400 shadow-sm">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#0a3263]" />
          <p className="text-sm font-semibold text-slate-700">No papers found</p>
          <p className="text-xs text-slate-400 mt-1">Upload your first past paper to see it in the library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredPapers.map((paper) => (
            <div
              key={paper.paperId}
              className="group relative flex flex-col bg-white border border-slate-200 hover:border-[#0a3263] rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
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
                  <div className="w-16 h-16 rounded-2xl bg-[#eef4fc] border border-[#dbe6f5] flex items-center justify-center text-[#0a3263]">
                    <FileText className="w-8 h-8" />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#0a3263]/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20 p-4 text-center">
                  <div className="bg-white text-[#0a3263] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 mb-2">
                    <Eye className="w-4 h-4" /> Click to read
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2">{paper.title}</h4>
                </div>

                {/* Top Badges */}
                <div className="absolute top-2 left-2 z-30">
                  <span className="bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200/80 shadow-xs">
                    {paper.year}
                  </span>
                </div>

                <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-30">
                  {paper.paperType === 'prepare-paper' && (
                    <span className="bg-violet-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                      PREPARE
                    </span>
                  )}
                  {paper.hasAnswerKey && (
                    <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                      KEY
                    </span>
                  )}
                </div>
              </div>

              {/* Footer Info */}
              <div className="p-4 flex flex-col flex-1 justify-between bg-white space-y-3">
                <div>
                  <p className="text-[11px] font-bold text-[#0a3263] uppercase tracking-wider truncate">
                    {paper.subject?.subjectName || 'General Subject'}
                  </p>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mt-0.5 leading-snug group-hover:text-[#0a3263] transition">
                    {paper.title}
                  </h3>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
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
                  className="w-full py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Delete Paper"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Paper
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
