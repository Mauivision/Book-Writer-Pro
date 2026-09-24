import {
  DEFAULT_AUTHOR,
  DEFAULT_PUBLISHER,
  MANUSCRIPT_STORAGE_KEY,
  MANUSCRIPT_STORAGE_VERSION,
  type ManuscriptChapter,
  type ManuscriptSaveResult,
  type ManuscriptState,
  type ManuscriptStory,
} from '@/types/manuscript';

export function nowIso(): string {
  return new Date().toISOString();
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function createEmptyChapter(title = 'Chapter 1'): ManuscriptChapter {
  const timestamp = nowIso();
  return {
    id: `chapter-${Date.now()}`,
    title,
    content: '',
    wordCount: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function createDefaultManuscript(): ManuscriptState {
  return {
    version: MANUSCRIPT_STORAGE_VERSION,
    chapters: [createEmptyChapter()],
    currentStory: null,
    currentChapterIndex: 0,
    lastSaved: nowIso(),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function parseChapter(value: unknown, index: number): ManuscriptChapter | null {
  if (!isRecord(value)) return null;
  const id = asString(value.id);
  const title = asString(value.title, `Chapter ${index + 1}`);
  if (!id) return null;

  const content = asString(value.content);
  const createdAt = asString(value.createdAt, nowIso());
  const updatedAt = asString(value.updatedAt, createdAt);
  const wordCount =
    typeof value.wordCount === 'number' && Number.isFinite(value.wordCount)
      ? value.wordCount
      : countWords(content);

  return { id, title, content, wordCount, createdAt, updatedAt };
}

function parseStory(value: unknown): ManuscriptStory | null {
  if (!isRecord(value)) return null;
  const id = asString(value.id);
  if (!id) return null;

  return {
    id,
    title: asString(value.title, 'Untitled Story'),
    genre: asString(value.genre),
    description: asString(value.description),
    characters: asStringArray(value.characters),
    plotPoints: asStringArray(value.plotPoints),
    createdAt: asString(value.createdAt, nowIso()),
    updatedAt: asString(value.updatedAt, nowIso()),
  };
}

export function parseManuscript(raw: unknown): ManuscriptState | null {
  if (!isRecord(raw)) return null;

  const chaptersRaw = raw.chapters;
  if (!Array.isArray(chaptersRaw) || chaptersRaw.length === 0) return null;

  const chapters: ManuscriptChapter[] = [];
  for (let index = 0; index < chaptersRaw.length; index += 1) {
    const chapter = parseChapter(chaptersRaw[index], index);
    if (!chapter) return null;
    chapters.push(chapter);
  }

  const currentChapterIndex =
    typeof raw.currentChapterIndex === 'number' &&
    raw.currentChapterIndex >= 0 &&
    raw.currentChapterIndex < chapters.length
      ? raw.currentChapterIndex
      : 0;

  return {
    version: MANUSCRIPT_STORAGE_VERSION,
    chapters,
    currentStory: parseStory(raw.currentStory),
    currentChapterIndex,
    lastSaved: asString(raw.lastSaved, nowIso()),
  };
}

export function hasUserContent(state: ManuscriptState): boolean {
  const hasChapterText = state.chapters.some((chapter) => chapter.content.trim().length > 0);
  const hasExtraChapters = state.chapters.length > 1;
  const hasStoryTitle = Boolean(state.currentStory?.title.trim());
  return hasChapterText || hasExtraChapters || hasStoryTitle;
}

export function loadManuscript(): {
  state: ManuscriptState;
  recovered: boolean;
  error?: string;
} {
  if (typeof window === 'undefined') {
    return { state: createDefaultManuscript(), recovered: false };
  }

  try {
    const raw = window.localStorage.getItem(MANUSCRIPT_STORAGE_KEY);
    if (!raw) {
      return { state: createDefaultManuscript(), recovered: false };
    }

    const parsed = parseManuscript(JSON.parse(raw) as unknown);
    if (!parsed) {
      return {
        state: createDefaultManuscript(),
        recovered: false,
        error: 'Saved manuscript was unreadable, so a blank draft was opened. The previous save was left in place.',
      };
    }

    return { state: parsed, recovered: true };
  } catch {
    return {
      state: createDefaultManuscript(),
      recovered: false,
      error: 'Saved manuscript could not be read. The previous save was left in place.',
    };
  }
}

export function saveManuscript(state: ManuscriptState): ManuscriptSaveResult {
  if (typeof window === 'undefined') {
    return { ok: false, error: 'Manuscripts can only be saved in the browser.' };
  }

  if (!state.chapters.length) {
    return { ok: false, error: 'Refusing to save an empty manuscript.' };
  }

  const payload: ManuscriptState = {
    ...state,
    version: MANUSCRIPT_STORAGE_VERSION,
    lastSaved: nowIso(),
  };

  try {
    window.localStorage.setItem(MANUSCRIPT_STORAGE_KEY, JSON.stringify(payload));
    return { ok: true, lastSaved: payload.lastSaved };
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown storage error';
    return { ok: false, error: `Could not save the manuscript. ${detail}` };
  }
}

export function manuscriptToBookStoreSnapshot(state: ManuscriptState) {
  const title = state.currentStory?.title?.trim() || 'Untitled Story';
  const totalWords = state.chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0);

  return {
    metadata: {
      title,
      author: DEFAULT_AUTHOR,
      publisher: DEFAULT_PUBLISHER,
      genre: state.currentStory?.genre || '',
      description: state.currentStory?.description || '',
      synopsis: state.currentStory?.description || '',
      genres: state.currentStory?.genre ? [state.currentStory.genre] : [],
      currentWordCount: totalWords,
      lastModified: state.lastSaved,
    },
    chapters: state.chapters.map((chapter, index) => ({
      id: chapter.id,
      title: chapter.title,
      content: chapter.content,
      summary: '',
      wordCount: chapter.wordCount,
      order: index,
      status: 'draft' as const,
      lastModified: chapter.updatedAt,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
    })),
    plot: {
      summary: state.currentStory?.description || '',
      outline: state.currentStory?.plotPoints || [],
    },
  };
}
