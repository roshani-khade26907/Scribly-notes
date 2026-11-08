import React, { useState } from 'react';
import { BookOpen, Eraser, Sparkles, Save, Check, Copy } from 'lucide-react';
import { SAMPLE_NOTES } from '../utils/constants';

interface EditorPanelProps {
  content: string;
  onChangeContent: (val: string) => void;
  headerSubject: string;
  onChangeHeaderSubject: (val: string) => void;
  headerDate: string;
  onChangeHeaderDate: (val: string) => void;
  onSaveDraft: (title: string) => void;
  onEnhanceNotes: (mode: 'study-guide' | 'summary' | 'bulletize') => void;
  isEnhancing: boolean;
  totalPages: number;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  content,
  onChangeContent,
  headerSubject,
  onChangeHeaderSubject,
  headerDate,
  onChangeHeaderDate,
  onSaveDraft,
  onEnhanceNotes,
  isEnhancing,
  totalPages,
}) => {
  const [draftTitle, setDraftTitle] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Stats calculation
  const trimmed = content.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = content.length;
  const paragraphCount = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;

  const handleSave = () => {
    onSaveDraft(draftTitle);
    setShowSaveInput(false);
    setDraftTitle('');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (!content.trim()) return;
    if (window.confirm('Are you sure you want to clear your current notes? This cannot be undone unless saved as a draft.')) {
      onChangeContent('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800">
      {/* Editor Header / Stats bar */}
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/70">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Note Editor
            </h2>
            {justSaved && (
              <span className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-medium animate-fade-in">
                <Check className="w-3.5 h-3.5" /> Saved to local drafts
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEnhanceNotes('study-guide')}
              disabled={isEnhancing || !content.trim()}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800/60 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
              title="Restructure into tidy study notes with bullet points"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEnhancing ? 'Formatting...' : 'Structure Study Notes'}</span>
            </button>

            <button
              onClick={handleCopy}
              disabled={!content.trim()}
              className="p-1.5 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 rounded-md hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors disabled:opacity-40"
              title="Copy text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleClear}
              disabled={!content.trim()}
              className="p-1.5 text-stone-500 hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors disabled:opacity-40"
              title="Clear note editor"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Metrics (Zero-Pill discipline: clean unboxed text with typographic separators) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-mono tabular-nums">
          <span>{wordCount} words</span>
          <span aria-hidden="true">·</span>
          <span>{charCount} characters</span>
          <span aria-hidden="true">·</span>
          <span>{paragraphCount} {paragraphCount === 1 ? 'paragraph' : 'paragraphs'}</span>
          <span aria-hidden="true">·</span>
          <span className="text-amber-800 dark:text-amber-400 font-medium">
            {totalPages} {totalPages === 1 ? 'page' : 'pages'} generated
          </span>
        </div>
      </div>

      {/* Header Fields (Topic and Date) */}
      <div className="px-4 py-2.5 bg-stone-100/50 dark:bg-stone-900/40 border-b border-stone-200/80 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div>
          <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
            Topic / Subject Header
          </label>
          <input
            type="text"
            value={headerSubject}
            onChange={(e) => onChangeHeaderSubject(e.target.value)}
            placeholder="e.g. Biology - Cell Metabolism"
            className="w-full px-2.5 py-1.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md text-stone-800 dark:text-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
            Date Header
          </label>
          <input
            type="text"
            value={headerDate}
            onChange={(e) => onChangeHeaderDate(e.target.value)}
            placeholder="e.g. Date: Nov 8, 2026"
            className="w-full px-2.5 py-1.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md text-stone-800 dark:text-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </div>
      </div>

      {/* Main Textarea */}
      <div className="flex-1 p-4 relative flex flex-col min-h-[280px]">
        <textarea
          value={content}
          onChange={(e) => onChangeContent(e.target.value)}
          placeholder="Start typing your notes here..."
          className="w-full flex-1 p-3 bg-stone-50/50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-100 text-sm leading-relaxed font-sans resize-none focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all placeholder:text-stone-400"
          spellCheck={true}
        />
      </div>

      {/* Save Draft Toolbar at bottom of editor */}
      <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
        {showSaveInput ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="Draft title (optional)"
              className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-600 text-stone-900 dark:text-stone-100"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') setShowSaveInput(false);
              }}
            />
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-xs font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-md transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setShowSaveInput(false)}
              className="px-2 py-1.5 text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setShowSaveInput(true)}
              disabled={!content.trim()}
              className="flex items-center gap-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 transition-colors disabled:opacity-40"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Note as Draft</span>
            </button>

            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              Autosaved locally
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
