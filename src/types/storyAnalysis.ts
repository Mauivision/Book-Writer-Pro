export interface ChapterAnalysis {
  id: string;
  title: string;
  completionStatus: 'draft' | 'in-progress' | 'completed' | 'reviewed';
  wordCount: number;
  estimatedReadingTime: number; // in minutes
  lastAnalyzed: string;
  
  // Grammar & Style Analysis
  grammarIssues: GrammarIssue[];
  styleSuggestions: StyleSuggestion[];
  readabilityScore: number; // 0-100
  
  // Story Consistency
  timelineMarkers: TimelineMarker[];
  characterAppearances: CharacterAppearance[];
  plotPoints: PlotPoint[];
  consistencyIssues: ConsistencyIssue[];
}

export interface GrammarIssue {
  id: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'style' | 'clarity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  suggestion: string;
  context: string;
  position: {
    start: number;
    end: number;
    line: number;
  };
  category: 'syntax' | 'semantics' | 'flow' | 'repetition' | 'ambiguity';
}

export interface StyleSuggestion {
  id: string;
  type: 'improvement' | 'alternative' | 'enhancement';
  message: string;
  suggestion: string;
  reasoning: string;
  impact: 'minor' | 'moderate' | 'major';
}

export interface TimelineMarker {
  id: string;
  type: 'present' | 'past' | 'future' | 'flashback' | 'foreshadowing';
  description: string;
  timeReference: string; // e.g., "2 hours earlier", "3 days ago", "next week"
  chapterId: string;
  position: number;
  confidence: number; // 0-1
  relatedMarkers: string[]; // IDs of related timeline events
}

export interface CharacterAppearance {
  characterId: string;
  characterName: string;
  chapterId: string;
  firstAppearance: number; // position in chapter
  lastAppearance: number;
  dialogueCount: number;
  actionCount: number;
  descriptionUpdates: string[];
}

export interface PlotPoint {
  id: string;
  type: 'setup' | 'conflict' | 'climax' | 'resolution' | 'twist' | 'revelation';
  description: string;
  chapterId: string;
  position: number;
  relatedPlotPoints: string[];
  characterInvolvement: string[];
  foreshadowingElements: string[];
}

export interface ConsistencyIssue {
  id: string;
  type: 'timeline' | 'character' | 'plot' | 'setting' | 'continuity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedChapters: string[];
  suggestion: string;
  evidence: string[];
}

export interface StoryAnalysis {
  bookId: string;
  overallConsistency: number; // 0-100
  timelineCoherence: number;
  characterConsistency: number;
  plotLogic: number;
  
  // Summary Statistics
  totalChapters: number;
  completedChapters: number;
  chaptersInReview: number;
  totalWordCount: number;
  averageChapterLength: number;
  
  // Analysis Results
  timelineMarkers: TimelineMarker[];
  characterArcs: CharacterArc[];
  plotStructure: PlotStructure;
  consistencyIssues: ConsistencyIssue[];
  
  // Recommendations
  priorityActions: PriorityAction[];
  suggestedImprovements: SuggestedImprovement[];
}

export interface CharacterArc {
  characterId: string;
  characterName: string;
  developmentStages: DevelopmentStage[];
  consistencyScore: number;
  arcCompleteness: number;
  issues: ConsistencyIssue[];
}

export interface DevelopmentStage {
  stage: 'introduction' | 'development' | 'conflict' | 'growth' | 'resolution';
  chapterId: string;
  description: string;
  characterState: string;
}

export interface PlotStructure {
  structure: 'linear' | 'non-linear' | 'circular' | 'parallel' | 'complex';
  mainPlotPoints: PlotPoint[];
  subplots: PlotPoint[];
  pacing: 'slow' | 'steady' | 'fast' | 'varied';
  coherence: number;
}

export interface PriorityAction {
  id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  action: string;
  reason: string;
  estimatedEffort: string;
  impact: string;
}

export interface SuggestedImprovement {
  id: string;
  category: 'grammar' | 'style' | 'consistency' | 'structure' | 'pacing';
  suggestion: string;
  reasoning: string;
  examples: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GrammarCheckResult {
  issues: GrammarIssue[];
  suggestions: StyleSuggestion[];
  overallScore: number;
  readabilityMetrics: ReadabilityMetrics;
  styleAnalysis: StyleAnalysis;
}

export interface ReadabilityMetrics {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  gunningFogIndex: number;
  smogIndex: number;
  averageSentenceLength: number;
  averageWordLength: number;
  complexWordPercentage: number;
}

export interface StyleAnalysis {
  sentenceVariety: number;
  paragraphLength: number;
  dialoguePercentage: number;
  descriptivePercentage: number;
  actionPercentage: number;
  passiveVoicePercentage: number;
  repetitivePhrases: string[];
  overusedWords: string[];
}
