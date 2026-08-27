import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  message?: string;
  confirmText?: string;
  confirmLabel?: string;
  cancelText?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title,
  description,
  message,
  confirmText,
  confirmLabel,
  cancelText,
  cancelLabel,
  isDestructive = true,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const handleClose = onClose || onCancel || (() => {});
  const displayDesc = description || message || '';
  const displayConfirm = confirmText || confirmLabel || 'យល់ព្រមអនុវត្ត';
  const displayCancel = cancelText || cancelLabel || 'បោះបង់';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#111317] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/10 text-[#E0E0E0] animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDestructive ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-snug">{title}</h3>
              <p className="text-xs text-[#8E929E] mt-0.5">ការបញ្ជាក់សកម្មភាពរដ្ឋបាល</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-[#8E929E] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#C5C8D1] leading-relaxed mb-6 bg-[#0D0F12] p-3 rounded-xl border border-white/5">
          {displayDesc}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-[#C5C8D1] bg-[#1A1D24] hover:bg-[#222731] hover:text-white rounded-xl transition-colors disabled:opacity-50 border border-white/5"
          >
            {displayCancel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center gap-2 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 active:scale-98'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-98'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>កំពុងដំណើរការ...</span>
              </>
            ) : (
              displayConfirm
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
