'use client';

import { useState, useEffect, useRef } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { 
  FaComments, 
  FaLightbulb, 
  FaBook, 
  FaUser, 
  FaMap, 
  FaEdit, 
  FaRocket,
  FaSpinner,
  FaTimes,
  FaHeart,
  FaBrain,
  FaMagic,
  FaEye,
  FaPalette,
  FaUsers,
  FaChartLine,
  FaCog
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { aiBrain } from '@/utils/aiBrain';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'suggestion' | 'question' | 'encouragement' | 'guidance';
  actions?: string[];
}

interface WritingStage {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'not-started' | 'in-progress' | 'completed';
}

export default function WritingCompanion() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeStage, setActiveStage] = useState<string>('idea');
  const [companionName, setCompanionName] = useState('NovelCraft AI');
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { 
    metadata, 
    chapters, 
    characters, 
    plot, 
    setting,
    generateChapter,
    generateCharacterIdeas,
    generatePlotIdeas,
    generateSettingIdeas
  } = useBookStore();

  const writingStages: WritingStage[] = [
    {
      id: 'idea',
      name: 'Idea & Concept',
      description: 'Develop your story idea',
      icon: <FaLightbulb className="text-yellow-500" />,
      status: chapters.length > 0 ? 'completed' : 'in-progress'
    },
    {
      id: 'planning',
      name: 'Story Planning',
      description: 'Plot, characters, and setting',
      icon: <FaMap className="text-blue-500" />,
      status: plot.summary ? 'completed' : 'in-progress'
    },
    {
      id: 'writing',
      name: 'Writing',
      description: 'Create your chapters',
      icon: <FaBook className="text-green-500" />,
      status: chapters.length > 0 ? 'in-progress' : 'not-started'
    },
    {
      id: 'revision',
      name: 'Revision',
      description: 'Edit and polish',
      icon: <FaEdit className="text-purple-500" />,
      status: 'not-started'
    },
    {
      id: 'publishing',
      name: 'Publishing',
      description: 'Export and publish',
      icon: <FaRocket className="text-orange-500" />,
      status: 'not-started'
    }
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize AI brain with current book context
  useEffect(() => {
    const currentStage = chapters.length > 0 ? 'writing' : 
                        plot.summary ? 'planning' : 'idea';
    
    aiBrain.initialize({
      bookTitle: metadata.title || 'Untitled Book',
      chapterCount: chapters.length,
      characterCount: characters.length,
      genres: metadata.genres || [],
      plot: plot.summary ? {
        summary: plot.summary,
        outline: plot.outline || []
      } : undefined,
      characters: characters.length > 0 ? characters.map(char => ({
        id: char.id,
        name: char.name,
        role: char.role,
        description: char.description,
        background: char.background,
        motivations: char.motivations || []
      })) : undefined,
      setting: setting.description ? {
        description: setting.description,
        worldBuilding: setting.worldBuilding || ''
      } : undefined,
      currentStage,
      userExperience: 'beginner' // Could be made configurable
    });
  }, [metadata, chapters, characters, plot, setting]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: Message = {
        id: 'greeting',
        role: 'assistant',
        content: `Hi there! I'm ${companionName}, your AI writing companion. I'm here to help you write your book from start to finish! 

What kind of story are you thinking about writing? I'd love to hear your ideas and help you bring them to life.`,
        timestamp: new Date(),
        type: 'encouragement',
        actions: ['Tell me about your story idea', 'I need help brainstorming', 'Show me the writing stages']
      };
      setMessages([greeting]);
    }
  }, [companionName]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateCompanionResponse(input);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Sorry, I had trouble processing that. Can you try again?');
    } finally {
      setIsTyping(false);
    }
  };

  const generateCompanionResponse = async (userInput: string): Promise<Message> => {
    // Use AI brain to process input and generate intelligent response
    try {
      const aiResponse = await aiBrain.processInput(userInput);
      
      // Map AI brain mood to Message type
      const mapMoodToType = (mood: string): 'suggestion' | 'question' | 'encouragement' | 'guidance' => {
        switch (mood) {
          case 'encouraging':
            return 'encouragement';
          case 'analytical':
            return 'guidance';
          case 'creative':
            return 'suggestion';
          case 'supportive':
            return 'encouragement';
          default:
            return 'guidance';
        }
      };
      
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date(),
        type: mapMoodToType(aiResponse.mood),
        actions: aiResponse.actions
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback response if AI brain fails
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I'm here to support your writing journey! What would you like to work on today?`,
        timestamp: new Date(),
        type: 'encouragement',
        actions: ['Tell me about your story', 'Get writing help', 'Plan my book']
      };
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  // Advanced AI Writing Tools
  const handleAdvancedTool = async (tool: string) => {
    setIsTyping(true);
    
    try {
      let prompt = '';
      let toolName = '';
      
      switch (tool) {
        case 'scene-builder':
          prompt = `Help me build a vivid scene for my story. I need rich sensory details, atmospheric elements, and engaging descriptions that bring the scene to life.`;
          toolName = 'Vivid Scene Builder';
          break;
        case 'perspective-shift':
          prompt = `I want to see my story from a different perspective. Help me explore how my narrative would change if told from another character's point of view.`;
          toolName = 'Perspective Shifter';
          break;
        case 'metaphor-generator':
          prompt = `I need creative metaphors and similes to enhance my writing. Help me find unique ways to describe emotions, settings, and characters.`;
          toolName = 'Metaphor Generator';
          break;
        case 'scenario-generator':
          prompt = `I need dynamic, character-driven scenarios that will create tension and move my plot forward. Help me develop compelling situations.`;
          toolName = 'Scenario Generator';
          break;
        case 'character-developer':
          prompt = `I want to deepen my character development. Help me explore motivations, backstories, and character arcs that will make my characters more compelling.`;
          toolName = 'Character Developer';
          break;
        case 'plot-enhancer':
          prompt = `I need help strengthening my plot structure. Help me identify plot holes, develop subplots, and create satisfying story beats.`;
          toolName = 'Plot Enhancer';
          break;
        default:
          return;
      }

      const response = await generateCompanionResponse(`${toolName}: ${prompt}`);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error with advanced tool:', error);
      toast.error('Sorry, I had trouble with that tool. Can you try again?');
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickHelp = async (topic: string) => {
    setIsTyping(true);
    try {
      const response = await generateCompanionResponse(`Quick help for ${topic}:`);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error with quick help:', error);
      toast.error('Sorry, I had trouble with that quick help. Can you try again?');
    } finally {
      setIsTyping(false);
    }
  };

  const getStageStatus = (stageId: string) => {
    const stage = writingStages.find(s => s.id === stageId);
    return stage?.status || 'not-started';
  };

  return (
    <div className="flex h-full">
      {/* Writing Stages Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaBrain className="text-purple-500" />
          Writing Journey
        </h2>
        
        <div className="space-y-3">
          {writingStages.map((stage) => (
            <div
              key={stage.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                activeStage === stage.id
                  ? 'bg-blue-100 border-blue-300 border'
                  : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => setActiveStage(stage.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  stage.status === 'completed' ? 'bg-green-500 text-white' :
                  stage.status === 'in-progress' ? 'bg-blue-500 text-white' :
                  'bg-gray-300 text-gray-600'
                }`}>
                  {stage.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-mint-900">{stage.name}</h4>
                  <p className="text-sm text-mint-600">{stage.description}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  stage.status === 'completed' ? 'bg-green-400' :
                  stage.status === 'in-progress' ? 'bg-blue-400' :
                  'bg-gray-400'
                }`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Help Buttons */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-mint-900">
            <FaMagic className="text-purple-500" />
            Quick Help
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickHelp('story-starter')}
              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm transition-colors"
            >
              Story Starters
            </button>
            <button
              onClick={() => handleQuickHelp('character-help')}
              className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-sm transition-colors"
            >
              Character Help
            </button>
            <button
              onClick={() => handleQuickHelp('plot-help')}
              className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm transition-colors"
            >
              Plot Structure
            </button>
            <button
              onClick={() => handleQuickHelp('writing-tips')}
              className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded text-sm transition-colors"
            >
              Writing Tips
            </button>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-6 p-4 bg-white rounded-lg">
          <h3 className="font-medium text-sm mb-2">Your Progress</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Chapters:</span>
              <span className="font-medium">{chapters.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Characters:</span>
              <span className="font-medium">{characters.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Words Written:</span>
              <span className="font-medium">
                {chapters.reduce((total, ch) => total + ch.wordCount, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <FaMagic className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">{companionName}</h1>
                <p className="text-sm text-gray-600">Your AI Writing Companion</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowAdvancedTools(!showAdvancedTools)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <FaCog />
                AI Tools
              </Button>
              <span className="text-xs text-gray-500">Always here to help</span>
              <FaHeart className="text-red-400" />
            </div>
          </div>
        </div>

        {/* Advanced AI Tools Panel */}
        {showAdvancedTools && (
          <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-purple-50 to-blue-50">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">Advanced AI Writing Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button
                onClick={() => handleAdvancedTool('scene-builder')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs"
                disabled={isTyping}
              >
                <FaEye />
                Scene Builder
              </Button>
              <Button
                onClick={() => handleAdvancedTool('perspective-shift')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs"
                disabled={isTyping}
              >
                <FaUsers />
                Perspective Shift
              </Button>
              <Button
                onClick={() => handleAdvancedTool('metaphor-generator')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs"
                disabled={isTyping}
              >
                <FaPalette />
                Metaphor Generator
              </Button>
              <Button
                onClick={() => handleAdvancedTool('scenario-generator')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs"
                disabled={isTyping}
              >
                <FaLightbulb />
                Scenario Generator
              </Button>
              <Button
                onClick={() => handleAdvancedTool('character-developer')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs"
                disabled={isTyping}
              >
                <FaUser />
                Character Developer
              </Button>
              <Button
                onClick={() => handleAdvancedTool('plot-enhancer')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs"
                disabled={isTyping}
              >
                <FaChartLine />
                Plot Enhancer
              </Button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {message.actions && message.role === 'assistant' && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action)}
                        className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <FaSpinner className="animate-spin text-blue-500" />
                  <span className="text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Tell me about your story, ask for help, or just chat..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <FaComments />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}