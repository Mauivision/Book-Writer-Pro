'use client';

import React from 'react';
import { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor | null;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        padding: '8px',
        margin: '0 2px',
        border: `1px solid ${isActive ? '#3b82f6' : '#d1d5db'}`,
        borderRadius: '4px',
        backgroundColor: isActive ? '#3b82f6' : disabled ? '#f3f4f6' : 'white',
        color: isActive ? 'white' : disabled ? '#9ca3af' : '#374151',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '32px',
        height: '32px',
        transition: 'all 0.2s ease'
      }}
    >
      {children}
    </button>
  );

  return (
    <div style={{
      padding: '12px 20px',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      gap: '4px',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      {/* Text Formatting */}
      <div style={{ display: 'flex', gap: '2px', marginRight: '16px' }}>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <s>S</s>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Code"
        >
          <code>{'</>'}</code>
        </ToolbarButton>
      </div>

      {/* Headings */}
      <div style={{ display: 'flex', gap: '2px', marginRight: '16px' }}>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          H1
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>
      </div>

      {/* Lists */}
      <div style={{ display: 'flex', gap: '2px', marginRight: '16px' }}>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          •
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          1.
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          "
        </ToolbarButton>
      </div>

      {/* Alignment and Formatting */}
      <div style={{ display: 'flex', gap: '2px', marginRight: '16px' }}>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          ←
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          ↔
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          →
        </ToolbarButton>
      </div>

      {/* Undo/Redo */}
      <div style={{ display: 'flex', gap: '2px', marginRight: '16px' }}>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Undo (Ctrl+Z)"
        >
          ↶
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Redo (Ctrl+Y)"
        >
          ↷
        </ToolbarButton>
      </div>

      {/* Special Actions */}
      <div style={{ display: 'flex', gap: '2px' }}>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Insert Horizontal Rule"
        >
          ―
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHardBreak().run()}
          title="Line Break"
        >
          ↵
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().clearNodes().run()}
          title="Clear Formatting"
        >
          ⌫
        </ToolbarButton>
      </div>

      {/* Word/Character Count */}
      <div style={{
        marginLeft: 'auto',
        padding: '4px 12px',
        backgroundColor: '#e2e8f0',
        borderRadius: '12px',
        fontSize: '12px',
        color: '#6b7280',
        fontWeight: '500'
      }}>
        Words: {editor.storage.characterCount.words()}
      </div>
    </div>
  );
};

export default EditorToolbar;
