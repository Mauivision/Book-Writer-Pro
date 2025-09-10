'use client';

import { useState } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FaMagic, FaSpinner, FaLightbulb, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface ChapterGeneratorProps {
  onChapterGenerated?: (chapterId: string) => void;
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

const povs = [
  { value: 'first', label: 'First Person' },
  { value: 'second', label: 'Second Person' },
  { value: 'third', label: 'Third Person' }
];

const lengthOptions = [
  { value: '500', label: 'Short (500 words)' },
  { value: '1000', label: 'Medium (1000 words)' },
  { value: '1500', label: 'Long (1500 words)' },
  { value: '2000', label: 'Extra Long (2000 words)' }
];

const promptTemplates = [
  "Write a chapter where the protagonist faces their biggest fear",
  "Create a chapter with a major plot twist that changes everything",
  "Write a chapter focused on character development and relationships",
  "Create an action-packed chapter with high stakes",
  "Write a chapter that reveals a major secret or revelation",
  "Create a chapter with emotional conflict and resolution",
  "Write a chapter that introduces a new important character",
  "Create a chapter with a climactic confrontation"
];

export default function ChapterGenerator({ onChapterGenerated, onClose }: ChapterGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('professional');
  const [tone, setTone] = useState('engaging');
  const [pov, setPov] = useState('third');
  const [length, setLength] = useState(1000);
  const [showTemplates, setShowTemplates] = useState(false);

  const { 
    generateChapter, 
    characters, 
    plot, 
    setting, 
    metadata,
    chapters 
  } = useBookStore();

  const handleGenerate = async () => {
    if (!title.trim() || !prompt.trim()) {
      toast.error('Please provide both a title and prompt');
      return;
    }

    try {
      setIsGenerating(true);

      // Build context from existing story elements
      const context = {
        plot: plot.summary,
        characters: characters.map(c => `${c.name} (${c.role}): ${c.description}`).join(', '),
        setting: setting.description,
        genre: metadata.genres[0] || 'Fantasy',
        theme: metadata.description || 'Adventure',
        previousChapters: chapters.slice(-3).map(c => c.title) // Last 3 chapters for context
      };

      const newChapter = await generateChapter({
        title,
        prompt,
        style: style as any,
        tone: tone as any,
        pov: pov as any,
        length,
        context
      });

      toast.success('Chapter generated successfully!');
      
      if (onChapterGenerated) {
        onChapterGenerated(newChapter.id);
      }
      
      // Reset form
      setTitle('');
      setPrompt('');
      
    } catch (error) {
      console.error('Error generating chapter:', error);
      toast.error('Failed to generate chapter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (template: string) => {
    setPrompt(template);
    setShowTemplates(false);
  };

  const handleQuickGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please provide a prompt');
      return;
    }

    // Auto-generate title if not provided
    if (!title.trim()) {
      const words = prompt.split(' ').slice(0, 4).join(' ');
      setTitle(`${words}...`);
    }

    await handleGenerate();
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaMagic className="text-blue-500" />
          Generate Chapter
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
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chapter Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter chapter title..."
            className="w-full"
          />
        </div>

        {/* Prompt Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Chapter Prompt
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-blue-600 hover:text-blue-700"
            >
              <FaLightbulb className="mr-1" />
              Templates
            </Button>
          </div>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to happen in this chapter..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
          />

          {/* Prompt Templates */}
          {showTemplates && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Templates:</h4>
              <div className="grid grid-cols-1 gap-2">
                {promptTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => handleTemplateSelect(template)}
                    className="text-left p-2 text-sm text-gray-600 hover:bg-white hover:text-gray-800 rounded border border-transparent hover:border-gray-200"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Generation Options */}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Point of View
            </label>
            <Select
              value={pov}
              onChange={(e) => setPov(e.target.value)}
              options={povs}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Length
            </label>
            <Select
              value={length.toString()}
              onChange={(e) => setLength(Number(e.target.value))}
              options={lengthOptions}
            />
          </div>
        </div>

        {/* Story Context Info */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Story Context:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Genre:</strong> {metadata.genres[0] || 'Not specified'}</p>
            <p><strong>Characters:</strong> {characters.length} created</p>
            <p><strong>Chapters:</strong> {chapters.length} existing</p>
            {plot.summary && <p><strong>Plot:</strong> {plot.summary.substring(0, 100)}...</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleQuickGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isGenerating ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <FaMagic className="mr-2" />
                Quick Generate
              </>
            )}
          </Button>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !title.trim() || !prompt.trim()}
            variant="outline"
            className="flex-1"
          >
            Generate with Title
          </Button>
        </div>
      </div>
    </Card>
  );
} 