import React from 'react';
import { FileText, ExternalLink, X, Download } from 'lucide-react';

interface PdfViewerModalProps {
  url: string | null;
  title?: string;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ url, title, onClose }) => {
  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-normal">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-5xl h-[88vh] bg-white border border-black rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 font-normal">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-black bg-white">
          <h3 className="text-sm font-normal text-black flex items-center gap-2 truncate">
            <FileText className="w-4 h-4 text-black shrink-0" />
            <span className="truncate">{title || 'មើលឯកសារផ្លូវការ (PDF)'}</span>
          </h3>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-black hover:bg-black hover:text-white bg-white border border-black rounded-xl transition flex items-center gap-1 text-xs font-normal"
              title="បើកក្នុងផ្ទាំងថ្មី"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={url}
              download
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-black hover:bg-black hover:text-white bg-white border border-black rounded-xl transition flex items-center gap-1 text-xs font-normal"
              title="ទាញយក"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-black hover:bg-black hover:text-white bg-white border border-black rounded-xl transition cursor-pointer"
              title="បិទ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF iframe body */}
        <div className="flex-1 w-full bg-white">
          <iframe
            src={`${url}#view=FitH`}
            className="w-full h-full border-none"
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  );
};
