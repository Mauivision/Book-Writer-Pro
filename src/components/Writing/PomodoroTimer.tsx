'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  FaPlay,
  FaPause,
  FaStop,
  FaUndo,
  FaCog,
  FaClock,
  FaCheckCircle,
  FaTrophy,
  FaFire,
  FaCoffee,
  FaBrain,
  FaHeart,
  FaStar,
  FaChartLine,
  FaHistory,
  FaBell,
  FaVolumeUp,
  FaVolumeMute,
  FaSun,
  FaMoon,
  FaPalette,
  FaSave,
  FaDownload,
  FaUpload,
  FaRandom,
  FaEdit,
  FaTrash,
  FaPlus,
  FaMinus,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaInfoCircle,
  FaQuestionCircle,
  FaBookmark,
  FaShare,
  FaCopy,
  FaRefresh
} from 'react-icons/fa';

interface PomodoroSession {
  id: string;
  type: 'work' | 'shortBreak' | 'longBreak';
  duration: number; // in minutes
  isActive: boolean;
  startTime: Date | null;
  endTime: Date | null;
  completed: boolean;
  notes?: string;
}

interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number; // after how many work sessions
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
}

interface PomodoroStats {
  totalSessions: number;
  completedSessions: number;
  totalWorkTime: number; // in minutes
  totalBreakTime: number;
  currentStreak: number;
  longestStreak: number;
  averageSessionLength: number;
  productivityScore: number;
}

export default function PomodoroTimer() {
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true,
    soundVolume: 0.7,
    notificationsEnabled: true,
    theme: 'auto'
  });
  const [stats, setStats] = useState<PomodoroStats>({
    totalSessions: 0,
    completedSessions: 0,
    totalWorkTime: 0,
    totalBreakTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageSessionLength: 0,
    productivityScore: 0
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState<PomodoroSettings>(settings);
  const [currentCycle, setCurrentCycle] = useState(0); // current work session in cycle
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/sounds/notification.mp3');
    audioRef.current.volume = settings.soundVolume;
  }, [settings.soundVolume]);

  // Load data from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('pomodoro-sessions');
    const savedSettings = localStorage.getItem('pomodoro-settings');
    const savedStats = localStorage.getItem('pomodoro-stats');

    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
      setTempSettings(JSON.parse(savedSettings));
    }
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pomodoro-stats', JSON.stringify(stats));
  }, [stats]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Handle session completion
  const handleSessionComplete = () => {
    if (!currentSession) return;

    // Play notification sound
    if (settings.soundEnabled && audioRef.current) {
      audioRef.current.play();
    }

    // Show notification
    if (settings.notificationsEnabled) {
      setNotificationMessage(
        currentSession.type === 'work' 
          ? 'Work session complete! Time for a break.' 
          : 'Break time is over! Ready to work?'
      );
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }

    // Update session
    const completedSession: PomodoroSession = {
      ...currentSession,
      endTime: new Date(),
      completed: true
    };

    setSessions(prev => [...prev, completedSession]);

    // Update stats
    updateStats(completedSession);

    // Determine next session
    if (currentSession.type === 'work') {
      setCurrentCycle(prev => prev + 1);
      const isLongBreakTime = (currentCycle + 1) % settings.longBreakInterval === 0;
      setIsLongBreak(isLongBreakTime);
      
      if (settings.autoStartBreaks) {
        startSession(isLongBreakTime ? 'longBreak' : 'shortBreak');
      } else {
        setCurrentSession(null);
        setTimeLeft(0);
        setIsRunning(false);
      }
    } else {
      if (settings.autoStartPomodoros) {
        startSession('work');
      } else {
        setCurrentSession(null);
        setTimeLeft(0);
        setIsRunning(false);
      }
    }
  };

  // Update statistics
  const updateStats = (session: PomodoroSession) => {
    setStats(prev => {
      const newStats = { ...prev };
      newStats.totalSessions += 1;
      
      if (session.completed) {
        newStats.completedSessions += 1;
        newStats.currentStreak += 1;
        newStats.longestStreak = Math.max(newStats.longestStreak, newStats.currentStreak);
        
        if (session.type === 'work') {
          newStats.totalWorkTime += session.duration;
        } else {
          newStats.totalBreakTime += session.duration;
        }
        
        newStats.averageSessionLength = 
          (newStats.totalWorkTime + newStats.totalBreakTime) / newStats.totalSessions;
        
        newStats.productivityScore = 
          (newStats.completedSessions / newStats.totalSessions) * 100;
      }
      
      return newStats;
    });
  };

  // Start a new session
  const startSession = (type: 'work' | 'shortBreak' | 'longBreak') => {
    const duration = type === 'work' 
      ? settings.workDuration 
      : type === 'shortBreak' 
        ? settings.shortBreakDuration 
        : settings.longBreakDuration;

    const newSession: PomodoroSession = {
      id: `session-${Date.now()}`,
      type,
      duration,
      isActive: true,
      startTime: new Date(),
      endTime: null,
      completed: false,
      notes: sessionNotes
    };

    setCurrentSession(newSession);
    setTimeLeft(duration * 60);
    setIsRunning(true);
    setSessionNotes('');
  };

  // Pause/Resume timer
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Stop timer
  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setCurrentSession(null);
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    if (currentSession) {
      setTimeLeft(currentSession.duration * 60);
    }
  };

  // Save settings
  const saveSettings = () => {
    setSettings(tempSettings);
    setIsEditingSettings(false);
  };

  // Cancel settings edit
  const cancelSettingsEdit = () => {
    setTempSettings(settings);
    setIsEditingSettings(false);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get progress percentage
  const getProgress = () => {
    if (!currentSession) return 0;
    const total = currentSession.duration * 60;
    return ((total - timeLeft) / total) * 100;
  };

  // Get session type color
  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'work': return 'text-red-500';
      case 'shortBreak': return 'text-green-500';
      case 'longBreak': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  // Get session type icon
  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'work': return <FaBrain />;
      case 'shortBreak': return <FaCoffee />;
      case 'longBreak': return <FaHeart />;
      default: return <FaClock />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-2xl font-bold flex items-center">
          <FaClock className="mr-2" />
          Pomodoro Timer
        </h2>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowStats(true)}
          >
            <FaChartLine className="mr-1" />
            Stats
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowHistory(true)}
          >
            <FaHistory className="mr-1" />
            History
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSettings(true)}
          >
            <FaCog className="mr-1" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          {/* Timer Circle */}
          <div className="relative w-80 h-80 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                className={currentSession ? getSessionTypeColor(currentSession.type) : 'text-gray-400'}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Timer Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-mono font-bold">
                {formatTime(timeLeft)}
              </div>
              <div className="text-lg text-gray-600 mt-2">
                {currentSession ? (
                  <>
                    {getSessionTypeIcon(currentSession.type)}
                    <span className="ml-2 capitalize">
                      {currentSession.type === 'work' ? 'Work' : 
                       currentSession.type === 'shortBreak' ? 'Short Break' : 'Long Break'}
                    </span>
                  </>
                ) : (
                  'Ready to start'
                )}
              </div>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center space-x-4">
            {!currentSession ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => startSession('work')}
                >
                  <FaPlay className="mr-2" />
                  Start Work
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => startSession('shortBreak')}
                >
                  <FaCoffee className="mr-2" />
                  Short Break
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => startSession('longBreak')}
                >
                  <FaHeart className="mr-2" />
                  Long Break
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant={isRunning ? 'danger' : 'primary'}
                  size="lg"
                  onClick={toggleTimer}
                >
                  {isRunning ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
                  {isRunning ? 'Pause' : 'Resume'}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={resetTimer}
                >
                  <FaUndo className="mr-2" />
                  Reset
                </Button>
                <Button
                  variant="danger"
                  size="lg"
                  onClick={stopTimer}
                >
                  <FaStop className="mr-2" />
                  Stop
                </Button>
              </div>
            )}
          </div>

          {/* Session Notes */}
          {currentSession && (
            <div className="mt-6 max-w-md mx-auto">
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Add notes about this session..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
              />
            </div>
          )}

          {/* Cycle Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-center space-x-2">
              {Array.from({ length: settings.longBreakInterval }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < currentCycle 
                      ? 'bg-green-500' 
                      : i === currentCycle 
                        ? 'bg-blue-500' 
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {currentCycle} of {settings.longBreakInterval} work sessions completed
            </p>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Pomodoro Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Work Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={tempSettings.workDuration}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, workDuration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Short Break Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={tempSettings.shortBreakDuration}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, shortBreakDuration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Long Break Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={tempSettings.longBreakDuration}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, longBreakDuration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Long Break Interval</label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={tempSettings.longBreakInterval}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, longBreakInterval: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tempSettings.autoStartBreaks}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, autoStartBreaks: e.target.checked }))}
                    className="mr-2"
                  />
                  Auto-start breaks
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tempSettings.autoStartPomodoros}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, autoStartPomodoros: e.target.checked }))}
                    className="mr-2"
                  />
                  Auto-start work sessions
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tempSettings.soundEnabled}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, soundEnabled: e.target.checked }))}
                    className="mr-2"
                  />
                  Enable sounds
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tempSettings.notificationsEnabled}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, notificationsEnabled: e.target.checked }))}
                    className="mr-2"
                  />
                  Enable notifications
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button
                variant="secondary"
                onClick={cancelSettingsEdit}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={saveSettings}
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Pomodoro Statistics</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalSessions}</div>
                  <div className="text-sm text-gray-600">Total Sessions</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.completedSessions}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.currentStreak}</div>
                  <div className="text-sm text-gray-600">Current Streak</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.longestStreak}</div>
                  <div className="text-sm text-gray-600">Longest Streak</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Work Time:</span>
                  <span className="font-medium">{stats.totalWorkTime} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Break Time:</span>
                  <span className="font-medium">{stats.totalBreakTime} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Session:</span>
                  <span className="font-medium">{stats.averageSessionLength.toFixed(1)} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Productivity Score:</span>
                  <span className="font-medium">{stats.productivityScore.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowStats(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Session History</h3>
            
            <div className="space-y-2">
              {sessions.slice(-10).reverse().map(session => (
                <div key={session.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    {getSessionTypeIcon(session.type)}
                    <span className="text-sm capitalize">{session.type}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {session.duration} min
                  </div>
                  <div className="text-sm text-gray-600">
                    {session.completed ? <FaCheckCircle className="text-green-500" /> : <FaTimes className="text-red-500" />}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-end mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowHistory(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <FaBell />
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
