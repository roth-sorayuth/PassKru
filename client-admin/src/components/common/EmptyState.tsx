import React from 'react';
import { LucideIcon, FileQuestion, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FileQuestion,
  title,
  description,
  actionText,
  actionLabel,
  onAction,
}) => {
  const displayAction = actionText || actionLabel;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#111317] rounded-2xl border border-dashed border-white/10 shadow-xs my-4">
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-[#8E929E] max-w-md mb-6 leading-relaxed">{description}</p>
      {displayAction && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>{displayAction}</span>
        </button>
      )}
    </div>
  );
};
