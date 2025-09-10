// Core Book Types
export interface BookMetadata {
  title: string;
  author: string;
  genre?: string;
  synopsis?: string;
  isbn?: string;
  publisher?: string;
  copyrightYear?: number;
  genres: string[];
  description: string;
  targetAudience: string;
  wordCountGoal?: number;
  currentWordCount?: number;
  status?: 'in-progress' | 'completed' | 'draft';
  themes?: string[];
  setting?: string;
  createdAt?: string;
  lastModified?: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  summary: string;
  wordCount: number;
  order: number;
  status: 'draft' | 'review' | 'final';
  lastModified: string;
  pageNumber?: number;
}

export interface Character {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  description: string;
  background: string;
  motivations: string[];
  relationships: Array<{
    characterId: string;
    type: string;
  }>;
}

export interface Plot {
  summary: string;
  outline: string[];
  subplots?: string[];
}

export interface Setting {
  description: string;
  worldBuilding?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  chapterId?: string;
  characters: string[];
  type: 'major' | 'minor';
}

export interface Story {
  title: string;
  genre: string;
  synopsis: string;
}

// AI Generation Types
export interface GenerateParams {
  genre: string;
  count?: number;
}

export interface GenerateCharacterParams extends GenerateParams {
  role?: 'protagonist' | 'antagonist' | 'supporting';
  archetype?: string;
  personalityTraits?: string[];
  setting?: string;
}

export interface GeneratePlotParams extends GenerateParams {
  theme?: string;
  complexity?: 'simple' | 'moderate' | 'complex';
  characterRelationships?: boolean;
  plotTwist?: boolean;
  actStructure?: 'three' | 'five' | 'hero';
}

export interface GenerateSettingParams extends GenerateParams {
  timePeriod?: string;
  realism?: 'realistic' | 'semi-realistic' | 'fantastical';
  culturalInfluences?: string[];
  climate?: string;
}

export interface GenerateChapterParams {
  title: string;
  prompt: string;
  style?: 'professional' | 'creative' | 'casual';
  tone?: 'formal' | 'engaging' | 'humorous';
  pov?: 'first' | 'second' | 'third';
  length?: number;
  context?: {
    plot?: string;
    characters?: string;
    setting?: string;
    genre?: string;
    theme?: string;
    previousChapters?: string[];
  };
}

export interface GenerateTimelineEventParams {
  genre: string;
  chapterId?: string;
  characters?: string[];
  type?: 'major' | 'minor';
  context?: string;
}

export interface GenerateStoryParams {
  genre: string;
  theme?: string;
  complexity?: 'simple' | 'moderate' | 'complex';
  length?: 'short' | 'medium' | 'long';
}

// Writing Reference Types
export interface WritingStyle {
  name: string;
  description: string;
  characteristics: string[];
  examples: string[];
  tips: string[];
}

export interface WritingPrompt {
  id: string;
  title: string;
  description: string;
  genre: string;
  type: 'character' | 'plot' | 'setting' | 'scene' | 'dialogue';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface WritingExercise {
  id: string;
  title: string;
  description: string;
  type: 'warmup' | 'technique' | 'challenge' | 'revision';
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: string[];
  tips: string[];
  examples?: string[];
  tags: string[];
}

// UI Types
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface GenerateStoryResponse {
  title: string;
  synopsis: string;
  characters: Character[];
  plot: Plot;
  setting: Setting;
  chapters: Chapter[];
}

// Store State Types
export interface BookState {
  metadata: BookMetadata;
  chapters: Chapter[];
  characters: Character[];
  currentChapterId: string | null;
  lastSaved: Date | null;
  version: string;
  plot: Plot;
  setting: Setting;
  currentBook: {
    title: string;
    genres: string[];
  } | null;
} 