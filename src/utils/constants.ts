import { HandwritingStyle, InkColorPreset, NotebookSettings, PageDimension, PageSize, StyleOption } from '../types';

export const HANDWRITING_STYLES: StyleOption[] = [
  {
    id: 'classic-cursive',
    name: 'Classic Cursive',
    fontFamily: "'Classic Cursive', cursive",
    description: 'Connected, flowing script with graceful inclined letters. Perfect for personal letters, journals, and literature.',
    sampleChar: 'Am',
    tag: 'Flowing & Elegant'
  },
  {
    id: 'neat-student',
    name: 'Neat Student',
    fontFamily: "'Neat Student', cursive, sans-serif",
    description: 'Clean, legible, rounded felt-pen handwriting. Ideal for revision notes, lecture summaries, and textbook study.',
    sampleChar: 'Aa',
    tag: 'Crisp & Legible'
  },
  {
    id: 'casual-handwriting',
    name: 'Casual Handwritten',
    fontFamily: "'Casual Handwriting', cursive",
    description: 'Relaxed, informal penmanship with natural organic letterforms and playful spacing. Great for everyday thoughts.',
    sampleChar: 'Hi',
    tag: 'Natural & Relaxed'
  },
  {
    id: 'caveat-notes',
    name: 'Quick Notes',
    fontFamily: "'Caveat Notes', cursive",
    description: 'Dynamic, expressive quick handwriting with sharp energy and modern notebook feel.',
    sampleChar: 'Ex',
    tag: 'Fast & Expressive'
  }
];

export const INK_COLORS: InkColorPreset[] = [
  { id: 'blue', name: 'Classic Blue', color: '#1d4ed8', description: 'Timeless standard blue ballpoint' },
  { id: 'black', name: 'Gel Black', color: '#18181b', description: 'Deep, crisp carbon gel pen' },
  { id: 'dark-blue', name: 'Dark Navy', color: '#0f2942', description: 'Rich fountain pen royal navy' },
  { id: 'purple', name: 'Amethyst Purple', color: '#6b21a8', description: 'Vibrant revision ink' },
  { id: 'green', name: 'Forest Green', color: '#15803d', description: 'Natural emerald green marker' },
  { id: 'burgundy', name: 'Vintage Burgundy', color: '#881337', description: 'Warm crimson calligraphy ink' },
];

export const PAPER_TINTS = [
  { id: 'cream', name: 'Vintage Cream', color: '#fbf8ee', border: '#e8e2d0' },
  { id: 'ivory', name: 'Warm Ivory', color: '#fcfbf7', border: '#eae6d9' },
  { id: 'white', name: 'Clean White', color: '#ffffff', border: '#e2e8f0' },
  { id: 'yellow', name: 'Legal Pad Yellow', color: '#fefce8', border: '#fef08a' },
];

export const PAGE_DIMENSIONS: Record<PageSize, PageDimension> = {
  'a4-portrait': {
    width: 800,
    height: 1131, // A4 ratio 1:√2 ≈ 1.414 (800 x 1131)
    name: 'A4 Portrait',
    unit: 'mm',
    mmWidth: 210,
    mmHeight: 297,
  },
  'a4-landscape': {
    width: 1131,
    height: 800,
    name: 'A4 Landscape',
    unit: 'mm',
    mmWidth: 297,
    mmHeight: 210,
  },
  'letter-portrait': {
    width: 800,
    height: 1035, // US Letter ratio 8.5 x 11 ≈ 1.294 (800 x 1035)
    name: 'Letter Portrait',
    unit: 'in',
    mmWidth: 215.9,
    mmHeight: 279.4,
  },
};

export const DEFAULT_SETTINGS: NotebookSettings = {
  style: 'neat-student',
  paperStyle: 'ruled',
  paperTint: '#fbf8ee',
  inkColor: '#1d4ed8',
  fontSize: 22,
  lineSpacing: 1.65,
  wordSpacing: 0,
  marginX: 75,
  marginTop: 90,
  marginBottom: 75,
  variationIntensity: 0.45,
  pageSize: 'a4-portrait',
  seed: 42,
  showMarginLine: true,
  showPageNumbers: true,
  showDateHeader: true,
  headerDateText: 'Date: ____________',
  headerSubjectText: 'Topic: Biology Revision - Cellular Respiration',
};

export const SAMPLE_NOTES = [
  {
    title: 'Biology Revision - Cellular Respiration',
    category: 'Academic Study',
    content: `Cellular Respiration & ATP Synthesis
Topic: Molecular Biology & Bioenergetics

1. Overview of Glycolysis
Glycolysis takes place in the cytoplasm of all eukaryotic cells. One molecule of glucose (6 carbons) is broken down through ten enzymatically catalyzed reactions into two molecules of pyruvate (3 carbons each).
- Net Energy Yield: 2 ATP (via substrate-level phosphorylation) and 2 NADH.
- Crucial note: Glycolysis does not require molecular oxygen. It serves as the evolutionary foundation of cellular metabolism in both anaerobic and aerobic pathways.

2. The Citric Acid Cycle (Krebs Cycle)
Occurs in the mitochondrial matrix:
- Pyruvate dehydrogenase converts each pyruvate into Acetyl-CoA, releasing CO2 and producing 1 NADH.
- Acetyl-CoA combines with oxaloacetate (4C) to form citrate (6C).
- Citrate undergoes progressive decarboxylation and oxidation steps.
- Yield per glucose molecule (two turns of the cycle): 2 ATP/GTP, 6 NADH, 2 FADH2, and 4 CO2 molecules.

3. Oxidative Phosphorylation & The Electron Transport Chain
Located along the inner mitochondrial membrane (cristae):
- High-energy electrons from NADH and FADH2 are transferred through Complexes I, II, III, and IV to molecular oxygen (the terminal electron acceptor), forming H2O.
- Protons (H+) are pumped across the inner membrane into the intermembrane space, creating a steep electrochemical proton-motive force.
- ATP Synthase acts as a rotary biological turbine, driving phosphorylation of ADP into ATP as protons diffuse back down their gradient.
- Theoretical maximum total yield: ~30 to 32 ATP per glucose molecule.

Exam Summary Tip: Always remember that the proton gradient is established across the INNER mitochondrial membrane, NOT the outer envelope!`
  },
  {
    title: 'Art History - The Italian Renaissance',
    category: 'Humanities & Art',
    content: `Notes on Renaissance Art and Perspective
Florence, Italy (c. 1400 - 1550)

The Quattrocento witnessed an intellectual revolution rooted in Humanism (Studia Humanitatis). Rather than portraying religious allegories in flat, symbolic Byzantine formats, Florentine masters looked back to classical antiquity and natural observation.

Key Breakthroughs:
1. Linear Perspective (Filippo Brunelleschi, c. 1415)
- Mathematical system using a single vanishing point on a horizon line.
- Enabled artists to create convincing three-dimensional depth on a two-dimensional surface.
- Formally codified by Leon Battista Alberti in his 1435 treatise "De Pictura".

2. Chiaroscuro & Sfumato
- Chiaroscuro: The subtle transition between light and dark to sculpt anatomical volume.
- Sfumato (Leonardo da Vinci): "Without lines or borders, in the manner of smoke". Evident in the soft, lifelike contours of the Mona Lisa and Virgin of the Rocks.

3. Naturalism & Human Anatomy
- Intense study of human musculature through private anatomical dissections.
- Michelangelo Buonarroti's David exemplifies classical contrapposto and emotional tension (terribilità) prior to battle with Goliath.

Remember: The High Renaissance reached its climax in Rome under the patronage of Pope Julius II, uniting classical harmony with grand spiritual narratives.`
  },
  {
    title: 'Daily Reflection & Creative Journal',
    category: 'Personal Journal',
    content: `November 8 - A Quiet Autumn Morning

Woke up at dawn while the sky was still an ink-blue wash over the horizon. Made a warm cup of Earl Grey tea with a hint of honey and sat by the window watching the leaves drift down like amber confetti.

Today's Intentions:
1. Finish the manuscript draft for chapter four. Keep the dialogue brisk and let the subtext carry the emotional weight.
2. Go for an afternoon walk through the pine grove. Take the pocket sketchbook and pencil.
3. Call Mom in the evening and share recipes for pumpkin soup.

Favorite passage from today's reading:
"The world is full of magic things, patiently waiting for our senses to grow sharper." - W.B. Yeats

Note to self: Don't rush the work. Good things take patience and steady daily practice. Step by step, sentence by sentence.`
  }
];
