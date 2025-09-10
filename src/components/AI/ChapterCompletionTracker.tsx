'use client';

import { useState, useEffect } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FaBook, 
  FaCheckCircle, 
  FaEdit, 
  FaEye, 
  FaClock, 
  FaChartLine,
  FaPlay,
  FaPause,
  FaStop,
  FaPlus,
  FaTrash,
  FaSave,
  FaUndo,
  FaRedo,
  FaHistory,
  FaCalendarAlt,
  FaUser,
  FaBullseye,
  FaTrophy,
  FaTimes
} from 'react-icons/fa';

interface ChapterStatus {
  id: string;
  title: string;
  status: 'draft' | 'in-progress' | 'completed' | 'reviewed';
  wordCount: number;
  targetWordCount: number;
  lastModified: string;
  estimatedReadingTime: number;
  completionPercentage: number;
  qualityScore: number;
  notes: string;
}

export default function ChapterCompletionTracker() {
  const [chapters, setChapters] = useState<ChapterStatus[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterTarget, setNewChapterTarget] = useState(2000);
  
  const { chapters: storeChapters, addChapter, updateChapter, deleteChapter } = useBookStore();

  useEffect(() => {
    // Convert store chapters to local format
    const formattedChapters = storeChapters.map(chapter => ({
      id: chapter.id,
      title: chapter.title,
      status: chapter.status || 'draft',
      wordCount: chapter.content?.length || 0,
      targetWordCount: chapter.targetWordCount || 2000,
      lastModified: chapter.lastModified || new Date().toISOString(),
      estimatedReadingTime: Math.ceil((chapter.content?.length || 0) / 200), // 200 words per minute
      completionPercentage: Math.min(100, Math.round(((chapter.content?.length || 0) / (chapter.targetWordCount || 2000)) * 100)),
      qualityScore: calculateQualityScore(chapter),
      notes: chapter.notes || ''
    }));
    
    setChapters(formattedChapters);
  }, [storeChapters]);

  const calculateQualityScore = (chapter: any): number => {
    let score = 0;
    
    // Base score for completion
    if (chapter.status === 'completed') score += 40;
    else if (chapter.status === 'in-progress') score += 25;
    else if (chapter.status === 'reviewed') score += 35;
    else score += 10;
    
    // Word count bonus
    const wordCount = chapter.content?.length || 0;
    const target = chapter.targetWordCount || 2000;
    if (wordCount >= target) score += 30;
    else if (wordCount >= target * 0.8) score += 20;
    else if (wordCount >= target * 0.5) score += 15;
    else if (wordCount >= target * 0.2) score += 10;
    
    // Content quality indicators
    if (chapter.content && chapter.content.length > 100) score += 20;
    if (chapter.notes && chapter.notes.length > 0) score += 10;
    
    return Math.min(100, score);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'reviewed': return 'bg-blue-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'reviewed': return 'Reviewed';
      case 'in-progress': return 'In Progress';
      case 'draft': return 'Draft';
      default: return 'Unknown';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Needs Work';
    return 'Poor';
  };

  const handleStatusChange = (chapterId: string, newStatus: ChapterStatus['status']) => {
    const updatedChapters = chapters.map(chapter => 
      chapter.id === chapterId 
        ? { ...chapter, status: newStatus }
        : chapter
    );
    setChapters(updatedChapters);
    
    // Update store
    updateChapter(chapterId, { status: newStatus });
  };

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;
    
    const newChapter: ChapterStatus = {
      id: `chapter-${Date.now()}`,
      title: newChapterTitle,
      status: 'draft',
      wordCount: 0,
      targetWordCount: newChapterTarget,
      lastModified: new Date().toISOString(),
      estimatedReadingTime: 0,
      completionPercentage: 0,
      qualityScore: 10,
      notes: ''
    };
    
    setChapters([...chapters, newChapter]);
    
    // Add to store
    addChapter({
      id: newChapter.id,
      title: newChapter.title,
      content: '',
      status: 'draft',
      targetWordCount: newChapterTarget,
      lastModified: new Date().toISOString(),
      notes: ''
    });
    
    setNewChapterTitle('');
    setNewChapterTarget(2000);
    setShowAddChapter(false);
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (confirm('Are you sure you want to delete this chapter?')) {
      setChapters(chapters.filter(c => c.id !== chapterId));
      deleteChapter(chapterId);
    }
  };

  const totalWords = chapters.reduce((sum, c) => sum + c.wordCount, 0);
  const totalTarget = chapters.reduce((sum, c) => sum + c.targetWordCount, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalWords / totalTarget) * 100) : 0;
  const completedChapters = chapters.filter(c => c.status === 'completed').length;
  const averageQuality = chapters.length > 0 ? Math.round(chapters.reduce((sum, c) => sum + c.qualityScore, 0) / chapters.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
            <FaBook className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Chapter Completion Tracker</h2>
            <p className="text-gray-600">Track progress and completion status of all chapters</p>
          </div>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowAddChapter(true)}
          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
        >
          <FaPlus className="mr-2" />
          Add Chapter
        </Button>
      </div>

      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {chapters.length}
          </div>
          <div className="text-sm text-gray-600">Total Chapters</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {completedChapters}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {overallProgress}%
          </div>
          <div className="text-sm text-gray-600">Overall Progress</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className={`text-2xl font-bold ${getQualityColor(averageQuality)}`}>
            {averageQuality}
          </div>
          <div className="text-sm text-gray-600">Avg Quality Score</div>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Overall Book Progress</h3>
          <span className="text-sm text-gray-600">
            {totalWords.toLocaleString()} / {totalTarget.toLocaleString()} words
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </Card>

      {/* Chapter List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Chapter Status</h3>
        
        <div className="space-y-3">
          {chapters.map(chapter => (
            <div key={chapter.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              {/* Status Indicator */}
              <div className={`w-4 h-4 rounded-full ${getStatusColor(chapter.status)}`}></div>
              
              {/* Chapter Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    chapter.status === 'completed' ? 'bg-green-100 text-green-800' :
                    chapter.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                    chapter.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getStatusText(chapter.status)}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${chapter.completionPercentage}%` }}
                  ></div>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{chapter.wordCount.toLocaleString()} / {chapter.targetWordCount.toLocaleString()} words</span>
                  <span>{chapter.completionPercentage}% complete</span>
                  <span>~{chapter.estimatedReadingTime} min read</span>
                  <span className={`font-medium ${getQualityColor(chapter.qualityScore)}`}>
                    Quality: {getQualityLabel(chapter.qualityScore)}
                  </span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedChapter(chapter.id)}
                >
                  <FaEye className="text-sm" />
                </Button>
                
                <select
                  value={chapter.status}
                  onChange={(e) => handleStatusChange(chapter.id, e.target.value as any)}
                  className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="reviewed">Reviewed</option>
                </select>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingChapter(chapter.id)}
                >
                  <FaEdit className="text-sm" />
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDeleteChapter(chapter.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <FaTrash className="text-sm" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {chapters.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FaBook className="text-4xl mx-auto mb-2 text-gray-300" />
            <p>No chapters yet</p>
            <p className="text-sm">Add your first chapter to get started</p>
          </div>
        )}
      </Card>

      {/* Add Chapter Modal */}
      {showAddChapter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Chapter</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter chapter title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Word Count
                </label>
                <input
                  type="number"
                  value={newChapterTarget}
                  onChange={(e) => setNewChapterTarget(parseInt(e.target.value) || 2000)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="500"
                  max="10000"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowAddChapter(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddChapter}
                className="flex-1"
                disabled={!newChapterTitle.trim()}
              >
                Add Chapter
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Details Modal */}
      {selectedChapter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {chapters.find(c => c.id === selectedChapter)?.title}
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedChapter(null)}
              >
                <FaTimes />
              </Button>
            </div>
            
            {(() => {
              const chapter = chapters.find(c => c.id === selectedChapter);
              if (!chapter) return null;
              
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Status</div>
                      <div className="font-medium">{getStatusText(chapter.status)}</div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Word Count</div>
                      <div className="font-medium">{chapter.wordCount.toLocaleString()}</div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Target</div>
                      <div className="font-medium">{chapter.targetWordCount.toLocaleString()}</div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Quality Score</div>
                      <div className={`font-medium ${getQualityColor(chapter.qualityScore)}`}>
                        {chapter.qualityScore} - {getQualityLabel(chapter.qualityScore)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Notes</div>
                    <div className="text-sm">
                      {chapter.notes || 'No notes added yet'}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Last Modified</div>
                    <div className="text-sm">
                      {new Date(chapter.lastModified).toLocaleDateString()}
                    </div>
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
