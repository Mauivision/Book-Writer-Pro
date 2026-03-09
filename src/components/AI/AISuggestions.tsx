'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';

interface AISuggestion {
  id: string;
  text: string;
  type: 'grammar' | 'style' | 'plot' | 'character' | 'world-building';
  start: number;
  end: number;
  confidence: number;
  explanation?: string;
}

interface AISuggestionsProps {
  editor: Editor | null;
  content: string;
  onSuggestionApply: (suggestion: AISuggestion, replacement: string) => void;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({
  editor,
  content,
  onSuggestionApply
}) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const analysisTimeoutRef = useRef<NodeJS.Timeout>();

  // Mock AI analysis - in real implementation this would connect to actual AI
  const analyzeText = async (text: string): Promise<AISuggestion[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI processing

    const mockSuggestions: AISuggestion[] = [];

    // Grammar suggestions
    if (text.includes('teh')) {
      const index = text.indexOf('teh');
      mockSuggestions.push({
        id: `grammar-${Date.now()}`,
        text: 'teh',
        type: 'grammar',
        start: index,
        end: index + 3,
        confidence: 0.95,
        explanation: 'Common typo: "teh" should be "the"'
      });
    }

    // Style suggestions
    if (text.length > 1000 && text.split('.').length < 5) {
      mockSuggestions.push({
        id: `style-${Date.now()}`,
        text: 'Long paragraph detected',
        type: 'style',
        start: 0,
        end: 50,
        confidence: 0.8,
        explanation: 'Consider breaking up long paragraphs for better readability'
      });
    }

    // Character consistency
    if (text.includes('Zara') && text.includes('Sarah')) {
      mockSuggestions.push({
        id: `character-${Date.now()}`,
        text: 'Character name consistency',
        type: 'character',
        start: text.indexOf('Zara'),
        end: text.indexOf('Zara') + 4,
        confidence: 0.7,
        explanation: 'Ensure consistent character naming throughout your story'
      });
    }

    // Plot suggestions
    if (text.includes('suddenly') || text.includes('unexpectedly')) {
      const index = text.indexOf('suddenly') || text.indexOf('unexpectedly');
      mockSuggestions.push({
        id: `plot-${Date.now()}`,
        text: 'Show, don\'t tell',
        type: 'plot',
        start: Math.max(0, index - 20),
        end: index + 20,
        confidence: 0.6,
        explanation: 'Instead of telling the reader something happened "suddenly," try showing it through action and description'
      });
    }

    // World-building suggestions
    if (text.includes('alien') || text.includes('spaceship')) {
      mockSuggestions.push({
        id: `world-building-${Date.now()}`,
        text: 'World-building opportunity',
        type: 'world-building',
        start: 0,
        end: 100,
        confidence: 0.75,
        explanation: 'Consider adding more sensory details about this sci-fi element to immerse readers'
      });
    }

    return mockSuggestions;
  };

  // Analyze text when it changes
  useEffect(() => {
    if (!content || content.length < 50) {
      setSuggestions([]);
      return;
    }

    setIsAnalyzing(true);

    // Debounce analysis
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }

    analysisTimeoutRef.current = setTimeout(async () => {
      try {
        const newSuggestions = await analyzeText(content);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Error analyzing text:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 2000);

    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, [content]);

  const handleSuggestionClick = (suggestion: AISuggestion) => {
    setSelectedSuggestion(suggestion.id);
    // In a real implementation, this would highlight the text in the editor
    if (editor) {
      editor.commands.setTextSelection({
        from: suggestion.start,
        to: suggestion.end
      });
    }
  };

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    const currentText = content;
    let replacement = '';

    switch (suggestion.type) {
      case 'grammar':
        if (suggestion.text === 'teh') {
          replacement = 'the';
        }
        break;
      case 'style':
        // For style suggestions, provide a better alternative
        replacement = currentText.substring(suggestion.start, suggestion.end).replace(/\s+/g, ' ');
        break;
      default:
        replacement = currentText.substring(suggestion.start, suggestion.end);
    }

    onSuggestionApply(suggestion, replacement);

    // Remove the applied suggestion
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    setSelectedSuggestion(null);
  };

  const getSuggestionIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'grammar': return '📝';
      case 'style': return '✨';
      case 'plot': return '📖';
      case 'character': return '👤';
      case 'world-building': return '🌍';
      default: return '💡';
    }
  };

  const getSuggestionColor = (type: AISuggestion['type']) => {
    switch (type) {
      case 'grammar': return '#ef4444';
      case 'style': return '#3b82f6';
      case 'plot': return '#8b5cf6';
      case 'character': return '#f59e0b';
      case 'world-building': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (suggestions.length === 0 && !isAnalyzing) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '350px',
      maxHeight: '400px',
      backgroundColor: '#ffffff',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🤖</span>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            AI Suggestions
          </span>
          {isAnalyzing && (
            <div style={{
              width: '12px',
              height: '12px',
              border: '2px solid #3b82f6',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          )}
        </div>
        <span style={{
          fontSize: '12px',
          color: '#6b7280'
        }}>
          {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Suggestions List */}
      <div style={{
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        {isAnalyzing ? (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #3b82f6',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 10px'
            }} />
            Analyzing your text...
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f1f5f9',
                cursor: 'pointer',
                backgroundColor: selectedSuggestion === suggestion.id ? '#f0f9ff' : 'transparent',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = selectedSuggestion === suggestion.id ? '#f0f9ff' : 'transparent';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                marginBottom: '4px'
              }}>
                <span style={{ fontSize: '16px' }}>
                  {getSuggestionIcon(suggestion.type)}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1f2937',
                    marginBottom: '2px'
                  }}>
                    {suggestion.text}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '4px'
                  }}>
                    {suggestion.explanation}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      padding: '2px 6px',
                      backgroundColor: getSuggestionColor(suggestion.type),
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500'
                    }}>
                      {suggestion.type.replace('-', ' ')}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color: '#9ca3af'
                    }}>
                      {Math.round(suggestion.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplySuggestion(suggestion);
                  }}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 16px',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        fontSize: '12px',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        Click on suggestions to highlight text • Click "Apply" to use the suggestion
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AISuggestions;
