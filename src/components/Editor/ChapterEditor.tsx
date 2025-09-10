'use client';

import { useState, useEffect } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaEye, 
  FaTrash,
  FaBook,
  FaChartLine,
  FaCalendar
} from 'react-icons/fa';
import { humanWritingEngine } from '@/utils/humanWritingEngine';

interface ChapterEditorProps {
  chapterId?: string;
  onClose: () => void;
  onSave: (chapter: any) => void;
}

export default function ChapterEditor({ chapterId, onClose, onSave }: ChapterEditorProps) {
  const { chapters, updateChapter, removeChapter } = useBookStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [status, setStatus] = useState<'draft' | 'review' | 'final'>('draft');
  const [isEditing, setIsEditing] = useState(false);

  const chapter = chapterId ? chapters.find(c => c.id === chapterId) : null;

  useEffect(() => {
    if (chapter) {
      setTitle(chapter.title);
      setContent(chapter.content || '');
      setSummary(chapter.summary || '');
      setStatus(chapter.status || 'draft');
    }
  }, [chapter]);

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a chapter title');
      return;
    }

    const updatedChapter = {
      id: chapterId || Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      summary: summary.trim(),
      status,
      wordCount: content.trim().split(/\s+/).length,
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    if (chapterId) {
      updateChapter(chapterId, updatedChapter);
    } else {
      onSave(updatedChapter);
    }

    onClose();
  };

  const handleDelete = () => {
    if (chapterId && confirm('Are you sure you want to delete this chapter?')) {
      removeChapter(chapterId);
      onClose();
    }
  };

  const humanizeContent = () => {
    if (content.trim()) {
      const humanized = humanWritingEngine.humanizeText(content, {
        genre: 'fiction',
        emotionalState: 'neutral'
      });
      setContent(humanized);
    }
  };

  const wordCount = content.trim().split(/\s+/).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FaBook className="text-blue-500 text-xl" />
            <h2 className="text-xl font-semibold text-gray-900">
              {chapterId ? 'Edit Chapter' : 'New Chapter'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={humanizeContent}
              className="text-purple-600 hover:text-purple-700"
            >
              <FaEdit className="mr-1" />
              Humanize
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <FaTimes />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chapter Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter chapter title..."
                className="text-lg"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chapter Summary
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary of this chapter..."
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={3}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="final">Final</option>
              </select>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Chapter Content
                </label>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaChartLine />
                    {wordCount} words
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendar />
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your chapter content here..."
                className="w-full p-4 border border-gray-300 rounded-md resize-none font-mono text-sm leading-relaxed"
                rows={20}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            {chapterId && (
              <Button
                variant="outline"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <FaTrash className="mr-1" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FaSave className="mr-1" />
              Save Chapter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 