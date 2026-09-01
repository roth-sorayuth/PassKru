import React from 'react';

export interface ResourceItem {
  label: string;
  percent: number;
  color: string; // bar color hex
}

interface ResourceUsageCardProps {
  resources: ResourceItem[];
}

export const ResourceUsageCard: React.FC<ResourceUsageCardProps> = ({ resources }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5">
      <h3 className="text-base font-bold text-[#0a2540]">ការប្រើប្រាស់ធនធានសិក្សា</h3>

      <div className="space-y-3.5 py-1">
        {resources.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">{item.label}</span>
            <div className="flex items-center gap-3 w-40">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                />
              </div>
              <span className="font-bold text-[#0a2540] w-8 text-right">{item.percent}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-2">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#dbe8f8]" /> ធ្លាក់
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-200" /> មធ្យមភាគសិស្សផ្សេង
        </span>
      </div>
    </div>
  );
};
