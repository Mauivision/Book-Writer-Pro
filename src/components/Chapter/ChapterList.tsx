import { useBookStore } from '@/store/useBookStore';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FaEdit, FaEye, FaArrowUp, FaArrowDown, FaTrash, FaPlus, FaChartLine } from 'react-icons/fa';

export default function ChapterList({ onEditChapter }: { onEditChapter: (chapterId?: string) => void }) {
  const { chapters, addChapter, removeChapter, reorderChapters } = useBookStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Chapters</h2>
        <Button
          onClick={() => {
            const newChapter = {
              title: `Untitled Chapter ${chapters.length + 1}`,
              content: '',
              summary: '',
              order: chapters.length,
              status: 'draft' as 'draft',
              wordCount: 0,
            };
            addChapter(newChapter);
            setTimeout(() => {
              const last = useBookStore.getState().chapters[useBookStore.getState().chapters.length - 1];
              setEditingId(last.id);
              onEditChapter(last.id);
            }, 0);
          }}
          className="bg-gradient-to-r from-blue-200 to-blue-300 hover:from-blue-300 hover:to-blue-400 text-mint-900 border border-blue-200"
          size="sm"
        >
          <FaPlus className="mr-2" />
          New Chapter
        </Button>
      </div>
      <div className="space-y-4">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            className={`border-2 border-mint-100 rounded-lg p-4 hover:border-blue-200 hover:shadow-md transition-all duration-300 bg-white/60 ${editingId === chapter.id ? 'ring-2 ring-blue-300' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-mint-900 mb-2">
                  Chapter {index + 1}: {chapter.title}
                </h4>
                <p className="text-mint-700 mb-3 text-sm">
                  {chapter.summary || 'No summary available'}
                </p>
                <div className="flex items-center gap-4 text-xs text-mint-600">
                  <span className="flex items-center gap-1">
                    <FaChartLine className="text-blue-400" />
                    {chapter.wordCount} words
                  </span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    chapter.status === 'final' ? 'bg-green-100 text-green-700' :
                    chapter.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-mint-100 text-mint-700'
                  }`}>
                    {chapter.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-4 items-end">
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setEditingId(chapter.id); onEditChapter(chapter.id); }}
                    className="border-mint-200 hover:border-blue-300 text-mint-700"
                  >
                    <FaEdit className="text-sm" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setEditingId(chapter.id); onEditChapter(chapter.id); }}
                    className="border-mint-200 hover:border-blue-300 text-mint-700"
                  >
                    <FaEye className="text-sm" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Delete this chapter?')) {
                        removeChapter(chapter.id);
                        setEditingId(null);
                      }
                    }}
                    className="border-mint-200 hover:border-red-300 text-red-600"
                  >
                    <FaTrash className="text-sm" />
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => {
                      if (index > 0) {
                        const reordered = [...chapters];
                        [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
                        reordered.forEach((c, i) => c.order = i);
                        reorderChapters(reordered);
                      }
                    }}
                    className="border-mint-200 hover:border-blue-300 text-mint-700"
                  >
                    <FaArrowUp className="text-sm" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={index === chapters.length - 1}
                    onClick={() => {
                      if (index < chapters.length - 1) {
                        const reordered = [...chapters];
                        [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
                        reordered.forEach((c, i) => c.order = i);
                        reorderChapters(reordered);
                      }
                    }}
                    className="border-mint-200 hover:border-blue-300 text-mint-700"
                  >
                    <FaArrowDown className="text-sm" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 