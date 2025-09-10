'use client';

import { useState, useEffect } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FaCalendar, 
  FaBullseye, 
  FaCheck, 
  FaClock, 
  FaTrophy,
  FaFire,
  FaLightbulb,
  FaUser,
  FaBook,
  FaPalette,
  FaStar,
  FaGift
} from 'react-icons/fa';
import { DailyChallenge } from '@/types/achievements';

export default function DailyChallenges() {
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<DailyChallenge | null>(null);
  
  const { 
    dailyChallenge, 
    completeDailyChallenge, 
    userProgress,
    getDailyChallenge 
  } = useBookStore();

  useEffect(() => {
    // Get or refresh daily challenge
    getDailyChallenge();
  }, []);

  const handleCompleteChallenge = (challengeId: string) => {
    completeDailyChallenge(challengeId);
    setSelectedChallenge(null);
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'wordCount': return <FaBook className="text-blue-500" />;
      case 'character': return <FaUser className="text-green-500" />;
      case 'plot': return <FaLightbulb className="text-purple-500" />;
      case 'dialogue': return <FaPalette className="text-orange-500" />;
      case 'setting': return <FaBook className="text-indigo-500" />;
      default: return <FaBullseye className="text-gray-500" />;
    }
  };

  const getChallengeColor = (type: string) => {
    switch (type) {
      case 'wordCount': return 'border-blue-200 bg-blue-50';
      case 'character': return 'border-green-200 bg-green-50';
      case 'plot': return 'border-purple-200 bg-purple-50';
      case 'dialogue': return 'border-orange-200 bg-orange-50';
      case 'setting': return 'border-indigo-200 bg-indigo-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (!dailyChallenge) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isExpired = new Date(dailyChallenge.expiresAt) <= new Date();
  const timeRemaining = formatTimeRemaining(dailyChallenge.expiresAt);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <FaCalendar className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Daily Writing Challenge</h2>
            <p className="text-gray-600">Complete today's challenge to earn XP and rewards!</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            <FaClock className="inline mr-1" />
            {isExpired ? 'Expired' : timeRemaining}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? 'Hide' : 'Show'} Completed
          </Button>
        </div>
      </div>

      {/* Current Challenge */}
      <Card className={`p-6 border-2 ${getChallengeColor(dailyChallenge.type)}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="text-4xl">
              {getChallengeIcon(dailyChallenge.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{dailyChallenge.title}</h3>
                {dailyChallenge.isCompleted && (
                  <div className="flex items-center gap-1 text-green-600">
                    <FaCheck className="text-sm" />
                    <span className="text-sm font-medium">Completed!</span>
                  </div>
                )}
              </div>
              <p className="text-gray-700 mb-4">{dailyChallenge.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FaBullseye />
                  <span>Target: {dailyChallenge.target}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaGift />
                  <span>Reward: {dailyChallenge.reward} XP</span>
                </div>
              </div>
            </div>
          </div>
          
          {!dailyChallenge.isCompleted && !isExpired && (
            <Button
              variant="primary"
              onClick={() => setSelectedChallenge(dailyChallenge)}
              className="ml-4"
            >
              Complete Challenge
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        {!dailyChallenge.isCompleted && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>0%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
            </div>
          </div>
        )}
      </Card>

      {/* Challenge Completion Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">
                {getChallengeIcon(selectedChallenge.type)}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Complete Challenge
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedChallenge.description}
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-blue-700">
                  <FaTrophy />
                  <span className="font-medium">Reward: {selectedChallenge.reward} XP</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedChallenge(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleCompleteChallenge(selectedChallenge.id)}
                  className="flex-1"
                >
                  Mark Complete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Challenge History */}
      {showCompleted && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaStar className="text-yellow-500" />
            Challenge History
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Example completed challenges - in real app would come from store */}
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-3">
                <div className="text-2xl text-green-600">
                  <FaCheck />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Word Sprint</h4>
                  <p className="text-sm text-gray-600">Write 500 words today</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                    <FaGift />
                    <span>+25 XP earned</span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-3">
                <div className="text-2xl text-green-600">
                  <FaCheck />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Character Development</h4>
                  <p className="text-sm text-gray-600">Add a new character</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                    <FaGift />
                    <span>+20 XP earned</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Streak Information */}
      <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200">
        <div className="flex items-center gap-4">
          <div className="text-3xl text-red-500">
            <FaFire />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Writing Streak</h3>
            <p className="text-gray-600 mb-2">
              Keep writing daily to maintain your streak and unlock special rewards!
            </p>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{userProgress?.currentStreak || 0}</div>
                <div className="text-sm text-gray-600">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{userProgress?.longestStreak || 0}</div>
                <div className="text-sm text-gray-600">Longest Streak</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
