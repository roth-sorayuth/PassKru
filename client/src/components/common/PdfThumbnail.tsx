import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { FileText, Loader2 } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PdfThumbnailProps {
  url?: string | null;
  className?: string;
  fallbackTitle?: string;
  fallbackClassName?: string;
}

export const PdfThumbnail: React.FC<PdfThumbnailProps> = ({
  url,
  className = '',
  fallbackTitle,
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

        // Render at crisp resolution (scale: 1.2)
        const viewport = page.getViewport({ scale: 1.2 });
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
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white p-4 text-center select-none font-normal">
        <div className="w-10 h-10 rounded-xl bg-white border border-black flex items-center justify-center text-black mb-2">
          <FileText className="w-5 h-5 text-black" />
        </div>
        <span className="text-[11px] text-black line-clamp-1 font-normal">{fallbackTitle || 'PDF វិញ្ញាសា'}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-white overflow-hidden font-normal">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10 font-normal">
          <Loader2 className="w-5 h-5 animate-spin text-black" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain transition group-hover:scale-102 duration-300 ${className}`}
      />
    </div>
  );
};
