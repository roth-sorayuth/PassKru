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

// In-memory cache for rendered thumbnail data URLs to ensure 0ms instant loading on re-render
const thumbnailCache = new Map<string, string>();

export const PdfThumbnail: React.FC<PdfThumbnailProps> = ({
  url,
  className = '',
  fallbackTitle,
  fallbackClassName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cachedSrc, setCachedSrc] = useState<string | null>(() => (url ? thumbnailCache.get(url) || null : null));
  const [loading, setLoading] = useState(!cachedSrc);
  const [error, setError] = useState(false);

  // Lazy load using IntersectionObserver so offscreen thumbnails do not download or render PDF pages
  useEffect(() => {
    if (cachedSrc) return;

    const el = containerRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px 200px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [url, cachedSrc]);

  useEffect(() => {
    if (url && thumbnailCache.has(url)) {
      setCachedSrc(thumbnailCache.get(url)!);
      setLoading(false);
      return;
    }

    if (!isVisible || !url) {
      if (!url) {
        setLoading(false);
        setError(true);
      }
      return;
    }

    let isMounted = true;
    let loadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null;

    setLoading(true);
    setError(false);

    const loadPdfThumbnail = async () => {
      try {
        loadingTask = pdfjsLib.getDocument({
          url,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        if (!isMounted) return;

        // Scale to 0.5 for fast 4x lighter canvas rendering
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = canvasRef.current || document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext as any).promise;
        
        if (isMounted) {
          try {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            if (dataUrl && dataUrl.length > 100) {
              thumbnailCache.set(url, dataUrl);
              setCachedSrc(dataUrl);
            }
          } catch {}
          setLoading(false);
        }
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn('Could not render PDF thumbnail, using fallback:', err);
        }
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    loadPdfThumbnail();

    return () => {
      isMounted = false;
      if (loadingTask) {
        try {
          loadingTask.destroy();
        } catch {}
      }
    };
  }, [isVisible, url]);

  if (cachedSrc) {
    return (
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center bg-white overflow-hidden font-normal">
        <img
          src={cachedSrc}
          alt={fallbackTitle || 'PDF Thumbnail'}
          className={`w-full h-full object-cover transition group-hover:scale-105 duration-300 ${className}`}
        />
      </div>
    );
  }

  if (!isVisible) {
    if (fallbackClassName) {
      return (
        <div ref={containerRef} className={`w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center select-none ${fallbackClassName}`}>
          <FileText className="w-10 h-10 text-white/40" />
          <span className="text-xs font-semibold text-white/85 line-clamp-2">{fallbackTitle || 'PDF វិញ្ញាសា'}</span>
        </div>
      );
    }
    return (
      <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center bg-white p-4 text-center select-none">
        <FileText className="w-8 h-8 text-slate-300 mb-2" />
        <span className="text-[11px] text-slate-500 line-clamp-1">{fallbackTitle || 'PDF វិញ្ញាសា'}</span>
      </div>
    );
  }

  if ((error || !url) && fallbackClassName) {
    return (
      <div ref={containerRef} className={`w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center select-none ${fallbackClassName}`}>
        <FileText className="w-10 h-10 text-white/40" />
        <span className="text-xs font-semibold text-white/85 line-clamp-2">{fallbackTitle || 'PDF វិញ្ញាសា'}</span>
      </div>
    );
  }

  if (error || !url) {
    return (
      <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center bg-white p-4 text-center select-none font-normal">
        <div className="w-10 h-10 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 mb-2">
          <FileText className="w-5 h-5" />
        </div>
        <span className="text-[11px] text-slate-600 line-clamp-1 font-normal">{fallbackTitle || 'PDF វិញ្ញាសា'}</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center bg-white overflow-hidden font-normal">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10 font-normal">
          <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain transition group-hover:scale-102 duration-300 ${className}`}
      />
    </div>
  );
};
