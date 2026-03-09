'use client';

import React, { useState } from 'react';
import { 
  FaMicrophone, 
  FaRobot, 
  FaBook, 
  FaUsers, 
  FaMap, 
  FaSave, 
  FaDownload, 
  FaChartLine,
  FaLightbulb,
  FaEdit,
  FaSearch,
  FaTimes,
  FaKeyboard,
  FaFileAlt,
  FaMagic
} from 'react-icons/fa';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  shortcut?: string;
  status: 'available' | 'premium' | 'coming-soon';
}

const ToolsReference: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const tools: Tool[] = [
    {
      id: 'voice-dictation',
      name: 'Voice Dictation',
      description: 'Speak your story directly into chapters with real-time transcription',
      icon: <FaMicrophone />,
      category: 'Writing',
      shortcut: 'Ctrl + V',
      status: 'available'
    },
    {
      id: 'ai-generation',
      name: 'AI Book Generator',
      description: 'Generate entire books with AI using genre templates and custom settings',
      icon: <FaRobot />,
      category: 'AI',
      shortcut: 'Tab: AI Generator',
      status: 'available'
    },
    {
      id: 'auto-save',
      name: 'Auto-Save',
      description: 'Automatic saving every 2 seconds - never lose your work',
      icon: <FaSave />,
      category: 'Writing',
      status: 'available'
    },
    {
      id: 'chapter-management',
      name: 'Chapter Management',
      description: 'Add, edit, delete, and organize chapters with drag-and-drop',
      icon: <FaBook />,
      category: 'Organization',
      shortcut: 'Add Chapter button',
      status: 'available'
    },
    {
      id: 'character-development',
      name: 'Character Development',
      description: 'AI-generated character profiles and relationship mapping',
      icon: <FaUsers />,
      category: 'AI',
      status: 'available'
    },
    {
      id: 'plot-structure',
      name: 'Plot Structure',
      description: 'AI-suggested plot points and story arc development',
      icon: <FaMap />,
      category: 'AI',
      status: 'available'
    },
    {
      id: 'export-options',
      name: 'Export Options',
      description: 'Export as TXT, Markdown, or JSON formats',
      icon: <FaDownload />,
      category: 'Publishing',
      shortcut: 'Save Book button',
      status: 'available'
    },
    {
      id: 'word-tracking',
      name: 'Word Tracking',
      description: 'Real-time word count for chapters and total progress',
      icon: <FaChartLine />,
      category: 'Analytics',
      status: 'available'
    },
    {
      id: 'writing-prompts',
      name: 'Writing Prompts',
      description: 'AI-generated prompts and inspiration for different genres',
      icon: <FaLightbulb />,
      category: 'AI',
      status: 'available'
    },
    {
      id: 'ai-editing',
      name: 'AI Editing Assistant',
      description: 'Get AI suggestions for improving grammar, style, and flow',
      icon: <FaEdit />,
      category: 'AI',
      status: 'available'
    },
    {
      id: 'search-function',
      name: 'Search & Find',
      description: 'Search through your entire book for specific words or phrases',
      icon: <FaSearch />,
      category: 'Organization',
      shortcut: 'Ctrl + F',
      status: 'coming-soon'
    },
    {
      id: 'collaborative-writing',
      name: 'Collaborative Writing',
      description: 'Multiple authors working on the same book simultaneously',
      icon: <FaUsers />,
      category: 'Collaboration',
      status: 'coming-soon'
    }
  ];

  const categories = ['all', ...Array.from(new Set(tools.map(tool => tool.category)))];

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#4caf50';
      case 'premium': return '#ff9800';
      case 'coming-soon': return '#9e9e9e';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'premium': return 'Premium';
      case 'coming-soon': return 'Coming Soon';
      default: return '';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '10px 15px',
          backgroundColor: '#8b4513',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <FaKeyboard />
        Tools Reference
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '500px',
        maxHeight: '80vh',
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        border: '2px solid #8b4513',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#8b4513',
          color: 'white',
          padding: '15px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <h3 style={{ margin: 0, fontSize: '18px' }}>
          🛠️ Writing Tools Reference
        </h3>
        <FaTimes 
          size={20} 
          onClick={() => setIsOpen(false)}
          style={{ cursor: 'pointer' }}
        />
      </div>

      {/* Category Filter */}
      <div style={{ padding: '15px 20px', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '6px 12px',
                backgroundColor: selectedCategory === category ? '#8b4513' : '#f0f0f0',
                color: selectedCategory === category ? 'white' : '#8b4513',
                border: '1px solid #8b4513',
                borderRadius: '15px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Tools List */}
      <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px' }}>
        {filteredTools.map(tool => (
          <div
            key={tool.id}
            style={{
              padding: '15px',
              border: '1px solid #eee',
              borderRadius: '8px',
              marginBottom: '10px',
              backgroundColor: '#fafafa'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ color: '#8b4513', fontSize: '16px' }}>
                {tool.icon}
              </span>
              <h4 style={{ margin: 0, fontSize: '16px', color: '#8b4513' }}>
                {tool.name}
              </h4>
              <span
                style={{
                  fontSize: '10px',
                  backgroundColor: getStatusColor(tool.status),
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  marginLeft: 'auto'
                }}
              >
                {getStatusText(tool.status)}
              </span>
            </div>
            
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
              {tool.description}
            </p>
            
            {tool.shortcut && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaKeyboard size={12} color="#8b4513" />
                <span style={{ fontSize: '12px', color: '#8b4513', fontFamily: 'monospace' }}>
                  {tool.shortcut}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '15px 20px',
          backgroundColor: '#f0f0f0',
          borderTop: '1px solid #ddd',
          textAlign: 'center'
        }}
      >
        <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
          💡 Click the AI Assistant (🤖) for personalized suggestions
        </p>
      </div>
    </div>
  );
};

export default ToolsReference;
