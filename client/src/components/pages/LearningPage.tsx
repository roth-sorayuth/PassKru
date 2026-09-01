import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Search,
  Download,
  FileText,
  BookOpen
} from 'lucide-react';

interface ExamPaperItem {
  id: string;
  title: string;
  fileSize: string;
  downloadUrl: string;
}

export const LearningPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const { lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const pastExamPapers: ExamPaperItem[] = [
    {
      id: 'past-1',
      title: 'វិញ្ញាសាគណិតវិទ្យា ២០២៣.pdf',
      fileSize: '2.4 MB',
      downloadUrl: '#',
    },
    {
      id: 'past-2',
      title: 'វិញ្ញាសារូបវិទ្យា ២០២៣.pdf',
      fileSize: '1.8 MB',
      downloadUrl: '#',
    },
    {
      id: 'past-3',
      title: 'វិញ្ញាសាវប្បធម៌ទូទៅ ២០២៣.pdf',
      fileSize: '3.1 MB',
      downloadUrl: '#',
    },
  ];

  const prepExamBooks: ExamPaperItem[] = [
    {
      id: 'book-1',
      title: 'សៀវភៅត្រៀមប្រឡង គ្រូ.pdf',
      fileSize: '15.5 MB',
      downloadUrl: '#',
    },
    {
      id: 'book-2',
      title: 'គន្លឹះដោះស្រាយ វិញ្ញាសា.pdf',
      fileSize: '5.2 MB',
      downloadUrl: '#',
    },
  ];

  const handleDownload = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    alert(`Downloading ${title}...`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn max-w-[1400px] mx-auto text-slate-800">
      
      {/* Search Header Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'km' ? 'ស្វែងរកគ្រូ ឬមុខវិជ្ជា...' : 'Search subjects or lessons...'}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/90 rounded-xl text-sm focus:outline-none focus:border-[#0a3263] focus:ring-1 focus:ring-[#0a3263] transition shadow-2xs placeholder:text-slate-400"
          />
        </div>
        <button className="bg-[#0a3263] hover:bg-[#082447] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-sm transition cursor-pointer shrink-0">
          {lang === 'km' ? 'ទាំងអស់' : 'All'}
        </button>
      </div>

      {/* 1. SECTION: Past Exam Papers */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-[#0a2540]">
          <FileText className="w-5 h-5 text-[#0a3263]" />
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            {lang === 'km' ? 'វិញ្ញាសាចាស់ៗ (PAST EXAM PAPERS)' : 'Past Exam Papers'}
          </h2>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastExamPapers.map((paper) => (
            <div
              key={paper.id}
              onClick={(e) => handleDownload(e, paper.title)}
              className="bg-[#eef4fc] hover:bg-[#e4effc] p-4 rounded-xl flex items-center justify-between gap-3 border border-[#dbe6f5] transition cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* PDF Icon Card */}
                <div className="w-10 h-10 rounded-lg bg-[#fde8e8] text-[#e03131] flex flex-col items-center justify-center shrink-0 border border-red-200/60 font-bold text-[10px]">
                  <span className="text-xs">📄</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[#0a2540] truncate group-hover:text-[#0a3263] transition">
                    {paper.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {paper.fileSize}
                  </p>
                </div>
              </div>

              {/* Download Icon */}
              <button
                aria-label={`Download ${paper.title}`}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0a3263] group-hover:text-[#082447] group-hover:bg-white/60 transition shrink-0"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SECTION: Preparation Exam Books */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-[#0a2540]">
          <BookOpen className="w-5 h-5 text-[#0a3263]" />
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            {lang === 'km' ? 'វិញ្ញាសាត្រៀមប្រឡង (PREPARATION EXAM BOOK)' : 'Exam Preparation Books'}
          </h2>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prepExamBooks.map((book) => (
            <div
              key={book.id}
              onClick={(e) => handleDownload(e, book.title)}
              className="bg-[#eef4fc] hover:bg-[#e4effc] p-4 rounded-xl flex items-center justify-between gap-3 border border-[#dbe6f5] transition cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* PDF Icon Card */}
                <div className="w-10 h-10 rounded-lg bg-[#fde8e8] text-[#e03131] flex flex-col items-center justify-center shrink-0 border border-red-200/60 font-bold text-[10px]">
                  <span className="text-xs">📄</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[#0a2540] truncate group-hover:text-[#0a3263] transition">
                    {book.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {book.fileSize}
                  </p>
                </div>
              </div>

              {/* Download Icon */}
              <button
                aria-label={`Download ${book.title}`}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0a3263] group-hover:text-[#082447] group-hover:bg-white/60 transition shrink-0"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
