import React from 'react';
import { Clock, FileText, Trash2, X, ArrowRight } from 'lucide-react';
import { SavedDraft } from '../types';

interface DraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: SavedDraft[];
  onLoadDraft: (draft: SavedDraft) => void;
  onDeleteDraft: (id: string) => void;
}

export const DraftsModal: React.FC<DraftsModalProps> = ({
  isOpen,
  onClose,
  drafts,
  onLoadDraft,
  onDeleteDraft,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              Saved Notebook Drafts
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Stored 100% locally in your browser storage.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drafts List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {drafts.length === 0 ? (
            <div className="text-center py-12 text-stone-500 dark:text-stone-400">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-30 text-amber-700" />
              <p className="text-sm font-medium">No saved drafts yet</p>
              <p className="text-xs mt-1">
                Click "Save Note as Draft" in the editor toolbar to store your notes.
              </p>
            </div>
          ) : (
            drafts.map((draft) => (
              <div
                key={draft.id}
                className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:border-amber-600/40 dark:hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                    {draft.title}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-1 font-serif">
                    {draft.content || '(Empty draft)'}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(draft.updatedAt).toLocaleDateString()} {new Date(draft.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>·</span>
                    <span>{draft.wordCount} words</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onLoadDraft(draft)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-md transition-colors cursor-pointer"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteDraft(draft.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    title="Delete draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
