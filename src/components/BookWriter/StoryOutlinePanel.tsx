'use client';

import React, { useState } from 'react';

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

interface StoryOutlinePanelProps {
  story: Story | null;
  chapters: Chapter[];
  onUpdateStory: (story: Story | null) => void;
}

const StoryOutlinePanel: React.FC<StoryOutlinePanelProps> = ({
  story,
  chapters,
  onUpdateStory
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStory, setEditedStory] = useState<Story | null>(story);

  const handleSaveStory = () => {
    if (editedStory) {
      onUpdateStory(editedStory);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedStory(story);
    setIsEditing(false);
  };

  const addCharacter = () => {
    if (editedStory) {
      setEditedStory({
        ...editedStory,
        characters: [...editedStory.characters, '']
      });
    }
  };

  const updateCharacter = (index: number, value: string) => {
    if (editedStory) {
      const updatedCharacters = [...editedStory.characters];
      updatedCharacters[index] = value;
      setEditedStory({
        ...editedStory,
        characters: updatedCharacters
      });
    }
  };

  const removeCharacter = (index: number) => {
    if (editedStory) {
      const updatedCharacters = editedStory.characters.filter((_, i) => i !== index);
      setEditedStory({
        ...editedStory,
        characters: updatedCharacters
      });
    }
  };

  const addPlotPoint = () => {
    if (editedStory) {
      setEditedStory({
        ...editedStory,
        plotPoints: [...editedStory.plotPoints, '']
      });
    }
  };

  const updatePlotPoint = (index: number, value: string) => {
    if (editedStory) {
      const updatedPlotPoints = [...editedStory.plotPoints];
      updatedPlotPoints[index] = value;
      setEditedStory({
        ...editedStory,
        plotPoints: updatedPlotPoints
      });
    }
  };

  const removePlotPoint = (index: number) => {
    if (editedStory) {
      const updatedPlotPoints = editedStory.plotPoints.filter((_, i) => i !== index);
      setEditedStory({
        ...editedStory,
        plotPoints: updatedPlotPoints
      });
    }
  };

  // Initialize editedStory if story exists
  React.useEffect(() => {
    if (story && !editedStory) {
      setEditedStory(story);
    }
  }, [story, editedStory]);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '20px'
      }}>
        <h2 style={{
          margin: 0,
          color: '#2d3748',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          🗺️ Story Outline
        </h2>

        <div style={{ display: 'flex', gap: '10px' }}>
          {isEditing ? (
            <>
              <button
                onClick={handleSaveStory}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                💾 Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                ❌ Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ✏️ Edit Story
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Left Column - Story Overview */}
        <div>
          <h3 style={{
            color: '#4a90e2',
            marginBottom: '20px',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            📖 Story Overview
          </h3>

          {isEditing && editedStory ? (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#2d3748'
                }}>
                  Title:
                </label>
                <input
                  type="text"
                  value={editedStory.title}
                  onChange={(e) => setEditedStory({...editedStory, title: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#2d3748'
                }}>
                  Genre:
                </label>
                <select
                  value={editedStory.genre}
                  onChange={(e) => setEditedStory({...editedStory, genre: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                >
                  <option value="Science Fiction">Science Fiction</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Romance">Romance</option>
                  <option value="Horror">Horror</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Literary Fiction">Literary Fiction</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#2d3748'
                }}>
                  Description:
                </label>
                <textarea
                  value={editedStory.description}
                  onChange={(e) => setEditedStory({...editedStory, description: e.target.value})}
                  style={{
                    width: '100%',
                    height: '120px',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="Brief description of your story..."
                />
              </div>
            </>
          ) : (
            story && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{
                    margin: '0 0 8px 0',
                    color: '#2d3748',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    Title:
                  </h4>
                  <p style={{
                    margin: 0,
                    color: '#4a5568',
                    fontSize: '18px',
                    fontWeight: '500'
                  }}>
                    {story.title}
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{
                    margin: '0 0 8px 0',
                    color: '#2d3748',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    Genre:
                  </h4>
                  <span style={{
                    backgroundColor: '#4a90e2',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {story.genre}
                  </span>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{
                    margin: '0 0 8px 0',
                    color: '#2d3748',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    Description:
                  </h4>
                  <p style={{
                    margin: 0,
                    color: '#4a5568',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}>
                    {story.description || 'No description provided.'}
                  </p>
                </div>
              </>
            )
          )}
        </div>

        {/* Right Column - Characters and Plot Points */}
        <div>
          <h3 style={{
            color: '#4a90e2',
            marginBottom: '20px',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            👥 Story Elements
          </h3>

          {/* Characters */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <h4 style={{
                margin: 0,
                color: '#2d3748',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Characters
              </h4>
              {isEditing && (
                <button
                  onClick={addCharacter}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  + Add
                </button>
              )}
            </div>

            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '10px'
            }}>
              {editedStory && editedStory.characters.map((character, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={character}
                        onChange={(e) => updateCharacter(index, e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                        placeholder="Character name and description"
                      />
                      <button
                        onClick={() => removeCharacter(index)}
                        style={{
                          padding: '8px',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #e9ecef'
                    }}>
                      {character || 'Unnamed character'}
                    </div>
                  )}
                </div>
              ))}

              {(!editedStory || editedStory.characters.length === 0) && (
                <p style={{
                  color: '#9ca3af',
                  fontSize: '14px',
                  textAlign: 'center',
                  margin: '20px 0'
                }}>
                  No characters defined yet
                </p>
              )}
            </div>
          </div>

          {/* Plot Points */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <h4 style={{
                margin: 0,
                color: '#2d3748',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Plot Points
              </h4>
              {isEditing && (
                <button
                  onClick={addPlotPoint}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  + Add
                </button>
              )}
            </div>

            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '10px'
            }}>
              {editedStory && editedStory.plotPoints.map((plotPoint, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{
                        backgroundColor: '#4a90e2',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        minWidth: '40px',
                        textAlign: 'center'
                      }}>
                        {index + 1}
                      </span>
                      <textarea
                        value={plotPoint}
                        onChange={(e) => updatePlotPoint(index, e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '14px',
                          height: '60px',
                          resize: 'vertical'
                        }}
                        placeholder="Describe this plot point..."
                      />
                      <button
                        onClick={() => removePlotPoint(index)}
                        style={{
                          padding: '8px',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #e9ecef',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px'
                    }}>
                      <span style={{
                        backgroundColor: '#4a90e2',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}>
                        {index + 1}
                      </span>
                      <span style={{
                        fontSize: '14px',
                        color: '#495057',
                        lineHeight: '1.4'
                      }}>
                        {plotPoint || 'No description'}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {(!editedStory || editedStory.plotPoints.length === 0) && (
                <p style={{
                  color: '#9ca3af',
                  fontSize: '14px',
                  textAlign: 'center',
                  margin: '20px 0'
                }}>
                  No plot points defined yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Overview */}
      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{
          color: '#4a90e2',
          marginBottom: '15px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          📚 Chapter Overview
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          {chapters.map((chapter, index) => (
            <div key={chapter.id} style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #e9ecef',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{
                margin: '0 0 8px 0',
                color: '#2d3748',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                {chapter.title}
              </h4>
              <p style={{
                margin: '0 0 8px 0',
                color: '#718096',
                fontSize: '12px'
              }}>
                {chapter.wordCount} words
              </p>
              <p style={{
                margin: 0,
                color: '#4a5568',
                fontSize: '14px',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {chapter.content.substring(0, 150)}...
              </p>
            </div>
          ))}
        </div>

        {chapters.length === 0 && (
          <p style={{
            color: '#9ca3af',
            fontSize: '16px',
            textAlign: 'center',
            margin: '20px 0'
          }}>
            No chapters written yet. Start writing to see your story take shape!
          </p>
        )}
      </div>
    </div>
  );
};

export default StoryOutlinePanel;
