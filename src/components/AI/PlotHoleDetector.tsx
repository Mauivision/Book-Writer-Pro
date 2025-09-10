'use client';

import { useState, useEffect, useMemo } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FaSearch, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaTimes,
  FaEye,
  FaEdit,
  FaLightbulb,
  FaBug,
  FaShieldAlt,
  FaArrowRight,
  FaClock,
  FaUser,
  FaMapMarkerAlt,
  FaBook,
  FaChartLine,
  FaFilter,
  FaSort,
  FaInfoCircle,
  FaQuestionCircle,
  FaExclamationCircle
} from 'react-icons/fa';

interface PlotHole {
  id: string;
  type: 'character' | 'timeline' | 'logic' | 'worldbuilding' | 'plot' | 'continuity';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  evidence: string[];
  suggestions: string[];
  affectedChapters: string[];
  confidence: number;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  createdAt: string;
  resolvedAt?: string;
  notes?: string;
}

interface StoryElement {
  id: string;
  type: 'character' | 'location' | 'event' | 'object' | 'rule';
  name: string;
  description: string;
  firstMentioned: string;
  lastMentioned: string;
  consistency: number;
  issues: string[];
}

export default function PlotHoleDetector() {
  const [plotHoles, setPlotHoles] = useState<PlotHole[]>([]);
  const [storyElements, setStoryElements] = useState<StoryElement[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPlotHole, setSelectedPlotHole] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'investigating' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'severity' | 'date' | 'confidence'>('severity');
  
  const { chapters, characters, metadata } = useBookStore();

  useEffect(() => {
    // Initialize with sample plot holes for demonstration
    initializeSampleData();
  }, []);

  const initializeSampleData = () => {
    const samplePlotHoles: PlotHole[] = [
      {
        id: '1',
        type: 'character',
        severity: 'high',
        title: 'Character Appearance Inconsistency',
        description: 'Sarah is described as having blue eyes in Chapter 1 but brown eyes in Chapter 5',
        evidence: [
          'Chapter 1: "Sarah\'s piercing blue eyes met his gaze"',
          'Chapter 5: "Her brown eyes widened in surprise"'
        ],
        suggestions: [
          'Standardize Sarah\'s eye color throughout the story',
          'Add a reason for the change (contact lenses, magic, etc.)',
          'Remove one of the conflicting descriptions'
        ],
        affectedChapters: ['Chapter 1', 'Chapter 5'],
        confidence: 0.95,
        status: 'open',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        type: 'timeline',
        severity: 'critical',
        title: 'Impossible Timeline Sequence',
        description: 'Events occur in an impossible sequence - character dies in Chapter 3 but appears in Chapter 7',
        evidence: [
          'Chapter 3: "John took his last breath and closed his eyes forever"',
          'Chapter 7: "John walked into the room, surprising everyone"'
        ],
        suggestions: [
          'Remove the death scene if John needs to survive',
          'Add a resurrection or clone explanation',
          'Change the character name in one of the scenes'
        ],
        affectedChapters: ['Chapter 3', 'Chapter 7'],
        confidence: 0.99,
        status: 'open',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        type: 'logic',
        severity: 'medium',
        title: 'Unrealistic Character Behavior',
        description: 'Character acts completely out of character without explanation',
        evidence: [
          'Chapter 2: "Emma was always cautious and never took risks"',
          'Chapter 4: "Emma jumped off the cliff without hesitation"'
        ],
        suggestions: [
          'Add character development to explain the change',
          'Show internal conflict or external pressure',
          'Make the behavior consistent with established personality'
        ],
        affectedChapters: ['Chapter 2', 'Chapter 4'],
        confidence: 0.85,
        status: 'investigating',
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        type: 'worldbuilding',
        severity: 'low',
        title: 'Magic System Inconsistency',
        description: 'Magic rules seem to change between chapters',
        evidence: [
          'Chapter 1: "Magic required a full moon to work"',
          'Chapter 6: "She cast the spell in broad daylight"'
        ],
        suggestions: [
          'Establish consistent magic rules',
          'Add exceptions or special circumstances',
          'Create a magic system guide'
        ],
        affectedChapters: ['Chapter 1', 'Chapter 6'],
        confidence: 0.75,
        status: 'open',
        createdAt: new Date().toISOString()
      }
    ];

    setPlotHoles(samplePlotHoles);
  };

  const runPlotAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate analysis time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Run various analysis functions
      const characterHoles = analyzeCharacterConsistency();
      const timelineHoles = analyzeTimelineConsistency();
      const logicHoles = analyzeLogicalConsistency();
      const worldbuildingHoles = analyzeWorldbuildingConsistency();
      
      // Combine all findings
      const newPlotHoles = [
        ...characterHoles,
        ...timelineHoles,
        ...logicHoles,
        ...worldbuildingHoles
      ];
      
      setPlotHoles(prev => [...prev, ...newPlotHoles]);
      
    } catch (error) {
      console.error('Plot analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeCharacterConsistency = (): PlotHole[] => {
    const holes: PlotHole[] = [];
    
    characters.forEach(character => {
      const appearances = chapters.filter(chapter => 
        chapter.content?.toLowerCase().includes(character.name.toLowerCase())
      );
      
      if (appearances.length > 1) {
        // Check for physical description inconsistencies
        const physicalDetails = extractPhysicalDetails(character.name, appearances);
        const inconsistencies = findPhysicalInconsistencies(physicalDetails);
        
        inconsistencies.forEach(inconsistency => {
          holes.push({
            id: `char-${character.id}-${Date.now()}`,
            type: 'character',
            severity: 'medium',
            title: `Character "${character.name}" has inconsistent ${inconsistency.trait}`,
            description: `${inconsistency.trait} changes from "${inconsistency.existing}" to "${inconsistency.new}"`,
            evidence: [
              `Chapter ${inconsistency.chapter1}: "${inconsistency.existing}"`,
              `Chapter ${inconsistency.chapter2}: "${inconsistency.new}"`
            ],
            suggestions: [
              `Standardize ${inconsistency.trait} description`,
              'Add explanation for the change',
              'Remove conflicting description'
            ],
            affectedChapters: [inconsistency.chapter1, inconsistency.chapter2],
            confidence: 0.9,
            status: 'open',
            createdAt: new Date().toISOString()
          });
        });
      }
    });
    
    return holes;
  };

  const extractPhysicalDetails = (characterName: string, chapters: any[]) => {
    const details: Record<string, Array<{ value: string; chapter: string }>> = {};
    
    chapters.forEach(chapter => {
      const content = chapter.content || '';
      const nameIndex = content.toLowerCase().indexOf(characterName.toLowerCase());
      
      if (nameIndex !== -1) {
        const context = content.substring(Math.max(0, nameIndex - 100), nameIndex + 100);
        
        // Extract various physical traits
        const patterns = [
          { pattern: /(\d+)\s*(?:feet|ft|cm|inches)/gi, field: 'height' },
          { pattern: /(blonde|brown|black|red|gray|white)\s*hair/gi, field: 'hair' },
          { pattern: /(blue|brown|green|hazel|gray)\s*eyes/gi, field: 'eyes' },
          { pattern: /(tall|short|average|slim|muscular|stocky|thin|heavy)/gi, field: 'build' }
        ];
        
        patterns.forEach(({ pattern, field }) => {
          const match = context.match(pattern);
          if (match) {
            if (!details[field]) details[field] = [];
            details[field].push({ value: match[0], chapter: chapter.title || 'Unknown' });
          }
        });
      }
    });
    
    return details;
  };

  const findPhysicalInconsistencies = (details: Record<string, Array<{ value: string; chapter: string }>>) => {
    const inconsistencies: Array<{
      trait: string;
      existing: string;
      new: string;
      chapter1: string;
      chapter2: string;
    }> = [];
    
    Object.entries(details).forEach(([trait, values]) => {
      if (values.length > 1) {
        const uniqueValues = [...new Set(values.map(v => v.value))];
        if (uniqueValues.length > 1) {
          const first = values.find(v => v.value === uniqueValues[0]);
          const second = values.find(v => v.value === uniqueValues[1]);
          
          if (first && second) {
            inconsistencies.push({
              trait,
              existing: first.value,
              new: second.value,
              chapter1: first.chapter,
              chapter2: second.chapter
            });
          }
        }
      }
    });
    
    return inconsistencies;
  };

  const analyzeTimelineConsistency = (): PlotHole[] => {
    const holes: PlotHole[] = [];
    
    // Look for time-related inconsistencies
    const timeMarkers = extractAllTimeMarkers();
    const timelineIssues = findTimelineIssues(timeMarkers);
    
    timelineIssues.forEach(issue => {
      holes.push({
        id: `timeline-${Date.now()}-${Math.random()}`,
        type: 'timeline',
        severity: issue.severity,
        title: issue.title,
        description: issue.description,
        evidence: issue.evidence,
        suggestions: issue.suggestions,
        affectedChapters: issue.chapters,
        confidence: issue.confidence,
        status: 'open',
        createdAt: new Date().toISOString()
      });
    });
    
    return holes;
  };

  const extractAllTimeMarkers = () => {
    const markers: Array<{
      marker: string;
      chapter: string;
      position: number;
      type: 'past' | 'present' | 'future' | 'relative';
    }> = [];
    
    chapters.forEach(chapter => {
      const content = chapter.content || '';
      
      // Look for various time patterns
      const patterns = [
        { pattern: /(\d+)\s+(hours?|days?|weeks?|months?|years?)\s+(ago|earlier|later)/gi, type: 'relative' as const },
        { pattern: /(yesterday|today|tomorrow|morning|afternoon|evening|night)/gi, type: 'relative' as const },
        { pattern: /(last|next)\s+(week|month|year|day)/gi, type: 'relative' as const },
        { pattern: /(flashback|memory|remember|recall)/gi, type: 'past' as const },
        { pattern: /(meanwhile|simultaneously|at\s+the\s+same\s+time)/gi, type: 'present' as const }
      ];
      
      patterns.forEach(({ pattern, type }) => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            markers.push({
              marker: match,
              chapter: chapter.title || 'Unknown',
              position: content.indexOf(match),
              type
            });
          });
        }
      });
    });
    
    return markers;
  };

  const findTimelineIssues = (markers: Array<{
    marker: string;
    chapter: string;
    position: number;
    type: 'past' | 'present' | 'future' | 'relative';
  }>) => {
    const issues: Array<{
      title: string;
      description: string;
      evidence: string[];
      suggestions: string[];
      chapters: string[];
      severity: 'critical' | 'high' | 'medium' | 'low';
      confidence: number;
    }> = [];
    
    // Check for impossible time sequences
    const relativeMarkers = markers.filter(m => m.type === 'relative');
    
    // Look for "2 hours ago" followed by "1 hour ago" in wrong order
    for (let i = 0; i < relativeMarkers.length; i++) {
      for (let j = i + 1; j < relativeMarkers.length; j++) {
        const first = relativeMarkers[i];
        const second = relativeMarkers[j];
        
        if (first.chapter !== second.chapter) {
          const firstTime = extractTimeValue(first.marker);
          const secondTime = extractTimeValue(second.marker);
          
          if (firstTime && secondTime) {
            // Check if time sequence is impossible
            if (firstTime.unit === secondTime.unit && 
                firstTime.value < secondTime.value && 
                firstTime.direction === 'ago' && 
                secondTime.direction === 'ago') {
              
              issues.push({
                title: 'Impossible Time Sequence',
                description: `Time references suggest impossible sequence: "${first.marker}" followed by "${second.marker}"`,
                evidence: [
                  `${first.chapter}: "${first.marker}"`,
                  `${second.chapter}: "${second.marker}"`
                ],
                suggestions: [
                  'Adjust time references to be consistent',
                  'Add scene transitions to clarify time passage',
                  'Review chapter order and timeline'
                ],
                chapters: [first.chapter, second.chapter],
                severity: 'high',
                confidence: 0.9
              });
            }
          }
        }
      }
    }
    
    return issues;
  };

  const extractTimeValue = (marker: string) => {
    const match = marker.match(/(\d+)\s+(hours?|days?|weeks?|months?|years?)\s+(ago|earlier|later)/i);
    if (match) {
      return {
        value: parseInt(match[1]),
        unit: match[2],
        direction: match[3] as 'ago' | 'earlier' | 'later'
      };
    }
    return null;
  };

  const analyzeLogicalConsistency = (): PlotHole[] => {
    const holes: PlotHole[] = [];
    
    // Check for character behavior inconsistencies
    characters.forEach(character => {
      const appearances = chapters.filter(chapter => 
        chapter.content?.toLowerCase().includes(character.name.toLowerCase())
      );
      
      if (appearances.length > 1) {
        // Analyze character behavior patterns
        const behaviorPatterns = extractBehaviorPatterns(character.name, appearances);
        const inconsistencies = findBehaviorInconsistencies(behaviorPatterns);
        
        inconsistencies.forEach(inconsistency => {
          holes.push({
            id: `logic-${character.id}-${Date.now()}`,
            type: 'logic',
            severity: 'medium',
            title: `Character "${character.name}" acts inconsistently`,
            description: inconsistency.description,
            evidence: inconsistency.evidence,
            suggestions: [
              'Add character development to explain the change',
              'Show internal conflict or external pressure',
              'Make behavior consistent with established personality'
            ],
            affectedChapters: inconsistency.chapters,
            confidence: 0.8,
            status: 'open',
            createdAt: new Date().toISOString()
          });
        });
      }
    });
    
    return holes;
  };

  const extractBehaviorPatterns = (characterName: string, chapters: any[]) => {
    const patterns: Array<{
      behavior: string;
      chapter: string;
      context: string;
    }> = [];
    
    chapters.forEach(chapter => {
      const content = chapter.content || '';
      const nameIndex = content.toLowerCase().indexOf(characterName.toLowerCase());
      
      if (nameIndex !== -1) {
        const context = content.substring(Math.max(0, nameIndex - 150), nameIndex + 150);
        
        // Look for behavioral descriptions
        const behaviorPatterns = [
          /(brave|confident|shy|outgoing|quiet|talkative|serious|playful)/gi,
          /(loyal|honest|deceitful|kind|cruel|patient|impatient|wise|foolish)/gi,
          /(cautious|reckless|careful|careless|organized|disorganized)/gi
        ];
        
        behaviorPatterns.forEach(pattern => {
          const matches = context.match(pattern);
          if (matches) {
            matches.forEach(match => {
              patterns.push({
                behavior: match.toLowerCase(),
                chapter: chapter.title || 'Unknown',
                context: context.substring(0, 100) + '...'
              });
            });
          }
        });
      }
    });
    
    return patterns;
  };

  const findBehaviorInconsistencies = (patterns: Array<{
    behavior: string;
    chapter: string;
    context: string;
  }>) => {
    const inconsistencies: Array<{
      description: string;
      evidence: string[];
      chapters: string[];
    }> = [];
    
    // Look for contradictory behaviors
    const behaviorGroups = patterns.reduce((acc, pattern) => {
      if (!acc[pattern.behavior]) acc[pattern.behavior] = [];
      acc[pattern.behavior].push(pattern);
      return acc;
    }, {} as Record<string, typeof patterns>);
    
    // Check for opposites
    const opposites = {
      'brave': 'shy',
      'confident': 'shy',
      'loyal': 'deceitful',
      'honest': 'deceitful',
      'kind': 'cruel',
      'patient': 'impatient',
      'cautious': 'reckless',
      'careful': 'careless'
    };
    
    Object.entries(behaviorGroups).forEach(([behavior, instances]) => {
      const opposite = opposites[behavior as keyof typeof opposites];
      if (opposite && behaviorGroups[opposite]) {
        const oppositeInstances = behaviorGroups[opposite];
        
        if (instances.length > 0 && oppositeInstances.length > 0) {
          inconsistencies.push({
            description: `Character shows both "${behavior}" and "${opposite}" traits`,
            evidence: [
              `${instances[0].chapter}: "${behavior}" behavior`,
              `${oppositeInstances[0].chapter}: "${opposite}" behavior`
            ],
            chapters: [instances[0].chapter, oppositeInstances[0].chapter]
          });
        }
      }
    });
    
    return inconsistencies;
  };

  const analyzeWorldbuildingConsistency = (): PlotHole[] => {
    const holes: PlotHole[] = [];
    
    // Check for magic system, technology, or world rule inconsistencies
    const worldRules = extractWorldRules();
    const inconsistencies = findWorldbuildingInconsistencies(worldRules);
    
    inconsistencies.forEach(inconsistency => {
      holes.push({
        id: `world-${Date.now()}-${Math.random()}`,
        type: 'worldbuilding',
        severity: 'medium',
        title: `Worldbuilding rule inconsistency: ${inconsistency.rule}`,
        description: inconsistency.description,
        evidence: inconsistency.evidence,
        suggestions: [
          'Establish consistent world rules',
          'Add exceptions or special circumstances',
          'Create a worldbuilding guide'
        ],
        affectedChapters: inconsistency.chapters,
        confidence: 0.7,
        status: 'open',
        createdAt: new Date().toISOString()
      });
    });
    
    return holes;
  };

  const extractWorldRules = () => {
    const rules: Array<{
      rule: string;
      chapter: string;
      context: string;
    }> = [];
    
    chapters.forEach(chapter => {
      const content = chapter.content || '';
      
      // Look for worldbuilding statements
      const rulePatterns = [
        /(magic|technology|law|rule|system)\s+(requires?|needs?|must|can\s+only|works?\s+only)/gi,
        /(always|never|impossible|can\s+not|cannot)/gi,
        /(only|just|merely|simply)/gi
      ];
      
      rulePatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            const context = content.substring(Math.max(0, content.indexOf(match) - 50), content.indexOf(match) + 100);
            rules.push({
              rule: match,
              chapter: chapter.title || 'Unknown',
              context: context + '...'
            });
          });
        }
      });
    });
    
    return rules;
  };

  const findWorldbuildingInconsistencies = (rules: Array<{
    rule: string;
    chapter: string;
    context: string;
  }>) => {
    const inconsistencies: Array<{
      rule: string;
      description: string;
      evidence: string[];
      chapters: string[];
    }> = [];
    
    // Group rules by topic
    const ruleGroups = rules.reduce((acc, rule) => {
      const topic = rule.rule.toLowerCase().split(' ')[0]; // First word as topic
      if (!acc[topic]) acc[topic] = [];
      acc[topic].push(rule);
      return acc;
    }, {} as Record<string, typeof rules>);
    
    // Check for contradictory rules
    Object.entries(ruleGroups).forEach(([topic, topicRules]) => {
      if (topicRules.length > 1) {
        // Look for contradictions
        const contradictions = findContradictions(topicRules);
        contradictions.forEach(contradiction => {
          inconsistencies.push(contradiction);
        });
      }
    });
    
    return inconsistencies;
  };

  const findContradictions = (rules: Array<{
    rule: string;
    chapter: string;
    context: string;
  }>) => {
    const contradictions: Array<{
      rule: string;
      description: string;
      evidence: string[];
      chapters: string[];
    }> = [];
    
    // Simple contradiction detection
    for (let i = 0; i < rules.length; i++) {
      for (let j = i + 1; j < rules.length; j++) {
        const rule1 = rules[i];
        const rule2 = rules[j];
        
        // Check for obvious contradictions
        if (rule1.rule.toLowerCase().includes('always') && rule2.rule.toLowerCase().includes('never')) {
          contradictions.push({
            rule: rule1.rule.split(' ')[0],
            description: `Contradictory rules: "${rule1.rule}" vs "${rule2.rule}"`,
            evidence: [
              `${rule1.chapter}: "${rule1.rule}"`,
              `${rule2.chapter}: "${rule2.rule}"`
            ],
            chapters: [rule1.chapter, rule2.chapter]
          });
        }
      }
    }
    
    return contradictions;
  };

  const updatePlotHoleStatus = (id: string, status: PlotHole['status']) => {
    setPlotHoles(prev => prev.map(hole => 
      hole.id === id 
        ? { 
            ...hole, 
            status, 
            resolvedAt: status === 'resolved' ? new Date().toISOString() : undefined 
          }
        : hole
    ));
  };

  const filteredPlotHoles = useMemo(() => {
    let filtered = plotHoles;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(hole => hole.severity === filterType);
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(hole => hole.status === filterStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(hole => 
        hole.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hole.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hole.affectedChapters.some(chapter => chapter.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Sort by selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'severity':
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'confidence':
          return b.confidence - a.confidence;
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [plotHoles, filterType, filterStatus, searchTerm, sortBy]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'false_positive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'character': return <FaUser className="text-green-500" />;
      case 'timeline': return <FaClock className="text-blue-500" />;
      case 'logic': return <FaExclamationTriangle className="text-orange-500" />;
      case 'worldbuilding': return <FaShieldAlt className="text-purple-500" />;
      case 'plot': return <FaBook className="text-indigo-500" />;
      case 'continuity': return <FaChartLine className="text-teal-500" />;
      default: return <FaBug className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg">
            <FaBug className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Plot Hole Detector</h2>
            <p className="text-gray-600">Find and fix story inconsistencies, plot holes, and logical errors</p>
          </div>
        </div>
        
        <Button
          variant="primary"
          onClick={runPlotAnalysis}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <FaSearch className="mr-2" />
              Run Analysis
            </>
          )}
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search plot holes by title, description, or affected chapters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="severity">Sort by Severity</option>
              <option value="date">Sort by Date</option>
              <option value="confidence">Sort by Confidence</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {plotHoles.filter(h => h.severity === 'critical').length}
          </div>
          <div className="text-sm text-gray-600">Critical Issues</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {plotHoles.filter(h => h.severity === 'high').length}
          </div>
          <div className="text-sm text-gray-600">High Priority</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {plotHoles.filter(h => h.status === 'open').length}
          </div>
          <div className="text-sm text-gray-600">Open Issues</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {plotHoles.filter(h => h.status === 'resolved').length}
          </div>
          <div className="text-sm text-gray-600">Resolved</div>
        </Card>
      </div>

      {/* Plot Holes List */}
      <div className="space-y-4">
        {filteredPlotHoles.map(plotHole => (
          <Card key={plotHole.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedPlotHole(plotHole.id)}>
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-2">
                {getTypeIcon(plotHole.type)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(plotHole.severity)}`}>
                  {plotHole.severity}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plotHole.status)}`}>
                  {plotHole.status}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{plotHole.title}</h3>
                <p className="text-gray-600 mb-3">{plotHole.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Confidence: {Math.round(plotHole.confidence * 100)}%</span>
                  <span>Chapters: {plotHole.affectedChapters.join(', ')}</span>
                  <span>Created: {new Date(plotHole.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-2">
                  {plotHole.evidence.length} evidence items
                </div>
                <div className="text-sm text-gray-500">
                  {plotHole.suggestions.length} suggestions
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* No Plot Holes */}
      {filteredPlotHoles.length === 0 && (
        <Card className="p-12 text-center">
          <FaCheckCircle className="text-6xl mx-auto mb-4 text-green-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? 'No plot holes found' : 'No plot holes detected'}
          </h3>
          <p className="text-gray-500">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Your story appears to be consistent! Run analysis to check for new issues.'
            }
          </p>
        </Card>
      )}

      {/* Plot Hole Details Modal */}
      {selectedPlotHole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">
                {plotHoles.find(h => h.id === selectedPlotHole)?.title}
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedPlotHole(null)}
              >
                <FaTimes />
              </Button>
            </div>
            
            {(() => {
              const plotHole = plotHoles.find(h => h.id === selectedPlotHole);
              if (!plotHole) return null;
              
              return (
                <div className="space-y-6">
                  {/* Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className={`text-2xl font-bold ${getSeverityColor(plotHole.severity).split(' ')[0]} ${getSeverityColor(plotHole.severity).split(' ')[1]}`}>
                        {plotHole.severity}
                      </div>
                      <div className="text-sm text-gray-600">Severity</div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{plotHole.affectedChapters.length}</div>
                      <div className="text-sm text-gray-600">Chapters</div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{Math.round(plotHole.confidence * 100)}%</div>
                      <div className="text-sm text-gray-600">Confidence</div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className={`text-2xl font-bold ${getStatusColor(plotHole.status).split(' ')[0]} ${getStatusColor(plotHole.status).split(' ')[1]}`}>
                        {plotHole.status}
                      </div>
                      <div className="text-sm text-gray-600">Status</div>
                    </div>
                  </div>

                  {/* Description */}
                  <Card className="p-4">
                    <h4 className="text-lg font-semibold mb-3">Description</h4>
                    <p className="text-gray-700">{plotHole.description}</p>
                  </Card>

                  {/* Evidence */}
                  <Card className="p-4">
                    <h4 className="text-lg font-semibold mb-3">Evidence</h4>
                    <div className="space-y-3">
                      {plotHole.evidence.map((evidence, index) => (
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="text-sm text-red-800">{evidence}</div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Suggestions */}
                  <Card className="p-4">
                    <h4 className="text-lg font-semibold mb-3">Suggested Fixes</h4>
                    <div className="space-y-3">
                      {plotHole.suggestions.map((suggestion, index) => (
                        <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="text-sm text-green-800">{suggestion}</div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Affected Chapters */}
                  <Card className="p-4">
                    <h4 className="text-lg font-semibold mb-3">Affected Chapters</h4>
                    <div className="flex flex-wrap gap-2">
                      {plotHole.affectedChapters.map((chapter, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {chapter}
                        </span>
                      ))}
                    </div>
                  </Card>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => updatePlotHoleStatus(plotHole.id, 'investigating')}
                      disabled={plotHole.status === 'investigating'}
                    >
                      Mark as Investigating
                    </Button>
                    
                    <Button
                      variant="primary"
                      onClick={() => updatePlotHoleStatus(plotHole.id, 'resolved')}
                      disabled={plotHole.status === 'resolved'}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark as Resolved
                    </Button>
                    
                    <Button
                      variant="secondary"
                      onClick={() => updatePlotHoleStatus(plotHole.id, 'false_positive')}
                      disabled={plotHole.status === 'false_positive'}
                      className="bg-gray-600 hover:bg-gray-700"
                    >
                      Mark as False Positive
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
