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

export interface FavoriteReference {
  id: string;
  type: 'style' | 'prompt';
  name: string;
  timestamp: number;
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

export interface WritingProgress {
  userId: string;
  completedExercises: {
    exerciseId: string;
    completedAt: number;
    notes?: string;
    wordCount?: number;
  }[];
  favoritePrompts: string[];
  favoriteStyles: string[];
  writingStreak: {
    currentStreak: number;
    longestStreak: number;
    lastWriteDate: number;
  };
  wordCountGoal: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  achievements: {
    id: string;
    unlockedAt: number;
    progress: number;
  }[];
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

export interface GenerateCharacterParams {
  genre: string;
  count: number;
  role?: 'protagonist' | 'antagonist' | 'supporting';
  context?: string;
}

export interface GeneratePlotParams {
  genre: string;
  complexity: 'simple' | 'moderate' | 'complex';
  count: number;
}

export interface GenerateSettingParams {
  genre: string;
  count: number;
}

export interface GenerateChapterParams {
  title: string;
  prompt: string;
  style: 'creative' | 'formal' | 'casual';
  tone: 'engaging' | 'serious' | 'humorous';
  length: number;
} 