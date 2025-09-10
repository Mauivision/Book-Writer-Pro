'use client';

import { useState } from 'react';
import { useBookStore } from '@/store/useBookStore';
import RichTextEditor from './RichTextEditor';
import ChapterGenerator from '../Chapter/ChapterGenerator';
import ChapterRewriter from './ChapterRewriter';
import { Button } from '../ui/Button';
import { FaMagic, FaTimes, FaEdit } from 'react-icons/fa';

interface EditorProps {
  chapterId: string;
  initialContent: string;
}

export default function Editor({ chapterId, initialContent }: EditorProps) {
  const [showChapterGenerator, setShowChapterGenerator] = useState(false);
  const [showChapterRewriter, setShowChapterRewriter] = useState(false);
  const updateChapter = useBookStore((state) => state.updateChapter);
  const setCurrentChapter = useBookStore((state) => state.setCurrentChapter);

  const handleContentChange = (content: string) => {
    updateChapter(chapterId, { content });
  };

  const handleChapterGenerated = (newChapterId: string) => {
    setCurrentChapter(newChapterId);
    setShowChapterGenerator(false);
  };

  return (
    <div className="w-full">
      {/* Editor Controls */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Chapter Editor</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowChapterRewriter(!showChapterRewriter)}
            variant="outline"
            className="flex items-center gap-2"
          >
            {showChapterRewriter ? (
              <>
                <FaTimes />
                Close Rewriter
              </>
            ) : (
              <>
                <FaEdit />
                Rewrite Chapter
              </>
            )}
          </Button>
          <Button
            onClick={() => setShowChapterGenerator(!showChapterGenerator)}
            variant="outline"
            className="flex items-center gap-2"
          >
            {showChapterGenerator ? (
              <>
                <FaTimes />
                Close Generator
              </>
            ) : (
              <>
                <FaMagic />
                Generate Chapter
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Chapter Rewriter */}
      {showChapterRewriter && (
        <div className="mb-6">
          <ChapterRewriter
            chapterId={chapterId}
            onClose={() => setShowChapterRewriter(false)}
          />
        </div>
      )}

      {/* Chapter Generator */}
      {showChapterGenerator && (
        <div className="mb-6">
          <ChapterGenerator
            onChapterGenerated={handleChapterGenerated}
            onClose={() => setShowChapterGenerator(false)}
          />
        </div>
      )}

      {/* Rich Text Editor */}
      <RichTextEditor
        initialContent={initialContent}
        onChange={handleContentChange}
        chapterId={chapterId}
      />
    </div>
  );
} 