'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Chapter } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  FaBook, 
  FaFolder, 
  FaFileAlt, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaEyeSlash,
  FaChevronRight,
  FaChevronDown,
  FaSearch,
  FaCog,
  FaBrain,
  FaLightbulb,
  FaChartLine,
  FaUsers,
  FaMap,
  FaRocket,
  FaMicrophone,
  FaStop,
  FaSave,
  FaUndo,
  FaRedo,
  FaExpand,
  FaCompress,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';

interface ScrivenerLayoutProps {
  children?: React.ReactNode;
}

interface BinderItem {
  id: string;
  title: string;
  type: 'folder' | 'chapter' | 'character' | 'research' | 'note';
  children?: BinderItem[];
  content?: string;
  isExpanded?: boolean;
  isSelected?: boolean;
}

export default function ScrivenerLayout({ children }: ScrivenerLayoutProps) {
  const { chapters, addChapter, removeChapter, updateChapter, metadata } = useBookStore();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const [aiPanelWidth, setAiPanelWidth] = useState(350);
  const [isAiResizing, setIsAiResizing] = useState(false);
  const [currentContent, setCurrentContent] = useState('');
  const [buffer, setBuffer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const recognition = useRef<any>(null);
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Create binder structure
  const binderItems: BinderItem[] = [
    {
      id: 'manuscript',
      title: 'Manuscript',
      type: 'folder',
      isExpanded: true,
      children: chapters.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        type: 'chapter' as const,
        content: chapter.content
      }))
    },
    {
      id: 'characters',
      title: 'Characters',
      type: 'folder',
      isExpanded: false,
      children: [
        { id: 'char1', title: 'Commander Zara Vex', type: 'character' },
        { id: 'char2', title: 'Captain Thorne', type: 'character' },
        { id: 'char3', title: 'Dr. Lyra Chen', type: 'character' }
      ]
    },
    {
      id: 'research',
      title: 'Research',
      type: 'folder',
      isExpanded: false,
      children: [
        { id: 'research1', title: 'Space Technology', type: 'research' },
        { id: 'research2', title: 'Galactic Politics', type: 'research' },
        { id: 'research3', title: 'Ancient Artifacts', type: 'research' }
      ]
    },
    {
      id: 'notes',
      title: 'Notes',
      type: 'folder',
      isExpanded: false,
      children: [
        { id: 'note1', title: 'Plot Ideas', type: 'note' },
        { id: 'note2', title: 'World Building', type: 'note' },
        { id: 'note3', title: 'Dialogue Notes', type: 'note' }
      ]
    }
  ];

  const [binder, setBinder] = useState<BinderItem[]>(binderItems);

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      recognition.current = new (window as any).webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setBuffer(prev => prev + transcript + ' ');
      };
      recognition.current.onstart = () => setIsListening(true);
      recognition.current.onend = () => setIsListening(false);
    }
  }, []);

  const startVoice = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognition.current?.start();
    } catch (e) {
      alert('Microphone access denied');
    }
  };

  const stopVoice = () => {
    recognition.current?.stop();
  };

  const handleItemClick = (item: BinderItem) => {
    setSelectedItem(item.id);
    if (item.content) {
      setCurrentContent(item.content);
    }
  };

  const toggleFolder = (itemId: string) => {
    setBinder(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, isExpanded: !item.isExpanded }
        : item
    ));
  };

  const addNewChapter = () => {
    const newChapter = {
      title: `Chapter ${chapters.length + 1}`,
      content: '',
      summary: '',
      wordCount: 0,
      order: chapters.length,
      status: 'draft' as const
    };
    addChapter(newChapter);
  };

  const saveContent = async () => {
    if (selectedItem) {
      const chapter = chapters.find(c => c.id === selectedItem);
      if (chapter) {
        setIsAutoSaving(true);
        updateChapter(selectedItem, { content: currentContent });
        setLastSaved(new Date());
        setTimeout(() => setIsAutoSaving(false), 1000);
      }
    }
  };

  const autoSave = () => {
    if (autoSaveTimeout.current) {
      clearTimeout(autoSaveTimeout.current);
    }
    autoSaveTimeout.current = setTimeout(() => {
      saveContent();
    }, 2000); // Auto-save after 2 seconds of inactivity
  };

  const handleContentChange = (newContent: string) => {
    setCurrentContent(newContent);
    autoSave();
  };

  const renderBinderItem = (item: BinderItem, depth = 0) => {
    const isSelected = selectedItem === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isFolder = item.type === 'folder';

    return (
      <div key={item.id} className="select-none">
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 ${
            isSelected ? 'bg-blue-100 border-r-2 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => isFolder ? toggleFolder(item.id) : handleItemClick(item)}
        >
          {isFolder && (
            <span className="mr-1 text-gray-500">
              {item.isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
            </span>
          )}
          
          <span className="mr-2 text-gray-600">
            {item.type === 'folder' && <FaFolder size={14} />}
            {item.type === 'chapter' && <FaFileAlt size={14} />}
            {item.type === 'character' && <FaUsers size={14} />}
            {item.type === 'research' && <FaBook size={14} />}
            {item.type === 'note' && <FaEdit size={14} />}
          </span>
          
          <span className={`text-sm ${isSelected ? 'font-semibold' : ''}`}>
            {item.title}
          </span>
        </div>
        
        {isFolder && item.isExpanded && item.children && (
          <div>
            {item.children.map(child => renderBinderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Binder */}
      <div 
        className="bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Binder</h2>
            <Button
              onClick={addNewChapter}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FaPlus size={12} />
            </Button>
          </div>
          
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search binder..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {binder.map(item => renderBinderItem(item))}
          
          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
            <div className="space-y-1">
              <Button
                onClick={addNewChapter}
                className="w-full justify-start text-sm"
                variant="outline"
                size="sm"
              >
                <FaPlus className="mr-2" size={12} />
                New Chapter
              </Button>
              <Button
                className="w-full justify-start text-sm"
                variant="outline"
                size="sm"
              >
                <FaUsers className="mr-2" size={12} />
                New Character
              </Button>
              <Button
                className="w-full justify-start text-sm"
                variant="outline"
                size="sm"
              >
                <FaBook className="mr-2" size={12} />
                New Research
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize flex-shrink-0"
        onMouseDown={() => setIsResizing(true)}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedItem && (
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {binder.find(item => 
                    item.children?.find(child => child.id === selectedItem)
                  )?.children?.find(child => child.id === selectedItem)?.title || 
                  binder.find(item => item.id === selectedItem)?.title}
                </h2>
                <span className="text-sm text-gray-500">
                  {binder.find(item => 
                    item.children?.find(child => child.id === selectedItem)
                  )?.children?.find(child => child.id === selectedItem)?.type || 
                  binder.find(item => item.id === selectedItem)?.type}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Button
                onClick={saveContent}
                variant="outline"
                size="sm"
              >
                <FaSave className="mr-1" />
                Save
              </Button>
            
              <Button
                variant="outline"
                size="sm"
              >
                <FaUndo className="mr-1" />
                Undo
              </Button>
              
              <Button
                variant="outline"
                size="sm"
              >
                <FaRedo className="mr-1" />
                Redo
              </Button>
            
              <div className="w-px h-6 bg-gray-300 mx-2" />
              
              <Button
                onClick={startVoice}
                disabled={isListening}
                className={`${isListening ? 'bg-red-600' : 'bg-green-600'} hover:bg-green-700 text-white`}
                size="sm"
              >
                <FaMicrophone className="mr-1" />
                {isListening ? 'Listening...' : 'Dictate'}
              </Button>
              
              {isListening && (
                <Button
                  onClick={stopVoice}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                >
                  <FaStop className="mr-1" />
                  Stop
                </Button>
              )}
            </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {currentContent.split(/\s+/).filter(word => word.length > 0).length} words
            </span>
            
            {isAutoSaving && (
              <span className="text-sm text-blue-600 flex items-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                Saving...
              </span>
            )}
            
            {lastSaved && !isAutoSaving && (
              <span className="text-sm text-green-600">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            
            <Button
              onClick={() => setShowAI(!showAI)}
              variant="outline"
              size="sm"
            >
              <FaBrain className="mr-1" />
              AI Assistant
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 flex">
          <div className="flex-1 p-6">
            {selectedItem ? (
              <div className="h-full">
                <textarea
                  value={currentContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Start writing your story..."
                  className="w-full h-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 leading-relaxed"
                  style={{ fontFamily: 'Georgia, serif', fontSize: '16px', lineHeight: '1.6' }}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FaFileAlt size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Select a document to start writing</h3>
                  <p className="text-sm">Choose a chapter, character, or note from the binder to begin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant Panel */}
      {showAI && (
        <>
          <div
            className="w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize flex-shrink-0"
            onMouseDown={() => setIsAiResizing(true)}
          />
          
          <div 
            className="bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto"
            style={{ width: `${aiPanelWidth}px` }}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">AI Assistant</h3>
                <Button
                  onClick={() => setShowAI(false)}
                  variant="outline"
                  size="sm"
                >
                  <FaTimes size={12} />
                </Button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Voice Dictation Buffer */}
              <Card className="p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <FaMicrophone className="mr-2 text-green-600" />
                  Voice Dictation
                </h4>
                <textarea
                  value={buffer}
                  readOnly
                  className="w-full h-24 p-2 text-sm border border-gray-300 rounded resize-none"
                  placeholder="Voice dictation will appear here..."
                />
                {buffer && (
                  <div className="mt-2 flex gap-2">
                    <Button
                      onClick={() => {
                        setCurrentContent(prev => prev + buffer);
                        setBuffer('');
                      }}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Insert
                    </Button>
                    <Button
                      onClick={() => setBuffer('')}
                      size="sm"
                      variant="outline"
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </Card>

              {/* AI Writing Tools */}
              <Card className="p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <FaBrain className="mr-2 text-purple-600" />
                  Writing Tools
                </h4>
                <div className="space-y-2">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    size="sm"
                  >
                    <FaLightbulb className="mr-2" />
                    Generate Ideas
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    size="sm"
                  >
                    <FaUsers className="mr-2" />
                    Character Development
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    size="sm"
                  >
                    <FaMap className="mr-2" />
                    Plot Structure
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    size="sm"
                  >
                    <FaChartLine className="mr-2" />
                    Writing Analytics
                  </Button>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <FaRocket className="mr-2 text-blue-600" />
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    size="sm"
                  >
                    <FaEdit className="mr-2" />
                    Improve Writing
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    size="sm"
                  >
                    <FaBook className="mr-2" />
                    Research Assistant
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    size="sm"
                  >
                    <FaSearch className="mr-2" />
                    Find Plot Holes
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
