import { NotebookSettings, PageDimension } from '../types';

/**
 * Draws realistic notebook paper onto a canvas context.
 */
export function renderPaper(
  ctx: CanvasRenderingContext2D,
  dimensions: PageDimension,
  settings: NotebookSettings,
  pageNumber: number,
  totalPages: number,
  linePitch: number
) {
  const { width, height } = dimensions;

  // 1. Base paper fill
  ctx.save();
  ctx.fillStyle = settings.paperTint || '#fbf8ee';
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle organic paper fiber noise (deterministic pattern)
  drawPaperGrain(ctx, width, height);

  // 3. Render specific paper rulings
  switch (settings.paperStyle) {
    case 'ruled':
      renderRuledPaper(ctx, width, height, settings, linePitch);
      break;
    case 'grid':
      renderGridPaper(ctx, width, height, settings, linePitch);
      break;
    case 'dotted':
      renderDottedPaper(ctx, width, height, settings, linePitch);
      break;
    case 'plain':
    default:
      // Plain paper has only paper texture and optional subtle margin line
      if (settings.showMarginLine) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(settings.marginX, 0);
        ctx.lineTo(settings.marginX, height);
        ctx.stroke();
      }
      break;
  }

  // 4. Subtle spine crease on left edge (representing notebook binding)
  const spineGradient = ctx.createLinearGradient(0, 0, 36, 0);
  spineGradient.addColorStop(0, 'rgba(0, 0, 0, 0.08)');
  spineGradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.03)');
  spineGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = spineGradient;
  ctx.fillRect(0, 0, 36, height);

  // Soft page border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

  // 5. Header area (Date & Subject) if enabled
  if (settings.showDateHeader) {
    renderHeaderInfo(ctx, width, settings);
  }

  // 6. Page number at footer if enabled
  if (settings.showPageNumbers) {
    renderPageNumber(ctx, width, height, pageNumber, totalPages, settings);
  }

  ctx.restore();
}

/**
 * Procedural subtle paper texture flecks
 */
function drawPaperGrain(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  // Very light vignette
  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.4,
    width / 2, height / 2, Math.max(width, height) * 0.7
  );
  vignette.addColorStop(0, 'rgba(255, 255, 255, 0)');
  vignette.addColorStop(1, 'rgba(160, 140, 110, 0.04)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

/**
 * Ruled notebook lines with header line and red vertical margin
 */
function renderRuledPaper(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: NotebookSettings,
  linePitch: number
) {
  ctx.save();

  const startY = settings.marginTop;
  const bottomLimit = height - settings.marginBottom;

  // Ruled horizontal lines
  ctx.strokeStyle = 'rgba(125, 155, 195, 0.45)'; // Soft notebook blue
  ctx.lineWidth = 1;

  // Draw top header boundary line (slightly darker or double)
  ctx.beginPath();
  ctx.moveTo(0, startY);
  ctx.lineTo(width, startY);
  ctx.stroke();

  // Subsequent horizontal lines
  for (let y = startY + linePitch; y <= bottomLimit; y += linePitch) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Vertical red margin line
  if (settings.showMarginLine) {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)'; // Soft crimson notebook margin
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(settings.marginX, 0);
    ctx.lineTo(settings.marginX, height);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Math / Engineering Grid Paper
 */
function renderGridPaper(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: NotebookSettings,
  linePitch: number
) {
  ctx.save();
  const gridSize = Math.max(18, Math.round(linePitch * 0.6));

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
  ctx.lineWidth = 0.75;

  // Horizontal lines
  ctx.beginPath();
  for (let y = gridSize; y < height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  // Vertical lines
  for (let x = gridSize; x < width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  ctx.stroke();

  // Left red margin
  if (settings.showMarginLine) {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(settings.marginX, 0);
    ctx.lineTo(settings.marginX, height);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Bullet Journal Dotted Paper
 */
function renderDottedPaper(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: NotebookSettings,
  linePitch: number
) {
  ctx.save();
  const dotSpacing = Math.max(18, Math.round(linePitch * 0.6));
  ctx.fillStyle = 'rgba(100, 116, 139, 0.42)';

  for (let y = dotSpacing; y < height - 10; y += dotSpacing) {
    for (let x = dotSpacing; x < width - 10; x += dotSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, 0.85, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Margin line
  if (settings.showMarginLine) {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(settings.marginX, 0);
    ctx.lineTo(settings.marginX, height);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Renders optional top header (Subject / Date)
 */
function renderHeaderInfo(
  ctx: CanvasRenderingContext2D,
  width: number,
  settings: NotebookSettings
) {
  ctx.save();
  ctx.font = '12px "Caveat Notes", cursive, sans-serif';
  ctx.fillStyle = 'rgba(75, 85, 99, 0.75)';

  const headerY = Math.max(28, settings.marginTop - 45);

  if (settings.headerSubjectText) {
    ctx.textAlign = 'left';
    ctx.fillText(settings.headerSubjectText, settings.marginX + 8, headerY);
  }

  if (settings.headerDateText) {
    ctx.textAlign = 'right';
    ctx.fillText(settings.headerDateText, width - settings.marginX, headerY);
  }

  ctx.restore();
}

/**
 * Renders page number at footer
 */
function renderPageNumber(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pageNumber: number,
  totalPages: number,
  settings: NotebookSettings
) {
  ctx.save();
  ctx.font = '13px "Caveat Notes", cursive, sans-serif';
  ctx.fillStyle = 'rgba(107, 114, 128, 0.7)';
  ctx.textAlign = 'right';
  const label = totalPages > 1 ? `— ${pageNumber} of ${totalPages} —` : `— ${pageNumber} —`;
  ctx.fillText(label, width - settings.marginX, height - Math.max(22, settings.marginBottom * 0.4));
  ctx.restore();
}
