import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, CheckSquare, Edit3 } from 'lucide-react';

interface MockExamCard {
  id: string;
  title: string;
  duration: string;
  detail: string;
}

export const MockExamPage: React.FC = () => {
  const { setCurrentPage, startMockExamById } = useApp();

  const qcmExams: MockExamCard[] = [
    {
      id: 'qcm-math',
      title: 'គណិតវិទ្យា',
      duration: '60 នាទី',
      detail: '50 សំណួរ',
    },
    {
      id: 'qcm-physics',
      title: 'រូបវិទ្យា',
      duration: '60 នាទី',
      detail: '50 សំណួរ',
    },
    {
      id: 'qcm-culture',
      title: 'វប្បធម៌ទូទៅ',
      duration: '60 នាទី',
      detail: '50 សំណួរ',
    },
  ];

  const writtenExams: MockExamCard[] = [
    {
      id: 'written-math',
      title: 'គណិតវិទ្យា',
      duration: '120 នាទី',
      detail: 'Essay & Problem Solving',
    },
    {
      id: 'written-physics',
      title: 'រូបវិទ្យា',
      duration: '120 នាទី',
      detail: 'Essay & Problem Solving',
    },
    {
      id: 'written-culture',
      title: 'វប្បធម៌ទូទៅ',
      duration: '120 នាទី',
      detail: 'Essay & Problem Solving',
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
          ប្រឡងសាកល្បង
        </h1>
      </div>

      {/* 1. SECTION: វិញ្ញាសាសំណួរចម្លើយ (QCM) */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[#0a2540]">
          វិញ្ញាសាសំណួរចម្លើយ (QCM)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {qcmExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#0a2540]">
                  {exam.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exam.duration}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exam.detail}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartExam(exam.id)}
                className="w-full bg-[#0a3263] hover:bg-[#082447] text-white py-3 rounded-xl text-sm font-bold shadow-sm transition cursor-pointer"
              >
                ចាប់ផ្តើម
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SECTION: វិញ្ញាសាសរសេរ */}
      <div className="space-y-4 pt-2">
        <h2 className="text-base sm:text-lg font-bold text-[#0a2540]">
          វិញ្ញាសាសរសេរ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {writtenExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#0a2540]">
                  {exam.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exam.duration}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exam.detail}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartExam(exam.id)}
                className="w-full bg-[#0a3263] hover:bg-[#082447] text-white py-3 rounded-xl text-sm font-bold shadow-sm transition cursor-pointer"
              >
                ចាប់ផ្តើម
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
