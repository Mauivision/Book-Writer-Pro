export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  color: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
}

export type AchievementCategory = 
  | 'wordCount' 
  | 'chapters' 
  | 'streak' 
  | 'characters' 
  | 'plot' 
  | 'writing' 
  | 'special';

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: AchievementCategory;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlockCondition: {
    type: string;
    value: number;
    description: string;
  };
}

export interface UserProgress {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalWordsWritten: number;
  chaptersCompleted: number;
  charactersCreated: number;
  achievementsUnlocked: number;
  lastWritingDate?: string;
  writingSessions: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'wordCount' | 'character' | 'plot' | 'dialogue' | 'setting';
  target: number;
  reward: number;
  isCompleted: boolean;
  completedAt?: string;
  expiresAt: string;
}

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  // Word Count Achievements
  {
    id: 'first-words',
    title: 'First Words',
    description: 'Write your first 100 words',
    icon: '✍️',
    color: '#10B981',
    category: 'wordCount',
    rarity: 'common',
    xpReward: 10,
    unlockCondition: {
      type: 'wordCount',
      value: 100,
      description: 'Write 100 words'
    }
  },
  {
    id: 'thousand-words',
    title: 'Thousand Words',
    description: 'Write 1,000 words',
    icon: '📝',
    color: '#10B981',
    category: 'wordCount',
    rarity: 'common',
    xpReward: 25,
    unlockCondition: {
      type: 'wordCount',
      value: 1000,
      description: 'Write 1,000 words'
    }
  },
  {
    id: 'five-thousand',
    title: 'Five Thousand',
    description: 'Write 5,000 words',
    icon: '📚',
    color: '#3B82F6',
    category: 'wordCount',
    rarity: 'common',
    xpReward: 50,
    unlockCondition: {
      type: 'wordCount',
      value: 5000,
      description: 'Write 5,000 words'
    }
  },
  {
    id: 'ten-thousand',
    title: 'Ten Thousand',
    description: 'Write 10,000 words',
    icon: '📖',
    color: '#8B5CF6',
    category: 'wordCount',
    rarity: 'rare',
    xpReward: 100,
    unlockCondition: {
      type: 'wordCount',
      value: 10000,
      description: 'Write 10,000 words'
    }
  },
  {
    id: 'novel-length',
    title: 'Novel Length',
    description: 'Write 50,000 words',
    icon: '📚',
    color: '#F59E0B',
    category: 'wordCount',
    rarity: 'epic',
    xpReward: 250,
    unlockCondition: {
      type: 'wordCount',
      value: 50000,
      description: 'Write 50,000 words'
    }
  },
  {
    id: 'master-writer',
    title: 'Master Writer',
    description: 'Write 100,000 words',
    icon: '👑',
    color: '#EF4444',
    category: 'wordCount',
    rarity: 'legendary',
    xpReward: 500,
    unlockCondition: {
      type: 'wordCount',
      value: 100000,
      description: 'Write 100,000 words'
    }
  },

  // Chapter Achievements
  {
    id: 'first-chapter',
    title: 'First Chapter',
    description: 'Complete your first chapter',
    icon: '📄',
    color: '#10B981',
    category: 'chapters',
    rarity: 'common',
    xpReward: 15,
    unlockCondition: {
      type: 'chapters',
      value: 1,
      description: 'Complete 1 chapter'
    }
  },
  {
    id: 'chapter-master',
    title: 'Chapter Master',
    description: 'Complete 10 chapters',
    icon: '📚',
    color: '#8B5CF6',
    category: 'chapters',
    rarity: 'rare',
    xpReward: 75,
    unlockCondition: {
      type: 'chapters',
      value: 10,
      description: 'Complete 10 chapters'
    }
  },
  {
    id: 'book-builder',
    title: 'Book Builder',
    description: 'Complete 20 chapters',
    icon: '📖',
    color: '#F59E0B',
    category: 'chapters',
    rarity: 'epic',
    xpReward: 150,
    unlockCondition: {
      type: 'chapters',
      value: 20,
      description: 'Complete 20 chapters'
    }
  },

  // Streak Achievements
  {
    id: 'three-day-streak',
    title: 'Three Day Streak',
    description: 'Write for 3 consecutive days',
    icon: '🔥',
    color: '#10B981',
    category: 'streak',
    rarity: 'common',
    xpReward: 20,
    unlockCondition: {
      type: 'streak',
      value: 3,
      description: 'Write for 3 consecutive days'
    }
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Write for 7 consecutive days',
    icon: '🔥🔥',
    color: '#3B82F6',
    category: 'streak',
    rarity: 'common',
    xpReward: 50,
    unlockCondition: {
      type: 'streak',
      value: 7,
      description: 'Write for 7 consecutive days'
    }
  },
  {
    id: 'monthly-master',
    title: 'Monthly Master',
    description: 'Write for 30 consecutive days',
    icon: '🔥🔥🔥',
    color: '#8B5CF6',
    category: 'streak',
    rarity: 'epic',
    xpReward: 200,
    unlockCondition: {
      type: 'streak',
      value: 30,
      description: 'Write for 30 consecutive days'
    }
  },
  {
    id: 'hundred-day-hero',
    title: 'Hundred Day Hero',
    description: 'Write for 100 consecutive days',
    icon: '🔥🔥🔥🔥',
    color: '#EF4444',
    category: 'streak',
    rarity: 'legendary',
    xpReward: 1000,
    unlockCondition: {
      type: 'streak',
      value: 100,
      description: 'Write for 100 consecutive days'
    }
  },

  // Character Achievements
  {
    id: 'character-creator',
    title: 'Character Creator',
    description: 'Create your first character',
    icon: '👤',
    color: '#10B981',
    category: 'characters',
    rarity: 'common',
    xpReward: 15,
    unlockCondition: {
      type: 'characters',
      value: 1,
      description: 'Create 1 character'
    }
  },
  {
    id: 'ensemble-cast',
    title: 'Ensemble Cast',
    description: 'Create 5 characters',
    icon: '👥',
    color: '#3B82F6',
    category: 'characters',
    rarity: 'common',
    xpReward: 40,
    unlockCondition: {
      type: 'characters',
      value: 5,
      description: 'Create 5 characters'
    }
  },
  {
    id: 'character-master',
    title: 'Character Master',
    description: 'Create 10 characters',
    icon: '🎭',
    color: '#8B5CF6',
    category: 'characters',
    rarity: 'rare',
    xpReward: 100,
    unlockCondition: {
      type: 'characters',
      value: 10,
      description: 'Create 10 characters'
    }
  },

  // Plot Achievements
  {
    id: 'plot-weaver',
    title: 'Plot Weaver',
    description: 'Create a plot outline',
    icon: '🕸️',
    color: '#10B981',
    category: 'plot',
    rarity: 'common',
    xpReward: 20,
    unlockCondition: {
      type: 'plot',
      value: 1,
      description: 'Create a plot outline'
    }
  },
  {
    id: 'story-architect',
    title: 'Story Architect',
    description: 'Develop a complex plot with multiple storylines',
    icon: '🏗️',
    color: '#8B5CF6',
    category: 'plot',
    rarity: 'rare',
    xpReward: 75,
    unlockCondition: {
      type: 'plot',
      value: 5,
      description: 'Create 5 plot points'
    }
  },

  // Special Achievements
  {
    id: 'first-session',
    title: 'First Session',
    description: 'Complete your first writing session',
    icon: '🎯',
    color: '#10B981',
    category: 'special',
    rarity: 'common',
    xpReward: 10,
    unlockCondition: {
      type: 'sessions',
      value: 1,
      description: 'Complete 1 writing session'
    }
  },
  {
    id: 'speed-writer',
    title: 'Speed Writer',
    description: 'Write 500 words in a single session',
    icon: '⚡',
    color: '#F59E0B',
    category: 'special',
    rarity: 'rare',
    xpReward: 50,
    unlockCondition: {
      type: 'sessionWords',
      value: 500,
      description: 'Write 500 words in one session'
    }
  },
  {
    id: 'marathon-writer',
    title: 'Marathon Writer',
    description: 'Write 1000 words in a single session',
    icon: '🏃',
    color: '#EF4444',
    category: 'special',
    rarity: 'epic',
    xpReward: 100,
    unlockCondition: {
      type: 'sessionWords',
      value: 1000,
      description: 'Write 1000 words in one session'
    }
  }
];

export const DAILY_CHALLENGES: Omit<DailyChallenge, 'id' | 'isCompleted' | 'expiresAt'>[] = [
  {
    title: 'Word Sprint',
    description: 'Write 500 words today',
    type: 'wordCount',
    target: 500,
    reward: 25
  },
  {
    title: 'Character Development',
    description: 'Add a new character or develop an existing one',
    type: 'character',
    target: 1,
    reward: 20
  },
  {
    title: 'Plot Twist',
    description: 'Create a plot twist or surprise element',
    type: 'plot',
    target: 1,
    reward: 30
  },
  {
    title: 'Dialogue Master',
    description: 'Write a dialogue scene between characters',
    type: 'dialogue',
    target: 1,
    reward: 25
  },
  {
    title: 'Setting Creator',
    description: 'Describe a new setting or location',
    type: 'setting',
    target: 1,
    reward: 20
  }
];
