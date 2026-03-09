'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FaRobot, 
  FaLightbulb, 
  FaBook, 
  FaUsers, 
  FaMap, 
  FaMicrophone, 
  FaSave, 
  FaDownload, 
  FaChartLine,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaMagic,
  FaEdit,
  FaSearch,
  FaQuestionCircle
} from 'react-icons/fa';

interface WritingAssistantProps {
  currentChapter?: string;
  wordCount?: number;
  onSuggestion?: (suggestion: string) => void;
}

interface Suggestion {
  id: string;
  type: 'feature' | 'tip' | 'tool' | 'inspiration';
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
  category: string;
}

const WritingAssistant: React.FC<WritingAssistantProps> = ({ 
  currentChapter, 
  wordCount = 0, 
  onSuggestion 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(null);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions: Suggestion[] = [
    {
      id: 'voice-dictation',
      type: 'feature',
      title: '🎤 Voice Dictation',
      description: 'Speak your story directly into the chapter. Perfect for getting ideas down quickly!',
      action: 'Click "Start Voice" to begin speaking',
      icon: <FaMicrophone />,
      category: 'Writing Tools'
    },
    {
      id: 'ai-generation',
      type: 'tool',
      title: '🤖 AI Book Generator',
      description: 'Generate entire books with AI. Choose from Science Fiction, Fantasy, Mystery, or Romance templates.',
      action: 'Switch to "AI Generator" tab',
      icon: <FaRobot />,
      category: 'AI Features'
    },
    {
      id: 'character-development',
      type: 'tip',
      title: '👥 Character Development',
      description: 'Create rich, three-dimensional characters with AI-generated profiles and backstories.',
      action: 'Use AI Generator to create character profiles',
      icon: <FaUsers />,
      category: 'Story Building'
    },
    {
      id: 'plot-structure',
      type: 'tip',
      title: '📖 Plot Structure',
      description: 'Build compelling story arcs with AI-suggested plot points and story beats.',
      action: 'Define plot points in AI Generator',
      icon: <FaMap />,
      category: 'Story Building'
    },
    {
      id: 'auto-save',
      type: 'feature',
      title: '💾 Auto-Save',
      description: 'Your work is automatically saved every 2 seconds. Never lose your progress!',
      action: 'Keep writing - saving happens automatically',
      icon: <FaSave />,
      category: 'Writing Tools'
    },
    {
      id: 'export-options',
      type: 'tool',
      title: '📄 Export Options',
      description: 'Export your book as TXT or Markdown files. Perfect for sharing or further editing.',
      action: 'Click "Save Book" or "Export Markdown"',
      icon: <FaDownload />,
      category: 'Publishing'
    },
    {
      id: 'word-tracking',
      type: 'feature',
      title: '📊 Word Tracking',
      description: 'Track your writing progress with real-time word counts for each chapter and total.',
      action: 'Check the word count display',
      icon: <FaChartLine />,
      category: 'Analytics'
    },
    {
      id: 'writing-inspiration',
      type: 'inspiration',
      title: '✨ Writing Inspiration',
      description: 'Stuck? Try switching between voice dictation and typing, or use AI to generate new ideas.',
      action: 'Try a different writing method',
      icon: <FaLightbulb />,
      category: 'Creativity'
    },
    {
      id: 'chapter-organization',
      type: 'tip',
      title: '📚 Chapter Organization',
      description: 'Add multiple chapters to organize your story. Each chapter can be edited independently.',
      action: 'Click "Add Chapter" to create new sections',
      icon: <FaBook />,
      category: 'Organization'
    },
    {
      id: 'ai-editing',
      type: 'tool',
      title: '✏️ AI Editing Assistant',
      description: 'Get AI suggestions for improving your writing, fixing grammar, and enhancing style.',
      action: 'Use AI Generator for writing improvements',
      icon: <FaEdit />,
      category: 'AI Features'
    }
  ];

  const getContextualSuggestions = (): Suggestion[] => {
    if (wordCount === 0) {
      return suggestions.filter(s => 
        ['voice-dictation', 'ai-generation', 'writing-inspiration'].includes(s.id)
      );
    } else if (wordCount < 500) {
      return suggestions.filter(s => 
        ['character-development', 'plot-structure', 'chapter-organization'].includes(s.id)
      );
    } else {
      return suggestions.filter(s => 
        ['export-options', 'ai-editing', 'word-tracking'].includes(s.id)
      );
    }
  };

  const contextualSuggestions = getContextualSuggestions();

  useEffect(() => {
    if (contextualSuggestions.length > 0) {
      setCurrentSuggestion(contextualSuggestions[suggestionIndex]);
    }
  }, [suggestionIndex, wordCount]);

  useEffect(() => {
    if (isOpen && currentSuggestion) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentSuggestion, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSuggestion]);

  const nextSuggestion = () => {
    setSuggestionIndex((prev) => (prev + 1) % contextualSuggestions.length);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (onSuggestion) {
      onSuggestion(suggestion.action);
    }
  };

  const getGreeting = () => {
    if (wordCount === 0) {
      return "👋 Hi! I'm your AI writing assistant. Ready to start your book?";
    } else if (wordCount < 500) {
      return "📝 Great start! I can help you develop your story further.";
    } else {
      return "🚀 Excellent progress! Let me suggest some tools to enhance your writing.";
    }
  };

  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          backgroundColor: '#8b4513',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.backgroundColor = '#a0522d';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = '#8b4513';
        }}
      >
        <FaRobot size={24} color="white" />
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: isMinimized ? '300px' : '400px',
        height: isMinimized ? '60px' : '500px',
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        border: '2px solid #8b4513',
        zIndex: 1000,
        transition: 'all 0.3s ease',
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
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaRobot size={20} />
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
            AI Writing Assistant
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isMinimized ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
          <FaTimes 
            size={16} 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>

      {!isMinimized && (
        <div style={{ height: 'calc(100% - 60px)', display: 'flex', flexDirection: 'column' }}>
          {/* Chat Area */}
          <div
            style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              backgroundColor: '#f9f9f9'
            }}
          >
            {/* Greeting */}
            <div
              style={{
                backgroundColor: '#e8f4fd',
                padding: '15px',
                borderRadius: '10px',
                marginBottom: '15px',
                border: '1px solid #b3d9ff'
              }}
            >
              <p style={{ margin: 0, color: '#2c5aa0', fontSize: '14px' }}>
                {getGreeting()}
              </p>
            </div>

            {/* Current Suggestion */}
            {currentSuggestion && (
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '2px solid #8b4513',
                  marginBottom: '15px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ color: '#8b4513' }}>{currentSuggestion.icon}</span>
                  <h4 style={{ margin: 0, color: '#8b4513', fontSize: '16px' }}>
                    {currentSuggestion.title}
                  </h4>
                </div>
                
                <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                  {currentSuggestion.description}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#8b4513', 
                    backgroundColor: '#f0f0f0',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    {currentSuggestion.category}
                  </span>
                </div>
              </div>
            )}

            {/* Action Button */}
            {currentSuggestion && (
              <button
                onClick={() => handleSuggestionClick(currentSuggestion)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#8b4513',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#a0522d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#8b4513';
                }}
              >
                {currentSuggestion.action}
              </button>
            )}

            {/* Navigation */}
            {contextualSuggestions.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button
                  onClick={nextSuggestion}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f0f0f0',
                    color: '#8b4513',
                    border: '1px solid #8b4513',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Next Suggestion ({suggestionIndex + 1}/{contextualSuggestions.length})
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
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
              💡 I adapt my suggestions based on your writing progress
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingAssistant;
