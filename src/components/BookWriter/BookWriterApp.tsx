'use client';

import React, { useState } from 'react';
import SimpleBookWriter from './SimpleBookWriter';
import AIBookGenerator from './AIBookGenerator';

interface Chapter {
  title: string;
  content: string;
}

const BookWriterApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'writer' | 'ai'>('writer');
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const handleChaptersGenerated = (newChapters: Chapter[]) => {
    setChapters(newChapters);
    setActiveTab('writer'); // Switch to writer tab to view generated chapters
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5dc',
      fontFamily: 'Georgia, serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#8b4513',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          margin: '0',
          fontSize: '2.5rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          📚 Advanced Book Writer
        </h1>
        <p style={{ 
          margin: '10px 0 0 0',
          fontSize: '1.2rem',
          opacity: 0.9
        }}>
          Write your story with AI assistance and voice dictation
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#daa520',
        padding: '0',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => setActiveTab('writer')}
          style={{
            padding: '15px 30px',
            backgroundColor: activeTab === 'writer' ? '#8b4513' : 'transparent',
            color: activeTab === 'writer' ? 'white' : '#8b4513',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            borderBottom: activeTab === 'writer' ? '3px solid #8b4513' : '3px solid transparent'
          }}
        >
          ✍️ Manual Writer
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          style={{
            padding: '15px 30px',
            backgroundColor: activeTab === 'ai' ? '#8b4513' : 'transparent',
            color: activeTab === 'ai' ? 'white' : '#8b4513',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            borderBottom: activeTab === 'ai' ? '3px solid #8b4513' : '3px solid transparent'
          }}
        >
          🤖 AI Generator
        </button>
      </div>

      {/* Content Area */}
      <div style={{ padding: '20px' }}>
        {activeTab === 'writer' ? (
          <SimpleBookWriter />
        ) : (
          <AIBookGenerator onChaptersGenerated={handleChaptersGenerated} />
        )}
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#8b4513',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <p style={{ margin: '0', opacity: 0.8 }}>
          Built with React, TypeScript, and AI-powered creativity
        </p>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.7 }}>
          Voice dictation requires microphone access • AI features require Ollama running locally
        </p>
      </div>
    </div>
  );
};

export default BookWriterApp;
