'use client';

import { useState, useEffect } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FaFire, 
  FaTrophy, 
  FaStar, 
  FaBolt, 
  FaRocket,
  FaCalendar,
  FaChartLine,
  FaGift,
  FaCrown,
  FaMedal
} from 'react-icons/fa';

export default function WritingStreak() {
  const [showDetails, setShowDetails] = useState(false);
  const [streakAnimation, setStreakAnimation] = useState(false);
  
  const { userProgress, writingSessions } = useBookStore();

  useEffect(() => {
    // Trigger streak animation when component mounts
    setStreakAnimation(true);
    const timer = setTimeout(() => setStreakAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getStreakMultiplier = (streak: number) => {
    if (streak >= 100) return { multiplier: 5, color: 'text-yellow-600', icon: <FaCrown />, label: 'Legendary' };
    if (streak >= 30) return { multiplier: 4, color: 'text-purple-600', icon: <FaRocket />, label: 'Epic' };
    if (streak >= 14) return { multiplier: 3, color: 'text-blue-600', icon: <FaBolt />, label: 'Rare' };
    if (streak >= 7) return { multiplier: 2, color: 'text-green-600', icon: <FaStar />, label: 'Common' };
    return { multiplier: 1, color: 'text-gray-600', icon: <FaMedal />, label: 'Beginner' };
  };

  const getStreakReward = (streak: number) => {
    const baseReward = 10;
    const { multiplier } = getStreakMultiplier(streak);
    return baseReward * multiplier;
  };

  const getStreakFireCount = (streak: number) => {
    if (streak >= 100) return 5;
    if (streak >= 30) return 4;
    if (streak >= 14) return 3;
    if (streak >= 7) return 2;
    if (streak >= 3) return 1;
    return 0;
  };

  const getNextMilestone = (currentStreak: number) => {
    const milestones = [3, 7, 14, 30, 100];
    const next = milestones.find(m => m > currentStreak);
    return next ? { days: next - currentStreak, milestone: next } : null;
  };

  const getWeeklyProgress = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const session = writingSessions.find(s => s.date === dateStr);
      weekDays.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hasSession: !!session,
        wordCount: session?.wordCount || 0,
        isToday: dateStr === today.toISOString().split('T')[0]
      });
    }
    return weekDays;
  };

  const currentStreak = userProgress?.currentStreak || 0;
  const longestStreak = userProgress?.longestStreak || 0;
  const streakMultiplier = getStreakMultiplier(currentStreak);
  const streakReward = getStreakReward(currentStreak);
  const fireCount = getStreakFireCount(currentStreak);
  const nextMilestone = getNextMilestone(currentStreak);
  const weeklyProgress = getWeeklyProgress();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
            <FaFire className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Writing Streak</h2>
            <p className="text-gray-600">Keep the fire burning with daily writing!</p>
          </div>
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </Button>
      </div>

      {/* Main Streak Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Streak */}
        <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {[...Array(fireCount)].map((_, i) => (
                <div
                  key={i}
                  className={`text-4xl mx-1 transition-all duration-500 ${
                    streakAnimation ? 'animate-bounce' : ''
                  }`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  🔥
                </div>
              ))}
            </div>
            
            <h3 className="text-3xl font-bold text-red-600 mb-2">
              {currentStreak} Days
            </h3>
            <p className="text-gray-600 mb-4">Current Writing Streak</p>
            
            <div className="bg-white rounded-lg p-3 mb-4">
              <div className="text-sm text-gray-600 mb-1">Streak Multiplier</div>
              <div className={`text-2xl font-bold ${streakMultiplier.color} flex items-center justify-center gap-2`}>
                {streakMultiplier.icon}
                {streakMultiplier.multiplier}x
              </div>
              <div className="text-xs text-gray-500">{streakMultiplier.label}</div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg p-3">
              <div className="text-sm mb-1">Daily Reward</div>
              <div className="text-xl font-bold">+{streakReward} XP</div>
            </div>
          </div>
        </Card>

        {/* Longest Streak */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold text-blue-600 mb-2">
              {longestStreak} Days
            </h3>
            <p className="text-gray-600 mb-4">Longest Streak Ever</p>
            
            {longestStreak > 0 && (
              <div className="bg-white rounded-lg p-3 mb-4">
                <div className="text-sm text-gray-600 mb-1">Best Performance</div>
                <div className="text-lg font-bold text-blue-600">
                  {longestStreak >= 100 ? 'Legendary' : 
                   longestStreak >= 30 ? 'Epic' : 
                   longestStreak >= 14 ? 'Rare' : 
                   longestStreak >= 7 ? 'Common' : 'Beginner'}
                </div>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg p-3">
              <div className="text-sm mb-1">Total XP Earned</div>
              <div className="text-xl font-bold">+{userProgress?.totalXP || 0} XP</div>
            </div>
          </div>
        </Card>

        {/* Next Milestone */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-green-600 mb-2">Next Milestone</h3>
            
            {nextMilestone ? (
              <>
                <div className="bg-white rounded-lg p-3 mb-4">
                  <div className="text-sm text-gray-600 mb-1">Days to Go</div>
                  <div className="text-2xl font-bold text-green-600">
                    {nextMilestone.days}
                  </div>
                  <div className="text-xs text-gray-500">
                    {nextMilestone.milestone} Day Streak
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-lg p-3">
                  <div className="text-sm mb-1">Milestone Reward</div>
                  <div className="text-lg font-bold">
                    +{getStreakReward(nextMilestone.milestone)} XP
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">Congratulations!</div>
                <div className="text-lg font-bold text-green-600">All Milestones Reached!</div>
                <div className="text-xs text-gray-500">You're a writing legend!</div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaCalendar className="text-blue-500" />
          This Week's Progress
        </h3>
        
        <div className="grid grid-cols-7 gap-2">
          {weeklyProgress.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500 mb-1">{day.day}</div>
              <div className={`
                w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-medium
                ${day.hasSession 
                  ? 'bg-green-500 text-white' 
                  : day.isToday 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }
              `}>
                {day.hasSession ? '✓' : day.isToday ? 'T' : '-'}
              </div>
              {day.hasSession && (
                <div className="text-xs text-gray-600 mt-1">
                  {day.wordCount > 0 ? `${day.wordCount}w` : ''}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          {weeklyProgress.filter(d => d.hasSession).length} of 7 days written this week
        </div>
      </Card>

      {/* Detailed Stats */}
      {showDetails && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaChartLine className="text-purple-500" />
            Streak Statistics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaFire className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Session Length</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {writingSessions.length > 0 
                      ? Math.round(writingSessions.reduce((sum, s) => sum + s.wordCount, 0) / writingSessions.length)
                      : 0} words
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaGift className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {userProgress?.writingSessions || 0}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
