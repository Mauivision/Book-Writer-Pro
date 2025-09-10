'use client';

import { useState, useEffect } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FaChartLine, 
  FaBook, 
  FaUser, 
  FaClock, 
  FaBullseye, 
  FaTrophy,
  FaLightbulb,
  FaCalendar,
  FaFire,
  FaBrain,
  FaPalette,
  FaEye,
  FaStar,
  FaMedal,
  FaCrown
} from 'react-icons/fa';
import { aiBrain } from '@/utils/aiBrain';
import { Achievement } from '@/types/achievements';

interface WritingStats {
  totalWords: number;
  chaptersCompleted: number;
  averageWordsPerChapter: number;
  writingStreak: number;
  totalSessions: number;
  averageSessionLength: number;
  favoriteWritingTime: string;
  productivityScore: number;
  genreDistribution: Record<string, number>;
  characterDevelopment: number;
  plotComplexity: number;
}

interface WritingInsight {
  type: 'productivity' | 'style' | 'character' | 'plot' | 'motivation';
  title: string;
  description: string;
  recommendation: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
}

export default function WritingAnalytics() {
  const [stats, setStats] = useState<WritingStats | null>(null);
  const [insights, setInsights] = useState<WritingInsight[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('all');
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [showAchievements, setShowAchievements] = useState(true);

  const { 
    chapters, 
    characters, 
    plot, 
    metadata,
    achievements,
    userProgress,
    checkAchievements
  } = useBookStore();

  useEffect(() => {
    calculateWritingStats();
    generateInsights();
    // Check achievements when component mounts
    checkAchievements();
  }, [chapters, characters, plot, selectedTimeframe]);

  const calculateWritingStats = () => {
    const totalWords = chapters.reduce((sum, chapter) => sum + (chapter.content?.length || 0), 0);
    const chaptersCompleted = chapters.length;
    const averageWordsPerChapter = chaptersCompleted > 0 ? Math.round(totalWords / chaptersCompleted) : 0;
    
    // Calculate writing streak (simplified - in real app would track actual dates)
    const writingStreak = Math.min(chaptersCompleted, 7); // Placeholder
    
    // Calculate productivity score (0-100)
    const productivityScore = Math.min(100, Math.round(
      (totalWords / 1000) * 10 + // Words written bonus
      (chaptersCompleted * 5) + // Chapter completion bonus
      (writingStreak * 2) // Streak bonus
    ));

    // Character development score
    const characterDevelopment = characters.length > 0 ? 
      Math.min(100, characters.reduce((score, char) => {
        const charScore = (char.description?.length || 0) / 10 +
                         (char.background?.length || 0) / 20 +
                         (char.motivations?.length || 0) * 5;
        return score + Math.min(20, charScore);
      }, 0)) : 0;

    // Plot complexity score
    const plotComplexity = plot.summary ? 
      Math.min(100, (plot.summary.length / 10) + (plot.outline?.length || 0) * 5) : 0;

    const newStats: WritingStats = {
      totalWords,
      chaptersCompleted,
      averageWordsPerChapter,
      writingStreak,
      totalSessions: chaptersCompleted, // Placeholder
      averageSessionLength: averageWordsPerChapter,
      favoriteWritingTime: 'Morning', // Placeholder
      productivityScore,
      genreDistribution: { [metadata.genres[0] || 'General']: 100 },
      characterDevelopment,
      plotComplexity
    };

    setStats(newStats);
  };

  const generateInsights = () => {
    if (!stats) return;

    const newInsights: WritingInsight[] = [];

    // Productivity insights
    if (stats.productivityScore < 30) {
      newInsights.push({
        type: 'productivity',
        title: 'Boost Your Writing Momentum',
        description: 'Your productivity score is lower than optimal. Consider setting smaller, achievable daily goals.',
        recommendation: 'Try writing just 100 words per day to build momentum.',
        icon: <FaBullseye className="text-blue-500" />,
        priority: 'high'
      });
    } else if (stats.productivityScore > 70) {
      newInsights.push({
        type: 'productivity',
        title: 'Excellent Writing Progress!',
        description: 'You\'re maintaining great momentum. Keep up the fantastic work!',
        recommendation: 'Consider increasing your daily word count goal.',
        icon: <FaTrophy className="text-yellow-500" />,
        priority: 'medium'
      });
    }

    // Character development insights
    if (stats.characterDevelopment < 50) {
      newInsights.push({
        type: 'character',
        title: 'Deepen Your Characters',
        description: 'Your characters could benefit from more detailed development.',
        recommendation: 'Add more background details and motivations to your characters.',
        icon: <FaUser className="text-purple-500" />,
        priority: 'medium'
      });
    }

    // Plot complexity insights
    if (stats.plotComplexity < 40) {
      newInsights.push({
        type: 'plot',
        title: 'Enhance Your Plot Structure',
        description: 'Your plot could be more complex and engaging.',
        recommendation: 'Add subplots and develop more detailed story beats.',
        icon: <FaBook className="text-green-500" />,
        priority: 'medium'
      });
    }

    // Writing style insights
    if (stats.averageWordsPerChapter < 1000) {
      newInsights.push({
        type: 'style',
        title: 'Expand Your Chapters',
        description: 'Your chapters are quite short. Consider adding more detail and development.',
        recommendation: 'Aim for 1,500-2,500 words per chapter for better pacing.',
        icon: <FaPalette className="text-indigo-500" />,
        priority: 'low'
      });
    }

    // Motivation insights
    if (stats.writingStreak < 3) {
      newInsights.push({
        type: 'motivation',
        title: 'Build a Writing Habit',
        description: 'Consistency is key to completing your book.',
        recommendation: 'Set a daily writing time and stick to it, even if just for 15 minutes.',
        icon: <FaFire className="text-red-500" />,
        priority: 'high'
      });
    }

    setInsights(newInsights);
  };

  const getProductivityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-200';
      case 'rare': return 'border-blue-200';
      case 'epic': return 'border-purple-200';
      case 'legendary': return 'border-yellow-200';
      default: return 'border-gray-200';
    }
  };

  const getRarityBackground = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-50';
      case 'rare': return 'bg-blue-50';
      case 'epic': return 'bg-purple-50';
      case 'legendary': return 'bg-yellow-50';
      default: return 'bg-gray-50';
    }
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaChartLine className="text-blue-600" />
            Writing Analytics
          </h2>
          <p className="text-gray-600 mt-1">Track your progress and get personalized insights</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedTimeframe === 'week' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedTimeframe('week')}
          >
            Week
          </Button>
          <Button
            variant={selectedTimeframe === 'month' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedTimeframe('month')}
          >
            Month
          </Button>
          <Button
            variant={selectedTimeframe === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedTimeframe('all')}
          >
            All Time
          </Button>
        </div>
      </div>

      {/* Achievement Badges Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FaTrophy className="text-2xl text-yellow-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">Achievement Badges</h3>
              <p className="text-gray-600">
                {achievements.filter(a => a.isUnlocked).length} of {achievements.length} unlocked
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAchievements(!showAchievements)}
          >
            {showAchievements ? 'Hide' : 'Show'} Badges
          </Button>
        </div>

        {showAchievements && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`p-4 text-center transition-all duration-300 hover:scale-105 ${
                  achievement.isUnlocked 
                    ? `${getRarityBackground(achievement.rarity)} ${getRarityBorder(achievement.rarity)} border-2 shadow-lg` 
                    : 'bg-gray-100 border-gray-200 opacity-60'
                }`}
              >
                <div className={`text-3xl mb-2 ${achievement.isUnlocked ? getRarityColor(achievement.rarity) : 'text-gray-400'}`}>
                  {achievement.icon}
                </div>
                <h4 className={`font-semibold text-sm mb-1 ${
                  achievement.isUnlocked ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h4>
                
                {!achievement.isUnlocked && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {achievement.isUnlocked && (
                  <div className="space-y-2">
                    <div className="text-yellow-600 text-xs font-medium flex items-center justify-center gap-1">
                      <FaStar className="text-xs" />
                      Unlocked!
                    </div>
                    <div className="text-xs text-gray-600">
                      +{achievement.xpReward} XP
                    </div>
                    {achievement.rarity === 'legendary' && (
                      <div className="text-yellow-600 text-xs font-medium flex items-center justify-center gap-1">
                        <FaCrown className="text-xs" />
                        Legendary!
                      </div>
                    )}
                  </div>
                )}

                {/* Rarity indicator */}
                <div className={`text-xs font-medium mt-2 ${getRarityColor(achievement.rarity)}`}>
                  {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaBook className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Words</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalWords.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaUser className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Chapters</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.chaptersCompleted}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaFire className="text-red-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Writing Streak</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.writingStreak} days</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaTrophy className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">XP Level</p>
              <p className="text-2xl font-bold text-gray-900">{userProgress?.level || 1}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Stats */}
      {showDetailedView && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Writing Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Words/Chapter:</span>
                  <span className="font-medium">{stats.averageWordsPerChapter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sessions:</span>
                  <span className="font-medium">{stats.totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Session Length:</span>
                  <span className="font-medium">{stats.averageSessionLength} words</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Favorite Time:</span>
                  <span className="font-medium">{stats.favoriteWritingTime}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Story Development</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Character Development:</span>
                  <span className="font-medium">{stats.characterDevelopment}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plot Complexity:</span>
                  <span className="font-medium">{stats.plotComplexity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Primary Genre:</span>
                  <span className="font-medium">{metadata.genres[0] || 'General'}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Insights */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaLightbulb className="text-yellow-500" />
            Personalized Insights
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDetailedView(!showDetailedView)}
          >
            {showDetailedView ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <Card key={index} className={`p-4 border-l-4 ${getPriorityColor(insight.priority)}`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                  <p className="text-sm font-medium text-blue-600">{insight.recommendation}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {insights.length === 0 && (
          <Card className="p-6 text-center">
            <FaBrain className="text-gray-400 text-3xl mx-auto mb-3" />
            <p className="text-gray-600">No insights available yet. Keep writing to get personalized recommendations!</p>
          </Card>
        )}
      </div>

      {/* Progress Visualization */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaEye className="text-indigo-500" />
          Progress Overview
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Overall Progress</span>
              <span>{Math.round((stats.chaptersCompleted / 20) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (stats.chaptersCompleted / 20) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Character Development</span>
              <span>{stats.characterDevelopment}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.characterDevelopment}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Plot Development</span>
              <span>{stats.plotComplexity}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.plotComplexity}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 