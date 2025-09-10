'use client';

import { useState, useEffect } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FaRobot, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaClock, 
  FaUser,
  FaBook,
  FaChartLine,
  FaLightbulb,
  FaEye,
  FaMagic,
  FaHistory,
  FaCalendarAlt,
  FaArrowRight,
  FaTimes,
  FaPlay,
  FaPause,
  FaSpinner
} from 'react-icons/fa';
import { 
  ChapterAnalysis, 
  StoryAnalysis, 
  GrammarIssue, 
  TimelineMarker, 
  ConsistencyIssue,
  CharacterArc 
} from '@/types/storyAnalysis';

export default function StoryConsistencyBot() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysis, setCurrentAnalysis] = useState<StoryAnalysis | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'grammar' | 'consistency' | 'timeline' | 'overview'>('overview');
  const [showDetails, setShowDetails] = useState(false);
  
  const { chapters, characters, metadata } = useBookStore();

  const analyzeStory = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Perform comprehensive story analysis
      const analysis = await performStoryAnalysis();
      setCurrentAnalysis(analysis);
      setAnalysisProgress(100);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performStoryAnalysis = async (): Promise<StoryAnalysis> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Analyze each chapter
    const chapterAnalyses = chapters.map(chapter => analyzeChapter(chapter));
    
    // Detect timeline markers and consistency issues
    const timelineMarkers = detectTimelineMarkers(chapters);
    const consistencyIssues = detectConsistencyIssues(chapters, characters);
    const characterArcs = analyzeCharacterArcs(chapters, characters);
    
    // Calculate overall scores
    const overallConsistency = calculateOverallConsistency(chapterAnalyses, consistencyIssues);
    const timelineCoherence = calculateTimelineCoherence(timelineMarkers);
    const characterConsistency = calculateCharacterConsistency(characterArcs);
    const plotLogic = calculatePlotLogic(chapters);
    
    return {
      bookId: 'current',
      overallConsistency,
      timelineCoherence,
      characterConsistency,
      plotLogic,
      totalChapters: chapters.length,
      completedChapters: chapters.filter(c => c.status === 'completed').length,
      chaptersInReview: chapters.filter(c => c.status === 'draft').length,
      totalWordCount: chapters.reduce((sum, c) => sum + (c.wordCount || 0), 0),
      averageChapterLength: Math.round(chapters.reduce((sum, c) => sum + (c.wordCount || 0), 0) / chapters.length),
      timelineMarkers,
      characterArcs,
      plotStructure: analyzePlotStructure(chapters),
      consistencyIssues,
      priorityActions: generatePriorityActions(consistencyIssues),
      suggestedImprovements: generateSuggestedImprovements(chapterAnalyses)
    };
  };

  const analyzeChapter = (chapter: any): ChapterAnalysis => {
    const wordCount = chapter.content?.length || 0;
    const estimatedReadingTime = Math.ceil(wordCount / 200); // 200 words per minute
    
    // Simulate grammar analysis
    const grammarIssues = detectGrammarIssues(chapter.content || '');
    const styleSuggestions = generateStyleSuggestions(chapter.content || '');
    const readabilityScore = calculateReadabilityScore(chapter.content || '');
    
    return {
      id: chapter.id,
      title: chapter.title,
      completionStatus: chapter.status as any,
      wordCount,
      estimatedReadingTime,
      lastAnalyzed: new Date().toISOString(),
      grammarIssues,
      styleSuggestions,
      readabilityScore,
      timelineMarkers: [],
      characterAppearances: [],
      plotPoints: [],
      consistencyIssues: []
    };
  };

  const detectGrammarIssues = (content: string): GrammarIssue[] => {
    const issues: GrammarIssue[] = [];
    
    // Simple grammar detection patterns (in real app, would use NLP library)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach((sentence, index) => {
      // Check for common issues
      if (sentence.includes('  ')) {
        issues.push({
          id: `grammar-${index}-1`,
          type: 'style',
          severity: 'low',
          message: 'Double spaces detected',
          suggestion: 'Remove extra spaces',
          context: sentence.trim(),
          position: { start: 0, end: sentence.length, line: index + 1 },
          category: 'syntax'
        });
      }
      
      if (sentence.length > 100) {
        issues.push({
          id: `grammar-${index}-2`,
          type: 'style',
          severity: 'medium',
          message: 'Very long sentence',
          suggestion: 'Consider breaking into shorter sentences',
          context: sentence.trim(),
          position: { start: 0, end: sentence.length, line: index + 1 },
          category: 'flow'
        });
      }
      
      // Check for passive voice patterns
      if (sentence.toLowerCase().includes('was') && sentence.toLowerCase().includes('by')) {
        issues.push({
          id: `grammar-${index}-3`,
          type: 'style',
          severity: 'medium',
          message: 'Passive voice detected',
          suggestion: 'Consider using active voice for more engaging writing',
          context: sentence.trim(),
          position: { start: 0, end: sentence.length, line: index + 1 },
          category: 'style'
        });
      }
    });
    
    return issues;
  };

  const generateStyleSuggestions = (content: string) => {
    const suggestions = [];
    
    // Analyze word variety
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCounts = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const overusedWords = Object.entries(wordCounts)
      .filter(([word, count]) => count > 5 && word.length > 3)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    overusedWords.forEach(([word, count]) => {
      suggestions.push({
        id: `style-${word}`,
        type: 'improvement',
        message: `Word "${word}" used ${count} times`,
        suggestion: 'Consider using synonyms or varying your vocabulary',
        reasoning: 'Repetitive word usage can make writing feel monotonous',
        impact: 'moderate'
      });
    });
    
    return suggestions;
  };

  const calculateReadabilityScore = (content: string): number => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.match(/\b\w+\b/g) || [];
    const syllables = content.match(/[aeiouy]+/gi) || [];
    
    if (sentences.length === 0 || words.length === 0) return 0;
    
    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = syllables.length / words.length;
    
    // Simple Flesch Reading Ease calculation
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    
    return Math.max(0, Math.min(100, Math.round(fleschScore)));
  };

  const detectTimelineMarkers = (chapters: any[]): TimelineMarker[] => {
    const markers: TimelineMarker[] = [];
    
    chapters.forEach(chapter => {
      const content = chapter.content || '';
      
      // Look for time-related phrases
      const timePatterns = [
        /(\d+)\s+(hours?|days?|weeks?|months?|years?)\s+(ago|earlier|later)/gi,
        /(yesterday|today|tomorrow|morning|afternoon|evening|night)/gi,
        /(last|next)\s+(week|month|year|day)/gi,
        /(flashback|memory|remember|recall)/gi,
        /(meanwhile|at\s+the\s+same\s+time|simultaneously)/gi
      ];
      
      timePatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            const type = determineTimelineType(match);
            markers.push({
              id: `timeline-${chapter.id}-${markers.length}`,
              type,
              description: `Time reference: "${match}"`,
              timeReference: match,
              chapterId: chapter.id,
              position: content.indexOf(match),
              confidence: 0.8,
              relatedMarkers: []
            });
          });
        }
      });
    });
    
    return markers;
  };

  const determineTimelineType = (timeRef: string): TimelineMarker['type'] => {
    const lower = timeRef.toLowerCase();
    
    if (lower.includes('ago') || lower.includes('yesterday') || lower.includes('last')) {
      return 'past';
    }
    if (lower.includes('later') || lower.includes('tomorrow') || lower.includes('next')) {
      return 'future';
    }
    if (lower.includes('flashback') || lower.includes('memory') || lower.includes('remember')) {
      return 'flashback';
    }
    if (lower.includes('meanwhile') || lower.includes('simultaneously')) {
      return 'present';
    }
    
    return 'present';
  };

  const detectConsistencyIssues = (chapters: any[], characters: any[]): ConsistencyIssue[] => {
    const issues: ConsistencyIssue[] = [];
    
    // Check character consistency across chapters
    characters.forEach(character => {
      const appearances = chapters.filter(chapter => 
        chapter.content?.toLowerCase().includes(character.name.toLowerCase())
      );
      
      if (appearances.length > 1) {
        // Check for character description consistency
        const descriptions = appearances.map(chapter => {
          const content = chapter.content || '';
          const nameIndex = content.toLowerCase().indexOf(character.name.toLowerCase());
          const context = content.substring(Math.max(0, nameIndex - 50), nameIndex + 100);
          return context;
        });
        
        // Simple consistency check (in real app, would use more sophisticated NLP)
        if (descriptions.length > 1) {
          const firstDesc = descriptions[0];
          const hasInconsistency = descriptions.some(desc => 
            Math.abs(desc.length - firstDesc.length) > 100
          );
          
          if (hasInconsistency) {
            issues.push({
              id: `consistency-${character.id}`,
              type: 'character',
              severity: 'medium',
              description: `Character "${character.name}" has varying descriptions across chapters`,
              affectedChapters: appearances.map(c => c.id),
              suggestion: 'Review and standardize character descriptions for consistency',
              evidence: descriptions.slice(0, 3)
            });
          }
        }
      }
    });
    
    return issues;
  };

  const analyzeCharacterArcs = (chapters: any[], characters: any[]): CharacterArc[] => {
    return characters.map(character => {
      const appearances = chapters.filter(chapter => 
        chapter.content?.toLowerCase().includes(character.name.toLowerCase())
      );
      
      const developmentStages = appearances.map((chapter, index) => ({
        stage: index === 0 ? 'introduction' : 
               index === appearances.length - 1 ? 'resolution' : 'development',
        chapterId: chapter.id,
        description: `Appears in "${chapter.title}"`,
        characterState: 'active'
      }));
      
      return {
        characterId: character.id,
        characterName: character.name,
        developmentStages,
        consistencyScore: 85, // Placeholder
        arcCompleteness: Math.min(100, (appearances.length / Math.max(chapters.length * 0.3, 1)) * 100),
        issues: []
      };
    });
  };

  const calculateOverallConsistency = (chapterAnalyses: ChapterAnalysis[], issues: ConsistencyIssue[]): number => {
    const baseScore = 100;
    const issuePenalty = issues.reduce((penalty, issue) => {
      switch (issue.severity) {
        case 'critical': return penalty + 20;
        case 'high': return penalty + 15;
        case 'medium': return penalty + 10;
        case 'low': return penalty + 5;
        default: return penalty;
      }
    }, 0);
    
    return Math.max(0, baseScore - issuePenalty);
  };

  const calculateTimelineCoherence = (markers: TimelineMarker[]): number => {
    if (markers.length === 0) return 100;
    
    // Simple coherence calculation based on marker types
    const presentMarkers = markers.filter(m => m.type === 'present').length;
    const totalMarkers = markers.length;
    
    return Math.round((presentMarkers / totalMarkers) * 100);
  };

  const calculateCharacterConsistency = (arcs: CharacterArc[]): number => {
    if (arcs.length === 0) return 100;
    
    const totalScore = arcs.reduce((sum, arc) => sum + arc.consistencyScore, 0);
    return Math.round(totalScore / arcs.length);
  };

  const calculatePlotLogic = (chapters: any[]): number => {
    // Placeholder calculation
    return 85;
  };

  const analyzePlotStructure = (chapters: any[]): any => {
    return {
      structure: 'linear',
      mainPlotPoints: [],
      subplots: [],
      pacing: 'steady',
      coherence: 85
    };
  };

  const generatePriorityActions = (issues: ConsistencyIssue[]): any[] => {
    return issues
      .filter(issue => issue.severity === 'critical' || issue.severity === 'high')
      .map(issue => ({
        id: `action-${issue.id}`,
        priority: issue.severity,
        action: issue.suggestion,
        reason: issue.description,
        estimatedEffort: '1-2 hours',
        impact: 'High - affects story coherence'
      }));
  };

  const generateSuggestedImprovements = (chapterAnalyses: ChapterAnalysis[]): any[] => {
    const suggestions = [];
    
    // Find chapters with low readability scores
    const lowReadabilityChapters = chapterAnalyses.filter(analysis => analysis.readabilityScore < 60);
    if (lowReadabilityChapters.length > 0) {
      suggestions.push({
        id: 'improvement-readability',
        category: 'style',
        suggestion: 'Improve readability in chapters with low scores',
        reasoning: 'Low readability can make your story difficult to follow',
        examples: lowReadabilityChapters.map(c => c.title),
        difficulty: 'medium'
      });
    }
    
    return suggestions;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <FaExclamationTriangle className="text-red-600" />;
      case 'high': return <FaExclamationTriangle className="text-orange-600" />;
      case 'medium': return <FaExclamationTriangle className="text-yellow-600" />;
      case 'low': return <FaCheckCircle className="text-blue-600" />;
      default: return <FaCheckCircle className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <FaRobot className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Story Consistency Bot</h2>
            <p className="text-gray-600">AI-powered analysis of grammar, timeline, and story coherence</p>
          </div>
        </div>
        
        <Button
          variant="primary"
          onClick={analyzeStory}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isAnalyzing ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Analyzing... {analysisProgress}%
            </>
          ) : (
            <>
              <FaMagic className="mr-2" />
              Analyze Story
            </>
          )}
        </Button>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Analysis Progress</h3>
              <span className="text-sm text-gray-600">{analysisProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${analysisProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600">
              Analyzing {chapters.length} chapters for grammar, consistency, and timeline coherence...
            </div>
          </div>
        </Card>
      )}

      {/* Analysis Results */}
      {currentAnalysis && !isAnalyzing && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentAnalysis.overallConsistency}%
              </div>
              <div className="text-sm text-gray-600">Overall Consistency</div>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {currentAnalysis.timelineCoherence}%
              </div>
              <div className="text-sm text-gray-600">Timeline Coherence</div>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {currentAnalysis.characterConsistency}%
              </div>
              <div className="text-sm text-gray-600">Character Consistency</div>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {currentAnalysis.plotLogic}%
              </div>
              <div className="text-sm text-gray-600">Plot Logic</div>
            </Card>
          </div>

          {/* Chapter Completion Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaBook className="text-blue-500" />
              Chapter Completion Status
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {currentAnalysis.completedChapters}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {currentAnalysis.chaptersInReview}
                </div>
                <div className="text-sm text-gray-600">In Review</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {currentAnalysis.totalWordCount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Words</div>
              </div>
            </div>
            
            <div className="space-y-2">
              {chapters.map(chapter => (
                <div key={chapter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      chapter.status === 'completed' ? 'bg-green-500' :
                      chapter.status === 'draft' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <span className="font-medium">{chapter.title}</span>
                    <span className="text-sm text-gray-500">
                      {chapter.wordCount || 0} words
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      chapter.status === 'completed' ? 'bg-green-100 text-green-800' :
                      chapter.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {chapter.status}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedChapter(chapter.id)}
                    >
                      <FaEye className="text-sm" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Timeline Analysis */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaClock className="text-purple-500" />
              Timeline Analysis
            </h3>
            
            {currentAnalysis.timelineMarkers.length > 0 ? (
              <div className="space-y-3">
                {currentAnalysis.timelineMarkers.map(marker => (
                  <div key={marker.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${
                      marker.type === 'flashback' ? 'bg-blue-100 text-blue-600' :
                      marker.type === 'past' ? 'bg-green-100 text-green-600' :
                      marker.type === 'future' ? 'bg-orange-100 text-orange-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <FaHistory className="text-sm" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium">{marker.description}</div>
                      <div className="text-sm text-gray-600">
                        Chapter: {chapters.find(c => c.id === marker.chapterId)?.title}
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      marker.type === 'flashback' ? 'bg-blue-100 text-blue-800' :
                      marker.type === 'past' ? 'bg-green-100 text-green-800' :
                      marker.type === 'future' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {marker.type}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaClock className="text-4xl mx-auto mb-2 text-gray-300" />
                <p>No timeline markers detected</p>
                <p className="text-sm">The bot will identify flashbacks, foreshadowing, and time references</p>
              </div>
            )}
          </Card>

          {/* Consistency Issues */}
          {currentAnalysis.consistencyIssues.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" />
                Consistency Issues Found
              </h3>
              
              <div className="space-y-3">
                {currentAnalysis.consistencyIssues.map(issue => (
                  <div key={issue.id} className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(issue.severity)}
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{issue.description}</h4>
                        <p className="text-sm mb-2">{issue.suggestion}</p>
                        <div className="text-xs text-gray-600">
                          Affects: {issue.affectedChapters.length} chapter(s)
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Priority Actions */}
          {currentAnalysis.priorityActions.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaLightbulb className="text-yellow-500" />
                Recommended Actions
              </h3>
              
              <div className="space-y-3">
                {currentAnalysis.priorityActions.map(action => (
                  <div key={action.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${
                      action.priority === 'critical' ? 'bg-red-100 text-red-600' :
                      action.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                      action.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <FaArrowRight className="text-sm" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{action.action}</h4>
                      <p className="text-sm text-gray-600 mb-2">{action.reason}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Effort: {action.estimatedEffort}</span>
                        <span>Impact: {action.impact}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* No Analysis Yet */}
      {!currentAnalysis && !isAnalyzing && (
        <Card className="p-12 text-center">
          <FaRobot className="text-6xl mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Ready to Analyze Your Story
          </h3>
          <p className="text-gray-500 mb-6">
            The Story Consistency Bot will analyze your book for grammar issues, timeline coherence, 
            character consistency, and plot logic. Click "Analyze Story" to begin.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="p-4 bg-blue-50 rounded-lg">
              <FaCheckCircle className="text-blue-500 text-2xl mx-auto mb-2" />
              <div className="font-medium">Grammar & Style</div>
              <div>Check for errors and improvements</div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <FaClock className="text-green-500 text-2xl mx-auto mb-2" />
              <div className="font-medium">Timeline Analysis</div>
              <div>Detect flashbacks and foreshadowing</div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <FaUser className="text-purple-500 text-2xl mx-auto mb-2" />
              <div className="font-medium">Character Consistency</div>
              <div>Track character development arcs</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
