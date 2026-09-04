import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { FileText, Loader2 } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PdfThumbnailProps {
  url?: string | null;
  className?: string;
  fallbackTitle?: string;
  /**
   * Cover treatment used when the PDF can't be rendered (missing URL, bad
   * file, CORS). Defaults to the neutral grey so existing callers are
   * unaffected; pass a gradient to match the surrounding card design.
   */
  fallbackClassName?: string;
}

export const PdfThumbnail: React.FC<PdfThumbnailProps> = ({
  url,
  className = '',
  fallbackTitle,
  fallbackClassName = 'bg-slate-100/90',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!url) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    const loadPdfThumbnail = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
          cMapPacked: true,
        });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        if (!isMounted || !canvasRef.current) return;

        const viewport = page.getViewport({ scale: 0.8 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext as any).promise;
        if (isMounted) setLoading(false);
      } catch (err) {
        console.warn('Could not render PDF thumbnail, using fallback:', err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    loadPdfThumbnail();

    return () => {
      isMounted = false;
    };
  }, [url]);

  if (error || !url) {
    const isGradientFallback = fallbackClassName.includes('gradient');
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-4 text-center select-none ${fallbackClassName}`}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-2xs mb-2 ${
            isGradientFallback
              ? 'bg-white/15 border border-white/25 text-white'
              : 'bg-white border border-slate-200 text-slate-700'
          }`}
        >
          <FileText className={`w-5 h-5 ${isGradientFallback ? 'text-white' : 'text-black'}`} />
        </div>
        <span
          className={`text-[11px] line-clamp-1 font-normal ${
            isGradientFallback ? 'text-white/80' : 'text-slate-600'
          }`}
        >
          {fallbackTitle || 'PDF វិញ្ញាសា'}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-white overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 z-10">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover object-top border-b border-slate-100 shadow-2xs transition group-hover:scale-105 duration-300 ${className}`}
      />
    </div>
  );
};
