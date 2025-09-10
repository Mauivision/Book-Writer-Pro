'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  FaLightbulb, 
  FaMagic, 
  FaRocket, 
  FaHeart, 
  FaBrain,
  FaEye,
  FaUsers,
  FaMap,
  FaClock,
  FaBook,
  FaQuoteLeft,
  FaPalette,
  FaStar,
  FaRedo,
  FaBookmark,
  FaShare,
  FaExpand,
  FaCompress,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
  FaFire,
  FaGem,
  FaCrown
} from 'react-icons/fa';

interface WritingPrompt {
  id: string;
  type: 'continuation' | 'inspiration' | 'challenge' | 'character' | 'setting' | 'dialogue' | 'emotion' | 'plot';
  category: 'creative' | 'technical' | 'emotional' | 'structural' | 'experimental';
  title: string;
  prompt: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  estimatedTime: string;
  tags: string[];
  inspiration: string;
  examples?: string[];
  tips?: string[];
  popularity: number;
  rating: number;
}

interface SmartWritingPromptsProps {
  currentText?: string;
  writingContext?: {
    genre?: string;
    mood?: string;
    characters?: string[];
    setting?: string;
    theme?: string;
  };
  onPromptSelect?: (prompt: WritingPrompt) => void;
  className?: string;
}

export function SmartWritingPrompts({ 
  currentText, 
  writingContext, 
  onPromptSelect, 
  className = '' 
}: SmartWritingPromptsProps) {
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [promptFilter, setPromptFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [favoritePrompts, setFavoritePrompts] = useState<string[]>([]);

  // Generate intelligent prompts based on context
  const generatePrompts = useCallback(async () => {
    setIsGenerating(true);

    try {
      // Simulate AI-powered prompt generation based on context
      const mockPrompts: WritingPrompt[] = [
        {
          id: '1',
          type: 'continuation',
          category: 'creative',
          title: 'Continue the Mystery',
          prompt: 'Your protagonist has just discovered a hidden door in the ancient library. As they reach for the handle, they hear footsteps approaching from behind. Continue the scene, focusing on the tension and mystery.',
          difficulty: 'medium',
          estimatedTime: '15-20 minutes',
          tags: ['mystery', 'tension', 'discovery', 'library', 'suspense'],
          inspiration: 'Build on the atmospheric tension you\'ve already established',
          examples: [
            'Focus on sensory details: the creak of the door, the sound of footsteps',
            'Show internal conflict: curiosity vs. fear',
            'Use short, punchy sentences to build tension'
          ],
          tips: [
            'Consider what\'s behind the door',
            'Think about who might be following',
            'Use the setting to enhance the mood'
          ],
          popularity: 8.5,
          rating: 4.7
        },
        {
          id: '2',
          type: 'character',
          category: 'emotional',
          title: 'Character Backstory Reveal',
          prompt: 'Write a scene where your main character reveals a painful secret from their past to someone they trust. Focus on the emotional weight and the impact on their relationship.',
          difficulty: 'hard',
          estimatedTime: '25-30 minutes',
          tags: ['character-development', 'emotional', 'backstory', 'trust', 'vulnerability'],
          inspiration: 'Deepen your character\'s emotional complexity',
          examples: [
            'Show the character\'s hesitation and internal struggle',
            'Include physical reactions and body language',
            'Explore the listener\'s response and support'
          ],
          tips: [
            'Make the secret meaningful to the plot',
            'Show character growth through vulnerability',
            'Use dialogue and internal monologue effectively'
          ],
          popularity: 9.2,
          rating: 4.8
        },
        {
          id: '3',
          type: 'dialogue',
          category: 'technical',
          title: 'Tension-Filled Conversation',
          prompt: 'Write a dialogue scene where two characters are having a seemingly normal conversation, but there\'s an underlying tension or hidden meaning. Use subtext to convey what\'s really happening.',
          difficulty: 'expert',
          estimatedTime: '20-25 minutes',
          tags: ['dialogue', 'subtext', 'tension', 'hidden-meaning', 'conversation'],
          inspiration: 'Master the art of subtext in dialogue',
          examples: [
            'Use pauses and silences effectively',
            'Include actions that contradict words',
            'Show what characters don\'t say'
          ],
          tips: [
            'Plan the hidden agenda beforehand',
            'Use body language and setting details',
            'Let readers infer the real meaning'
          ],
          popularity: 7.8,
          rating: 4.6
        },
        {
          id: '4',
          type: 'setting',
          category: 'creative',
          title: 'Atmospheric Location',
          prompt: 'Describe a location that perfectly captures the mood of your current scene. Use all five senses and make the setting feel alive and integral to the story.',
          difficulty: 'easy',
          estimatedTime: '10-15 minutes',
          tags: ['setting', 'atmosphere', 'sensory-details', 'mood', 'description'],
          inspiration: 'Enhance your world-building skills',
          examples: [
            'Include sounds, smells, textures, and tastes',
            'Show how the setting affects the characters',
            'Use the environment to reflect emotions'
          ],
          tips: [
            'Choose details that serve the story',
            'Avoid over-description',
            'Make the setting active, not passive'
          ],
          popularity: 6.9,
          rating: 4.4
        },
        {
          id: '5',
          type: 'emotion',
          category: 'emotional',
          title: 'Emotional Transformation',
          prompt: 'Write a scene where your character experiences a complete emotional transformation - from one extreme emotion to its opposite. Show the journey and the catalyst for change.',
          difficulty: 'hard',
          estimatedTime: '30-35 minutes',
          tags: ['emotion', 'transformation', 'character-arc', 'catalyst', 'journey'],
          inspiration: 'Explore deep emotional character development',
          examples: [
            'Start with the character\'s current emotional state',
            'Show the moment of realization or change',
            'Demonstrate the new emotional state'
          ],
          tips: [
            'Make the transformation believable',
            'Show the internal process',
            'Use the change to advance the plot'
          ],
          popularity: 8.1,
          rating: 4.7
        },
        {
          id: '6',
          type: 'plot',
          category: 'structural',
          title: 'Plot Twist Setup',
          prompt: 'Write a scene that subtly plants seeds for a future plot twist. Include clues and foreshadowing that readers might miss on first reading but will appreciate later.',
          difficulty: 'expert',
          estimatedTime: '25-30 minutes',
          tags: ['plot-twist', 'foreshadowing', 'clues', 'subtle', 'setup'],
          inspiration: 'Master the art of subtle foreshadowing',
          examples: [
            'Include seemingly innocent details',
            'Use character reactions and observations',
            'Plant clues in dialogue and action'
          ],
          tips: [
            'Plan the twist beforehand',
            'Make clues feel natural',
            'Don\'t make it too obvious'
          ],
          popularity: 9.5,
          rating: 4.9
        }
      ];

      // Filter prompts based on context
      let filteredPrompts = mockPrompts;
      
      if (writingContext?.genre) {
        // Filter by genre relevance
        filteredPrompts = filteredPrompts.filter(prompt => 
          prompt.tags.some(tag => 
            writingContext.genre?.toLowerCase().includes(tag) || 
            tag.includes(writingContext.genre?.toLowerCase() || '')
          )
        );
      }

      if (writingContext?.mood) {
        // Filter by mood relevance
        filteredPrompts = filteredPrompts.filter(prompt => 
          prompt.tags.some(tag => 
            writingContext.mood?.toLowerCase().includes(tag) || 
            tag.includes(writingContext.mood?.toLowerCase() || '')
          )
        );
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setPrompts(filteredPrompts);
    } catch (error) {
      console.error('Prompt generation failed:', error);
      setPrompts([]);
    } finally {
      setIsGenerating(false);
    }
  }, [writingContext]);

  // Get prompt type info
  const getPromptTypeInfo = (type: string) => {
    const types = {
      continuation: { icon: FaRocket, color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Continue' },
      inspiration: { icon: FaLightbulb, color: 'text-yellow-600 bg-yellow-50 border-yellow-200', label: 'Inspire' },
      challenge: { icon: FaFire, color: 'text-red-600 bg-red-50 border-red-200', label: 'Challenge' },
      character: { icon: FaUsers, color: 'text-green-600 bg-green-50 border-green-200', label: 'Character' },
      setting: { icon: FaMap, color: 'text-purple-600 bg-purple-50 border-purple-200', label: 'Setting' },
      dialogue: { icon: FaQuoteLeft, color: 'text-pink-600 bg-pink-50 border-pink-200', label: 'Dialogue' },
      emotion: { icon: FaHeart, color: 'text-red-600 bg-red-50 border-red-200', label: 'Emotion' },
      plot: { icon: FaBook, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', label: 'Plot' }
    };
    return types[type as keyof typeof types] || types.inspiration;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || colors.medium;
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons = {
      creative: FaPalette,
      technical: FaBrain,
      emotional: FaHeart,
      structural: FaBook,
      experimental: FaGem
    };
    return icons[category as keyof typeof icons] || FaLightbulb;
  };

  // Toggle favorite
  const toggleFavorite = (promptId: string) => {
    setFavoritePrompts(prev => 
      prev.includes(promptId) 
        ? prev.filter(id => id !== promptId)
        : [...prev, promptId]
    );
  };

  // Filter prompts
  const filteredPrompts = prompts.filter(prompt => {
    const matchesType = promptFilter === 'all' || prompt.type === promptFilter;
    const matchesDifficulty = difficultyFilter === 'all' || prompt.difficulty === difficultyFilter;
    return matchesType && matchesDifficulty;
  });

  useEffect(() => {
    generatePrompts();
  }, [generatePrompts]);

  return (
    <Card className={className}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FaLightbulb className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-semibold">Smart Writing Prompts</h3>
            {prompts.length > 0 && (
              <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">
                {prompts.length} prompts
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={generatePrompts}
              disabled={isGenerating}
              size="sm"
              variant="outline"
            >
              <FaRedo className="w-4 h-4 mr-1" />
              {isGenerating ? 'Generating...' : 'Refresh'}
            </Button>
            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="outline"
              size="sm"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-3">
          <select
            value={promptFilter}
            onChange={(e) => setPromptFilter(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="all">All Types</option>
            <option value="continuation">Continuation</option>
            <option value="inspiration">Inspiration</option>
            <option value="challenge">Challenge</option>
            <option value="character">Character</option>
            <option value="setting">Setting</option>
            <option value="dialogue">Dialogue</option>
            <option value="emotion">Emotion</option>
            <option value="plot">Plot</option>
          </select>
          
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="all">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        {/* Generation Status */}
        {isGenerating && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <FaMagic className="w-4 h-4 text-yellow-500 animate-pulse" />
              <span className="text-sm text-yellow-700 dark:text-yellow-300">
                Generating personalized writing prompts...
              </span>
            </div>
          </div>
        )}

        {/* Prompts List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredPrompts.length === 0 && !isGenerating ? (
            <div className="text-center py-8">
              <FaLightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">No Prompts Available</h4>
              <p className="text-gray-500 dark:text-gray-500">
                Try adjusting your filters or refresh to get new prompts
              </p>
            </div>
          ) : (
            filteredPrompts.map((prompt) => {
              const typeInfo = getPromptTypeInfo(prompt.type);
              const TypeIcon = typeInfo.icon;
              const CategoryIcon = getCategoryIcon(prompt.category);
              const isFavorite = favoritePrompts.includes(prompt.id);
              
              return (
                <div
                  key={prompt.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedPrompt?.id === prompt.id ? 'ring-2 ring-yellow-500' : ''
                  } ${typeInfo.color}`}
                  onClick={() => {
                    setSelectedPrompt(prompt);
                    if (onPromptSelect) {
                      onPromptSelect(prompt);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TypeIcon className="w-4 h-4" />
                        <CategoryIcon className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wide">
                          {typeInfo.label} • {prompt.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(prompt.difficulty)}`}>
                          {prompt.difficulty}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {prompt.estimatedTime}
                        </span>
                        <div className="flex items-center gap-1 ml-auto">
                          <FaStar className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs">{prompt.rating}</span>
                        </div>
                      </div>
                      
                      <h5 className="font-semibold mb-2">{prompt.title}</h5>
                      <p className="text-sm mb-2">{prompt.prompt}</p>
                      
                      {showDetails && (
                        <div className="mb-2">
                          <div className="text-xs font-medium text-gray-600 mb-1">Inspiration:</div>
                          <p className="text-xs text-gray-600 mb-2">{prompt.inspiration}</p>
                          
                          {prompt.examples && (
                            <div className="mb-2">
                              <div className="text-xs font-medium text-gray-600 mb-1">Examples:</div>
                              {prompt.examples.map((example, index) => (
                                <div key={index} className="text-xs text-gray-600 mb-1">
                                  • {example}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {prompt.tips && (
                            <div className="mb-2">
                              <div className="text-xs font-medium text-gray-600 mb-1">Tips:</div>
                              {prompt.tips.map((tip, index) => (
                                <div key={index} className="text-xs text-gray-600 mb-1">
                                  • {tip}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-1">
                            {prompt.tags.map((tag, index) => (
                              <span key={index} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(prompt.id);
                      }}
                      className="ml-2"
                    >
                      {isFavorite ? (
                        <FaBookmark className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <FaBookmark className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary */}
        {prompts.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold mb-2">Prompts Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Favorites:</span> 
                <span className="ml-2 text-yellow-600">{favoritePrompts.length}</span>
              </div>
              <div>
                <span className="font-medium">Expert Level:</span> 
                <span className="ml-2 text-red-600">{prompts.filter(p => p.difficulty === 'expert').length}</span>
              </div>
              <div>
                <span className="font-medium">Creative:</span> 
                <span className="ml-2 text-purple-600">{prompts.filter(p => p.category === 'creative').length}</span>
              </div>
              <div>
                <span className="font-medium">High Rated:</span> 
                <span className="ml-2 text-green-600">{prompts.filter(p => p.rating >= 4.7).length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
