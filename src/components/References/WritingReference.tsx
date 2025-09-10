'use client';
import { useState, useEffect, useMemo } from 'react';
import { writingStyles } from '@/references/writingStyles';
import { writingPrompts } from '@/references/writingPrompts';
import { WritingPrompt, FavoriteReference, WritingStyle } from '@/types/writing';

type ReferenceType = 'styles' | 'prompts' | 'favorites';
type PromptType = WritingPrompt['type'];
type PromptDifficulty = WritingPrompt['difficulty'];
type SortOption = 'name' | 'difficulty' | 'genre' | 'type' | 'date';
type SortDirection = 'asc' | 'desc';

type SortableItem = (WritingStyle | WritingPrompt) & { timestamp: number };

export default function WritingReference() {
  const [activeTab, setActiveTab] = useState<ReferenceType>('styles');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [promptType, setPromptType] = useState<PromptType>('character');
  const [promptDifficulty, setPromptDifficulty] = useState<PromptDifficulty>('beginner');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [favorites, setFavorites] = useState<FavoriteReference[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('writingFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('writingFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string, type: 'style' | 'prompt', name: string) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === id);
      if (exists) {
        return prev.filter(fav => fav.id !== id);
      } else {
        return [...prev, { id, type, name, timestamp: Date.now() }];
      }
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some(fav => fav.id === id);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    writingPrompts.forEach(prompt => {
      prompt.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  const sortItems = <T extends SortableItem>(
    items: T[],
    sortBy: SortOption,
    direction: SortDirection
  ) => {
    return [...items].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = ('name' in a ? a.name : a.title).localeCompare('name' in b ? b.name : b.title);
          break;
        case 'genre':
          comparison = ('genre' in a ? a.genre : '').localeCompare('genre' in b ? b.genre : '');
          break;
        case 'type':
          comparison = ('type' in a ? a.type : '').localeCompare('type' in b ? b.type : '');
          break;
        case 'difficulty':
          const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
          comparison = ('difficulty' in a ? difficultyOrder[a.difficulty] : 0) - 
                      ('difficulty' in b ? difficultyOrder[b.difficulty] : 0);
          break;
        case 'date':
          comparison = a.timestamp - b.timestamp;
          break;
      }
      return direction === 'asc' ? comparison : -comparison;
    });
  };

  const filteredPrompts = useMemo(() => {
    return writingPrompts.filter(prompt => {
      if (selectedGenre !== 'all' && prompt.genre !== selectedGenre) return false;
      if (prompt.type !== promptType) return false;
      if (prompt.difficulty !== promptDifficulty) return false;
      if (searchQuery && !prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !prompt.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedTags.length > 0 && !selectedTags.every(tag => prompt.tags.includes(tag))) return false;
      return true;
    });
  }, [selectedGenre, promptType, promptDifficulty, searchQuery, selectedTags]);

  const filteredStyles = useMemo(() => {
    return writingStyles.filter(style => {
      if (searchQuery && !style.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !style.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [searchQuery]);

  const genres = useMemo(() => {
    return Array.from(new Set(writingPrompts.map(p => p.genre))).sort();
  }, []);

  const renderFavorites = () => {
    const favoriteItems = favorites.map(fav => {
      if (fav.type === 'style') {
        const style = writingStyles.find(s => s.name === fav.name);
        if (!style) return null;
        return {
          ...style,
          timestamp: fav.timestamp
        } as SortableItem;
      } else {
        const prompt = writingPrompts.find(p => p.id === fav.id);
        if (!prompt) return null;
        return {
          ...prompt,
          timestamp: fav.timestamp
        } as SortableItem;
      }
    }).filter((item): item is SortableItem => item !== null);

    return (
      <div className="space-y-4">
        {favoriteItems.length > 0 ? (
          sortItems(favoriteItems, sortBy, sortDirection).map(item => {
            if ('title' in item) {
              return (
                <div key={item.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <button
                      onClick={() => toggleFavorite(item.id, 'prompt', item.title)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ★
                    </button>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            } else {
              return (
                <div key={item.name} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                    <button
                      onClick={() => toggleFavorite(item.name, 'style', item.name)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ★
                    </button>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              );
            }
          })
        ) : (
          <p className="text-gray-500 text-center">No favorites yet. Add some by clicking the star icon!</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('styles')}
            className={`px-4 py-2 rounded ${
              activeTab === 'styles'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Writing Styles
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-4 py-2 rounded ${
              activeTab === 'prompts'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Writing Prompts
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded ${
              activeTab === 'favorites'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Favorites
          </button>
        </div>

        <div className="mb-4 space-y-4">
          <input
            type="text"
            placeholder="Search references..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border rounded"
            >
              <option value="name">Sort by Name</option>
              <option value="genre">Sort by Genre</option>
              <option value="type">Sort by Type</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="date">Sort by Date</option>
            </select>

            <button
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border rounded"
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {activeTab === 'styles' ? (
          <div className="space-y-6">
            {filteredStyles.map(style => (
              <div
                key={style.name}
                className={`p-4 rounded-lg border ${
                  selectedStyle === style.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div
                    className="flex-grow cursor-pointer"
                    onClick={() => setSelectedStyle(style.name)}
                  >
                    <h3 className="text-xl font-bold mb-2">{style.name}</h3>
                    <p className="text-gray-600 mb-4">{style.description}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(style.name, 'style', style.name)}
                    className={`text-2xl ${
                      isFavorite(style.name) ? 'text-red-500' : 'text-gray-300'
                    } hover:text-red-700`}
                  >
                    ★
                  </button>
                </div>
                
                {selectedStyle === style.name && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Characteristics:</h4>
                      <ul className="list-disc list-inside">
                        {style.characteristics.map((char, i) => (
                          <li key={i} className="text-gray-700">{char}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Examples:</h4>
                      <ul className="list-disc list-inside">
                        {style.examples.map((example, i) => (
                          <li key={i} className="text-gray-700">{example}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Tips:</h4>
                      <ul className="list-disc list-inside">
                        {style.tips.map((tip, i) => (
                          <li key={i} className="text-gray-700">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : activeTab === 'prompts' ? (
          <div className="space-y-6">
            <div className="flex space-x-4 mb-6">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                <option value="all">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              
              <select
                value={promptType}
                onChange={(e) => setPromptType(e.target.value as PromptType)}
                className="px-3 py-2 border rounded"
              >
                <option value="character">Character</option>
                <option value="plot">Plot</option>
                <option value="setting">Setting</option>
                <option value="scene">Scene</option>
                <option value="dialogue">Dialogue</option>
              </select>
              
              <select
                value={promptDifficulty}
                onChange={(e) => setPromptDifficulty(e.target.value as PromptDifficulty)}
                className="px-3 py-2 border rounded"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="grid gap-4">
              {filteredPrompts.map(prompt => (
                <div
                  key={prompt.id}
                  className="p-4 border rounded-lg hover:border-blue-500 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{prompt.title}</h3>
                      <p className="text-gray-600 mb-2">{prompt.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {prompt.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(prompt.id, 'prompt', prompt.title)}
                      className={`text-2xl ${
                        isFavorite(prompt.id) ? 'text-red-500' : 'text-gray-300'
                      } hover:text-red-700`}
                    >
                      ★
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          renderFavorites()
        )}
      </div>
    </div>
  );
} 