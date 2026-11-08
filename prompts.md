# Scribbly Notes — AI Development Prompts

This document records the architectural and development prompts used in the design, engineering, and verification of **Scribbly Notes**.

---

## Prompt 1: Initial Architecture & Technology Strategy
```
Design the architecture for "Scribbly Notes", a 100% offline-first handwritten notebook generator.
Key requirements:
1. Strict zero-network dependency for fonts, rendering, and exports.
2. Word-level HTML5 Canvas rendering engine with seeded natural variations (rotation, jitter, micro-scale).
3. Non-breaking multi-page pagination engine that prevents lines from ever being split between pages.
4. Ruled, Plain, Grid, and Dotted procedural paper styling.
5. High-DPI PNG and client-side multi-page PDF generation via bundled jsPDF.
```

## Prompt 2: Font Acquisition & Local Bundling
```
Download and locally bundle four high-quality open-source SIL Open Font License (OFL) handwriting fonts:
- Dancing Script -> Classic Cursive (flowing, inclined letters)
- Patrick Hand -> Neat Student (clear, rounded felt-pen handwriting)
- Indie Flower -> Casual Handwritten (relaxed, informal penmanship)
- Caveat -> Quick Notes (energetic, dynamic handwriting)
Declare local @font-face rules in src/index.css and ensure font loading verification via document.fonts.
```

## Prompt 3: Word-Level Natural Variation Engine
```
Implement a deterministic pseudo-random number generator (Mulberry32) in src/utils/random.ts.
Create the text tokenization and variation engine in src/utils/paginationEngine.ts:
- Sample word rotation angle from Gaussian distribution (max ~0.9 degrees scaled by intensity).
- Vertical baseline jitter (-1.5px to +1.5px).
- Pen pressure micro-scaling (0.97 to 1.03).
- Inter-word spacing irregularities and ink opacity variance.
- Support a "Regenerate handwriting" button to re-seed variations without changing note text.
```

## Prompt 4: Automatic Multi-Page Pagination with Zero Split-Line Guarantee
```
Implement page boundary calculation in src/utils/paginationEngine.ts:
- Measure words with canvas context measureText().
- Accumulate words on lines, wrapping cleanly.
- Calculate vertical baseline position based on linePitch (fontSize * lineSpacing).
- Before rendering any line, test whether currentBaselineY > bottomLimit.
- If it exceeds, move the ENTIRE line to pageNumber + 1. Never split a line between pages.
- Handle empty lines for paragraph separation.
```

## Prompt 5: Procedural Paper Renderer
```
Create src/utils/paperRenderer.ts:
- Render paper background color (Vintage Cream, Warm Ivory, Clean White, Legal Yellow).
- Draw subtle organic paper grain and left spine binding shadow.
- Render horizontal blue ruled lines matched to linePitch with red vertical margin line.
- Render 5mm math/engineering coordinate grid for grid paper.
- Render bullet-journal dot matrix for dotted paper.
- Render optional header (Topic & Date) and page numbers at the footer.
```

## Prompt 6: High-DPI Image & Vector PDF Export
```
Implement export routines in src/utils/exportUtils.ts:
- exportPageAsPng: render target page at 2.5x resolution to an offscreen canvas and download as Scribbly_Notes_Page_X.png.
- exportAllPagesAsPng: batch export all pages with progress callback and sequential download dispatch.
- exportNotebookAsPdf: compile multi-page PDF matching exact paper dimensions (A4 portrait/landscape or US Letter) using client-side jsPDF.
```

## Prompt 7: UI & Workspace Orchestration
```
Build a warm, notebook-inspired interface:
- Top Bar Contract: Brand title, unboxed nav links, primary export CTA.
- Ethical usage banner ("Created for personal notes and revision. Do not submit generated pages as handwritten schoolwork.").
- Left panel: Note editor, live word/char counters, sample templates, and fine customization controls.
- Right panel: Interactive notebook canvas viewport with zoom controls, page navigation, and quick export bar.
- LocalStorage draft saving, auto-saving, and load modal.
```
