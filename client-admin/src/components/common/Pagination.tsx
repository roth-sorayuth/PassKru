import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-white/5 bg-[#0D0F12] rounded-b-2xl">
      <div className="text-xs text-[#8E929E] font-medium">
        បង្ហាញពី <span className="font-semibold text-white">{startItem}</span> ដល់{' '}
        <span className="font-semibold text-white">{endItem}</span> នៃទិន្នន័យសរុប{' '}
        <span className="font-semibold text-white">{totalItems}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-white/10 bg-[#16191E] text-[#C5C8D1] hover:bg-[#222731] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="ទំព័រមុន"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 px-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((page, idx, array) => {
              const showEllipsis = idx > 0 && page - array[idx - 1] > 1;
              return (
                <React.Fragment key={page}>
                  {showEllipsis && <span className="px-1 text-slate-500 text-xs">...</span>}
                  <button
                    onClick={() => onPageChange(page)}
                    className={`min-w-8 h-8 px-2 text-xs font-semibold rounded-lg transition-all ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-[#C5C8D1] bg-[#16191E] border border-white/10 hover:bg-[#222731] hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-white/10 bg-[#16191E] text-[#C5C8D1] hover:bg-[#222731] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="ទំព័របន្ទាប់"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
