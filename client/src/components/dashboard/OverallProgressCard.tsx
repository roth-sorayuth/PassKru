import React from 'react';
import { TrendingUp } from 'lucide-react';

interface OverallProgressCardProps {
  percent: number;
  lessonsCompleted: number;
  remaining: number;
}

export const OverallProgressCard: React.FC<OverallProgressCardProps> = ({
  percent,
  lessonsCompleted,
  remaining,
}) => {
  return (
    <div className="md:col-span-3 bg-[#0a3263] rounded-2xl p-6 text-white flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-blue-200/80">វឌ្ឍនភាពសរុប</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold mt-1">{percent}%</h3>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#184883] flex items-center justify-center text-blue-200">
          <TrendingUp className="w-4 h-4" />
        </div>
      </div>

      <div className="pt-6 space-y-2">
        <div className="w-full bg-[#12427d] rounded-full h-2 overflow-hidden">
          <div className="bg-emerald-400 h-2 rounded-full" style={{ width: `${percent}%` }} />
        </div>
        <div className="flex justify-between text-[11px] text-blue-200">
          <span>{lessonsCompleted} មេរៀនបានបញ្ចប់</span>
          <span>នៅសល់ {remaining}%</span>
        </div>
      </div>
    </div>
  );
};
