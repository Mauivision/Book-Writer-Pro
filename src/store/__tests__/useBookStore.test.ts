import { renderHook, act } from '@testing-library/react';
import { useBookStore } from '../useBookStore';

describe('useBookStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useBookStore());
    act(() => {
      result.current.loadBook({
        chapters: [],
        characters: [],
        plot: { summary: '', outline: [] },
        setting: { description: '' },
      });
      result.current.updateMetadata({
        title: '',
        genre: '',
        themes: [],
        synopsis: '',
      });
    });
  });

  it('should update metadata', () => {
    const { result } = renderHook(() => useBookStore());

    act(() => {
      result.current.updateMetadata({
        title: 'Test Book',
        genre: 'Fantasy',
        themes: ['Adventure'],
        synopsis: 'A test book synopsis',
      });
    });

    expect(result.current.metadata).toMatchObject({
      title: 'Test Book',
      genre: 'Fantasy',
      themes: ['Adventure'],
      synopsis: 'A test book synopsis',
    });
  });

  it('should add and update chapters', () => {
    const { result } = renderHook(() => useBookStore());

    act(() => {
      result.current.addChapter({
        title: 'Chapter 1',
        content: 'Test content',
        summary: 'Test summary',
        wordCount: 2,
        order: 0,
        status: 'draft',
      });
    });

    expect(result.current.chapters).toHaveLength(1);
    expect(result.current.chapters[0].title).toBe('Chapter 1');

    act(() => {
      result.current.updateChapter(result.current.chapters[0].id, {
        title: 'Updated Chapter 1',
      });
    });

    expect(result.current.chapters[0].title).toBe('Updated Chapter 1');
  });

  it('should add and update characters', () => {
    const { result } = renderHook(() => useBookStore());

    act(() => {
      result.current.addCharacter({
        name: 'Test Character',
        role: 'protagonist',
        description: 'A test character',
        background: 'Test background',
        motivations: ['Test motivation'],
        relationships: [],
      });
    });

    expect(result.current.characters).toHaveLength(1);
    expect(result.current.characters[0].name).toBe('Test Character');

    act(() => {
      result.current.updateCharacter(result.current.characters[0].id, {
        name: 'Updated Character',
      });
    });

    expect(result.current.characters[0].name).toBe('Updated Character');
  });

  it('should update plot and setting', () => {
    const { result } = renderHook(() => useBookStore());

    act(() => {
      result.current.updatePlot({
        summary: 'Test plot summary',
        outline: ['Test plot point'],
      });
    });

    expect(result.current.plot).toEqual({
      summary: 'Test plot summary',
      outline: ['Test plot point'],
    });

    act(() => {
      result.current.updateSetting({
        description: 'Test setting description',
      });
    });

    expect(result.current.setting).toEqual({
      description: 'Test setting description',
    });
  });

  it('should handle story generation', async () => {
    const { result } = renderHook(() => useBookStore());

    // Mock the fetch call
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            title: 'Generated Story',
            synopsis: 'Generated synopsis',
            chapters: [
              {
                title: 'Chapter 1',
                content: 'Generated content',
                summary: 'Generated summary',
              },
            ],
            characters: [
              {
                name: 'Generated Character',
                role: 'protagonist',
                description: 'Generated description',
                background: 'Generated background',
                motivations: ['Generated motivation'],
                relationships: [],
              },
            ],
            plot: {
              summary: 'Generated plot summary',
              outline: ['Generated plot point'],
            },
            setting: {
              description: 'Generated setting description',
            },
          }),
      })
    );

    await act(async () => {
      await result.current.generateCompleteStory({
        genre: 'Fantasy',
        theme: 'Adventure',
        complexity: 'intermediate',
        length: 'medium',
      });
    });

    expect(result.current.metadata.title).toBe('Generated Story');
    expect(result.current.chapters).toHaveLength(1);
    expect(result.current.characters).toHaveLength(1);
    expect(result.current.plot.summary).toBe('Generated plot summary');
    expect(result.current.setting.description).toBe(
      'Generated setting description'
    );
  });
});
