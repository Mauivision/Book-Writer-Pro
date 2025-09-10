'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  FaMicrophone, 
  FaPalette, 
  FaHeart, 
  FaBrain, 
  FaEye,
  FaMagic,
  FaChartPie,
  FaTrendingUp,
  FaTrendingDown,
  FaMinus,
  FaExpand,
  FaCompress,
  FaTimes,
  FaLightbulb,
  FaRocket,
  FaStar,
  FaUsers,
  FaBook,
  FaQuoteLeft
} from 'react-icons/fa';

interface VoiceProfile {
  personality: {
    dominant: string;
    secondary: string;
    traits: string[];
    description: string;
  };
  tone: {
    primary: string;
    secondary: string;
    intensity: number;
    consistency: number;
    description: string;
  };
  style: {
    formality: number;
    complexity: number;
    creativity: number;
    description: string;
  };
  emotionalRange: {
    spectrum: string[];
    dominant: string;
    variability: number;
    description: string;
  };
}

interface VoiceMetrics {
  authenticity: number;
  distinctiveness: number;
  consistency: number;
  engagement: number;
  clarity: number;
}

interface VoiceToneAnalyzerProps {
  text: string;
  onVoiceInsight?: (insight: any) => void;
  className?: string;
}

export function VoiceToneAnalyzer({ 
  text, 
  onVoiceInsight, 
  className = '' 
}: VoiceToneAnalyzerProps) {
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [voiceMetrics, setVoiceMetrics] = useState<VoiceMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedAspect, setSelectedAspect] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'basic' | 'detailed' | 'comprehensive'>('detailed');

  // Analyze voice and tone
  const analyzeVoice = useCallback(async () => {
    if (!text.trim() || text.length < 100) {
      setVoiceProfile(null);
      setVoiceMetrics(null);
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI-powered voice analysis
      const mockVoiceProfile: VoiceProfile = {
        personality: {
          dominant: 'Thoughtful',
          secondary: 'Mysterious',
          traits: ['introspective', 'observant', 'philosophical', 'subtle', 'atmospheric'],
          description: 'Your writing voice is contemplative and atmospheric, with a tendency toward introspection and subtle emotional expression.'
        },
        tone: {
          primary: 'Melancholic',
          secondary: 'Hopeful',
          intensity: 7.2,
          consistency: 8.5,
          description: 'A consistent melancholic tone with underlying hope, creating emotional depth and resonance.'
        },
        style: {
          formality: 6.8,
          complexity: 7.5,
          creativity: 8.2,
          description: 'Balanced formal-informal style with rich vocabulary and creative expression.'
        },
        emotionalRange: {
          spectrum: ['melancholy', 'hope', 'wonder', 'tension', 'peace', 'longing'],
          dominant: 'melancholy',
          variability: 7.8,
          description: 'Wide emotional range with melancholy as the dominant emotion, creating rich emotional texture.'
        }
      };

      const mockVoiceMetrics: VoiceMetrics = {
        authenticity: 8.7,
        distinctiveness: 8.1,
        consistency: 8.5,
        engagement: 7.9,
        clarity: 8.3
      };

      // Simulate API delay
      const delay = analysisMode === 'comprehensive' ? 2500 : 
                   analysisMode === 'detailed' ? 1800 : 1200;
      
      await new Promise(resolve => setTimeout(resolve, delay));

      setVoiceProfile(mockVoiceProfile);
      setVoiceMetrics(mockVoiceMetrics);
    } catch (error) {
      console.error('Voice analysis failed:', error);
      setVoiceProfile(null);
      setVoiceMetrics(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, analysisMode]);

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

  // Get emotional color
  const getEmotionalColor = (emotion: string) => {
    const colors = {
      melancholy: 'bg-blue-100 text-blue-800',
      hope: 'bg-green-100 text-green-800',
      wonder: 'bg-purple-100 text-purple-800',
      tension: 'bg-red-100 text-red-800',
      peace: 'bg-gray-100 text-gray-800',
      longing: 'bg-pink-100 text-pink-800',
      joy: 'bg-yellow-100 text-yellow-800',
      fear: 'bg-orange-100 text-orange-800',
      anger: 'bg-red-100 text-red-800',
      sadness: 'bg-indigo-100 text-indigo-800'
    };
    return colors[emotion as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeVoice();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [analyzeVoice]);

  if (!text.trim()) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <FaMicrophone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
          No Text to Analyze
        </h3>
        <p className="text-gray-500 dark:text-gray-500">
          Write at least 100 characters to see voice and tone analysis
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
            <FaMicrophone className="w-6 h-6 text-pink-500" />
            <h3 className="text-lg font-semibold">Voice & Tone Analyzer</h3>
            {voiceMetrics && (
              <span className="bg-pink-100 text-pink-800 text-sm px-2 py-1 rounded-full">
                {Math.round((voiceMetrics.authenticity + voiceMetrics.distinctiveness + voiceMetrics.consistency + voiceMetrics.engagement + voiceMetrics.clarity) / 5)}% overall
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={analysisMode}
              onChange={(e) => setAnalysisMode(e.target.value as any)}
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
          <div className="mb-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <FaMagic className="w-4 h-4 text-pink-500 animate-pulse" />
              <span className="text-sm text-pink-700 dark:text-pink-300">
                Analyzing voice patterns and emotional tone...
              </span>
            </div>
          </div>
        )}

        {/* Voice Profile */}
        {voiceProfile && (
          <div className="mb-6">
            <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
              <FaPalette className="w-4 h-4" />
              Voice Profile
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personality */}
              <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaUsers className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Personality</span>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium">{voiceProfile.personality.dominant}</span>
                  <span className="text-sm text-gray-600 ml-2">({voiceProfile.personality.secondary})</span>
                </div>
                <p className="text-sm mb-2">{voiceProfile.personality.description}</p>
                <div className="flex flex-wrap gap-1">
                  {voiceProfile.personality.traits.map((trait, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div className="p-4 rounded-lg border bg-purple-50 border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaHeart className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">Tone</span>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium">{voiceProfile.tone.primary}</span>
                  <span className="text-sm text-gray-600 ml-2">({voiceProfile.tone.secondary})</span>
                </div>
                <p className="text-sm mb-2">{voiceProfile.tone.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Intensity: {voiceProfile.tone.intensity}/10</div>
                  <div>Consistency: {voiceProfile.tone.consistency}/10</div>
                </div>
              </div>

              {/* Style */}
              <div className="p-4 rounded-lg border bg-green-50 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaBook className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Style</span>
                </div>
                <p className="text-sm mb-2">{voiceProfile.style.description}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>Formality: {voiceProfile.style.formality}/10</div>
                  <div>Complexity: {voiceProfile.style.complexity}/10</div>
                  <div>Creativity: {voiceProfile.style.creativity}/10</div>
                </div>
              </div>

              {/* Emotional Range */}
              <div className="p-4 rounded-lg border bg-pink-50 border-pink-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaEye className="w-4 h-4 text-pink-600" />
                  <span className="font-medium">Emotional Range</span>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium">Dominant: {voiceProfile.emotionalRange.dominant}</span>
                </div>
                <p className="text-sm mb-2">{voiceProfile.emotionalRange.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {voiceProfile.emotionalRange.spectrum.map((emotion, index) => (
                    <span key={index} className={`text-xs px-2 py-1 rounded ${getEmotionalColor(emotion)}`}>
                      {emotion}
                    </span>
                  ))}
                </div>
                <div className="text-xs">Variability: {voiceProfile.emotionalRange.variability}/10</div>
              </div>
            </div>
          </div>
        )}

        {/* Voice Metrics */}
        {voiceMetrics && (
          <div className="mb-6">
            <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
              <FaChartPie className="w-4 h-4" />
              Voice Metrics
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Authenticity */}
              <div className={`p-4 rounded-lg border ${getScoreColor(voiceMetrics.authenticity)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {React.createElement(getScoreIcon(voiceMetrics.authenticity), { className: "w-4 h-4" })}
                    <span className="font-medium">Authenticity</span>
                  </div>
                  <span className="text-lg font-bold">{voiceMetrics.authenticity}/10</span>
                </div>
                <p className="text-sm">How genuine and true to yourself your voice feels</p>
              </div>

              {/* Distinctiveness */}
              <div className={`p-4 rounded-lg border ${getScoreColor(voiceMetrics.distinctiveness)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {React.createElement(getScoreIcon(voiceMetrics.distinctiveness), { className: "w-4 h-4" })}
                    <span className="font-medium">Distinctiveness</span>
                  </div>
                  <span className="text-lg font-bold">{voiceMetrics.distinctiveness}/10</span>
                </div>
                <p className="text-sm">How unique and recognizable your voice is</p>
              </div>

              {/* Consistency */}
              <div className={`p-4 rounded-lg border ${getScoreColor(voiceMetrics.consistency)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {React.createElement(getScoreIcon(voiceMetrics.consistency), { className: "w-4 h-4" })}
                    <span className="font-medium">Consistency</span>
                  </div>
                  <span className="text-lg font-bold">{voiceMetrics.consistency}/10</span>
                </div>
                <p className="text-sm">How consistent your voice remains throughout</p>
              </div>

              {/* Engagement */}
              <div className={`p-4 rounded-lg border ${getScoreColor(voiceMetrics.engagement)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {React.createElement(getScoreIcon(voiceMetrics.engagement), { className: "w-4 h-4" })}
                    <span className="font-medium">Engagement</span>
                  </div>
                  <span className="text-lg font-bold">{voiceMetrics.engagement}/10</span>
                </div>
                <p className="text-sm">How engaging and compelling your voice is</p>
              </div>

              {/* Clarity */}
              <div className={`p-4 rounded-lg border ${getScoreColor(voiceMetrics.clarity)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {React.createElement(getScoreIcon(voiceMetrics.clarity), { className: "w-4 h-4" })}
                    <span className="font-medium">Clarity</span>
                  </div>
                  <span className="text-lg font-bold">{voiceMetrics.clarity}/10</span>
                </div>
                <p className="text-sm">How clear and understandable your voice is</p>
              </div>
            </div>
          </div>
        )}

        {/* Voice Insights */}
        {voiceProfile && voiceMetrics && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold mb-3">Voice Insights</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <FaLightbulb className="w-4 h-4 text-yellow-500" />
                <span><strong>Strengths:</strong> Your voice shows strong authenticity and consistency, creating a reliable narrative presence.</span>
              </div>
              <div className="flex items-center gap-2">
                <FaRocket className="w-4 h-4 text-blue-500" />
                <span><strong>Opportunities:</strong> Consider varying your emotional range to add more dynamic tension to your storytelling.</span>
              </div>
              <div className="flex items-center gap-2">
                <FaStar className="w-4 h-4 text-purple-500" />
                <span><strong>Signature Style:</strong> Your contemplative, atmospheric voice with melancholic undertones creates a distinctive reading experience.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
