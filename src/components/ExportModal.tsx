import React from 'react';
import { Loader2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  type: 'pdf' | 'png-batch';
  currentPage: number;
  totalPages: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  type,
  currentPage,
  totalPages,
}) => {
  if (!isOpen) return null;

  const percent = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 max-w-sm w-full text-center">
        <Loader2 className="w-8 h-8 text-amber-700 dark:text-amber-400 animate-spin mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1">
          {type === 'pdf' ? 'Compiling PDF Notebook...' : 'Generating Page Images...'}
        </h4>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4 font-mono tabular-nums">
          Rendering page {currentPage} of {totalPages} ({percent}%)
        </p>

        <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden mb-2">
          <div
            className="bg-amber-800 h-full transition-all duration-300 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-[11px] text-stone-400">
          High-resolution 300 DPI canvas rendering
        </span>
      </div>
    </div>
  );
};
