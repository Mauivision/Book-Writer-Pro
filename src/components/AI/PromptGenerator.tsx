'use client';

import { useState, useEffect } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  FaLightbulb,
  FaDice,
  FaBook,
  FaUser,
  FaHeart,
  FaExclamationTriangle,
  FaClock,
  FaStar,
  FaSave,
  FaShare,
  FaCopy,
  FaRefresh,
  FaFilter,
  FaSearch,
  FaBookmark,
  FaTrophy,
  FaFire,
  FaCalendar,
  FaCheckCircle,
  FaPlay,
  FaPause,
  FaStop,
  FaHistory,
  FaRandom,
  FaMagic,
  FaPalette,
  FaUsers,
  FaMapMarkerAlt,
  FaComment,
  FaEdit,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

interface WritingPrompt {
  id: string;
  title: string;
  description: string;
  category: 'character' | 'plot' | 'setting' | 'dialogue' | 'genre' | 'challenge';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
  tags: string[];
  isCompleted: boolean;
  isFavorite: boolean;
  createdAt: Date;
}

interface WritingChallenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  requirements: string[];
  rewards: string[];
  deadline?: Date;
  isActive: boolean;
  participants: number;
  completionRate: number;
}

export default function PromptGenerator() {
  const { book, updateBook } = useBookStore();
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [challenges, setChallenges] = useState<WritingChallenge[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<WritingChallenge | null>(null);
  const [activeTab, setActiveTab] = useState<'prompts' | 'challenges' | 'generator'>('prompts');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [writingSession, setWritingSession] = useState<{
    isActive: boolean;
    startTime: Date | null;
    wordCount: number;
    prompt: WritingPrompt | null;
  }>({
    isActive: false,
    startTime: null,
    wordCount: 0,
    prompt: null
  });

  // Available prompt categories and templates
  const promptTemplates = {
    character: [
      "Write a scene where your protagonist meets their greatest fear",
      "Create a dialogue between two characters who have never spoken before",
      "Describe a character's morning routine that reveals their personality",
      "Write about a character's most embarrassing moment",
      "Create a character who is the opposite of your protagonist"
    ],
    plot: [
      "Write a plot twist that changes everything",
      "Create a scene where the protagonist must make an impossible choice",
      "Write about a character's darkest secret being revealed",
      "Create a moment of unexpected hope in a dark situation",
      "Write a scene where everything goes wrong"
    ],
    setting: [
      "Describe a place that exists only in your character's memory",
      "Create a setting that reflects your protagonist's emotional state",
      "Write about a location that changes based on the time of day",
      "Describe a place that holds a hidden danger",
      "Create a setting that represents your story's theme"
    ],
    dialogue: [
      "Write a conversation where no one says what they really mean",
      "Create dialogue that reveals character through subtext",
      "Write a conversation that takes place entirely in questions",
      "Create dialogue where one character is lying",
      "Write a conversation that changes everything"
    ],
    genre: {
      fantasy: [
        "Create a magical system with unexpected limitations",
        "Write about a character who discovers they have magic",
        "Describe a fantasy world through the eyes of a non-magical character"
      ],
      sci-fi: [
        "Write about technology that has unintended consequences",
        "Create a future where humans are the minority",
        "Describe a world where time travel is possible but dangerous"
      ],
      romance: [
        "Write about love that is forbidden or impossible",
        "Create a meet-cute that goes horribly wrong",
        "Write about a relationship that starts with a lie"
      ],
      mystery: [
        "Create a mystery where everyone is a suspect",
        "Write about a detective who must solve their own crime",
        "Describe a mystery that seems impossible to solve"
      ]
    }
  };

  // Available challenges
  const challengeTemplates = [
    {
      title: "Daily Word Sprint",
      description: "Write 500 words in 30 minutes",
      type: "daily" as const,
      requirements: ["Write 500 words", "Complete in 30 minutes"],
      rewards: ["Achievement badge", "XP points", "Streak bonus"]
    },
    {
      title: "Character Development Week",
      description: "Develop one character every day for a week",
      type: "weekly" as const,
      requirements: ["Create character profile", "Write backstory", "Add to story"],
      rewards: ["Character development badge", "Story depth bonus"]
    },
    {
      title: "Plot Twist Challenge",
      description: "Add an unexpected plot twist to your story",
      type: "custom" as const,
      requirements: ["Identify plot point", "Create twist", "Integrate smoothly"],
      rewards: ["Plot mastery badge", "Reader engagement bonus"]
    }
  ];

  // Initialize prompts and challenges
  useEffect(() => {
    const initialPrompts: WritingPrompt[] = [
      {
        id: '1',
        title: 'Character Morning Routine',
        description: 'Describe a character\'s morning routine that reveals their personality',
        category: 'character',
        difficulty: 'easy',
        estimatedTime: 15,
        tags: ['character', 'personality', 'routine'],
        isCompleted: false,
        isFavorite: false,
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'Plot Twist Moment',
        description: 'Write a plot twist that changes everything',
        category: 'plot',
        difficulty: 'hard',
        estimatedTime: 45,
        tags: ['plot', 'twist', 'drama'],
        isCompleted: false,
        isFavorite: true,
        createdAt: new Date()
      }
    ];

    const initialChallenges: WritingChallenge[] = challengeTemplates.map((template, index) => ({
      id: `challenge-${index + 1}`,
      ...template,
      deadline: template.type === 'daily' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined,
      isActive: true,
      participants: Math.floor(Math.random() * 100) + 10,
      completionRate: Math.floor(Math.random() * 40) + 20
    }));

    setPrompts(initialPrompts);
    setChallenges(initialChallenges);
  }, []);

  // Generate random prompt
  const generateRandomPrompt = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const categories = Object.keys(promptTemplates).filter(cat => cat !== 'genre');
      const randomCategory = categories[Math.floor(Math.random() * categories.length)] as keyof typeof promptTemplates;
      const templates = promptTemplates[randomCategory] as string[];
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

      const newPrompt: WritingPrompt = {
        id: `prompt-${Date.now()}`,
        title: `Generated Prompt - ${randomCategory}`,
        description: randomTemplate,
        category: randomCategory as WritingPrompt['category'],
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as WritingPrompt['difficulty'],
        estimatedTime: Math.floor(Math.random() * 30) + 10,
        tags: [randomCategory, 'generated'],
        isCompleted: false,
        isFavorite: false,
        createdAt: new Date()
      };

      setPrompts(prev => [newPrompt, ...prev]);
      setSelectedPrompt(newPrompt);
      setIsGenerating(false);
    }, 1500);
  };

  // Generate genre-specific prompt
  const generateGenrePrompt = (genre: string) => {
    if (genre === 'all') return generateRandomPrompt();

    setIsGenerating(true);
    
    setTimeout(() => {
      const genrePrompts = promptTemplates.genre[genre as keyof typeof promptTemplates.genre];
      if (genrePrompts) {
        const randomPrompt = genrePrompts[Math.floor(Math.random() * genrePrompts.length)];

        const newPrompt: WritingPrompt = {
          id: `prompt-${Date.now()}`,
          title: `${genre} Prompt`,
          description: randomPrompt,
          category: 'genre',
          difficulty: 'medium',
          estimatedTime: 25,
          tags: [genre, 'generated'],
          isCompleted: false,
          isFavorite: false,
          createdAt: new Date()
        };

        setPrompts(prev => [newPrompt, ...prev]);
        setSelectedPrompt(newPrompt);
      }
      setIsGenerating(false);
    }, 1500);
  };

  // Start writing session
  const startWritingSession = (prompt: WritingPrompt) => {
    setWritingSession({
      isActive: true,
      startTime: new Date(),
      wordCount: 0,
      prompt
    });
    setSelectedPrompt(prompt);
  };

  // Stop writing session
  const stopWritingSession = () => {
    if (writingSession.isActive) {
      setPrompts(prev => prev.map(p => 
        p.id === writingSession.prompt?.id 
          ? { ...p, isCompleted: true }
          : p
      ));
      
      setWritingSession({
        isActive: false,
        startTime: null,
        wordCount: 0,
        prompt: null
      });
    }
  };

  // Toggle favorite
  const toggleFavorite = (promptId: string) => {
    setPrompts(prev => prev.map(p => 
      p.id === promptId 
        ? { ...p, isFavorite: !p.isFavorite }
        : p
    ));
  };

  // Filter prompts
  const filteredPrompts = prompts.filter(prompt => {
    const matchesCategory = filterCategory === 'all' || prompt.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || prompt.difficulty === filterDifficulty;
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-2xl font-bold flex items-center">
          <FaLightbulb className="mr-2" />
          AI Writing Prompts & Challenges
        </h2>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={activeTab === 'prompts' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveTab('prompts')}
          >
            <FaBook className="mr-1" />
            Prompts
          </Button>
          <Button
            variant={activeTab === 'challenges' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveTab('challenges')}
          >
            <FaTrophy className="mr-1" />
            Challenges
          </Button>
          <Button
            variant={activeTab === 'generator' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveTab('generator')}
          >
            <FaMagic className="mr-1" />
            Generator
          </Button>
        </div>
      </div>

      {/* Writing Session Timer */}
      {writingSession.isActive && (
        <div className="p-4 bg-blue-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaPlay className="text-green-500" />
                <span className="font-medium">Writing Session Active</span>
              </div>
              <div className="text-sm text-gray-600">
                Prompt: {writingSession.prompt?.title}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="danger"
                size="sm"
                onClick={stopWritingSession}
              >
                <FaStop className="mr-1" />
                Stop Session
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'prompts' && (
          <div className="h-full flex">
            {/* Prompts List */}
            <div className="w-1/2 border-r">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search prompts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="character">Character</option>
                    <option value="plot">Plot</option>
                    <option value="setting">Setting</option>
                    <option value="dialogue">Dialogue</option>
                    <option value="genre">Genre</option>
                  </select>
                  
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="overflow-y-auto h-full">
                {filteredPrompts.map(prompt => (
                  <div
                    key={prompt.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedPrompt?.id === prompt.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedPrompt(prompt)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium flex items-center">
                          {prompt.title}
                          {prompt.isCompleted && <FaCheckCircle className="ml-2 text-green-500" />}
                          {prompt.isFavorite && <FaBookmark className="ml-2 text-yellow-500" />}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{prompt.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span className="capitalize">{prompt.category}</span>
                          <span className="capitalize">{prompt.difficulty}</span>
                          <span>{prompt.estimatedTime} min</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(prompt.id);
                          }}
                        >
                          <FaBookmark className={prompt.isFavorite ? 'text-yellow-500' : 'text-gray-400'} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt Details */}
            <div className="w-1/2 p-4">
              {selectedPrompt ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{selectedPrompt.title}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="capitalize">{selectedPrompt.category}</span>
                      <span className="capitalize">{selectedPrompt.difficulty}</span>
                      <span>{selectedPrompt.estimatedTime} minutes</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Prompt</h4>
                    <p className="text-gray-700">{selectedPrompt.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPrompt.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="primary"
                      onClick={() => startWritingSession(selectedPrompt)}
                      disabled={writingSession.isActive}
                    >
                      <FaPlay className="mr-1" />
                      Start Writing
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => toggleFavorite(selectedPrompt.id)}
                    >
                      <FaBookmark className={selectedPrompt.isFavorite ? 'text-yellow-500' : 'mr-1'} />
                      {selectedPrompt.isFavorite ? 'Favorited' : 'Favorite'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  <FaBook className="mx-auto text-4xl mb-4" />
                  <p>Select a prompt to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {challenges.map(challenge => (
                <Card key={challenge.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold">{challenge.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      challenge.type === 'daily' ? 'bg-green-100 text-green-800' :
                      challenge.type === 'weekly' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {challenge.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-sm">Requirements:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {challenge.requirements.map((req, index) => (
                        <li key={index} className="flex items-center">
                          <FaCheckCircle className="mr-2 text-green-500 text-xs" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-sm">Rewards:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {challenge.rewards.map((reward, index) => (
                        <li key={index} className="flex items-center">
                          <FaTrophy className="mr-2 text-yellow-500 text-xs" />
                          {reward}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{challenge.participants} participants</span>
                    <span>{challenge.completionRate}% completion</span>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full"
                    disabled={!challenge.isActive}
                  >
                    {challenge.isActive ? 'Join Challenge' : 'Challenge Ended'}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'generator' && (
          <div className="p-4">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">AI Prompt Generator</h3>
                <p className="text-gray-600">Generate custom writing prompts based on your preferences</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Genre</label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Any Genre</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="sci-fi">Science Fiction</option>
                    <option value="romance">Romance</option>
                    <option value="mystery">Mystery</option>
                    <option value="thriller">Thriller</option>
                    <option value="horror">Horror</option>
                    <option value="literary">Literary Fiction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Custom Prompt</label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Enter your own prompt idea or leave blank for AI generation..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    variant="primary"
                    onClick={() => selectedGenre === 'all' ? generateRandomPrompt() : generateGenrePrompt(selectedGenre)}
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <FaRefresh className="mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FaDice className="mr-2" />
                        Generate Prompt
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (customPrompt.trim()) {
                        const newPrompt: WritingPrompt = {
                          id: `prompt-${Date.now()}`,
                          title: 'Custom Prompt',
                          description: customPrompt,
                          category: 'custom',
                          difficulty: 'medium',
                          estimatedTime: 20,
                          tags: ['custom', 'user-generated'],
                          isCompleted: false,
                          isFavorite: false,
                          createdAt: new Date()
                        };
                        setPrompts(prev => [newPrompt, ...prev]);
                        setSelectedPrompt(newPrompt);
                        setCustomPrompt('');
                      }
                    }}
                    disabled={!customPrompt.trim()}
                  >
                    <FaSave className="mr-2" />
                    Save Custom
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
