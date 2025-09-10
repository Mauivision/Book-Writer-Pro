'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import { useBookStore } from '@/store/useBookStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AdvancedWritingAssistant } from '@/components/AI/Assistants/AdvancedWritingAssistant';
import { SmartErrorDetector } from '@/components/AI/Quality/SmartErrorDetector';
import { StyleEnhancer } from '@/components/AI/Quality/StyleEnhancer';
import { FloatingAIAssistant } from '@/components/AI/Assistants/FloatingAIAssistant';
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
  FaPrint,
  FaSpellCheck,
  FaPalette,
  FaBrain,
  FaLightbulb,
  FaExpand,
  FaCompress,
  FaTimes,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import '@/styles/paper-editor.css';

interface EnhancedPaperEditorProps {
  chapterId: string | null;
  content: string;
}

export function EnhancedPaperEditor({ chapterId, content }: EnhancedPaperEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  const [showAIHelpers, setShowAIHelpers] = useState(false);
  const [showAdvancedAssistant, setShowAdvancedAssistant] = useState(false);
  const [showErrorDetector, setShowErrorDetector] = useState(false);
  const [showStyleEnhancer, setShowStyleEnhancer] = useState(false);
  const [aiHelpersExpanded, setAiHelpersExpanded] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{ from: number; to: number } | null>(null);
  const [showFloatingAssistant, setShowFloatingAssistant] = useState(true);
  
  const { updateChapter, currentChapter } = useBookStore();
  const editorRef = useRef<any>(null);

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
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to);
      setSelectedText(text);
      setSelectionRange({ from, to });
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

  const applySuggestion = (suggestion: any) => {
    if (!editor || !selectionRange) return;
    
    editor.chain()
      .focus()
      .setTextSelection({ from: selectionRange.from, to: selectionRange.to })
      .insertContent(suggestion.suggestion || suggestion)
      .run();
  };

  const highlightText = (start: number, end: number) => {
    if (!editor) return;
    
    editor.chain()
      .focus()
      .setTextSelection({ from: start, to: end })
      .run();
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
    <div className={`h-full flex flex-col ancient-scroll-bg ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Enhanced Toolbar */}
      {showToolbar && (
        <div className="ancient-scroll border-b-2 border-[var(--scroll-accent)] px-6 py-3">
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

            {/* AI Tools */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setShowFloatingAssistant(!showFloatingAssistant)}
                variant={showFloatingAssistant ? 'default' : 'outline'}
              >
                <FaBrain className="w-4 h-4 mr-1" />
                Floating AI
              </Button>
              <Button
                size="sm"
                onClick={() => setShowAIHelpers(!showAIHelpers)}
                className={`${showAIHelpers ? 'bg-blue-100 text-blue-700' : ''}`}
              >
                <FaBrain className="w-4 h-4 mr-1" />
                AI Helpers
                {aiHelpersExpanded ? <FaChevronUp className="w-3 h-3 ml-1" /> : <FaChevronDown className="w-3 h-3 ml-1" />}
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

          {/* AI Helpers Panel */}
          {showAIHelpers && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <FaBrain className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">AI Writing Assistants</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAiHelpersExpanded(!aiHelpersExpanded)}
                >
                  {aiHelpersExpanded ? <FaCompress className="w-3 h-3" /> : <FaExpand className="w-3 h-3" />}
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => setShowAdvancedAssistant(true)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                >
                  <FaMagic className="w-3 h-3 mr-1" />
                  Advanced Assistant
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowErrorDetector(!showErrorDetector)}
                  variant={showErrorDetector ? 'default' : 'outline'}
                >
                  <FaSpellCheck className="w-3 h-3 mr-1" />
                  Error Detection
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowStyleEnhancer(!showStyleEnhancer)}
                  variant={showStyleEnhancer ? 'default' : 'outline'}
                >
                  <FaPalette className="w-3 h-3 mr-1" />
                  Style Enhancer
                </Button>
              </div>

              {/* Selected Text Info */}
              {selectedText && (
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                  <span className="font-medium">Selected:</span> "{selectedText.substring(0, 50)}{selectedText.length > 50 ? '...' : ''}"
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
          {/* Ancient scroll background */}
          <div className="ancient-scroll-editor min-h-full">
            {/* Ancient scroll texture and margins */}
            <div className="relative">
              {/* Ancient scroll margin line */}
              <div className="ancient-scroll-margin" />
              
              {/* Editor content */}
              <div className="pl-20 pr-8 py-8">
                <div className="ancient-scroll-editor-content">
                  <EditorContent 
                    editor={editor} 
                    className="focus-within:outline-none ancient-scroll-text"
                  />
                </div>
              </div>
              
              {/* Ancient scroll decoration */}
              <div className="ancient-scroll-decoration" />
              
              {/* Page number */}
              <div className="absolute bottom-8 right-8 text-sm ancient-scroll-text opacity-60">
                Page 1
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* AI Helpers Sidebar */}
        {(showErrorDetector || showStyleEnhancer) && (
          <div className="w-96 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">AI Writing Helpers</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowErrorDetector(false);
                    setShowStyleEnhancer(false);
                  }}
                >
                  <FaTimes className="w-4 h-4" />
                </Button>
              </div>

              {showErrorDetector && (
                <SmartErrorDetector
                  text={editor?.getText() || ''}
                  onErrorSelect={(error) => highlightText(error.start, error.end)}
                  onSuggestionApply={applySuggestion}
                  className="mb-4"
                />
              )}

              {showStyleEnhancer && (
                <StyleEnhancer
                  text={editor?.getText() || ''}
                  onEnhancementSelect={(enhancement) => highlightText(enhancement.start, enhancement.end)}
                  onEnhancementApply={applySuggestion}
                />
              )}
            </div>
          </div>
        )}
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

      {/* Advanced Writing Assistant Modal */}
      {showAdvancedAssistant && (
        <AdvancedWritingAssistant
          editor={editor}
          onClose={() => setShowAdvancedAssistant(false)}
        />
      )}

      {/* Floating AI Assistant */}
      {showFloatingAssistant && (
        <FloatingAIAssistant
          currentText={editor?.getText() || ''}
          cursorPosition={selectionRange?.from || 0}
          onSuggestionApply={applySuggestion}
        />
      )}
    </div>
  );
}
