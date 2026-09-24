export const MANUSCRIPT_STORAGE_KEY = 'book-writer-manuscript-v1';
export const MANUSCRIPT_STORAGE_VERSION = 1 as const;

export const DEFAULT_AUTHOR = 'Aaron Vanderpool';
export const DEFAULT_PUBLISHER = 'A.C.C. L.L.C.';

export interface ManuscriptChapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ManuscriptStory {
  id: string;
  title: string;
  genre: string;
  description: string;
  characters: string[];
  plotPoints: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ManuscriptState {
  version: typeof MANUSCRIPT_STORAGE_VERSION;
  chapters: ManuscriptChapter[];
  currentStory: ManuscriptStory | null;
  currentChapterIndex: number;
  lastSaved: string;
}

export type ManuscriptSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface ManuscriptSaveResult {
  ok: boolean;
  error?: string;
  lastSaved?: string;
}
