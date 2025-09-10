'use client';

import { useState } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { StructureSidebar } from './StructureSidebar';
import { EnhancedPaperEditor } from './EnhancedPaperEditor';
import { WelcomeScreen } from './WelcomeScreen';
import { ThemeSwitcher } from '@/components/Theme/ThemeSwitcher';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function CleanWriterLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentChapter, chapters, metadata } = useBookStore();

  const currentChapterData = chapters.find(ch => ch.id === currentChapter);

  // Show welcome screen if no book is created
  if (!metadata.title) {
    return <WelcomeScreen />;
  }

  return (
    <div className="h-screen flex ancient-scroll-bg">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border"
      >
        {sidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
      </button>

      {/* Structure Sidebar */}
      <div         className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed lg:relative lg:translate-x-0
        top-0 left-0 z-40
        w-80 h-full
        ancient-scroll-sidebar
        shadow-lg lg:shadow-none
        transition-transform duration-300 ease-in-out
        overflow-y-auto
      `}>
        <StructureSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="ancient-scroll border-b-2 border-[var(--scroll-accent)] px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="ancient-scroll-title text-2xl">
                NovelCraft AI
              </h1>
              <p className="ancient-scroll-subtitle text-sm">
                {currentChapterData?.title || 'Select a chapter to start writing'}
              </p>
            </div>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Enhanced Paper Editor */}
        <div className="flex-1 overflow-hidden">
          <EnhancedPaperEditor 
            chapterId={currentChapter}
            content={currentChapterData?.content || ''}
          />
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
