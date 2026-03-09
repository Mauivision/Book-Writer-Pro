'use client';

import { useState, useEffect } from 'react';
import { useBookStore } from '@/store/useBookStore';
import WritingAnalytics from '@/components/AI/WritingAnalytics';
import DailyChallenges from '@/components/AI/DailyChallenges';
import WritingStreak from '@/components/AI/WritingStreak';
import AchievementNotification from '@/components/AI/AchievementNotification';
import CharacterMemorySystem from '@/components/AI/CharacterMemorySystem';
import LiveWritingAssistant from '@/components/AI/LiveWritingAssistant';
import PlotHoleDetector from '@/components/AI/PlotHoleDetector';
import CharacterVisualizer from '@/components/Character/CharacterVisualizer';
import PromptGenerator from '@/components/AI/PromptGenerator';
import AmbientSounds from '@/components/Writing/AmbientSounds';
import PomodoroTimer from '@/components/Writing/PomodoroTimer';
import ThemeSelector from '@/components/Writing/ThemeSelector';
import { Achievement } from '@/types/achievements';
import { 
  FaChartLine, 
  FaTrophy, 
  FaFire, 
  FaCalendar,
  FaCrown,
  FaStar,
  FaUser,
  FaEdit,
  FaBug,
  FaProjectDiagram,
  FaLightbulb,
  FaPalette
} from 'react-icons/fa';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'streak' | 'characters' | 'writing' | 'plot' | 'visualizer' | 'prompts' | 'environment'>('overview');
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  
  const { achievements = [], checkAchievements } = useBookStore();

  useEffect(() => {
    // Check for new achievements when component mounts
    checkAchievements();
    
    // Check for newly unlocked achievements
    const newlyUnlocked = achievements.filter(a => a.isUnlocked && !a.unlockedAt);
    if (newlyUnlocked.length > 0) {
      setNewAchievement(newlyUnlocked[0]);
    }
  }, [achievements, checkAchievements]);

  const handleAchievementClose = () => {
    setNewAchievement(null);
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <FaChartLine />,
      description: 'Writing analytics and achievement badges'
    },
    {
      id: 'challenges',
      label: 'Daily Challenges',
      icon: <FaCalendar />,
      description: 'Complete daily writing challenges'
    },
    {
      id: 'streak',
      label: 'Writing Streak',
      icon: <FaFire />,
      description: 'Track your writing momentum'
    },
    {
      id: 'characters',
      label: 'Characters',
      icon: <FaUser />,
      description: 'Character memory and consistency tracking'
    },
    {
      id: 'writing',
      label: 'Writing Assistant',
      icon: <FaEdit />,
      description: 'Live writing feedback and suggestions'
    },
    {
      id: 'plot',
      label: 'Plot Holes',
      icon: <FaBug />,
      description: 'Detect and fix story inconsistencies'
    },
    {
      id: 'visualizer',
      label: 'Character Visualizer',
      icon: <FaProjectDiagram />,
      description: 'Visualize character relationships and connections'
    },
    {
      id: 'prompts',
      label: 'AI Prompts',
      icon: <FaLightbulb />,
      description: 'Generate writing prompts and challenges'
    },
    {
      id: 'environment',
      label: 'Writing Environment',
      icon: <FaPalette />,
      description: 'Customize your writing atmosphere'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-mint-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-mint-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-xl flex items-center justify-center shadow-md border border-orange-100">
                <FaTrophy className="text-orange-900 text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-mint-900">Writing Analytics & Gamification</h1>
                <p className="text-xs text-mint-700">Track progress and unlock achievements</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full border border-orange-200">
                <FaStar className="text-yellow-600 text-sm" />
                <span className="text-sm font-medium text-orange-800">
                  {achievements.filter(a => a.isUnlocked).length} Achievements
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Tab Description */}
          <div className="mt-4 p-4 bg-white/60 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              {tabs.find(t => t.id === activeTab)?.icon}
              <span className="font-medium">{tabs.find(t => t.id === activeTab)?.label}</span>
              <span className="text-gray-500">-</span>
              <span>{tabs.find(t => t.id === activeTab)?.description}</span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
                <div className="flex items-center gap-3 mb-4">
                  <FaCrown className="text-2xl text-yellow-600" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Achievement Progress</h2>
                    <p className="text-gray-600">Unlock achievements by reaching writing milestones</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {achievements.filter(a => a.isUnlocked).length}
                    </div>
                    <div className="text-sm text-gray-600">Achievements Unlocked</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {achievements.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Available</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round((achievements.filter(a => a.isUnlocked).length / achievements.length) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                  </div>
                </div>
              </div>
              
              <WritingAnalytics />
            </div>
          )}

          {activeTab === 'challenges' && (
            <DailyChallenges />
          )}

          {activeTab === 'streak' && (
            <WritingStreak />
          )}

          {activeTab === 'characters' && (
            <CharacterMemorySystem />
          )}

          {activeTab === 'writing' && (
            <LiveWritingAssistant />
          )}

        {activeTab === 'plot' && (
          <PlotHoleDetector />
        )}
        {activeTab === 'visualizer' && (
          <CharacterVisualizer />
        )}
        {activeTab === 'prompts' && (
          <PromptGenerator />
        )}
        {activeTab === 'environment' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AmbientSounds />
              <PomodoroTimer />
            </div>
            <ThemeSelector />
          </div>
        )}
        </div>
      </main>

      {/* Achievement Notification */}
      <AchievementNotification 
        achievement={newAchievement} 
        onClose={handleAchievementClose} 
      />
    </div>
  );
}
