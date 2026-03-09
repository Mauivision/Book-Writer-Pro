'use client';

import React, { useState } from 'react';
import { saveAs } from 'file-saver';

interface Chapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Story {
  id: string;
  title: string;
  genre: string;
  description: string;
  chapters: Chapter[];
  characters: string[];
  plotPoints: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface AIBookGeneratorProps {
  onChaptersGenerated: (chapters: Chapter[]) => void;
  currentStory?: Story | null;
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
  const [generatedChapters, setGeneratedChapters] = useState<Chapter[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('ollama');

  // Mock AI generation for now - in real implementation this would connect to actual AI
  const mockAIGeneration = async (config: any): Promise<Chapter[]> => {
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing time

    return [
      {
        id: `chapter-${Date.now()}-1`,
        title: `${config.title} - Chapter 1`,
        content: `In the year 2056, the world had changed dramatically. The Satellite City Station orbited Earth like a silent sentinel, its gleaming metal hull reflecting the harsh light of the sun. ${config.characters[0]} stared out at the lunar surface below, her mind racing with thoughts of the mysterious invitation that had arrived that morning.

The invitation was unlike anything she had ever seen. It spoke of a race across the lunar surface, a competition that promised not just glory, but access to technology that could change the fate of humanity. ${config.characters[1]} had been skeptical at first, but as they examined the data chip that accompanied the message, their doubts began to fade.

"This is incredible," ${config.characters[1]} whispered, their eyes wide with wonder as they scrolled through the technical specifications. "If even half of this is real, we're looking at faster-than-light travel capabilities."

${config.characters[0]} nodded, her hand instinctively reaching for the controls of their shuttle. "Then we have no choice. We enter the race, and we win. The future of humanity depends on it."

As they began their descent toward the lunar surface, neither of them could shake the feeling that they were being watched. The stars above seemed to pulse with an otherworldly energy, and somewhere in the shadows of the moon's craters, their destiny awaited.

${config.plotPoints[0]} had set them on this path, but what dangers lay ahead? Only time would tell.`,
        wordCount: 350,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: `chapter-${Date.now()}-2`,
        title: `${config.title} - Chapter 2`,
        content: `The lunar surface was both beautiful and terrifying. Craters scarred the landscape like ancient wounds, and the low gravity made every movement feel like a dream. ${config.characters[0]} and ${config.characters[1]} moved carefully across the regolith, their suits gleaming in the starlight.

${config.plotPoints[1]} came when they least expected it. As they approached the starting line of the race, a sudden explosion rocked the ground beneath their feet. Alarms blared in their helmets as they dove for cover.

"What was that?" ${config.characters[0]} shouted, her voice barely audible over the communications system.

${config.characters[1]} scanned the area with their enhanced optics. "Sabotage. Someone doesn't want us in this race." They pointed to a group of shadowy figures retreating into the distance. "And I think I know who."

The race organizers appeared moments later, their faces hidden behind reflective visors. They assured the competitors that the incident was under control, but ${config.characters[0]} wasn't convinced. There was something about the way they moved, the way they spoke, that set off every alarm in her trained instincts.

${config.plotPoints[2]} would have to wait. First, they needed to survive the race itself. As the starting signal blared and the other competitors surged forward, ${config.characters[0]} and ${config.characters[1]} exchanged a determined look.

"Stay close," ${config.characters[0]} said. "And watch your back. This race is about more than just winning—it's about survival."

As they accelerated across the lunar surface, the true nature of the competition began to reveal itself. Hidden dangers lurked in every shadow, and the prize at the end was greater than any of them could have imagined.`,
        wordCount: 380,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: `chapter-${Date.now()}-3`,
        title: `${config.title} - Chapter 3`,
        content: `The race across the lunar surface was a grueling test of skill, endurance, and cunning. ${config.characters[0]} and ${config.characters[1]} had faced many challenges in their careers, but nothing quite like this. The low gravity made every jump a potential disaster, and the dust storms could reduce visibility to zero in seconds.

${config.plotPoints[3]} came as they crossed the finish line. The race organizers revealed that the true prize wasn't just the technology—it was land rights on the moon itself. Vast territories that could be developed, mined, and colonized.

But as ${config.characters[1]} examined the data more closely, they discovered something even more astonishing. "This isn't just faster-than-light travel," they whispered to ${config.characters[0]}. "This is the key to traveling between dimensions. Between universes."

${config.characters[0]} felt a chill run down her spine. The implications were staggering. If they could master this technology, they could explore not just the stars, but entirely new realities. The possibilities were limitless.

The other competitors congratulated them publicly, but ${config.characters[0]} noticed the resentment in their eyes. They had made enemies today, powerful enemies who would stop at nothing to claim the prize for themselves.

As they accepted their award and looked out at the lunar landscape that was now theirs, ${config.characters[0]} and ${config.characters[1]} knew that this was just the beginning. The real adventure was about to start, and the fate of multiple universes hung in the balance.

"We've won the race," ${config.characters[0]} said quietly, "but the real challenge is just beginning." ${config.characters[1]} nodded in agreement. "And we're ready for it."`,
        wordCount: 320,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  };

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
    
    try {
      let chapters;
      
      // Try Ollama first, fallback to LocalAI
      try {
        chapters = await ollama.createBook(config);
      } catch (ollamaError) {
        console.log('Ollama not available, using LocalAI fallback');
        chapters = await localAI.createBook(config);
      }
      
      setGeneratedChapters(chapters);
      onChaptersGenerated(chapters);
      
      // Save to file
      const bookContent = `# ${config.title}\n\nGenre: ${config.genre}\n\n` +
        chapters.map(ch => `## ${ch.title}\n\n${ch.content}\n\n`).join('');
      
      const blob = new Blob([bookContent], { type: 'text/markdown' });
      saveAs(blob, `${config.title.replace(/\s+/g, '_')}.md`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate book');
    } finally {
      setIsGenerating(false);
    }
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
          <small>Make sure Ollama is running: <code>ollama serve</code></small>
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
          {isGenerating ? '🔄 Generating Book...' : '🚀 Generate AI Book'}
        </button>
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
