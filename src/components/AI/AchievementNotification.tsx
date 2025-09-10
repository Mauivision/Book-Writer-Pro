'use client';

import { useState, useEffect } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Achievement } from '@/types/achievements';
import { 
  FaTrophy, 
  FaStar, 
  FaCrown, 
  FaMedal, 
  FaTimes,
  FaVolumeUp,
  FaVolumeMute
} from 'react-icons/fa';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      setIsAnimating(true);
      
      // Play achievement sound if enabled
      if (soundEnabled) {
        playAchievementSound();
      }
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(), 500); // Wait for animation to complete
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [achievement, soundEnabled, onClose]);

  const playAchievementSound = () => {
    // Create audio context for achievement sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Achievement sound: ascending notes
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
      oscillator.frequency.setValueAtTime(554, audioContext.currentTime + 0.1); // C#5
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2); // E5
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not supported or blocked');
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

  const getRarityBackground = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-50 border-gray-200';
      case 'rare': return 'bg-blue-50 border-blue-200';
      case 'epic': return 'bg-purple-50 border-purple-200';
      case 'legendary': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <FaMedal className="text-gray-600" />;
      case 'rare': return <FaStar className="text-blue-600" />;
      case 'epic': return <FaTrophy className="text-purple-600" />;
      case 'legendary': return <FaCrown className="text-yellow-600" />;
      default: return <FaMedal className="text-gray-600" />;
    }
  };

  if (!achievement || !isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div 
        className={`${getRarityBackground(achievement.rarity)} border-2 rounded-lg shadow-2xl p-4 transform transition-all duration-500 ${
          isAnimating 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl">
              {getRarityIcon(achievement.rarity)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Achievement Unlocked!</h3>
              <p className="text-sm text-gray-600 capitalize">{achievement.rarity}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(), 500);
              }}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Achievement Content */}
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">
            {achievement.icon}
          </div>
          <h4 className="font-semibold text-gray-900 text-lg mb-1">
            {achievement.title}
          </h4>
          <p className="text-gray-600 text-sm mb-3">
            {achievement.description}
          </p>
          
          {/* XP Reward */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full px-4 py-2 inline-flex items-center gap-2">
            <FaStar className="text-sm" />
            <span className="font-bold">+{achievement.xpReward} XP</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{achievement.progress}/{achievement.maxProgress}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Rarity Badge */}
        <div className="text-center">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)} bg-white border`}>
            {getRarityIcon(achievement.rarity)}
            {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)} Achievement
          </span>
        </div>

        {/* Celebration Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
