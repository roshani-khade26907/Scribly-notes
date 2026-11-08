import React from 'react';
import { BookOpen, Download, FileText, FolderOpen, HelpCircle, PenLine, Sparkles } from 'lucide-react';

interface HeaderProps {
  onExportPdf: () => void;
  onOpenDrafts: () => void;
  onOpenGuide: () => void;
  onOpenSamples: () => void;
  isExporting: boolean;
  totalPages: number;
}

export const Header: React.FC<HeaderProps> = ({
  onExportPdf,
  onOpenDrafts,
  onOpenGuide,
  onOpenSamples,
  isExporting,
  totalPages,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-700/10 dark:bg-amber-400/10 border border-amber-800/20 dark:border-amber-400/20 flex items-center justify-center text-amber-800 dark:text-amber-400 shadow-xs">
            <PenLine className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap">
                Scribbly Notes
              </span>
              <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-sm">
                Offline
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-line, unboxed) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-400">
          <button
            onClick={onOpenSamples}
            className="flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>Sample Notes</span>
          </button>

          <button
            onClick={onOpenDrafts}
            className="flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FolderOpen className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>Saved Drafts</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-stone-500" />
            <span>How it Works</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenDrafts}
            className="md:hidden p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
            title="Saved Drafts"
          >
            <FolderOpen className="w-5 h-5" />
          </button>

          <button
            onClick={onExportPdf}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 active:bg-amber-950 dark:bg-amber-700 dark:hover:bg-amber-600 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating PDF...' : `Export PDF (${totalPages} pgs)`}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
