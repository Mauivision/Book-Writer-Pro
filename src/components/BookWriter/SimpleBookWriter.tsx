'use client';

import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';

interface Chapter {
  title: string;
  content: string;
}

const SimpleBookWriter: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [buffer, setBuffer] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const rec = new (window as any).webkitSpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (e: any) => {
        const transcript = e.results[e.results.length - 1][0].transcript;
        setBuffer((prev) => prev + transcript + '\n');
      };
      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      setRecognition(rec);
    }
  }, []);

  const addChapter = () => {
    const newChapter: Chapter = { 
      title: `Chapter ${chapters.length + 1}`, 
      content: '' 
    };
    setChapters([...chapters, newChapter]);
  };

  const updateContent = (content: string) => {
    const updated = [...chapters];
    if (updated[currentChapter]) {
      updated[currentChapter].content = content;
      setChapters(updated);
    }
  };

  const startVoice = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognition?.start();
    } catch (error) {
      alert('Microphone access denied. Please allow microphone access to use voice dictation.');
    }
  };

  const stopVoice = () => {
    recognition?.stop();
    if (chapters[currentChapter] && buffer.trim()) {
      updateContent(chapters[currentChapter].content + buffer);
      setBuffer('');
    }
  };

  const saveBook = () => {
    if (chapters.length === 0) {
      alert('No chapters to save!');
      return;
    }
    
    const bookContent = chapters
      .map(ch => `${ch.title}\n${ch.content}\n\n`)
      .join('');
    
    const blob = new Blob([bookContent], { type: 'text/plain' });
    saveAs(blob, 'my-book.txt');
  };

  const exportToMarkdown = () => {
    if (chapters.length === 0) {
      alert('No chapters to export!');
      return;
    }
    
    const markdownContent = chapters
      .map(ch => `# ${ch.title}\n\n${ch.content}\n\n---\n\n`)
      .join('');
    
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    saveAs(blob, 'my-book.md');
  };

  const clearBuffer = () => setBuffer('');

  const wordCount = chapters.reduce((total, chapter) => {
    return total + chapter.content.split(/\s+/).filter(word => word.length > 0).length;
  }, 0);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Georgia, serif', 
      background: '#f5f5dc',
      minHeight: '100vh',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ 
        borderBottom: '2px solid #8b4513', 
        paddingBottom: '20px', 
        marginBottom: '20px' 
      }}>
        <h1 style={{ 
          color: '#8b4513', 
          textAlign: 'center',
          fontSize: '2.5rem',
          margin: '0 0 10px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          📚 Book Writer
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          fontSize: '1.1rem',
          margin: '0'
        }}>
          Total Words: {wordCount} | Chapters: {chapters.length}
        </p>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button 
          onClick={addChapter}
          style={{
            padding: '10px 20px',
            backgroundColor: '#8b4513',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ➕ Add Chapter
        </button>
        
        <button 
          onClick={saveBook}
          style={{
            padding: '10px 20px',
            backgroundColor: '#228b22',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          💾 Save Book (TXT)
        </button>
        
        <button 
          onClick={exportToMarkdown}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4169e1',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          📄 Export Markdown
        </button>
      </div>

      {/* Chapter Selector */}
      {chapters.length > 0 && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <label style={{ 
            fontSize: '18px', 
            fontWeight: 'bold',
            color: '#8b4513',
            marginRight: '10px'
          }}>
            Current Chapter:
          </label>
          <select 
            onChange={(e) => setCurrentChapter(Number(e.target.value))}
            value={currentChapter}
            style={{
              padding: '8px 12px',
              fontSize: '16px',
              border: '2px solid #8b4513',
              borderRadius: '5px',
              backgroundColor: 'white'
            }}
          >
            {chapters.map((ch, i) => (
              <option key={i} value={i}>
                {ch.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Voice Controls */}
      <div style={{ 
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#fff8dc',
        border: '2px solid #daa520',
        borderRadius: '10px'
      }}>
        <h3 style={{ 
          margin: '0 0 10px 0', 
          color: '#8b4513',
          textAlign: 'center'
        }}>
          🎤 Voice Dictation
        </h3>
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          justifyContent: 'center',
          marginBottom: '10px'
        }}>
          <button 
            onClick={startVoice}
            disabled={isListening}
            style={{
              padding: '10px 20px',
              backgroundColor: isListening ? '#ff6b6b' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isListening ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              opacity: isListening ? 0.7 : 1
            }}
          >
            {isListening ? '🔴 Listening...' : '🎤 Start Voice'}
          </button>
          
          <button 
            onClick={stopVoice}
            disabled={!isListening}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: !isListening ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              opacity: !isListening ? 0.5 : 1
            }}
          >
            ⏹️ Stop & Append
          </button>
          
          <button 
            onClick={clearBuffer}
            disabled={!buffer.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ffa500',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: !buffer.trim() ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              opacity: !buffer.trim() ? 0.5 : 1
            }}
          >
            🗑️ Clear Buffer
          </button>
        </div>
        
        {buffer && (
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#8b4513'
            }}>
              Voice Buffer:
            </label>
            <textarea 
              value={buffer} 
              readOnly 
              placeholder="Voice dictation will appear here..."
              style={{
                width: '100%',
                height: '100px',
                padding: '10px',
                border: '2px solid #daa520',
                borderRadius: '5px',
                fontSize: '14px',
                backgroundColor: '#fffacd'
              }}
            />
          </div>
        )}
      </div>

      {/* Main Editor */}
      {chapters.length > 0 ? (
        <div>
          <h2 style={{ 
            color: '#8b4513', 
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            {chapters[currentChapter]?.title}
          </h2>
          <textarea
            value={chapters[currentChapter]?.content || ''}
            onChange={(e) => updateContent(e.target.value)}
            style={{ 
              width: '100%', 
              height: '500px',
              padding: '20px',
              border: '2px solid #8b4513',
              borderRadius: '10px',
              fontSize: '16px',
              lineHeight: '1.6',
              fontFamily: 'Georgia, serif',
              backgroundColor: '#fffef7',
              resize: 'vertical'
            }}
            placeholder="Write your chapter here... Use voice dictation or type directly."
          />
          <p style={{ 
            textAlign: 'center', 
            color: '#666', 
            marginTop: '10px',
            fontSize: '14px'
          }}>
            Words in this chapter: {chapters[currentChapter]?.content.split(/\s+/).filter(word => word.length > 0).length || 0}
          </p>
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px',
          backgroundColor: '#fff8dc',
          border: '2px dashed #daa520',
          borderRadius: '10px'
        }}>
          <h3 style={{ color: '#8b4513', marginBottom: '20px' }}>
            📖 Ready to Start Writing?
          </h3>
          <p style={{ color: '#666', fontSize: '18px', marginBottom: '20px' }}>
            Click "Add Chapter" to begin your book, or use voice dictation to start writing immediately.
          </p>
          <button 
            onClick={addChapter}
            style={{
              padding: '15px 30px',
              backgroundColor: '#8b4513',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            🚀 Start Your First Chapter
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleBookWriter;
