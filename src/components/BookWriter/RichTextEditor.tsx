'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { TextAlign } from './TextAlignment';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Write your chapter here... Use voice dictation by clicking the microphone button, or type normally. Your work auto-saves every few seconds.",
  className = ""
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
      TextAlign,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    editorProps: {
      attributes: {
        class: `rich-text-editor ${isFocused ? 'focused' : ''} ${className}`,
        style: `
          outline: none;
          padding: 20px;
          border: 2px solid ${isFocused ? '#3b82f6' : '#d1d5db'};
          border-radius: 8px;
          font-size: 16px;
          line-height: 1.6;
          font-family: Georgia, serif;
          background-color: #ffffff;
          resize: none;
          min-height: 400px;
          transition: border-color 0.2s ease;
          word-wrap: break-word;
        `,
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="rich-text-editor-container">
      <EditorContent editor={editor} />

      {/* Character Count */}
      <div className="character-count" style={{
        position: 'absolute',
        bottom: '10px',
        right: '20px',
        fontSize: '12px',
        color: '#6b7280',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '4px 8px',
        borderRadius: '4px',
        border: '1px solid #e2e8f0'
      }}>
        {editor.storage.characterCount.characters()} characters
      </div>
    </div>
  );
};

export default RichTextEditor;
