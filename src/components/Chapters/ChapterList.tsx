import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';

// Extend Window interface for webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const App: React.FC = () => {
  const [chapters, setChapters] = useState<{ title: string; content: string }[]>([{ title: 'Chapter 1', content: '' }]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [buffer, setBuffer] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const rec = new window.webkitSpeechRecognition();
      rec.continuous = true;
      rec.onresult = (e: any) => {
        const transcript = e.results[e.results.length - 1][0].transcript;
        setBuffer((prev) => prev + transcript + '\n');
      };
      setRecognition(rec);
    }
    setWordCount(chapters[currentChapter]?.content.split(/\s+/).filter(w => w).length || 0);
  }, [chapters, currentChapter]);

  const addChapter = () => setChapters([...chapters, { title: `Chapter ${chapters.length + 1}`, content: '' }]);

  const updateContent = (content: string) => {
    const updated = [...chapters];
    updated[currentChapter].content = content;
    setChapters(updated);
    setWordCount(content.split(/\s+/).filter(w => w).length);
  };

  const updateTitle = (title: string) => {
    const updated = [...chapters];
    updated[currentChapter].title = title;
    setChapters(updated);
  };

  const startVoice = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognition?.start();
    } catch (e) {
      alert('Mic error!');
    }
  };

  const stopVoice = () => {
    recognition?.stop();
    updateContent(chapters[currentChapter].content + buffer);
    setBuffer('');
  };

  const saveBook = () => {
    const blob = new Blob([chapters.map(ch => `# ${ch.title}\n${ch.content}\n\n`).join('')], { type: 'text/plain' });
    saveAs(blob, 'book.md');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Courier New', background: '#f5f5dc', color: '#333' }}>
      <h1 style={{ textAlign: 'center' }}>Sky Cities: Sparrow's Run</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={addChapter}>New Chapter</button>
        <button onClick={saveBook}>Export Book</button>
        <select onChange={(e) => setCurrentChapter(Number(e.target.value))}>
          {chapters.map((ch, i) => <option key={i} value={i}>{ch.title}</option>)}
        </select>
        <span>Words: {wordCount}</span>
      </div>
      <input
        type="text"
        value={chapters[currentChapter]?.title || ''}
        onChange={(e) => updateTitle(e.target.value)}
        placeholder="Chapter Title"
        style={{ width: '100%', marginBottom: '10px', fontFamily: 'Courier New' }}
      />
      <div style={{ marginBottom: '20px' }}>
        <button onClick={startVoice}>Start Voice</button>
        <button onClick={stopVoice}>Stop & Append</button>
        <textarea
          value={buffer}
          readOnly
          placeholder="Voice buffer..."
          style={{ width: '100%', height: '100px', fontFamily: 'Courier New' }}
        />
      </div>
      <textarea
        value={chapters[currentChapter]?.content || ''}
        onChange={(e) => updateContent(e.target.value)}
        style={{ width: '100%', height: '400px', fontFamily: 'Courier New' }}
        placeholder="Write your story here..."
      />
    </div>
  );
};

export default App;