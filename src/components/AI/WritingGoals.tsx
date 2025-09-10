'use client';

import { useState, useEffect } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  FaBullseye, 
  FaTrophy, 
  FaFire, 
  FaCalendar, 
  FaCheck,
  FaPlus,
  FaEdit,
  FaTrash,
  FaStar,
  FaAward,
  FaMedal,
  FaCrown,
  FaLightbulb,
  FaBook,
  FaUser,
  FaChartLine
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface WritingGoal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'project';
  target: number;
  current: number;
  unit: 'words' | 'chapters' | 'characters' | 'sessions';
  deadline?: Date;
  completed: boolean;
  streak: number;
  createdAt: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  category: 'writing' | 'productivity' | 'creativity' | 'milestone';
}

export default function WritingGoals() {
  const [goals, setGoals] = useState<WritingGoal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<WritingGoal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'daily' as const,
    target: 1000,
    unit: 'words' as const,
    deadline: ''
  });

  const { chapters, characters, metadata } = useBookStore();

  // Initialize achievements
  useEffect(() => {
    const totalWords = chapters.reduce((sum, chapter) => sum + (chapter.content?.length || 0), 0);
    const totalChapters = chapters.length;
    const totalCharacters = characters.length;

    const defaultAchievements: Achievement[] = [
      {
        id: 'first-words',
        title: 'First Words',
        description: 'Write your first 100 words',
        icon: <FaBook className="text-blue-500" />,
        unlocked: totalWords >= 100,
        progress: Math.min(totalWords, 100),
        maxProgress: 100,
        category: 'writing'
      },
      {
        id: 'thousand-words',
        title: 'Thousand Words',
        description: 'Write 1,000 words',
        icon: <FaBook className="text-green-500" />,
        unlocked: totalWords >= 1000,
        progress: Math.min(totalWords, 1000),
        maxProgress: 1000,
        category: 'writing'
      },
      {
        id: 'first-chapter',
        title: 'Chapter One',
        description: 'Complete your first chapter',
        icon: <FaUser className="text-purple-500" />,
        unlocked: totalChapters >= 1,
        progress: Math.min(totalChapters, 1),
        maxProgress: 1,
        category: 'milestone'
      },
      {
        id: 'character-creator',
        title: 'Character Creator',
        description: 'Create your first character',
        icon: <FaUser className="text-indigo-500" />,
        unlocked: totalCharacters >= 1,
        progress: Math.min(totalCharacters, 1),
        maxProgress: 1,
        category: 'creativity'
      },
      {
        id: 'week-streak',
        title: 'Week Warrior',
        description: 'Write for 7 consecutive days',
        icon: <FaFire className="text-red-500" />,
        unlocked: false, // Would need to track actual dates
        progress: 0,
        maxProgress: 7,
        category: 'productivity'
      },
      {
        id: 'novel-length',
        title: 'Novel Length',
        description: 'Write 50,000 words (NaNoWriMo goal)',
        icon: <FaTrophy className="text-yellow-500" />,
        unlocked: totalWords >= 50000,
        progress: Math.min(totalWords, 50000),
        maxProgress: 50000,
        category: 'milestone'
      },
      {
        id: 'character-developer',
        title: 'Character Developer',
        description: 'Create 5 detailed characters',
        icon: <FaUser className="text-pink-500" />,
        unlocked: totalCharacters >= 5,
        progress: Math.min(totalCharacters, 5),
        maxProgress: 5,
        category: 'creativity'
      },
      {
        id: 'chapter-master',
        title: 'Chapter Master',
        description: 'Complete 10 chapters',
        icon: <FaCrown className="text-gold-500" />,
        unlocked: totalChapters >= 10,
        progress: Math.min(totalChapters, 10),
        maxProgress: 10,
        category: 'milestone'
      }
    ];

    setAchievements(defaultAchievements);
  }, [chapters, characters]);

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('writing-goals');
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (error) {
        console.error('Error loading goals:', error);
      }
    }
  }, []);

  // Save goals to localStorage
  useEffect(() => {
    localStorage.setItem('writing-goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (!newGoal.title.trim()) {
      toast.error('Please enter a goal title');
      return;
    }

    const goal: WritingGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      type: newGoal.type,
      target: newGoal.target,
      current: 0,
      unit: newGoal.unit,
      deadline: newGoal.deadline ? new Date(newGoal.deadline) : undefined,
      completed: false,
      streak: 0,
      createdAt: new Date()
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({
      title: '',
      description: '',
      type: 'daily',
      target: 1000,
      unit: 'words',
      deadline: ''
    });
    setShowAddGoal(false);
    toast.success('Goal added successfully!');
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = Math.min(goal.current + progress, goal.target);
        const completed = newCurrent >= goal.target;
        return {
          ...goal,
          current: newCurrent,
          completed,
          streak: completed ? goal.streak + 1 : goal.streak
        };
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast.success('Goal deleted');
  };

  const getProgressPercentage = (goal: WritingGoal) => {
    return Math.min(100, (goal.current / goal.target) * 100);
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'daily': return <FaCalendar className="text-blue-500" />;
      case 'weekly': return <FaCalendar className="text-green-500" />;
      case 'monthly': return <FaCalendar className="text-purple-500" />;
      case 'project': return <FaBullseye className="text-orange-500" />;
      default: return <FaBullseye className="text-gray-500" />;
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaBullseye className="text-blue-600" />
            Writing Goals & Achievements
          </h2>
          <p className="text-gray-600 mt-1">Set goals, track progress, and unlock achievements</p>
        </div>
        <Button
          onClick={() => setShowAddGoal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <FaPlus className="mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Goals Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaBullseye className="text-blue-500" />
          Your Goals ({goals.filter(g => !g.completed).length} active)
        </h3>
        
        {goals.length === 0 ? (
          <Card className="p-6 text-center">
            <FaBullseye className="text-gray-400 text-3xl mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No goals set yet. Create your first writing goal!</p>
            <Button onClick={() => setShowAddGoal(true)}>
              <FaPlus className="mr-2" />
              Create First Goal
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <Card key={goal.id} className={`p-4 ${goal.completed ? 'bg-green-50 border-green-200' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getGoalIcon(goal.type)}
                    <div>
                      <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                  </div>
                  {goal.completed && (
                    <FaCheck className="text-green-500 text-xl" />
                  )}
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{goal.current} / {goal.target} {goal.unit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        goal.completed ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${getProgressPercentage(goal)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Streak: {goal.streak} days</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateGoalProgress(goal.id, goal.target * 0.1)}
                    >
                      +10%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Achievements Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaTrophy className="text-yellow-500" />
          Achievements ({unlockedAchievements.length}/{achievements.length} unlocked)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`p-4 text-center transition-all duration-200 ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="text-3xl mb-3 flex justify-center">
                {achievement.icon}
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{achievement.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
              
              {!achievement.unlocked && (
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full"
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {achievement.unlocked && (
                <div className="text-yellow-600 text-sm font-medium">
                  <FaStar className="inline mr-1" />
                  Unlocked!
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Goal</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Title
                  </label>
                  <Input
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Write 1000 words daily"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Input
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={newGoal.type}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="project">Project</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value as any }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="words">Words</option>
                      <option value="chapters">Chapters</option>
                      <option value="characters">Characters</option>
                      <option value="sessions">Sessions</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target
                  </label>
                  <Input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, target: parseInt(e.target.value) || 0 }))}
                    placeholder="1000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline (Optional)
                  </label>
                  <Input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddGoal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={addGoal}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Add Goal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 