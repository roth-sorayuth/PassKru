import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { WeakAreaInsight } from '../../types/dashboard';

interface AIInsightCardProps {
  accuracy: number;
  weeklyChange: number;
  weakAreas: WeakAreaInsight[];
  onReviewWeakAreas?: () => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  accuracy,
  weeklyChange,
  weakAreas = [],
  onReviewWeakAreas,
}) => {
  return (
    <div className="md:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0a2540]">ការវិភាគដោយ AI</h3>
            <p className="text-xs text-slate-400">ការវាយតម្លៃលើលទ្ធផលសិក្សា</p>
          </div>
        </div>

        {/* Weekly Trend Badge */}
        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-semibold">
          <TrendingUp className="w-3 h-3" />
          <span>+{weeklyChange}%</span>
        </div>
      </div>

      {/* Accuracy Percentage */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-medium">ភាពត្រឹមត្រូវជាមធ្យម</span>
          <div className="text-2xl font-extrabold text-[#0a2540]">{accuracy}%</div>
        </div>
        <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, accuracy)}%` }}
          />
        </div>
      </div>

      {/* Weak Areas Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>ចំណុចខ្សោយត្រូវពង្រឹង ({weakAreas.length})</span>
        </div>

        {weakAreas.length > 0 ? (
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {weakAreas.map((item, idx) => (
              <div
                key={`${item.subject}-${item.topic}-${idx}`}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 border border-slate-100 hover:bg-slate-100/70 transition text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color || '#ef4444' }}
                  />
                  <span className="font-semibold text-slate-700 truncate">{item.subject}:</span>
                  <span className="text-slate-500 truncate">{item.topic}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-3 px-2 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-slate-100">
            មិនទាន់មានចំណុចខ្សោយដែលរកឃើញទេ 🎉
          </div>
        )}
      </div>

      {/* Action Button */}
      {onReviewWeakAreas && (
        <button
          onClick={onReviewWeakAreas}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition cursor-pointer"
        >
          <span>អនុវត្តពង្រឹងសមត្ថភាព</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
