import { DEFAULT_SETTINGS, SAMPLE_NOTES } from './constants';
import { NotebookSettings, SavedDraft } from '../types';

const DRAFTS_KEY = 'scribbly_saved_drafts_v1';
const AUTOSAVE_KEY = 'scribbly_autosave_content_v1';
const SETTINGS_KEY = 'scribbly_user_settings_v1';

export function getSavedDrafts(): SavedDraft[] {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read drafts from localStorage', err);
    return [];
  }
}

export function saveDraft(title: string, content: string, settings: NotebookSettings): SavedDraft {
  const drafts = getSavedDrafts();
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const newDraft: SavedDraft = {
    id: 'draft_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    title: title.trim() || 'Untitled Note - ' + new Date().toLocaleDateString(),
    content,
    settings,
    updatedAt: Date.now(),
    wordCount: words,
    characterCount: content.length,
  };

  const updated = [newDraft, ...drafts];
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
  return newDraft;
}

export function deleteDraft(id: string): SavedDraft[] {
  const drafts = getSavedDrafts();
  const updated = drafts.filter(d => d.id !== id);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
  return updated;
}

export function getAutoSavedContent(): { content: string; settings?: NotebookSettings } | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read autosaved content', err);
  }

  // Fallback to starter sample note
  return {
    content: SAMPLE_NOTES[0].content,
    settings: DEFAULT_SETTINGS,
  };
}

export function setAutoSavedContent(content: string, settings: NotebookSettings) {
  try {
    localStorage.setItem(
      AUTOSAVE_KEY,
      JSON.stringify({
        content,
        settings,
        savedAt: Date.now(),
      })
    );
  } catch (err) {
    console.warn('Autosave quota or error', err);
  }
}

export function getSavedSettings(): NotebookSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn('Could not read saved settings', err);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: NotebookSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Could not save settings', err);
  }
}
