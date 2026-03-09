'use client';

import React, { useState } from 'react';
import { FaGripVertical, FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

interface Chapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ChapterManagerProps {
  chapters: Chapter[];
  currentChapterIndex: number;
  onChapterSelect: (index: number) => void;
  onChapterDelete: (index: number) => void;
  onChapterReorder: (fromIndex: number, toIndex: number) => void;
}

const ChapterManager: React.FC<ChapterManagerProps> = ({
  chapters,
  currentChapterIndex,
  onChapterSelect,
  onChapterDelete,
  onChapterReorder
}) => {
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleEditChapter = (chapterId: string, currentTitle: string) => {
    setEditingChapter(chapterId);
    setEditingTitle(currentTitle);
  };

  const handleSaveEdit = () => {
    if (editingChapter && editingTitle.trim()) {
      // This would need to be implemented in the parent component
      // For now, we'll just cancel the edit
      setEditingChapter(null);
      setEditingTitle('');
    }
  };

  const handleCancelEdit = () => {
    setEditingChapter(null);
    setEditingTitle('');
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onChapterReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px'
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
          📖 Chapter Manager
        </h2>

        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <span style={{
            color: '#718096',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {chapters.length} chapter{chapters.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Chapter List */}
      <div style={{
        display: 'grid',
        gap: '15px'
      }}>
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '20px',
              backgroundColor: currentChapterIndex === index ? '#ebf8ff' : 'white',
              border: `2px solid ${currentChapterIndex === index ? '#4a90e2' : '#e2e8f0'}`,
              borderRadius: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              cursor: draggedIndex === index ? 'grabbing' : 'grab',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            {/* Drag Handle */}
            <div
              style={{
                padding: '10px',
                cursor: 'grab',
                color: '#a0aec0',
                display: 'flex',
                alignItems: 'center',
                marginRight: '15px'
              }}
            >
              <FaGripVertical />
            </div>

            {/* Chapter Number */}
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: currentChapterIndex === index ? '#4a90e2' : '#f7fafc',
              color: currentChapterIndex === index ? 'white' : '#4a5568',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '16px',
              marginRight: '15px',
              border: `1px solid ${currentChapterIndex === index ? '#4a90e2' : '#e2e8f0'}`
            }}>
              {index + 1}
            </div>

            {/* Chapter Content */}
            <div style={{ flex: 1 }}>
              {editingChapter === chapter.id ? (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '2px solid #4a90e2',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEdit}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <FaSave style={{ marginRight: '5px' }} />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <FaTimes style={{ marginRight: '5px' }} />
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <h3
                    onClick={() => onChapterSelect(index)}
                    style={{
                      margin: '0 0 8px 0',
                      color: '#2d3748',
                      fontSize: '18px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {chapter.title}
                  </h3>

                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: '#718096'
                  }}>
                    <span>
                      📝 {chapter.wordCount} words
                    </span>
                    <span>
                      📅 {chapter.updatedAt.toLocaleDateString()}
                    </span>
                    <span style={{
                      backgroundColor: currentChapterIndex === index ? '#4a90e2' : '#e2e8f0',
                      color: currentChapterIndex === index ? 'white' : '#4a5568',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {currentChapterIndex === index ? 'Current' : 'Select'}
                    </span>
                  </div>

                  <p style={{
                    margin: '8px 0 0 0',
                    color: '#4a5568',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {chapter.content || 'No content yet...'}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              marginLeft: '15px'
            }}>
              {editingChapter !== chapter.id && (
                <>
                  <button
                    onClick={() => handleEditChapter(chapter.id, chapter.title)}
                    style={{
                      padding: '8px',
                      backgroundColor: '#f7fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: '#4a5568',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    title="Edit chapter title"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => onChapterDelete(index)}
                    disabled={chapters.length <= 1}
                    style={{
                      padding: '8px',
                      backgroundColor: chapters.length <= 1 ? '#f7fafc' : '#fef2f2',
                      border: `1px solid ${chapters.length <= 1 ? '#e2e8f0' : '#fecaca'}`,
                      borderRadius: '6px',
                      cursor: chapters.length <= 1 ? 'not-allowed' : 'pointer',
                      color: chapters.length <= 1 ? '#9ca3af' : '#dc2626',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      opacity: chapters.length <= 1 ? 0.5 : 1
                    }}
                    title={chapters.length <= 1 ? 'Cannot delete last chapter' : 'Delete chapter'}
                  >
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {chapters.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          border: '2px dashed #cbd5e0',
          borderRadius: '12px',
          color: '#718096'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '24px',
            color: '#4a5568'
          }}>
            📚 No Chapters Yet
          </h3>
          <p style={{
            margin: '0 0 30px 0',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            Start writing your story by adding your first chapter.
            You can organize and reorder chapters as you write.
          </p>
          <button
            onClick={() => {/* This would trigger adding a chapter in the parent */}}
            style={{
              padding: '12px 24px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            <FaPlus style={{ marginRight: '8px' }} />
            Add First Chapter
          </button>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e6f3ff',
        border: '1px solid #b3d9ff',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#2c5aa0',
        lineHeight: '1.5'
      }}>
        <h4 style={{
          margin: '0 0 10px 0',
          color: '#2c5aa0',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          💡 How to use Chapter Manager:
        </h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li><strong>Drag chapters</strong> by the grip handle to reorder them</li>
          <li><strong>Click chapter titles</strong> to switch to that chapter for editing</li>
          <li><strong>Edit titles</strong> by clicking the edit button</li>
          <li><strong>Delete chapters</strong> (minimum of 1 chapter required)</li>
          <li><strong>Current chapter</strong> is highlighted in blue</li>
        </ul>
      </div>
    </div>
  );
};

export default ChapterManager;
