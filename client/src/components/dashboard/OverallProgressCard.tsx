import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface OverallProgressCardProps {
  percent: number;
  lessonsCompleted: number;
  remaining: number;
  totalLessons?: number;
}

export const OverallProgressCard: React.FC<OverallProgressCardProps> = ({
  percent,
  lessonsCompleted,
  remaining,
  totalLessons,
}) => {
  const { lang } = useLanguage();

  return (
    <div className="bg-[#0a3263] rounded-2xl p-6 text-white flex flex-col justify-between shadow-2xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-blue-200/80">
            {lang === 'km' ? 'ចំណេះដឹងជាមធ្យម' : 'Overall course progress'}
          </p>
          <h3 className="text-3xl sm:text-4xl font-extrabold mt-1">{percent}%</h3>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#184883] flex items-center justify-center text-blue-200 shrink-0">
          <TrendingUp className="w-4 h-4" />
        </div>
      </div>

      <div className="pt-6 space-y-2">
        <div className="w-full bg-[#12427d] rounded-full h-2 overflow-hidden">
          <div className="bg-emerald-400 h-2 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
        <div className="flex justify-between gap-3 text-[11px] text-blue-200">
          <span className="truncate">
            {lang === 'km'
              ? `${lessonsCompleted}${totalLessons !== undefined ? `/${totalLessons}` : ''} ប្រធានបទស្ទាត់ជំនាញ`
              : `${lessonsCompleted}${totalLessons !== undefined ? `/${totalLessons}` : ''} topics mastered`}
          </span>
          <span className="shrink-0">
            {lang === 'km' ? `នៅសល់ ${remaining}%` : `${remaining}% to go`}
          </span>
        </div>
      </div>
    </div>
  );
};
