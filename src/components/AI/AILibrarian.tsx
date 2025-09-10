'use client';

import { useState, useRef, useEffect } from 'react';
import { useBookStore } from '@/store/bookStore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaLightbulb, FaRobot, FaMagic, FaPaperPlane, FaCopy, FaHistory } from 'react-icons/fa';
import { aiBrain, AIBrainContext, AIResponse } from '@/utils/aiBrain';
import { Message } from '@/types';
import styles from './AILibrarian.module.css';

export function AILibrarian() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMemory, setShowMemory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { metadata, chapters, characters, plot, setting } = useBookStore();

  // Initialize AI brain with current book context
  useEffect(() => {
    const context: AIBrainContext = {
      bookTitle: metadata.title || 'Untitled Book',
      chapterCount: chapters.length,
      characterCount: characters.length,
      genres: metadata.genres || [],
      plot: plot.summary ? {
        summary: plot.summary,
        outline: plot.outline || []
      } : undefined,
      characters: characters.length > 0 ? characters.map(char => ({
        id: char.id,
        name: char.name,
        role: char.role,
        description: char.description,
        background: char.background,
        motivations: char.motivations || []
      })) : undefined,
      setting: setting.description ? {
        description: setting.description,
        worldBuilding: setting.worldBuilding || ''
      } : undefined,
      currentStage: determineCurrentStage(),
      userExperience: 'beginner' // Could be made configurable
    };

    aiBrain.initialize(context);
  }, [metadata, chapters, characters, plot, setting]);

  // Determine current writing stage based on progress
  const determineCurrentStage = (): 'idea' | 'planning' | 'writing' | 'revision' | 'publishing' => {
    if (chapters.length === 0 && characters.length === 0) return 'idea';
    if (chapters.length === 0 && characters.length > 0) return 'planning';
    if (chapters.length > 0 && chapters.length < 5) return 'writing';
    if (chapters.length >= 5) return 'revision';
    return 'writing';
  };

  // Load messages from AI brain memory on component mount
  useEffect(() => {
    const memory = aiBrain.getMemory();
    if (memory.messages.length > 0) {
      const convertedMessages: Message[] = memory.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(convertedMessages);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setError(null);
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use AI brain to process input and generate response
      const aiResponse: AIResponse = await aiBrain.processInput(input);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      const errorResponse: Message = {
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${errorMessage}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  const insertAsPrompt = (content: string) => {
    // Copy to clipboard
    navigator.clipboard.writeText(content).then(() => {
      // Show a temporary success message
      const originalText = document.title;
      document.title = 'Prompt copied to clipboard!';
      setTimeout(() => {
        document.title = originalText;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
    });
  };

  const clearMemory = () => {
    if (confirm('Are you sure you want to clear all conversation history?')) {
      setMessages([]);
      aiBrain.clearMemory();
    }
  };

  // Get AI personality info
  const personality = aiBrain.getPersonality();

  return (
    <div className={styles.librarianContainer}>
      <div className={styles.librarianHeader}>
        <div className={styles.headerContent}>
          <FaRobot className={styles.headerIcon} />
          <div>
            <h2 className={styles.headerTitle}>{personality.name}</h2>
            <p className={styles.headerSubtitle}>Your intelligent writing companion with memory!</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <motion.button
            type="button"
            className={styles.memoryButton}
            onClick={() => setShowMemory(!showMemory)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Toggle Memory View"
          >
            <FaHistory />
            <span>Memory ({messages.length})</span>
          </motion.button>
          {messages.length > 0 && (
            <motion.button
              type="button"
              className={styles.clearButton}
              onClick={clearMemory}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Clear Memory"
            >
              Clear
            </motion.button>
          )}
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className={styles.errorCloseButton}
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.messagesContainer}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`${styles.messageWrapper} ${
                message.role === 'user' ? styles.userMessage : styles.assistantMessage
              }`}
            >
              <div className={styles.messageContent}>
                {message.role === 'assistant' && (
                  <FaRobot className={styles.messageIcon} />
                )}
                <div className={styles.messageBubble}>
                  <p className={styles.messageText}>{message.content}</p>
                  <div className={styles.messageFooter}>
                    <span className={styles.messageTime}>
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => insertAsPrompt(message.content)}
                        className={styles.copyButton}
                        title="Copy as prompt"
                      >
                        <FaCopy />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${styles.messageWrapper} ${styles.assistantMessage}`}
            >
              <div className={styles.messageContent}>
                <FaRobot className={styles.messageIcon} />
                <div className={styles.messageBubble}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3>Quick Actions</h3>
        <div className={styles.actionButtons}>
          <motion.button
            onClick={() => handleQuickAction("Help me brainstorm story ideas")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.actionButton}
          >
            <FaLightbulb />
            Brainstorm Ideas
          </motion.button>
          <motion.button
            onClick={() => handleQuickAction("Help me develop my characters")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.actionButton}
          >
            <FaBook />
            Character Help
          </motion.button>
          <motion.button
            onClick={() => handleQuickAction("Give me writing advice")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.actionButton}
          >
            <FaMagic />
            Writing Tips
          </motion.button>
          <motion.button
            onClick={() => handleQuickAction("Help me with plot structure")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.actionButton}
          >
            <FaRobot />
            Plot Help
          </motion.button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about writing, your story, or get advice..."
            className={styles.input}
            disabled={isLoading}
          />
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={styles.sendButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPaperPlane />
          </motion.button>
        </div>
      </form>

      {/* Memory Panel */}
      {showMemory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={styles.memoryPanel}
        >
          <h3>Conversation Memory</h3>
          <div className={styles.memoryContent}>
            {messages.length === 0 ? (
              <p>No conversation history yet.</p>
            ) : (
              <div className={styles.memoryMessages}>
                {messages.slice(-10).map((message, index) => (
                  <div key={index} className={styles.memoryMessage}>
                    <strong>{message.role === 'user' ? 'You' : 'AI'}:</strong>
                    <span>{message.content.substring(0, 100)}...</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
} 