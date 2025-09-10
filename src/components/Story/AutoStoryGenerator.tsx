'use client';

import { useState } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  FaMagic, 
  FaBook, 
  FaFileAlt, 
  FaSpinner, 
  FaDownload,
  FaEye,
  FaEdit,
  FaRocket,
  FaLightbulb,
  FaUsers,
  FaMap
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Genre {
  id: string;
  name: string;
  category: 'fiction' | 'non-fiction';
  description: string;
}

const genres: Genre[] = [
  // Fiction Genres
  { id: 'romance', name: 'Romance Fiction', category: 'fiction', description: 'Love stories and romantic relationships' },
  { id: 'fantasy', name: 'Fantasy', category: 'fiction', description: 'Magical worlds and supernatural elements' },
  { id: 'mystery', name: 'Mystery Fiction', category: 'fiction', description: 'Detective stories and crime solving' },
  { id: 'thriller', name: 'Thriller & Suspense', category: 'fiction', description: 'High-stakes action and suspense' },
  { id: 'scifi', name: 'Science Fiction', category: 'fiction', description: 'Futuristic technology and space exploration' },
  { id: 'historical', name: 'Historical Fiction', category: 'fiction', description: 'Stories set in the past' },
  { id: 'adventure', name: 'Adventure Fiction', category: 'fiction', description: 'Journeys and exploration' },
  
  // Non-Fiction Genres
  { id: 'self-help', name: 'Self-Help', category: 'non-fiction', description: 'Personal development and improvement' },
  { id: 'business', name: 'Business & Economics', category: 'non-fiction', description: 'Professional and business topics' },
  { id: 'health', name: 'Health & Wellness', category: 'non-fiction', description: 'Physical and mental health' },
  { id: 'history', name: 'History', category: 'non-fiction', description: 'Historical accounts and analysis' },
  { id: 'science', name: 'Sciences', category: 'non-fiction', description: 'Scientific topics and discoveries' },
  { id: 'memoir', name: 'Memoir', category: 'non-fiction', description: 'Personal life stories and experiences' },
  { id: 'general-non-fiction', name: 'General Non-Fiction', category: 'non-fiction', description: 'Informative and educational content' }
];

interface GenerationMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  estimatedTime: string;
}

const generationModes: GenerationMode[] = [
  {
    id: 'full-book',
    name: 'Generate Full Book',
    description: 'Create a complete book with all chapters',
    icon: <FaBook className="text-blue-500" />,
    estimatedTime: '5-10 minutes'
  },
  {
    id: 'outline',
    name: 'Generate Book Outline',
    description: 'Create a structured outline with chapter summaries',
    icon: <FaFileAlt className="text-green-500" />,
    estimatedTime: '2-3 minutes'
  },
  {
    id: 'story',
    name: 'Generate Story',
    description: 'Create a shorter story or novella',
    icon: <FaMagic className="text-purple-500" />,
    estimatedTime: '3-5 minutes'
  }
];

export default function AutoStoryGenerator() {
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [description, setDescription] = useState('');
  const [generationMode, setGenerationMode] = useState<string>('outline');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  const { 
    metadata, 
    addChapter, 
    updateMetadata,
    generateChapter,
    generatePlotIdeas,
    generateCharacterIdeas
  } = useBookStore();

  const handleGenerate = async () => {
    if (!selectedGenre || !description.trim()) {
      toast.error('Please select a genre and provide a description');
      return;
    }

    if (description.length < 30) {
      toast.error('Description must be at least 30 words');
      return;
    }

    if (description.length > 300) {
      toast.error('Description cannot exceed 300 words');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const genre = genres.find(g => g.id === selectedGenre);
      
      // Update metadata with the new book concept
      updateMetadata({
        ...metadata,
        title: `Generated ${genre?.name} Book`,
        genres: [selectedGenre],
        description: description
      });

      let result = '';
      
      switch (generationMode) {
        case 'full-book':
          result = await generateFullBook(genre!, description);
          break;
        case 'outline':
          result = await generateBookOutline(genre!, description);
          break;
        case 'story':
          result = await generateStory(genre!, description);
          break;
      }

      setGeneratedContent(result);
      setShowPreview(true);
      toast.success(`${generationModes.find(m => m.id === generationMode)?.name} completed!`);
      
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Sorry, I had trouble generating your content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFullBook = async (genre: Genre, description: string): Promise<string> => {
    // This would integrate with your AI generation system
    const prompt = `Create a complete ${genre.name} book about: ${description}
    
    Please include:
    - A compelling title
    - Table of contents with chapter titles
    - Complete chapters with engaging content
    - Character development
    - Plot progression
    - Satisfying conclusion
    
    Format the response with clear chapter divisions and engaging prose.`;
    
    // For now, return a placeholder - this would connect to your AI system
    return `# Generated ${genre.name} Book

## Title: [AI Generated Title]

### Table of Contents
1. Chapter 1: [Opening Chapter]
2. Chapter 2: [Development]
3. Chapter 3: [Rising Action]
4. Chapter 4: [Climax]
5. Chapter 5: [Resolution]

### Chapter 1: [Opening Chapter]

[AI would generate the full content here based on your description: "${description}"]

This is a placeholder for the AI-generated content. With proper API integration, this would contain the complete book with all chapters fully written.`;
  };

  const generateBookOutline = async (genre: Genre, description: string): Promise<string> => {
    const prompt = `Create a detailed book outline for a ${genre.name} about: ${description}
    
    Include:
    - Book title
    - Chapter titles and summaries
    - Key plot points
    - Character descriptions
    - Setting details
    - Theme exploration`;
    
    return `# Book Outline: ${genre.name}

## Title: [AI Generated Title]

### Overview
${description}

### Chapter Structure

**Chapter 1: [Opening]**
- Summary: [AI generated chapter summary]
- Key events: [Main plot points]
- Characters introduced: [Character list]

**Chapter 2: [Development]**
- Summary: [AI generated chapter summary]
- Key events: [Main plot points]
- Character development: [Character arcs]

[Additional chapters would be generated here...]

### Character Profiles
- [Main Character]: [AI generated character description]
- [Supporting Characters]: [AI generated descriptions]

### Setting Details
- [Primary Setting]: [AI generated setting description]
- [Secondary Settings]: [Additional locations]

### Themes
- [Theme 1]: [AI generated theme exploration]
- [Theme 2]: [AI generated theme exploration]`;
  };

  const generateStory = async (genre: Genre, description: string): Promise<string> => {
    const prompt = `Create a compelling ${genre.name} story about: ${description}
    
    Include:
    - Engaging opening
    - Character development
    - Plot progression
    - Satisfying conclusion`;
    
    return `# ${genre.name} Story

## [AI Generated Title]

[AI would generate a complete story here based on your description: "${description}"]

This is a placeholder for the AI-generated story content. With proper API integration, this would contain a complete, engaging story with full character development and plot progression.`;
  };

  const handleSaveToBook = () => {
    if (!generatedContent) return;

    // Parse the generated content and add chapters
    const lines = generatedContent.split('\n');
    let currentChapter = '';
    let chapterContent = '';

    for (const line of lines) {
      if (line.startsWith('**Chapter') || line.startsWith('### Chapter')) {
        if (currentChapter && chapterContent) {
          addChapter({
            title: currentChapter,
            content: chapterContent.trim(),
            wordCount: chapterContent.split(' ').length,
            order: 0,
            summary: chapterContent.substring(0, 200) + '...',
            status: 'draft'
          });
        }
        currentChapter = line.replace(/[*#]/g, '').trim();
        chapterContent = '';
      } else if (currentChapter) {
        chapterContent += line + '\n';
      }
    }

    // Add the last chapter
    if (currentChapter && chapterContent) {
      addChapter({
        title: currentChapter,
        content: chapterContent.trim(),
        wordCount: chapterContent.split(' ').length,
        order: 0,
        summary: chapterContent.substring(0, 200) + '...',
        status: 'draft'
      });
    }

    toast.success('Generated content saved to your book!');
    setShowPreview(false);
  };

  const selectedGenreData = genres.find(g => g.id === selectedGenre);
  const selectedModeData = generationModes.find(m => m.id === generationMode);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Book Generator</h1>
        <p className="text-gray-600">Generate a complete book about any topic in just a few minutes</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Genre Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Genre</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedGenre === genre.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{genre.name}</div>
                  <div className="text-sm text-gray-600">{genre.description}</div>
                  <div className="text-xs text-gray-500 mt-1 capitalize">{genre.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What is your book about?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your book idea, characters, plot, or topic in detail..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={300}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Description must have at least 30 words</span>
              <span>{description.length}/300</span>
            </div>
          </div>

          {/* Generation Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Generation Mode</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {generationModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setGenerationMode(mode.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    generationMode === mode.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {mode.icon}
                    <span className="font-medium text-gray-900">{mode.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">{mode.description}</div>
                  <div className="text-xs text-gray-500 mt-1">~{mode.estimatedTime}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedGenre || !description.trim() || description.length < 30}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              {isGenerating ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FaMagic className="mr-2" />
                  Generate {selectedModeData?.name}
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Generated Content Preview */}
      {showPreview && generatedContent && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Generated Content</h2>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowPreview(false)}
                variant="outline"
                size="sm"
              >
                <FaEye className="mr-2" />
                Hide Preview
              </Button>
              <Button
                onClick={handleSaveToBook}
                className="bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                <FaDownload className="mr-2" />
                Save to Book
              </Button>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">{generatedContent}</pre>
          </div>
        </Card>
      )}
    </div>
  );
} 