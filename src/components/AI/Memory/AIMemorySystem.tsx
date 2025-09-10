'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  FaBrain, 
  FaMemory, 
  FaUsers, 
  FaMap, 
  FaClock,
  FaBook,
  FaLightbulb,
  FaEye,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaExpand,
  FaCompress,
  FaChevronDown,
  FaChevronRight,
  FaStar,
  FaHeart,
  FaRocket,
  FaPalette
} from 'react-icons/fa';

interface MemoryItem {
  id: string;
  type: 'character' | 'setting' | 'plot' | 'theme' | 'relationship' | 'detail';
  title: string;
  content: string;
  context: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  createdAt: string;
  lastReferenced: string;
  referenceCount: number;
  relatedItems: string[];
}

interface AIMemorySystemProps {
  text: string;
  onMemorySelect?: (memory: MemoryItem) => void;
  onMemoryCreate?: (memory: Omit<MemoryItem, 'id' | 'createdAt' | 'lastReferenced' | 'referenceCount'>) => void;
  className?: string;
}

export function AIMemorySystem({ 
  text, 
  onMemorySelect, 
  onMemoryCreate,
  className = '' 
}: AIMemorySystemProps) {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [memoryFilter, setMemoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMemory, setNewMemory] = useState({
    type: 'detail' as MemoryItem['type'],
    title: '',
    content: '',
    context: '',
    importance: 'medium' as MemoryItem['importance'],
    tags: [] as string[]
  });

  // Analyze text for memory extraction
  const analyzeText = useCallback(async () => {
    if (!text.trim() || text.length < 50) {
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI-powered memory extraction
      const extractedMemories: Omit<MemoryItem, 'id' | 'createdAt' | 'lastReferenced' | 'referenceCount'>[] = [
        {
          type: 'character',
          title: 'Sarah\'s Fear of Heights',
          content: 'Sarah has a deep-seated fear of heights that stems from a childhood accident. This affects her ability to climb or be in high places.',
          context: 'Mentioned when Sarah hesitates before climbing the tower',
          importance: 'high',
          tags: ['character-trait', 'fear', 'backstory', 'limitation']
        },
        {
          type: 'setting',
          title: 'The Ancient Library',
          content: 'A massive library filled with ancient tomes, located in the heart of the old city. The building has three levels and contains forbidden knowledge.',
          context: 'Described when the protagonist enters the library',
          importance: 'medium',
          tags: ['location', 'library', 'ancient', 'knowledge', 'three-levels']
        },
        {
          type: 'plot',
          title: 'The Prophecy of the Chosen One',
          content: 'An ancient prophecy foretells that a chosen one will unite the three kingdoms and bring peace to the realm. The chosen one bears a special mark.',
          context: 'Revealed through the old sage\'s dialogue',
          importance: 'critical',
          tags: ['prophecy', 'chosen-one', 'unite-kingdoms', 'special-mark', 'peace']
        },
        {
          type: 'relationship',
          title: 'Marcus and Elena\'s Rivalry',
          content: 'Marcus and Elena have been rivals since childhood, competing in everything from academics to sword fighting. Their rivalry masks a deep mutual respect.',
          context: 'Shown through their competitive interactions',
          importance: 'medium',
          tags: ['rivalry', 'childhood', 'competition', 'mutual-respect', 'complex-relationship']
        },
        {
          type: 'detail',
          title: 'The Crystal Sword\'s Power',
          content: 'The crystal sword glows blue when danger is near and can cut through any material. It was forged by the ancient elves and contains their magic.',
          context: 'Described when the sword is first used in battle',
          importance: 'high',
          tags: ['magic-item', 'crystal-sword', 'danger-detection', 'ancient-elves', 'cutting-power']
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Convert to full memory items
      const fullMemories: MemoryItem[] = extractedMemories.map((memory, index) => ({
        ...memory,
        id: `memory-${Date.now()}-${index}`,
        createdAt: new Date().toISOString(),
        lastReferenced: new Date().toISOString(),
        referenceCount: Math.floor(Math.random() * 10) + 1,
        relatedItems: []
      }));

      setMemories(prevMemories => {
        // Merge with existing memories, avoiding duplicates
        const existingTitles = prevMemories.map(m => m.title);
        const newMemories = fullMemories.filter(m => !existingTitles.includes(m.title));
        return [...prevMemories, ...newMemories];
      });
    } catch (error) {
      console.error('Memory analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [text]);

  // Create new memory
  const createMemory = useCallback(() => {
    if (!newMemory.title.trim() || !newMemory.content.trim()) return;

    const memory: MemoryItem = {
      ...newMemory,
      id: `memory-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastReferenced: new Date().toISOString(),
      referenceCount: 0,
      relatedItems: []
    };

    setMemories(prev => [memory, ...prev]);
    setNewMemory({
      type: 'detail',
      title: '',
      content: '',
      context: '',
      importance: 'medium',
      tags: []
    });
    setShowCreateForm(false);

    if (onMemoryCreate) {
      onMemoryCreate(newMemory);
    }
  }, [newMemory, onMemoryCreate]);

  // Get memory type info
  const getMemoryTypeInfo = (type: string) => {
    const types = {
      character: { icon: FaUsers, color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Character' },
      setting: { icon: FaMap, color: 'text-green-600 bg-green-50 border-green-200', label: 'Setting' },
      plot: { icon: FaBook, color: 'text-purple-600 bg-purple-50 border-purple-200', label: 'Plot' },
      theme: { icon: FaLightbulb, color: 'text-yellow-600 bg-yellow-50 border-yellow-200', label: 'Theme' },
      relationship: { icon: FaHeart, color: 'text-pink-600 bg-pink-50 border-pink-200', label: 'Relationship' },
      detail: { icon: FaEye, color: 'text-gray-600 bg-gray-50 border-gray-200', label: 'Detail' }
    };
    return types[type as keyof typeof types] || types.detail;
  };

  // Get importance color
  const getImportanceColor = (importance: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[importance as keyof typeof colors] || colors.medium;
  };

  // Filter memories
  const filteredMemories = memories.filter(memory => {
    const matchesFilter = memoryFilter === 'all' || memory.type === memoryFilter;
    const matchesSearch = searchQuery === '' || 
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeText();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [analyzeText]);

  return (
    <Card className={className}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FaMemory className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-semibold">AI Memory System</h3>
            {memories.length > 0 && (
              <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-full">
                {memories.length} memories
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              size="sm"
              variant="outline"
            >
              <FaPlus className="w-4 h-4 mr-1" />
              Add Memory
            </Button>
            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="outline"
              size="sm"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </div>

        {/* Create Memory Form */}
        {showCreateForm && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold mb-3">Create New Memory</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={newMemory.type}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  >
                    <option value="character">Character</option>
                    <option value="setting">Setting</option>
                    <option value="plot">Plot</option>
                    <option value="theme">Theme</option>
                    <option value="relationship">Relationship</option>
                    <option value="detail">Detail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Importance</label>
                  <select
                    value={newMemory.importance}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, importance: e.target.value as any }))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  placeholder="Memory title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={newMemory.content}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  rows={3}
                  placeholder="Memory content..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Context</label>
                <input
                  type="text"
                  value={newMemory.context}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, context: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  placeholder="Where/when this was mentioned..."
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={createMemory} size="sm">
                  <FaCheck className="w-4 h-4 mr-1" />
                  Create Memory
                </Button>
                <Button onClick={() => setShowCreateForm(false)} size="sm" variant="outline">
                  <FaTimes className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-4 flex gap-3">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                placeholder="Search memories..."
              />
            </div>
          </div>
          
          <select
            value={memoryFilter}
            onChange={(e) => setMemoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="all">All Types</option>
            <option value="character">Characters</option>
            <option value="setting">Settings</option>
            <option value="plot">Plot</option>
            <option value="theme">Themes</option>
            <option value="relationship">Relationships</option>
            <option value="detail">Details</option>
          </select>
        </div>

        {/* Analysis Status */}
        {isAnalyzing && (
          <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <FaBrain className="w-4 h-4 text-purple-500 animate-pulse" />
              <span className="text-sm text-purple-700 dark:text-purple-300">
                Analyzing text for memory extraction...
              </span>
            </div>
          </div>
        )}

        {/* Memories List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredMemories.length === 0 && !isAnalyzing ? (
            <div className="text-center py-8">
              <FaMemory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">No Memories Found</h4>
              <p className="text-gray-500 dark:text-gray-500">
                {searchQuery ? 'No memories match your search' : 'Start writing to build your story memory'}
              </p>
            </div>
          ) : (
            filteredMemories.map((memory) => {
              const typeInfo = getMemoryTypeInfo(memory.type);
              const TypeIcon = typeInfo.icon;
              
              return (
                <div
                  key={memory.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedMemory?.id === memory.id ? 'ring-2 ring-purple-500' : ''
                  } ${typeInfo.color}`}
                  onClick={() => {
                    setSelectedMemory(memory);
                    if (onMemorySelect) {
                      onMemorySelect(memory);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TypeIcon className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wide">
                          {typeInfo.label}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getImportanceColor(memory.importance)}`}>
                          {memory.importance}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {memory.referenceCount} refs
                        </span>
                      </div>
                      
                      <h5 className="font-semibold mb-2">{memory.title}</h5>
                      <p className="text-sm mb-2">{memory.content}</p>
                      
                      {showDetails && (
                        <div className="mb-2">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            <strong>Context:</strong> {memory.context}
                          </div>
                          {memory.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {memory.tags.map((tag, index) => (
                                <span key={index} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary */}
        {memories.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold mb-2">Memory Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Characters:</span> 
                <span className="ml-2 text-blue-600">{memories.filter(m => m.type === 'character').length}</span>
              </div>
              <div>
                <span className="font-medium">Settings:</span> 
                <span className="ml-2 text-green-600">{memories.filter(m => m.type === 'setting').length}</span>
              </div>
              <div>
                <span className="font-medium">Plot Points:</span> 
                <span className="ml-2 text-purple-600">{memories.filter(m => m.type === 'plot').length}</span>
              </div>
              <div>
                <span className="font-medium">Critical:</span> 
                <span className="ml-2 text-red-600">{memories.filter(m => m.importance === 'critical').length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
