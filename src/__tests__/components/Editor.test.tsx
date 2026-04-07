import React from 'react';
import { render, screen } from '@testing-library/react';
import { Editor } from '@/components/Editor';

const chainMock = {
  focus: jest.fn().mockReturnThis(),
  toggleBold: jest.fn().mockReturnThis(),
  toggleItalic: jest.fn().mockReturnThis(),
  toggleHeading: jest.fn().mockReturnThis(),
  toggleBulletList: jest.fn().mockReturnThis(),
  run: jest.fn(),
};

jest.mock('@tiptap/react', () => ({
  useEditor: () => ({
    commands: {
      focus: jest.fn(),
      setContent: jest.fn(),
      insertContent: jest.fn(),
    },
    isActive: jest.fn().mockReturnValue(false),
    chain: () => chainMock,
    state: {
      doc: { textBetween: () => '' },
      selection: { from: 0 },
    },
    getHTML: () => '<p></p>',
    storage: {
      characterCount: { characters: () => 0, words: () => 0 },
    },
  }),
  EditorContent: () =>
    React.createElement('textarea', {
      role: 'textbox',
      'aria-label': 'Editor content',
    }),
}));

describe('Editor Component', () => {
  it('renders the editor component', () => {
    render(<Editor />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows formatting toolbar', () => {
    render(<Editor />);
    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument();
  });
});
