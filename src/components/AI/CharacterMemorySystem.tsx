'use client';

import { useState, useEffect, useMemo } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FaUser, 
  FaEye, 
  FaEdit, 
  FaPlus, 
  FaSearch,
  FaHeart,
  FaUsers,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimes,
  FaHistory,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPalette,
  FaLightbulb,
  FaArrowRight,
  FaLink,
  FaUnlink
} from 'react-icons/fa';

interface CharacterMemory {
  id: string;
  name: string;
  appearance: CharacterAppearance;
  personality: CharacterPersonality;
  relationships: CharacterRelationship[];
  storyArc: CharacterArc;
  lastSeen: string;
  chapterCount: number;
  wordCount: number;
  consistencyScore: number;
  notes: string;
}

interface CharacterAppearance {
  physical: {
    height: string;
    build: string;
    hair: string;
    eyes: string;
    distinguishing: string[];
    clothing: string[];
  };
  voice: {
    tone: string;
    accent: string;
    speechPatterns: string[];
  };
  mannerisms: string[];
}

interface CharacterPersonality {
  traits: string[];
  motivations: string[];
  fears: string[];
  strengths: string[];
  weaknesses: string[];
  background: string;
  goals: string[];
}

interface CharacterRelationship {
  targetId: string;
  targetName: string;
  type: 'friend' | 'enemy' | 'lover' | 'family' | 'mentor' | 'rival' | 'neutral';
  strength: 'weak' | 'moderate' | 'strong';
  description: string;
  history: string[];
  currentStatus: string;
}

interface CharacterArc {
  introduction: string;
  development: string[];
  conflicts: string[];
  growth: string[];
  resolution: string;
  completeness: number; // 0-100
}

export default function CharacterMemorySystem() {
  const [characters, setCharacters] = useState<CharacterMemory[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [showAddCharacter, setShowAddCharacter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'main' | 'supporting' | 'minor'>('all');
  const [editingCharacter, setEditingCharacter] = useState<string | null>(null);
  
  const { characters: storeCharacters, chapters, addCharacter, updateCharacter, deleteCharacter } = useBookStore();

  useEffect(() => {
    // Convert store characters to enhanced character memory format
    const enhancedCharacters = storeCharacters.map(char => enhanceCharacterWithMemory(char));
    setCharacters(enhancedCharacters);
  }, [storeCharacters, chapters]);

  const enhanceCharacterWithMemory = (character: any): CharacterMemory => {
    // Find all chapters where this character appears
    const appearances = chapters.filter(chapter => 
      chapter.content?.toLowerCase().includes(character.name.toLowerCase())
    );
    
    // Extract character details from content
    const extractedDetails = extractCharacterDetails(character.name, appearances);
    
    // Analyze character consistency
    const consistencyScore = analyzeCharacterConsistency(character.name, appearances);
    
    // Build character arc
    const arc = buildCharacterArc(character.name, appearances);
    
    return {
      id: character.id,
      name: character.name,
      appearance: extractedDetails.appearance,
      personality: extractedDetails.personality,
      relationships: character.relationships || [],
      storyArc: arc,
      lastSeen: appearances.length > 0 ? appearances[appearances.length - 1].lastModified || new Date().toISOString() : new Date().toISOString(),
      chapterCount: appearances.length,
      wordCount: appearances.reduce((sum, ch) => sum + (ch.content?.length || 0), 0),
      consistencyScore,
      notes: character.notes || ''
    };
  };

  const extractCharacterDetails = (characterName: string, chapters: any[]) => {
    const appearance: CharacterAppearance = {
      physical: {
        height: '',
        build: '',
        hair: '',
        eyes: '',
        distinguishing: [],
        clothing: []
      },
      voice: {
        tone: '',
        accent: '',
        speechPatterns: []
      },
      mannerisms: []
    };

    const personality: CharacterPersonality = {
      traits: [],
      motivations: [],
      fears: [],
      strengths: [],
      weaknesses: [],
      background: '',
      goals: []
    };

    // Extract details from chapter content
    chapters.forEach(chapter => {
      const content = chapter.content || '';
      const nameIndex = content.toLowerCase().indexOf(characterName.toLowerCase());
      if (nameIndex !== -1) {
        const context = content.substring(Math.max(0, nameIndex - 200), nameIndex + 200);
        
        // Extract physical descriptions
        const physicalPatterns = [
          { pattern: /(\d+)\s*(?:feet|ft|cm|inches)/gi, field: 'height' },
          { pattern: /(tall|short|average|slim|muscular|stocky|thin|heavy)/gi, field: 'build' },
          { pattern: /(blonde|brown|black|red|gray|white)\s*hair/gi, field: 'hair' },
          { pattern: /(blue|brown|green|hazel|gray)\s*eyes/gi, field: 'eyes' }
        ];

        physicalPatterns.forEach(({ pattern, field }) => {
          const match = context.match(pattern);
          if (match && !appearance.physical[field as keyof typeof appearance.physical]) {
            appearance.physical[field as keyof typeof appearance.physical] = match[0];
          }
        });

        // Extract personality traits
        const traitPatterns = [
          /(brave|confident|shy|outgoing|quiet|talkative|serious|playful)/gi,
          /(loyal|honest|deceitful|kind|cruel|patient|impatient|wise|foolish)/gi
        ];

        traitPatterns.forEach(pattern => {
          const matches = context.match(pattern);
          if (matches) {
            matches.forEach(match => {
              if (!personality.traits.includes(match.toLowerCase())) {
                personality.traits.push(match.toLowerCase());
              }
            });
          }
        });
      }
    });

    return { appearance, personality };
  };

  const analyzeCharacterConsistency = (characterName: string, chapters: any[]): number => {
    if (chapters.length < 2) return 100;

    let consistencyScore = 100;
    const descriptions: string[] = [];

    // Extract character descriptions from each appearance
    chapters.forEach(chapter => {
      const content = chapter.content || '';
      const nameIndex = content.toLowerCase().indexOf(characterName.toLowerCase());
      if (nameIndex !== -1) {
        const context = content.substring(Math.max(0, nameIndex - 100), nameIndex + 100);
        descriptions.push(context);
      }
    });

    // Check for inconsistencies in physical descriptions
    const physicalDetails = extractPhysicalDetails(characterName, descriptions);
    const inconsistencies = findPhysicalInconsistencies(physicalDetails);
    
    // Deduct points for each inconsistency
    consistencyScore -= inconsistencies.length * 10;
    
    return Math.max(0, consistencyScore);
  };

  const extractPhysicalDetails = (characterName: string, descriptions: string[]) => {
    const details: Record<string, string[]> = {};
    
    descriptions.forEach(desc => {
      // Extract height, hair color, eye color, etc.
      const heightMatch = desc.match(/(\d+)\s*(?:feet|ft|cm|inches)/i);
      if (heightMatch) {
        if (!details.height) details.height = [];
        details.height.push(heightMatch[0]);
      }
      
      const hairMatch = desc.match(/(blonde|brown|black|red|gray|white)\s*hair/i);
      if (hairMatch) {
        if (!details.hair) details.hair = [];
        details.hair.push(hairMatch[0]);
      }
      
      const eyeMatch = desc.match(/(blue|brown|green|hazel|gray)\s*eyes/i);
      if (eyeMatch) {
        if (!details.eyes) details.eyes = [];
        details.eyes.push(eyeMatch[0]);
      }
    });
    
    return details;
  };

  const findPhysicalInconsistencies = (details: Record<string, string[]>): string[] => {
    const inconsistencies: string[] = [];
    
    Object.entries(details).forEach(([trait, values]) => {
      if (values.length > 1) {
        const uniqueValues = [...new Set(values)];
        if (uniqueValues.length > 1) {
          inconsistencies.push(`${trait}: ${uniqueValues.join(' vs ')}`);
        }
      }
    });
    
    return inconsistencies;
  };

  const buildCharacterArc = (characterName: string, chapters: any[]): CharacterArc => {
    const arc: CharacterArc = {
      introduction: '',
      development: [],
      conflicts: [],
      growth: [],
      resolution: '',
      completeness: 0
    };

    if (chapters.length === 0) return arc;

    // First appearance is introduction
    const firstChapter = chapters[0];
    arc.introduction = `Introduced in "${firstChapter.title}"`;

    // Middle chapters show development
    if (chapters.length > 2) {
      const middleChapters = chapters.slice(1, -1);
      middleChapters.forEach(chapter => {
        arc.development.push(`Develops in "${chapter.title}"`);
      });
    }

    // Last appearance might be resolution
    if (chapters.length > 1) {
      const lastChapter = chapters[chapters.length - 1];
      arc.resolution = `Last seen in "${lastChapter.title}"`;
    }

    // Calculate completeness based on arc elements
    const totalElements = 5; // intro, development, conflicts, growth, resolution
    const presentElements = [arc.introduction, arc.development.length, arc.conflicts.length, arc.growth.length, arc.resolution].filter(Boolean).length;
    arc.completeness = Math.round((presentElements / totalElements) * 100);

    return arc;
  };

  const filteredCharacters = useMemo(() => {
    let filtered = characters;
    
    if (searchTerm) {
      filtered = filtered.filter(char => 
        char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.appearance.physical.hair.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.appearance.physical.eyes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.personality.traits.some(trait => trait.includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(char => {
        if (filterType === 'main') return char.chapterCount >= 5;
        if (filterType === 'supporting') return char.chapterCount >= 2 && char.chapterCount < 5;
        if (filterType === 'minor') return char.chapterCount === 1;
        return true;
      });
    }
    
    return filtered;
  }, [characters, searchTerm, filterType]);

  const getConsistencyColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getConsistencyLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Needs Work';
    return 'Poor';
  };

  const getRelationshipColor = (type: string) => {
    switch (type) {
      case 'friend': return 'bg-green-100 text-green-800';
      case 'enemy': return 'bg-red-100 text-red-800';
      case 'lover': return 'bg-pink-100 text-pink-800';
      case 'family': return 'bg-blue-100 text-blue-800';
      case 'mentor': return 'bg-purple-100 text-purple-800';
      case 'rival': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
            <FaUser className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Character Memory System</h2>
            <p className="text-gray-600">Track character details, relationships, and consistency across your story</p>
          </div>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowAddCharacter(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
        >
          <FaPlus className="mr-2" />
          Add Character
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search characters by name, traits, or appearance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              All ({characters.length})
            </Button>
            <Button
              variant={filterType === 'main' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterType('main')}
            >
              Main ({characters.filter(c => c.chapterCount >= 5).length})
            </Button>
            <Button
              variant={filterType === 'supporting' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterType('supporting')}
            >
              Supporting ({characters.filter(c => c.chapterCount >= 2 && c.chapterCount < 5).length})
            </Button>
            <Button
              variant={filterType === 'minor' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterType('minor')}
            >
              Minor ({characters.filter(c => c.chapterCount === 1).length})
            </Button>
          </div>
        </div>
      </Card>

      {/* Character Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharacters.map(character => (
          <Card key={character.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedCharacter(character.id)}>
            {/* Character Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{character.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaEye />
                  <span>{character.chapterCount} chapters</span>
                  <FaMapMarkerAlt />
                  <span>Last: {new Date(character.lastSeen).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConsistencyColor(character.consistencyScore)} bg-opacity-10`}>
                {character.consistencyScore}%
              </div>
            </div>

            {/* Physical Description */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaPalette className="text-purple-500" />
                Appearance
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                {character.appearance.physical.hair && (
                  <div>Hair: {character.appearance.physical.hair}</div>
                )}
                {character.appearance.physical.eyes && (
                  <div>Eyes: {character.appearance.physical.eyes}</div>
                )}
                {character.appearance.physical.build && (
                  <div>Build: {character.appearance.physical.build}</div>
                )}
                {character.appearance.physical.distinguishing.length > 0 && (
                  <div>Features: {character.appearance.physical.distinguishing.slice(0, 2).join(', ')}</div>
                )}
              </div>
            </div>

            {/* Personality Traits */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaLightbulb className="text-yellow-500" />
                Traits
              </h4>
              <div className="flex flex-wrap gap-1">
                {character.personality.traits.slice(0, 3).map((trait, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {trait}
                  </span>
                ))}
                {character.personality.traits.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    +{character.personality.traits.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Character Arc */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaArrowRight className="text-blue-500" />
                Story Arc
              </h4>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${character.storyArc.completeness}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {character.storyArc.completeness}% complete
              </div>
            </div>

            {/* Relationships */}
            {character.relationships.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaUsers className="text-green-500" />
                  Relationships
                </h4>
                <div className="space-y-1">
                  {character.relationships.slice(0, 2).map((rel, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-1 rounded-full ${getRelationshipColor(rel.type)}`}>
                        {rel.type}
                      </span>
                      <span className="text-gray-600">{rel.targetName}</span>
                    </div>
                  ))}
                  {character.relationships.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{character.relationships.length - 2} more relationships
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Consistency Warning */}
            {character.consistencyScore < 70 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <FaExclamationTriangle className="text-sm" />
                  <span className="text-sm font-medium">Consistency Issues Detected</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Character details vary across chapters. Review for consistency.
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* No Characters */}
      {filteredCharacters.length === 0 && (
        <Card className="p-12 text-center">
          <FaUser className="text-6xl mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? 'No characters found' : 'No characters yet'}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Add your first character to get started'}
          </p>
        </Card>
      )}

      {/* Character Details Modal */}
      {selectedCharacter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">
                {characters.find(c => c.id === selectedCharacter)?.name}
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedCharacter(null)}
              >
                <FaTimes />
              </Button>
            </div>
            
            {(() => {
              const character = characters.find(c => c.id === selectedCharacter);
              if (!character) return null;
              
              return (
                <div className="space-y-6">
                  {/* Overview Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{character.chapterCount}</div>
                      <div className="text-sm text-gray-600">Chapters</div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{character.wordCount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Words</div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className={`text-2xl font-bold ${getConsistencyColor(character.consistencyScore)}`}>
                        {character.consistencyScore}%
                      </div>
                      <div className="text-sm text-gray-600">Consistency</div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">{character.relationships.length}</div>
                      <div className="text-sm text-gray-600">Relationships</div>
                    </div>
                  </div>

                  {/* Detailed Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Appearance */}
                    <Card className="p-4">
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <FaPalette className="text-purple-500" />
                        Physical Appearance
                      </h4>
                      <div className="space-y-2 text-sm">
                        {Object.entries(character.appearance.physical).map(([key, value]) => {
                          if (Array.isArray(value)) {
                            return value.length > 0 ? (
                              <div key={key}>
                                <span className="font-medium capitalize">{key}:</span> {value.join(', ')}
                              </div>
                            ) : null;
                          }
                          return value ? (
                            <div key={key}>
                              <span className="font-medium capitalize">{key}:</span> {value}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </Card>

                    {/* Personality */}
                    <Card className="p-4">
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <FaLightbulb className="text-yellow-500" />
                        Personality
                      </h4>
                      <div className="space-y-3 text-sm">
                        {character.personality.traits.length > 0 && (
                          <div>
                            <span className="font-medium">Traits:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {character.personality.traits.map((trait, index) => (
                                <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  {trait}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {character.personality.motivations.length > 0 && (
                          <div>
                            <span className="font-medium">Motivations:</span>
                            <div className="mt-1 text-gray-600">{character.personality.motivations.join(', ')}</div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>

                  {/* Story Arc */}
                  <Card className="p-4">
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <FaArrowRight className="text-blue-500" />
                      Character Arc
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">Arc Completeness:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${character.storyArc.completeness}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{character.storyArc.completeness}%</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Introduction:</span>
                          <div className="text-gray-600 mt-1">{character.storyArc.introduction || 'Not specified'}</div>
                        </div>
                        <div>
                          <span className="font-medium">Resolution:</span>
                          <div className="text-gray-600 mt-1">{character.storyArc.resolution || 'Not specified'}</div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Relationships */}
                  {character.relationships.length > 0 && (
                    <Card className="p-4">
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <FaUsers className="text-green-500" />
                        Relationships
                      </h4>
                      <div className="space-y-3">
                        {character.relationships.map((rel, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRelationshipColor(rel.type)}`}>
                                {rel.type}
                              </span>
                              <span className="font-medium">{rel.targetName}</span>
                              <span className="text-sm text-gray-500 capitalize">({rel.strength})</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{rel.description}</p>
                            <div className="text-xs text-gray-500">
                              Current: {rel.currentStatus}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Notes */}
                  {character.notes && (
                    <Card className="p-4">
                      <h4 className="text-lg font-semibold mb-3">Notes</h4>
                      <p className="text-gray-700">{character.notes}</p>
                    </Card>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
