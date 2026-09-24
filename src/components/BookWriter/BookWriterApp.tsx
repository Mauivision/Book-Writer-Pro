'use client';

import React, { useEffect, useState } from 'react';
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
import ProviderStatusBadge from '../AI/ProviderStatusBadge';
import {
  countWords,
  createEmptyChapter,
  loadManuscript,
  nowIso,
  saveManuscript,
} from '@/utils/manuscriptStorage';
import { syncManuscriptToBookStore } from '@/utils/manuscriptSync';
import type {
  ManuscriptChapter,
  ManuscriptSaveStatus,
  ManuscriptStory,
} from '@/types/manuscript';

const BookWriterApp: React.FC = () => {
  const [activeView, setActiveView] = useState<'writer' | 'ai' | 'outline' | 'chapters' | 'team'>(
    'writer'
  );
  const [currentStory, setCurrentStory] = useState<ManuscriptStory | null>(null);
  const [chapters, setChapters] = useState<ManuscriptChapter[]>(() => [createEmptyChapter()]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [totalWordCount, setTotalWordCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<ManuscriptSaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadManuscript();
    setChapters(loaded.state.chapters);
    setCurrentStory(loaded.state.currentStory);
    setCurrentChapterIndex(loaded.state.currentChapterIndex);
    setTotalWordCount(loaded.state.chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0));
    if (loaded.error) {
      setSaveError(loaded.error);
      setSaveStatus('error');
    }
    if (loaded.recovered) {
      syncManuscriptToBookStore(loaded.state);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    setSaveStatus('saving');
    const result = saveManuscript({
      version: 1,
      chapters,
      currentStory,
      currentChapterIndex,
      lastSaved: nowIso(),
    });

    if (result.ok) {
      setSaveStatus('saved');
      setSaveError(null);
      syncManuscriptToBookStore({
        version: 1,
        chapters,
        currentStory,
        currentChapterIndex,
        lastSaved: result.lastSaved || nowIso(),
      });
      return;
    }

    setSaveStatus('error');
    setSaveError(result.error || 'Could not save the manuscript.');
  }, [chapters, currentStory, currentChapterIndex, hydrated]);

  const handleChaptersGenerated = (
    newChapters: ManuscriptChapter[],
    story?: ManuscriptStory | null
  ) => {
    if (!newChapters.length) return;
    setChapters(newChapters);
    setCurrentChapterIndex(0);
    setTotalWordCount(newChapters.reduce((sum, chapter) => sum + chapter.wordCount, 0));
    if (story) {
      setCurrentStory(story);
    }
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

  const addChapter = () => {
    const newChapter = createEmptyChapter(`Chapter ${chapters.length + 1}`);
    setChapters([...chapters, newChapter]);
    setCurrentChapterIndex(chapters.length);
  };

  const updateChapter = (index: number, content: string) => {
    const current = chapters[index];
    if (!current) return;
    const updatedChapters = [...chapters];
    updatedChapters[index] = {
      ...current,
      content,
      wordCount: countWords(content),
      updatedAt: nowIso(),
    };
    setChapters(updatedChapters);
    setTotalWordCount(updatedChapters.reduce((total, chapter) => total + chapter.wordCount, 0));
  };

  const updateChapterTitle = (index: number, title: string) => {
    const current = chapters[index];
    if (!current) return;
    const updatedChapters = [...chapters];
    updatedChapters[index] = {
      ...current,
      title,
      updatedAt: nowIso(),
    };
    setChapters(updatedChapters);
  };

  const deleteChapter = (index: number) => {
    if (chapters.length <= 1) return;
    const updatedChapters = chapters.filter((_, i) => i !== index);
    setChapters(updatedChapters);
    setCurrentChapterIndex(Math.min(currentChapterIndex, updatedChapters.length - 1));
    setTotalWordCount(updatedChapters.reduce((total, chapter) => total + chapter.wordCount, 0));
  };

  const reorderChapters = (fromIndex: number, toIndex: number) => {
    const updatedChapters = [...chapters];
    const [movedChapter] = updatedChapters.splice(fromIndex, 1);
    if (!movedChapter) return;
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
            {sidebarOpen ? <span className="text-lg">◀</span> : <span className="text-lg">▶</span>}
          </button>
          {sidebarOpen && <h2 className="font-semibold text-lg tracking-tight">Book Writer</h2>}
        </div>

        {sidebarOpen && (
          <nav className="flex flex-col gap-1 px-3 flex-1">
            {(
              [
                { id: 'writer' as const, label: 'Write', icon: '✎' },
                { id: 'outline' as const, label: 'Outline', icon: '☰' },
                { id: 'chapters' as const, label: 'Chapters', icon: '📖' },
                { id: 'ai' as const, label: 'AI Tools', icon: '✦' },
                { id: 'team' as const, label: 'Team Review', icon: '👥' },
              ] as const
            ).map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                className={`sidebar-nav-item w-full text-left flex items-center gap-3 ${
                  activeView === id ? 'active' : 'text-white/80 hover:text-white'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}

            <div className="border-t border-white/10 my-4" />

            <button
              onClick={() => setShowStats(!showStats)}
              className={`sidebar-nav-item w-full text-left flex items-center gap-3 ${
                showStats ? 'active' : 'text-white/80 hover:text-white'
              }`}
            >
              <span>📊</span>
              <span>Stats</span>
            </button>
            <button
              onClick={() => setShowPrompts(!showPrompts)}
              className={`sidebar-nav-item w-full text-left flex items-center gap-3 ${
                showPrompts ? 'active' : 'text-white/80 hover:text-white'
              }`}
            >
              <span>🎯</span>
              <span>Prompts</span>
            </button>

            <div className="mt-auto pt-4 px-3 border-t border-white/10 text-xs text-white/60 space-y-1">
              <p>{totalWordCount.toLocaleString()} words</p>
              <p>
                {chapters.length} chapter{chapters.length !== 1 ? 's' : ''}
              </p>
              <p>
                {saveStatus === 'saving'
                  ? 'Saving…'
                  : saveStatus === 'error'
                    ? 'Save failed'
                    : 'Saved on this device'}
              </p>
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
            <div>
              <h1 className="text-xl font-semibold text-slate-800 truncate">
                {currentStory?.title || 'My Story'}
              </h1>
              {saveError && <p className="text-xs text-red-600 mt-1">{saveError}</p>}
            </div>
            <div className="flex items-center gap-3">
              <ProviderStatusBadge />
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
          {!hydrated ? (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
              Loading your manuscript…
            </div>
          ) : (
            <>
              {activeView === 'writer' && (
                <SimpleBookWriter
                  chapters={chapters}
                  currentChapterIndex={currentChapterIndex}
                  onChapterUpdate={updateChapter}
                  onWordCountUpdate={setTotalWordCount}
                  onAddChapter={addChapter}
                  storyContext={currentStory}
                  onPromptSelect={(prompt) => console.log('Prompt selected:', prompt)}
                  onPromptInsert={(text) => console.log('Prompt inserted:', text)}
                  showPrompts={showPrompts}
                  saveStatus={saveStatus}
                  saveError={saveError}
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
                  onChapterTitleChange={updateChapterTitle}
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
            </>
          )}
        </main>

        {showStats && (
          <WritingStats
            totalWords={totalWordCount}
            chaptersCount={chapters.length}
            onClose={() => setShowStats(false)}
          />
        )}
      </div>

      <WritingAssistant
        currentChapter={chapters[currentChapterIndex]?.content}
        wordCount={totalWordCount}
        onSuggestion={handleSuggestion}
      />

      <ToolsReference />

      {showSettings && <AISettings onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default BookWriterApp;
