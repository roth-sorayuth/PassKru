import React from 'react';
import { FileText } from 'lucide-react';
import { formatCategoryKhmer } from './AnnouncementCard';

interface AnnouncementBadgesProps {
  category?: string;
  isUrgent?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const AnnouncementBadges: React.FC<AnnouncementBadgesProps> = ({
  category,
  isUrgent,
  className = '',
  size = 'sm',
}) => {
  const isMd = size === 'md';

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-blue-50 text-[#0f3360] border border-blue-200/80 ${
          isMd ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[10px] sm:text-[11px]'
        }`}
      >
        <FileText className={isMd ? 'w-3.5 h-3.5 text-[#0f3360]' : 'w-3 h-3 text-[#0f3360]'} />
        <span>{formatCategoryKhmer(category)}</span>
      </span>

      {isUrgent && (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-[#fef2f2] text-[#e11d48] border border-[#fecdd3] ${
            isMd ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[10px] sm:text-[11px]'
          }`}
        >
          <span className={`rounded-full bg-[#e11d48] ${isMd ? 'w-2 h-2' : 'w-1.5 h-1.5'}`} />
          <span>បន្ទាន់</span>
        </span>
      )}
    </div>
  );
};
