import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Clock, CheckSquare, Edit3 } from 'lucide-react';

interface MockExamCard {
  id: string;
  title: { km: string; en: string };
  duration: { km: string; en: string };
  detail: { km: string; en: string };
}

export const MockExamPage: React.FC = () => {
  const { setCurrentPage, startMockExamById } = useApp();
  const { lang } = useLanguage();

  const qcmExams: MockExamCard[] = [
    {
      id: 'qcm-math',
      title: { km: 'គណិតវិទ្យា', en: 'Mathematics' },
      duration: { km: '60 នាទី', en: '60 minutes' },
      detail: { km: '50 សំណួរ', en: '50 questions' },
    },
    {
      id: 'qcm-physics',
      title: { km: 'រូបវិទ្យា', en: 'Physics' },
      duration: { km: '60 នាទី', en: '60 minutes' },
      detail: { km: '50 សំណួរ', en: '50 questions' },
    },
    {
      id: 'qcm-culture',
      title: { km: 'វប្បធម៌ទូទៅ', en: 'General Culture' },
      duration: { km: '60 នាទី', en: '60 minutes' },
      detail: { km: '50 សំណួរ', en: '50 questions' },
    },
  ];

  const writtenExams: MockExamCard[] = [
    {
      id: 'written-math',
      title: { km: 'គណិតវិទ្យា', en: 'Mathematics' },
      duration: { km: '120 នាទី', en: '120 minutes' },
      detail: { km: 'សរសេរអត្ថបទ & ដោះស្រាយបញ្ហា', en: 'Essay & Problem Solving' },
    },
    {
      id: 'written-physics',
      title: { km: 'រូបវិទ្យា', en: 'Physics' },
      duration: { km: '120 នាទី', en: '120 minutes' },
      detail: { km: 'សរសេរអត្ថបទ & ដោះស្រាយបញ្ហា', en: 'Essay & Problem Solving' },
    },
    {
      id: 'written-culture',
      title: { km: 'វប្បធម៌ទូទៅ', en: 'General Culture' },
      duration: { km: '120 នាទី', en: '120 minutes' },
      detail: { km: 'សរសេរអត្ថបទ & ដោះស្រាយបញ្ហា', en: 'Essay & Problem Solving' },
    },
  ];

  const handleStartExam = (examId: string) => {
    if (startMockExamById) {
      startMockExamById('mock-nie-2026-01');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn max-w-[1400px] mx-auto text-slate-800">
      
      {/* Page Title with Blue Vertical Accent Indicator */}
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-7 bg-[#0a3263] rounded-full"></span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2540] tracking-tight">
          {lang === 'km' ? 'ប្រឡងសាកល្បង' : 'Mock Exam'}
        </h1>
      </div>

      {/* 1. SECTION: Multiple Choice Questions (QCM) */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[#0a2540]">
          {lang === 'km' ? 'វិញ្ញាសាសំណួរចម្លើយ (QCM)' : 'Multiple Choice Questions (QCM)'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {qcmExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#0a2540]">
                  {exam.title[lang]}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exam.duration[lang]}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exam.detail[lang]}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartExam(exam.id)}
                className="w-full bg-[#0a3263] hover:bg-[#082447] text-white py-3 rounded-xl text-sm font-bold shadow-sm transition cursor-pointer"
              >
                {lang === 'km' ? 'ចាប់ផ្តើម' : 'Start'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SECTION: Written Exam */}
      <div className="space-y-4 pt-2">
        <h2 className="text-base sm:text-lg font-bold text-[#0a2540]">
          {lang === 'km' ? 'វិញ្ញាសាសរសេរ' : 'Written Exam'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {writtenExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#0a2540]">
                  {exam.title[lang]}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exam.duration[lang]}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exam.detail[lang]}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartExam(exam.id)}
                className="w-full bg-[#0a3263] hover:bg-[#082447] text-white py-3 rounded-xl text-sm font-bold shadow-sm transition cursor-pointer"
              >
                {lang === 'km' ? 'ចាប់ផ្តើម' : 'Start'}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
