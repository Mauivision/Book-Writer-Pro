'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  FaPalette,
  FaSun,
  FaMoon,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaUndo,
  FaRedo,
  FaDownload,
  FaUpload,
  FaCog,
  FaCheck,
  FaTimes,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCopy,
  FaShare,
  FaBookmark,
  FaHeart,
  FaStar,
  FaFire,
  FaLeaf,
  FaWater,
  FaMountain,
  FaCity,
  FaCoffee,
  FaBrain,
  FaMagic,
  FaRocket,
  FaGem,
  FaCrown,
  FaDragon,
  FaUnicorn,
  FaRainbow,
  FaSnowflake,
  FaCloud,
  FaTree,
  FaFlower,
  FaButterfly,
  FaFish,
  FaBird,
  FaCat,
  FaDog,
  FaHorse,
  FaLion,
  FaTiger,
  FaElephant,
  FaPanda,
  FaKoala,
  FaPenguin,
  FaOwl,
  FaEagle,
  FaDove,
  FaSparrow,
  FaRobin,
  FaCardinal,
  FaBluebird,
  FaHummingbird,
  FaPeacock,
  FaSwan,
  FaDuck,
  FaGoose,
  FaChicken,
  FaRooster,
  FaTurkey,
  FaPigeon,
  FaCrow,
  FaRaven,
  FaMagpie,
  FaJay,
  FaWoodpecker,
  FaKingfisher,
  FaHeron,
  FaCrane,
  FaStork,
  FaFlamingo,
  FaPelican,
  FaAlbatross,
  FaSeagull,
  FaTern,
  FaGull,
  FaPetrel,
  FaFulmar,
  FaShearwater,
  FaStormPetrel,
  FaDivingPetrel,
  FaPrion,
  FaSkua,
  FaJaeger,
  FaGannet,
  FaBooby,
  FaCormorant,
  FaShag,
  FaAnhinga,
  FaDarter,
  FaFrigatebird,
  FaTropicbird,
  FaTern,
  FaNoddy,
  FaSkuas,
  FaJaegers,
  FaGulls,
  FaTerns,
  FaNoddies,
  FaSkuas,
  FaJaegers,
  FaGulls,
  FaTerns,
  FaNoddies
} from 'react-icons/fa';

interface WritingTheme {
  id: string;
  name: string;
  description: string;
  category: 'light' | 'dark' | 'colorful' | 'minimal' | 'nature' | 'cosmic' | 'vintage' | 'modern';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
    border: string;
    shadow: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  effects: {
    blur: boolean;
    glow: boolean;
    shadow: boolean;
    gradient: boolean;
    animation: boolean;
  };
  icon: React.ReactNode;
  isCustom: boolean;
  isFavorite: boolean;
  createdAt: Date;
}

interface ThemeSettings {
  currentTheme: string;
  autoSwitch: boolean;
  switchTime: string;
  customThemes: WritingTheme[];
  favorites: string[];
  recent: string[];
}

export default function ThemeSelector() {
  const [themes, setThemes] = useState<WritingTheme[]>([]);
  const [currentTheme, setCurrentTheme] = useState<WritingTheme | null>(null);
  const [settings, setSettings] = useState<ThemeSettings>({
    currentTheme: 'default',
    autoSwitch: false,
    switchTime: '18:00',
    customThemes: [],
    favorites: [],
    recent: []
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCustomThemeForm, setShowCustomThemeForm] = useState(false);
  const [isEditingTheme, setIsEditingTheme] = useState(false);
  const [editingTheme, setEditingTheme] = useState<WritingTheme | null>(null);
  const [customThemeName, setCustomThemeName] = useState('');
  const [customThemeDescription, setCustomThemeDescription] = useState('');
  const [customThemeCategory, setCustomThemeCategory] = useState<string>('modern');
  const [customThemeColors, setCustomThemeColors] = useState({
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    accent: '#f59e0b',
    border: '#e2e8f0',
    shadow: '#000000'
  });
  const [customThemeFonts, setCustomThemeFonts] = useState({
    heading: 'Inter',
    body: 'Inter',
    mono: 'JetBrains Mono'
  });
  const [customThemeEffects, setCustomThemeEffects] = useState({
    blur: false,
    glow: false,
    shadow: true,
    gradient: false,
    animation: false
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<WritingTheme | null>(null);

  // Default themes
  const defaultThemes: WritingTheme[] = [
    {
      id: 'default',
      name: 'Default',
      description: 'Clean and professional default theme',
      category: 'light',
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        accent: '#f59e0b',
        border: '#e2e8f0',
        shadow: '#000000'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        mono: 'JetBrains Mono'
      },
      effects: {
        blur: false,
        glow: false,
        shadow: true,
        gradient: false,
        animation: false
      },
      icon: <FaSun />,
      isCustom: false,
      isFavorite: true,
      createdAt: new Date()
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      description: 'Easy on the eyes for night writing',
      category: 'dark',
      colors: {
        primary: '#60a5fa',
        secondary: '#94a3b8',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        accent: '#fbbf24',
        border: '#334155',
        shadow: '#000000'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        mono: 'JetBrains Mono'
      },
      effects: {
        blur: false,
        glow: true,
        shadow: true,
        gradient: false,
        animation: false
      },
      icon: <FaMoon />,
      isCustom: false,
      isFavorite: true,
      createdAt: new Date()
    },
    {
      id: 'cozy',
      name: 'Cozy Writing',
      description: 'Warm and inviting atmosphere',
      category: 'nature',
      colors: {
        primary: '#d97706',
        secondary: '#a3a3a3',
        background: '#fef3c7',
        surface: '#fde68a',
        text: '#92400e',
        accent: '#f59e0b',
        border: '#fbbf24',
        shadow: '#000000'
      },
      fonts: {
        heading: 'Merriweather',
        body: 'Merriweather',
        mono: 'JetBrains Mono'
      },
      effects: {
        blur: false,
        glow: false,
        shadow: true,
        gradient: true,
        animation: false
      },
      icon: <FaCoffee />,
      isCustom: false,
      isFavorite: false,
      createdAt: new Date()
    },
    {
      id: 'focus',
      name: 'Focus Mode',
      description: 'Minimal distractions for deep work',
      category: 'minimal',
      colors: {
        primary: '#059669',
        secondary: '#6b7280',
        background: '#ffffff',
        surface: '#ffffff',
        text: '#111827',
        accent: '#10b981',
        border: '#d1d5db',
        shadow: '#000000'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        mono: 'JetBrains Mono'
      },
      effects: {
        blur: false,
        glow: false,
        shadow: false,
        gradient: false,
        animation: false
      },
      icon: <FaBrain />,
      isCustom: false,
      isFavorite: true,
      createdAt: new Date()
    },
    {
      id: 'creative',
      name: 'Creative Flow',
      description: 'Inspiring colors for creative writing',
      category: 'colorful',
      colors: {
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        background: '#faf5ff',
        surface: '#f3e8ff',
        text: '#581c87',
        accent: '#ec4899',
        border: '#c4b5fd',
        shadow: '#000000'
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Inter',
        mono: 'JetBrains Mono'
      },
      effects: {
        blur: false,
        glow: true,
        shadow: true,
        gradient: true,
        animation: true
      },
      icon: <FaMagic />,
      isCustom: false,
      isFavorite: false,
      createdAt: new Date()
    },
    {
      id: 'vintage',
      name: 'Vintage Library',
      description: 'Classic library atmosphere',
      category: 'vintage',
      colors: {
        primary: '#92400e',
        secondary: '#78716c',
        background: '#fef7ed',
        surface: '#fed7aa',
        text: '#451a03',
        accent: '#d97706',
        border: '#fbbf24',
        shadow: '#000000'
      },
      fonts: {
        heading: 'Crimson Text',
        body: 'Crimson Text',
        mono: 'JetBrains Mono'
      },
      effects: {
        blur: false,
        glow: false,
        shadow: true,
        gradient: false,
        animation: false
      },
      icon: <FaBook />,
      isCustom: false,
      isFavorite: false,
      createdAt: new Date()
    },
    {
      id: 'cosmic',
      name: 'Cosmic Dreams',
      description: 'Space-inspired theme for sci-fi writing',
      category: 'cosmic',
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        background: '#0f0f23',
        surface: '#1a1a2e',
        text: '#e2e8f0',
        accent: '#f59e0b',
        border: '#374151',
        shadow: '#000000'
      },
      fonts: {
        heading: 'Orbitron',
        body: 'Inter',
        mono: 'JetBrains Mono'
      },
      effects: {
        blur: true,
        glow: true,
        shadow: true,
        gradient: true,
        animation: true
      },
      icon: <FaRocket />,
      isCustom: false,
      isFavorite: false,
      createdAt: new Date()
    },
    {
      id: 'nature',
      name: 'Forest Retreat',
      description: 'Natural green tones for peaceful writing',
      category: 'nature',
      colors: {
        primary: '#059669',
        secondary: '#6b7280',
        background: '#f0fdf4',
        surface: '#dcfce7',
        text: '#14532d',
        accent: '#22c55e',
        border: '#bbf7d0',
        shadow: '#000000'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        mono: 'JetBrains Mono'
      },
      effects: {
        blur: false,
        glow: false,
        shadow: true,
        gradient: false,
        animation: false
      },
      icon: <FaLeaf />,
      isCustom: false,
      isFavorite: false,
      createdAt: new Date()
    }
  ];

  // Initialize themes
  useEffect(() => {
    setThemes(defaultThemes);
    setCurrentTheme(defaultThemes[0]);
  }, []);

  // Apply theme
  const applyTheme = (theme: WritingTheme) => {
    setCurrentTheme(theme);
    
    // Apply CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-shadow', theme.colors.shadow);
    
    // Apply fonts
    root.style.setProperty('--font-heading', theme.fonts.heading);
    root.style.setProperty('--font-body', theme.fonts.body);
    root.style.setProperty('--font-mono', theme.fonts.mono);
    
    // Apply effects
    if (theme.effects.blur) {
      root.classList.add('theme-blur');
    } else {
      root.classList.remove('theme-blur');
    }
    
    if (theme.effects.glow) {
      root.classList.add('theme-glow');
    } else {
      root.classList.remove('theme-glow');
    }
    
    if (theme.effects.shadow) {
      root.classList.add('theme-shadow');
    } else {
      root.classList.remove('theme-shadow');
    }
    
    if (theme.effects.gradient) {
      root.classList.add('theme-gradient');
    } else {
      root.classList.remove('theme-gradient');
    }
    
    if (theme.effects.animation) {
      root.classList.add('theme-animation');
    } else {
      root.classList.remove('theme-animation');
    }
    
    // Update settings
    setSettings(prev => ({
      ...prev,
      currentTheme: theme.id,
      recent: [theme.id, ...prev.recent.filter(id => id !== theme.id)].slice(0, 5)
    }));
  };

  // Toggle favorite
  const toggleFavorite = (themeId: string) => {
    setThemes(prev => prev.map(theme => 
      theme.id === themeId 
        ? { ...theme, isFavorite: !theme.isFavorite }
        : theme
    ));
    
    setSettings(prev => ({
      ...prev,
      favorites: prev.favorites.includes(themeId)
        ? prev.favorites.filter(id => id !== themeId)
        : [...prev.favorites, themeId]
    }));
  };

  // Create custom theme
  const createCustomTheme = () => {
    if (!customThemeName.trim()) return;

    const newTheme: WritingTheme = {
      id: `custom-${Date.now()}`,
      name: customThemeName,
      description: customThemeDescription,
      category: customThemeCategory as WritingTheme['category'],
      colors: customThemeColors,
      fonts: customThemeFonts,
      effects: customThemeEffects,
      icon: <FaPalette />,
      isCustom: true,
      isFavorite: false,
      createdAt: new Date()
    };

    setThemes(prev => [...prev, newTheme]);
    setSettings(prev => ({
      ...prev,
      customThemes: [...prev.customThemes, newTheme]
    }));

    // Reset form
    setCustomThemeName('');
    setCustomThemeDescription('');
    setCustomThemeCategory('modern');
    setCustomThemeColors({
      primary: '#3b82f6',
      secondary: '#64748b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      accent: '#f59e0b',
      border: '#e2e8f0',
      shadow: '#000000'
    });
    setCustomThemeFonts({
      heading: 'Inter',
      body: 'Inter',
      mono: 'JetBrains Mono'
    });
    setCustomThemeEffects({
      blur: false,
      glow: false,
      shadow: true,
      gradient: false,
      animation: false
    });
    setShowCustomThemeForm(false);
  };

  // Delete custom theme
  const deleteCustomTheme = (themeId: string) => {
    setThemes(prev => prev.filter(theme => theme.id !== themeId));
    setSettings(prev => ({
      ...prev,
      customThemes: prev.customThemes.filter(theme => theme.id !== themeId)
    }));
  };

  // Preview theme
  const previewTheme = (theme: WritingTheme) => {
    setPreviewTheme(theme);
    setShowPreview(true);
  };

  // Filter themes
  const filteredThemes = themes.filter(theme => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'favorites') return theme.isFavorite;
    if (selectedCategory === 'custom') return theme.isCustom;
    return theme.category === selectedCategory;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-2xl font-bold flex items-center">
          <FaPalette className="mr-2" />
          Writing Themes
        </h2>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCustomThemeForm(true)}
          >
            <FaPlus className="mr-1" />
            Create Theme
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Themes List */}
          <div className="w-2/3 border-r">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Themes</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="colorful">Colorful</option>
                  <option value="minimal">Minimal</option>
                  <option value="nature">Nature</option>
                  <option value="cosmic">Cosmic</option>
                  <option value="vintage">Vintage</option>
                  <option value="modern">Modern</option>
                  <option value="favorites">Favorites</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="overflow-y-auto h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {filteredThemes.map(theme => (
                  <Card
                    key={theme.id}
                    className={`p-4 cursor-pointer hover:shadow-lg transition-shadow ${
                      currentTheme?.id === theme.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => applyTheme(theme)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="text-2xl" style={{ color: theme.colors.primary }}>
                          {theme.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{theme.name}</h3>
                          <p className="text-sm text-gray-600">{theme.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {theme.isFavorite && <FaBookmark className="text-yellow-500" />}
                        {theme.isCustom && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Custom</span>}
                      </div>
                    </div>

                    {/* Color Preview */}
                    <div className="flex space-x-1 mb-3">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.colors.primary }}
                        title="Primary"
                      />
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.colors.secondary }}
                        title="Secondary"
                      />
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.colors.background }}
                        title="Background"
                      />
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.colors.surface }}
                        title="Surface"
                      />
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.colors.accent }}
                        title="Accent"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(theme.id);
                          }}
                        >
                          <FaBookmark className={theme.isFavorite ? 'text-yellow-500' : 'text-gray-400'} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            previewTheme(theme);
                          }}
                        >
                          <FaEye />
                        </Button>
                      </div>
                      
                      {theme.isCustom && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomTheme(theme.id);
                          }}
                        >
                          <FaTrash className="text-red-500" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Current Theme Info */}
          <div className="w-1/3 p-4">
            {currentTheme ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Theme</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="text-2xl" style={{ color: currentTheme.colors.primary }}>
                      {currentTheme.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{currentTheme.name}</h4>
                      <p className="text-sm text-gray-600">{currentTheme.description}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Colors</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: currentTheme.colors.primary }}
                      />
                      <span>Primary</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: currentTheme.colors.secondary }}
                      />
                      <span>Secondary</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: currentTheme.colors.background }}
                      />
                      <span>Background</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: currentTheme.colors.surface }}
                      />
                      <span>Surface</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: currentTheme.colors.text }}
                      />
                      <span>Text</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: currentTheme.colors.accent }}
                      />
                      <span>Accent</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Fonts</h4>
                  <div className="text-sm space-y-1">
                    <div>Heading: {currentTheme.fonts.heading}</div>
                    <div>Body: {currentTheme.fonts.body}</div>
                    <div>Mono: {currentTheme.fonts.mono}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Effects</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center space-x-2">
                      <FaCheck className={currentTheme.effects.blur ? 'text-green-500' : 'text-gray-400'} />
                      <span>Blur</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCheck className={currentTheme.effects.glow ? 'text-green-500' : 'text-gray-400'} />
                      <span>Glow</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCheck className={currentTheme.effects.shadow ? 'text-green-500' : 'text-gray-400'} />
                      <span>Shadow</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCheck className={currentTheme.effects.gradient ? 'text-green-500' : 'text-gray-400'} />
                      <span>Gradient</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaCheck className={currentTheme.effects.animation ? 'text-green-500' : 'text-gray-400'} />
                      <span>Animation</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <FaPalette className="mx-auto text-4xl mb-4" />
                <p>No theme selected</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Theme Form Modal */}
      {showCustomThemeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create Custom Theme</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Theme Name</label>
                <input
                  type="text"
                  value={customThemeName}
                  onChange={(e) => setCustomThemeName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter theme name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={customThemeDescription}
                  onChange={(e) => setCustomThemeDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                  placeholder="Enter theme description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={customThemeCategory}
                  onChange={(e) => setCustomThemeCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="colorful">Colorful</option>
                  <option value="minimal">Minimal</option>
                  <option value="nature">Nature</option>
                  <option value="cosmic">Cosmic</option>
                  <option value="vintage">Vintage</option>
                  <option value="modern">Modern</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Colors</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(customThemeColors).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => setCustomThemeColors(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-8 h-8 border rounded"
                      />
                      <span className="text-sm capitalize">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowCustomThemeForm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={createCustomTheme}
                disabled={!customThemeName.trim()}
              >
                Create Theme
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewTheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Theme Preview</h3>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg" style={{ backgroundColor: previewTheme.colors.surface }}>
                <h4 className="font-medium mb-2" style={{ color: previewTheme.colors.text }}>
                  Sample Heading
                </h4>
                <p className="text-sm" style={{ color: previewTheme.colors.text }}>
                  This is a sample paragraph to show how the theme looks. The colors and fonts will be applied to your writing environment.
                </p>
                <div className="mt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    style={{ backgroundColor: previewTheme.colors.primary }}
                  >
                    Sample Button
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowPreview(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  applyTheme(previewTheme);
                  setShowPreview(false);
                }}
              >
                Apply Theme
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
