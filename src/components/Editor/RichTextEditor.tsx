'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState, useCallback } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { FaMagic, FaSpinner, FaLightbulb, FaKeyboard } from 'react-icons/fa';

export interface RichTextEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
  chapterId?: string;
}

export default function RichTextEditor({
  initialContent,
  onChange,
  chapterId,
}: RichTextEditorProps) {
  const [isAutoCompleting, setIsAutoCompleting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const { characters, plot, setting, metadata, chapters } = useBookStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder:
          'Start writing your story... (Press Ctrl+Space for AI suggestions)',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  // Get current chapter context
  const getCurrentChapterContext = useCallback(() => {
    if (!chapterId) return null;

    const currentChapter = chapters.find(ch => ch.id === chapterId);
    if (!currentChapter) return null;

    const chapterIndex = chapters.findIndex(ch => ch.id === chapterId);

    return {
      chapterId,
      chapterTitle: currentChapter.title,
      currentChapter: chapterIndex + 1,
      previousContent: currentChapter.content,
    };
  }, [chapterId, chapters]);

  // Analyze current writing context
  const analyzeContext = useCallback(() => {
    if (!editor) return null;

    const currentText = editor.state.doc.textBetween(
      Math.max(0, editor.state.selection.from - 200),
      editor.state.selection.from,
      '\n'
    );

    // Detect if we're in dialogue
    const isInDialogue = /["""].*$/.test(currentText);

    // Detect if we're describing a scene
    const isSceneDescription =
      /\b(was|were|is|are|stood|sat|walked|moved|looked|felt)\b/i.test(
        currentText
      );

    // Detect if we're in action
    const isAction =
      /\b(ran|jumped|fought|attacked|defended|moved|grabbed|threw)\b/i.test(
        currentText
      );

    return {
      currentText,
      isInDialogue,
      isSceneDescription,
      isAction,
      lastSentence: currentText.split(/[.!?]/).pop()?.trim() || '',
    };
  }, [editor]);

  // Intelligent auto-completion
  const handleAutoComplete = useCallback(
    async (
      completionType:
        | 'sentence'
        | 'paragraph'
        | 'scene'
        | 'dialogue' = 'sentence'
    ) => {
      if (!editor || !chapterId) return;

      const context = getCurrentChapterContext();
      if (!context) return;

      const analysis = analyzeContext();
      if (!analysis) return;

      // Auto-detect completion type based on context
      let detectedType = completionType;
      if (completionType === 'sentence') {
        if (analysis.isInDialogue) detectedType = 'dialogue';
        else if (analysis.isSceneDescription) detectedType = 'scene';
        else if (analysis.isAction) detectedType = 'scene';
      }

      setIsAutoCompleting(true);
      setShowSuggestions(false);

      try {
        const response = await fetch('/api/ai/autocomplete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentText: analysis.currentText,
            context: {
              ...context,
              characters: characters.map(char => ({
                id: char.id,
                name: char.name,
                role: char.role,
                description: char.description,
                background: char.background,
                motivations: char.motivations,
              })),
              plot: {
                summary: plot.summary,
                outline: plot.outline,
                currentChapter: context.currentChapter,
              },
              setting: {
                description: setting.description,
                worldBuilding: setting.worldBuilding,
              },
              genre: metadata.genres[0] || 'Fantasy',
              theme: metadata.description || 'Adventure',
            },
            completionType: detectedType,
            maxWords:
              detectedType === 'sentence'
                ? 25
                : detectedType === 'paragraph'
                  ? 100
                  : detectedType === 'scene'
                    ? 200
                    : 150,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get auto-completion');
        }

        const { completion } = await response.json();

        // Insert the completion at cursor position
        editor.commands.insertContent(completion);
      } catch (error) {
        console.error('Auto-completion error:', error);
      } finally {
        setIsAutoCompleting(false);
      }
    },
    [
      editor,
      chapterId,
      characters,
      plot,
      setting,
      metadata,
      getCurrentChapterContext,
      analyzeContext,
    ]
  );

  // Generate writing suggestions
  const generateSuggestions = useCallback(async () => {
    if (!editor || !chapterId) return;

    const context = getCurrentChapterContext();
    if (!context) return;

    const analysis = analyzeContext();
    if (!analysis) return;

    setIsAutoCompleting(true);

    try {
      // Generate suggestions based on current context
      const suggestionTypes: Array<
        'sentence' | 'paragraph' | 'scene' | 'dialogue'
      > = [];

      if (analysis.isInDialogue) {
        suggestionTypes.push('dialogue', 'sentence', 'scene');
      } else if (analysis.isSceneDescription) {
        suggestionTypes.push('scene', 'paragraph', 'sentence');
      } else if (analysis.isAction) {
        suggestionTypes.push('scene', 'sentence', 'paragraph');
      } else {
        suggestionTypes.push('sentence', 'paragraph', 'scene');
      }

      const suggestions = [];

      for (const type of suggestionTypes.slice(0, 3)) {
        try {
          const response = await fetch('/api/ai/autocomplete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              currentText: analysis.currentText,
              context: {
                ...context,
                characters: characters.map(char => ({
                  id: char.id,
                  name: char.name,
                  role: char.role,
                  description: char.description,
                  background: char.background,
                  motivations: char.motivations,
                })),
                plot: {
                  summary: plot.summary,
                  outline: plot.outline,
                  currentChapter: context.currentChapter,
                },
                setting: {
                  description: setting.description,
                  worldBuilding: setting.worldBuilding,
                },
                genre: metadata.genres[0] || 'Fantasy',
                theme: metadata.description || 'Adventure',
              },
              completionType: type,
              maxWords:
                type === 'sentence'
                  ? 30
                  : type === 'paragraph'
                    ? 60
                    : type === 'scene'
                      ? 80
                      : 50,
            }),
          });

          if (response.ok) {
            const { completion } = await response.json();
            suggestions.push({
              text: completion,
              type: type.charAt(0).toUpperCase() + type.slice(1),
            });
          }
        } catch (error) {
          console.error('Suggestion generation error:', error);
        }
      }

      setSuggestions(suggestions.map(s => s.text));
      setShowSuggestions(true);
    } catch (error) {
      console.error('Suggestions error:', error);
    } finally {
      setIsAutoCompleting(false);
    }
  }, [
    editor,
    chapterId,
    characters,
    plot,
    setting,
    metadata,
    getCurrentChapterContext,
    analyzeContext,
  ]);

  const insertSuggestion = useCallback(
    (suggestion: string) => {
      if (!editor) return;
      editor.commands.insertContent(suggestion);
      setShowSuggestions(false);
    },
    [editor]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!editor) return;

      // Ctrl+Space for suggestions
      if (event.ctrlKey && event.code === 'Space') {
        event.preventDefault();
        generateSuggestions();
      }

      // Ctrl+Enter for sentence completion
      if (event.ctrlKey && event.code === 'Enter') {
        event.preventDefault();
        handleAutoComplete('sentence');
      }

      // Ctrl+Shift+Enter for paragraph completion
      if (event.ctrlKey && event.shiftKey && event.code === 'Enter') {
        event.preventDefault();
        handleAutoComplete('paragraph');
      }

      // Escape to close suggestions
      if (event.code === 'Escape') {
        setShowSuggestions(false);
        setShowShortcuts(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor, generateSuggestions, handleAutoComplete]);

  return (
    <div className="min-h-[500px] border border-border rounded-lg bg-background">
      <div className="border-b border-border p-2 flex flex-wrap gap-2">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-secondary/10 ${
            editor?.isActive('bold') ? 'bg-secondary/20' : ''
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-secondary/10 ${
            editor?.isActive('italic') ? 'bg-secondary/20' : ''
          }`}
        >
          Italic
        </button>
        <button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-secondary/10 ${
            editor?.isActive('heading', { level: 2 }) ? 'bg-secondary/20' : ''
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-secondary/10 ${
            editor?.isActive('bulletList') ? 'bg-secondary/20' : ''
          }`}
        >
          Bullet List
        </button>

        {/* AI Auto-completion Tools */}
        <div className="border-l border-border ml-2 pl-2 flex gap-2">
          <button
            onClick={() => handleAutoComplete('sentence')}
            disabled={isAutoCompleting || !chapterId}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-primary/10 text-primary rounded hover:bg-primary/20 disabled:opacity-50"
            title="Complete Sentence (Ctrl+Enter)"
          >
            {isAutoCompleting ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaMagic />
            )}
            Complete Sentence
          </button>
          <button
            onClick={() => handleAutoComplete('paragraph')}
            disabled={isAutoCompleting || !chapterId}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-primary/10 text-primary rounded hover:bg-primary/20 disabled:opacity-50"
            title="Complete Paragraph (Ctrl+Shift+Enter)"
          >
            {isAutoCompleting ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaMagic />
            )}
            Complete Paragraph
          </button>
          <button
            onClick={generateSuggestions}
            disabled={isAutoCompleting || !chapterId}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-secondary/10 text-secondary rounded hover:bg-secondary/20 disabled:opacity-50"
            title="Get Suggestions (Ctrl+Space)"
          >
            {isAutoCompleting ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaLightbulb />
            )}
            Get Suggestions
          </button>
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-secondary/10 text-secondary rounded hover:bg-secondary/20"
            title="Keyboard Shortcuts"
          >
            <FaKeyboard />
            Shortcuts
          </button>
        </div>
      </div>

      <div className="p-4 relative">
        <EditorContent editor={editor} />

        {/* Writing Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-4 right-4 w-80 bg-white border border-border rounded-lg shadow-lg p-4 z-10">
            <h3 className="font-medium text-foreground mb-3">
              Writing Suggestions
            </h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => insertSuggestion(suggestion)}
                  className="w-full text-left p-2 text-sm bg-secondary/5 rounded hover:bg-secondary/10 transition-colors"
                >
                  {suggestion.length > 100
                    ? suggestion.substring(0, 100) + '...'
                    : suggestion}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSuggestions(false)}
              className="mt-3 w-full p-2 text-sm bg-secondary/10 rounded hover:bg-secondary/20"
            >
              Close
            </button>
          </div>
        )}

        {/* Keyboard Shortcuts Help */}
        {showShortcuts && (
          <div className="absolute top-4 right-4 w-80 bg-white border border-border rounded-lg shadow-lg p-4 z-10">
            <h3 className="font-medium text-foreground mb-3">
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Complete Sentence:</span>
                <kbd className="px-2 py-1 bg-secondary/10 rounded text-xs">
                  Ctrl+Enter
                </kbd>
              </div>
              <div className="flex justify-between">
                <span>Complete Paragraph:</span>
                <kbd className="px-2 py-1 bg-secondary/10 rounded text-xs">
                  Ctrl+Shift+Enter
                </kbd>
              </div>
              <div className="flex justify-between">
                <span>Get Suggestions:</span>
                <kbd className="px-2 py-1 bg-secondary/10 rounded text-xs">
                  Ctrl+Space
                </kbd>
              </div>
              <div className="flex justify-between">
                <span>Close Panels:</span>
                <kbd className="px-2 py-1 bg-secondary/10 rounded text-xs">
                  Escape
                </kbd>
              </div>
            </div>
            <button
              onClick={() => setShowShortcuts(false)}
              className="mt-3 w-full p-2 text-sm bg-secondary/10 rounded hover:bg-secondary/20"
            >
              Close
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-border p-2 text-sm text-secondary flex justify-between items-center">
        <span>
          {editor?.storage?.characterCount?.characters?.() ?? 0} characters ·{' '}
          {editor?.storage?.characterCount?.words?.() ?? 0} words
        </span>
        {chapterId && (
          <span className="text-xs">
            AI Auto-completion available • Press Ctrl+Space for suggestions
          </span>
        )}
      </div>
    </div>
  );
}
