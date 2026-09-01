import React from 'react';
import { Flame } from 'lucide-react';

const DAYS_KH = ['ច', 'អ', 'ព', 'ព្រ', 'សុ', 'ស', 'អា'];

interface StreakCardProps {
  streakDays: number;
  activeDayIndices: number[]; // 0=Mon … 6=Sun
}

export const StreakCard: React.FC<StreakCardProps> = ({ streakDays, activeDayIndices }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
      <h3 className="text-base font-bold text-[#0a2540]">ការសិក្សាជាប់ៗគ្នា</h3>

      <div className="flex items-center justify-center gap-2 text-[#0a2540] py-2">
        <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
        <span className="text-2xl font-extrabold">{streakDays} ថ្ងៃ</span>
      </div>

      <div className="flex justify-between items-center pt-2">
        {DAYS_KH.map((day, idx) => {
          const isActive = activeDayIndices.includes(idx);
          return (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  isActive ? 'bg-[#0a3263] text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {day}
              </div>
              <span
                className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#0a3263]' : 'bg-transparent'}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
