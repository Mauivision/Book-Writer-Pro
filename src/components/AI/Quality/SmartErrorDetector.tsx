'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaInfoCircle,
  FaSpellCheck,
  FaEye,
  FaMagic,
  FaTimes,
  FaArrowRight,
  FaLightbulb
} from 'react-icons/fa';

interface GrammarError {
  id: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'style' | 'clarity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  suggestion: string;
  start: number;
  end: number;
  originalText: string;
  context: string;
  rule: string;
}

interface SmartErrorDetectorProps {
  text: string;
  onErrorSelect?: (error: GrammarError) => void;
  onSuggestionApply?: (error: GrammarError) => void;
  className?: string;
}

export function SmartErrorDetector({ 
  text, 
  onErrorSelect, 
  onSuggestionApply, 
  className = '' 
}: SmartErrorDetectorProps) {
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedError, setSelectedError] = useState<GrammarError | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [analysisLevel, setAnalysisLevel] = useState<'basic' | 'advanced' | 'comprehensive'>('basic');

  // Advanced grammar and style analysis
  const analyzeText = useCallback(async () => {
    if (!text.trim()) {
      setErrors([]);
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI-powered grammar analysis
      const mockErrors: GrammarError[] = [
        {
          id: '1',
          type: 'grammar',
          severity: 'medium',
          message: 'Passive voice detected - consider using active voice for stronger impact',
          suggestion: 'The hero defeated the dragon with a single strike',
          start: 0,
          end: 35,
          originalText: 'The dragon was defeated by the hero with a single strike',
          context: 'In the final battle, the dragon was defeated by the hero with a single strike.',
          rule: 'Active voice creates more engaging and direct prose'
        },
        {
          id: '2',
          type: 'style',
          severity: 'low',
          message: 'Word repetition - consider using synonyms for variety',
          suggestion: 'extremely, incredibly, remarkably',
          start: 50,
          end: 60,
          originalText: 'very very',
          context: 'The castle was very very old and mysterious.',
          rule: 'Avoid repetitive words within close proximity'
        },
        {
          id: '3',
          type: 'clarity',
          severity: 'high',
          message: 'Unclear pronoun reference - specify what "it" refers to',
          suggestion: 'The ancient sword gleamed in the sunlight',
          start: 100,
          end: 110,
          originalText: 'it gleamed',
          context: 'The ancient sword lay on the altar. It gleamed in the sunlight.',
          rule: 'Ensure pronouns have clear antecedents'
        },
        {
          id: '4',
          type: 'punctuation',
          severity: 'low',
          message: 'Missing comma in compound sentence',
          suggestion: 'The hero was brave, and the dragon was fierce.',
          start: 150,
          end: 180,
          originalText: 'The hero was brave and the dragon was fierce.',
          context: 'The hero was brave and the dragon was fierce in their final confrontation.',
          rule: 'Use commas to separate independent clauses joined by conjunctions'
        }
      ];

      // Simulate API delay based on analysis level
      const delay = analysisLevel === 'comprehensive' ? 2000 : 
                   analysisLevel === 'advanced' ? 1500 : 1000;
      
      await new Promise(resolve => setTimeout(resolve, delay));

      setErrors(mockErrors);
    } catch (error) {
      console.error('Error analysis failed:', error);
      setErrors([]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, analysisLevel]);

  // Apply suggestion
  const applySuggestion = useCallback((error: GrammarError) => {
    if (onSuggestionApply) {
      onSuggestionApply(error);
    }
  }, [onSuggestionApply]);

  // Select error
  const selectError = useCallback((error: GrammarError) => {
    setSelectedError(error);
    if (onErrorSelect) {
      onErrorSelect(error);
    }
  }, [onErrorSelect]);

  // Get error type icon and color
  const getErrorTypeInfo = (type: string) => {
    const types = {
      grammar: { icon: FaSpellCheck, color: 'text-red-600 bg-red-50 border-red-200', label: 'Grammar' },
      spelling: { icon: FaSpellCheck, color: 'text-orange-600 bg-orange-50 border-orange-200', label: 'Spelling' },
      punctuation: { icon: FaInfoCircle, color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Punctuation' },
      style: { icon: FaLightbulb, color: 'text-purple-600 bg-purple-50 border-purple-200', label: 'Style' },
      clarity: { icon: FaEye, color: 'text-green-600 bg-green-50 border-green-200', label: 'Clarity' }
    };
    return types[type as keyof typeof types] || types.grammar;
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeText();
    }, 500); // Debounce analysis

    return () => clearTimeout(timeoutId);
  }, [analyzeText]);

  if (!text.trim()) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <FaSpellCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
          No Text to Analyze
        </h3>
        <p className="text-gray-500 dark:text-gray-500">
          Start writing to see grammar and style suggestions
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
            <FaSpellCheck className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Smart Error Detection</h3>
            {errors.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {errors.length} issues
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={analysisLevel}
              onChange={(e) => setAnalysisLevel(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
            >
              <option value="basic">Basic</option>
              <option value="advanced">Advanced</option>
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
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <FaMagic className="w-4 h-4 text-blue-500 animate-spin" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Analyzing text for {analysisLevel} issues...
              </span>
            </div>
          </div>
        )}

        {/* Errors List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {errors.length === 0 && !isAnalyzing ? (
            <div className="text-center py-8">
              <FaCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-green-600 mb-2">Great Writing!</h4>
              <p className="text-gray-600 dark:text-gray-400">
                No grammar or style issues detected
              </p>
            </div>
          ) : (
            errors.map((error) => {
              const typeInfo = getErrorTypeInfo(error.type);
              const Icon = typeInfo.icon;
              
              return (
                <div
                  key={error.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedError?.id === error.id ? 'ring-2 ring-blue-500' : ''
                  } ${typeInfo.color}`}
                  onClick={() => selectError(error)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wide">
                          {typeInfo.label}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(error.severity)}`}>
                          {error.severity}
                        </span>
                      </div>
                      
                      <p className="text-sm font-medium mb-2">{error.message}</p>
                      
                      {showDetails && (
                        <div className="mb-2">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            <strong>Context:</strong> "{error.context}"
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            <strong>Original:</strong> "{error.originalText}"
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <strong>Rule:</strong> {error.rule}
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-white dark:bg-gray-800 p-2 rounded border-l-4 border-blue-500">
                        <p className="text-sm">
                          <strong>Suggestion:</strong> {error.suggestion}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        applySuggestion(error);
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
        {errors.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Critical Issues:</span> {errors.filter(e => e.severity === 'critical').length}
              </div>
              <div>
                <span className="font-medium">High Priority:</span> {errors.filter(e => e.severity === 'high').length}
              </div>
              <div>
                <span className="font-medium">Medium Priority:</span> {errors.filter(e => e.severity === 'medium').length}
              </div>
              <div>
                <span className="font-medium">Low Priority:</span> {errors.filter(e => e.severity === 'low').length}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
