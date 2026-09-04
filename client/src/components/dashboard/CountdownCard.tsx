import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface CountdownCardProps {
  days: number;
  hours: number;
  minutes: number;
  targetExamName?: string;
}

export const CountdownCard: React.FC<CountdownCardProps> = ({
  days,
  hours,
  minutes,
  targetExamName,
}) => {
  const { lang } = useLanguage();

  const units = [
    { value: days, label: lang === 'km' ? 'ថ្ងៃ' : 'days' },
    { value: hours, label: lang === 'km' ? 'ម៉ោង' : 'hours' },
    { value: minutes, label: lang === 'km' ? 'នាទី' : 'min' },
  ];

  return (
    <div className="bg-[#0a3263] rounded-2xl p-6 text-white flex flex-col justify-between shadow-2xs relative overflow-hidden">
      {/* Subtle background glow decorative circle */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3 z-10">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-300 shrink-0" />
            <h3 className="text-base font-bold tracking-tight">
              {lang === 'km' ? 'រាប់ថយក្រោយ' : 'Exam countdown'}
            </h3>
          </div>
          <p className="text-xs text-blue-200/80 mt-0.5 truncate">
            {targetExamName
              ? `${lang === 'km' ? 'ការប្រឡង' : 'Exam'}: ${targetExamName}`
              : lang === 'km'
                ? 'ពេលវេលានៅសល់សម្រាប់ការប្រឡង'
                : 'Time left until your exam'}
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-[#184883] flex items-center justify-center text-blue-200 shrink-0">
          <Calendar className="w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-6 text-center z-10">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="bg-[#12427d]/90 backdrop-blur-xs rounded-xl py-3 px-2 border border-blue-400/20 shadow-xs"
          >
            <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {unit.value}
            </span>
            <span className="text-[11px] font-medium text-blue-200">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
