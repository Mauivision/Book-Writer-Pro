'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import { useBookStore } from '@/store/useBookStore';
import { Button } from '@/components/ui/Button';
import { 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaListUl, 
  FaListOl, 
  FaQuoteLeft,
  FaUndo,
  FaRedo,
  FaSave,
  FaMagic,
  FaEye,
  FaPrint
} from 'react-icons/fa';
import '@/styles/paper-editor.css';

interface PaperEditorProps {
  chapterId: string | null;
  content: string;
}

export function PaperEditor({ chapterId, content }: PaperEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  
  const { updateChapter, currentChapter } = useBookStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount,
      Placeholder.configure({
        placeholder: 'Start writing your story here... Let your imagination flow onto the page.',
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'paper-editor prose prose-lg max-w-none focus:outline-none min-h-[600px] p-8',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      
      setWordCount(words);
      setCharacterCount(editor.storage.characterCount.characters());
      
      if (chapterId) {
        updateChapter(chapterId, { content: html });
      }
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      setWordCount(words);
      setCharacterCount(editor.storage.characterCount.characters());
    }
  }, [editor, currentChapter]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  if (!chapterId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <FaMagic className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Select a Chapter
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Choose a chapter from the structure panel to start writing, or create a new chapter to begin your story.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col bg-white dark:bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Formatting Tools */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={editor?.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}
              >
                <FaBold className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={editor?.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}
              >
                <FaItalic className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                className={editor?.isActive('underline') ? 'bg-gray-200 dark:bg-gray-700' : ''}
              >
                <FaUnderline className="w-4 h-4" />
              </Button>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={editor?.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''}
              >
                <FaListUl className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={editor?.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''}
              >
                <FaListOl className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className={editor?.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-700' : ''}
              >
                <FaQuoteLeft className="w-4 h-4" />
              </Button>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().undo()}
              >
                <FaUndo className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
              >
                <FaRedo className="w-4 h-4" />
              </Button>
            </div>

            {/* Stats and Actions */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {wordCount} words • {characterCount} characters
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowToolbar(!showToolbar)}
                >
                  <FaEye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleFullscreen}
                >
                  <FaPrint className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Paper-like background */}
          <div className="bg-white dark:bg-gray-900 min-h-full">
            {/* Paper texture and margins */}
            <div className="relative">
              {/* Left margin line */}
              <div className="absolute left-16 top-0 bottom-0 w-px bg-red-200 dark:bg-red-800 opacity-30" />
              
              {/* Editor content */}
              <div className="pl-20 pr-8 py-8">
                <div className="paper-editor dark:dark">
                  <EditorContent 
                    editor={editor} 
                    className="focus-within:outline-none"
                  />
                </div>
              </div>
              
              {/* Page number */}
              <div className="absolute bottom-8 right-8 text-sm text-gray-400 dark:text-gray-500">
                Page 1
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating toolbar when hidden */}
      {!showToolbar && (
        <button
          onClick={() => setShowToolbar(true)}
          className="fixed top-4 right-4 z-40 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <FaEye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      )}
    </div>
  );
}
