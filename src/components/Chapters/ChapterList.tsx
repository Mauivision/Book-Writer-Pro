'use client';

import React, { useState } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Chapter } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaBook, 
  FaRocket,
  FaStar,
  FaEye,
  FaChartLine,
  FaMicrophone,
  FaStop
} from 'react-icons/fa';

interface ChapterListProps {
  onChapterSelect?: (chapterId: string) => void;
  onChapterEdit?: (chapterId: string) => void;
}

export default function ChapterList({ onChapterSelect, onChapterEdit }: ChapterListProps) {
  const { chapters, addChapter, removeChapter, updateChapter } = useBookStore();
  const [showNewChapterForm, setShowNewChapterForm] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [buffer, setBuffer] = useState('');
  const recognition = new (window as any).webkitSpeechRecognition();

  const startVoice = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognition.continuous = true;
      recognition.onresult = (e: any) => {
        const transcript = e.results[e.results.length - 1][0].transcript;
        setBuffer((prev) => prev + transcript + '\n');
      };
      recognition.start();
    } catch (e) {
      alert('Mic error!');
    }
  };

  const stopVoice = () => {
    recognition.stop();
  };

  // Initialize with "Lord of the Space Rings" chapters if none exist
  const initializeSpaceOperaChapters = () => {
    const spaceOperaChapters = [
      {
        title: "Chapter 1: The Awakening",
        content: "In the vast expanse of the Andromeda sector, where stars burn with the intensity of ancient gods, Commander Zara Vex awoke to the sound of alarms. The space station Horizon's Edge trembled under the weight of an unknown threat approaching from the void...",
        summary: "Commander Zara Vex discovers an ancient artifact that could change the fate of the galaxy.",
        status: 'draft' as const,
        wordCount: 0,
        order: 0
      },
      {
        title: "Chapter 2: The Ancient Prophecy",
        content: "The artifact pulsed with an otherworldly energy that seemed to whisper secrets of civilizations long forgotten. As Zara's fingers brushed against its crystalline surface, visions flooded her mind - a prophecy of rings that could control the very fabric of space-time...",
        summary: "Zara learns of the legendary Space Rings and their power to reshape reality.",
        status: 'draft' as const,
        wordCount: 0,
        order: 1
      },
      {
        title: "Chapter 3: The Alliance Forms",
        content: "Word of the discovery spread through the galactic network faster than light itself. Representatives from the Terran Federation, the Zephyrian Collective, and the mysterious Void Walkers converged on Horizon's Edge, each with their own agenda for the ancient power...",
        summary: "Different factions unite and clash over control of the Space Rings.",
        status: 'draft' as const,
        wordCount: 0,
        order: 2
      }
    ];

    spaceOperaChapters.forEach(chapter => {
      addChapter(chapter);
    });
  };

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;

    addChapter({
      title: newChapterTitle,
      content: '',
      summary: '',
      wordCount: 0,
      order: chapters.length,
      status: 'draft'
    });
    
    setNewChapterTitle('');
    setShowNewChapterForm(false);
  };

  const handleChapterClick = (chapter: Chapter) => {
    if (onChapterSelect) {
      onChapterSelect(chapter.id);
    }
  };

  const handleEditChapter = (chapter: Chapter) => {
    if (onChapterEdit) {
      onChapterEdit(chapter.id);
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (confirm('Are you sure you want to delete this chapter?')) {
      removeChapter(chapterId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'final': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaRocket className="text-blue-500 text-2xl" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Lord of the Space Rings</h2>
            <p className="text-gray-600">Space Opera Epic - Chapter Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {chapters.length === 0 && (
            <Button
              onClick={initializeSpaceOperaChapters}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <FaStar className="mr-2" />
              Initialize Space Opera
            </Button>
          )}
          
          <Button
            onClick={() => setShowNewChapterForm(!showNewChapterForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FaPlus className="mr-2" />
            Add Chapter
          </Button>

          <button onClick={startVoice} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Start Dictation
          </button>

          <button onClick={stopVoice} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Stop Dictation
          </button>
        </div>
      </div>

      {/* New Chapter Form */}
      {showNewChapterForm && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              placeholder="Enter chapter title..."
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAddChapter()}
            />
            <Button onClick={handleAddChapter} className="bg-green-600 hover:bg-green-700 text-white">
              Add
            </Button>
            <Button 
              onClick={() => setShowNewChapterForm(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Voice Dictation Buffer */}
      <div className="space-y-4">
        <textarea 
          value={buffer} 
          readOnly 
          className="w-full h-32 p-4 border border-gray-300 rounded-md resize-none"
          placeholder="Voice dictation will appear here..."
        />
        {buffer && (
          <div className="flex gap-2">
            <button 
              onClick={() => setBuffer('')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear Buffer
            </button>
            <button
              onClick={() => {
                if (buffer.trim()) {
                  addChapter({
                    title: `Voice Dictated Chapter ${chapters.length + 1}`,
                    content: buffer.trim(),
                    summary: 'Chapter created via voice dictation',
                    wordCount: buffer.trim().split(/\s+/).length,
                    order: chapters.length,
                    status: 'draft'
                  });
                  setBuffer('');
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Chapter from Buffer
            </button>
          </div>
        )}
      </div>

      {/* Chapter List */}
      <div className="space-y-3">
        {chapters.length === 0 ? (
          <Card className="p-8 text-center">
            <FaBook className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Chapters Yet</h3>
            <p className="text-gray-500 mb-4">
              Start your space opera epic by adding your first chapter or initialize with the "Lord of the Space Rings" template.
            </p>
            <Button
              onClick={initializeSpaceOperaChapters}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <FaStar className="mr-2" />
              Start with Space Opera Template
            </Button>
          </Card>
        ) : (
          chapters
            .sort((a, b) => a.order - b.order)
            .map((chapter) => (
              <Card key={chapter.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {chapter.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chapter.status)}`}>
                        {chapter.status}
                      </span>
                    </div>
                    
                    {chapter.summary && (
                      <p className="text-gray-600 text-sm mb-2">{chapter.summary}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaChartLine />
                        {chapter.wordCount} words
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye />
                        {chapter.content ? 'Has content' : 'Empty'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleChapterClick(chapter)}
                      variant="outline"
                      size="sm"
                    >
                      <FaEye className="mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={() => handleEditChapter(chapter)}
                      variant="outline"
                      size="sm"
                    >
                      <FaEdit className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteChapter(chapter.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
        )}
      </div>

      {/* Character Development Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaStar className="text-purple-500" />
          Character Development Notes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Main Characters</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>Commander Zara Vex:</strong> Determined, tactical genius, haunted by past</li>
              <li><strong>Captain Thorne:</strong> Loyal friend, comic relief, expert pilot</li>
              <li><strong>Dr. Lyra Chen:</strong> Brilliant scientist, mysterious past, artifact expert</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Character Quirks & Tells</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>Zara:</strong> Taps fingers when thinking, always checks weapon status</li>
              <li><strong>Thorne:</strong> Whistles when nervous, adjusts his lucky charm</li>
              <li><strong>Lyra:</strong> Pushes glasses up when excited, speaks in technical terms</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}