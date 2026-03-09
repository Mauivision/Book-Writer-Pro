'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { TextAlign } from './TextAlignment';
import EditorToolbar from './EditorToolbar';
import AISuggestions from '../AI/AISuggestions';
import ContextualPrompts from '../AI/ContextualPrompts';

interface FullRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  showAISuggestions?: boolean;
  showPrompts?: boolean;
  currentChapter?: number;
  totalChapters?: number;
  storyContext?: {
    genre: string;
    characters: string[];
    setting: string;
    plotPoints: string[];
  };
  onPromptSelect?: (prompt: string) => void;
  onPromptInsert?: (text: string) => void;
}

const FullRichTextEditor: React.FC<FullRichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Write your chapter here... Use voice dictation by clicking the microphone button, or type normally. Your work auto-saves every few seconds.",
  className = "",
  showAISuggestions = true,
  showPrompts = true,
  currentChapter = 1,
  totalChapters = 1,
  storyContext,
  onPromptSelect = () => {},
  onPromptInsert = () => {}
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
          font-size: 16px;
          line-height: 1.6;
          font-family: Georgia, serif;
          background-color: #ffffff;
          min-height: 400px;
          word-wrap: break-word;
          overflow-wrap: break-word;
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
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        backgroundColor: '#f8fafc',
        border: '2px dashed #cbd5e0',
        borderRadius: '8px',
        color: '#6b7280'
      }}>
        Loading rich text editor...
      </div>
    );
  }

  return (
    <div style={{
      border: `2px solid ${isFocused ? '#3b82f6' : '#d1d5db'}`,
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      transition: 'border-color 0.2s ease'
    }}>
      <EditorToolbar editor={editor} />

      <div style={{
        position: 'relative',
        padding: '20px',
        minHeight: '400px'
      }}>
        <EditorContent editor={editor} />

        {/* Character Count */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '20px',
          fontSize: '12px',
          color: '#6b7280',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid #e2e8f0',
          zIndex: 10
        }}>
          {editor.storage.characterCount.characters()} chars • {editor.storage.characterCount.words()} words
        </div>
      </div>

      {/* AI Suggestions */}
      {showAISuggestions && (
        <AISuggestions
          editor={editor}
          content={content}
          onSuggestionApply={(suggestion, replacement) => {
            // Handle suggestion application
            console.log('Applying suggestion:', suggestion, replacement);
            // In a real implementation, this would apply the suggestion to the editor
          }}
        />
      )}

      {/* Contextual Prompts */}
      {showPrompts && (
        <ContextualPrompts
          currentText={content}
          currentChapter={currentChapter}
          totalChapters={totalChapters}
          storyContext={storyContext}
          onPromptSelect={onPromptSelect}
          onPromptInsert={onPromptInsert}
        />
      )}
    </div>
  );
};

export default FullRichTextEditor;
