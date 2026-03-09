﻿'use client';

import React, { useState } from 'react';
import { ThemeSwitcher } from '../Theme/ThemeSwitcher';
import SimpleBookWriter from './SimpleBookWriter';
import AIBookGenerator from './AIBookGenerator';
import WritingAssistant from '../AI/WritingAssistant';
import ToolsReference from './ToolsReference';
import StoryOutlinePanel from './StoryOutlinePanel';
import ChapterManager from './ChapterManager';
import WritingStats from './WritingStats';
import EditorialTeamPanel from '../AI/EditorialTeamPanel';
import AISettings from '../AI/AISettings';

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

const defaultChapter = (): Chapter => ({
  id: `chapter-${Date.now()}`,
  title: 'Chapter 1',
  content: '',
  wordCount: 0,
  createdAt: new Date(),
  updatedAt: new Date()
});

const BookWriterApp: React.FC = () => {
  const [activeView, setActiveView] = useState<'writer' | 'ai' | 'outline' | 'chapters' | 'team'>('writer');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>(() => [defaultChapter()]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [totalWordCount, setTotalWordCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const handleChaptersGenerated = (newChapters: Chapter[]) => {
    setChapters(newChapters);
    setActiveView('writer');
  };

  const handleSuggestion = (suggestion: string) => {
    if (suggestion.includes('AI Generator')) {
      setActiveView('ai');
    } else if (suggestion.includes('Outline')) {
      setActiveView('outline');
    } else if (suggestion.includes('Chapters')) {
      setActiveView('chapters');
    }
  };

  const updateWordCount = (count: number) => {
    setTotalWordCount(count);
  };

  const addChapter = () => {
    const newChapter: Chapter = {
      id: `chapter-${Date.now()}`,
      title: `Chapter ${chapters.length + 1}`,
      content: '',
      wordCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setChapters([...chapters, newChapter]);
    setCurrentChapterIndex(chapters.length);
  };

  const updateChapter = (index: number, content: string) => {
    const updatedChapters = [...chapters];
    updatedChapters[index] = {
      ...updatedChapters[index],
      content,
      wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
      updatedAt: new Date()
    };
    setChapters(updatedChapters);
    updateWordCount(updatedChapters.reduce((total, ch) => total + ch.wordCount, 0));
  };

  const deleteChapter = (index: number) => {
    if (chapters.length > 1) {
      const updatedChapters = chapters.filter((_, i) => i !== index);
      setChapters(updatedChapters);
      if (currentChapterIndex >= updatedChapters.length) {
        setCurrentChapterIndex(updatedChapters.length - 1);
      }
    }
  };

  const reorderChapters = (fromIndex: number, toIndex: number) => {
    const updatedChapters = [...chapters];
    const [movedChapter] = updatedChapters.splice(fromIndex, 1);
    updatedChapters.splice(toIndex, 0, movedChapter);
    setChapters(updatedChapters);
    setCurrentChapterIndex(toIndex);
  };

  const Sidebar = () => (
    <aside
      className="flex flex-col shrink-0 h-screen transition-all duration-300 ease-out bg-[hsl(220,13%,18%)] text-white border-r border-white/10"
      style={{ width: sidebarOpen ? 280 : 72 }}
    >
      <div className="flex flex-col h-full py-4">
        <div className="flex items-center gap-2 px-4 mb-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/90"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <span className="text-lg">â—€</span>
            ) : (
              <span className="text-lg">â–¶</span>
            )}
          </button>
          {sidebarOpen && (
            <h2 className="font-semibold text-lg tracking-tight">NovelCraft</h2>
          )}
        </div>

        {sidebarOpen && (
          <nav className="flex flex-col gap-1 px-3 flex-1">
            {[
              { id: 'writer' as const, label: 'Write', icon: 'âœï¸' },
              { id: 'outline' as const, label: 'Outline', icon: 'ðŸ—ºï¸' },
              { id: 'chapters' as const, label: 'Chapters', icon: 'ðŸ“–' },
              { id: 'ai' as const, label: 'AI Tools', icon: 'ðŸ¤–' },
              { id: 'team' as const, label: 'Team Review', icon: '\uD83D\uDC65' },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                className={`sidebar-nav-item w-full text-left flex items-center gap-3 ${activeView === id ? 'active' : 'text-white/80 hover:text-white'}`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}

            <div className="border-t border-white/10 my-4" />

            <button
              onClick={() => setShowStats(!showStats)}
              className={`sidebar-nav-item w-full text-left flex items-center gap-3 ${showStats ? 'active' : 'text-white/80 hover:text-white'}`}
            >
              <span>ðŸ“Š</span>
              <span>Stats</span>
            </button>
            <button
              onClick={() => setShowPrompts(!showPrompts)}
              className={`sidebar-nav-item w-full text-left flex items-center gap-3 ${showPrompts ? 'active' : 'text-white/80 hover:text-white'}`}
            >
              <span>ðŸŽ¯</span>
              <span>Prompts</span>
            </button>

            <div className="mt-auto pt-4 px-3 border-t border-white/10 text-xs text-white/60 space-y-1">
              <p>{totalWordCount.toLocaleString()} words</p>
              <p>{chapters.length} chapter{chapters.length !== 1 ? 's' : ''}</p>
            </div>
          </nav>
        )}
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <header className="shrink-0 bg-white border-b border-slate-200/80 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-semibold text-slate-800 truncate">
              {currentStory?.title || 'My Story'}
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(true)}
                className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors"
              >
                AI Settings
              </button>
              <ThemeSwitcher />
              <button
                onClick={addChapter}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                + Add Chapter
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-slate-50">
          {activeView === 'writer' && (
            <SimpleBookWriter
              chapters={chapters}
              currentChapterIndex={currentChapterIndex}
              onChapterUpdate={updateChapter}
              onWordCountUpdate={updateWordCount}
              onAddChapter={addChapter}
              storyContext={currentStory}
              onPromptSelect={(prompt) => console.log('Prompt selected:', prompt)}
              onPromptInsert={(text) => console.log('Prompt inserted:', text)}
              showPrompts={showPrompts}
            />
          )}

          {activeView === 'outline' && (
            <StoryOutlinePanel
              story={currentStory}
              chapters={chapters}
              onUpdateStory={setCurrentStory}
            />
          )}

          {activeView === 'chapters' && (
            <ChapterManager
              chapters={chapters}
              currentChapterIndex={currentChapterIndex}
              onChapterSelect={setCurrentChapterIndex}
              onChapterDelete={deleteChapter}
              onChapterReorder={reorderChapters}
            />
          )}

          {activeView === 'ai' && (
            <AIBookGenerator
              onChaptersGenerated={handleChaptersGenerated}
              currentStory={currentStory}
            />
          )}

          {activeView === 'team' && (
            <EditorialTeamPanel
              chapterContent={chapters[currentChapterIndex]?.content || ''}
              chapterTitle={chapters[currentChapterIndex]?.title}
              genre={currentStory?.genre}
              characters={currentStory?.characters}
              plotPoints={currentStory?.plotPoints}
            />
          )}
        </main>

        {/* Stats Panel */}
        {showStats && (
          <WritingStats
            totalWords={totalWordCount}
            chaptersCount={chapters.length}
            onClose={() => setShowStats(false)}
          />
        )}
      </div>

      {/* AI Writing Assistant */}
      <WritingAssistant
        currentChapter={chapters[currentChapterIndex]?.content}
        wordCount={totalWordCount}
        onSuggestion={handleSuggestion}
      />

      {/* Tools Reference */}
      <ToolsReference />

      {showSettings && <AISettings onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default BookWriterApp;
