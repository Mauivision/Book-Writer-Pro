'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  FaBrain, 
  FaChartLine, 
  FaEye, 
  FaHeart, 
  FaLightbulb,
  FaMagic,
  FaPalette,
  FaQuoteLeft,
  FaRocket,
  FaStar,
  FaUsers,
  FaClock,
  FaBook,
  FaExpand,
  FaCompress,
  FaTimes,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';

interface WritingMetrics {
  readability: {
    score: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    description: string;
  };
  emotionalTone: {
    primary: string;
    secondary: string;
    intensity: number;
    description: string;
  };
  pacing: {
    score: number;
    description: string;
    suggestions: string[];
  };
  characterDevelopment: {
    score: number;
    description: string;
    suggestions: string[];
  };
  dialogueQuality: {
    score: number;
    description: string;
    suggestions: string[];
  };
  descriptiveRichness: {
    score: number;
    description: string;
    suggestions: string[];
  };
}

interface WritingPatterns {
  sentenceLength: {
    average: number;
    variety: number;
    description: string;
  };
  wordChoice: {
    complexity: number;
    variety: number;
    description: string;
  };
  paragraphStructure: {
    averageLength: number;
    variety: number;
    description: string;
  };
  repetition: {
    words: string[];
    phrases: string[];
    description: string;
  };
  transitions: {
    score: number;
    description: string;
    suggestions: string[];
  };
}

interface IntelligentTextAnalyzerProps {
  text: string;
  onInsightSelect?: (insight: any) => void;
  className?: string;
}

export function IntelligentTextAnalyzer({ 
  text, 
  onInsightSelect, 
  className = '' 
}: IntelligentTextAnalyzerProps) {
  const [metrics, setMetrics] = useState<WritingMetrics | null>(null);
  const [patterns, setPatterns] = useState<WritingPatterns | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [analysisDepth, setAnalysisDepth] = useState<'basic' | 'detailed' | 'comprehensive'>('detailed');

  // Analyze text for writing metrics and patterns
  const analyzeText = useCallback(async () => {
    if (!text.trim() || text.length < 50) {
      setMetrics(null);
      setPatterns(null);
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate comprehensive AI analysis
      const mockMetrics: WritingMetrics = {
        readability: {
          score: 78,
          level: 'intermediate',
          description: 'Your writing is accessible and engaging, with good sentence variety and clear structure.'
        },
        emotionalTone: {
          primary: 'mysterious',
          secondary: 'tense',
          intensity: 7.2,
          description: 'Strong atmospheric tension with underlying mystery that keeps readers engaged.'
        },
        pacing: {
          score: 8.1,
          description: 'Well-paced narrative with good balance of action and reflection.',
          suggestions: [
            'Consider adding more rapid-fire dialogue in tense moments',
            'Vary sentence length to create rhythm',
            'Use shorter paragraphs for action sequences'
          ]
        },
        characterDevelopment: {
          score: 7.5,
          description: 'Good character depth with clear motivations and growth.',
          suggestions: [
            'Add more internal monologue to show character thoughts',
            'Include character backstory through subtle details',
            'Show character relationships through dialogue and actions'
          ]
        },
        dialogueQuality: {
          score: 8.3,
          description: 'Natural dialogue that advances plot and reveals character.',
          suggestions: [
            'Add more subtext to conversations',
            'Vary speech patterns between characters',
            'Include more emotional reactions in dialogue'
          ]
        },
        descriptiveRichness: {
          score: 7.8,
          description: 'Vivid descriptions that create strong atmosphere.',
          suggestions: [
            'Add more sensory details (smell, touch, taste)',
            'Use metaphors and similes for deeper imagery',
            'Include environmental details that reflect mood'
          ]
        }
      };

      const mockPatterns: WritingPatterns = {
        sentenceLength: {
          average: 18.5,
          variety: 7.2,
          description: 'Good variety in sentence length, creating natural rhythm.'
        },
        wordChoice: {
          complexity: 6.8,
          variety: 8.1,
          description: 'Rich vocabulary with good word variety and appropriate complexity.'
        },
        paragraphStructure: {
          averageLength: 4.2,
          variety: 6.5,
          description: 'Well-structured paragraphs with good length variation.'
        },
        repetition: {
          words: ['very', 'really', 'quite'],
          phrases: ['it was', 'there was', 'he could see'],
          description: 'Minor repetitive patterns detected - consider varying word choice.'
        },
        transitions: {
          score: 7.9,
          description: 'Smooth transitions between ideas and scenes.',
          suggestions: [
            'Add more transitional phrases between paragraphs',
            'Use scene breaks for major time/location changes',
            'Include character reactions as natural transitions'
          ]
        }
      };

      // Simulate API delay based on analysis depth
      const delay = analysisDepth === 'comprehensive' ? 2500 : 
                   analysisDepth === 'detailed' ? 1800 : 1200;
      
      await new Promise(resolve => setTimeout(resolve, delay));

      setMetrics(mockMetrics);
      setPatterns(mockPatterns);
    } catch (error) {
      console.error('Text analysis failed:', error);
      setMetrics(null);
      setPatterns(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, analysisDepth]);

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Get score icon
  const getScoreIcon = (score: number) => {
    if (score >= 8) return FaStar;
    if (score >= 6) return FaHeart;
    return FaLightbulb;
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeText();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [analyzeText]);

  if (!text.trim()) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <FaBrain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
          No Text to Analyze
        </h3>
        <p className="text-gray-500 dark:text-gray-500">
          Write at least 50 characters to see intelligent analysis
        </p>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FaBrain className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-semibold">Intelligent Text Analysis</h3>
            {metrics && (
              <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-full">
                {Math.round((metrics.readability.score + metrics.pacing.score + metrics.characterDevelopment.score + metrics.dialogueQuality.score + metrics.descriptiveRichness.score) / 5)}% overall
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={analysisDepth}
              onChange={(e) => setAnalysisDepth(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
            >
              <option value="basic">Basic</option>
              <option value="detailed">Detailed</option>
              <option value="comprehensive">Comprehensive</option>
            </select>
            
            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="outline"
              size="sm"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </div>

        {/* Analysis Status */}
        {isAnalyzing && (
          <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <FaMagic className="w-4 h-4 text-purple-500 animate-pulse" />
              <span className="text-sm text-purple-700 dark:text-purple-300">
                Analyzing writing patterns and metrics...
              </span>
            </div>
          </div>
        )}

        {/* Metrics Overview */}
        {metrics && (
          <div className="mb-6">
            <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
              <FaChartLine className="w-4 h-4" />
              Writing Metrics
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Readability */}
              <div className={`p-4 rounded-lg border ${getScoreColor(metrics.readability.score)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {React.createElement(getScoreIcon(metrics.readability.score), { className: "w-4 h-4" })}
                    <span className="font-medium">Readability</span>
                  </div>
                  <span className="text-lg font-bold">{metrics.readability.score}/10</span>
                </div>
                <p className="text-sm mb-2">{metrics.readability.description}</p>
                <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                  {metrics.readability.level}
                </span>
              </div>

              {/* Emotional Tone */}
              <div className="p-4 rounded-lg border bg-pink-50 border-pink-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FaHeart className="w-4 h-4 text-pink-600" />
                    <span className="font-medium">Emotional Tone</span>
                  </div>
                  <span className="text-lg font-bold">{metrics.emotionalTone.intensity}/10</span>
                </div>
                <p className="text-sm mb-2">{metrics.emotionalTone.description}</p>
                <div className="flex gap-1">
                  <span className="text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-800">
                    {metrics.emotionalTone.primary}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-800">
                    {metrics.emotionalTone.secondary}
                  </span>
                </div>
              </div>

              {/* Pacing */}
              <div className={`p-4 rounded-lg border ${getScoreColor(metrics.pacing.score)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FaRocket className="w-4 h-4" />
                    <span className="font-medium">Pacing</span>
                  </div>
                  <span className="text-lg font-bold">{metrics.pacing.score}/10</span>
                </div>
                <p className="text-sm mb-2">{metrics.pacing.description}</p>
                {showDetails && (
                  <div className="mt-2">
                    {metrics.pacing.suggestions.map((suggestion, index) => (
                      <div key={index} className="text-xs text-gray-600 mb-1">
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Character Development */}
              <div className={`p-4 rounded-lg border ${getScoreColor(metrics.characterDevelopment.score)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FaUsers className="w-4 h-4" />
                    <span className="font-medium">Character Development</span>
                  </div>
                  <span className="text-lg font-bold">{metrics.characterDevelopment.score}/10</span>
                </div>
                <p className="text-sm mb-2">{metrics.characterDevelopment.description}</p>
                {showDetails && (
                  <div className="mt-2">
                    {metrics.characterDevelopment.suggestions.map((suggestion, index) => (
                      <div key={index} className="text-xs text-gray-600 mb-1">
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dialogue Quality */}
              <div className={`p-4 rounded-lg border ${getScoreColor(metrics.dialogueQuality.score)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FaQuoteLeft className="w-4 h-4" />
                    <span className="font-medium">Dialogue Quality</span>
                  </div>
                  <span className="text-lg font-bold">{metrics.dialogueQuality.score}/10</span>
                </div>
                <p className="text-sm mb-2">{metrics.dialogueQuality.description}</p>
                {showDetails && (
                  <div className="mt-2">
                    {metrics.dialogueQuality.suggestions.map((suggestion, index) => (
                      <div key={index} className="text-xs text-gray-600 mb-1">
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Descriptive Richness */}
              <div className={`p-4 rounded-lg border ${getScoreColor(metrics.descriptiveRichness.score)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FaPalette className="w-4 h-4" />
                    <span className="font-medium">Descriptive Richness</span>
                  </div>
                  <span className="text-lg font-bold">{metrics.descriptiveRichness.score}/10</span>
                </div>
                <p className="text-sm mb-2">{metrics.descriptiveRichness.description}</p>
                {showDetails && (
                  <div className="mt-2">
                    {metrics.descriptiveRichness.suggestions.map((suggestion, index) => (
                      <div key={index} className="text-xs text-gray-600 mb-1">
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Writing Patterns */}
        {patterns && (
          <div>
            <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
              <FaEye className="w-4 h-4" />
              Writing Patterns
            </h4>
            
            <div className="space-y-4">
              {/* Sentence Length */}
              <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Sentence Length</span>
                  <span className="text-sm text-gray-600">{patterns.sentenceLength.average} words avg</span>
                </div>
                <p className="text-sm mb-2">{patterns.sentenceLength.description}</p>
                <div className="text-xs text-gray-600">
                  Variety Score: {patterns.sentenceLength.variety}/10
                </div>
              </div>

              {/* Word Choice */}
              <div className="p-4 rounded-lg border bg-green-50 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Word Choice</span>
                  <span className="text-sm text-gray-600">Complexity: {patterns.wordChoice.complexity}/10</span>
                </div>
                <p className="text-sm mb-2">{patterns.wordChoice.description}</p>
                <div className="text-xs text-gray-600">
                  Variety Score: {patterns.wordChoice.variety}/10
                </div>
              </div>

              {/* Repetition */}
              <div className="p-4 rounded-lg border bg-yellow-50 border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Repetition Analysis</span>
                  <span className="text-sm text-gray-600">{patterns.repetition.words.length} words, {patterns.repetition.phrases.length} phrases</span>
                </div>
                <p className="text-sm mb-2">{patterns.repetition.description}</p>
                {patterns.repetition.words.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-600 mb-1">Repeated words:</div>
                    <div className="flex flex-wrap gap-1">
                      {patterns.repetition.words.map((word, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Transitions */}
              <div className="p-4 rounded-lg border bg-purple-50 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Transitions</span>
                  <span className="text-sm text-gray-600">{patterns.transitions.score}/10</span>
                </div>
                <p className="text-sm mb-2">{patterns.transitions.description}</p>
                {showDetails && (
                  <div className="mt-2">
                    {patterns.transitions.suggestions.map((suggestion, index) => (
                      <div key={index} className="text-xs text-gray-600 mb-1">
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        {metrics && patterns && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold mb-3">Analysis Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Overall Quality:</span> 
                <span className="ml-2 text-green-600 font-semibold">Strong</span>
              </div>
              <div>
                <span className="font-medium">Areas to Focus:</span> 
                <span className="ml-2 text-blue-600">Character Development</span>
              </div>
              <div>
                <span className="font-medium">Strengths:</span> 
                <span className="ml-2 text-green-600">Dialogue, Pacing</span>
              </div>
              <div>
                <span className="font-medium">Improvement:</span> 
                <span className="ml-2 text-yellow-600">Word Variety</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
