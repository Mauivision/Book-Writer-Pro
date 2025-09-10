'use client';

import { useState, useEffect, useRef } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  FaUser,
  FaUsers,
  FaHeart,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaTrash,
  FaSave,
  FaUndo,
  FaRedo,
  FaExpand,
  FaCompress,
  FaSearch,
  FaFilter,
  FaPalette,
  FaLink,
  FaUnlink,
  FaEye,
  FaEyeSlash,
  FaDownload,
  FaUpload,
  FaRandom,
  FaSort,
  FaInfoCircle,
  FaQuestionCircle,
  FaCog,
  FaHome,
  FaTree,
  FaNetworkWired,
  FaProjectDiagram
} from 'react-icons/fa';

interface CharacterNode {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  size: number;
  type: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  relationships: CharacterRelationship[];
  isVisible: boolean;
  isSelected: boolean;
}

interface CharacterRelationship {
  id: string;
  targetId: string;
  type: 'love' | 'hate' | 'friendship' | 'family' | 'rivalry' | 'mentor' | 'enemy' | 'neutral';
  strength: number; // 1-5
  description: string;
  isVisible: boolean;
  color: string;
}

interface CharacterVisualizerProps {
  onCharacterSelect?: (characterId: string) => void;
  onRelationshipEdit?: (relationshipId: string) => void;
}

export default function CharacterVisualizer({ 
  onCharacterSelect, 
  onRelationshipEdit 
}: CharacterVisualizerProps) {
  const { characters, updateCharacter, addCharacter, deleteCharacter } = useBookStore();
  const [nodes, setNodes] = useState<CharacterNode[]>([]);
  const [relationships, setRelationships] = useState<CharacterRelationship[]>([]);
  const [selectedNode, setSelectedNode] = useState<CharacterNode | null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<CharacterRelationship | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'network' | 'family' | 'conflict'>('network');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showRelationshipLabels, setShowRelationshipLabels] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [history, setHistory] = useState<CharacterNode[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Relationship type colors
  const relationshipColors = {
    love: '#ff6b6b',
    hate: '#ff4757',
    friendship: '#2ed573',
    family: '#ffa502',
    rivalry: '#ff6348',
    mentor: '#3742fa',
    enemy: '#2f3542',
    neutral: '#747d8c'
  };

  // Character type colors
  const characterColors = {
    protagonist: '#4ecdc4',
    antagonist: '#ff6b6b',
    supporting: '#45b7d1',
    minor: '#96ceb4'
  };

  // Initialize nodes from characters
  useEffect(() => {
    const initialNodes: CharacterNode[] = characters.map((char, index) => ({
      id: char.id,
      name: char.name,
      x: 100 + (index % 5) * 150,
      y: 100 + Math.floor(index / 5) * 150,
      color: characterColors[char.type as keyof typeof characterColors] || characterColors.minor,
      size: char.type === 'protagonist' ? 60 : char.type === 'antagonist' ? 55 : 45,
      type: char.type as CharacterNode['type'],
      relationships: [],
      isVisible: true,
      isSelected: false
    }));

    setNodes(initialNodes);
    setHistory([initialNodes]);
    setHistoryIndex(0);
  }, [characters]);

  // Generate relationships based on character data
  useEffect(() => {
    const newRelationships: CharacterRelationship[] = [];
    
    characters.forEach(char => {
      if (char.relationships) {
        char.relationships.forEach(rel => {
          newRelationships.push({
            id: `${char.id}-${rel.characterId}`,
            targetId: rel.characterId,
            type: rel.type as CharacterRelationship['type'],
            strength: rel.strength || 3,
            description: rel.description || '',
            isVisible: true,
            color: relationshipColors[rel.type as keyof typeof relationshipColors] || relationshipColors.neutral
          });
        });
      }
    });

    setRelationships(newRelationships);
  }, [characters]);

  // Filter nodes based on search and type
  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || node.type === filterType;
    return matchesSearch && matchesType && node.isVisible;
  });

  // Handle node drag
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y
    });
    setSelectedNode(node);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedNode) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newX = e.clientX - rect.left - dragStart.x;
    const newY = e.clientY - rect.top - dragStart.y;

    setNodes(prev => prev.map(node => 
      node.id === selectedNode.id 
        ? { ...node, x: newX, y: newY }
        : node
    ));
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      saveToHistory();
    }
  };

  // Save state to history for undo/redo
  const saveToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...nodes]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo/Redo functions
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setNodes(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setNodes(history[historyIndex + 1]);
    }
  };

  // Add new character
  const addNewCharacter = () => {
    const newChar = {
      id: `char-${Date.now()}`,
      name: 'New Character',
      x: 200 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      color: characterColors.minor,
      size: 45,
      type: 'minor' as CharacterNode['type'],
      relationships: [],
      isVisible: true,
      isSelected: false
    };

    setNodes(prev => [...prev, newChar]);
    saveToHistory();
  };

  // Delete character
  const deleteSelectedCharacter = () => {
    if (!selectedNode) return;

    setNodes(prev => prev.filter(node => node.id !== selectedNode.id));
    setRelationships(prev => prev.filter(rel => 
      rel.id !== selectedNode.id && rel.targetId !== selectedNode.id
    ));
    setSelectedNode(null);
    saveToHistory();
  };

  // Toggle character visibility
  const toggleCharacterVisibility = (nodeId: string) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, isVisible: !node.isVisible }
        : node
    ));
  };

  // Change view mode
  const changeViewMode = (mode: 'network' | 'family' | 'conflict') => {
    setViewMode(mode);
    
    // Adjust node positions based on view mode
    if (mode === 'family') {
      // Arrange in family tree structure
      const protagonist = nodes.find(n => n.type === 'protagonist');
      if (protagonist) {
        setNodes(prev => prev.map(node => {
          if (node.type === 'family') {
            return { ...node, x: protagonist.x + 100, y: protagonist.y + 100 };
          }
          return node;
        }));
      }
    } else if (mode === 'conflict') {
      // Arrange by conflict relationships
      setNodes(prev => prev.map(node => {
        if (node.type === 'antagonist') {
          return { ...node, x: 100, y: 200 };
        } else if (node.type === 'protagonist') {
          return { ...node, x: 400, y: 200 };
        }
        return node;
      }));
    }
  };

  // Export visualization
  const exportVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'character-relationships.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x, pan.y);

    // Draw relationships
    relationships.forEach(rel => {
      const sourceNode = nodes.find(n => n.id === rel.id.split('-')[0]);
      const targetNode = nodes.find(n => n.id === rel.targetId);
      
      if (!sourceNode || !targetNode || !rel.isVisible) return;

      ctx.strokeStyle = rel.color;
      ctx.lineWidth = rel.strength * 2;
      ctx.setLineDash(rel.type === 'enemy' ? [5, 5] : []);
      
      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      ctx.stroke();

      // Draw relationship label
      if (showRelationshipLabels) {
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(midX - 20, midY - 10, 40, 20);
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(rel.type, midX, midY + 4);
      }
    });

    // Draw nodes
    filteredNodes.forEach(node => {
      // Node circle
      ctx.fillStyle = node.color;
      ctx.strokeStyle = node.isSelected ? '#000000' : '#ffffff';
      ctx.lineWidth = node.isSelected ? 3 : 2;
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size / 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Node label
      if (showLabels) {
        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + node.size / 2 + 20);
      }

      // Character type indicator
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.type.charAt(0).toUpperCase(), node.x, node.y + 4);
    });

    ctx.restore();
  }, [nodes, relationships, zoom, pan, showLabels, showRelationshipLabels, filteredNodes]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold flex items-center">
            <FaProjectDiagram className="mr-2" />
            Character Relationship Visualizer
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'network' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => changeViewMode('network')}
            >
              <FaNetworkWired className="mr-1" />
              Network
            </Button>
            <Button
              variant={viewMode === 'family' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => changeViewMode('family')}
            >
              <FaTree className="mr-1" />
              Family
            </Button>
            <Button
              variant={viewMode === 'conflict' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => changeViewMode('conflict')}
            >
              <FaExclamationTriangle className="mr-1" />
              Conflict
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowControls(!showControls)}
          >
            <FaCog className="mr-1" />
            Controls
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={exportVisualization}
          >
            <FaDownload className="mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Controls Panel */}
      {showControls && (
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search characters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="protagonist">Protagonist</option>
                <option value="antagonist">Antagonist</option>
                <option value="supporting">Supporting</option>
                <option value="minor">Minor</option>
              </select>

              {/* View Options */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={showLabels ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setShowLabels(!showLabels)}
                >
                  <FaEye className="mr-1" />
                  Labels
                </Button>
                <Button
                  variant={showRelationshipLabels ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setShowRelationshipLabels(!showRelationshipLabels)}
                >
                  <FaLink className="mr-1" />
                  Relations
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Undo/Redo */}
              <Button
                variant="secondary"
                size="sm"
                onClick={undo}
                disabled={historyIndex <= 0}
              >
                <FaUndo />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
              >
                <FaRedo />
              </Button>

              {/* Add Character */}
              <Button
                variant="primary"
                size="sm"
                onClick={addNewCharacter}
              >
                <FaPlus className="mr-1" />
                Add Character
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Canvas Area */}
        <div className="flex-1 relative" ref={containerRef}>
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-move"
            onMouseDown={(e) => {
              const rect = canvasRef.current?.getBoundingClientRect();
              if (!rect) return;

              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;

              // Check if clicking on a node
              const clickedNode = filteredNodes.find(node => {
                const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
                return distance <= node.size / 2;
              });

              if (clickedNode) {
                handleMouseDown(e, clickedNode.id);
                setSelectedNode(clickedNode);
                onCharacterSelect?.(clickedNode.id);
              }
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        {/* Side Panel */}
        <div className="w-80 border-l bg-white">
          {selectedNode ? (
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Character Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={selectedNode.name}
                    onChange={(e) => {
                      setSelectedNode({ ...selectedNode, name: e.target.value });
                      setNodes(prev => prev.map(node => 
                        node.id === selectedNode.id 
                          ? { ...node, name: e.target.value }
                          : node
                      ));
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={selectedNode.type}
                    onChange={(e) => {
                      const newType = e.target.value as CharacterNode['type'];
                      setSelectedNode({ ...selectedNode, type: newType, color: characterColors[newType] });
                      setNodes(prev => prev.map(node => 
                        node.id === selectedNode.id 
                          ? { ...node, type: newType, color: characterColors[newType] }
                          : node
                      ));
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="protagonist">Protagonist</option>
                    <option value="antagonist">Antagonist</option>
                    <option value="supporting">Supporting</option>
                    <option value="minor">Minor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Size</label>
                  <input
                    type="range"
                    min="30"
                    max="80"
                    value={selectedNode.size}
                    onChange={(e) => {
                      const newSize = parseInt(e.target.value);
                      setSelectedNode({ ...selectedNode, size: newSize });
                      setNodes(prev => prev.map(node => 
                        node.id === selectedNode.id 
                          ? { ...node, size: newSize }
                          : node
                      ));
                    }}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500">{selectedNode.size}px</div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleCharacterVisibility(selectedNode.id)}
                  >
                    {selectedNode.isVisible ? <FaEye /> : <FaEyeSlash />}
                    {selectedNode.isVisible ? 'Hide' : 'Show'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={deleteSelectedCharacter}
                  >
                    <FaTrash className="mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <FaUser className="mx-auto text-4xl mb-4" />
              <p>Select a character to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
