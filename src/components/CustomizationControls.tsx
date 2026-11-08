import React from 'react';
import {
  AlignLeft,
  Dices,
  Maximize2,
  Palette,
  RotateCcw,
  Sliders,
  Type,
  FileCheck2,
  ChevronDown
} from 'lucide-react';
import {
  DEFAULT_SETTINGS,
  HANDWRITING_STYLES,
  INK_COLORS,
  PAGE_DIMENSIONS,
  PAPER_TINTS
} from '../utils/constants';
import { HandwritingStyle, NotebookSettings, PageSize, PaperStyle } from '../types';

interface CustomizationControlsProps {
  settings: NotebookSettings;
  onChangeSettings: (newSettings: NotebookSettings) => void;
  onRegenerateVariations: () => void;
  onResetSettings: () => void;
}

export const CustomizationControls: React.FC<CustomizationControlsProps> = ({
  settings,
  onChangeSettings,
  onRegenerateVariations,
  onResetSettings,
}) => {
  const update = (patch: Partial<NotebookSettings>) => {
    onChangeSettings({ ...settings, ...patch });
  };

  return (
    <div className="space-y-6 p-4 sm:p-5 text-sm">
      {/* 1. Handwriting Style Selector */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Handwriting Style</span>
          </label>
          <span className="text-[11px] text-stone-500 font-mono">3+ Bundled Fonts</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {HANDWRITING_STYLES.map((style) => {
            const isSelected = settings.style === style.id;
            return (
              <button
                key={style.id}
                onClick={() => update({ style: style.id })}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'border-amber-700 bg-amber-50/60 dark:bg-amber-950/40 dark:border-amber-500 shadow-xs ring-1 ring-amber-700 dark:ring-amber-500'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div
                  className="text-2xl leading-none mb-1.5 text-stone-900 dark:text-stone-100 truncate"
                  style={{ fontFamily: style.fontFamily }}
                >
                  {style.name}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-sans truncate">
                  {style.tag}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Ink Colour Selector */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Ink Colour</span>
          </label>
          <span className="text-[11px] text-stone-500 font-mono uppercase">{settings.inkColor}</span>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {INK_COLORS.map((ink) => {
            const isSelected = settings.inkColor.toLowerCase() === ink.color.toLowerCase();
            return (
              <button
                key={ink.id}
                onClick={() => update({ inkColor: ink.color })}
                title={`${ink.name} (${ink.description})`}
                className={`w-8 h-8 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                  isSelected ? 'scale-110 ring-2 ring-offset-2 ring-stone-800 dark:ring-stone-200' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: ink.color }}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white shadow-xs" />
                )}
              </button>
            );
          })}

          {/* Custom Colour Picker */}
          <div className="relative flex items-center">
            <label
              htmlFor="custom-ink-color"
              className="w-8 h-8 rounded-full border border-stone-300 dark:border-stone-700 flex items-center justify-center bg-conic hover:opacity-90 cursor-pointer shadow-xs"
              title="Custom Ink Color Picker"
              style={{
                background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
              }}
            >
              <input
                id="custom-ink-color"
                type="color"
                value={settings.inkColor}
                onChange={(e) => update({ inkColor: e.target.value })}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
            </label>
          </div>
        </div>
      </section>

      {/* 3. Paper Style & Tint */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Notebook Paper Style</span>
          </label>
        </div>

        {/* Paper Ruling Types */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            { id: 'ruled' as PaperStyle, label: 'Ruled', desc: 'Notebook lines' },
            { id: 'plain' as PaperStyle, label: 'Plain', desc: 'Clean paper' },
            { id: 'grid' as PaperStyle, label: 'Grid', desc: '5mm squares' },
            { id: 'dotted' as PaperStyle, label: 'Dotted', desc: 'Bullet journal' },
          ].map((paper) => {
            const isSelected = settings.paperStyle === paper.id;
            return (
              <button
                key={paper.id}
                onClick={() => update({ paperStyle: paper.id })}
                className={`py-2 px-1 text-center rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-700 bg-amber-50/70 dark:bg-amber-950/40 dark:border-amber-500 font-semibold text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                }`}
              >
                <div className="text-xs">{paper.label}</div>
              </button>
            );
          })}
        </div>

        {/* Paper Tints */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] text-stone-500 dark:text-stone-400">Sheet Tint:</span>
          <div className="flex items-center gap-2">
            {PAPER_TINTS.map((tint) => (
              <button
                key={tint.id}
                onClick={() => update({ paperTint: tint.color })}
                title={tint.name}
                className={`w-6 h-6 rounded-md border transition-all ${
                  settings.paperTint === tint.color ? 'ring-2 ring-amber-700 dark:ring-amber-400 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: tint.color, borderColor: tint.border }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Natural Variation Engine & Seed Randomizer */}
      <section className="bg-amber-50/60 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200/70 dark:border-amber-800/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
            <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
              Natural Variation Intensity
            </span>
          </div>
          <span className="text-xs font-mono text-stone-600 dark:text-stone-300">
            {Math.round(settings.variationIntensity * 100)}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={settings.variationIntensity}
          onChange={(e) => update({ variationIntensity: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-amber-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-800"
        />

        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-amber-200/50 dark:border-amber-800/40">
          <span className="text-[11px] text-stone-600 dark:text-stone-400">
            Jitter, angle drift & scale
          </span>

          <button
            onClick={onRegenerateVariations}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-900 dark:text-amber-300 bg-white dark:bg-stone-800 hover:bg-amber-100/60 dark:hover:bg-stone-700 border border-amber-300/80 dark:border-amber-700/60 rounded-md shadow-2xs transition-colors cursor-pointer"
            title="Generate a fresh natural arrangement without altering the text"
          >
            <Dices className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Regenerate handwriting</span>
          </button>
        </div>
      </section>

      {/* 5. Typography & Page Layout Adjustments */}
      <section className="space-y-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 block">
          Fine Typography & Page Settings
        </label>

        {/* Font Size */}
        <div>
          <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
            <span>Font Size</span>
            <span className="font-mono">{settings.fontSize}px</span>
          </div>
          <input
            type="range"
            min="16"
            max="36"
            step="1"
            value={settings.fontSize}
            onChange={(e) => update({ fontSize: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-800 dark:accent-stone-200"
          />
        </div>

        {/* Line Spacing */}
        <div>
          <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
            <span>Line Spacing</span>
            <span className="font-mono">{settings.lineSpacing.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="1.3"
            max="2.5"
            step="0.05"
            value={settings.lineSpacing}
            onChange={(e) => update({ lineSpacing: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-800 dark:accent-stone-200"
          />
        </div>

        {/* Word Spacing */}
        <div>
          <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
            <span>Word Spacing</span>
            <span className="font-mono">{settings.wordSpacing > 0 ? `+${settings.wordSpacing}` : settings.wordSpacing}px</span>
          </div>
          <input
            type="range"
            min="-3"
            max="12"
            step="1"
            value={settings.wordSpacing}
            onChange={(e) => update({ wordSpacing: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-800 dark:accent-stone-200"
          />
        </div>

        {/* Margins */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
              <span>Left/Right Margin</span>
              <span className="font-mono">{settings.marginX}px</span>
            </div>
            <input
              type="range"
              min="40"
              max="130"
              step="5"
              value={settings.marginX}
              onChange={(e) => update({ marginX: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-800 dark:accent-stone-200"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1">
              <span>Top/Bottom Margin</span>
              <span className="font-mono">{settings.marginTop}px</span>
            </div>
            <input
              type="range"
              min="50"
              max="140"
              step="5"
              value={settings.marginTop}
              onChange={(e) => update({ marginTop: parseInt(e.target.value, 10), marginBottom: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-800 dark:accent-stone-200"
            />
          </div>
        </div>

        {/* Page Size */}
        <div>
          <label className="block text-xs text-stone-600 dark:text-stone-400 mb-1.5">
            Page Dimension & Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['a4-portrait', 'a4-landscape', 'letter-portrait'] as PageSize[]).map((pSize) => {
              const dim = PAGE_DIMENSIONS[pSize];
              const isSelected = settings.pageSize === pSize;
              return (
                <button
                  key={pSize}
                  onClick={() => update({ pageSize: pSize })}
                  className={`py-2 px-1 text-center rounded-lg border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-700 bg-amber-50/60 dark:bg-amber-950/40 dark:border-amber-500 font-medium text-stone-900 dark:text-stone-100 shadow-xs'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                  }`}
                >
                  <div>{dim.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggles */}
        <div className="pt-2 space-y-2 border-t border-stone-200 dark:border-stone-800 text-xs">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-stone-700 dark:text-stone-300">Show Red Left Margin Line</span>
            <input
              type="checkbox"
              checked={settings.showMarginLine}
              onChange={(e) => update({ showMarginLine: e.target.checked })}
              className="w-4 h-4 accent-amber-800 rounded"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-stone-700 dark:text-stone-300">Show Page Numbers</span>
            <input
              type="checkbox"
              checked={settings.showPageNumbers}
              onChange={(e) => update({ showPageNumbers: e.target.checked })}
              className="w-4 h-4 accent-amber-800 rounded"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-stone-700 dark:text-stone-300">Show Header (Subject & Date)</span>
            <input
              type="checkbox"
              checked={settings.showDateHeader}
              onChange={(e) => update({ showDateHeader: e.target.checked })}
              className="w-4 h-4 accent-amber-800 rounded"
            />
          </label>
        </div>
      </section>

      {/* Reset Options */}
      <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
        <button
          onClick={onResetSettings}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Customization Settings to Defaults</span>
        </button>
      </div>
    </div>
  );
};
