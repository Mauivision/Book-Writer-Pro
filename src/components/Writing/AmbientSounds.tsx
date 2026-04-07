'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  FaPlay,
  FaPause,
  FaStop,
  FaVolumeUp,
  FaVolumeMute,
  FaVolumeDown,
  FaMusic,
  FaCloudRain,
  FaFire,
  FaLeaf,
  FaCoffee,
  FaWind,
  FaWater,
  FaMountain,
  FaCity,
  FaHeart,
  FaBrain,
  FaMoon,
  FaSun,
  FaStar,
  FaCog,
  FaRandom,
  FaDownload,
  FaBookmark,
  FaHistory,
  FaClock,
  FaCheckCircle,
  FaTimes,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaUndo,
  FaRedo,
} from 'react-icons/fa';

interface SoundTrack {
  id: string;
  name: string;
  category: 'nature' | 'ambient' | 'focus' | 'creative' | 'relaxing';
  icon: React.ReactNode;
  url: string;
  duration: number; // in seconds
  volume: number; // 0-1
  isPlaying: boolean;
  isFavorite: boolean;
  isCustom: boolean;
  createdAt: Date;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: SoundTrack[];
  isActive: boolean;
  createdAt: Date;
}

export default function AmbientSounds() {
  const [tracks, setTracks] = useState<SoundTrack[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [globalVolume, setGlobalVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPlaylistManager, setShowPlaylistManager] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [showCustomTrackForm, setShowCustomTrackForm] = useState(false);
  const [customTrackName, setCustomTrackName] = useState('');
  const [customTrackUrl, setCustomTrackUrl] = useState('');
  const [customTrackCategory, setCustomTrackCategory] =
    useState<string>('ambient');

  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Predefined sound tracks
  const defaultTracks: SoundTrack[] = [
    {
      id: 'rain',
      name: 'Gentle Rain',
      category: 'nature',
      icon: <FaCloudRain />,
      url: '/sounds/rain.mp3',
      duration: 600,
      volume: 0.8,
      isPlaying: false,
      isFavorite: true,
      isCustom: false,
      createdAt: new Date(),
    },
    {
      id: 'fireplace',
      name: 'Crackling Fire',
      category: 'ambient',
      icon: <FaFire />,
      url: '/sounds/fireplace.mp3',
      duration: 480,
      volume: 0.7,
      isPlaying: false,
      isFavorite: true,
      isCustom: false,
      createdAt: new Date(),
    },
    {
      id: 'forest',
      name: 'Forest Sounds',
      category: 'nature',
      icon: <FaLeaf />,
      url: '/sounds/forest.mp3',
      duration: 720,
      volume: 0.6,
      isPlaying: false,
      isFavorite: false,
      isCustom: false,
      createdAt: new Date(),
    },
    {
      id: 'cafe',
      name: 'Coffee Shop',
      category: 'ambient',
      icon: <FaCoffee />,
      url: '/sounds/cafe.mp3',
      duration: 540,
      volume: 0.5,
      isPlaying: false,
      isFavorite: false,
      isCustom: false,
      createdAt: new Date(),
    },
    {
      id: 'ocean',
      name: 'Ocean Waves',
      category: 'nature',
      icon: <FaWater />,
      url: '/sounds/ocean.mp3',
      duration: 600,
      volume: 0.55,
      isPlaying: false,
      isFavorite: true,
      isCustom: false,
      createdAt: new Date(),
    },
    {
      id: 'wind',
      name: 'Wind Through Trees',
      category: 'nature',
      icon: <FaWind />,
      url: '/sounds/wind.mp3',
      duration: 480,
      volume: 0.6,
      isPlaying: false,
      isFavorite: false,
      isCustom: false,
      createdAt: new Date(),
    },
    {
      id: 'mountains',
      name: 'Mountain Ambience',
      category: 'nature',
      icon: <FaMountain />,
      url: '/sounds/mountains.mp3',
      duration: 660,
      volume: 0.7,
      isPlaying: false,
      isFavorite: false,
      isCustom: false,
      createdAt: new Date(),
    },
    {
      id: 'city',
      name: 'City Sounds',
      category: 'ambient',
      icon: <FaCity />,
      url: '/sounds/city.mp3',
      duration: 600,
      volume: 0.4,
      isPlaying: false,
      isFavorite: false,
      isCustom: false,
      createdAt: new Date(),
    },
    {
      id: 'focus',
      name: 'Focus Music',
      category: 'focus',
      icon: <FaBrain />,
      url: '/sounds/focus.mp3',
      duration: 1800,
      volume: 0.5,
      isPlaying: false,
      isFavorite: true,
      isCustom: false,
      createdAt: new Date(),
    },
    {
      id: 'creative',
      name: 'Creative Flow',
      category: 'creative',
      icon: <FaHeart />,
      url: '/sounds/creative.mp3',
      duration: 1200,
      volume: 0.6,
      isPlaying: false,
      isFavorite: false,
      isCustom: false,
      createdAt: new Date(),
    },
  ];

  // Initialize tracks and playlists
  useEffect(() => {
    setTracks(defaultTracks);

    // Create default playlists
    const defaultPlaylists: Playlist[] = [
      {
        id: 'focus',
        name: 'Focus & Concentration',
        description: 'Sounds to help you focus and concentrate while writing',
        tracks: defaultTracks.filter(
          t => t.category === 'focus' || t.category === 'ambient'
        ),
        isActive: false,
        createdAt: new Date(),
      },
      {
        id: 'nature',
        name: 'Nature Sounds',
        description: 'Natural sounds to create a peaceful writing environment',
        tracks: defaultTracks.filter(t => t.category === 'nature'),
        isActive: false,
        createdAt: new Date(),
      },
      {
        id: 'creative',
        name: 'Creative Inspiration',
        description: 'Sounds to spark creativity and inspiration',
        tracks: defaultTracks.filter(
          t => t.category === 'creative' || t.category === 'ambient'
        ),
        isActive: false,
        createdAt: new Date(),
      },
    ];

    setPlaylists(defaultPlaylists);
  }, []);

  // Update time every second
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  // Play/pause track
  const toggleTrack = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    const audio = audioRefs.current[trackId];
    if (!audio) return;

    if (track.isPlaying) {
      audio.pause();
      setTracks(prev =>
        prev.map(t => (t.id === trackId ? { ...t, isPlaying: false } : t))
      );
    } else {
      audio.play();
      setTracks(prev =>
        prev.map(t => (t.id === trackId ? { ...t, isPlaying: true } : t))
      );
    }
  };

  // Stop all tracks
  const stopAllTracks = () => {
    tracks.forEach(track => {
      const audio = audioRefs.current[track.id];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    setTracks(prev => prev.map(t => ({ ...t, isPlaying: false })));
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Play playlist
  const playPlaylist = (playlist: Playlist) => {
    stopAllTracks();
    setActivePlaylist(playlist);

    playlist.tracks.forEach(track => {
      const audio = audioRefs.current[track.id];
      if (audio) {
        audio.volume = track.volume * globalVolume;
        audio.play();
      }
    });

    setTracks(prev =>
      prev.map(t => ({
        ...t,
        isPlaying: playlist.tracks.some(pt => pt.id === t.id),
      }))
    );

    setIsPlaying(true);
  };

  // Stop playlist
  const stopPlaylist = () => {
    stopAllTracks();
    setActivePlaylist(null);
  };

  // Toggle favorite
  const toggleFavorite = (trackId: string) => {
    setTracks(prev =>
      prev.map(t =>
        t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t
      )
    );
  };

  // Adjust track volume
  const adjustTrackVolume = (trackId: string, volume: number) => {
    setTracks(prev => prev.map(t => (t.id === trackId ? { ...t, volume } : t)));

    const audio = audioRefs.current[trackId];
    if (audio) {
      audio.volume = volume * globalVolume;
    }
  };

  // Create new playlist
  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: newPlaylistName,
      description: newPlaylistDescription,
      tracks: tracks.filter(t => selectedTracks.includes(t.id)),
      isActive: false,
      createdAt: new Date(),
    };

    setPlaylists(prev => [...prev, newPlaylist]);
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    setSelectedTracks([]);
    setIsCreatingPlaylist(false);
  };

  // Add custom track
  const addCustomTrack = () => {
    if (!customTrackName.trim() || !customTrackUrl.trim()) return;

    const newTrack: SoundTrack = {
      id: `track-${Date.now()}`,
      name: customTrackName,
      category: customTrackCategory as SoundTrack['category'],
      icon: <FaMusic />,
      url: customTrackUrl,
      duration: 0,
      volume: 0.5,
      isPlaying: false,
      isFavorite: false,
      isCustom: true,
      createdAt: new Date(),
    };

    setTracks(prev => [...prev, newTrack]);
    setCustomTrackName('');
    setCustomTrackUrl('');
    setCustomTrackCategory('ambient');
    setShowCustomTrackForm(false);
  };

  // Delete custom track
  const deleteCustomTrack = (trackId: string) => {
    setTracks(prev => prev.filter(t => t.id !== trackId));
  };

  // Filter tracks
  const filteredTracks = tracks.filter(track => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'favorites') return track.isFavorite;
    if (selectedCategory === 'custom') return track.isCustom;
    return track.category === selectedCategory;
  });

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-2xl font-bold flex items-center">
          <FaMusic className="mr-2" />
          Ambient Sounds
        </h2>

        <div className="flex items-center space-x-4">
          {/* Global Volume Control */}
          <div className="flex items-center space-x-2">
            <FaVolumeUp className="text-gray-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={globalVolume}
              onChange={e => setGlobalVolume(parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-gray-600 w-8">
              {Math.round(globalVolume * 100)}%
            </span>
          </div>

          {/* Mute Toggle */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </Button>

          {/* Stop All */}
          <Button variant="danger" size="sm" onClick={stopAllTracks}>
            <FaStop className="mr-1" />
            Stop All
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tracks List */}
        <div className="w-2/3 border-r">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Sounds</option>
                  <option value="nature">Nature</option>
                  <option value="ambient">Ambient</option>
                  <option value="focus">Focus</option>
                  <option value="creative">Creative</option>
                  <option value="relaxing">Relaxing</option>
                  <option value="favorites">Favorites</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowCustomTrackForm(true)}
                >
                  <FaPlus className="mr-1" />
                  Add Custom
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPlaylistManager(true)}
                >
                  <FaCog className="mr-1" />
                  Playlists
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto h-full">
            {filteredTracks.map(track => (
              <div
                key={track.id}
                className={`p-4 border-b hover:bg-gray-50 ${
                  track.isPlaying ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl text-gray-600">{track.icon}</div>

                    <div className="flex-1">
                      <h3 className="font-medium flex items-center">
                        {track.name}
                        {track.isFavorite && (
                          <FaBookmark className="ml-2 text-yellow-500" />
                        )}
                        {track.isCustom && (
                          <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Custom
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {track.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Volume Control */}
                    <div className="flex items-center space-x-2">
                      <FaVolumeDown className="text-gray-400" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={track.volume}
                        onChange={e =>
                          adjustTrackVolume(
                            track.id,
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-16"
                      />
                      <FaVolumeUp className="text-gray-400" />
                    </div>

                    {/* Play/Pause Button */}
                    <Button
                      variant={track.isPlaying ? 'danger' : 'primary'}
                      size="sm"
                      onClick={() => toggleTrack(track.id)}
                    >
                      {track.isPlaying ? <FaPause /> : <FaPlay />}
                    </Button>

                    {/* Favorite Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(track.id)}
                    >
                      <FaBookmark
                        className={
                          track.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                        }
                      />
                    </Button>

                    {/* Delete Button (for custom tracks) */}
                    {track.isCustom && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCustomTrack(track.id)}
                      >
                        <FaTrash className="text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Playlists Panel */}
        <div className="w-1/3 p-4">
          <h3 className="text-lg font-semibold mb-4">Playlists</h3>

          <div className="space-y-3">
            {playlists.map(playlist => (
              <Card
                key={playlist.id}
                className={`p-3 cursor-pointer hover:bg-gray-50 ${
                  activePlaylist?.id === playlist.id
                    ? 'bg-blue-50 border-blue-200'
                    : ''
                }`}
                onClick={() =>
                  activePlaylist?.id === playlist.id
                    ? stopPlaylist()
                    : playPlaylist(playlist)
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{playlist.name}</h4>
                    <p className="text-sm text-gray-600">
                      {playlist.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {playlist.tracks.length} tracks
                    </p>
                  </div>

                  <div className="text-2xl text-gray-400">
                    {activePlaylist?.id === playlist.id ? (
                      <FaStop />
                    ) : (
                      <FaPlay />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Create New Playlist Button */}
          <Button
            variant="secondary"
            className="w-full mt-4"
            onClick={() => setIsCreatingPlaylist(true)}
          >
            <FaPlus className="mr-2" />
            Create New Playlist
          </Button>
        </div>
      </div>

      {/* Custom Track Form Modal */}
      {showCustomTrackForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Custom Track</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Track Name
                </label>
                <input
                  type="text"
                  value={customTrackName}
                  onChange={e => setCustomTrackName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter track name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Audio URL
                </label>
                <input
                  type="url"
                  value={customTrackUrl}
                  onChange={e => setCustomTrackUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter audio file URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  value={customTrackCategory}
                  onChange={e => setCustomTrackCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="nature">Nature</option>
                  <option value="ambient">Ambient</option>
                  <option value="focus">Focus</option>
                  <option value="creative">Creative</option>
                  <option value="relaxing">Relaxing</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowCustomTrackForm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={addCustomTrack}
                disabled={!customTrackName.trim() || !customTrackUrl.trim()}
              >
                Add Track
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Playlist Modal */}
      {isCreatingPlaylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Create New Playlist</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={e => setNewPlaylistName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter playlist name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={newPlaylistDescription}
                  onChange={e => setNewPlaylistDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
                  placeholder="Enter playlist description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Tracks
                </label>
                <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                  {tracks.map(track => (
                    <label
                      key={track.id}
                      className="flex items-center space-x-2 p-1"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTracks.includes(track.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedTracks(prev => [...prev, track.id]);
                          } else {
                            setSelectedTracks(prev =>
                              prev.filter(id => id !== track.id)
                            );
                          }
                        }}
                      />
                      <span className="text-sm">{track.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button
                variant="secondary"
                onClick={() => setIsCreatingPlaylist(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={createPlaylist}
                disabled={
                  !newPlaylistName.trim() || selectedTracks.length === 0
                }
              >
                Create Playlist
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Elements */}
      {tracks.map(track => (
        <audio
          key={track.id}
          ref={el => {
            if (el) {
              audioRefs.current[track.id] = el;
              el.volume = track.volume * globalVolume;
              el.muted = isMuted;
            }
          }}
          src={track.url}
          loop
          preload="metadata"
        />
      ))}
    </div>
  );
}
