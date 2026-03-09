'use client';

import React, { useState, useEffect, useRef } from 'react';

interface WritingPrompt {
  id: string;
  title: string;
  description: string;
  type: 'creative' | 'descriptive' | 'dialogue' | 'action' | 'character' | 'plot' | 'setting';
  context: string;
  prompt: string;
  examples?: string[];
}

interface ContextualPromptsProps {
  currentText: string;
  currentChapter: number;
  totalChapters: number;
  storyContext?: {
    genre: string;
    characters: string[];
    setting: string;
    plotPoints: string[];
  };
  onPromptSelect: (prompt: string) => void;
  onPromptInsert: (text: string) => void;
}

const ContextualPrompts: React.FC<ContextualPromptsProps> = ({
  currentText,
  currentChapter,
  totalChapters,
  storyContext,
  onPromptSelect,
  onPromptInsert
}) => {
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Analyze text context and generate relevant prompts
  const analyzeContext = async (text: string, context: any): Promise<WritingPrompt[]> => {
    const newPrompts: WritingPrompt[] = [];

    // Analyze text for patterns and generate contextual prompts
    const wordCount = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    // Context-aware prompts based on current text analysis
    if (wordCount < 100) {
      newPrompts.push({
        id: 'start-writing',
        title: 'Getting Started',
        description: 'Help establish the scene and introduce key elements',
        type: 'creative',
        context: 'Beginning of chapter',
        prompt: 'Set the scene and introduce the main character or conflict. Consider: Where are we? What time is it? Who is involved? What is the immediate situation?',
        examples: [
          'The first light of dawn filtered through the ancient trees...',
          'Dr. Sarah Chen stared at the anomaly readings on her screen...',
          'In the bustling heart of Neo Tokyo, Detective Reyes...'
        ]
      });
    }

    // Check for dialogue opportunities
    const dialogueCount = (text.match(/["""'][\s\S]*?["""']/g) || []).length;
    if (dialogueCount === 0 && wordCount > 200) {
      newPrompts.push({
        id: 'add-dialogue',
        title: 'Add Dialogue',
        description: 'Break up narrative with character conversation',
        type: 'dialogue',
        context: 'Character interaction needed',
        prompt: 'Have characters talk to reveal personality, advance plot, or show relationships. Consider what they would naturally discuss in this situation.',
        examples: [
          '"What are we going to do about this?" she whispered.',
          '"I never thought it would come to this," he admitted.',
          '"Trust me," the captain said. "I know what I\'m doing."'
        ]
      });
    }

    // Check for descriptive opportunities
    const descriptiveWords = ['red', 'blue', 'dark', 'bright', 'cold', 'hot', 'loud', 'quiet', 'smell', 'sound', 'feel', 'look'];
    const hasDescriptive = descriptiveWords.some(word => text.toLowerCase().includes(word));

    if (!hasDescriptive && wordCount > 150) {
      newPrompts.push({
        id: 'add-description',
        title: 'Add Sensory Details',
        description: 'Enhance immersion with sights, sounds, smells, and feelings',
        type: 'descriptive',
        context: 'Sensory details missing',
        prompt: 'Help readers experience the scene through all five senses. What can be seen, heard, smelled, tasted, or felt?',
        examples: [
          'The metallic tang of blood filled the air...',
          'Sunlight streamed through the dusty windows, illuminating...',
          'Her fingers trembled against the cold steel railing...'
        ]
      });
    }

    // Action sequence prompts
    const actionWords = ['run', 'fight', 'jump', 'grab', 'push', 'pull', 'throw', 'catch', 'dodge', 'attack'];
    const hasAction = actionWords.some(word => text.toLowerCase().includes(word));

    if (!hasAction && wordCount > 300 && currentChapter > 1) {
      newPrompts.push({
        id: 'add-action',
        title: 'Build Tension',
        description: 'Add physical action to increase pacing and excitement',
        type: 'action',
        context: 'Scene needs more dynamic movement',
        prompt: 'Create physical action that reveals character emotions, advances the plot, or builds suspense. Make it immediate and visceral.',
        examples: [
          'She lunged forward, grabbing the control panel...',
          'His fist connected with the emergency release lever...',
          'They bolted down the corridor, alarms blaring behind them...'
        ]
      });
    }

    // Character development prompts
    if (wordCount > 400 && context?.characters && context.characters.length > 0) {
      newPrompts.push({
        id: 'character-moment',
        title: 'Character Moment',
        description: 'Show character growth, internal conflict, or relationships',
        type: 'character',
        context: 'Opportunity for character development',
        prompt: `Reveal something about ${context.characters[0]}'s inner world, backstory, or relationships. What are they thinking or feeling right now?`,
        examples: [
          'For the first time, she allowed herself to consider the possibility...',
          'He remembered the promise he made to his sister...',
          'The weight of leadership pressed down on her shoulders...'
        ]
      });
    }

    // Plot advancement prompts
    if (currentChapter < totalChapters && wordCount > 500) {
      newPrompts.push({
        id: 'advance-plot',
        title: 'Advance the Plot',
        description: 'Introduce new information, complications, or turning points',
        type: 'plot',
        context: 'Story needs forward momentum',
        prompt: 'Introduce a complication, reveal new information, or create a turning point. What changes the situation or raises the stakes?',
        examples: [
          'But then the security system activated...',
          'The message changed everything they thought they knew...',
          'An unexpected ally appeared from the shadows...'
        ]
      });
    }

    // Setting/world-building prompts
    const settingWords = ['room', 'building', 'city', 'planet', 'ship', 'forest', 'mountain', 'ocean'];
    const hasSetting = settingWords.some(word => text.toLowerCase().includes(word));

    if (!hasSetting && wordCount > 100) {
      newPrompts.push({
        id: 'establish-setting',
        title: 'Ground the Scene',
        description: 'Help readers understand where and when the action takes place',
        type: 'setting',
        context: 'Setting details needed',
        prompt: 'Establish the physical environment and time period. Make it specific and relevant to the mood or plot.',
        examples: [
          'The abandoned warehouse echoed with every footstep...',
          'In the heart of the bustling space station...',
          'The ancient forest seemed to hold its breath...'
        ]
      });
    }

    // Always include a general creative prompt
    newPrompts.push({
      id: 'creative-boost',
      title: 'Creative Spark',
      description: 'Get inspired with fresh ideas and approaches',
      type: 'creative',
      context: 'General writing assistance',
      prompt: 'What unique element, unexpected twist, or vivid detail could make this scene more engaging?',
      examples: [
        'Consider adding an unusual object that has significance...',
        'What if a secondary character interrupts this moment?',
        'Try describing this through a different character\'s perspective...'
      ]
    });

    return newPrompts.slice(0, 4); // Limit to 4 most relevant prompts
  };

  // Generate prompts when text changes
  useEffect(() => {
    if (!currentText || currentText.length < 50) {
      setPrompts([]);
      return;
    }

    setIsGenerating(true);

    // Debounce prompt generation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const newPrompts = await analyzeContext(currentText, storyContext);
        setPrompts(newPrompts);
      } catch (error) {
        console.error('Error generating prompts:', error);
      } finally {
        setIsGenerating(false);
      }
    }, 1500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentText, storyContext, currentChapter, totalChapters]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'p') {
          e.preventDefault();
          setIsVisible(!isVisible);
        } else if (e.key === 'Enter' && selectedPrompt) {
          e.preventDefault();
          handlePromptInsert();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPrompt, isVisible]);

  const handlePromptSelect = (prompt: WritingPrompt) => {
    setSelectedPrompt(prompt);
    onPromptSelect(prompt.prompt);
  };

  const handlePromptInsert = () => {
    if (selectedPrompt) {
      const insertionText = `\n\n${selectedPrompt.prompt}\n\n`;
      onPromptInsert(insertionText);
      setSelectedPrompt(null);
      setIsVisible(false);
    }
  };

  const getPromptIcon = (type: WritingPrompt['type']) => {
    switch (type) {
      case 'creative': return '✨';
      case 'descriptive': return '👁️';
      case 'dialogue': return '💬';
      case 'action': return '⚡';
      case 'character': return '👤';
      case 'plot': return '📈';
      case 'setting': return '🏞️';
      default: return '💡';
    }
  };

  const getPromptColor = (type: WritingPrompt['type']) => {
    switch (type) {
      case 'creative': return '#8b5cf6';
      case 'descriptive': return '#06b6d4';
      case 'dialogue': return '#f59e0b';
      case 'action': return '#ef4444';
      case 'character': return '#10b981';
      case 'plot': return '#3b82f6';
      case 'setting': return '#84cc16';
      default: return '#6b7280';
    }
  };

  if (prompts.length === 0 && !isGenerating) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      right: '20px',
      width: '380px',
      maxHeight: '500px',
      backgroundColor: '#ffffff',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>🎯</span>
          <span style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            Writing Prompts
          </span>
          {isGenerating && (
            <div style={{
              width: '14px',
              height: '14px',
              border: '2px solid #3b82f6',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          )}
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setIsVisible(false)}
            style={{
              padding: '4px 8px',
              backgroundColor: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#6b7280'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Prompts List */}
      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        padding: '8px'
      }}>
        {isGenerating ? (
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
            Analyzing your writing...
          </div>
        ) : (
          prompts.map((prompt) => (
            <div
              key={prompt.id}
              onClick={() => handlePromptSelect(prompt)}
              style={{
                padding: '16px',
                marginBottom: '8px',
                border: `2px solid ${selectedPrompt?.id === prompt.id ? getPromptColor(prompt.type) : '#f1f5f9'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedPrompt?.id === prompt.id ? `${getPromptColor(prompt.type)}08` : 'white',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <span style={{
                  fontSize: '20px',
                  opacity: 0.8
                }}>
                  {getPromptIcon(prompt.type)}
                </span>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>
                    {prompt.title}
                  </h4>
                  <p style={{
                    margin: '0 0 12px 0',
                    fontSize: '14px',
                    color: '#6b7280',
                    lineHeight: '1.4'
                  }}>
                    {prompt.description}
                  </p>

                  <div style={{
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '12px'
                  }}>
                    <p style={{
                      margin: '0 0 8px 0',
                      fontSize: '13px',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      💡 Prompt:
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '13px',
                      color: '#6b7280',
                      lineHeight: '1.4',
                      fontStyle: 'italic'
                    }}>
                      {prompt.prompt}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: getPromptColor(prompt.type),
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '500'
                    }}>
                      {prompt.type}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color: '#9ca3af'
                    }}>
                      {prompt.context}
                    </span>
                  </div>

                  {prompt.examples && (
                    <details style={{ marginTop: '8px' }}>
                      <summary style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        cursor: 'pointer',
                        marginBottom: '4px'
                      }}>
                        📝 Example approaches
                      </summary>
                      <div style={{
                        padding: '8px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb'
                      }}>
                        {prompt.examples.map((example, index) => (
                          <div key={index} style={{
                            fontSize: '11px',
                            color: '#4b5563',
                            marginBottom: '4px',
                            paddingLeft: '12px',
                            position: 'relative'
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: 0,
                              color: '#9ca3af'
                            }}>
                              •
                            </span>
                            "{example}"
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>

              {selectedPrompt?.id === prompt.id && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  backgroundColor: getPromptColor(prompt.type),
                  color: 'white',
                  borderRadius: '6px',
                  fontSize: '12px',
                  textAlign: 'center'
                }}>
                  Press Ctrl+Enter to insert this prompt • Click to select
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        fontSize: '12px',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        💡 Tip: Press Ctrl+P to toggle prompts • Ctrl+Enter to insert selected prompt
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

export default ContextualPrompts;

