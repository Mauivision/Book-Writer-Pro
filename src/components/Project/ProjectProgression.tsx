'use client';

import { useState, useEffect } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FaBook, 
  FaUser, 
  FaMap, 
  FaEdit, 
  FaRocket,
  FaCheck,
  FaClock,
  FaStar,
  FaTrophy,
  FaLightbulb,
  FaChartLine,
  FaEye,
  FaBrain,
  FaMagic,
  FaBullseye,
  FaAward
} from 'react-icons/fa';
import { humanWritingEngine } from '@/utils/humanWritingEngine';

interface ProjectStage {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'not-started' | 'in-progress' | 'completed' | 'polished';
  progress: number;
  tasks: ProjectTask[];
  estimatedTime: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface ProjectTask {
  id: string;
  name: string;
  completed: boolean;
  required: boolean;
  description: string;
}

interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  achieved: boolean;
  achievedAt?: Date;
  icon: React.ReactNode;
  category: 'writing' | 'planning' | 'development' | 'publishing';
}

export default function ProjectProgression() {
  const [stages, setStages] = useState<ProjectStage[]>([]);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [estimatedCompletion, setEstimatedCompletion] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);

  const { 
    metadata, 
    chapters, 
    characters, 
    plot, 
    setting
  } = useBookStore();

  useEffect(() => {
    calculateProjectStages();
    calculateMilestones();
    calculateOverallProgress();
  }, [metadata, chapters, characters, plot, setting]);

  const calculateProjectStages = () => {
    const totalWords = chapters.reduce((sum, chapter) => sum + (chapter.content?.length || 0), 0);
    const targetWords = metadata.wordCountGoal || 80000;
    const wordProgress = Math.min(100, (totalWords / targetWords) * 100);

    const newStages: ProjectStage[] = [
      {
        id: 'idea',
        name: 'Idea & Concept',
        description: 'Develop your story idea and core concept',
        icon: <FaLightbulb className="text-yellow-500" />,
        status: plot.summary || characters.length > 0 ? 'completed' : 'in-progress',
        progress: plot.summary ? 100 : characters.length > 0 ? 50 : 0,
        estimatedTime: '1-2 days',
        priority: 'critical',
        tasks: [
          { id: 'idea-1', name: 'Core story concept', completed: !!plot.summary, required: true, description: 'Define your main story idea' },
          { id: 'idea-2', name: 'Genre selection', completed: !!metadata.genres?.length, required: true, description: 'Choose your story genre' },
          { id: 'idea-3', name: 'Target audience', completed: !!metadata.targetAudience, required: false, description: 'Define your target readers' },
          { id: 'idea-4', name: 'Story hook', completed: !!plot.summary, required: true, description: 'Create a compelling hook' }
        ]
      },
      {
        id: 'planning',
        name: 'Story Planning',
        description: 'Develop plot, characters, and story structure',
        icon: <FaMap className="text-blue-500" />,
        status: plot.summary && characters.length > 0 ? 'completed' : plot.summary ? 'in-progress' : 'not-started',
        progress: plot.summary ? (characters.length > 0 ? 100 : 60) : 0,
        estimatedTime: '3-5 days',
        priority: 'high',
        tasks: [
          { id: 'planning-1', name: 'Plot outline', completed: !!plot.summary, required: true, description: 'Create your story plot' },
          { id: 'planning-2', name: 'Main characters', completed: characters.length >= 2, required: true, description: 'Develop main characters' },
          { id: 'planning-3', name: 'Story structure', completed: !!plot.outline?.length, required: true, description: 'Plan story structure' },
          { id: 'planning-4', name: 'Setting details', completed: !!setting.description, required: false, description: 'Define story setting' },
          { id: 'planning-5', name: 'Conflict setup', completed: !!plot.summary, required: true, description: 'Establish main conflicts' }
        ]
      },
      {
        id: 'writing',
        name: 'Writing',
        description: 'Write your chapters and develop the story',
        icon: <FaEdit className="text-green-500" />,
        status: chapters.length > 0 ? (wordProgress >= 100 ? 'completed' : 'in-progress') : 'not-started',
        progress: wordProgress,
        estimatedTime: '30-60 days',
        priority: 'critical',
        tasks: [
          { id: 'writing-1', name: 'First chapter', completed: chapters.length >= 1, required: true, description: 'Write your opening chapter' },
          { id: 'writing-2', name: 'Character development', completed: chapters.length >= 3, required: true, description: 'Develop characters through story' },
          { id: 'writing-3', name: 'Plot progression', completed: chapters.length >= 5, required: true, description: 'Advance your plot' },
          { id: 'writing-4', name: 'Midpoint reached', completed: wordProgress >= 50, required: true, description: 'Reach story midpoint' },
          { id: 'writing-5', name: 'Climax development', completed: wordProgress >= 80, required: true, description: 'Build to climax' },
          { id: 'writing-6', name: 'Story completion', completed: wordProgress >= 100, required: true, description: 'Complete your story' }
        ]
      },
      {
        id: 'revision',
        name: 'Revision & Polish',
        description: 'Edit, revise, and polish your manuscript',
        icon: <FaBrain className="text-purple-500" />,
        status: wordProgress >= 100 ? 'in-progress' : 'not-started',
        progress: wordProgress >= 100 ? 20 : 0,
        estimatedTime: '7-14 days',
        priority: 'high',
        tasks: [
          { id: 'revision-1', name: 'Content review', completed: false, required: true, description: 'Review overall content' },
          { id: 'revision-2', name: 'Character consistency', completed: false, required: true, description: 'Check character consistency' },
          { id: 'revision-3', name: 'Plot coherence', completed: false, required: true, description: 'Ensure plot coherence' },
          { id: 'revision-4', name: 'Style refinement', completed: false, required: true, description: 'Refine writing style' },
          { id: 'revision-5', name: 'Final polish', completed: false, required: true, description: 'Final manuscript polish' }
        ]
      },
      {
        id: 'publishing',
        name: 'Publishing Preparation',
        description: 'Format, export, and prepare for publishing',
        icon: <FaRocket className="text-orange-500" />,
        status: 'not-started',
        progress: 0,
        estimatedTime: '2-3 days',
        priority: 'medium',
        tasks: [
          { id: 'publishing-1', name: 'Manuscript formatting', completed: false, required: true, description: 'Format for publishing' },
          { id: 'publishing-2', name: 'Cover design', completed: false, required: true, description: 'Create book cover' },
          { id: 'publishing-3', name: 'Book description', completed: false, required: true, description: 'Write book description' },
          { id: 'publishing-4', name: 'Export formats', completed: false, required: true, description: 'Export in multiple formats' },
          { id: 'publishing-5', name: 'Publishing platforms', completed: false, required: false, description: 'Prepare for platforms' }
        ]
      }
    ];

    setStages(newStages);
  };

  const calculateMilestones = () => {
    const totalWords = chapters.reduce((sum, chapter) => sum + (chapter.content?.length || 0), 0);
    
    const newMilestones: ProjectMilestone[] = [
      {
        id: 'first-idea',
        name: 'Story Conception',
        description: 'Develop your initial story idea',
        achieved: !!plot.summary,
        icon: <FaLightbulb className="text-yellow-500" />,
        category: 'planning'
      },
      {
        id: 'first-character',
        name: 'Character Creation',
        description: 'Create your first character',
        achieved: characters.length >= 1,
        icon: <FaUser className="text-blue-500" />,
        category: 'development'
      },
      {
        id: 'first-chapter',
        name: 'First Chapter',
        description: 'Complete your first chapter',
        achieved: chapters.length >= 1,
        icon: <FaBook className="text-green-500" />,
        category: 'writing'
      },
      {
        id: 'ten-thousand-words',
        name: '10,000 Words',
        description: 'Reach 10,000 words milestone',
        achieved: totalWords >= 10000,
        icon: <FaChartLine className="text-purple-500" />,
        category: 'writing'
      },
      {
        id: 'quarter-complete',
        name: '25% Complete',
        description: 'Complete 25% of your target word count',
        achieved: totalWords >= (metadata.wordCountGoal || 80000) * 0.25,
        icon: <FaBullseye className="text-orange-500" />,
        category: 'writing'
      },
      {
        id: 'halfway-point',
        name: 'Halfway There',
        description: 'Reach 50% of your target word count',
        achieved: totalWords >= (metadata.wordCountGoal || 80000) * 0.5,
        icon: <FaStar className="text-yellow-500" />,
        category: 'writing'
      },
      {
        id: 'three-quarters',
        name: '75% Complete',
        description: 'Complete 75% of your target word count',
        achieved: totalWords >= (metadata.wordCountGoal || 80000) * 0.75,
        icon: <FaTrophy className="text-gold-500" />,
        category: 'writing'
      },
      {
        id: 'manuscript-complete',
        name: 'Manuscript Complete',
        description: 'Reach your target word count',
        achieved: totalWords >= (metadata.wordCountGoal || 80000),
        icon: <FaAward className="text-green-500" />,
        category: 'writing'
      },
      {
        id: 'revision-started',
        name: 'Revision Begins',
        description: 'Start the revision process',
        achieved: totalWords >= (metadata.wordCountGoal || 80000),
        icon: <FaBrain className="text-purple-500" />,
        category: 'development'
      },
      {
        id: 'publishing-ready',
        name: 'Publishing Ready',
        description: 'Manuscript ready for publishing',
        achieved: false, // Would be set when user marks as ready
        icon: <FaRocket className="text-orange-500" />,
        category: 'publishing'
      }
    ];

    setMilestones(newMilestones);
  };

  const calculateOverallProgress = () => {
    const totalTasks = stages.reduce((sum, stage) => sum + stage.tasks.length, 0);
    const completedTasks = stages.reduce((sum, stage) => 
      sum + stage.tasks.filter(task => task.completed).length, 0
    );
    
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    setOverallProgress(Math.round(progress));

    // Calculate estimated completion
    const remainingTasks = totalTasks - completedTasks;
    const estimatedDays = Math.ceil(remainingTasks * 2); // Assume 2 days per task
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + estimatedDays);
    
    setEstimatedCompletion(completionDate.toLocaleDateString());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'polished': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const achievedMilestones = milestones.filter(m => m.achieved);
  const remainingMilestones = milestones.filter(m => !m.achieved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <FaChartLine className="text-blue-600" />
          Project Progression
        </h2>
        <p className="text-gray-600 mt-1">Track your book's journey from idea to publication</p>
      </div>

      {/* Overall Progress */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">{overallProgress}%</div>
          <div className="text-gray-600 mb-4">Overall Project Complete</div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold text-gray-900">Estimated Completion</div>
              <div className="text-gray-600">{estimatedCompletion}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Words Written</div>
              <div className="text-gray-600">{chapters.reduce((sum, chapter) => sum + (chapter.content?.length || 0), 0).toLocaleString()}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Chapters</div>
              <div className="text-gray-600">{chapters.length}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Project Stages */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaMap className="text-blue-500" />
          Project Stages
        </h3>
        
        <div className="space-y-4">
          {stages.map((stage) => (
            <Card key={stage.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{stage.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{stage.name}</h4>
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(stage.status)}`}>
                    {stage.status.replace('-', ' ')}
                  </span>
                  <span className={`text-xs font-medium ${getPriorityColor(stage.priority)}`}>
                    {stage.priority}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{stage.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      stage.status === 'completed' ? 'bg-green-500' : 
                      stage.status === 'polished' ? 'bg-purple-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${stage.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Est. Time: {stage.estimatedTime}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </Button>
              </div>

              {showDetails && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2">Tasks</h5>
                  <div className="space-y-2">
                    {stage.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          task.completed ? 'bg-green-500 text-white' : 'bg-gray-200'
                        }`}>
                          {task.completed && <FaCheck className="text-xs" />}
                        </div>
                        <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          {task.name}
                        </span>
                        {task.required && (
                          <span className="text-xs text-red-500">Required</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaTrophy className="text-yellow-500" />
          Milestones ({achievedMilestones.length}/{milestones.length} achieved)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((milestone) => (
            <Card 
              key={milestone.id} 
              className={`p-4 transition-all duration-200 ${
                milestone.achieved 
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`text-2xl ${milestone.achieved ? 'text-yellow-500' : 'text-gray-400'}`}>
                  {milestone.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${milestone.achieved ? 'text-gray-900' : 'text-gray-600'}`}>
                    {milestone.name}
                  </h4>
                  <p className={`text-sm ${milestone.achieved ? 'text-gray-700' : 'text-gray-500'}`}>
                    {milestone.description}
                  </p>
                </div>
                {milestone.achieved && (
                  <FaCheck className="text-green-500 text-xl" />
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaEye className="text-green-500" />
          Recommended Next Steps
        </h3>
        
        <div className="space-y-3">
          {stages
            .filter(stage => stage.status === 'in-progress')
            .slice(0, 3)
            .map((stage) => (
              <div key={stage.id} className="flex items-center gap-3">
                <div className="text-blue-500">{stage.icon}</div>
                <div>
                  <div className="font-medium text-gray-900">Focus on {stage.name}</div>
                  <div className="text-sm text-gray-600">
                    {stage.tasks.filter(task => !task.completed && task.required)[0]?.description || 'Continue current stage'}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
} 