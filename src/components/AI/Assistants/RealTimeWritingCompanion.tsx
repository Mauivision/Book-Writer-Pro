'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  FaBrain, 
  FaLightbulb, 
  FaMagic, 
  FaSpinner,
  FaCheck,
  FaTimes,
  FaArrowRight,
  FaEye,
  FaPalette,
  FaQuoteLeft,
  FaRocket,
  FaStar,
  FaExpand,
  FaCompress
} from 'react-icons/fa';

interface WritingSuggestion {
  id: string;
  type: 'continuation' | 'improvement' | 'alternative' | 'inspiration' | 'style';
  text: string;
  confidence: number;
  context: string;
  reasoning: string;
}

interface RealTimeWritingCompanionProps {
  currentText: string;
  cursorPosition: number;
  onSuggestionApply?: (suggestion: WritingSuggestion) => void;
  onClose?: () => void;
  className?: string;
}

export function RealTimeWritingCompanion({ 
  currentText, 
  cursorPosition, 
  onSuggestionApply, 
  onClose,
  className = '' 
}: RealTimeWritingCompanionProps) {
  const [suggestions, setSuggestions] = useState<WritingSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<WritingSuggestion | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [companionMode, setCompanionMode] = useState<'creative' | 'analytical' | 'supportive'>('creative');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const debounceRef = useRef<NodeJS.Timeout>();

  // Generate real-time suggestions
  const generateSuggestions = useCallback(async () => {
    if (!currentText.trim() || currentText.length < 10) {
      setSuggestions([]);
      return;
    }

    setIsGenerating(true);

    try {
      // Get context around cursor
      const contextStart = Math.max(0, cursorPosition - 100);
      const contextEnd = Math.min(currentText.length, cursorPosition + 100);
      const context = currentText.substring(contextStart, contextEnd);
      
      // Simulate AI-powered suggestions based on context
      const mockSuggestions: WritingSuggestion[] = [
        {
          id: '1',
          type: 'continuation',
          text: 'The ancient door creaked open, revealing a chamber filled with golden light and the sound of distant whispers.',
          confidence: 0.89,
          context: context,
          reasoning: 'Continues the mysterious atmosphere with sensory details'
        },
        {
          id: '2',
          type: 'improvement',
          text: 'She hesitated at the threshold, her heart pounding with both fear and anticipation.',
          confidence: 0.85,
          context: context,
          reasoning: 'Adds emotional depth and character development'
        },
        {
          id: '3',
          type: 'alternative',
          text: 'The corridor stretched endlessly before her, each step echoing in the silence like a heartbeat.',
          confidence: 0.82,
          context: context,
          reasoning: 'Provides an alternative direction with atmospheric description'
        },
        {
          id: '4',
          type: 'inspiration',
          text: 'Memories of her grandmother\'s stories flooded back—tales of brave adventurers who had walked these very halls.',
          confidence: 0.78,
          context: context,
          reasoning: 'Connects to character backstory and adds depth'
        },
        {
          id: '5',
          type: 'style',
          text: 'The air itself seemed to hold its breath as she crossed the threshold into the unknown.',
          confidence: 0.91,
          context: context,
          reasoning: 'Enhances the atmospheric writing style'
        }
      ];

      // Filter suggestions based on companion mode
      let filteredSuggestions = mockSuggestions;
      if (companionMode === 'analytical') {
        filteredSuggestions = mockSuggestions.filter(s => s.type === 'improvement' || s.type === 'style');
      } else if (companionMode === 'supportive') {
        filteredSuggestions = mockSuggestions.filter(s => s.type === 'continuation' || s.type === 'inspiration');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      setSuggestions(filteredSuggestions.slice(0, 3)); // Show top 3 suggestions
    } catch (error) {
      console.error('Suggestion generation failed:', error);
      setSuggestions([]);
    } finally {
      setIsGenerating(false);
    }
  }, [currentText, cursorPosition, companionMode]);

  // Debounced suggestion generation
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      generateSuggestions();
    }, 1000); // 1 second debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [generateSuggestions]);

  // Apply suggestion
  const applySuggestion = useCallback((suggestion: WritingSuggestion) => {
    if (onSuggestionApply) {
      onSuggestionApply(suggestion);
    }
  }, [onSuggestionApply]);

  // Get suggestion type info
  const getSuggestionTypeInfo = (type: string) => {
    const types = {
      continuation: { icon: FaArrowRight, color: 'text-green-600 bg-green-50 border-green-200', label: 'Continue' },
      improvement: { icon: FaStar, color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Improve' },
      alternative: { icon: FaPalette, color: 'text-purple-600 bg-purple-50 border-purple-200', label: 'Alternative' },
      inspiration: { icon: FaLightbulb, color: 'text-yellow-600 bg-yellow-50 border-yellow-200', label: 'Inspire' },
      style: { icon: FaQuoteLeft, color: 'text-pink-600 bg-pink-50 border-pink-200', label: 'Style' }
    };
    return types[type as keyof typeof types] || types.continuation;
  };

  return (
    <Card className={`${className} ${isExpanded ? 'w-96' : 'w-80'}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaBrain className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-sm">AI Companion</h3>
            {isGenerating && <FaSpinner className="w-4 h-4 text-blue-500 animate-spin" />}
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <FaCompress className="w-3 h-3" /> : <FaExpand className="w-3 h-3" />}
            </Button>
            {onClose && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
              >
                <FaTimes className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mb-4">
          <div className="flex gap-1">
            {[
              { key: 'creative', label: 'Creative', icon: FaRocket },
              { key: 'analytical', label: 'Analytical', icon: FaStar },
              { key: 'supportive', label: 'Supportive', icon: FaLightbulb }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                onClick={() => setCompanionMode(key as any)}
                variant={companionMode === key ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
              >
                <Icon className="w-3 h-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {suggestions.length === 0 && !isGenerating ? (
            <div className="text-center py-4">
              <FaMagic className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Keep writing for suggestions...</p>
            </div>
          ) : (
            suggestions.map((suggestion) => {
              const typeInfo = getSuggestionTypeInfo(suggestion.type);
              const Icon = typeInfo.icon;
              
              return (
                <div
                  key={suggestion.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                    selectedSuggestion?.id === suggestion.id ? 'ring-2 ring-blue-500' : ''
                  } ${typeInfo.color}`}
                  onClick={() => setSelectedSuggestion(suggestion)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-3 h-3" />
                        <span className="text-xs font-medium uppercase tracking-wide">
                          {typeInfo.label}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {Math.round(suggestion.confidence * 100)}%
                        </span>
                      </div>
                      
                      <p className="text-sm leading-relaxed mb-2">
                        {suggestion.text}
                      </p>
                      
                      {showDetails && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          <strong>Why:</strong> {suggestion.reasoning}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        applySuggestion(suggestion);
                      }}
                      className="ml-2"
                    >
                      <FaCheck className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
            >
              <FaEye className="w-3 h-3 mr-1" />
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
            
            <div className="text-xs text-gray-500">
              {suggestions.length} suggestions
            </div>
          </div>
        </div>

        {/* Status */}
        {isGenerating && (
          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-700 dark:text-blue-300">
            <FaSpinner className="w-3 h-3 inline mr-1 animate-spin" />
            Analyzing your writing...
          </div>
        )}
      </div>
    </Card>
  );
}
