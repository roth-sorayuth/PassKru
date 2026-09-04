import React from 'react';
import { Flame } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const DAYS_KM = ['ច', 'អ', 'ព', 'ព្រ', 'សុ', 'ស', 'អា'];
const DAYS_EN = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface StreakCardProps {
  streakDays: number;
  activeDayIndices: number[]; // 0=Mon … 6=Sun
}

export const StreakCard: React.FC<StreakCardProps> = ({ streakDays, activeDayIndices }) => {
  const { lang } = useLanguage();
  const days = lang === 'km' ? DAYS_KM : DAYS_EN;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-6">
      <h3 className="text-base font-bold text-[#0a2540]">
        {lang === 'km' ? 'ការសិក្សាជាប់ៗគ្នា' : 'Study streak'}
      </h3>

      <div className="flex items-center justify-center gap-2 text-[#0a2540] py-2">
        <Flame className="w-6 h-6 text-amber-500 fill-amber-500 shrink-0" />
        <span className="text-2xl font-extrabold">
          {lang === 'km' ? `${streakDays} ថ្ងៃ` : `${streakDays} ${streakDays === 1 ? 'day' : 'days'}`}
        </span>
      </div>

      <div className="flex justify-between items-center pt-2">
        {days.map((day, idx) => {
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
