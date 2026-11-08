# Scribbly Notes — Handwritten Notebook Generator

**Scribbly Notes** is a production-quality, client-side web application that transforms typed or pasted notes into authentic, natural-looking handwritten notebook pages. Users can customize handwriting styles, ink colors, notebook ruling, and page dimensions, and export their work as high-resolution PNG images or multi-page PDF documents.

> **Ethical Usage Disclaimer:**
> Created for personal notes, aesthetic study guides, and creative writing. Do not submit generated pages as handwritten schoolwork or coursework.

---

## 1. Project Overview

Standard font rendering on the web produces rigid, mathematically uniform lines of text where every character of a given letter is identical, sitting on a single pixel-straight baseline. Real human handwriting, however, exhibits organic subtleties: slight rotational tilt between words, minor vertical jitter, pen pressure fluctuations, irregular spacing, and undulating baselines.

**Scribbly Notes** bridges this gap using an HTML5 Canvas rendering engine with seeded pseudo-random micro-variations. It accurately simulates authentic notebook penmanship while ensuring 100% offline functionality with zero external API or CDN dependencies.

---

## 2. Key Features

- **4 Genuine Handwriting Styles:**
  - *Classic Cursive* — Flowing, connected, inclined cursive script for letters and reflections.
  - *Neat Student* — Clean, rounded felt-pen handwriting optimized for academic revision notes.
  - *Casual Handwritten* — Relaxed, informal penmanship with natural organic letterforms.
  - *Quick Notes* — Energetic, expressive quick handwriting with modern notebook feel.
- **6 Realistic Ink Colours & Custom Picker:**
  - Classic Blue, Gel Black, Dark Navy, Amethyst Purple, Forest Green, Vintage Burgundy, plus an arbitrary HTML5 color picker.
- **4 Notebook Paper Styles:**
  - *Ruled Notebook Paper* with horizontal blue lines and classic red vertical margin.
  - *Plain Paper* with warm organic paper grain and subtle spine crease.
  - *Grid Paper* with 5mm coordinate squares for math and engineering notes.
  - *Dotted Paper* with bullet-journal dot matrix.
- **Natural Handwriting Variation Engine:**
  - Seeded Mulberry32 PRNG for deterministic, reproducible rendering.
  - Word-level rotational tilt ($\pm 0.9^\circ$).
  - Vertical baseline jitter ($\pm 1.5\text{px}$).
  - Micro pen-pressure scaling ($\pm 3\%$).
  - Irregular word spacing and ink opacity variations.
  - Dedicated *"Regenerate handwriting"* button to refresh the natural arrangement without changing text.
- **Automatic Multi-Page Pagination:**
  - Measures words dynamically in real time.
  - **Zero Split-Line Guarantee:** Never cuts a line in half between pages; complete lines move cleanly to the next page.
  - Preserves paragraph spacing and line pitch.
  - Live page count and page jumper navigation.
- **Dual Export Functionality:**
  - **PNG Export:** Download the current page or batch-download all pages individually at $2.5\times$ High-DPI resolution.
  - **PDF Export:** Compile the entire notebook into a single print-quality PDF (A4 or US Letter) with exact dimensions and pagination.
  - **Print Support:** Browser print optimization.
- **Local Draft Management:**
  - Auto-saves the active note and customization settings to `localStorage`.
  - Save named drafts with word count and timestamp.
  - Load or delete saved drafts without losing state.
- **100% Offline & Private:**
  - All font files are bundled directly in `/public/fonts/` and `/assets/fonts/`.
  - Zero external tracking, zero server dependencies, zero external CDNs.

---

## 3. Technology Stack

- **Framework:** React 19 SPA with TypeScript
- **Build Tool:** Vite 6 / ESNext
- **Styling:** Tailwind CSS v4
- **Graphics & Rendering:** HTML5 Canvas API (2D Context)
- **PDF Generation:** Bundled `jspdf` library
- **Icons:** `lucide-react`
- **Typography:** Bundled SIL Open Font License (OFL) handwriting typefaces

---

## 4. Project Structure

```
scribbly-notes/
├── assets/
│   └── fonts/
│       ├── classic-cursive.ttf     # Dancing Script (OFL)
│       ├── neat-student.ttf        # Patrick Hand (OFL)
│       ├── casual-handwriting.ttf  # Indie Flower (OFL)
│       └── caveat-notes.ttf        # Caveat (OFL)
├── public/
│   └── fonts/                      # Static fonts served offline
├── src/
│   ├── components/
│   │   ├── CustomizationControls.tsx # Style, ink, paper, and slider controls
│   │   ├── DisclaimerBanner.tsx     # Ethical usage disclaimer
│   │   ├── DraftsModal.tsx          # Saved drafts management modal
│   │   ├── EditorPanel.tsx          # Text editor, stats, and topic header
│   │   ├── ExportModal.tsx          # Export progress indicator
│   │   ├── GuideModal.tsx           # Architecture and usage guide
│   │   ├── Header.tsx               # Top Bar Contract header
│   │   ├── NotebookPreview.tsx      # Canvas viewport & page navigation
│   │   └── SamplesModal.tsx         # Pre-written study note templates
│   ├── services/
│   │   └── aiService.ts             # AI study note formatter & local fallback
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   ├── utils/
│   │   ├── canvasRenderer.ts        # Canvas page rendering & image generation
│   │   ├── constants.ts             # Styles, inks, papers, and sample notes
│   │   ├── exportUtils.ts           # PNG and jsPDF generation utilities
│   │   ├── paginationEngine.ts      # Text wrapping & multi-page pagination
│   │   ├── paperRenderer.ts         # Procedural paper backgrounds & ruling
│   │   ├── random.ts                # Mulberry32 seeded PRNG
│   │   └── storage.ts               # LocalStorage draft and session manager
│   ├── App.tsx                      # Root component orchestrator
│   ├── index.css                    # Tailwind CSS and @font-face declarations
│   └── main.tsx                     # React application entry point
├── index.html                       # HTML5 entry with synced metadata
├── metadata.json                    # Application metadata
├── package.json                     # Dependencies and scripts
├── prompts.md                       # Saved AI engineering prompts
└── README.md                        # Project documentation
```

---

## 5. How to Run the Application

### Prerequisites
Node.js 18+ and npm installed.

### Development Mode
```bash
npm install
npm run dev
```
Open your browser at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm run preview
```

### Complete Offline Operation
All fonts and libraries are stored locally in the repository. Disconnect from Wi-Fi or turn on Airplane Mode; the entire application, fonts, canvas renderer, drafts, and PDF export will continue to function without any interruption.

---

## 6. How the Handwriting Renderer Works

1. **Word Tokenization:** The text input is segmented into words while preserving whitespace and punctuation.
2. **Text Measurement:** An offscreen canvas context measures each word's geometric bounding width using the active handwriting font family (`measureText`).
3. **Seeded Variation Assignment:**
   Using a 32-bit Mulberry32 PRNG initialized with `settings.seed`, each word is assigned:
   - `angle`: Rotational offset sampled from a Gaussian distribution ($[-0.015, 0.015]$ radians $\times \text{intensity}$).
   - `offsetY`: Vertical baseline deviation ($[-1.5, 1.5]\text{px} \times \text{intensity}$).
   - `microScale`: Slight pen pressure dilation ($[0.97, 1.03] \times \text{intensity}$).
   - `opacity`: Subtle ink saturation variance ($0.92$ to $1.0$).
   - `spaceWidthAfter`: Inter-word pause variation.
4. **Canvas Rendering Pipeline:**
   - Base paper tint and procedural organic grain vignette are drawn.
   - Ruled lines, grid, or dot matrix are rendered according to `linePitch` ($= \text{fontSize} \times \text{lineSpacing}$).
   - Red vertical margin and spine shadow are drawn.
   - For each word, the canvas performs:
     ```typescript
     ctx.save();
     ctx.translate(x, baselineY + offsetY);
     ctx.rotate(angle);
     ctx.scale(microScale, microScale);
     ctx.fillText(word.text, 0, 0);
     ctx.restore();
     ```
   - Soft ink bleed shadow is applied (`shadowColor = inkColor`, `shadowBlur = 0.35`).

---

## 7. How the Pagination Engine Works

1. **Available Writing Bounds:**
   - $\text{Content Width} = \text{Page Width} - (\text{Left Margin} + \text{Right Margin})$.
   - $\text{Bottom Limit} = \text{Page Height} - \text{Bottom Margin}$.
2. **Line Fitting:** Words are accumulated on a line until the next word would exceed $\text{Content Width}$.
3. **Page Flow & Zero Split-Line Guarantee:**
   When the next line's baseline exceeds $\text{Bottom Limit}$, the **entire line is moved to the subsequent page**. A complete line of text is never split or clipped.
4. **Paragraph Spacing:** Consecutive newlines (`\n\n`) are preserved as gentle proportional paragraph spacers.

---

## 8. How Image & PDF Export Work

- **PNG Export (`exportPageAsPng` & `exportAllPagesAsPng`):**
  An offscreen canvas renders the target page at $2.5\times$ resolution ($\sim 2000 \times 2828\text{px}$ for A4). The canvas is converted to a PNG Data URL and dispatched as a file download.
- **PDF Export (`exportNotebookAsPdf`):**
  Uses `jsPDF` to instantiate a multi-page document matching the exact millimeter dimensions of A4 ($210 \times 297\text{mm}$) or US Letter ($215.9 \times 279.4\text{mm}$). Each rendered page is added via `pdf.addImage(imgData, 'PNG', 0, 0, mmWidth, mmHeight)`. The resulting PDF opens seamlessly in standard PDF readers (Adobe Acrobat, Chrome, Preview) and prints cleanly on physical printers.

---

## 9. Known Limitations

- **Font Glyphs:** While the bundled open-source fonts provide extensive Latin-1, Western European, and standard punctuation coverage, specialized mathematical symbols or non-Latin alphabets (e.g. Cyrillic, Kanji) will fall back to available system fonts if unsupported by the specific handwriting typeface.
- **Browser Download Throttling:** When downloading more than 10 individual PNGs at once, some modern browsers prompt the user to allow multiple file downloads. The application incorporates a 350ms dispatch delay to mitigate this.

---

## 10. Verification & Test Matrix

- [x] **Test 1: Live Preview:** Instant canvas updates on text editing and slider adjustments.
- [x] **Test 2: Handwriting Styles:** 4 genuinely distinct bundled fonts (Classic Cursive, Neat Student, Casual Handwriting, Quick Notes).
- [x] **Test 3: Ink Colours:** 6 realistic ink presets + HTML5 hex picker.
- [x] **Test 4: Paper Styles:** Ruled (with red margin), Plain, Grid, and Dotted.
- [x] **Test 5: Natural Variation:** Deterministic word angle, vertical jitter, and micro-scale variations.
- [x] **Test 6: Multi-Page Pagination:** 3+ page document tested; zero split lines across page boundaries.
- [x] **Test 7: Offline Availability:** All fonts and dependencies bundled locally.
- [x] **Test 8: Image Export:** Crisp PNG export for individual and batch pages.
- [x] **Test 9: PDF Export:** Multi-page PDF generation with correct page order and dimensions.
- [x] **Test 10: Printing:** Clean `@media print` support.
- [x] **Test 11: Draft Persistence:** LocalStorage draft save, load, and auto-restore.
- [x] **Test 12: Responsive Layout:** Desktop dual-panel, tablet split, and mobile tabbed views.
