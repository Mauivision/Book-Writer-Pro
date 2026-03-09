'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaChartLine, FaBook, FaClock, FaBullseye, FaCalendar, FaTrophy } from 'react-icons/fa';

interface WritingStatsProps {
  totalWords: number;
  chaptersCount: number;
  onClose: () => void;
}

interface WritingSession {
  date: string;
  wordsWritten: number;
  timeSpent: number; // in minutes
  chaptersWorked: number;
}

const WritingStats: React.FC<WritingStatsProps> = ({
  totalWords,
  chaptersCount,
  onClose
}) => {
  const [sessions, setSessions] = useState<WritingSession[]>([]);
  const [writingGoal, setWritingGoal] = useState(1000); // words per day
  const [currentStreak, setCurrentStreak] = useState(0);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('writing-sessions');
    const savedGoal = localStorage.getItem('writing-goal');
    const savedStreak = localStorage.getItem('writing-streak');

    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }

    if (savedGoal) {
      setWritingGoal(parseInt(savedGoal));
    }

    if (savedStreak) {
      setCurrentStreak(parseInt(savedStreak));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('writing-sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('writing-goal', writingGoal.toString());
  }, [writingGoal]);

  useEffect(() => {
    localStorage.setItem('writing-streak', currentStreak.toString());
  }, [currentStreak]);

  // Calculate statistics
  const today = new Date().toDateString();
  const todaySession = sessions.find(s => s.date === today);
  const todayWords = todaySession?.wordsWritten || 0;
  const todayTime = todaySession?.timeSpent || 0;

  const totalSessions = sessions.length;
  const averageWordsPerSession = totalSessions > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.wordsWritten, 0) / totalSessions)
    : 0;

  const totalTimeSpent = sessions.reduce((sum, s) => sum + s.timeSpent, 0);
  const averageTimePerSession = totalSessions > 0
    ? Math.round(totalTimeSpent / totalSessions)
    : 0;

  const goalProgress = Math.round((todayWords / writingGoal) * 100);
  const isGoalMet = todayWords >= writingGoal;

  // Calculate streak
  const calculateStreak = () => {
    const dates = sessions.map(s => s.date).sort().reverse();
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < dates.length; i++) {
      const sessionDate = new Date(dates[i]);
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  useEffect(() => {
    setCurrentStreak(calculateStreak());
  }, [sessions]);

  const handleGoalChange = (newGoal: number) => {
    setWritingGoal(newGoal);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '600px',
      maxHeight: '80vh',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      border: '2px solid #4a90e2',
      zIndex: 2000,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#4a90e2',
        color: 'white',
        padding: '20px 25px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaChartLine size={24} />
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            📊 Writing Statistics
          </h2>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '5px'
          }}
        >
          <FaTimes />
        </button>
      </div>

      {/* Content */}
      <div style={{
        padding: '25px',
        overflowY: 'auto',
        maxHeight: 'calc(80vh - 80px)'
      }}>
        {/* Today's Progress */}
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '25px',
          border: '1px solid #bae6fd'
        }}>
          <h3 style={{
            margin: '0 0 15px 0',
            color: '#1e40af',
            fontSize: '18px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaCalendar />
            Today's Progress
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            <div>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1e40af',
                marginBottom: '5px'
              }}>
                {todayWords.toLocaleString()}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Words Written
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#059669',
                marginBottom: '5px'
              }}>
                {Math.floor(todayTime / 60)}h {todayTime % 60}m
              </div>
              <div style={{
                fontSize: '12px',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Time Spent
              </div>
            </div>
          </div>

          {/* Daily Goal Progress */}
          <div style={{ marginTop: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '14px',
                color: '#475569',
                fontWeight: '500'
              }}>
                Daily Goal: {writingGoal} words
              </span>
              <span style={{
                fontSize: '14px',
                color: isGoalMet ? '#059669' : '#d97706',
                fontWeight: '600'
              }}>
                {goalProgress}%
              </span>
            </div>

            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e2e8f0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min(goalProgress, 100)}%`,
                height: '100%',
                backgroundColor: isGoalMet ? '#10b981' : '#3b82f6',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>

            {isGoalMet && (
              <div style={{
                marginTop: '8px',
                fontSize: '12px',
                color: '#059669',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                🎉 Goal achieved today!
              </div>
            )}
          </div>
        </div>

        {/* Overall Statistics */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{
            color: '#1f2937',
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            📈 Overall Statistics
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px'
          }}>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '5px'
              }}>
                {totalWords.toLocaleString()}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Total Words
              </div>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '5px'
              }}>
                {chaptersCount}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Chapters
              </div>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '5px'
              }}>
                {totalSessions}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Sessions
              </div>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#dc2626',
                marginBottom: '5px'
              }}>
                {currentStreak}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Day Streak
              </div>
            </div>
          </div>
        </div>

        {/* Average Performance */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{
            color: '#1f2937',
            marginBottom: '15px',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            📊 Average Performance
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
          }}>
            <div style={{
              backgroundColor: '#fef3c7',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #fcd34d',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#92400e',
                marginBottom: '5px'
              }}>
                {averageWordsPerSession}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#a16207',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Words per Session
              </div>
            </div>

            <div style={{
              backgroundColor: '#d1fae5',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #6ee7b7',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#065f46',
                marginBottom: '5px'
              }}>
                {Math.floor(averageTimePerSession / 60)}h {averageTimePerSession % 60}m
              </div>
              <div style={{
                fontSize: '12px',
                color: '#047857',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Time per Session
              </div>
            </div>
          </div>
        </div>

        {/* Writing Goal Settings */}
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #bae6fd',
          marginBottom: '25px'
        }}>
          <h3 style={{
            margin: '0 0 15px 0',
            color: '#1e40af',
            fontSize: '18px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaBullseye />
            Daily Writing Goal
          </h3>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '10px'
          }}>
            <label style={{
              fontSize: '14px',
              color: '#475569',
              fontWeight: '500',
              minWidth: '80px'
            }}>
              Goal:
            </label>
            <input
              type="number"
              value={writingGoal}
              onChange={(e) => handleGoalChange(parseInt(e.target.value))}
              min="100"
              max="10000"
              step="100"
              style={{
                padding: '8px 12px',
                border: '2px solid #3b82f6',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                width: '120px'
              }}
            />
            <span style={{
              fontSize: '14px',
              color: '#64748b'
            }}>
              words/day
            </span>
          </div>

          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#475569',
            lineHeight: '1.5'
          }}>
            {writingGoal <= 500 && "💪 Great for beginners! Start small and build momentum."}
            {writingGoal > 500 && writingGoal <= 1000 && "🎯 Perfect daily goal! Sustainable and achievable."}
            {writingGoal > 1000 && writingGoal <= 2000 && "🚀 Ambitious goal! Great for dedicated writers."}
            {writingGoal > 2000 && "🔥 Challenge mode! You're a writing machine!"}
          </p>
        </div>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <div>
            <h3 style={{
              color: '#1f2937',
              marginBottom: '15px',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              📅 Recent Sessions
            </h3>

            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}>
              {sessions.slice(-10).reverse().map((session, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937'
                    }}>
                      {new Date(session.date).toLocaleDateString()}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      {Math.floor(session.timeSpent / 60)}h {session.timeSpent % 60}m
                    </div>
                  </div>
                  <div style={{
                    textAlign: 'right'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#059669'
                    }}>
                      {session.wordsWritten.toLocaleString()}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      words
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        <div style={{
          marginTop: '25px',
          padding: '15px',
          backgroundColor: '#fdf4ff',
          border: '1px solid #f3e8ff',
          borderRadius: '8px'
        }}>
          <h4 style={{
            margin: '0 0 10px 0',
            color: '#7c3aed',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaTrophy />
            Achievements
          </h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px'
          }}>
            {totalWords >= 50000 && (
              <div style={{
                padding: '8px 12px',
                backgroundColor: '#dcfce7',
                border: '1px solid #bbf7d0',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#166534',
                fontWeight: '500'
              }}>
                🏆 50K Words Master
              </div>
            )}
            {totalWords >= 25000 && (
              <div style={{
                padding: '8px 12px',
                backgroundColor: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#92400e',
                fontWeight: '500'
              }}>
                📚 Novel Writer
              </div>
            )}
            {chaptersCount >= 10 && (
              <div style={{
                padding: '8px 12px',
                backgroundColor: '#dbeafe',
                border: '1px solid #93c5fd',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#1e40af',
                fontWeight: '500'
              }}>
                📖 Chapter Champion
              </div>
            )}
            {currentStreak >= 7 && (
              <div style={{
                padding: '8px 12px',
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#dc2626',
                fontWeight: '500'
              }}>
                🔥 Week Warrior
              </div>
            )}
            {isGoalMet && (
              <div style={{
                padding: '8px 12px',
                backgroundColor: '#d1fae5',
                border: '1px solid #6ee7b7',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#047857',
                fontWeight: '500'
              }}>
                ✅ Goal Crusher
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingStats;
