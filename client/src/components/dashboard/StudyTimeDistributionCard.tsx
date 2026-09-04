import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export interface SubjectTime {
  label: string;        // e.g. "គណិតវិទ្យា"
  /** English twin for server-authored labels (e.g. the Mock Exams bucket). */
  labelEn?: string | null;
  percent: number;      // e.g. 50
  hours: number;        // e.g. 6.2
  color: string;        // hex color
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
  const { lang } = useLanguage();
  const labelFor = (s: SubjectTime) => (lang === 'en' && s.labelEn ? s.labelEn : s.label);
  const hasTime = subjects.some((s) => s.hours > 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
      <div>
        <h3 className="text-base font-bold text-[#0a2540]">
          {lang === 'km' ? 'ពេលវេលាសិក្សាតាមមុខវិជ្ជា' : 'Study time by subject'}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {lang === 'km' ? 'ផ្អែកលើការធ្វើតេស្តថ្មីៗរបស់អ្នក' : 'Based on your recent attempts'}
        </p>
      </div>

      {subjects.length === 0 ? (
        <p className="text-xs text-slate-400 py-8 text-center">
          {lang === 'km' ? 'មិនទាន់មានពេលវេលាសិក្សាត្រូវបង្ហាញទេ' : 'No study time recorded yet'}
        </p>
      ) : (
        <>
          {/* Donut Chart */}
          <div className="flex items-center justify-center py-1">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#e2e8f0" strokeWidth="12" fill="none" />
                {hasTime &&
                  subjects.map((s, idx) => {
                    // Each slice is a dash of its own arc length followed by a
                    // gap covering the rest of the ring, rotated to start at
                    // the running offset the server pre-computed. (Using
                    // dasharray={CIRC} as before made every circle paint a
                    // complete ring, so only the last colour was ever visible.)
                    const segment = (Math.max(0, Math.min(100, s.percent)) / 100) * CIRC;
                    return (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r="38"
                        stroke={s.color}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${segment} ${Math.max(0, CIRC - segment)}`}
                        strokeDashoffset={-s.strokeOffset}
                      />
                    );
                  })}
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-xs">
            {subjects.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="font-medium text-slate-700 truncate">{labelFor(s)}</span>
                </div>
                <span className="font-bold text-[#0a2540] shrink-0">
                  {s.percent}% ({s.hours} {lang === 'km' ? 'ម៉ោង' : 'h'})
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
