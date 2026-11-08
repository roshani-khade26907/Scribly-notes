import { LineData, NotebookSettings, PageData, WordToken } from '../types';
import { calculateLinePitch, getFontFamily } from './paginationEngine';
import { PAGE_DIMENSIONS } from './constants';
import { renderPaper } from './paperRenderer';

/**
 * Checks if the required handwriting font is loaded, and returns when ready.
 */
export async function ensureFontsLoaded(fontFamily: string): Promise<boolean> {
  try {
    if ('fonts' in document) {
      await document.fonts.load(`24px ${fontFamily}`);
      await document.fonts.ready;
      return true;
    }
  } catch (err) {
    console.warn('Font loading check error:', err);
  }
  return true;
}

/**
 * Renders a full notebook page to a Canvas element.
 * Scales by scaleFactor for razor-sharp rendering on High-DPI screens or print exports.
 */
export function renderNotebookPage(
  canvas: HTMLCanvasElement,
  pageData: PageData,
  settings: NotebookSettings,
  totalPages: number,
  scaleFactor = 2
) {
  const dimensions = PAGE_DIMENSIONS[settings.pageSize] || PAGE_DIMENSIONS['a4-portrait'];
  const { width, height } = dimensions;

  // Set internal resolution (High DPI)
  canvas.width = Math.round(width * scaleFactor);
  canvas.height = Math.round(height * scaleFactor);

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  // Scale context coordinates so all drawing matches base page dimensions
  ctx.save();
  ctx.scale(scaleFactor, scaleFactor);

  const linePitch = calculateLinePitch(settings);

  // 1. Draw Paper background (ruling, margins, header, page numbers)
  renderPaper(ctx, dimensions, settings, pageData.pageNumber, totalPages, linePitch);

  // 2. Setup text rendering style
  const fontFamily = getFontFamily(settings.style);
  ctx.font = `${settings.fontSize}px ${fontFamily}`;
  ctx.fillStyle = settings.inkColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Subtle ink bleed / fountain pen realism
  ctx.shadowColor = settings.inkColor;
  ctx.shadowBlur = 0.35;

  const leftMargin = settings.marginX + 8;

  // 3. Render words line by line with natural positioning
  for (let lIdx = 0; lIdx < pageData.lines.length; lIdx++) {
    const line: LineData = pageData.lines[lIdx];
    let currentX = leftMargin;

    for (let wIdx = 0; wIdx < line.words.length; wIdx++) {
      const word: WordToken = line.words[wIdx];
      if (!word.text) continue;

      ctx.save();

      // Word-level natural human variations
      const wordY = line.baselineY + (word.offsetY || 0);

      ctx.translate(currentX, wordY);

      if (word.angle) {
        ctx.rotate(word.angle);
      }

      if (word.microScale && word.microScale !== 1) {
        ctx.scale(word.microScale, word.microScale);
      }

      ctx.globalAlpha = word.opacity || 1;
      ctx.fillText(word.text, 0, 0);

      ctx.restore();

      // Advance X for next word
      currentX += word.width + word.spaceWidthAfter;
    }
  }

  ctx.restore();
}

/**
 * Creates an offscreen canvas and renders the specified page into a data URL.
 */
export async function renderPageToDataUrl(
  pageData: PageData,
  settings: NotebookSettings,
  totalPages: number,
  scaleFactor = 2
): Promise<string> {
  const canvas = document.createElement('canvas');
  const fontFamily = getFontFamily(settings.style);
  await ensureFontsLoaded(fontFamily);

  renderNotebookPage(canvas, pageData, settings, totalPages, scaleFactor);
  return canvas.toDataURL('image/png');
}

/**
 * Creates an offscreen canvas and converts to Blob.
 */
export async function renderPageToBlob(
  pageData: PageData,
  settings: NotebookSettings,
  totalPages: number,
  scaleFactor = 2
): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  const fontFamily = getFontFamily(settings.style);
  await ensureFontsLoaded(fontFamily);

  renderNotebookPage(canvas, pageData, settings, totalPages, scaleFactor);

  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/png');
  });
}
