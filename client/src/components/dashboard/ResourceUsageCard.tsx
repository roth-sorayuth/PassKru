import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export interface ResourceItem {
  label: string;
  /** English twin for server-authored labels; absent for DB-sourced names. */
  labelEn?: string | null;
  percent: number;
  color: string; // bar color hex
}

interface ResourceUsageCardProps {
  resources: ResourceItem[];
}

export const ResourceUsageCard: React.FC<ResourceUsageCardProps> = ({ resources }) => {
  const { lang } = useLanguage();

  const labelFor = (item: ResourceItem) =>
    lang === 'en' && item.labelEn ? item.labelEn : item.label;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-5">
      <div>
        <h3 className="text-base font-bold text-[#0a2540]">
          {lang === 'km' ? 'ការប្រើប្រាស់ធនធានសិក្សា' : 'Study resource usage'}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {lang === 'km'
            ? 'ភាគរយនៃធនធាននីមួយៗដែលអ្នកបានប្រើរួច'
            : 'How much of each resource type you have worked through'}
        </p>
      </div>

      {resources.length === 0 ? (
        <p className="text-xs text-slate-400 py-6 text-center">
          {lang === 'km' ? 'មិនទាន់មានទិន្នន័យទេ' : 'No usage data yet'}
        </p>
      ) : (
        <div className="space-y-3.5 py-1">
          {resources.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-600 font-medium truncate">{labelFor(item)}</span>
              <div className="flex items-center gap-3 w-32 sm:w-40 shrink-0">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(0, Math.min(100, item.percent))}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
                <span className="font-bold text-[#0a2540] w-9 text-right">{item.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend derives from the bars actually rendered — it used to be a
          hardcoded pair of swatches ("failed" / "peer average") in colours that
          appear nowhere in this card and for data the card never receives. */}
      {resources.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          {resources.map((item, idx) => (
            <span key={idx} className="flex items-center gap-1 min-w-0">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate">{labelFor(item)}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
