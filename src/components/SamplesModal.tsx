import React from 'react';
import { BookOpen, Sparkles, X } from 'lucide-react';
import { SAMPLE_NOTES } from '../utils/constants';

interface SamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (content: string, title: string) => void;
}

export const SamplesModal: React.FC<SamplesModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            <div>
              <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                Sample Note Templates
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Choose a pre-written template to instantly test pagination and styling.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {SAMPLE_NOTES.map((sample, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850 hover:border-amber-700/60 transition-all cursor-pointer group"
              onClick={() => {
                onSelectSample(sample.content, sample.title);
                onClose();
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono text-amber-800 dark:text-amber-400 font-medium">
                  {sample.category}
                </span>
                <span className="text-xs text-amber-700 font-medium group-hover:translate-x-0.5 transition-transform">
                  Load Template →
                </span>
              </div>
              <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {sample.title}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-3 mt-1.5 font-serif leading-relaxed">
                {sample.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
