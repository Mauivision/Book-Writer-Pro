'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  FaChartLine, 
  FaBrain, 
  FaLightbulb, 
  FaRocket,
  FaStar,
  FaHeart,
  FaEye,
  FaUsers,
  FaClock,
  FaBook,
  FaPalette,
  FaQuoteLeft,
  FaMagic,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaExpand,
  FaCompress,
  FaTimes,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';

interface WritingInsight {
  id: string;
  type: 'improvement' | 'strength' | 'pattern' | 'suggestion' | 'trend';
  category: 'style' | 'structure' | 'character' | 'plot' | 'dialogue' | 'description';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  actionable: boolean;
  examples?: string[];
  suggestions?: string[];
}

interface WritingTrend {
  metric: string;
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface WritingInsightsDashboardProps {
  text: string;
  previousText?: string;
  onInsightSelect?: (insight: WritingInsight) => void;
  className?: string;
}

export function WritingInsightsDashboard({ 
  text, 
  previousText, 
  onInsightSelect, 
  className = '' 
}: WritingInsightsDashboardProps) {
  const [insights, setInsights] = useState<WritingInsight[]>([]);
  const [trends, setTrends] = useState<WritingTrend[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [dashboardMode, setDashboardMode] = useState<'overview' | 'detailed' | 'actionable'>('overview');

  // Generate writing insights
  const generateInsights = useCallback(async () => {
    if (!text.trim() || text.length < 100) {
      setInsights([]);
      setTrends([]);
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI-powered insight generation
      const mockInsights: WritingInsight[] = [
        {
          id: '1',
          type: 'strength',
          category: 'dialogue',
          title: 'Natural Dialogue Flow',
          description: 'Your dialogue feels authentic and advances the plot effectively. Characters have distinct voices.',
          impact: 'high',
          confidence: 0.92,
          actionable: false,
          examples: [
            '"I can\'t believe you\'d do something like this," she whispered, her voice trembling.',
            '"Well, what did you expect?" he replied with a shrug, avoiding her gaze.'
          ]
        },
        {
          id: '2',
          type: 'improvement',
          category: 'description',
          title: 'Sensory Detail Enhancement',
          description: 'Add more sensory details to create immersive scenes. Current descriptions are visual-heavy.',
          impact: 'medium',
          confidence: 0.87,
          actionable: true,
          suggestions: [
            'Include sound effects and ambient noise',
            'Add tactile sensations (texture, temperature)',
            'Incorporate smells and tastes when relevant'
          ]
        },
        {
          id: '3',
          type: 'pattern',
          category: 'style',
          title: 'Sentence Length Variety',
          description: 'Good variety in sentence length creates natural rhythm. Maintain this pattern for engaging prose.',
          impact: 'medium',
          confidence: 0.89,
          actionable: false
        },
        {
          id: '4',
          type: 'suggestion',
          category: 'character',
          title: 'Character Internal Monologue',
          description: 'Add more internal thoughts to deepen character development and reader connection.',
          impact: 'high',
          confidence: 0.85,
          actionable: true,
          suggestions: [
            'Show character doubts and fears',
            'Include internal reactions to events',
            'Reveal character motivations through thoughts'
          ]
        },
        {
          id: '5',
          type: 'trend',
          category: 'structure',
          title: 'Pacing Acceleration',
          description: 'Pacing has improved significantly in recent sections, creating better tension.',
          impact: 'high',
          confidence: 0.91,
          actionable: false
        },
        {
          id: '6',
          type: 'improvement',
          category: 'plot',
          title: 'Conflict Escalation',
          description: 'Consider raising the stakes in the current conflict to increase reader engagement.',
          impact: 'medium',
          confidence: 0.78,
          actionable: true,
          suggestions: [
            'Add time pressure to the situation',
            'Introduce a personal cost for the protagonist',
            'Create multiple competing objectives'
          ]
        }
      ];

      const mockTrends: WritingTrend[] = [
        {
          metric: 'Readability Score',
          current: 78,
          previous: 72,
          trend: 'up',
          description: 'Writing has become more accessible and engaging'
        },
        {
          metric: 'Emotional Intensity',
          current: 7.2,
          previous: 6.8,
          trend: 'up',
          description: 'Stronger emotional impact in recent writing'
        },
        {
          metric: 'Dialogue Quality',
          current: 8.3,
          previous: 8.1,
          trend: 'up',
          description: 'Consistently high-quality dialogue'
        },
        {
          metric: 'Descriptive Richness',
          current: 7.8,
          previous: 8.2,
          trend: 'down',
          description: 'Slight decrease in descriptive detail'
        },
        {
          metric: 'Character Development',
          current: 7.5,
          previous: 7.3,
          trend: 'up',
          description: 'Improving character depth and growth'
        },
        {
          metric: 'Pacing Score',
          current: 8.1,
          previous: 7.6,
          trend: 'up',
          description: 'Better narrative rhythm and flow'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setInsights(mockInsights);
      setTrends(mockTrends);
    } catch (error) {
      console.error('Insight generation failed:', error);
      setInsights([]);
      setTrends([]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, previousText]);

  // Get insight type info
  const getInsightTypeInfo = (type: string) => {
    const types = {
      improvement: { icon: FaLightbulb, color: 'text-yellow-600 bg-yellow-50 border-yellow-200', label: 'Improvement' },
      strength: { icon: FaStar, color: 'text-green-600 bg-green-50 border-green-200', label: 'Strength' },
      pattern: { icon: FaEye, color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Pattern' },
      suggestion: { icon: FaRocket, color: 'text-purple-600 bg-purple-50 border-purple-200', label: 'Suggestion' },
      trend: { icon: FaArrowUp, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', label: 'Trend' }
    };
    return types[type as keyof typeof types] || types.improvement;
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons = {
      style: FaPalette,
      structure: FaBook,
      character: FaUsers,
      plot: FaRocket,
      dialogue: FaQuoteLeft,
      description: FaEye
    };
    return icons[category as keyof typeof icons] || FaBrain;
  };

  // Get impact color
  const getImpactColor = (impact: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[impact as keyof typeof colors] || colors.medium;
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    const icons = {
      up: FaArrowUp,
      down: FaArrowDown,
      stable: FaMinus
    };
    return icons[trend as keyof typeof icons] || FaMinus;
  };

  // Get trend color
  const getTrendColor = (trend: string, metric: string) => {
    if (trend === 'up') {
      // Some metrics are better when they go down (like complexity)
      return metric.includes('Complexity') ? 'text-red-600' : 'text-green-600';
    }
    if (trend === 'down') {
      return metric.includes('Complexity') ? 'text-green-600' : 'text-red-600';
    }
    return 'text-gray-600';
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateInsights();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [generateInsights]);

  if (!text.trim()) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <FaChartLine className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
          No Writing to Analyze
        </h3>
        <p className="text-gray-500 dark:text-gray-500">
          Write at least 100 characters to see writing insights
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
            <FaChartLine className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Writing Insights Dashboard</h3>
            {insights.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {insights.length} insights
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={dashboardMode}
              onChange={(e) => setDashboardMode(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
            >
              <option value="overview">Overview</option>
              <option value="detailed">Detailed</option>
              <option value="actionable">Actionable</option>
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
              <FaMagic className="w-4 h-4 text-blue-500 animate-pulse" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Generating writing insights and trends...
              </span>
            </div>
          </div>
        )}

        {/* Trends Overview */}
        {trends.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
              <FaArrowUp className="w-4 h-4" />
              Writing Trends
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trends.map((trend, index) => {
                const TrendIcon = getTrendIcon(trend.trend);
                return (
                  <div key={index} className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{trend.metric}</span>
                      <TrendIcon className={`w-4 h-4 ${getTrendColor(trend.trend, trend.metric)}`} />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold">{trend.current}</span>
                      <span className="text-sm text-gray-600">({trend.previous})</span>
                    </div>
                    <p className="text-xs text-gray-600">{trend.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Insights */}
        <div>
          <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
            <FaBrain className="w-4 h-4" />
            Writing Insights
          </h4>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {insights.length === 0 && !isAnalyzing ? (
              <div className="text-center py-8">
                <FaChartLine className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-green-600 mb-2">Excellent Writing!</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  No major insights to report - keep up the great work!
                </p>
              </div>
            ) : (
              insights
                .filter(insight => {
                  if (dashboardMode === 'actionable') return insight.actionable;
                  if (dashboardMode === 'detailed') return insight.confidence > 0.8;
                  return true;
                })
                .map((insight) => {
                  const typeInfo = getInsightTypeInfo(insight.type);
                  const TypeIcon = typeInfo.icon;
                  const CategoryIcon = getCategoryIcon(insight.category);
                  
                  return (
                    <div
                      key={insight.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedCategory === insight.id ? 'ring-2 ring-blue-500' : ''
                      } ${typeInfo.color}`}
                      onClick={() => {
                        setSelectedCategory(insight.id);
                        if (onInsightSelect) {
                          onInsightSelect(insight);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <TypeIcon className="w-4 h-4" />
                            <CategoryIcon className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wide">
                              {typeInfo.label} • {insight.category}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(insight.impact)}`}>
                              {insight.impact} impact
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                          </div>
                          
                          <h5 className="font-semibold mb-2">{insight.title}</h5>
                          <p className="text-sm mb-2">{insight.description}</p>
                          
                          {showDetails && insight.examples && (
                            <div className="mb-2">
                              <div className="text-xs font-medium text-gray-600 mb-1">Examples:</div>
                              {insight.examples.map((example, index) => (
                                <div key={index} className="text-xs text-gray-600 italic mb-1">
                                  "{example}"
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {showDetails && insight.suggestions && (
                            <div className="mb-2">
                              <div className="text-xs font-medium text-gray-600 mb-1">Suggestions:</div>
                              {insight.suggestions.map((suggestion, index) => (
                                <div key={index} className="text-xs text-gray-600 mb-1">
                                  • {suggestion}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Summary */}
        {insights.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold mb-3">Insights Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Strengths:</span> 
                <span className="ml-2 text-green-600">{insights.filter(i => i.type === 'strength').length}</span>
              </div>
              <div>
                <span className="font-medium">Improvements:</span> 
                <span className="ml-2 text-yellow-600">{insights.filter(i => i.type === 'improvement').length}</span>
              </div>
              <div>
                <span className="font-medium">Actionable:</span> 
                <span className="ml-2 text-blue-600">{insights.filter(i => i.actionable).length}</span>
              </div>
              <div>
                <span className="font-medium">High Impact:</span> 
                <span className="ml-2 text-red-600">{insights.filter(i => i.impact === 'high').length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
