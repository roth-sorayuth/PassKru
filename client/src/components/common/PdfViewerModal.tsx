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
  Minimize2,
  Printer,
  RotateCw,
  Loader2,
  FileText,
  ExternalLink,
  Smartphone,
  Monitor,
} from 'lucide-react';

// Setup PDF.js worker
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    pdfjsWorker || `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
}

interface PdfViewerModalProps {
  url: string | null;
  title?: string;
  onClose: () => void;
  fileSize?: string;
}

type FitMode = 'fit-width' | 'fit-page' | 'custom';

/* ── Virtualized Single Page Canvas Component ── */
const VirtualPageCanvas: React.FC<{
  pdfDoc: any;
  pageNum: number;
  containerWidth: number;
  containerHeight: number;
  scale: number;
  fitMode: FitMode;
  rotation: number;
  baseAspect: number;
  onIntersectChange?: (pageNum: number, isIntersecting: boolean) => void;
}> = ({
  pdfDoc,
  pageNum,
  containerWidth,
  containerHeight,
  scale,
  fitMode,
  rotation,
  baseAspect,
  onIntersectChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const [isInView, setIsInView] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [pageDims, setPageDims] = useState<{ width: number; height: number } | null>(null);

  // 1. Observe intersection: only render active canvas when within 400px of viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const visible = entry.isIntersecting;
        setIsInView(visible);
        if (onIntersectChange) {
          onIntersectChange(pageNum, visible);
        }
      },
      {
        rootMargin: '400px 0px 400px 0px',
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [pageNum, onIntersectChange]);

  // 2. Render canvas on demand
  useEffect(() => {
    if (!pdfDoc || containerWidth === 0) return;

    if (!isInView) {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
        renderTaskRef.current = null;
      }
      return;
    }

    let isAlive = true;

    (async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (!isAlive) return;

        const effectiveRotation = ((page.rotate || 0) + rotation) % 360;
        const rawViewport = page.getViewport({ scale: 1, rotation: effectiveRotation });

        // Responsive padding:
        // Mobile (<640px): 12px each side = 24px
        // Tablet (640px - 1024px): 24px each side = 48px
        // Desktop (>1024px): 32px each side = 64px
        const horizPadding = containerWidth < 640 ? 24 : containerWidth < 1024 ? 48 : 64;
        const availWidth = Math.max(200, containerWidth - horizPadding);
        const availHeight = Math.max(300, containerHeight - 80);

        let activeScale = scale;

        if (fitMode === 'fit-width') {
          // On mobile & tablet: fit the exact screen width for optimal reading
          // On desktop wide screens (>1024px): cap max width to 900px so it doesn't over-stretch
          const targetWidth = containerWidth < 1024 ? availWidth : Math.min(availWidth, 900);
          activeScale = targetWidth / rawViewport.width;
        } else if (fitMode === 'fit-page') {
          // Fit entire page within view (height and width)
          const scaleW = availWidth / rawViewport.width;
          const scaleH = availHeight / rawViewport.height;
          activeScale = Math.min(scaleW, scaleH);
        }

        const displayWidth = Math.round(rawViewport.width * activeScale);
        const displayHeight = Math.round(rawViewport.height * activeScale);
        setPageDims({ width: displayWidth, height: displayHeight });

        // Cap DPR at 2.0 to prevent mobile canvas OOM crash
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const renderViewport = page.getViewport({
          scale: activeScale * dpr,
          rotation: effectiveRotation,
        });

        const canvas = canvasRef.current;
        if (!canvas) return;

        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {}
          renderTaskRef.current = null;
        }

        canvas.width = renderViewport.width;
        canvas.height = renderViewport.height;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const task = page.render({
          canvasContext: ctx,
          viewport: renderViewport,
        } as any);

        renderTaskRef.current = task;
        await task.promise;

        if (isAlive) {
          setIsRendered(true);
        }
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn(`PDF page ${pageNum} render issue:`, err);
        }
      }
    })();

    return () => {
      isAlive = false;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
        renderTaskRef.current = null;
      }
    };
  }, [pdfDoc, pageNum, containerWidth, containerHeight, scale, fitMode, rotation, isInView]);

  // Compute placeholder dimensions based on base aspect ratio
  const horizPadding = containerWidth < 640 ? 24 : containerWidth < 1024 ? 48 : 64;
  const availWidth = Math.max(200, containerWidth - horizPadding);
  const targetWidth =
    pageDims?.width ||
    (fitMode === 'fit-width'
      ? (containerWidth < 1024 ? availWidth : Math.min(availWidth, 900))
      : Math.round(availWidth * scale));
  const targetHeight =
    pageDims?.height || Math.round(targetWidth * (baseAspect || 1.414));

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center transition-all duration-150 select-none"
      style={{
        minHeight: targetHeight,
        width: '100%',
        maxWidth: targetWidth,
      }}
    >
      <div
        className="relative flex items-center justify-center rounded-sm transition-all overflow-hidden"
        style={{
          width: targetWidth,
          height: targetHeight,
          background: '#ffffff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.45)',
        }}
      >
        {/* Placeholder skeleton while loading or off-screen */}
        {(!isInView || !isRendered) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#6750A4]" />
            <span className="text-xs font-semibold text-gray-500">ទំព័រ {pageNum}</span>
          </div>
        )}

        {/* Crisp HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          className={`block transition-opacity duration-200 ${
            isInView && isRendered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            maxWidth: '100%',
            height: 'auto',
            background: '#ffffff',
          }}
        />
      </div>

      {/* Page number pill */}
      <span className="text-[11px] mt-2 mb-1 tabular-nums font-semibold text-gray-400 bg-white/5 px-2.5 py-0.5 rounded-full">
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
  fileSize,
}) => {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  // Default to 'fit-width' so both mobile and tablet fit comfortably on open
  const [fitMode, setFitMode] = useState<FitMode>('fit-width');
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [baseAspect, setBaseAspect] = useState(1.414);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastWidthRef = useRef(0);
  const lastHeightRef = useRef(0);
  const visiblePagesRef = useRef<Set<number>>(new Set());

  // Touch pinch and double tap references
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartScaleRef = useRef<number>(1.0);
  const lastTapTimeRef = useRef<number>(0);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        scrollToPage(Math.min(numPages, currentPage + 1));
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        scrollToPage(Math.max(1, currentPage - 1));
      }
      if (e.key === '+' || e.key === '=') {
        setScale((s) => Math.min(3.0, +(s + 0.2).toFixed(2)));
        setFitMode('custom');
      }
      if (e.key === '-') {
        setScale((s) => Math.max(0.4, +(s - 0.2).toFixed(2)));
        setFitMode('custom');
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose, numPages, currentPage]);

  /* ── Load Document & Memory Lifecycle ── */
  useEffect(() => {
    if (!url) return;
    let isAlive = true;
    let loadedDoc: any = null;

    setLoading(true);
    setError(false);
    setCurrentPage(1);
    setRotation(0);
    setScale(1.0);
    setFitMode('fit-width');
    visiblePagesRef.current.clear();

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      scrollRef.current.scrollLeft = 0;
    }

    (async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (!isAlive) {
          try {
            doc.destroy();
          } catch {}
          return;
        }

        loadedDoc = doc;
        setPdfDoc(doc);
        setNumPages(doc.numPages || 1);

        try {
          const firstPage = await doc.getPage(1);
          const vp = firstPage.getViewport({ scale: 1 });
          if (vp.width > 0 && vp.height > 0) {
            setBaseAspect(vp.height / vp.width);
          }
        } catch {}

        setLoading(false);
      } catch (err) {
        console.error('Failed to load PDF document:', err);
        if (isAlive) {
          setError(true);
          setLoading(false);
        }
      }
    })();

    return () => {
      isAlive = false;
      if (loadedDoc) {
        try {
          loadedDoc.destroy();
        } catch {}
      }
    };
  }, [url]);

  /* ── Debounced container measurement (guards against mobile address-bar resize loop) ── */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (Math.abs(w - lastWidthRef.current) >= 8 || lastWidthRef.current === 0) {
        lastWidthRef.current = w;
        setContainerWidth(w);
      }
      if (Math.abs(h - lastHeightRef.current) >= 16 || lastHeightRef.current === 0) {
        lastHeightRef.current = h;
        setContainerHeight(h);
      }
    };

    measure();

    let rafId: number | null = null;
    const ro = new ResizeObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    });

    ro.observe(el);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  /* ── Track current visible page ── */
  const handleIntersectChange = useCallback((pNum: number, isVisible: boolean) => {
    if (isVisible) {
      visiblePagesRef.current.add(pNum);
    } else {
      visiblePagesRef.current.delete(pNum);
    }

    if (visiblePagesRef.current.size > 0) {
      const minVisible = Math.min(...Array.from(visiblePagesRef.current));
      setCurrentPage(minVisible);
    }
  }, []);

  /* ── Page navigation ── */
  const scrollToPage = (targetPage: number) => {
    const el = pageRefs.current[targetPage - 1];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setCurrentPage(targetPage);
  };

  const prevPage = () => scrollToPage(Math.max(1, currentPage - 1));
  const nextPage = () => scrollToPage(Math.min(numPages, currentPage + 1));

  const zoomIn = () => {
    setFitMode('custom');
    setScale((s) => Math.min(3.0, +(s + 0.2).toFixed(2)));
  };

  const zoomOut = () => {
    setFitMode('custom');
    setScale((s) => Math.max(0.4, +(s - 0.2).toFixed(2)));
  };

  const toggleFitMode = () => {
    if (fitMode === 'fit-width') {
      setFitMode('fit-page');
    } else if (fitMode === 'fit-page') {
      setFitMode('custom');
      setScale(1.0);
    } else {
      setFitMode('fit-width');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      modalRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  /* ── Touch gestures: Pinch-to-zoom & Double-tap ── */
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      pinchStartDistRef.current = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      pinchStartScaleRef.current = scale;
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapTimeRef.current < 300) {
        // Double tap toggle
        if (fitMode !== 'custom' || scale < 1.5) {
          setFitMode('custom');
          setScale(1.8);
        } else {
          setFitMode('fit-width');
          setScale(1.0);
        }
      }
      lastTapTimeRef.current = now;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = dist / pinchStartDistRef.current;
      const newScale = Math.min(3.0, Math.max(0.4, +(pinchStartScaleRef.current * ratio).toFixed(2)));
      setFitMode('custom');
      setScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    pinchStartDistRef.current = null;
  };

  if (!url) return null;

  const fitModeLabel =
    fitMode === 'fit-width'
      ? 'Fit Width'
      : fitMode === 'fit-page'
      ? 'Fit Page'
      : `${Math.round(scale * 100)}%`;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden select-none"
      style={{
        background: '#1C1B1F',
        color: '#E6E1E5',
        fontFamily: "'Inter','Battambang',system-ui,sans-serif",
      }}
    >
      {/* ══════════════════════════════════════════════════════════════
          TIER 1: MAIN RESPONSIVE HEADER BAR
          ══════════════════════════════════════════════════════════════ */}
      <header
        className="shrink-0 flex items-center justify-between gap-2 px-3 sm:px-5 z-40"
        style={{
          height: 52,
          background: '#2B2930',
          borderBottom: '1px solid rgba(147,143,153,0.18)',
        }}
      >
        {/* Left: Back Arrow + Document Title + Badges */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onClose}
            aria-label="ត្រឡប់ក្រោយ"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/15 transition cursor-pointer text-gray-300 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-semibold truncate text-[#E6E1E5] max-w-[200px] sm:max-w-[320px] md:max-w-md" title={title || 'ឯកសារ PDF'}>
              {title || 'ឯកសារ PDF'}
            </h1>
            <span
              className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0"
              style={{ background: 'rgba(208,188,255,0.15)', color: '#D0BCFF' }}
            >
              ផ្លូវការ
            </span>
          </div>
        </div>

        {/* Center: Desktop Integrated Control Pill (Shown on lg: >= 1024px) */}
        <div
          className="hidden lg:flex items-center gap-1"
          style={{
            background: '#1C1B1F',
            borderRadius: 24,
            padding: '3px 8px',
            border: '1px solid rgba(147,143,153,0.2)',
          }}
        >
          {/* Page nav */}
          <button
            onClick={prevPage}
            disabled={currentPage <= 1}
            aria-label="ទំព័រមុន"
            className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-white/10 transition cursor-pointer text-gray-300"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] px-1.5 tabular-nums text-gray-200 font-medium">
            {currentPage} / {numPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage >= numPages}
            aria-label="ទំព័របន្ទាប់"
            className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-white/10 transition cursor-pointer text-gray-300"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 mx-1.5 bg-gray-700" />

          {/* Zoom controls */}
          <button
            onClick={zoomOut}
            disabled={scale <= 0.4}
            aria-label="បង្រួម"
            className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-white/10 transition cursor-pointer text-gray-300"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFitMode}
            title="ប្ដូរទំហំ Fit Width / Fit Page / Custom"
            className="h-6 px-2.5 rounded-full flex items-center text-[10px] font-semibold transition cursor-pointer"
            style={{
              background: fitMode !== 'custom' ? 'rgba(208,188,255,0.18)' : 'transparent',
              color: fitMode !== 'custom' ? '#D0BCFF' : '#CAC4D0',
            }}
          >
            {fitModeLabel}
          </button>
          <button
            onClick={zoomIn}
            disabled={scale >= 3.0}
            aria-label="ពង្រីក"
            className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-white/10 transition cursor-pointer text-gray-300"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 mx-1.5 bg-gray-700" />

          {/* Rotate */}
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            title="បង្វិល 90°"
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition cursor-pointer text-gray-300"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title="ពេញអេក្រង់"
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition cursor-pointer text-gray-300"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right Actions: Print, Download, Close */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => url && window.open(url, '_blank')?.focus()}
            title="បោះពុម្ពឯកសារ"
            className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center hover:bg-white/10 transition cursor-pointer text-gray-300"
          >
            <Printer className="w-4 h-4" />
          </button>

          <a
            href={url}
            download
            target="_blank"
            rel="noreferrer"
            className="h-8 sm:h-9 px-3 sm:px-4 rounded-full flex items-center gap-1.5 font-semibold text-xs transition cursor-pointer shadow-sm hover:brightness-110 active:brightness-95"
            style={{ background: '#6750A4', color: '#ffffff' }}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ទាញយក</span>
          </a>

          <button
            onClick={onClose}
            aria-label="បិទ"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition cursor-pointer text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          TIER 2: TABLET & MOBILE SECONDARY CONTROL TOOLBAR (< 1024px)
          Seamlessly adapts desktop controls for mobile/tablet without covering content
          ══════════════════════════════════════════════════════════════ */}
      <div
        className="flex lg:hidden items-center justify-between sm:justify-center gap-1 sm:gap-4 px-3 py-1.5 z-30 shrink-0"
        style={{
          background: '#242229',
          borderBottom: '1px solid rgba(147,143,153,0.12)',
        }}
      >
        {/* Mobile/Tablet Page Navigator */}
        <div className="flex items-center gap-0.5 bg-[#1C1B1F] rounded-full px-1.5 py-0.5 border border-white/10">
          <button
            onClick={prevPage}
            disabled={currentPage <= 1}
            aria-label="ទំព័រមុន"
            className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 active:bg-white/10 transition text-gray-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[11px] px-1 tabular-nums font-semibold text-white min-w-[42px] text-center">
            {currentPage} / {numPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage >= numPages}
            aria-label="ទំព័របន្ទាប់"
            className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 active:bg-white/10 transition text-gray-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile/Tablet Zoom & Fit Controls */}
        <div className="flex items-center gap-0.5 bg-[#1C1B1F] rounded-full px-1 py-0.5 border border-white/10">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.4}
            aria-label="បង្រួម"
            className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 active:bg-white/10 transition text-gray-300"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFitMode}
            className="h-6 px-2 rounded-full flex items-center text-[10px] font-bold transition"
            style={{
              background: fitMode !== 'custom' ? 'rgba(208,188,255,0.2)' : 'transparent',
              color: fitMode !== 'custom' ? '#D0BCFF' : '#CAC4D0',
            }}
          >
            {fitModeLabel}
          </button>
          <button
            onClick={zoomIn}
            disabled={scale >= 3.0}
            aria-label="ពង្រីក"
            className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 active:bg-white/10 transition text-gray-300"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile/Tablet Rotate & Fullscreen */}
        <div className="flex items-center gap-0.5 bg-[#1C1B1F] rounded-full px-1 py-0.5 border border-white/10">
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            title="បង្វិល"
            className="w-7 h-7 rounded-full flex items-center justify-center active:bg-white/10 transition text-gray-300"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFullscreen}
            title="ពេញអេក្រង់"
            className="w-7 h-7 rounded-full flex items-center justify-center active:bg-white/10 transition text-gray-300"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SCROLLABLE DOCUMENT VIEWPORT
          ══════════════════════════════════════════════════════════════ */}
      <div
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex-1 overflow-auto min-h-0 relative touch-pan-x touch-pan-y"
        style={{
          background: '#1C1B1F',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3.5 py-24">
            <Loader2 className="w-10 h-10 animate-spin text-[#D0BCFF]" />
            <p className="text-xs text-gray-400 tracking-wide font-medium">កំពុងដំណើរការឯកសារ PDF...</p>
          </div>
        ) : error ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-sm w-full bg-[#2B2930] border border-white/10 rounded-2xl p-6 flex flex-col items-center shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">មិនអាចបង្ហាញឯកសារ PDF ដោយផ្ទាល់បានទេ</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  ឯកសារនេះអាចមានទំហំធំ ឬត្រូវបើកនៅក្នុងផ្ទាំងថ្មី។
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 w-full pt-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6750A4] text-white text-xs font-semibold hover:brightness-110 transition"
                >
                  <ExternalLink className="w-4 h-4" /> បើកក្នុងផ្ទាំងថ្មី
                </a>
                <a
                  href={url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
                >
                  <Download className="w-4 h-4" /> ទាញយក
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 py-6 px-2 sm:px-6 min-w-min mx-auto">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => (
              <div
                key={p}
                ref={(el) => {
                  pageRefs.current[p - 1] = el;
                }}
                className="w-full flex justify-center"
              >
                <VirtualPageCanvas
                  pdfDoc={pdfDoc}
                  pageNum={p}
                  containerWidth={containerWidth}
                  containerHeight={containerHeight}
                  scale={scale}
                  fitMode={fitMode}
                  rotation={rotation}
                  baseAspect={baseAspect}
                  onIntersectChange={handleIntersectChange}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
