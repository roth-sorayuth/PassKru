import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Award,
  Clock,
  AlertTriangle,
  Flame,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn max-w-[1400px] mx-auto text-slate-800">
      
      {/* 1. SECTION: សង្ខេបសកម្មភាព */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#0a3263]" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
            សង្ខេបសកម្មភាព
          </h2>
        </div>

        {/* Top 3 Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 1: រាប់ថយក្រោយ (Countdown) - 6 cols */}
          <div className="md:col-span-6 bg-[#0a3263] rounded-2xl p-6 text-white flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <h3 className="text-base font-bold tracking-tight">រាប់ថយក្រោយ</h3>
              <p className="text-xs text-blue-200/80 mt-0.5">ពេលវេលានៅសល់សម្រាប់ការប្រឡង</p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 text-center">
              <div className="bg-[#12427d] rounded-xl py-3 px-2 border border-blue-400/20">
                <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight">៧៥</span>
                <span className="text-[11px] text-blue-200">ថ្ងៃ</span>
              </div>
              <div className="bg-[#12427d] rounded-xl py-3 px-2 border border-blue-400/20">
                <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight">១៤</span>
                <span className="text-[11px] text-blue-200">ម៉ោង</span>
              </div>
              <div className="bg-[#12427d] rounded-xl py-3 px-2 border border-blue-400/20">
                <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight">៣០</span>
                <span className="text-[11px] text-blue-200">នាទី</span>
              </div>
            </div>
          </div>

          {/* Card 2: វឌ្ឍនភាពសរុប (Progress) - 3 cols */}
          <div className="md:col-span-3 bg-[#0a3263] rounded-2xl p-6 text-white flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-200/80">វឌ្ឍនភាពសរុប</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-1">៦៨%</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#184883] flex items-center justify-center text-blue-200">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="pt-6 space-y-2">
              {/* Progress Bar */}
              <div className="w-full bg-[#12427d] rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <div className="flex justify-between text-[11px] text-blue-200">
                <span>៦៣ មេរៀនបានបញ្ចប់</span>
                <span>នៅសល់ ៣២%</span>
              </div>
            </div>
          </div>

          {/* Card 3: ពិន្ទុត្រៀមប្រឡង (Score) - 3 cols */}
          <div className="md:col-span-3 bg-white rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">ពិន្ទុត្រៀមប្រឡង</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#0a2540]">៧៥</span>
                  <span className="text-xs text-slate-400 font-bold">/១០០</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="pt-6 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>ឱកាសជាប់ប្រឡងខ្ពស់</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION: ទិន្នន័យវាយតម្លៃ និងការអនុវត្ត */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
          ទិន្នន័យវាយតម្លៃ និងការអនុវត្ត
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card: ចំណេះដឹងតាមមុខវិជ្ជា (8 cols) */}
          <div className="md:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#0a2540]">
              ចំណេះដឹងតាមមុខវិជ្ជា
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2 text-center">
              {/* Mathematics Circle 75% */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#0a3263"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - 0.75)}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <span className="absolute text-lg font-bold text-[#0a2540]">៧៥%</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-[#0a2540]">គណិតវិទ្យា</p>
                  <p className="text-xs text-slate-400">១៥/២០ មេរៀន</p>
                </div>
              </div>

              {/* Physics Circle 40% */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#5c3818"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - 0.40)}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <span className="absolute text-lg font-bold text-[#0a2540]">៤០%</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-[#0a2540]">រូបវិទ្យា</p>
                  <p className="text-xs text-slate-400">៨/២០ មេរៀន</p>
                </div>
              </div>

              {/* General Culture Circle 90% */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#0d7652"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - 0.90)}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <span className="absolute text-lg font-bold text-[#0a2540]">៩០%</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-[#0a2540]">វប្បធម៌ទូទៅ</p>
                  <p className="text-xs text-slate-400">១៨/២០ មេរៀន</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card: អត្រាភាពត្រឹមត្រូវ & ចំណុចខ្វះខាត (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#0a2540]">
                អត្រាភាពត្រឹមត្រូវនៃការប្រឡងសាកល្បង
              </h3>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-[#0a2540]">៨២%</span>
                <span className="text-xs text-slate-500 font-medium">មធ្យមភាគសរុប</span>
              </div>
              <span className="inline-block mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
                +៥% ធៀបនឹងសប្តាហ៍មុន
              </span>
            </div>

            {/* ចំណុចខ្វះខាត */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#e03131]">
                <AlertTriangle className="w-4 h-4" />
                <span>ចំណុចខ្វះខាត</span>
              </div>
              <div className="space-y-2">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-[#0a2540] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  <span>គរុកោសល្យ: វិធីសាស្ត្របង្រៀន</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-[#0a2540] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span>
                  <span>ប្រវត្តិវិទ្យា: ប្រវត្តិសាស្ត្រទំនើប</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECTION: សកម្មភាព និងឥរិយាបថនៃការសិក្សា */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540]">
          សកម្មភាព និងឥរិយាបថនៃការសិក្សា
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: ការសិក្សាជាប់ៗគ្នា (Streak) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
            <h3 className="text-base font-bold text-[#0a2540]">
              ការសិក្សាជាប់ៗគ្នា
            </h3>

            <div className="flex items-center justify-center gap-2 text-[#0a2540] py-2">
              <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
              <span className="text-2xl font-extrabold">១២ ថ្ងៃ</span>
            </div>

            {/* Days of week indicators */}
            <div className="flex justify-between items-center pt-2">
              {['ច', 'អ', 'ព', 'ព្រ', 'សុ', 'ស', 'អា'].map((day, idx) => {
                const isActive = idx < 4; // Mon-Thu active
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                        isActive
                          ? 'bg-[#0a3263] text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {day}
                    </div>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#0a3263]' : 'bg-transparent'}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: ការប្រើប្រាស់ធនធានសិក្សា */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5">
            <h3 className="text-base font-bold text-[#0a2540]">
              ការប្រើប្រាស់ធនធានសិក្សា
            </h3>

            <div className="space-y-3.5 py-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">វីដេអូ</span>
                <div className="flex items-center gap-3 w-40">
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#0a3263] h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="font-bold text-[#0a2540] w-8 text-right">៧៥%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">កម្រងសំណួរ</span>
                <div className="flex items-center gap-3 w-40">
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#5c3818] h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <span className="font-bold text-[#0a2540] w-8 text-right">៥០%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">ឯកសារអាន</span>
                <div className="flex items-center gap-3 w-40">
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#0d7652] h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="font-bold text-[#0a2540] w-8 text-right">៤៥%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-2">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#dbe8f8]" /> ធ្លាក់</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-200" /> មធ្យមភាគសិស្សផ្សេង</span>
            </div>
          </div>

          {/* Card 3: ពេលវេលាសិក្សាតាមមុខវិជ្ជា */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <h3 className="text-base font-bold text-[#0a2540]">
              ពេលវេលាសិក្សាតាមមុខវិជ្ជា
            </h3>

            {/* Donut Chart Representation */}
            <div className="flex items-center justify-center py-1">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#0d7652" strokeWidth="12" fill="none" strokeDasharray="238.7" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" stroke="#5c3818" strokeWidth="12" fill="none" strokeDasharray="238.7" strokeDashoffset="119.3" />
                  <circle cx="50" cy="50" r="38" stroke="#0a3263" strokeWidth="12" fill="none" strokeDasharray="238.7" strokeDashoffset="167" />
                </svg>
              </div>
            </div>

            {/* Legend with stats */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0a3263]"></span>
                  <span className="font-medium text-slate-700">គណិតវិទ្យា</span>
                </div>
                <span className="font-bold text-[#0a2540]">៥០% (៦២ ម៉ោង)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5c3818]"></span>
                  <span className="font-medium text-slate-700">រូបវិទ្យា</span>
                </div>
                <span className="font-bold text-[#0a2540]">៣០% (៣៧ ម៉ោង)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0d7652]"></span>
                  <span className="font-medium text-slate-700">វប្បធម៌ទូទៅ</span>
                </div>
                <span className="font-bold text-[#0a2540]">២០% (២៥ ម៉ោង)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
