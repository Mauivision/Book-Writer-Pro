'use client';

import { useState } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  FaMagic, 
  FaEye, 
  FaPalette, 
  FaUsers, 
  FaBook, 
  FaLightbulb,
  FaSpinner,
  FaCopy,
  FaCheck,
  FaExpand,
  FaCompress,
  FaBrain,
  FaStar,
  FaRocket
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface WritingTool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'scene' | 'character' | 'style' | 'plot' | 'inspiration';
  color: string;
}

interface ToolResult {
  content: string;
  suggestions: string[];
  metadata: {
    wordCount: number;
    complexity: 'simple' | 'moderate' | 'complex';
    style: string;
  };
}

export default function AdvancedWritingTools() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ToolResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedResults, setExpandedResults] = useState<Set<number>>(new Set());

  const { 
    metadata, 
    chapters, 
    characters, 
    plot, 
    setting,
    generateChapter,
    generateCharacterIdeas
  } = useBookStore();

  const writingTools: WritingTool[] = [
    {
      id: 'scene-builder',
      name: 'Scene Builder',
      description: 'Create vivid, detailed scenes with rich sensory details',
      icon: <FaEye className="text-blue-500" />,
      category: 'scene',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'perspective-shifter',
      name: 'Perspective Shifter',
      description: 'Rewrite scenes from different character viewpoints',
      icon: <FaUsers className="text-purple-500" />,
      category: 'character',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'metaphor-generator',
      name: 'Metaphor Generator',
      description: 'Generate creative metaphors and similes',
      icon: <FaPalette className="text-green-500" />,
      category: 'style',
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'character-developer',
      name: 'Character Developer',
      description: 'Deepen character development and motivations',
      icon: <FaUsers className="text-indigo-500" />,
      category: 'character',
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      id: 'plot-enhancer',
      name: 'Plot Enhancer',
      description: 'Strengthen plot structure and add complexity',
      icon: <FaBook className="text-orange-500" />,
      category: 'plot',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      id: 'inspiration-booster',
      name: 'Inspiration Booster',
      description: 'Generate creative ideas and story elements',
      icon: <FaLightbulb className="text-yellow-500" />,
      category: 'inspiration',
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      id: 'style-analyzer',
      name: 'Style Analyzer',
      description: 'Analyze and improve your writing style',
      icon: <FaBrain className="text-red-500" />,
      category: 'style',
      color: 'bg-red-50 border-red-200'
    },
    {
      id: 'dialogue-enhancer',
      name: 'Dialogue Enhancer',
      description: 'Improve character dialogue and conversations',
      icon: <FaUsers className="text-teal-500" />,
      category: 'character',
      color: 'bg-teal-50 border-teal-200'
    }
  ];

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setResults([]);
    setInput('');
  };

  const handleGenerate = async () => {
    if (!selectedTool || !input.trim()) {
      toast.error('Please select a tool and enter some text');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateToolResult(selectedTool, input);
      setResults(prev => [result, ...prev]);
      toast.success('Generated successfully!');
    } catch (error) {
      console.error('Error generating result:', error);
      toast.error('Failed to generate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateToolResult = async (toolId: string, text: string): Promise<ToolResult> => {
    // Simulate AI generation - in real app, this would call your AI endpoints
    const tool = writingTools.find(t => t.id === toolId);
    
    // Generate different types of content based on the tool
    let content = '';
    let suggestions: string[] = [];
    
    switch (toolId) {
      case 'scene-builder':
        content = `The scene unfolded with cinematic precision. ${text} The air crackled with tension as shadows danced across the weathered walls. Every detail seemed to pulse with life, from the faint scent of old books to the distant echo of footsteps on cobblestone streets.`;
        suggestions = ['Add more sensory details', 'Include character reactions', 'Vary sentence structure'];
        break;
        
      case 'perspective-shifter':
        content = `From this new vantage point, ${text} took on an entirely different meaning. What had seemed straightforward now revealed hidden layers of complexity. The world looked different through these eyes, colored by past experiences and future hopes.`;
        suggestions = ['Consider character background', 'Add internal thoughts', 'Show emotional state'];
        break;
        
      case 'metaphor-generator':
        content = `${text} was like a storm gathering on the horizon, full of promise and danger. It reminded me of a butterfly emerging from its chrysalis, fragile yet determined. The moment hung in the air like a note suspended in a cathedral.`;
        suggestions = ['Use more original metaphors', 'Connect to story themes', 'Avoid clichés'];
        break;
        
      case 'character-developer':
        content = `This character's journey through ${text} revealed depths I hadn't considered before. Their motivations became clearer, their fears more palpable. Every choice they made now carried the weight of their past and the promise of their future.`;
        suggestions = ['Explore backstory', 'Add internal conflict', 'Show character growth'];
        break;
        
      case 'plot-enhancer':
        content = `The plot thickened around ${text}, revealing new layers of complexity. Subplots began to intertwine, creating a richer tapestry of story. Each revelation added depth to the narrative, making the resolution more satisfying.`;
        suggestions = ['Add subplots', 'Increase stakes', 'Create more conflict'];
        break;
        
      case 'inspiration-booster':
        content = `New ideas blossomed from ${text}, each one more intriguing than the last. The creative well seemed bottomless, offering endless possibilities for story development. Inspiration flowed like a river, carrying the story in unexpected directions.`;
        suggestions = ['Explore different angles', 'Combine multiple ideas', 'Think outside the box'];
        break;
        
      case 'style-analyzer':
        content = `Analyzing the style of "${text}" revealed patterns that could be enhanced. The rhythm and flow could be improved with more varied sentence structures. Word choice could be more precise, creating stronger imagery.`;
        suggestions = ['Vary sentence length', 'Use stronger verbs', 'Reduce passive voice'];
        break;
        
      case 'dialogue-enhancer':
        content = `"${text}" became more natural and engaging. Each character's voice became distinct, reflecting their personality and background. The conversation flowed more smoothly, revealing character through speech patterns.`;
        suggestions = ['Make dialogue more natural', 'Show character through speech', 'Add subtext'];
        break;
        
      default:
        content = `Enhanced version of: ${text}`;
        suggestions = ['Review and refine', 'Add more detail', 'Consider pacing'];
    }

    return {
      content,
      suggestions,
      metadata: {
        wordCount: content.split(' ').length,
        complexity: content.length > 200 ? 'complex' : content.length > 100 ? 'moderate' : 'simple',
        style: tool?.category || 'general'
      }
    };
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedResults(newExpanded);
  };

  const selectedToolData = writingTools.find(t => t.id === selectedTool);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <FaMagic className="text-purple-600" />
          Advanced Writing Tools
        </h2>
        <p className="text-gray-600 mt-2">Specialized AI tools to enhance your writing</p>
      </div>

      {/* Tool Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {writingTools.map((tool) => (
          <Card
            key={tool.id}
            className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTool === tool.id ? 'ring-2 ring-blue-500 bg-blue-50' : tool.color
            }`}
            onClick={() => handleToolSelect(tool.id)}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{tool.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tool Interface */}
      {selectedTool && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">{selectedToolData?.icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{selectedToolData?.name}</h3>
              <p className="text-gray-600">{selectedToolData?.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Text
              </label>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Enter text for ${selectedToolData?.name.toLowerCase()}...`}
                className="w-full"
                rows={4}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !input.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FaRocket className="mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaStar className="text-yellow-500" />
            Generated Results
          </h3>
          
          {results.map((result, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    {result.metadata.wordCount} words
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    result.metadata.complexity === 'complex' ? 'bg-red-100 text-red-800' :
                    result.metadata.complexity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {result.metadata.complexity}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleExpanded(index)}
                  >
                    {expandedResults.has(index) ? <FaCompress /> : <FaExpand />}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => copyToClipboard(result.content, index)}
                  >
                    {copiedIndex === index ? <FaCheck /> : <FaCopy />}
                  </Button>
                </div>
              </div>

              <div className={`prose max-w-none ${
                expandedResults.has(index) ? '' : 'max-h-32 overflow-hidden'
              }`}>
                <p className="text-gray-800 leading-relaxed">{result.content}</p>
              </div>

              {!expandedResults.has(index) && result.content.length > 200 && (
                <div className="mt-2">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => toggleExpanded(index)}
                  >
                    Show more
                  </Button>
                </div>
              )}

              {result.suggestions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Suggestions:</h4>
                  <ul className="space-y-1">
                    {result.suggestions.map((suggestion, sIndex) => (
                      <li key={sIndex} className="text-sm text-gray-600 flex items-center gap-2">
                        <FaLightbulb className="text-yellow-500 text-xs" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Tips */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FaBrain className="text-blue-600" />
          Pro Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Getting the Best Results</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Provide specific, detailed input for better results</li>
              <li>• Use these tools to enhance existing content</li>
              <li>• Combine multiple tools for comprehensive improvements</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Workflow Integration</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Generate ideas, then refine with other tools</li>
              <li>• Use style analyzer to improve your writing</li>
              <li>• Save your best results for future reference</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
} 