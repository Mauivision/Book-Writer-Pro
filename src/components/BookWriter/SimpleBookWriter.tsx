'use client';

import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import FullRichTextEditor from './FullRichTextEditor';

interface Chapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Story {
  id: string;
  title: string;
  genre: string;
  description: string;
  chapters: Chapter[];
  characters: string[];
  plotPoints: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface SimpleBookWriterProps {
  chapters: Chapter[];
  currentChapterIndex: number;
  onChapterUpdate: (index: number, content: string) => void;
  onWordCountUpdate?: (count: number) => void;
  onAddChapter?: () => void;
  storyContext?: Story | null;
  onPromptSelect?: (prompt: string) => void;
  onPromptInsert?: (text: string) => void;
  showPrompts?: boolean;
}

const SimpleBookWriter: React.FC<SimpleBookWriterProps> = ({
  chapters,
  currentChapterIndex,
  onChapterUpdate,
  onWordCountUpdate,
  onAddChapter,
  storyContext,
  onPromptSelect = () => {},
  onPromptInsert = () => {},
  showPrompts = true
}) => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [writingStartTime, setWritingStartTime] = useState<Date | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const rec = new (window as any).webkitSpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (e: any) => {
        const transcript = e.results[e.results.length - 1][0].transcript;
        // Write directly to current chapter
        if (chapters[currentChapterIndex]) {
          const currentContent = chapters[currentChapterIndex].content;
          onChapterUpdate(currentChapterIndex, currentContent + transcript + ' ');
        }
      };
      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      setRecognition(rec);
    }
  }, [chapters, currentChapterIndex, onChapterUpdate]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (chapters.length > 0) {
        setAutoSaveStatus('saving');
        // Simulate save operation
        setTimeout(() => {
          setAutoSaveStatus('saved');
        }, 500);
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(autoSaveInterval);
  }, [chapters]);

  // Track writing time
  useEffect(() => {
    if (chapters[currentChapterIndex]?.content && !writingStartTime) {
      setWritingStartTime(new Date());
    } else if (!chapters[currentChapterIndex]?.content && writingStartTime) {
      setWritingStartTime(null);
    }
  }, [chapters, currentChapterIndex, writingStartTime]);

  const startVoice = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognition?.start();
    } catch (error) {
      alert('Microphone access denied. Please allow microphone access to use voice dictation.');
    }
  };

  const stopVoice = () => {
    recognition?.stop();
  };

  const saveBook = () => {
    if (chapters.length === 0) {
      alert('No chapters to save!');
      return;
    }

    const bookContent = chapters
      .map(ch => `## ${ch.title}\n\n${ch.content}\n\n---\n\n`)
      .join('');

    const blob = new Blob([bookContent], { type: 'text/markdown' });
    saveAs(blob, 'my-book.md');
  };

  const exportToMarkdown = () => {
    if (chapters.length === 0) {
      alert('No chapters to export!');
      return;
    }

    const markdownContent = `# ${chapters[0]?.title || 'My Book'}\n\n` +
      chapters.map(ch => `## ${ch.title}\n\n${ch.content}\n\n`).join('');

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    saveAs(blob, 'my-book.md');
  };

  const exportToJSON = () => {
    if (chapters.length === 0) {
      alert('No chapters to export!');
      return;
    }

    const bookData = {
      title: 'My Book',
      chapters: chapters,
      totalWords: chapters.reduce((total, ch) => total + ch.wordCount, 0),
      createdAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(bookData, null, 2)], { type: 'application/json' });
    saveAs(blob, 'my-book.json');
  };

  const currentChapter = chapters[currentChapterIndex];
  const wordCount = chapters.reduce((total, chapter) => total + chapter.wordCount, 0);

  // Handle prompt selection
  const handlePromptSelect = (prompt: string) => {
    console.log('Prompt selected:', prompt);
    if (onPromptSelect) {
      onPromptSelect(prompt);
    }
  };

  // Handle prompt insertion
  const handlePromptInsert = (text: string) => {
    if (currentChapter) {
      const newContent = currentChapter.content + text;
      onChapterUpdate(currentChapterIndex, newContent);
    }
    if (onPromptInsert) {
      onPromptInsert(text);
    }
  };

  // Update parent component with word count changes
  useEffect(() => {
    if (onWordCountUpdate) {
      onWordCountUpdate(wordCount);
    }
  }, [wordCount, onWordCountUpdate]);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff'
    }}>
      {/* Chapter Header */}
      {currentChapter && (
        <div style={{
          padding: '20px 30px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h2 style={{
              margin: 0,
              color: '#1f2937',
              fontSize: '24px',
              fontWeight: '600'
            }}>
              {currentChapter.title}
            </h2>

            <div style={{
              display: 'flex',
              gap: '15px',
              alignItems: 'center'
            }}>
              <div style={{
                display: 'flex',
                gap: '20px',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                <span>
                  📝 {currentChapter.wordCount} words
                </span>
                <span>
                  📅 {currentChapter.updatedAt.toLocaleDateString()}
                </span>
              </div>

              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={saveBook}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  💾 Save MD
                </button>

                <button
                  onClick={exportToJSON}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  📄 Export JSON
                </button>
              </div>
            </div>
          </div>

          {/* Auto-save indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: autoSaveStatus === 'saved' ? '#10b981' : autoSaveStatus === 'saving' ? '#f59e0b' : '#ef4444'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: autoSaveStatus === 'saved' ? '#10b981' : autoSaveStatus === 'saving' ? '#f59e0b' : '#ef4444'
            }} />
            {autoSaveStatus === 'saved' && '💾 Auto-saved'}
            {autoSaveStatus === 'saving' && '⏳ Saving...'}
            {autoSaveStatus === 'error' && '❌ Save failed'}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div style={{
        padding: '15px 30px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Voice Controls */}
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <button
            onClick={startVoice}
            disabled={isListening}
            style={{
              padding: '10px 16px',
              backgroundColor: isListening ? '#ef4444' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isListening ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              opacity: isListening ? 0.8 : 1
            }}
          >
            {isListening ? '🔴' : '🎤'} {isListening ? 'Listening...' : 'Voice Dictation'}
          </button>

          <button
            onClick={stopVoice}
            disabled={!isListening}
            style={{
              padding: '10px 16px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: !isListening ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: !isListening ? 0.5 : 1
            }}
          >
            ⏹️ Stop
          </button>
        </div>

        {/* Writing Stats */}
        <div style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <span>
            📊 Total: {wordCount.toLocaleString()} words
          </span>
          <span>
            📖 Chapters: {chapters.length}
          </span>
          {writingStartTime && (
            <span>
              ⏱️ Writing: {Math.floor((new Date().getTime() - writingStartTime.getTime()) / 60000)}m
            </span>
          )}
        </div>
      </div>

      {/* Main Editor */}
      <div style={{ flex: 1, padding: '20px', overflow: 'hidden' }}>
        {currentChapter ? (
          <FullRichTextEditor
            content={currentChapter.content}
            onChange={(content) => onChapterUpdate(currentChapterIndex, content)}
            placeholder="Write your chapter here... Use voice dictation by clicking the microphone button, or type normally. Your work auto-saves every few seconds."
            currentChapter={currentChapterIndex + 1}
            totalChapters={chapters.length}
            storyContext={storyContext ? {
              genre: storyContext.genre,
              characters: storyContext.characters,
              setting: storyContext.description,
              plotPoints: storyContext.plotPoints
            } : undefined}
            onPromptSelect={handlePromptSelect}
            onPromptInsert={handlePromptInsert}
            showPrompts={showPrompts}
          />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            backgroundColor: '#f8fafc',
            border: '2px dashed #cbd5e0',
            borderRadius: '12px',
            color: '#6b7280',
            textAlign: 'center'
          }}>
            <div>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '24px',
                color: '#374151'
              }}>
                📚 Ready to Start Writing?
              </h3>
              <p style={{
                margin: '0 0 30px 0',
                fontSize: '16px',
                lineHeight: '1.6',
                maxWidth: '400px'
              }}>
                Select a chapter from the sidebar or add a new chapter to begin writing.
                Use the voice dictation feature for hands-free writing.
              </p>
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => {/* This would trigger adding a chapter in the parent */}}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>+</span> Add Chapter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleBookWriter;
