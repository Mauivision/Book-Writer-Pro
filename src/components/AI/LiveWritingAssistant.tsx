'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FaEdit, 
  FaEye, 
  FaLightbulb, 
  FaExclamationTriangle, 
  FaCheckCircle,
  FaUser,
  FaClock,
  FaMapMarkerAlt,
  FaPalette,
  FaUsers,
  FaArrowRight,
  FaTimes,
  FaSave,
  FaUndo,
  FaRedo,
  FaSpellCheck,
  FaBook,
  FaMagic,
  FaBrain,
  FaChartLine
} from 'react-icons/fa';

interface WritingSuggestion {
  id: string;
  type: 'grammar' | 'style' | 'character' | 'plot' | 'timeline' | 'consistency';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
  context: string;
  position: { start: number; end: number };
  category: string;
  confidence: number;
}

interface CharacterReference {
  name: string;
  lastSeen: string;
  appearance: string;
  currentContext: string;
  consistency: number;
}

interface TimelineContext {
  currentTime: string;
  previousEvents: string[];
  nextEvents: string[];
  flashbacks: string[];
  foreshadowing: string[];
}

export default function LiveWritingAssistant() {
  const [content, setContent] = useState('');
  const [suggestions, setSuggestions] = useState<WritingSuggestion[]>([]);
  const [characterReferences, setCharacterReferences] = useState<CharacterReference[]>([]);
  const [timelineContext, setTimelineContext] = useState<TimelineContext | null>(null);
  const [showCharacterPanel, setShowCharacterPanel] = useState(false);
  const [showTimelinePanel, setShowTimelinePanel] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<string>('Chapter 1');
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  
  const { characters, chapters, metadata } = useBookStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const analysisTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced content analysis
  useEffect(() => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }

    analysisTimeoutRef.current = setTimeout(() => {
      if (content.length > 10) {
        analyzeContent();
      }
    }, 1000);

    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, [content]);

  // Update word count and reading time
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200)); // 200 words per minute
  }, [content]);

  const analyzeContent = useCallback(async () => {
    setIsAnalyzing(true);
    
    try {
      // Analyze grammar and style
      const grammarSuggestions = analyzeGrammar(content);
      
      // Analyze character consistency
      const characterSuggestions = analyzeCharacterConsistency(content);
      
      // Analyze timeline consistency
      const timelineSuggestions = analyzeTimelineConsistency(content);
      
      // Analyze plot structure
      const plotSuggestions = analyzePlotStructure(content);
      
      // Combine all suggestions
      const allSuggestions = [
        ...grammarSuggestions,
        ...characterSuggestions,
        ...timelineSuggestions,
        ...plotSuggestions
      ];
      
      setSuggestions(allSuggestions);
      
      // Update character references
      updateCharacterReferences(content);
      
      // Update timeline context
      updateTimelineContext(content);
      
    } catch (error) {
      console.error('Content analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [content]);

  const analyzeGrammar = (text: string): WritingSuggestion[] => {
    const suggestions: WritingSuggestion[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach((sentence, index) => {
      const start = text.indexOf(sentence);
      const end = start + sentence.length;
      
      // Check for very long sentences
      if (sentence.length > 100) {
        suggestions.push({
          id: `grammar-${index}-1`,
          type: 'style',
          severity: 'medium',
          message: 'Very long sentence detected',
          suggestion: 'Consider breaking this into 2-3 shorter sentences for better readability',
          context: sentence.trim(),
          position: { start, end },
          category: 'sentence_length',
          confidence: 0.9
        });
      }
      
      // Check for passive voice patterns
      if (sentence.toLowerCase().includes('was') && sentence.toLowerCase().includes('by')) {
        suggestions.push({
          id: `grammar-${index}-2`,
          type: 'style',
          severity: 'medium',
          message: 'Passive voice detected',
          suggestion: 'Consider using active voice for more engaging writing',
          context: sentence.trim(),
          position: { start, end },
          category: 'passive_voice',
          confidence: 0.8
        });
      }
      
      // Check for repetitive words
      const words = sentence.toLowerCase().match(/\b\w+\b/g) || [];
      const wordCounts = words.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      Object.entries(wordCounts).forEach(([word, count]) => {
        if (count > 2 && word.length > 3) {
          suggestions.push({
            id: `grammar-${index}-3`,
            type: 'style',
            severity: 'low',
            message: `Word "${word}" repeated ${count} times`,
            suggestion: 'Consider using synonyms or varying your vocabulary',
            context: sentence.trim(),
            position: { start, end },
            category: 'repetition',
            confidence: 0.7
          });
        }
      });
    });
    
    return suggestions;
  };

  const analyzeCharacterConsistency = (text: string): WritingSuggestion[] => {
    const suggestions: WritingSuggestion[] = [];
    
    characters.forEach(character => {
      const nameMatches = text.match(new RegExp(character.name, 'gi'));
      if (nameMatches) {
        // Check if character details are consistent
        const characterContext = extractCharacterContext(character.name, text);
        const consistencyIssues = checkCharacterConsistency(character, characterContext);
        
        consistencyIssues.forEach(issue => {
          suggestions.push({
            id: `character-${character.id}-${Date.now()}`,
            type: 'character',
            severity: issue.severity,
            message: issue.message,
            suggestion: issue.suggestion,
            context: characterContext,
            position: { start: 0, end: text.length },
            category: 'character_consistency',
            confidence: issue.confidence
          });
        });
      }
    });
    
    return suggestions;
  };

  const extractCharacterContext = (characterName: string, text: string): string => {
    const nameIndex = text.toLowerCase().indexOf(characterName.toLowerCase());
    if (nameIndex === -1) return '';
    
    const contextStart = Math.max(0, nameIndex - 100);
    const contextEnd = Math.min(text.length, nameIndex + 100);
    return text.substring(contextStart, contextEnd);
  };

  const checkCharacterConsistency = (character: any, context: string): Array<{
    severity: 'low' | 'medium' | 'high';
    message: string;
    suggestion: string;
    confidence: number;
  }> => {
    const issues: Array<{
      severity: 'low' | 'medium' | 'high';
      message: string;
      suggestion: string;
      confidence: number;
    }> = [];
    
    // Check for physical description inconsistencies
    if (character.appearance) {
      const physicalDetails = extractPhysicalDetails(context);
      const inconsistencies = findPhysicalInconsistencies(character.appearance, physicalDetails);
      
      inconsistencies.forEach(inconsistency => {
        issues.push({
          severity: 'medium',
          message: `Character "${character.name}" has inconsistent ${inconsistency.trait}`,
          suggestion: `Review and standardize ${inconsistency.trait} description`,
          confidence: 0.8
        });
      });
    }
    
    return issues;
  };

  const extractPhysicalDetails = (context: string) => {
    const details: Record<string, string[]> = {};
    
    // Extract height, hair color, eye color, etc.
    const heightMatch = context.match(/(\d+)\s*(?:feet|ft|cm|inches)/i);
    if (heightMatch) details.height = [heightMatch[0]];
    
    const hairMatch = context.match(/(blonde|brown|black|red|gray|white)\s*hair/i);
    if (hairMatch) details.hair = [hairMatch[0]];
    
    const eyeMatch = context.match(/(blue|brown|green|hazel|gray)\s*eyes/i);
    if (eyeMatch) details.eyes = [eyeMatch[0]];
    
    return details;
  };

  const findPhysicalInconsistencies = (existingAppearance: any, newDetails: Record<string, string[]>): Array<{
    trait: string;
    existing: string;
    new: string;
  }> => {
    const inconsistencies: Array<{
      trait: string;
      existing: string;
      new: string;
    }> = [];
    
    Object.entries(newDetails).forEach(([trait, values]) => {
      if (values.length > 0 && existingAppearance[trait] && existingAppearance[trait] !== values[0]) {
        inconsistencies.push({
          trait,
          existing: existingAppearance[trait],
          new: values[0]
        });
      }
    });
    
    return inconsistencies;
  };

  const analyzeTimelineConsistency = (text: string): WritingSuggestion[] => {
    const suggestions: WritingSuggestion[] = [];
    
    // Look for time-related phrases
    const timePatterns = [
      /(\d+)\s+(hours?|days?|weeks?|months?|years?)\s+(ago|earlier|later)/gi,
      /(yesterday|today|tomorrow|morning|afternoon|evening|night)/gi,
      /(last|next)\s+(week|month|year|day)/gi,
      /(flashback|memory|remember|recall)/gi
    ];
    
    timePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const start = text.indexOf(match);
          const end = start + match.length;
          
          suggestions.push({
            id: `timeline-${Date.now()}-${Math.random()}`,
            type: 'timeline',
            severity: 'low',
            message: `Time reference detected: "${match}"`,
            suggestion: 'Ensure this timeline reference is consistent with your story chronology',
            context: text.substring(Math.max(0, start - 50), Math.min(text.length, end + 50)),
            position: { start, end },
            category: 'timeline_marker',
            confidence: 0.9
          });
        });
      }
    });
    
    return suggestions;
  };

  const analyzePlotStructure = (text: string): WritingSuggestion[] => {
    const suggestions: WritingSuggestion[] = [];
    
    // Check for dialogue vs. description balance
    const dialogueMatches = text.match(/"[^"]*"/g) || [];
    const dialogueLength = dialogueMatches.reduce((sum, match) => sum + match.length, 0);
    const dialoguePercentage = (dialogueLength / text.length) * 100;
    
    if (dialoguePercentage > 80) {
      suggestions.push({
        id: `plot-${Date.now()}-1`,
        type: 'plot',
        severity: 'medium',
        message: 'High dialogue percentage detected',
        suggestion: 'Consider adding more description, action, or internal thoughts to balance the scene',
        context: text.substring(0, Math.min(200, text.length)),
        position: { start: 0, end: text.length },
        category: 'dialogue_balance',
        confidence: 0.8
      });
    }
    
    // Check for scene transitions
    const transitionWords = ['meanwhile', 'later', 'after', 'before', 'then', 'suddenly'];
    const hasTransitions = transitionWords.some(word => text.toLowerCase().includes(word));
    
    if (!hasTransitions && text.length > 500) {
      suggestions.push({
        id: `plot-${Date.now()}-2`,
        type: 'plot',
        severity: 'low',
        message: 'Long scene without clear transitions',
        suggestion: 'Consider adding transition words or scene breaks to improve flow',
        context: text.substring(0, Math.min(200, text.length)),
        position: { start: 0, end: text.length },
        category: 'scene_transitions',
        confidence: 0.6
      });
    }
    
    return suggestions;
  };

  const updateCharacterReferences = (text: string) => {
    const references: CharacterReference[] = [];
    
    characters.forEach(character => {
      if (text.toLowerCase().includes(character.name.toLowerCase())) {
        const context = extractCharacterContext(character.name, text);
        const consistency = calculateCharacterConsistency(character, context);
        
        references.push({
          name: character.name,
          lastSeen: character.lastSeen || 'Unknown',
          appearance: extractAppearanceSummary(character, context),
          currentContext: context,
          consistency
        });
      }
    });
    
    setCharacterReferences(references);
  };

  const calculateCharacterConsistency = (character: any, context: string): number => {
    // Simple consistency calculation
    let score = 100;
    
    if (character.appearance) {
      const physicalDetails = extractPhysicalDetails(context);
      const inconsistencies = findPhysicalInconsistencies(character.appearance, physicalDetails);
      score -= inconsistencies.length * 15;
    }
    
    return Math.max(0, score);
  };

  const extractAppearanceSummary = (character: any, context: string): string => {
    if (!character.appearance) return 'No appearance details';
    
    const details = [];
    if (character.appearance.hair) details.push(character.appearance.hair);
    if (character.appearance.eyes) details.push(character.appearance.eyes);
    if (character.appearance.build) details.push(character.appearance.build);
    
    return details.length > 0 ? details.join(', ') : 'Basic appearance described';
  };

  const updateTimelineContext = (text: string) => {
    const timeMarkers = extractTimeMarkers(text);
    
    if (timeMarkers.length > 0) {
      setTimelineContext({
        currentTime: timeMarkers[timeMarkers.length - 1] || 'Present',
        previousEvents: timeMarkers.slice(0, -1),
        nextEvents: [],
        flashbacks: timeMarkers.filter(marker => 
          marker.toLowerCase().includes('ago') || 
          marker.toLowerCase().includes('yesterday') ||
          marker.toLowerCase().includes('remember')
        ),
        foreshadowing: timeMarkers.filter(marker => 
          marker.toLowerCase().includes('later') || 
          marker.toLowerCase().includes('tomorrow') ||
          marker.toLowerCase().includes('next')
        )
      });
    }
  };

  const extractTimeMarkers = (text: string): string[] => {
    const timePatterns = [
      /(\d+)\s+(hours?|days?|weeks?|months?|years?)\s+(ago|earlier|later)/gi,
      /(yesterday|today|tomorrow|morning|afternoon|evening|night)/gi,
      /(last|next)\s+(week|month|year|day)/gi,
      /(flashback|memory|remember|recall)/gi
    ];
    
    const markers: string[] = [];
    timePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        markers.push(...matches);
      }
    });
    
    return markers;
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'grammar': return <FaSpellCheck className="text-blue-500" />;
      case 'style': return <FaEdit className="text-purple-500" />;
      case 'character': return <FaUser className="text-green-500" />;
      case 'plot': return <FaBook className="text-orange-500" />;
      case 'timeline': return <FaClock className="text-red-500" />;
      case 'consistency': return <FaCheckCircle className="text-indigo-500" />;
      default: return <FaLightbulb className="text-yellow-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <FaExclamationTriangle className="text-red-500" />;
      case 'medium': return <FaExclamationTriangle className="text-yellow-500" />;
      case 'low': return <FaLightbulb className="text-blue-500" />;
      default: return <FaLightbulb className="text-gray-500" />;
    }
  };

  const handleSuggestionClick = (suggestion: WritingSuggestion) => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(suggestion.position.start, suggestion.position.end);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
            <FaMagic className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Live Writing Assistant</h2>
            <p className="text-gray-600">Get real-time feedback and suggestions as you write</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{wordCount}</div>
            <div className="text-xs text-gray-600">Words</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">~{readingTime}m</div>
            <div className="text-xs text-gray-600">Read Time</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Writing Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Chapter Info */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{currentChapter}</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowCharacterPanel(!showCharacterPanel)}
                >
                  <FaUser className="mr-2" />
                  Characters
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowTimelinePanel(!showTimelinePanel)}
                >
                  <FaClock className="mr-2" />
                  Timeline
                </Button>
              </div>
            </div>
            
            {/* Writing Textarea */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your story here... The assistant will provide real-time feedback and suggestions."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-gray-800"
            />
            
            {/* Analysis Status */}
            {isAnalyzing && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Analyzing content...</span>
                </div>
              </div>
            )}
          </Card>

          {/* Writing Suggestions */}
          {suggestions.length > 0 && (
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaLightbulb className="text-yellow-500" />
                Writing Suggestions ({suggestions.length})
              </h3>
              
              <div className="space-y-3">
                {suggestions.map(suggestion => (
                  <div
                    key={suggestion.id}
                    className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getSeverityColor(suggestion.severity)}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2">
                        {getSuggestionIcon(suggestion.type)}
                        {getSeverityIcon(suggestion.severity)}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{suggestion.message}</h4>
                        <p className="text-sm text-gray-600 mb-2">{suggestion.suggestion}</p>
                        <div className="text-xs text-gray-500">
                          Context: {suggestion.context.substring(0, 100)}...
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {Math.round(suggestion.confidence * 100)}% confidence
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Character References */}
          {showCharacterPanel && characterReferences.length > 0 && (
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaUser className="text-green-500" />
                Characters in Scene
              </h3>
              
              <div className="space-y-3">
                {characterReferences.map((ref, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{ref.name}</h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ref.consistency >= 80 ? 'bg-green-100 text-green-800' :
                        ref.consistency >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {ref.consistency}%
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <div>Last seen: {new Date(ref.lastSeen).toLocaleDateString()}</div>
                      <div>Appearance: {ref.appearance}</div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Context: {ref.currentContext.substring(0, 80)}...
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Timeline Context */}
          {showTimelinePanel && timelineContext && (
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaClock className="text-blue-500" />
                Timeline Context
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 mb-1">Current Time</div>
                  <div className="text-sm text-blue-700">{timelineContext.currentTime}</div>
                </div>
                
                {timelineContext.previousEvents.length > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-800 mb-1">Previous Events</div>
                    <div className="text-xs text-green-700 space-y-1">
                      {timelineContext.previousEvents.map((event, index) => (
                        <div key={index}>• {event}</div>
                      ))}
                    </div>
                  </div>
                )}
                
                {timelineContext.flashbacks.length > 0 && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm font-medium text-purple-800 mb-1">Flashbacks</div>
                    <div className="text-xs text-purple-700 space-y-1">
                      {timelineContext.flashbacks.map((flashback, index) => (
                        <div key={index}>• {flashback}</div>
                      ))}
                    </div>
                  </div>
                )}
                
                {timelineContext.foreshadowing.length > 0 && (
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-sm font-medium text-orange-800 mb-1">Foreshadowing</div>
                    <div className="text-xs text-orange-700 space-y-1">
                      {timelineContext.foreshadowing.map((foreshadow, index) => (
                        <div key={index}>• {foreshadow}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Writing Tips */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaBrain className="text-indigo-500" />
              Writing Tips
            </h3>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                <span>Use active voice for action scenes</span>
              </div>
              
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                <span>Vary sentence length for rhythm</span>
              </div>
              
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                <span>Show character emotions through actions</span>
              </div>
              
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                <span>Balance dialogue with description</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
