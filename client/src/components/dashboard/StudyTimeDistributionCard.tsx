import React from 'react';

export interface SubjectTime {
  label: string;       // e.g. "គណិតវិទ្យា"
  percent: number;     // e.g. 50
  hours: number;       // e.g. 62
  color: string;       // hex color
  strokeOffset: number; // pre-calculated SVG strokeDashoffset
}

interface StudyTimeDistributionCardProps {
  subjects: SubjectTime[];
}

// Total circumference for r=38: 2 * PI * 38 ≈ 238.76
const CIRC = 238.76;

export const StudyTimeDistributionCard: React.FC<StudyTimeDistributionCardProps> = ({
  subjects,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
      <h3 className="text-base font-bold text-[#0a2540]">ពេលវេលាសិក្សាតាមមុខវិជ្ជា</h3>

      {/* Donut Chart */}
      <div className="flex items-center justify-center py-1">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {subjects.map((s, idx) => (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r="38"
                stroke={s.color}
                strokeWidth="12"
                fill="none"
                strokeDasharray={CIRC}
                strokeDashoffset={s.strokeOffset}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-1.5 text-xs">
        {subjects.map((s, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="font-medium text-slate-700">{s.label}</span>
            </div>
            <span className="font-bold text-[#0a2540]">
              {s.percent}% ({s.hours} ម៉ោង)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
