import { HANDWRITING_STYLES, PAGE_DIMENSIONS } from './constants';
import { LineData, NotebookSettings, PageData, WordToken } from '../types';
import { createPRNG, seededGaussian, seededRandomRange } from './random';

/**
 * Calculates line pitch based on font size and line spacing multiplier.
 */
export function calculateLinePitch(settings: NotebookSettings): number {
  return Math.round(settings.fontSize * settings.lineSpacing);
}

/**
 * Resolves CSS font-family string from style id
 */
export function getFontFamily(styleId: string): string {
  const found = HANDWRITING_STYLES.find(s => s.id === styleId);
  return found ? found.fontFamily : "'Neat Student', cursive";
}

/**
 * Parses raw text, measures words using offscreen canvas context, applies natural variations,
 * and paginates into discrete pages.
 */
export function paginateText(
  text: string,
  settings: NotebookSettings,
  ctx?: CanvasRenderingContext2D
): PageData[] {
  const dimensions = PAGE_DIMENSIONS[settings.pageSize] || PAGE_DIMENSIONS['a4-portrait'];
  const { width: pageWidth, height: pageHeight } = dimensions;

  // Measurement context
  let measureCtx = ctx;
  if (!measureCtx) {
    const canvas = document.createElement('canvas');
    measureCtx = canvas.getContext('2d') || undefined;
  }
  if (!measureCtx) {
    return [{ pageNumber: 1, lines: [], totalWords: 0 }];
  }

  const fontFamily = getFontFamily(settings.style);
  measureCtx.font = `${settings.fontSize}px ${fontFamily}`;

  const linePitch = calculateLinePitch(settings);
  const leftMargin = settings.marginX + 8; // Small breathing room past red margin
  const rightMargin = settings.marginX;
  const availableWidth = Math.max(200, pageWidth - leftMargin - rightMargin);
  const topMargin = settings.marginTop;
  const bottomLimit = pageHeight - settings.marginBottom;

  // PRNG instance for deterministic organic handwriting variations
  const prng = createPRNG(settings.seed || 42);
  const intensity = Math.max(0, Math.min(1, settings.variationIntensity));

  // Base space measurement
  const baseSpaceWidth = measureCtx.measureText(' ').width + settings.wordSpacing;

  // Normalize text: handle line breaks, normalize tabs to spaces
  const cleanText = text.replace(/\t/g, '    ');
  const paragraphs = cleanText.split('\n');

  const allLines: { words: WordToken[]; isParagraphEnd: boolean }[] = [];
  let globalWordIndex = 0;

  for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
    const paragraph = paragraphs[pIdx];

    // If empty paragraph, represent as an empty spacer line
    if (paragraph.trim() === '') {
      allLines.push({ words: [], isParagraphEnd: true });
      continue;
    }

    // Split paragraph into words preserving punctuation
    const rawWords = paragraph.split(/ +/);
    let currentLineWords: WordToken[] = [];
    let currentLineWidth = 0;

    for (let wIdx = 0; wIdx < rawWords.length; wIdx++) {
      const rawWord = rawWords[wIdx];
      if (!rawWord) continue;

      globalWordIndex++;

      // Measure word width
      let wordWidth = measureCtx.measureText(rawWord).width;

      // Natural handwriting variations per word:
      // 1. Rotation: subtle angle tilt
      const maxAngle = 0.018 * intensity; // in radians (~1 degree max)
      const angle = seededGaussian(prng, 0, maxAngle * 0.5);

      // 2. Baseline vertical jitter: -1.2px to +1.2px
      const maxJitter = 1.6 * intensity;
      const offsetY = seededRandomRange(prng, -maxJitter, maxJitter);

      // 3. Micro scale: slight pen pressure scale 0.98 to 1.02
      const scaleVariation = 0.04 * intensity;
      const microScale = seededRandomRange(prng, 1 - scaleVariation, 1 + scaleVariation);

      // 4. Word spacing jitter: small natural pause variations
      const spaceJitter = seededRandomRange(prng, -1.2 * intensity, 2.0 * intensity);
      const spaceAfter = Math.max(3, baseSpaceWidth + spaceJitter);

      // Adjust word width accounting for microScale
      wordWidth = wordWidth * microScale;

      // Check if word fits on current line
      const neededWidth = currentLineWidth === 0 ? wordWidth : currentLineWidth + wordWidth;

      if (neededWidth > availableWidth && currentLineWords.length > 0) {
        // Wrap current line to next
        allLines.push({ words: currentLineWords, isParagraphEnd: false });
        currentLineWords = [];
        currentLineWidth = 0;
      }

      // If word itself is wider than available width (e.g. very long uninterrupted string)
      if (wordWidth > availableWidth && currentLineWords.length === 0) {
        // Break long word
        currentLineWords.push({
          text: rawWord,
          width: availableWidth,
          isWhitespace: false,
          angle: 0,
          offsetY: 0,
          microScale: 1,
          opacity: 1,
          spaceWidthAfter: spaceAfter
        });
        allLines.push({ words: currentLineWords, isParagraphEnd: false });
        currentLineWords = [];
        currentLineWidth = 0;
        continue;
      }

      // Add word to line
      currentLineWords.push({
        text: rawWord,
        width: wordWidth,
        isWhitespace: false,
        angle,
        offsetY,
        microScale,
        opacity: seededRandomRange(prng, 0.92, 1.0),
        spaceWidthAfter: spaceAfter
      });

      currentLineWidth += wordWidth + spaceAfter;
    }

    if (currentLineWords.length > 0) {
      allLines.push({ words: currentLineWords, isParagraphEnd: true });
    }
  }

  // --- Multi-Page Pagination ---
  // Flow lines onto pages without cutting any line in half.
  const pages: PageData[] = [];
  let currentPageNumber = 1;
  let currentLinesOnPage: LineData[] = [];
  let currentBaselineY = topMargin + linePitch - 4; // Baseline of first line sits comfortably on ruled line
  let pageWordCount = 0;

  for (let lIdx = 0; lIdx < allLines.length; lIdx++) {
    const lineItem = allLines[lIdx];
    const words = lineItem.words;

    // Check if line will fit on current page
    // Needs baselineY + descender headroom
    if (currentBaselineY > bottomLimit) {
      // Line cannot fit! Move entire line to next page
      pages.push({
        pageNumber: currentPageNumber,
        lines: currentLinesOnPage,
        totalWords: pageWordCount
      });
      currentPageNumber++;
      currentLinesOnPage = [];
      currentBaselineY = topMargin + linePitch - 4;
      pageWordCount = 0;
    }

    // Calculate line width
    let lineWidth = 0;
    words.forEach((w, idx) => {
      lineWidth += w.width + (idx < words.length - 1 ? w.spaceWidthAfter : 0);
    });

    currentLinesOnPage.push({
      words,
      baselineY: currentBaselineY,
      lineWidth,
      isParagraphEnd: lineItem.isParagraphEnd
    });

    pageWordCount += words.length;

    // Advance baseline for next line
    if (words.length === 0 && lineItem.isParagraphEnd) {
      // Empty spacer line
      currentBaselineY += linePitch * 0.7;
    } else {
      currentBaselineY += linePitch;
    }
  }

  // Push final page
  pages.push({
    pageNumber: currentPageNumber,
    lines: currentLinesOnPage,
    totalWords: pageWordCount
  });

  return pages.length > 0 ? pages : [{ pageNumber: 1, lines: [], totalWords: 0 }];
}
