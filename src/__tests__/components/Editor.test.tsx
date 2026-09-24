import { render, screen } from '@testing-library/react';
import { Editor } from '@/components/Editor';

jest.mock('@/store/useBookStore', () => ({
  useBookStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      updateChapter: jest.fn(),
      setCurrentChapter: jest.fn(),
    }),
}));

jest.mock('@/components/Editor/RichTextEditor', () => ({
  __esModule: true,
  default: () => <div data-testid="rich-text-editor">editor</div>,
}));

jest.mock('@/components/Chapter/ChapterGenerator', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/components/Editor/ChapterRewriter', () => ({
  __esModule: true,
  default: () => null,
}));

describe('Editor Component', () => {
  it('renders the chapter editor chrome', () => {
    render(<Editor chapterId="chapter-1" initialContent="<p>Hello</p>" />);
    expect(screen.getByText('Chapter Editor')).toBeInTheDocument();
    expect(screen.getByTestId('rich-text-editor')).toBeInTheDocument();
  });
});
