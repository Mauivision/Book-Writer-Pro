/**
 * @jest-environment jsdom
 */

import { MANUSCRIPT_STORAGE_KEY } from '@/types/manuscript';
import {
  createDefaultManuscript,
  createEmptyChapter,
  hasUserContent,
  loadManuscript,
  parseManuscript,
  saveManuscript,
} from '@/utils/manuscriptStorage';

describe('manuscript storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('round-trips a saved manuscript', () => {
    const chapter = {
      ...createEmptyChapter('Opening'),
      content: 'The lanterns of Lumina flickered.',
      wordCount: 5,
    };
    const original = {
      ...createDefaultManuscript(),
      chapters: [chapter],
      currentStory: {
        id: 'story-1',
        title: 'Lumina Draft',
        genre: 'Science Fiction',
        description: 'A first pass',
        characters: ['Mira'],
        plotPoints: ['The ceremony'],
        createdAt: chapter.createdAt,
        updatedAt: chapter.updatedAt,
      },
    };

    const saved = saveManuscript(original);
    expect(saved.ok).toBe(true);

    const loaded = loadManuscript();
    expect(loaded.recovered).toBe(true);
    expect(loaded.state.chapters[0]?.title).toBe('Opening');
    expect(loaded.state.chapters[0]?.content).toContain('Lumina');
    expect(loaded.state.currentStory?.title).toBe('Lumina Draft');
  });

  it('rejects corrupt data without overwriting the stored copy', () => {
    window.localStorage.setItem(MANUSCRIPT_STORAGE_KEY, '{"chapters":[null]}');

    expect(parseManuscript({ chapters: [null] })).toBeNull();

    const loaded = loadManuscript();
    expect(loaded.recovered).toBe(false);
    expect(loaded.error).toMatch(/unreadable|could not be read/i);
    expect(window.localStorage.getItem(MANUSCRIPT_STORAGE_KEY)).toBe('{"chapters":[null]}');
  });

  it('refuses to save an empty chapter list', () => {
    const result = saveManuscript({
      ...createDefaultManuscript(),
      chapters: [],
    });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/empty manuscript/i);
  });

  it('treats a blank default draft as having no user content', () => {
    expect(hasUserContent(createDefaultManuscript())).toBe(false);
    expect(
      hasUserContent({
        ...createDefaultManuscript(),
        chapters: [
          {
            ...createEmptyChapter(),
            content: 'One sentence of real work.',
            wordCount: 5,
          },
        ],
      })
    ).toBe(true);
  });
});
