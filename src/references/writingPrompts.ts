import { WritingPrompt } from '@/types/writing';

export const writingPrompts: WritingPrompt[] = [
  // Character Prompts
  {
    id: 'char-001',
    title: 'The Reluctant Hero',
    description: 'Create a character who is forced into a heroic role against their will. What circumstances led them to this point? How do they cope with their new responsibilities?',
    genre: 'Fantasy',
    type: 'character',
    difficulty: 'intermediate',
    tags: ['hero', 'reluctance', 'responsibility']
  },
  {
    id: 'char-002',
    title: 'The Fallen Mentor',
    description: 'Develop a character who was once a respected mentor but has fallen from grace. What caused their downfall? How do they deal with their past reputation?',
    genre: 'Drama',
    type: 'character',
    difficulty: 'advanced',
    tags: ['mentor', 'redemption', 'past']
  },

  // Plot Prompts
  {
    id: 'plot-001',
    title: 'The Unexpected Discovery',
    description: 'Your protagonist finds something that changes their understanding of the world. What is it? How does it affect their life and relationships?',
    genre: 'Science Fiction',
    type: 'plot',
    difficulty: 'beginner',
    tags: ['discovery', 'change', 'revelation']
  },
  {
    id: 'plot-002',
    title: 'The Impossible Choice',
    description: 'Your character must make a decision that will hurt someone they love no matter what they choose. What is the choice? How do they handle it?',
    genre: 'Drama',
    type: 'plot',
    difficulty: 'advanced',
    tags: ['choice', 'conflict', 'consequence']
  },

  // Setting Prompts
  {
    id: 'setting-001',
    title: 'The Forgotten City',
    description: 'Describe a city that has been abandoned for centuries. What remains? What happened to its inhabitants? What secrets does it hold?',
    genre: 'Fantasy',
    type: 'setting',
    difficulty: 'intermediate',
    tags: ['abandoned', 'mystery', 'history']
  },
  {
    id: 'setting-002',
    title: 'The Floating Metropolis',
    description: 'Create a city that floats in the sky. How does it stay afloat? What kind of society lives there? What are the challenges of living in such a place?',
    genre: 'Science Fiction',
    type: 'setting',
    difficulty: 'advanced',
    tags: ['floating', 'technology', 'society']
  },

  // Scene Prompts
  {
    id: 'scene-001',
    title: 'The Last Stand',
    description: 'Write a scene where your character must make their final stand against overwhelming odds. What are they fighting for? What gives them the strength to continue?',
    genre: 'Action',
    type: 'scene',
    difficulty: 'intermediate',
    tags: ['battle', 'courage', 'determination']
  },
  {
    id: 'scene-002',
    title: 'The Silent Goodbye',
    description: 'Create a scene where two characters must part ways without speaking. What emotions are conveyed through their actions and expressions?',
    genre: 'Drama',
    type: 'scene',
    difficulty: 'advanced',
    tags: ['emotion', 'parting', 'silence']
  },

  // Dialogue Prompts
  {
    id: 'dialogue-001',
    title: 'The Truth Revealed',
    description: 'Write a dialogue where one character reveals a long-held secret to another. How does the revelation affect their relationship?',
    genre: 'Drama',
    type: 'dialogue',
    difficulty: 'intermediate',
    tags: ['secret', 'revelation', 'relationship']
  },
  {
    id: 'dialogue-002',
    title: 'The Misunderstanding',
    description: 'Create a dialogue where two characters are talking about completely different things without realizing it. How does the confusion escalate?',
    genre: 'Comedy',
    type: 'dialogue',
    difficulty: 'beginner',
    tags: ['misunderstanding', 'comedy', 'confusion']
  },
  {
    id: 'prompt-11',
    title: 'The Time Traveler\'s Dilemma',
    description: 'A character discovers they can travel through time, but each journey comes with an unexpected consequence.',
    genre: 'Science Fiction',
    type: 'plot',
    difficulty: 'intermediate',
    tags: ['time travel', 'consequences', 'moral choice', 'sci-fi']
  },
  {
    id: 'prompt-12',
    title: 'The Last Library',
    description: 'In a world where books are forbidden, a librarian secretly preserves the last remaining collection of literature.',
    genre: 'Dystopian',
    type: 'setting',
    difficulty: 'intermediate',
    tags: ['books', 'resistance', 'knowledge', 'dystopia']
  },
  {
    id: 'prompt-13',
    title: 'The Memory Thief',
    description: 'A character who can steal memories from others must decide whether to use this power for good or personal gain.',
    genre: 'Fantasy',
    type: 'character',
    difficulty: 'advanced',
    tags: ['memories', 'power', 'moral dilemma', 'supernatural']
  },
  {
    id: 'prompt-14',
    title: 'The Silent Witness',
    description: 'A mute character must find a way to communicate crucial information that could save lives.',
    genre: 'Thriller',
    type: 'character',
    difficulty: 'intermediate',
    tags: ['communication', 'suspense', 'determination', 'thriller']
  },
  {
    id: 'prompt-15',
    title: 'The Quantum Cafe',
    description: 'A cafe where each table exists in a different time period, and the staff must navigate between them.',
    genre: 'Science Fiction',
    type: 'setting',
    difficulty: 'advanced',
    tags: ['time', 'cafe', 'parallel worlds', 'sci-fi']
  },
  {
    id: 'prompt-16',
    title: 'The Forgotten Language',
    description: 'A linguist discovers an ancient language that, when spoken, can alter reality.',
    genre: 'Fantasy',
    type: 'plot',
    difficulty: 'advanced',
    tags: ['language', 'magic', 'discovery', 'power']
  },
  {
    id: 'prompt-17',
    title: 'The Last Performance',
    description: 'A retired actor is offered one final role that could change their legacy forever.',
    genre: 'Drama',
    type: 'scene',
    difficulty: 'intermediate',
    tags: ['acting', 'legacy', 'redemption', 'drama']
  },
  {
    id: 'prompt-18',
    title: 'The Weather Maker',
    description: 'A character who can control the weather must decide how to use their power during a climate crisis.',
    genre: 'Fantasy',
    type: 'character',
    difficulty: 'intermediate',
    tags: ['weather', 'power', 'responsibility', 'climate']
  },
  {
    id: 'prompt-19',
    title: 'The Dream Architect',
    description: 'A character who designs other people\'s dreams must confront their own nightmares.',
    genre: 'Psychological',
    type: 'plot',
    difficulty: 'advanced',
    tags: ['dreams', 'psychology', 'confrontation', 'surreal']
  },
  {
    id: 'prompt-20',
    title: 'The Last Message',
    description: 'A character receives a message from their future self, warning of an impending disaster.',
    genre: 'Science Fiction',
    type: 'dialogue',
    difficulty: 'intermediate',
    tags: ['time', 'warning', 'fate', 'sci-fi']
  },
  {
    id: 'prompt-21',
    title: 'The Color Thief',
    description: 'In a world where colors are a finite resource, a character discovers they can steal colors from others.',
    genre: 'Fantasy',
    type: 'character',
    difficulty: 'beginner',
    tags: ['colors', 'magic', 'theft', 'fantasy']
  },
  {
    id: 'prompt-22',
    title: 'The Recipe for Immortality',
    description: 'A chef discovers a recipe that grants eternal life, but at a terrible cost.',
    genre: 'Fantasy',
    type: 'plot',
    difficulty: 'intermediate',
    tags: ['food', 'immortality', 'sacrifice', 'magic']
  },
  {
    id: 'prompt-23',
    title: 'The Last Garden',
    description: 'In a world of artificial environments, a character tends to the last natural garden.',
    genre: 'Science Fiction',
    type: 'setting',
    difficulty: 'beginner',
    tags: ['nature', 'preservation', 'hope', 'sci-fi']
  },
  {
    id: 'prompt-24',
    title: 'The Memory Palace',
    description: 'A character builds a palace in their mind to store their memories, but some begin to escape.',
    genre: 'Psychological',
    type: 'setting',
    difficulty: 'advanced',
    tags: ['memories', 'mind', 'escape', 'psychological']
  },
  {
    id: 'prompt-25',
    title: 'The Truth Speaker',
    description: 'A character who cannot tell lies must navigate a world of deception and political intrigue.',
    genre: 'Fantasy',
    type: 'character',
    difficulty: 'intermediate',
    tags: ['truth', 'politics', 'integrity', 'fantasy']
  }
]; 