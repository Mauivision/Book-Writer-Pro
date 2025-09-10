'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  FaPalette, 
  FaMagic, 
  FaLightbulb, 
  FaArrowRight,
  FaStar,
  FaExpand,
  FaCompress,
  FaEye,
  FaRocket,
  FaBrain,
  FaQuoteLeft,
  FaTimes
} from 'react-icons/fa';

interface StyleEnhancement {
  id: string;
  type: 'rephrase' | 'enhance' | 'simplify' | 'expand' | 'vary' | 'dramatize' | 'sensory';
  message: string;
  suggestion: string;
  start: number;
  end: number;
  originalText: string;
  confidence: number;
  impact: 'subtle' | 'moderate' | 'dramatic';
  category: 'dialogue' | 'description' | 'action' | 'emotion' | 'setting';
}

interface StyleEnhancerProps {
  text: string;
  onEnhancementSelect?: (enhancement: StyleEnhancement) => void;
  onEnhancementApply?: (enhancement: StyleEnhancement) => void;
  className?: string;
}

export function StyleEnhancer({ 
  text, 
  onEnhancementSelect, 
  onEnhancementApply, 
  className = '' 
}: StyleEnhancerProps) {
  const [enhancements, setEnhancements] = useState<StyleEnhancement[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedEnhancement, setSelectedEnhancement] = useState<StyleEnhancement | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [styleMode, setStyleMode] = useState<'creative' | 'professional' | 'dramatic' | 'minimalist'>('creative');
  const [focusArea, setFocusArea] = useState<'all' | 'dialogue' | 'description' | 'action' | 'emotion'>('all');

  // Analyze text for style enhancements
  const analyzeStyle = useCallback(async () => {
    if (!text.trim()) {
      setEnhancements([]);
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI-powered style analysis
      const mockEnhancements: StyleEnhancement[] = [
        {
          id: '1',
          type: 'enhance',
          message: 'Add sensory details to make this more vivid',
          suggestion: 'The ancient castle loomed ominously against the stormy sky, its weathered stones whispering secrets of centuries past, while the wind howled through its empty corridors like the cries of forgotten souls.',
          start: 0,
          end: 30,
          originalText: 'The castle was old and scary.',
          confidence: 0.92,
          impact: 'dramatic',
          category: 'description'
        },
        {
          id: '2',
          type: 'rephrase',
          message: 'Make this dialogue more natural and engaging',
          suggestion: '"I can\'t believe you\'d do something like this," she whispered, her voice trembling with a mixture of anger and hurt.',
          start: 50,
          end: 80,
          originalText: '"I am very angry with you," she said.',
          confidence: 0.88,
          impact: 'moderate',
          category: 'dialogue'
        },
        {
          id: '3',
          type: 'dramatize',
          message: 'Add more tension and drama to this action sequence',
          suggestion: 'With a thunderous roar, the dragon\'s massive wings unfurled, casting shadows that danced across the battlefield as flames erupted from its gaping maw.',
          start: 100,
          end: 130,
          originalText: 'The dragon flew and breathed fire.',
          confidence: 0.95,
          impact: 'dramatic',
          category: 'action'
        },
        {
          id: '4',
          type: 'sensory',
          message: 'Incorporate sensory details to bring this scene to life',
          suggestion: 'The forest floor crunched softly beneath her feet, while the earthy scent of damp moss mingled with the sweet fragrance of wildflowers, and shafts of golden sunlight filtered through the canopy above.',
          start: 150,
          end: 180,
          originalText: 'She walked through the forest.',
          confidence: 0.87,
          impact: 'moderate',
          category: 'setting'
        },
        {
          id: '5',
          type: 'vary',
          message: 'Vary sentence structure for better rhythm and flow',
          suggestion: 'The hero stood tall. Despite the odds, despite the fear gnawing at his heart, he would not back down. This was his moment.',
          start: 200,
          end: 220,
          originalText: 'The hero was brave and he would not give up.',
          confidence: 0.83,
          impact: 'subtle',
          category: 'emotion'
        }
      ];

      // Filter enhancements based on focus area
      let filteredEnhancements = mockEnhancements;
      if (focusArea !== 'all') {
        filteredEnhancements = mockEnhancements.filter(e => e.category === focusArea);
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setEnhancements(filteredEnhancements);
    } catch (error) {
      console.error('Style analysis failed:', error);
      setEnhancements([]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, focusArea]);

  // Apply enhancement
  const applyEnhancement = useCallback((enhancement: StyleEnhancement) => {
    if (onEnhancementApply) {
      onEnhancementApply(enhancement);
    }
  }, [onEnhancementApply]);

  // Select enhancement
  const selectEnhancement = useCallback((enhancement: StyleEnhancement) => {
    setSelectedEnhancement(enhancement);
    if (onEnhancementSelect) {
      onEnhancementSelect(enhancement);
    }
  }, [onEnhancementSelect]);

  // Get enhancement type info
  const getEnhancementTypeInfo = (type: string) => {
    const types = {
      rephrase: { icon: FaQuoteLeft, color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Rephrase' },
      enhance: { icon: FaStar, color: 'text-purple-600 bg-purple-50 border-purple-200', label: 'Enhance' },
      simplify: { icon: FaCompress, color: 'text-green-600 bg-green-50 border-green-200', label: 'Simplify' },
      expand: { icon: FaExpand, color: 'text-orange-600 bg-orange-50 border-orange-200', label: 'Expand' },
      vary: { icon: FaPalette, color: 'text-pink-600 bg-pink-50 border-pink-200', label: 'Vary' },
      dramatize: { icon: FaRocket, color: 'text-red-600 bg-red-50 border-red-200', label: 'Dramatize' },
      sensory: { icon: FaEye, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', label: 'Sensory' }
    };
    return types[type as keyof typeof types] || types.enhance;
  };

  // Get impact color
  const getImpactColor = (impact: string) => {
    const colors = {
      subtle: 'bg-green-100 text-green-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      dramatic: 'bg-red-100 text-red-800'
    };
    return colors[impact as keyof typeof colors] || colors.moderate;
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors = {
      dialogue: 'bg-blue-100 text-blue-800',
      description: 'bg-purple-100 text-purple-800',
      action: 'bg-red-100 text-red-800',
      emotion: 'bg-pink-100 text-pink-800',
      setting: 'bg-green-100 text-green-800'
    };
    return colors[category as keyof typeof colors] || colors.description;
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeStyle();
    }, 500); // Debounce analysis

    return () => clearTimeout(timeoutId);
  }, [analyzeStyle]);

  if (!text.trim()) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <FaPalette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
          No Text to Enhance
        </h3>
        <p className="text-gray-500 dark:text-gray-500">
          Start writing to see style enhancement suggestions
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
            <FaPalette className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-semibold">Style Enhancer</h3>
            {enhancements.length > 0 && (
              <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-full">
                {enhancements.length} suggestions
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="outline"
              size="sm"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Style Mode:</span>
              <select
                value={styleMode}
                onChange={(e) => setStyleMode(e.target.value as any)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
              >
                <option value="creative">Creative</option>
                <option value="professional">Professional</option>
                <option value="dramatic">Dramatic</option>
                <option value="minimalist">Minimalist</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Focus:</span>
              <select
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value as any)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
              >
                <option value="all">All Areas</option>
                <option value="dialogue">Dialogue</option>
                <option value="description">Description</option>
                <option value="action">Action</option>
                <option value="emotion">Emotion</option>
              </select>
            </div>
          </div>
        </div>

        {/* Analysis Status */}
        {isAnalyzing && (
          <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <FaBrain className="w-4 h-4 text-purple-500 animate-pulse" />
              <span className="text-sm text-purple-700 dark:text-purple-300">
                Analyzing writing style and generating enhancements...
              </span>
            </div>
          </div>
        )}

        {/* Enhancements List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {enhancements.length === 0 && !isAnalyzing ? (
            <div className="text-center py-8">
              <FaStar className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-green-600 mb-2">Excellent Style!</h4>
              <p className="text-gray-600 dark:text-gray-400">
                No style enhancements needed
              </p>
            </div>
          ) : (
            enhancements.map((enhancement) => {
              const typeInfo = getEnhancementTypeInfo(enhancement.type);
              const Icon = typeInfo.icon;
              
              return (
                <div
                  key={enhancement.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedEnhancement?.id === enhancement.id ? 'ring-2 ring-purple-500' : ''
                  } ${typeInfo.color}`}
                  onClick={() => selectEnhancement(enhancement)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wide">
                          {typeInfo.label}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(enhancement.impact)}`}>
                          {enhancement.impact}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(enhancement.category)}`}>
                          {enhancement.category}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {Math.round(enhancement.confidence * 100)}% confidence
                        </span>
                      </div>
                      
                      <p className="text-sm font-medium mb-2">{enhancement.message}</p>
                      
                      {showDetails && (
                        <div className="mb-2">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            <strong>Original:</strong> "{enhancement.originalText}"
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border-l-4 border-purple-500">
                        <p className="text-sm">
                          <strong>Enhancement:</strong> {enhancement.suggestion}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        applyEnhancement(enhancement);
                      }}
                      className="ml-2"
                    >
                      <FaArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary */}
        {enhancements.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Dramatic Impact:</span> {enhancements.filter(e => e.impact === 'dramatic').length}
              </div>
              <div>
                <span className="font-medium">Moderate Impact:</span> {enhancements.filter(e => e.impact === 'moderate').length}
              </div>
              <div>
                <span className="font-medium">Subtle Impact:</span> {enhancements.filter(e => e.impact === 'subtle').length}
              </div>
              <div>
                <span className="font-medium">High Confidence:</span> {enhancements.filter(e => e.confidence > 0.9).length}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
