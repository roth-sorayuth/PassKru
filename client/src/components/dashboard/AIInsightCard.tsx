import React from 'react';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, ArrowRight } from 'lucide-react';
import { WeakAreaInsight } from '../../types/dashboard';
import { useLanguage } from '../../context/LanguageContext';

interface AIInsightCardProps {
  accuracy: number;
  weeklyChange: number;
  weakAreas: WeakAreaInsight[];
  onReviewWeakAreas?: () => void;
}

const SEVERITY_LABELS: Record<string, { km: string; en: string }> = {
  high: { km: 'ធ្ងន់ធ្ងរ', en: 'High' },
  medium: { km: 'មធ្យម', en: 'Medium' },
  low: { km: 'ស្រាល', en: 'Low' },
};

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  accuracy,
  weeklyChange,
  weakAreas = [],
  onReviewWeakAreas,
}) => {
  const { lang } = useLanguage();
  const trendingUp = weeklyChange >= 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-[#0a2540]">
              {lang === 'km' ? 'ការវិភាគដោយ AI' : 'AI insight'}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              {lang === 'km' ? 'ការវាយតម្លៃលើលទ្ធផលសិក្សា' : 'A read on your recent results'}
            </p>
          </div>
        </div>

        {/* Weekly Trend Badge — sign now follows the real value; it used to
            hardcode a "+" even on a week where the score dropped. */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${
            trendingUp ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {trendingUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>
            {trendingUp ? '+' : ''}
            {weeklyChange}%
          </span>
        </div>
      </div>

      {/* Accuracy Percentage */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs text-slate-500 font-medium">
            {lang === 'km' ? 'ភាពត្រឹមត្រូវជាមធ្យម' : 'Average accuracy'}
          </span>
          <div className="text-2xl font-extrabold text-[#0a2540]">{accuracy}%</div>
        </div>
        <div className="w-20 sm:w-24 bg-slate-200 rounded-full h-2 overflow-hidden shrink-0">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(100, accuracy))}%` }}
          />
        </div>
      </div>

      {/* Weak Areas Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>
            {lang === 'km'
              ? `ចំណុចខ្សោយត្រូវពង្រឹង (${weakAreas.length})`
              : `Weak areas to strengthen (${weakAreas.length})`}
          </span>
        </div>

        {weakAreas.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {weakAreas.map((item, idx) => {
              const severity = SEVERITY_LABELS[item.severityLevel];
              return (
                <div
                  key={`${item.subject}-${item.topic}-${idx}`}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50/70 border border-slate-100 hover:bg-slate-100/70 transition text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color || '#ef4444' }}
                    />
                    <span className="font-semibold text-slate-700 truncate">{item.subject}:</span>
                    <span className="text-slate-500 truncate">{item.topic}</span>
                  </div>
                  {severity && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        color: item.color,
                        backgroundColor: `${item.color}1a`,
                      }}
                    >
                      {lang === 'km' ? severity.km : severity.en}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-3 px-2 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-slate-100">
            {lang === 'km'
              ? 'មិនទាន់មានចំណុចខ្សោយដែលរកឃើញទេ 🎉'
              : 'No weak areas detected yet 🎉'}
          </div>
        )}
      </div>

      {/* Action Button */}
      {onReviewWeakAreas && (
        <button
          onClick={onReviewWeakAreas}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition cursor-pointer"
        >
          <span>{lang === 'km' ? 'អនុវត្តពង្រឹងសមត្ថភាព' : 'Review weak areas'}</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      )}
    </div>
  );
};
