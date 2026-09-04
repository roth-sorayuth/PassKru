import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

// Circumference for r=40: 2 * PI * 40 ≈ 251.2
const CIRCUMFERENCE = 251.2;

interface SubjectDonutChartProps {
  percent: number;    // 0–100
  label: string;      // e.g. "គណិតវិទ្យា"
  completed: number;  // lessons completed
  total: number;      // total lessons
  color: string;      // stroke color hex
}

export const SubjectDonutChart: React.FC<SubjectDonutChartProps> = ({
  percent,
  label,
  completed,
  total,
  color,
}) => {
  const { lang } = useLanguage();
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <span className="absolute text-lg font-bold text-[#0a2540]">{percent}%</span>
      </div>
      <div className="min-w-0 w-full">
        <p className="font-bold text-sm text-[#0a2540] text-center truncate" title={label}>
          {label}
        </p>
        <p className="text-xs text-slate-400 text-center">
          {completed}/{total} {lang === 'km' ? 'មេរៀន' : 'topics'}
        </p>
      </div>
    </div>
  );
};
