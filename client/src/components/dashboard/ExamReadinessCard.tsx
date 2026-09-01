import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

interface ExamReadinessCardProps {
  score: number;
  maxScore: number;
  statusLabel: string;
}

export const ExamReadinessCard: React.FC<ExamReadinessCardProps> = ({
  score,
  maxScore,
  statusLabel,
}) => {
  return (
    <div className="md:col-span-3 bg-white rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium">ពិន្ទុត្រៀមប្រឡង</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0a2540]">{score}</span>
            <span className="text-xs text-slate-400 font-bold">/{maxScore}</span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <Award className="w-5 h-5" />
        </div>
      </div>

      <div className="pt-6 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
        <CheckCircle2 className="w-4 h-4" />
        <span>{statusLabel}</span>
      </div>
    </div>
  );
};
