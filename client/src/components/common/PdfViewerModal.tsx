import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  RotateCw,
  Loader2,
} from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PdfViewerModalProps {
  url: string | null;
  title?: string;
  onClose: () => void;
  fileSize?: string;
}

/* ── Single page canvas ── */
const PageCanvas: React.FC<{
  pdfDoc: any;
  pageNum: number;
  containerWidth: number;
  scale: number;
  fitMode: 'fit' | 'custom';
  rotation: number;
}> = ({ pdfDoc, pageNum, containerWidth, scale, fitMode, rotation }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    if (!pdfDoc || !ref.current || containerWidth === 0) return;
    let alive = true;

    (async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (!alive || !ref.current) return;

        // Respect page's intrinsic rotation metadata + user rotation
        const effectiveRotation = ((page.rotate || 0) + rotation) % 360;
        const raw = page.getViewport({ scale: 1, rotation: effectiveRotation });

        let s = scale;
        if (fitMode === 'fit') {
          s = (containerWidth - 32) / raw.width; // 16px padding each side
        }

        const dw = Math.round(raw.width * s);
        const dh = Math.round(raw.height * s);
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const vp = page.getViewport({ scale: s * dpr, rotation: effectiveRotation });

        const canvas = ref.current;
        if (renderTaskRef.current) {
          try { renderTaskRef.current.cancel(); } catch {}
          renderTaskRef.current = null;
        }

        canvas.width = vp.width;
        canvas.height = vp.height;
        canvas.style.width = `${dw}px`;
        canvas.style.height = `${dh}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const task = page.render({ canvasContext: ctx, viewport: vp } as any);
        renderTaskRef.current = task;
        await task.promise;
      } catch { /* ignore */ }
    })();

    return () => {
      alive = false;
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch {}
        renderTaskRef.current = null;
      }
    };
  }, [pdfDoc, pageNum, containerWidth, scale, fitMode, rotation]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={ref}
        style={{
          display: 'block',
          boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
          borderRadius: 2,
          background: '#fff',
        }}
      />
      <span className="text-[10px] mt-1.5 mb-1 tabular-nums" style={{ color: '#938F99' }}>
        {pageNum}
      </span>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  url,
  title,
  onClose,
  fileSize = '2.4 MB',
}) => {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [fitMode, setFitMode] = useState<'fit' | 'custom'>('custom');
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ── keyboard ── */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  /* ── load PDF & reset state ── */
  useEffect(() => {
    if (!url) return;
    let alive = true;
    setLoading(true);
    setError(false);
    setCurrentPage(1);
    setRotation(0);
    setScale(1.0);
    setFitMode('custom');
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }

    (async () => {
      try {
        const doc = await pdfjsLib.getDocument({
          url,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
          cMapPacked: true,
        }).promise;
        if (!alive) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages || 1);
        setLoading(false);
      } catch {
        if (alive) { setError(true); setLoading(false); }
      }
    })();
    return () => { alive = false; };
  }, [url]);

  /* ── track container width ── */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── track which page is in view ── */
  useEffect(() => {
    if (!pdfDoc || !scrollRef.current) return;
    const root = scrollRef.current;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = pageRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx >= 0) setCurrentPage(idx + 1);
          }
        }
      },
      { root, rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    pageRefs.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [pdfDoc, numPages]);

  const scrollToPage = (p: number) => {
    const el = pageRefs.current[p - 1];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setCurrentPage(p);
  };

  const prevPage = () => scrollToPage(Math.max(1, currentPage - 1));
  const nextPage = () => scrollToPage(Math.min(numPages, currentPage + 1));
  const zoomIn = () => { setFitMode('custom'); setScale(s => Math.min(3, +(s + 0.2).toFixed(2))); };
  const zoomOut = () => { setFitMode('custom'); setScale(s => Math.max(0.3, +(s - 0.2).toFixed(2))); };
  const toggleFit = () => { fitMode === 'fit' ? (setFitMode('custom'), setScale(1)) : setFitMode('fit'); };

  if (!url) return null;

  const zoomPct = fitMode === 'fit' ? 'Fit' : `${Math.round(scale * 100)}%`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden select-none"
      style={{ background: '#1C1B1F', color: '#E6E1E5', fontFamily: "'Inter','Battambang',system-ui,sans-serif" }}>

      {/* ═══ TOP BAR ═══ */}
      <header className="shrink-0 flex items-center justify-between gap-2 px-2 sm:px-4 z-40"
        style={{ height: 48, background: '#2B2930', borderBottom: '1px solid rgba(147,143,153,0.16)' }}>

        {/* Left */}
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/8 transition cursor-pointer"
            style={{ color: '#CAC4D0' }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <p className="text-[13px] font-medium truncate" style={{ color: '#E6E1E5' }}>
              {title || 'ឯកសារ PDF'}
            </p>
          </div>
          <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium ml-1 shrink-0"
            style={{ background: 'rgba(208,188,255,0.12)', color: '#D0BCFF' }}>
            Official
          </span>
        </div>

        {/* Center: page nav + zoom (desktop) */}
        <div className="hidden md:flex items-center gap-0.5"
          style={{ background: '#1C1B1F', borderRadius: 24, padding: '3px 5px', border: '1px solid rgba(147,143,153,0.16)' }}>
          <button onClick={prevPage} disabled={currentPage <= 1}
            className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-white/8 transition cursor-pointer"
            style={{ color: '#CAC4D0' }}>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] px-1 tabular-nums" style={{ color: '#E6E1E5' }}>
            {currentPage} / {numPages}
          </span>
          <button onClick={nextPage} disabled={currentPage >= numPages}
            className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-white/8 transition cursor-pointer"
            style={{ color: '#CAC4D0' }}>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 mx-1" style={{ background: 'rgba(147,143,153,0.3)' }} />
          <button onClick={zoomOut} disabled={scale <= 0.3}
            className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-white/8 transition cursor-pointer"
            style={{ color: '#CAC4D0' }}>
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button onClick={toggleFit}
            className="h-6 px-2 rounded-full flex items-center text-[10px] font-medium transition cursor-pointer"
            style={{ background: fitMode === 'fit' ? 'rgba(208,188,255,0.16)' : 'transparent', color: fitMode === 'fit' ? '#D0BCFF' : '#CAC4D0' }}>
            {zoomPct}
          </button>
          <button onClick={zoomIn} disabled={scale >= 3}
            className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-white/8 transition cursor-pointer"
            style={{ color: '#CAC4D0' }}>
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 mx-1" style={{ background: 'rgba(147,143,153,0.3)' }} />
          <button onClick={() => setRotation(r => (r + 90) % 360)}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/8 transition cursor-pointer"
            style={{ color: '#CAC4D0' }}>
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); }}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/8 transition cursor-pointer"
            style={{ color: '#CAC4D0' }}>
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile page counter */}
        <div className="flex md:hidden items-center gap-0.5 rounded-full px-1 py-0.5"
          style={{ background: '#1C1B1F', border: '1px solid rgba(147,143,153,0.16)' }}>
          <button onClick={prevPage} disabled={currentPage <= 1}
            className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 cursor-pointer"
            style={{ color: '#CAC4D0' }}>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] px-1 tabular-nums" style={{ color: '#E6E1E5' }}>{currentPage}/{numPages}</span>
          <button onClick={nextPage} disabled={currentPage >= numPages}
            className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 cursor-pointer"
            style={{ color: '#CAC4D0' }}>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button onClick={() => url && window.open(url, '_blank')?.focus()}
            className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center hover:bg-white/8 transition cursor-pointer"
            style={{ color: '#CAC4D0' }}>
            <Printer className="w-4 h-4" />
          </button>
          <a href={url} download target="_blank" rel="noreferrer"
            className="h-9 px-4 rounded-full flex items-center gap-1.5 font-medium text-xs transition cursor-pointer"
            style={{ background: '#6750A4', color: '#fff' }}>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">ទាញយក</span>
          </a>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/8 transition cursor-pointer"
            style={{ color: '#938F99' }}>
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ═══ ALL PAGES — scrollable, no extra space ═══ */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden min-h-0"
        style={{ background: '#1C1B1F' }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#6750A4' }} />
            <p className="text-xs" style={{ color: '#938F99' }}>កំពុងដំណើរការ...</p>
          </div>
        ) : error ? (
          <div className="w-full h-full p-4">
            <iframe src={`${url}#view=FitH`} className="w-full h-full border-none rounded-lg" title="PDF" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4 px-4">
            {Array.from({ length: numPages }, (_, i) => i + 1).map(p => (
              <div key={p} ref={el => { pageRefs.current[p - 1] = el; }}>
                <PageCanvas
                  pdfDoc={pdfDoc}
                  pageNum={p}
                  containerWidth={containerWidth}
                  scale={scale}
                  fitMode={fitMode}
                  rotation={rotation}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
