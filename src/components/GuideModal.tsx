import React from 'react';
import { BookOpen, CheckCircle, Cpu, Download, Layers, ShieldCheck, Sparkles, X } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              How Scribbly Notes Works
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          <div className="flex gap-3 items-start">
            <Cpu className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1">
                1. Natural Handwriting Simulation Engine
              </h4>
              <p>
                Unlike standard text renderers that print uniform, mechanical glyphs on a single rigid baseline, Scribbly Notes splits text into word tokens and executes micro-transformations using HTML5 Canvas. Each word undergoes subtle, deterministic rotational drift (±0.9°), vertical baseline jitter (±1.5px), pen pressure scale variations, and realistic ink opacity fading.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Layers className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1">
                2. Automatic Multi-Page Pagination
              </h4>
              <p>
                As you type longer notes, the pagination engine measures each rendered line against page boundaries. <strong>It strictly guarantees that no complete line is ever split between two pages.</strong> When a line reaches the bottom margin, it cleanly transitions onto the next page, preserving margins and paper ruling.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Download className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1">
                3. High-DPI Image & Vector PDF Export
              </h4>
              <p>
                Pages are rendered at 2.5x high resolution (equivalent to ~250–300 DPI print quality). You can download individual pages as crystal-clear PNG files or compile the entire multi-page notebook into a single standard PDF using client-side jsPDF.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <ShieldCheck className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-1">
                4. 100% Offline & Private
              </h4>
              <p>
                All handwriting font files (Classic Cursive, Neat Student, Casual Handwriting, Quick Notes) are bundled locally inside the project. Your notes are stored in your browser's localStorage and never transmitted to external servers.
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-900 dark:text-amber-300">
            <strong>Ethical Usage:</strong> Scribbly Notes is crafted for personal notes, aesthetic revision guides, and creative writing. Do not use this tool to simulate student handwriting for submitting coursework as manual work.
          </div>
        </div>

        <div className="p-4 bg-stone-50 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-md transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
