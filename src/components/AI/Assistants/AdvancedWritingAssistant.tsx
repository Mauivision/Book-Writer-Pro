'use client';

import { useState, useEffect, useCallback } from 'react';
import { useEditor } from '@tiptap/react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  FaMagic, 
  FaSpellCheck, 
  FaLightbulb, 
  FaPalette, 
  FaArrowRight,
  FaCheck,
  FaTimes,
  FaEye,
  FaBrain,
  FaRocket,
  FaStar,
  FaQuoteLeft,
  FaExpand,
  FaCompress
} from 'react-icons/fa';

interface WritingError {
  id: string;
  type: 'grammar' | 'style' | 'clarity' | 'tone' | 'repetition' | 'flow';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
  start: number;
  end: number;
  originalText: string;
}

interface StyleSuggestion {
  id: string;
  type: 'rephrase' | 'enhance' | 'simplify' | 'expand' | 'vary';
  message: string;
  suggestion: string;
  start: number;
  end: number;
  originalText: string;
  confidence: number;
}

interface AdvancedWritingAssistantProps {
  editor: any;
  onClose: () => void;
}

export function AdvancedWritingAssistant({ editor, onClose }: AdvancedWritingAssistantProps) {
  const [errors, setErrors] = useState<WritingError[]>([]);
  const [suggestions, setSuggestions] = useState<StyleSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedError, setSelectedError] = useState<WritingError | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<StyleSuggestion | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'quick' | 'deep' | 'style'>('quick');

  // Analyze text for errors and suggestions
  const analyzeText = useCallback(async (mode: 'quick' | 'deep' | 'style' = 'quick') => {
    if (!editor) return;

    setIsAnalyzing(true);
    const text = editor.getText();
    const html = editor.getHTML();

    try {
      // Simulate AI analysis (replace with actual API calls)
      const mockErrors: WritingError[] = [
        {
          id: '1',
          type: 'grammar',
          severity: 'medium',
          message: 'Consider using active voice',
          suggestion: 'The hero defeated the dragon',
          start: 0,
          end: 20,
          originalText: 'The dragon was defeated by the hero'
        },
        {
          id: '2',
          type: 'repetition',
          severity: 'low',
          message: 'Word repetition detected',
          suggestion: 'alternative, substitute, replacement',
          start: 50,
          end: 60,
          originalText: 'very very'
        }
      ];

      const mockSuggestions: StyleSuggestion[] = [
        {
          id: '1',
          type: 'enhance',
          message: 'Make this more vivid and engaging',
          suggestion: 'The ancient castle loomed ominously against the stormy sky, its weathered stones whispering secrets of centuries past.',
          start: 100,
          end: 120,
          originalText: 'The castle was old and scary.',
          confidence: 0.85
        },
        {
          id: '2',
          type: 'rephrase',
          message: 'Consider a more elegant phrasing',
          suggestion: 'She gazed thoughtfully into the distance',
          start: 150,
          end: 170,
          originalText: 'She looked at the far away place',
          confidence: 0.92
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setErrors(mockErrors);
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [editor]);

  // Apply suggestion to editor
  const applySuggestion = useCallback((suggestion: WritingError | StyleSuggestion) => {
    if (!editor) return;

    const { start, end, suggestion: suggestedText } = suggestion;
    editor.chain()
      .focus()
      .setTextSelection({ from: start, to: end })
      .insertContent(suggestedText)
      .run();
  }, [editor]);

  // Highlight text in editor
  const highlightText = useCallback((start: number, end: number, type: 'error' | 'suggestion') => {
    if (!editor) return;

    editor.chain()
      .focus()
      .setTextSelection({ from: start, to: end })
      .run();
  }, [editor]);

  // Get error type color
  const getErrorTypeColor = (type: string) => {
    const colors = {
      grammar: 'text-red-600 bg-red-50 border-red-200',
      style: 'text-orange-600 bg-orange-50 border-orange-200',
      clarity: 'text-blue-600 bg-blue-50 border-blue-200',
      tone: 'text-purple-600 bg-purple-50 border-purple-200',
      repetition: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      flow: 'text-green-600 bg-green-50 border-green-200'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  // Get suggestion type color
  const getSuggestionTypeColor = (type: string) => {
    const colors = {
      rephrase: 'text-blue-600 bg-blue-50 border-blue-200',
      enhance: 'text-green-600 bg-green-50 border-green-200',
      simplify: 'text-orange-600 bg-orange-50 border-orange-200',
      expand: 'text-purple-600 bg-purple-50 border-purple-200',
      vary: 'text-pink-600 bg-pink-50 border-pink-200'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  useEffect(() => {
    if (editor) {
      analyzeText(analysisMode);
    }
  }, [editor, analysisMode, analyzeText]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaBrain className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Advanced Writing Assistant</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="outline"
                size="sm"
              >
                {showDetails ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
                {showDetails ? 'Compact' : 'Detailed'}
              </Button>
              <Button onClick={onClose} variant="outline" size="sm">
                <FaTimes className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Analysis Controls */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Analysis Mode:</span>
                <div className="flex gap-1">
                  {[
                    { key: 'quick', label: 'Quick', icon: FaRocket },
                    { key: 'deep', label: 'Deep', icon: FaBrain },
                    { key: 'style', label: 'Style', icon: FaPalette }
                  ].map(({ key, label, icon: Icon }) => (
                    <Button
                      key={key}
                      onClick={() => setAnalysisMode(key as any)}
                      variant={analysisMode === key ? 'default' : 'outline'}
                      size="sm"
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={() => analyzeText(analysisMode)}
                disabled={isAnalyzing}
                className="ml-auto"
              >
                {isAnalyzing ? (
                  <>
                    <FaSpellCheck className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaMagic className="w-4 h-4 mr-2" />
                    Re-analyze
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Errors Panel */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FaSpellCheck className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold">Writing Issues</h3>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {errors.length}
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {errors.map((error) => (
                  <div
                    key={error.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedError?.id === error.id ? 'ring-2 ring-blue-500' : ''
                    } ${getErrorTypeColor(error.type)}`}
                    onClick={() => {
                      setSelectedError(error);
                      highlightText(error.start, error.end, 'error');
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium uppercase tracking-wide">
                            {error.type}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            error.severity === 'high' ? 'bg-red-100 text-red-800' :
                            error.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {error.severity}
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-1">{error.message}</p>
                        {showDetails && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            "{error.originalText}"
                          </div>
                        )}
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>Suggestion:</strong> {error.suggestion}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          applySuggestion(error);
                        }}
                        className="ml-2"
                      >
                        <FaCheck className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions Panel */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FaLightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">Style Suggestions</h3>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  {suggestions.length}
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedSuggestion?.id === suggestion.id ? 'ring-2 ring-blue-500' : ''
                    } ${getSuggestionTypeColor(suggestion.type)}`}
                    onClick={() => {
                      setSelectedSuggestion(suggestion);
                      highlightText(suggestion.start, suggestion.end, 'suggestion');
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium uppercase tracking-wide">
                            {suggestion.type}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            {Math.round(suggestion.confidence * 100)}% confidence
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-1">{suggestion.message}</p>
                        {showDetails && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            "{suggestion.originalText}"
                          </div>
                        )}
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>Enhancement:</strong> {suggestion.suggestion}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          applySuggestion(suggestion);
                        }}
                        className="ml-2"
                      >
                        <FaArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">{errors.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Issues Found</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{suggestions.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Suggestions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((suggestions.length / (errors.length + suggestions.length)) * 100) || 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Enhancement Score</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
