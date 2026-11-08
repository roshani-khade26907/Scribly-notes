import { jsPDF } from 'jspdf';
import { NotebookSettings, PageData } from '../types';
import { PAGE_DIMENSIONS } from './constants';
import { renderPageToDataUrl } from './canvasRenderer';

/**
 * Downloads a blob as a file in the browser
 */
export function downloadFile(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports a single page as a high-resolution PNG image.
 */
export async function exportPageAsPng(
  pageData: PageData,
  settings: NotebookSettings,
  totalPages: number
): Promise<void> {
  const dataUrl = await renderPageToDataUrl(pageData, settings, totalPages, 2.5);
  const filename = `Scribbly_Notes_Page_${pageData.pageNumber}.png`;
  downloadFile(dataUrl, filename);
}

/**
 * Exports all notebook pages individually as PNG images.
 */
export async function exportAllPagesAsPng(
  allPages: PageData[],
  settings: NotebookSettings,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  for (let i = 0; i < allPages.length; i++) {
    const page = allPages[i];
    if (onProgress) {
      onProgress(i + 1, allPages.length);
    }
    const dataUrl = await renderPageToDataUrl(page, settings, allPages.length, 2.5);
    const filename = `Scribbly_Notes_Page_${page.pageNumber}.png`;
    downloadFile(dataUrl, filename);

    // Minor pause so browser doesn't throttle rapid sequential file triggers
    await new Promise(resolve => setTimeout(resolve, 350));
  }
}

/**
 * Exports the complete multi-page notebook as a single print-quality PDF.
 */
export async function exportNotebookAsPdf(
  allPages: PageData[],
  settings: NotebookSettings,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const dim = PAGE_DIMENSIONS[settings.pageSize] || PAGE_DIMENSIONS['a4-portrait'];
  const isLandscape = settings.pageSize === 'a4-landscape';

  const orientation = isLandscape ? 'l' : 'p';
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: [dim.mmWidth, dim.mmHeight],
    compress: true
  });

  for (let i = 0; i < allPages.length; i++) {
    const page = allPages[i];
    if (onProgress) {
      onProgress(i + 1, allPages.length);
    }

    if (i > 0) {
      pdf.addPage([dim.mmWidth, dim.mmHeight], orientation);
    }

    // High resolution render (2.5x) for clean vector-like print quality
    const imgData = await renderPageToDataUrl(page, settings, allPages.length, 2.5);
    pdf.addImage(imgData, 'PNG', 0, 0, dim.mmWidth, dim.mmHeight, undefined, 'FAST');
  }

  pdf.save('Scribbly_Notes.pdf');
}
