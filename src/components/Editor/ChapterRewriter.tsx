'use client';

import { useState } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FaMagic, FaSpinner, FaTimes, FaEdit } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface ChapterRewriterProps {
  chapterId: string;
  onClose?: () => void;
}

const writingStyles = [
  { value: 'professional', label: 'Professional' },
  { value: 'creative', label: 'Creative' },
  { value: 'casual', label: 'Casual' }
];

const tones = [
  { value: 'formal', label: 'Formal' },
  { value: 'engaging', label: 'Engaging' },
  { value: 'humorous', label: 'Humorous' }
];

const rewriteInstructions = [
  "Make the writing more engaging and vivid",
  "Improve the dialogue and make it more natural",
  "Add more descriptive details and sensory elements",
  "Make the pacing faster and more dynamic",
  "Improve character development and motivations",
  "Make the scene more atmospheric and moody",
  "Add more conflict and tension",
  "Make the writing more concise and clear"
];

export default function ChapterRewriter({ chapterId, onClose }: ChapterRewriterProps) {
  const [isRewriting, setIsRewriting] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [style, setStyle] = useState('professional');
  const [tone, setTone] = useState('engaging');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { 
    chapters, 
    rewriteChapter,
    characters, 
    plot, 
    setting, 
    metadata 
  } = useBookStore();

  const chapter = chapters.find(c => c.id === chapterId);

  if (!chapter) {
    return (
      <Card className="p-6">
        <p className="text-red-500">Chapter not found</p>
      </Card>
    );
  }

  const handleRewrite = async () => {
    if (!instructions.trim()) {
      toast.error('Please provide rewrite instructions');
      return;
    }

    try {
      setIsRewriting(true);
      
      await rewriteChapter({
        chapterId,
        instructions,
        style: style as any,
        tone: tone as any
      });

      toast.success('Chapter rewritten successfully!');
      
      if (onClose) {
        onClose();
      }
      
    } catch (error) {
      console.error('Error rewriting chapter:', error);
      toast.error('Failed to rewrite chapter. Please try again.');
    } finally {
      setIsRewriting(false);
    }
  };

  const handleInstructionSelect = (instruction: string) => {
    setInstructions(instruction);
    setShowSuggestions(false);
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaEdit className="text-blue-500" />
          Rewrite Chapter
        </h2>
        {onClose && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Chapter Info */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Chapter: {chapter.title}</h3>
          <p className="text-sm text-gray-600">
            {chapter.content.length} characters • {chapter.content.split(/\s+/).length} words
          </p>
        </div>

        {/* Instructions Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Rewrite Instructions
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-blue-600 hover:text-blue-700"
            >
              <FaMagic className="mr-1" />
              Suggestions
            </Button>
          </div>
          
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Describe how you want to improve this chapter..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
          />

          {/* Instruction Suggestions */}
          {showSuggestions && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Suggestions:</h4>
              <div className="grid grid-cols-1 gap-2">
                {rewriteInstructions.map((instruction, index) => (
                  <button
                    key={index}
                    onClick={() => handleInstructionSelect(instruction)}
                    className="text-left p-2 text-sm text-gray-600 hover:bg-white hover:text-gray-800 rounded border border-transparent hover:border-gray-200"
                  >
                    {instruction}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Style Options */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Writing Style
            </label>
            <Select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              options={writingStyles}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <Select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              options={tones}
            />
          </div>
        </div>

        {/* Story Context */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Story Context:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Genre:</strong> {metadata.genres[0] || 'Not specified'}</p>
            <p><strong>Characters:</strong> {characters.length} available</p>
            {plot.summary && <p><strong>Plot:</strong> {plot.summary.substring(0, 100)}...</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleRewrite}
            disabled={isRewriting || !instructions.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isRewriting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Rewriting...
              </>
            ) : (
              <>
                <FaEdit className="mr-2" />
                Rewrite Chapter
              </>
            )}
          </Button>

          {onClose && (
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
} 