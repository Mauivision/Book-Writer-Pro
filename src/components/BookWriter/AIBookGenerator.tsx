'use client';

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { generateBookChapters, genreConfigs } from '@/utils/aiWriting';
import { nowIso } from '@/utils/manuscriptStorage';
import type { ManuscriptChapter, ManuscriptStory } from '@/types/manuscript';

interface AIBookGeneratorProps {
  onChaptersGenerated: (chapters: ManuscriptChapter[], story?: ManuscriptStory | null) => void;
  currentStory?: ManuscriptStory | null;
}

const AIBookGenerator: React.FC<AIBookGeneratorProps> = ({
  onChaptersGenerated,
  currentStory
}) => {
  const [config, setConfig] = useState({
    title: currentStory?.title || 'The Moon Runners',
    genre: currentStory?.genre || 'Science Fiction',
    characters: currentStory?.characters || ['Lila, a skilled co-pilot', 'You, a robotics expert'],
    setting: 'Satellite City Station, 2056 post-glacial melt',
    plotPoints: currentStory?.plotPoints || [
      'a mysterious lunar race invitation',
      'a dangerous sabotage during the Moon Runners race',
      'uncovering a faster-than-light travel secret',
      'winning lunar land and a new future'
    ]
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [generatedChapters, setGeneratedChapters] = useState<ManuscriptChapter[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenreChange = (genre: string) => {
    const genreConfig = genreConfigs[genre as keyof typeof genreConfigs];
    if (genreConfig) {
      setConfig(prev => ({
        ...prev,
        genre,
        setting: genreConfig.setting,
        characters: genreConfig.characters,
        plotPoints: genreConfig.plotPoints
      }));
    }
  };

  const generateBook = async () => {
    setIsGenerating(true);
    setError(null);
    setProgress('Starting generation…');

    try {
      const generated = await generateBookChapters(config, setProgress);
      const timestamp = nowIso();
      const chapters: ManuscriptChapter[] = generated.map((chapter, index) => ({
        id: `chapter-${Date.now()}-${index}`,
        title: chapter.title,
        content: chapter.content,
        wordCount: chapter.wordCount,
        createdAt: timestamp,
        updatedAt: timestamp,
      }));

      const story: ManuscriptStory = {
        id: currentStory?.id || `story-${Date.now()}`,
        title: config.title,
        genre: config.genre,
        description: `Set in ${config.setting}`,
        characters: config.characters,
        plotPoints: config.plotPoints,
        createdAt: currentStory?.createdAt || timestamp,
        updatedAt: timestamp,
      };

      setGeneratedChapters(chapters);
      onChaptersGenerated(chapters, story);
      setProgress('Draft saved on this device.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate the book. Your existing chapters were left unchanged.'
      );
      setProgress(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadGenerated = () => {
    if (!generatedChapters.length) return;
    const bookContent =
      `# ${config.title}\n\nGenre: ${config.genre}\n\n` +
      generatedChapters.map((chapter) => `## ${chapter.title}\n\n${chapter.content}\n\n`).join('');
    saveAs(new Blob([bookContent], { type: 'text/markdown' }), `${config.title.replace(/\s+/g, '_')}.md`);
  };

  const addPlotPoint = () => {
    setConfig(prev => ({
      ...prev,
      plotPoints: [...prev.plotPoints, '']
    }));
  };

  const updatePlotPoint = (index: number, value: string) => {
    setConfig(prev => ({
      ...prev,
      plotPoints: prev.plotPoints.map((point, i) => i === index ? value : point)
    }));
  };

  const removePlotPoint = (index: number) => {
    setConfig(prev => ({
      ...prev,
      plotPoints: prev.plotPoints.filter((_, i) => i !== index)
    }));
  };

  const addCharacter = () => {
    setConfig(prev => ({
      ...prev,
      characters: [...prev.characters, '']
    }));
  };

  const updateCharacter = (index: number, value: string) => {
    setConfig(prev => ({
      ...prev,
      characters: prev.characters.map((char, i) => i === index ? value : char)
    }));
  };

  const removeCharacter = (index: number) => {
    setConfig(prev => ({
      ...prev,
      characters: prev.characters.filter((_, i) => i !== index)
    }));
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f8ff',
      border: '2px solid #4169e1',
      borderRadius: '10px',
      marginBottom: '20px'
    }}>
      <h2 style={{ 
        color: '#4169e1', 
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        🤖 AI Book Generator
      </h2>

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #ffcdd2'
        }}>
          <strong>Error:</strong> {error}
          <br />
          <small>Existing chapters were not replaced. Check the AI badge in the header and confirm the provider is reachable.</small>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left Column - Configuration */}
        <div>
          <h3 style={{ color: '#4169e1', marginBottom: '15px' }}>📝 Book Configuration</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Book Title:
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px',
                border: '2px solid #4169e1',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Genre:
            </label>
            <select
              value={config.genre}
              onChange={(e) => handleGenreChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '2px solid #4169e1',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            >
              {Object.keys(genreConfigs).map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Setting:
            </label>
            <textarea
              value={config.setting}
              onChange={(e) => setConfig(prev => ({ ...prev, setting: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px',
                border: '2px solid #4169e1',
                borderRadius: '5px',
                fontSize: '16px',
                height: '60px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Characters:
            </label>
            {config.characters.map((character, index) => (
              <div key={index} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                <input
                  type="text"
                  value={character}
                  onChange={(e) => updateCharacter(index, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    border: '1px solid #4169e1',
                    borderRadius: '3px',
                    fontSize: '14px'
                  }}
                />
                <button
                  onClick={() => removeCharacter(index)}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={addCharacter}
              style={{
                padding: '6px 12px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              + Add Character
            </button>
          </div>
        </div>

        {/* Right Column - Plot Points */}
        <div>
          <h3 style={{ color: '#4169e1', marginBottom: '15px' }}>📖 Plot Points</h3>
          
          {config.plotPoints.map((plotPoint, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                <span style={{ 
                  fontWeight: 'bold', 
                  color: '#4169e1',
                  minWidth: '80px',
                  marginTop: '6px'
                }}>
                  Point {index + 1}:
                </span>
                <textarea
                  value={plotPoint}
                  onChange={(e) => updatePlotPoint(index, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    border: '1px solid #4169e1',
                    borderRadius: '3px',
                    fontSize: '14px',
                    height: '50px',
                    resize: 'vertical'
                  }}
                />
                <button
                  onClick={() => removePlotPoint(index)}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    marginTop: '2px'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          
          <button
            onClick={addPlotPoint}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              marginTop: '10px'
            }}
          >
            + Add Plot Point
          </button>
        </div>
      </div>

      {/* Generate Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={generateBook}
          disabled={isGenerating}
          style={{
            padding: '15px 30px',
            backgroundColor: isGenerating ? '#ccc' : '#4169e1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          {isGenerating ? 'Generating book…' : 'Generate AI Book'}
        </button>
        {progress && (
          <p style={{ marginTop: '10px', color: '#4169e1' }}>{progress}</p>
        )}
        {generatedChapters.length > 0 && (
          <button
            onClick={downloadGenerated}
            style={{
              marginLeft: '12px',
              padding: '12px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Download Markdown
          </button>
        )}
      </div>

      {/* Generated Chapters Preview */}
      {generatedChapters.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#4169e1', marginBottom: '15px' }}>
            📚 Generated Chapters ({generatedChapters.length})
          </h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {generatedChapters.map((chapter, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#4169e1' }}>
                  {chapter.title}
                </h4>
                <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                  {chapter.wordCount} words
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                  {chapter.content.substring(0, 200)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBookGenerator;
