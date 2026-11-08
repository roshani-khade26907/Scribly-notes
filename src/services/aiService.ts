import { GoogleGenAI } from '@google/genai';

/**
 * Formats or enhances unstructured notes into structured study notes.
 * Works completely offline using intelligent local heuristics,
 * or enhances with Gemini API when available.
 */
export async function enhanceNotesContent(
  text: string,
  mode: 'study-guide' | 'summary' | 'bulletize' = 'study-guide'
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  // If Gemini API is available and online, we can use it
  if (apiKey && navigator.onLine) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      let prompt = '';
      if (mode === 'study-guide') {
        prompt = `You are a study notes assistant. Take the following text and rewrite it into clean, beautifully structured handwritten-style study notes. Use natural headings, concise bullet points, key definitions, and a short "Exam Summary Tip". Do not use markdown bold asterisks or symbols that look awkward in handwriting; use clear capitalization and dashes for lists.\n\nText:\n${text}`;
      } else if (mode === 'summary') {
        prompt = `Summarize the following text into 2-3 concise, well-phrased paragraphs suitable for a personal handwritten notebook page.\n\nText:\n${text}`;
      } else {
        prompt = `Convert the following text into clean, digestible bullet points suitable for a quick review notebook.\n\nText:\n${text}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini API call failed or offline, falling back to local formatter:', err);
    }
  }

  // Local offline heuristic formatting fallback (zero network required)
  return localHeuristicFormat(text, mode);
}

function localHeuristicFormat(text: string, mode: 'study-guide' | 'summary' | 'bulletize'): string {
  if (!text.trim()) return text;

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  if (mode === 'bulletize') {
    return lines
      .map(line => {
        if (line.startsWith('-') || line.startsWith('•') || /^\d+\./.test(line)) {
          return line;
        }
        return `- ${line}`;
      })
      .join('\n');
  }

  if (mode === 'study-guide') {
    const title = lines[0] || 'Study Notes';
    const body = lines.slice(1);
    const sections: string[] = [`TOPIC: ${title.toUpperCase()}`, ''];

    let currentSection = 'Key Points';
    sections.push(`1. ${currentSection}`);

    body.forEach((line, idx) => {
      if (line.length > 80 && line.includes('.')) {
        sections.push(`- ${line}`);
      } else if (idx % 4 === 3) {
        sections.push('');
        sections.push(`2. Key Takeaways & Review`);
        sections.push(`- ${line}`);
      } else {
        sections.push(`- ${line}`);
      }
    });

    sections.push('');
    sections.push(`Summary Note: Review core concepts and formulas regularly.`);
    return sections.join('\n');
  }

  // Summary default
  return lines.slice(0, Math.min(lines.length, 5)).join('\n\n');
}
