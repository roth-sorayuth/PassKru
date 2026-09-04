import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ExamReadinessCardProps {
  score: number;
  maxScore: number;
  statusLabel: string;
  /** Average recent-attempt accuracy — the 70% half of the readiness blend. */
  accuracy?: number;
  /** Course progress — the 30% half of the readiness blend. */
  courseProgress?: number;
}

export const ExamReadinessCard: React.FC<ExamReadinessCardProps> = ({
  score,
  maxScore,
  statusLabel,
  accuracy,
  courseProgress,
}) => {
  const { lang } = useLanguage();
  // Only explain the blend when we actually have both halves to name; a
  // half-stated formula is more confusing than the bare number.
  const showBreakdown = accuracy !== undefined && courseProgress !== undefined;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-slate-500 font-medium">
            {lang === 'km' ? 'ពិន្ទុត្រៀមប្រឡង' : 'Exam readiness'}
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#0a2540]">{score}</span>
            <span className="text-xs text-slate-400 font-bold">/{maxScore}</span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <Award className="w-5 h-5" />
        </div>
      </div>

      {showBreakdown && (
        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
          {lang === 'km'
            ? `៧០% ពិន្ទុថ្មីៗ (${accuracy}%) · ៣០% វឌ្ឍនភាពវគ្គសិក្សា (${courseProgress}%)`
            : `70% recent scores (${accuracy}%) · 30% course progress (${courseProgress}%)`}
        </p>
      )}

      <div className="pt-5 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span className="truncate">{statusLabel}</span>
      </div>
    </div>
  );
};
