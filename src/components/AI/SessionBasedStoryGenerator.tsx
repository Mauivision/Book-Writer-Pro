'use client';

import { useState, useEffect } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FaMagic, 
  FaBook, 
  FaFire, 
  FaTrophy, 
  FaSpinner, 
  FaLightbulb,
  FaChartLine,
  FaUsers,
  FaCalendar,
  FaStar,
  FaRocket
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface StorySuggestion {
  id: string;
  title: string;
  description: string;
  inspiration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedWords: number;
  genre: string;
  themes: string[];
  icon: React.ReactNode;
}

export default function SessionBasedStoryGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<StorySuggestion | null>(null);
  const [generatedStory, setGeneratedStory] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const { 
    userProgress, 
    achievements, 
    writingSessions, 
    chapters, 
    characters,
    generateCompleteStory,
    addWritingSession,
    checkAchievements
  } = useBookStore();

  // Generate story suggestions based on user's writing sessions and achievements
  const generateStorySuggestions = (): StorySuggestion[] => {
    const suggestions: StorySuggestion[] = [];
    
    // Analyze writing patterns
    const totalSessions = writingSessions.length;
    const averageWordsPerSession = totalSessions > 0 
      ? writingSessions.reduce((sum, session) => sum + session.wordCount, 0) / totalSessions 
      : 0;
    const longestSession = Math.max(...writingSessions.map(s => s.wordCount), 0);
    const currentStreak = userProgress.currentStreak;
    const unlockedAchievements = achievements.filter(a => a.isUnlocked);
    
    // Suggestion 1: Based on writing streak
    if (currentStreak >= 3) {
      suggestions.push({
        id: 'streak-story',
        title: 'The Streak Continues',
        description: 'A story about persistence and momentum, inspired by your writing streak',
        inspiration: `You've been writing for ${currentStreak} consecutive days!`,
        difficulty: 'easy',
        estimatedWords: Math.min(1000, averageWordsPerSession * 2),
        genre: 'Motivational',
        themes: ['Persistence', 'Growth', 'Habit Formation'],
        icon: <FaFire className="text-red-500" />
      });
    }

    // Suggestion 2: Based on word count achievements
    const wordCountAchievements = unlockedAchievements.filter(a => a.category === 'wordCount');
    if (wordCountAchievements.length > 0) {
      const latestAchievement = wordCountAchievements[wordCountAchievements.length - 1];
      suggestions.push({
        id: 'milestone-story',
        title: 'Beyond the Milestone',
        description: `A story celebrating your achievement of ${latestAchievement.title}`,
        inspiration: `You've reached ${latestAchievement.title}!`,
        difficulty: 'medium',
        estimatedWords: Math.min(2000, averageWordsPerSession * 3),
        genre: 'Celebration',
        themes: ['Achievement', 'Progress', 'Success'],
        icon: <FaTrophy className="text-yellow-500" />
      });
    }

    // Suggestion 3: Based on character development
    if (characters.length > 0) {
      suggestions.push({
        id: 'character-story',
        title: 'Character Chronicles',
        description: 'A story featuring your existing characters in new situations',
        inspiration: `You have ${characters.length} well-developed characters to work with`,
        difficulty: 'medium',
        estimatedWords: Math.min(1500, averageWordsPerSession * 2.5),
        genre: 'Character-Driven',
        themes: ['Relationships', 'Development', 'Conflict'],
        icon: <FaUsers className="text-blue-500" />
      });
    }

    // Suggestion 4: Based on writing sessions pattern
    if (totalSessions >= 5) {
      const mostProductiveDay = writingSessions.reduce((max, session) => 
        session.wordCount > max.wordCount ? session : max
      );
      
      suggestions.push({
        id: 'productivity-story',
        title: 'The Productive Day',
        description: 'A story inspired by your most productive writing session',
        inspiration: `Your best session was ${mostProductiveDay.wordCount} words on ${new Date(mostProductiveDay.date).toLocaleDateString()}`,
        difficulty: 'easy',
        estimatedWords: mostProductiveDay.wordCount,
        genre: 'Inspirational',
        themes: ['Productivity', 'Focus', 'Achievement'],
        icon: <FaChartLine className="text-green-500" />
      });
    }

    // Suggestion 5: Based on chapter count
    if (chapters.length > 0) {
      suggestions.push({
        id: 'chapter-story',
        title: 'Chapter Evolution',
        description: 'A story that builds upon your existing chapters',
        inspiration: `You have ${chapters.length} chapters to build upon`,
        difficulty: 'hard',
        estimatedWords: Math.min(3000, averageWordsPerSession * 4),
        genre: 'Continuation',
        themes: ['Continuity', 'Development', 'Expansion'],
        icon: <FaBook className="text-purple-500" />
      });
    }

    // Suggestion 6: Achievement celebration story
    if (unlockedAchievements.length >= 3) {
      suggestions.push({
        id: 'achievement-story',
        title: 'Achievement Unlocked',
        description: 'A story celebrating all your writing achievements',
        inspiration: `You've unlocked ${unlockedAchievements.length} achievements!`,
        difficulty: 'medium',
        estimatedWords: Math.min(2500, averageWordsPerSession * 3.5),
        genre: 'Celebration',
        themes: ['Success', 'Milestones', 'Recognition'],
        icon: <FaStar className="text-yellow-500" />
      });
    }

    // Suggestion 7: Streak challenge story
    if (currentStreak >= 7) {
      suggestions.push({
        id: 'streak-challenge',
        title: 'The Week Warrior',
        description: 'A story about maintaining momentum and breaking through barriers',
        inspiration: `You've maintained a ${currentStreak}-day writing streak!`,
        difficulty: 'hard',
        estimatedWords: Math.min(4000, averageWordsPerSession * 5),
        genre: 'Motivational',
        themes: ['Discipline', 'Consistency', 'Breakthrough'],
        icon: <FaRocket className="text-orange-500" />
      });
    }

    return suggestions;
  };

  const handleGenerateStory = async (suggestion: StorySuggestion) => {
    setIsGenerating(true);
    setSelectedSuggestion(suggestion);
    setShowSuggestions(false);

    try {
      // Create a custom prompt based on the suggestion
      const customPrompt = `Generate a ${suggestion.genre.toLowerCase()} story inspired by: ${suggestion.inspiration}. 
      
The story should:
- Be approximately ${suggestion.estimatedWords} words
- Include themes of: ${suggestion.themes.join(', ')}
- Be ${suggestion.difficulty} difficulty level
- Be engaging and motivational for a writer

Context from the user's writing journey:
- Total writing sessions: ${writingSessions.length}
- Current streak: ${userProgress.currentStreak} days
- Total words written: ${userProgress.totalWordsWritten}
- Achievements unlocked: ${achievements.filter(a => a.isUnlocked).length}

Make this story personal and inspiring, drawing from the user's writing journey and achievements.`;

      await generateCompleteStory({
        genre: suggestion.genre,
        theme: suggestion.themes[0],
        complexity: suggestion.difficulty === 'easy' ? 'beginner' : suggestion.difficulty === 'medium' ? 'intermediate' : 'advanced',
        length: suggestion.estimatedWords < 1500 ? 'short' : suggestion.estimatedWords < 3000 ? 'medium' : 'long',
        customPrompt
      });

      // Add this as a writing session
      addWritingSession(suggestion.estimatedWords);
      
      // Check for new achievements
      const newAchievements = checkAchievements();
      
      if (newAchievements.length > 0) {
        toast.success(`🎉 New achievements unlocked! Check your progress.`);
      }

      toast.success(`✨ Story generated based on your writing journey!`);
      setGeneratedStory('Story generated successfully! Check your chapters.');
      
    } catch (error) {
      console.error('Error generating story:', error);
      toast.error('Failed to generate story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const suggestions = generateStorySuggestions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaMagic className="text-purple-600" />
            Session-Based Story Generator
          </h2>
          <p className="text-gray-600 mt-1">
            Generate stories inspired by your writing journey and achievements
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowSuggestions(!showSuggestions)}
        >
          {showSuggestions ? 'Hide Suggestions' : 'Show Suggestions'}
        </Button>
      </div>

      {/* Writing Stats Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaLightbulb className="text-yellow-500" />
          Your Writing Journey
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{writingSessions.length}</div>
            <div className="text-sm text-gray-600">Writing Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{userProgress.currentStreak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{userProgress.totalWordsWritten.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Words</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{achievements.filter(a => a.isUnlocked).length}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </div>
        </div>
      </Card>

      {/* Story Suggestions */}
      {showSuggestions && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Story Suggestions Based on Your Journey
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {suggestion.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(suggestion.difficulty)}`}>
                        {suggestion.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                    <div className="text-xs text-gray-500 mb-3">
                      <strong>Inspiration:</strong> {suggestion.inspiration}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-600">
                        ~{suggestion.estimatedWords.toLocaleString()} words
                      </div>
                      <div className="text-sm text-gray-600">
                        {suggestion.genre}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {suggestion.themes.map((theme, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {theme}
                        </span>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleGenerateStory(suggestion)}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating && selectedSuggestion?.id === suggestion.id ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FaMagic className="mr-2" />
                          Generate Story
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {suggestions.length === 0 && (
            <Card className="p-6 text-center">
              <FaCalendar className="text-gray-400 text-3xl mx-auto mb-3" />
              <p className="text-gray-600">
                Start writing more to unlock personalized story suggestions!
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Generated Story Result */}
      {generatedStory && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Story Generated Successfully! 🎉
          </h3>
          <p className="text-gray-600 mb-4">
            Your story has been created based on your writing journey. Check your chapters to see the new content!
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">
              Inspiration: {selectedSuggestion?.inspiration}
            </h4>
            <p className="text-green-700 text-sm">
              This story was generated based on your {selectedSuggestion?.difficulty} level writing pattern and achievements.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
