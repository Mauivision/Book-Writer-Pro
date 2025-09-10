import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/utils/apiClient';
import {
  BookState,
  BookMetadata,
  Chapter,
  Character,
  Plot,
  Setting,
  GenerateChapterParams,
  GenerateCharacterParams,
  GeneratePlotParams,
  GenerateSettingParams,
  GenerateStoryParams,
  GenerateStoryResponse,
} from '@/types';
import { 
  Achievement, 
  UserProgress, 
  DailyChallenge, 
  ACHIEVEMENT_BADGES, 
  DAILY_CHALLENGES 
} from '@/types/achievements';

// Book Actions Interface
interface BookActions {
  // Metadata actions
  updateMetadata: (metadata: Partial<BookMetadata>) => void;
  createBook: (metadata: BookMetadata) => void;
  
  // Chapter actions
  addChapter: (chapter: Omit<Chapter, 'id' | 'lastModified'>) => void;
  updateChapter: (id: string, chapter: Partial<Chapter>) => void;
  removeChapter: (id: string) => void;
  deleteChapter: (id: string) => void; // Alias for removeChapter
  reorderChapters: (chapters: Chapter[]) => void;
  setCurrentChapter: (id: string) => void;
  
  // Character actions
  addCharacter: (character: Omit<Character, 'id'>) => void;
  updateCharacter: (id: string, character: Partial<Character>) => void;
  removeCharacter: (id: string) => void;
  addRelationship: (characterId: string, targetId: string, type: string) => void;
  removeRelationship: (characterId: string, targetId: string) => void;
  
  // Plot and Setting actions
  updatePlot: (plot: Partial<Plot>) => void;
  updateSetting: (setting: Partial<Setting>) => void;
  
  // Book actions
  saveBook: () => void;
  loadBook: (data: Partial<BookState>) => void;
  exportBook: (format: 'pdf' | 'epub' | 'markdown') => Promise<void>;
  
  // AI Generation actions
  generateChapter: (params: GenerateChapterParams) => Promise<Chapter>;
  generateCharacterIdeas: (params: GenerateCharacterParams) => Promise<Character[]>;
  generatePlotIdeas: (params: GeneratePlotParams) => Promise<string[]>;
  generateSettingIdeas: (params: GenerateSettingParams) => Promise<string[]>;
  
  // AI Enhancement actions
  autoCompleteText: (params: { text: string; context: string }) => Promise<string>;
  rewriteChapter: (params: { chapterId: string; instructions: string; style?: string; tone?: string }) => Promise<Chapter>;
  generateDialogue: (params: { characterId: string; context: string; style?: 'casual' | 'formal' | 'humorous' }) => Promise<string>;
  improveWriting: (params: { text: string; improve: 'clarity' | 'vividness' | 'conciseness' }) => Promise<string>;
  generateChapterTitle: (params: { content: string; style?: 'literal' | 'metaphorical' | 'dramatic' }) => Promise<string[]>;
  
  // Save generated content
  saveGeneratedCharacters: (characters: Character[]) => void;
  saveGeneratedPlot: (plot: string, asNewChapter?: boolean) => void;
  saveGeneratedSetting: (setting: string) => void;

  // Story Generation
  generateCompleteStory: (params: {
    genre: string;
    theme: string;
    complexity: 'beginner' | 'intermediate' | 'advanced';
    length: 'short' | 'medium' | 'long';
    customPrompt?: string;
  }) => Promise<void>;

  // Achievement and Gamification actions
  checkAchievements: () => void;
  unlockAchievement: (achievementId: string) => void;
  getDailyChallenge: () => DailyChallenge | null;
  completeDailyChallenge: (challengeId: string) => void;
  updateUserProgress: () => void;
  getCurrentStreak: () => number;
  addWritingSession: (wordCount: number) => void;

  // Network status
  isOnline: () => boolean;
}

// Store implementation
export const useBookStore = create<BookState & BookActions>()(
  persist(
    (set, get) => ({
      // Initial state
      metadata: {
        title: 'The Lost City of Eldara',
        author: 'Aaron Writer',
        genre: 'Fantasy',
        targetAudience: 'Young Adult',
        wordCountGoal: 80000,
        currentWordCount: 0,
        status: 'in-progress',
        synopsis: 'A young adventurer discovers an ancient city hidden in the mountains, but unlocking its secrets comes with a terrible price.',
        themes: ['Adventure', 'Discovery', 'Sacrifice'],
        setting: 'A mystical mountain range in a world where magic and technology coexist.',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        genres: ['Fantasy', 'Adventure'],
        description: 'A young adventurer discovers an ancient city hidden in the mountains, but unlocking its secrets comes with a terrible price.'
      },
      chapters: [
        {
          id: '1',
          title: 'The Discovery',
          content: 'The wind howled through the mountain pass as Sarah adjusted her pack and squinted against the setting sun. She had been climbing for three days, following the ancient map her grandfather had left her. The parchment was worn and fragile, but the markings were clear enough to guide her to this remote location.\n\n"Just a little further," she muttered to herself, her breath visible in the crisp mountain air. The map indicated that somewhere ahead lay the entrance to Eldara, the lost city of legend. According to her grandfather\'s stories, it was a place of incredible power and knowledge, but also of great danger.\n\nAs she rounded a bend in the narrow path, Sarah stopped dead in her tracks. There, carved into the solid rock face, was an enormous doorway. It stood at least twenty feet tall, with intricate symbols etched into its surface that seemed to glow with an otherworldly light.',
          summary: 'Sarah discovers the entrance to the lost city of Eldara after following her grandfather\'s map.',
          wordCount: 156,
          order: 1,
          status: 'draft',
          lastModified: new Date().toISOString()
        },
        {
          id: '2',
          title: 'The Guardian',
          content: 'The symbols on the door pulsed with increasing intensity as Sarah approached. She could feel the ancient magic emanating from the stone, making the hairs on the back of her neck stand up. This was real. This was actually happening.\n\nShe reached out a trembling hand toward the door, but before she could touch it, a deep voice echoed through the mountain pass.\n\n"Who dares to seek entry to Eldara?"\n\nSarah spun around, her heart pounding. Standing behind her was a figure that seemed to be made of living stone. It was humanoid in shape but towered over her, its eyes glowing with the same light as the door symbols.\n\n"I... I\'m Sarah," she managed to stammer. "My grandfather told me about this place. He said it held the answers I\'ve been looking for."\n\nThe guardian studied her for a long moment, its stone face expressionless. "Your grandfather was Marcus the Scholar?"\n\nSarah nodded, surprised. "You knew him?"\n\n"Knew him? I trained him," the guardian replied. "But that was many years ago, before the darkness came."',
          summary: 'Sarah meets the ancient guardian of Eldara who knew her grandfather.',
          wordCount: 189,
          order: 2,
          status: 'draft',
          lastModified: new Date().toISOString()
        }
      ],
      characters: [
        {
          id: '1',
          name: 'Sarah Chen',
          role: 'protagonist',
          description: 'A determined young adventurer in her early twenties, Sarah is intelligent, curious, and willing to take risks to uncover the truth about her family\'s past.',
          background: 'Raised by her grandfather after her parents disappeared when she was young. She has spent years studying ancient texts and maps, preparing for this journey.',
          motivations: ['Find her missing parents', 'Uncover family secrets', 'Prove herself worthy of her grandfather\'s legacy'],
          relationships: []
        },
        {
          id: '2',
          name: 'Marcus Chen',
          role: 'supporting',
          description: 'Sarah\'s grandfather, a renowned scholar and explorer who discovered Eldara decades ago but never returned from his last expedition.',
          background: 'Former professor of archaeology who specialized in ancient civilizations. He was the first to map the location of Eldara and understand its significance.',
          motivations: ['Protect his granddaughter', 'Preserve ancient knowledge', 'Redeem past mistakes'],
          relationships: []
        },
        {
          id: '3',
          name: 'The Guardian',
          role: 'supporting',
          description: 'An ancient being of living stone who has protected Eldara for centuries, maintaining the balance between the city\'s power and the outside world.',
          background: 'Created by the original builders of Eldara to serve as both protector and guide. Has witnessed the rise and fall of many civilizations.',
          motivations: ['Protect Eldara\'s secrets', 'Test worthy visitors', 'Maintain ancient balance'],
          relationships: []
        }
      ],
      currentChapterId: null,
      lastSaved: null,
      version: '1.0.0',
      plot: {
        summary: 'A young adventurer named Sarah Chen follows her grandfather\'s map to discover the lost city of Eldara, only to find that unlocking its ancient secrets comes with a terrible price that could change the world forever.',
        outline: [
          'Sarah discovers the entrance to Eldara using her grandfather\'s map',
          'She meets the ancient guardian who knew her grandfather',
          'The guardian reveals that Sarah\'s parents are still alive but trapped in the city',
          'Sarah must pass three trials to enter Eldara and rescue them',
          'Each trial reveals more about the city\'s dark history and her family\'s connection to it',
          'Sarah learns that her grandfather made a terrible sacrifice to protect the world from Eldara\'s power',
          'She must choose between saving her family and preventing the city\'s power from being unleashed'
        ]
      },
      setting: {
        description: '',
        worldBuilding: undefined,
      },
      currentBook: null,

      // Achievement and Gamification state
      achievements: [] as Achievement[],
      userProgress: {
        totalXP: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        totalWordsWritten: 0,
        chaptersCompleted: 0,
        charactersCreated: 0,
        achievementsUnlocked: 0,
        writingSessions: 0
      } as UserProgress,
      dailyChallenge: null as DailyChallenge | null,
      writingSessions: [] as Array<{ date: string; wordCount: number }>,

      // Metadata actions
      updateMetadata: (metadata) =>
        set((state) => ({
          metadata: { ...state.metadata, ...metadata },
        })),

      createBook: (metadata) =>
        set(() => ({
          metadata,
          chapters: [],
          characters: [],
          plot: {
            mainPlot: '',
            subplots: [],
            themes: [],
            conflicts: [],
            resolution: '',
          },
          setting: {
            timePeriod: '',
            location: '',
            atmosphere: '',
            worldbuilding: [],
          },
          currentChapter: null,
        })),

      // Chapter actions
      addChapter: (chapter) =>
        set((state) => ({
          chapters: [
            ...state.chapters,
            {
              ...chapter,
              id: crypto.randomUUID(),
              wordCount: 0,
              order: state.chapters.length,
              lastModified: new Date().toISOString(),
              summary: chapter.summary || '',
              status: 'draft'
            }
          ]
        })),

      updateChapter: (id, chapter) =>
        set((state) => ({
          chapters: state.chapters.map((c) =>
            c.id === id ? { ...c, ...chapter, lastModified: new Date().toISOString() } : c
          )
        })),

      removeChapter: (id) =>
        set((state) => ({
          chapters: state.chapters.filter((c) => c.id !== id)
        })),

      deleteChapter: (id) =>
        set((state) => ({
          chapters: state.chapters.filter((c) => c.id !== id)
        })),

      reorderChapters: (chapters) =>
        set({ chapters }),

      setCurrentChapter: (id) =>
        set(() => ({
          currentChapterId: id,
        })),

      // Character actions
      addCharacter: (character) =>
        set((state) => ({
          characters: [
            ...state.characters,
            {
              ...character,
              id: crypto.randomUUID(),
            },
          ],
        })),

      updateCharacter: (id, updates) =>
        set((state) => ({
          characters: state.characters.map((character) =>
            character.id === id ? { ...character, ...updates } : character
          ),
        })),

      removeCharacter: (id) =>
        set((state) => ({
          characters: state.characters.filter((character) => character.id !== id),
        })),

      addRelationship: (characterId, targetId, type) =>
        set((state) => ({
          characters: state.characters.map((character) =>
            character.id === characterId
              ? {
                  ...character,
                  relationships: [
                    ...character.relationships,
                    { characterId: targetId, type },
                  ],
                }
              : character
          ),
        })),

      removeRelationship: (characterId, targetId) =>
        set((state) => ({
          characters: state.characters.map((character) =>
            character.id === characterId
              ? {
                  ...character,
                  relationships: character.relationships.filter(
                    (rel) => rel.characterId !== targetId
                  ),
                }
              : character
          ),
        })),

      // Plot and Setting actions
      updatePlot: (plot) => set((state) => ({ plot: { ...state.plot, ...plot } })),
      updateSetting: (setting) => set((state) => ({ setting: { ...state.setting, ...setting } })),

      // Book actions
      saveBook: () =>
        set(() => ({
          lastSaved: new Date(),
        })),

      loadBook: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      exportBook: async (format) => {
        const state = get();
        // Export logic will be implemented in the export utility
        console.log(`Exporting book in ${format} format...`);
      },

      // AI Generation actions
      generateChapter: async ({ title, prompt, style = 'professional', tone = 'formal', pov = 'third', length = 1000, context }) => {
        try {
          const newChapter = await apiClient.generateChapter({ title, prompt, style, tone, pov, length, context });
          
          const chapter: Chapter = {
            id: crypto.randomUUID(),
            title: newChapter.title || title,
            content: newChapter.content || '',
            summary: newChapter.summary || '',
            wordCount: (newChapter.content || '').split(/\s+/).length,
            order: get().chapters.length,
            status: 'draft',
            lastModified: new Date().toISOString(),
          };
          
          set((state: BookState & BookActions) => ({
            chapters: [...state.chapters, chapter]
          }));
          
          return chapter;
        } catch (error) {
          console.error('Error generating chapter:', error);
          throw error;
        }
      },

      generateCharacterIdeas: async ({ genre, count = 3, role, archetype, personalityTraits, setting }) => {
        try {
          return await apiClient.generateCharacters({ genre, count, role, archetype, personalityTraits, setting });
        } catch (error) {
          console.error('Error generating character ideas:', error);
          throw error;
        }
      },

      generatePlotIdeas: async ({ genre, theme, complexity, characterRelationships, plotTwist, actStructure }) => {
        try {
          const result = await apiClient.generatePlot({ genre, theme, complexity, characterRelationships, plotTwist, actStructure });
          return Array.isArray(result) ? result : [result];
        } catch (error) {
          console.error('Error generating plot ideas:', error);
          throw error;
        }
      },

      generateSettingIdeas: async ({ genre, timePeriod, realism, culturalInfluences, climate }) => {
        try {
          const result = await apiClient.generateSetting({ genre, timePeriod, realism, culturalInfluences, climate });
          return Array.isArray(result) ? result : [result];
        } catch (error) {
          console.error('Error generating setting ideas:', error);
          throw error;
        }
      },

      // AI Enhancement actions
      autoCompleteText: async ({ text, context }) => {
        try {
          const result = await apiClient.autocomplete({
            currentText: text,
            context: {
              chapterId: '',
              chapterTitle: '',
              characters: [],
              plot: { 
                summary: get().plot.summary, 
                outline: get().plot.outline, 
                currentChapter: 1 
              },
              setting: { 
                description: get().setting.description, 
                worldBuilding: get().setting.worldBuilding || '' 
              },
              previousContent: '',
              genre: 'Fantasy',
              theme: 'Adventure'
            },
            completionType: 'sentence',
            maxWords: 50
          });
          return result.completion || result;
        } catch (error) {
          console.error('Error auto-completing text:', error);
          throw error;
        }
      },

      rewriteChapter: async ({ chapterId, instructions, style = 'casual', tone = 'formal' }) => {
        const chapter = get().chapters.find(c => c.id === chapterId);
        if (!chapter) throw new Error('Chapter not found');

        try {
          const result = await apiClient.rewriteChapter({
            content: chapter.content,
            instructions,
            style: style as 'professional' | 'creative' | 'casual',
            tone: tone as 'formal' | 'engaging' | 'humorous',
            context: {
              chapterTitle: chapter.title,
              characters: get().characters.map(c => ({
                id: c.id,
                name: c.name,
                role: c.role,
                description: c.description,
                background: c.background,
                motivations: c.motivations
              })),
              plot: get().plot,
              setting: get().setting,
              genre: get().metadata.genres[0] || 'Fantasy',
              theme: get().metadata.description || 'Adventure'
            }
          });

          const updatedContent = result.content;
          
          set(state => ({
            chapters: state.chapters.map(c => 
              c.id === chapterId 
                ? { ...c, content: updatedContent, lastModified: new Date().toISOString() }
                : c
            )
          }));
          
          return updatedContent;
        } catch (error) {
          console.error('Error rewriting chapter:', error);
          throw error;
        }
      },

      generateDialogue: async ({ characterId, context, style = 'casual' }) => {
        const character = get().characters.find(c => c.id === characterId);
        if (!character) throw new Error('Character not found');

        try {
          const result = await apiClient.autocomplete({
            currentText: context,
            context: {
              chapterId: '',
              chapterTitle: '',
              characters: [{
                id: character.id,
                name: character.name,
                role: character.role,
                description: character.description,
                background: character.background,
                motivations: character.motivations
              }],
              plot: { 
                summary: get().plot.summary, 
                outline: get().plot.outline, 
                currentChapter: 1 
              },
              setting: { 
                description: get().setting.description, 
                worldBuilding: get().setting.worldBuilding || '' 
              },
              previousContent: context,
              genre: get().metadata.genres[0] || 'Fantasy',
              theme: get().metadata.description || 'Adventure'
            },
            completionType: 'dialogue',
            maxWords: 100
          });
          
          return result.completion || result;
        } catch (error) {
          console.error('Error generating dialogue:', error);
          throw error;
        }
      },
      
      improveWriting: async ({ text, improve }) => {
        try {
          const result = await apiClient.autocomplete({
            currentText: text,
            context: {
              chapterId: '',
              chapterTitle: '',
              characters: [],
              plot: { 
                summary: get().plot.summary, 
                outline: get().plot.outline, 
                currentChapter: 1 
              },
              setting: { 
                description: get().setting.description, 
                worldBuilding: get().setting.worldBuilding || '' 
              },
              previousContent: text,
              genre: get().metadata.genres[0] || 'Fantasy',
              theme: get().metadata.description || 'Adventure'
            },
            completionType: 'paragraph',
            maxWords: text.split(' ').length + 50
          });
          
          return result.completion || result;
        } catch (error) {
          console.error('Error improving writing:', error);
          throw error;
        }
      },
      
      generateChapterTitle: async ({ content, style = 'literal' }) => {
        try {
          // Generate a title based on content
          const words = content.split(' ').slice(0, 10).join(' ');
          return [`${words}...`, `Chapter ${get().chapters.length + 1}`, `New Chapter`];
        } catch (error) {
          console.error('Error generating chapter titles:', error);
          throw error;
        }
      },

      // Save generated content
      saveGeneratedCharacters: (characters) => {
        set(state => ({
          characters: [...state.characters, ...characters.map(c => ({
            ...c,
            id: crypto.randomUUID(),
            relationships: []
          }))]
        }));
      },

      saveGeneratedPlot: (plot, asNewChapter = false) => {
        set(state => ({
          plot: { ...state.plot, summary: plot }
        }));
      },

      saveGeneratedSetting: (setting) => {
        set(state => ({
          setting: { ...state.setting, description: setting }
        }));
      },

      // Story Generation
      generateCompleteStory: async (params: {
        genre: string;
        theme: string;
        complexity: 'beginner' | 'intermediate' | 'advanced';
        length: 'short' | 'medium' | 'long';
        customPrompt?: string;
      }) => {
        try {
          const story = await apiClient.generateStory(params);
          
          set((state) => ({
            metadata: {
              ...state.metadata,
              title: story.title || state.metadata.title,
              genres: params.genre ? [params.genre] : state.metadata.genres,
              description: story.synopsis || state.metadata.description,
            },
            chapters: story.chapters?.map((chapter: any, index: number) => ({
              id: crypto.randomUUID(),
              title: chapter.title,
              content: chapter.content,
              summary: chapter.summary || `Chapter ${index + 1}: ${chapter.title}`,
              wordCount: chapter.content.split(/\s+/).length,
              order: index,
              status: 'draft',
              lastModified: new Date().toISOString(),
            })) || [],
            characters: story.characters?.map((character: any) => ({
              id: crypto.randomUUID(),
              name: character.name,
              role: character.role,
              description: character.description,
              background: character.background,
              motivations: character.motivations || [],
              relationships: character.relationships || [],
            })) || [],
            plot: {
              summary: story.plot?.summary || '',
              outline: story.plot?.outline || [],
              subplots: story.plot?.subplots || [],
            },
            setting: {
              description: story.setting?.description || '',
              worldBuilding: story.setting?.worldBuilding || '',
            },
          }));
        } catch (error) {
          console.error('Error generating story:', error);
          throw error;
        }
      },

             // Achievement and Gamification actions
       checkAchievements: () => {
         const state = get();
         const totalWords = state.chapters.reduce((sum, chapter) => sum + (chapter.content?.length || 0), 0);
         const chaptersCompleted = state.chapters.length;
         const charactersCreated = state.characters.length;
         const plotPoints = state.plot.outline?.length || 0;
         
         // Calculate current streak
         const today = new Date().toISOString().split('T')[0];
         const lastSession = state.writingSessions[state.writingSessions.length - 1];
         const currentStreak = lastSession && lastSession.date === today ? 
           Math.min(state.userProgress.currentStreak + 1, 100) : 0;

         // Update user progress
         const newProgress = {
           ...state.userProgress,
           totalWordsWritten: totalWords,
           chaptersCompleted,
           charactersCreated,
           currentStreak,
           longestStreak: Math.max(state.userProgress.longestStreak, currentStreak),
           writingSessions: state.writingSessions.length
         };

         // Check for new achievements
         const newAchievements: Achievement[] = [];
         
         ACHIEVEMENT_BADGES.forEach(badge => {
           const existingAchievement = state.achievements.find(a => a.id === badge.id);
           if (existingAchievement?.isUnlocked) return;

           let progress = 0;
           let maxProgress = badge.unlockCondition.value;
           let isUnlocked = false;

           switch (badge.unlockCondition.type) {
             case 'wordCount':
               progress = totalWords;
               isUnlocked = totalWords >= badge.unlockCondition.value;
               break;
             case 'chapters':
               progress = chaptersCompleted;
               isUnlocked = chaptersCompleted >= badge.unlockCondition.value;
               break;
             case 'characters':
               progress = charactersCreated;
               isUnlocked = charactersCreated >= badge.unlockCondition.value;
               break;
             case 'streak':
               progress = currentStreak;
               isUnlocked = currentStreak >= badge.unlockCondition.value;
               break;
             case 'plot':
               progress = plotPoints;
               isUnlocked = plotPoints >= badge.unlockCondition.value;
               break;
             case 'sessions':
               progress = state.writingSessions.length;
               isUnlocked = state.writingSessions.length >= badge.unlockCondition.value;
               break;
             case 'sessionWords':
               const maxSessionWords = Math.max(...state.writingSessions.map(s => s.wordCount), 0);
               progress = maxSessionWords;
               isUnlocked = maxSessionWords >= badge.unlockCondition.value;
               break;
           }

           if (isUnlocked && !existingAchievement) {
             newAchievements.push({
               ...badge,
               progress,
               maxProgress,
               isUnlocked: true,
               unlockedAt: new Date().toISOString()
             });
           } else if (!existingAchievement) {
             newAchievements.push({
               ...badge,
               progress,
               maxProgress,
               isUnlocked: false
             });
           }
         });

         set(state => ({
           achievements: [...state.achievements.filter(a => !newAchievements.find(n => n.id === a.id)), ...newAchievements],
           userProgress: newProgress
         }));

         // Return newly unlocked achievements for notifications
         return newAchievements.filter(a => a.isUnlocked);
       },

       unlockAchievement: (achievementId: string) => {
         set(state => ({
           achievements: state.achievements.map(a => 
             a.id === achievementId 
               ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() }
               : a
           ),
           userProgress: {
             ...state.userProgress,
             achievementsUnlocked: state.achievements.filter(a => a.isUnlocked).length + 1,
             totalXP: state.userProgress.totalXP + (state.achievements.find(a => a.id === achievementId)?.xpReward || 0)
           }
         }));
       },

       getDailyChallenge: () => {
         const state = get();
         if (state.dailyChallenge && new Date(state.dailyChallenge.expiresAt) > new Date()) {
           return state.dailyChallenge;
         }

         // Generate new daily challenge
         const challenge = DAILY_CHALLENGES[Math.floor(Math.random() * DAILY_CHALLENGES.length)];
         const tomorrow = new Date();
         tomorrow.setDate(tomorrow.getDate() + 1);
         
         const newChallenge: DailyChallenge = {
           ...challenge,
           id: crypto.randomUUID(),
           isCompleted: false,
           expiresAt: tomorrow.toISOString()
         };

         set({ dailyChallenge: newChallenge });
         return newChallenge;
       },

       completeDailyChallenge: (challengeId: string) => {
         const state = get();
         if (state.dailyChallenge?.id === challengeId && !state.dailyChallenge.isCompleted) {
           set(state => ({
             dailyChallenge: {
               ...state.dailyChallenge!,
               isCompleted: true,
               completedAt: new Date().toISOString()
             },
             userProgress: {
               ...state.userProgress,
               totalXP: state.userProgress.totalXP + (state.dailyChallenge?.reward || 0)
             }
           }));
         }
       },

       updateUserProgress: () => {
         const state = get();
         const totalWords = state.chapters.reduce((sum, chapter) => sum + (chapter.content?.length || 0), 0);
         
         set(state => ({
           userProgress: {
             ...state.userProgress,
             totalWordsWritten: totalWords,
             chaptersCompleted: state.chapters.length,
             charactersCreated: state.characters.length
           }
         }));
       },

       getCurrentStreak: () => {
         const state = get();
         return state.userProgress.currentStreak;
       },

       addWritingSession: (wordCount: number) => {
         const today = new Date().toISOString().split('T')[0];
         const state = get();
         
         // Check if we already have a session for today
         const existingSessionIndex = state.writingSessions.findIndex(s => s.date === today);
         
         if (existingSessionIndex >= 0) {
           // Update existing session
           const updatedSessions = [...state.writingSessions];
           updatedSessions[existingSessionIndex] = {
             ...updatedSessions[existingSessionIndex],
             wordCount: updatedSessions[existingSessionIndex].wordCount + wordCount
           };
           
           set({ writingSessions: updatedSessions });
         } else {
           // Add new session
           set(state => ({
             writingSessions: [...state.writingSessions, { date: today, wordCount }]
           }));
         }

         // Check achievements after adding session
         get().checkAchievements();
       },

       // Network status
       isOnline: () => {
         return apiClient.getOnlineStatus();
       },
    }),
    {
      name: 'book-storage',
      partialize: (state) => ({
        metadata: state.metadata,
        chapters: state.chapters,
        characters: state.characters,
        plot: state.plot,
        setting: state.setting,
        version: state.version,
      }),
    }
  )
); 