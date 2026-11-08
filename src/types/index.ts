export type HandwritingStyle = 'classic-cursive' | 'neat-student' | 'casual-handwriting' | 'caveat-notes';

export type PaperStyle = 'ruled' | 'plain' | 'grid' | 'dotted';

export type PageSize = 'a4-portrait' | 'a4-landscape' | 'letter-portrait';

export interface PageDimension {
  width: number;
  height: number;
  name: string;
  unit: 'mm' | 'in';
  mmWidth: number;
  mmHeight: number;
}

export interface NotebookSettings {
  style: HandwritingStyle;
  paperStyle: PaperStyle;
  paperTint: string;
  inkColor: string;
  fontSize: number;
  lineSpacing: number; // multiplier e.g. 1.8
  wordSpacing: number; // px offset e.g. 0
  marginX: number;     // px left/right margin
  marginTop: number;   // px top margin
  marginBottom: number;// px bottom margin
  variationIntensity: number; // 0 to 1
  pageSize: PageSize;
  seed: number;
  showMarginLine: boolean;
  showPageNumbers: boolean;
  showDateHeader: boolean;
  headerDateText: string;
  headerSubjectText: string;
}

export interface WordToken {
  text: string;
  width: number;
  isWhitespace: boolean;
  angle: number;
  offsetY: number;
  microScale: number;
  opacity: number;
  spaceWidthAfter: number;
}

export interface LineData {
  words: WordToken[];
  baselineY: number;
  lineWidth: number;
  isParagraphEnd?: boolean;
}

export interface PageData {
  pageNumber: number;
  lines: LineData[];
  totalWords: number;
}

export interface SavedDraft {
  id: string;
  title: string;
  content: string;
  settings: NotebookSettings;
  updatedAt: number;
  wordCount: number;
  characterCount: number;
}

export interface InkColorPreset {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface StyleOption {
  id: HandwritingStyle;
  name: string;
  fontFamily: string;
  description: string;
  sampleChar: string;
  tag: string;
}
