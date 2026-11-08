import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileDown,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { NotebookSettings, PageData } from '../types';
import { PAGE_DIMENSIONS } from '../utils/constants';
import { ensureFontsLoaded, renderNotebookPage } from '../utils/canvasRenderer';
import { getFontFamily } from '../utils/paginationEngine';

interface NotebookPreviewProps {
  currentPageIndex: number;
  totalPages: number;
  pages: PageData[];
  settings: NotebookSettings;
  onChangePageIndex: (index: number) => void;
  onExportCurrentPagePng: () => void;
  onExportAllPagesPng: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  isExporting: boolean;
}

export const NotebookPreview: React.FC<NotebookPreviewProps> = ({
  currentPageIndex,
  totalPages,
  pages,
  settings,
  onChangePageIndex,
  onExportCurrentPagePng,
  onExportAllPagesPng,
  onExportPdf,
  onPrint,
  isExporting,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFontReady, setIsFontReady] = useState(false);
  const [rendering, setRendering] = useState(false);

  const currentPageData = pages[currentPageIndex] || pages[0] || { pageNumber: 1, lines: [], totalWords: 0 };
  const dimensions = PAGE_DIMENSIONS[settings.pageSize] || PAGE_DIMENSIONS['a4-portrait'];

  // Check font readiness
  useEffect(() => {
    let mounted = true;
    const fontFamily = getFontFamily(settings.style);
    ensureFontsLoaded(fontFamily).then(() => {
      if (mounted) setIsFontReady(true);
    });
    return () => {
      mounted = false;
    };
  }, [settings.style]);

  // Render to canvas
  useEffect(() => {
    if (!canvasRef.current || !isFontReady) return;

    setRendering(true);
    const canvas = canvasRef.current;

    // Render with 2x High-DPI for crisp text
    renderNotebookPage(canvas, currentPageData, settings, totalPages, 2);
    setRendering(false);
  }, [currentPageData, settings, totalPages, isFontReady]);

  // Auto-fit zoom on mount or page dimension change
  useEffect(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 48; // padding
    if (containerWidth > 0 && dimensions.width > 0) {
      const fitZoom = Math.min(1.1, Math.max(0.45, containerWidth / dimensions.width));
      setZoomLevel(fitZoom);
    }
  }, [settings.pageSize]);

  const handlePrevPage = () => {
    if (currentPageIndex > 0) onChangePageIndex(currentPageIndex - 1);
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) onChangePageIndex(currentPageIndex + 1);
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(1.8, +(prev + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0.4, +(prev - 0.15).toFixed(2)));
  const handleZoomFit = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 48;
    const fitZoom = Math.min(1.2, Math.max(0.45, containerWidth / dimensions.width));
    setZoomLevel(+fitZoom.toFixed(2));
  };
  const handleZoomActual = () => setZoomLevel(1);

  return (
    <div className="flex flex-col h-full bg-stone-100/70 dark:bg-stone-950/70 select-none">
      {/* Top Preview Control Bar */}
      <div className="p-3 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        {/* Left: Page Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex <= 0}
            className="p-1.5 rounded-md text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono tabular-nums text-stone-800 dark:text-stone-200 font-medium px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded">
            Page {currentPageIndex + 1} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPageIndex >= totalPages - 1}
            className="p-1.5 rounded-md text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Zoom Controls */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg text-xs text-stone-600 dark:text-stone-300">
          <button
            onClick={handleZoomOut}
            className="p-1 hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomActual}
            className="px-2 py-0.5 font-mono text-[11px] hover:text-stone-950 dark:hover:text-white transition-colors"
            title="Actual Size 100%"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1 hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomFit}
            className="p-1 ml-1 hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer"
            title="Fit to Width"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Quick Page Export Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportCurrentPagePng}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 hover:text-stone-900 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/70 dark:hover:bg-stone-700 rounded-md transition-colors cursor-pointer disabled:opacity-50"
            title="Download this page as high-res PNG image"
          >
            <Download className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span className="hidden sm:inline">Save Page PNG</span>
          </button>

          <button
            onClick={onExportAllPagesPng}
            disabled={isExporting || totalPages <= 1}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 hover:text-stone-900 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/70 dark:hover:bg-stone-700 rounded-md transition-colors cursor-pointer disabled:opacity-40"
            title="Download every page individually as PNGs"
          >
            <FileDown className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>All PNGs</span>
          </button>

          <button
            onClick={onPrint}
            className="p-1.5 rounded-md text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="Print Notebook Page"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Display Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center relative min-h-[400px]"
      >
        <div
          className="transition-transform duration-100 ease-out flex items-center justify-center"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Notebook Paper Sheet with realistic drop shadow */}
          <div
            className="relative bg-white dark:bg-stone-900 rounded-xs shadow-2xl border border-stone-300/60 dark:border-stone-800 overflow-hidden"
            style={{
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                display: 'block',
              }}
            />

            {!isFontReady && (
              <div className="absolute inset-0 bg-stone-50/80 dark:bg-stone-900/80 flex items-center justify-center">
                <span className="text-xs font-medium text-stone-600 dark:text-stone-400 animate-pulse">
                  Loading handwriting typography...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Thumbnail strip if multiple pages */}
      {totalPages > 1 && (
        <div className="px-4 py-2 bg-white/80 dark:bg-stone-900/80 border-t border-stone-200 dark:border-stone-800 flex items-center justify-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] text-stone-500 mr-2 font-mono">Jump to:</span>
          {Array.from({ length: totalPages }, (_, i) => i).map((pIndex) => (
            <button
              key={pIndex}
              onClick={() => onChangePageIndex(pIndex)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                currentPageIndex === pIndex
                  ? 'bg-amber-800 text-white font-semibold shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              Page {pIndex + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
