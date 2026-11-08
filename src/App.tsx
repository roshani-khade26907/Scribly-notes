/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_SETTINGS,
  PAGE_DIMENSIONS,
  SAMPLE_NOTES
} from './utils/constants';
import { NotebookSettings, PageData, SavedDraft } from './types';
import { paginateText } from './utils/paginationEngine';
import {
  exportAllPagesAsPng,
  exportNotebookAsPdf,
  exportPageAsPng
} from './utils/exportUtils';
import {
  deleteDraft,
  getAutoSavedContent,
  getSavedDrafts,
  getSavedSettings,
  saveDraft,
  saveSettings,
  setAutoSavedContent
} from './utils/storage';
import { enhanceNotesContent } from './services/aiService';
import { Header } from './components/Header';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { EditorPanel } from './components/EditorPanel';
import { CustomizationControls } from './components/CustomizationControls';
import { NotebookPreview } from './components/NotebookPreview';
import { DraftsModal } from './components/DraftsModal';
import { SamplesModal } from './components/SamplesModal';
import { GuideModal } from './components/GuideModal';
import { ExportModal } from './components/ExportModal';
import { Edit3, Eye, Sliders, Check } from 'lucide-react';

export default function App() {
  // 1. Initial State from Storage
  const [content, setContent] = useState<string>(() => {
    const saved = getAutoSavedContent();
    return saved?.content || SAMPLE_NOTES[0].content;
  });

  const [settings, setSettings] = useState<NotebookSettings>(() => {
    const saved = getAutoSavedContent();
    if (saved?.settings) {
      return saved.settings;
    }
    return getSavedSettings();
  });

  const [headerSubject, setHeaderSubject] = useState<string>(settings.headerSubjectText || 'Topic: Biology Revision - Cellular Respiration');
  const [headerDate, setHeaderDate] = useState<string>(settings.headerDateText || 'Date: ____________');

  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [drafts, setDrafts] = useState<SavedDraft[]>(() => getSavedDrafts());

  // UI Modals & State
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [isSamplesOpen, setIsSamplesOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<{
    type: 'pdf' | 'png-batch';
    current: number;
    total: number;
  } | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mobile / Small-screen view tab: 'editor' | 'styles' | 'preview'
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'styles' | 'preview'>('editor');

  // Left sidebar active tab on desktop: 'editor' | 'styles'
  const [desktopLeftTab, setDesktopLeftTab] = useState<'editor' | 'styles'>('editor');

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // Sync header texts into settings
  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      headerSubjectText: headerSubject,
      headerDateText: headerDate,
    }));
  }, [headerSubject, headerDate]);

  // 2. Multi-page Pagination (Computed and debounced)
  const [pages, setPages] = useState<PageData[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const computedPages = paginateText(content, settings);
      setPages(computedPages);

      // Clamp currentPageIndex if pages shrunk
      if (currentPageIndex >= computedPages.length) {
        setCurrentPageIndex(Math.max(0, computedPages.length - 1));
      }

      // Auto-save
      setAutoSavedContent(content, settings);
      saveSettings(settings);
    }, 120);

    return () => clearTimeout(timer);
  }, [content, settings]);

  const totalPages = Math.max(1, pages.length);

  // 3. Export Handlers
  const handleExportCurrentPagePng = async () => {
    try {
      setIsExporting(true);
      const targetPage = pages[currentPageIndex] || pages[0];
      await exportPageAsPng(targetPage, settings, totalPages);
      showToast(`Page ${targetPage.pageNumber} exported as PNG`);
    } catch (err) {
      console.error(err);
      showToast('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAllPagesPng = async () => {
    try {
      setIsExporting(true);
      setExportProgress({ type: 'png-batch', current: 1, total: totalPages });
      await exportAllPagesAsPng(pages, settings, (current, total) => {
        setExportProgress({ type: 'png-batch', current, total });
      });
      showToast(`All ${totalPages} pages exported successfully`);
    } catch (err) {
      console.error(err);
      showToast('Batch PNG export failed.');
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      setExportProgress({ type: 'pdf', current: 1, total: totalPages });
      await exportNotebookAsPdf(pages, settings, (current, total) => {
        setExportProgress({ type: 'pdf', current, total });
      });
      showToast(`Complete ${totalPages}-page notebook exported as PDF`);
    } catch (err) {
      console.error(err);
      showToast('PDF compilation failed.');
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // 4. Customization & Variation Handlers
  const handleRegenerateVariations = () => {
    const newSeed = Math.floor(Math.random() * 1000000) + 1;
    setSettings((prev) => ({ ...prev, seed: newSeed }));
    showToast('Handwriting natural variation re-randomized');
  };

  const handleResetSettings = () => {
    if (window.confirm('Reset all customization settings (styles, ink, margins) to default values?')) {
      setSettings(DEFAULT_SETTINGS);
      setHeaderSubject(DEFAULT_SETTINGS.headerSubjectText);
      setHeaderDate(DEFAULT_SETTINGS.headerDateText);
      showToast('Settings reset to defaults');
    }
  };

  // 5. AI Notes Enhancer
  const handleEnhanceNotes = async (mode: 'study-guide' | 'summary' | 'bulletize') => {
    try {
      setIsEnhancing(true);
      const structured = await enhanceNotesContent(content, mode);
      setContent(structured);
      showToast('Notes structured successfully!');
    } catch (err) {
      console.error(err);
      showToast('Could not enhance notes.');
    } finally {
      setIsEnhancing(false);
    }
  };

  // 6. Draft Management Handlers
  const handleSaveDraft = (title: string) => {
    const newDraft = saveDraft(title, content, settings);
    setDrafts(getSavedDrafts());
    showToast(`Draft "${newDraft.title}" saved`);
  };

  const handleLoadDraft = (draft: SavedDraft) => {
    if (content.trim() && content !== draft.content) {
      if (!window.confirm(`Load draft "${draft.title}"? Your unsaved edits in the editor will be replaced.`)) {
        return;
      }
    }
    setContent(draft.content);
    if (draft.settings) {
      setSettings(draft.settings);
      if (draft.settings.headerSubjectText) setHeaderSubject(draft.settings.headerSubjectText);
      if (draft.settings.headerDateText) setHeaderDate(draft.settings.headerDateText);
    }
    setIsDraftsOpen(false);
    showToast(`Loaded draft: ${draft.title}`);
  };

  const handleDeleteDraft = (id: string) => {
    const updated = deleteDraft(id);
    setDrafts(updated);
    showToast('Draft deleted');
  };

  const handleSelectSample = (sampleContent: string, sampleTitle: string) => {
    setContent(sampleContent);
    setHeaderSubject(`Topic: ${sampleTitle}`);
    setHeaderDate(`Date: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);
    showToast(`Loaded template: ${sampleTitle}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans">
      {/* Top Header */}
      <Header
        onExportPdf={handleExportPdf}
        onOpenDrafts={() => setIsDraftsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSamples={() => setIsSamplesOpen(true)}
        isExporting={isExporting}
        totalPages={totalPages}
      />

      {/* Mandatory Ethical Usage Notice */}
      <DisclaimerBanner />

      {/* Mobile Navigation Tabs (visible only on small screens) */}
      <div className="md:hidden flex items-center justify-around bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 py-1.5 px-2">
        <button
          onClick={() => setActiveMobileTab('editor')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
            activeMobileTab === 'editor'
              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>

        <button
          onClick={() => setActiveMobileTab('styles')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
            activeMobileTab === 'styles'
              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Customize</span>
        </button>

        <button
          onClick={() => setActiveMobileTab('preview')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
            activeMobileTab === 'preview'
              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
              : 'text-stone-600 dark:text-stone-400'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview ({totalPages}p)</span>
        </button>
      </div>

      {/* Main 2-Panel Workspace */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Panel: Writing & Customization (Desktop Split) */}
        <div
          className={`w-full md:w-[480px] lg:w-[540px] xl:w-[580px] flex-col shrink-0 border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-y-auto ${
            activeMobileTab === 'preview' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Desktop Left Tab Switcher (Editor vs Styles) */}
          <div className="hidden md:flex items-center border-b border-stone-200 dark:border-stone-800 px-4 pt-3 pb-0 bg-stone-50/50 dark:bg-stone-900/50 gap-4">
            <button
              onClick={() => setDesktopLeftTab('editor')}
              className={`pb-2.5 text-xs font-semibold uppercase tracking-wider transition-colors relative cursor-pointer ${
                desktopLeftTab === 'editor'
                  ? 'text-amber-800 dark:text-amber-400 border-b-2 border-amber-800 dark:border-amber-400'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              Writing & Content
            </button>
            <button
              onClick={() => setDesktopLeftTab('styles')}
              className={`pb-2.5 text-xs font-semibold uppercase tracking-wider transition-colors relative cursor-pointer ${
                desktopLeftTab === 'styles'
                  ? 'text-amber-800 dark:text-amber-400 border-b-2 border-amber-800 dark:border-amber-400'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              Styles & Layout Controls
            </button>
          </div>

          {/* Left Panel Body Content */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Show Editor */}
            {((activeMobileTab === 'editor' && !window.matchMedia('(min-width: 768px)').matches) ||
              (desktopLeftTab === 'editor' && window.matchMedia('(min-width: 768px)').matches)) && (
              <EditorPanel
                content={content}
                onChangeContent={setContent}
                headerSubject={headerSubject}
                onChangeHeaderSubject={setHeaderSubject}
                headerDate={headerDate}
                onChangeHeaderDate={setHeaderDate}
                onSaveDraft={handleSaveDraft}
                onEnhanceNotes={handleEnhanceNotes}
                isEnhancing={isEnhancing}
                totalPages={totalPages}
              />
            )}

            {/* Show Customization Controls */}
            {((activeMobileTab === 'styles' && !window.matchMedia('(min-width: 768px)').matches) ||
              (desktopLeftTab === 'styles' && window.matchMedia('(min-width: 768px)').matches)) && (
              <CustomizationControls
                settings={settings}
                onChangeSettings={setSettings}
                onRegenerateVariations={handleRegenerateVariations}
                onResetSettings={handleResetSettings}
              />
            )}
          </div>
        </div>

        {/* Right Panel: Notebook Live Preview */}
        <div
          className={`flex-1 flex-col overflow-hidden ${
            activeMobileTab !== 'preview' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <NotebookPreview
            currentPageIndex={currentPageIndex}
            totalPages={totalPages}
            pages={pages}
            settings={settings}
            onChangePageIndex={setCurrentPageIndex}
            onExportCurrentPagePng={handleExportCurrentPagePng}
            onExportAllPagesPng={handleExportAllPagesPng}
            onExportPdf={handleExportPdf}
            onPrint={handlePrint}
            isExporting={isExporting}
          />
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <DraftsModal
        isOpen={isDraftsOpen}
        onClose={() => setIsDraftsOpen(false)}
        drafts={drafts}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={handleDeleteDraft}
      />

      <SamplesModal
        isOpen={isSamplesOpen}
        onClose={() => setIsSamplesOpen(false)}
        onSelectSample={handleSelectSample}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {exportProgress && (
        <ExportModal
          isOpen={true}
          type={exportProgress.type}
          currentPage={exportProgress.current}
          totalPages={exportProgress.total}
        />
      )}
    </div>
  );
}
