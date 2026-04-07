interface WritingStyle {
  name: string;
  description: string;
  characteristics: string[];
  examples: string[];
  tips: string[];
}

export const writingStyles: WritingStyle[] = [
  {
    name: 'Literary Fiction',
    description:
      'A style focused on artistic merit, character development, and thematic depth.',
    characteristics: [
      'Complex character development',
      'Rich thematic exploration',
      'Sophisticated prose',
      'Emphasis on style over plot',
      'Deep psychological insight',
    ],
    examples: [
      'The Great Gatsby by F. Scott Fitzgerald',
      'To Kill a Mockingbird by Harper Lee',
      '1984 by George Orwell',
    ],
    tips: [
      'Focus on character psychology and motivation',
      'Use rich, descriptive language',
      'Develop complex themes and symbolism',
      'Create multi-layered narratives',
      'Pay attention to prose rhythm and flow',
    ],
  },
  {
    name: 'Fantasy',
    description:
      'A style that incorporates magical and supernatural elements into the narrative.',
    characteristics: [
      'World-building',
      'Magic systems',
      'Heroic journeys',
      'Good vs. evil themes',
      'Mythical creatures',
    ],
    examples: [
      'The Lord of the Rings by J.R.R. Tolkien',
      'Harry Potter by J.K. Rowling',
      'A Game of Thrones by George R.R. Martin',
    ],
    tips: [
      'Create consistent magic systems',
      'Develop rich world histories',
      'Balance magic with character development',
      'Create unique creatures and races',
      'Maintain internal consistency',
    ],
  },
  {
    name: 'Science Fiction',
    description:
      'A style that explores scientific and technological concepts in futuristic settings.',
    characteristics: [
      'Scientific accuracy',
      'Futuristic settings',
      'Technological innovation',
      'Social commentary',
      'Speculative elements',
    ],
    examples: [
      'Dune by Frank Herbert',
      'Neuromancer by William Gibson',
      'The Three-Body Problem by Liu Cixin',
    ],
    tips: [
      'Research scientific concepts thoroughly',
      'Consider social implications of technology',
      'Create believable future societies',
      'Balance technical details with story',
      'Explore ethical implications',
    ],
  },
  {
    name: 'Mystery/Thriller',
    description:
      'A style focused on suspense, intrigue, and solving puzzles or crimes.',
    characteristics: [
      'Suspense building',
      'Clue placement',
      'Plot twists',
      'Character motives',
      'Tension maintenance',
    ],
    examples: [
      'The Da Vinci Code by Dan Brown',
      'Gone Girl by Gillian Flynn',
      'The Girl with the Dragon Tattoo by Stieg Larsson',
    ],
    tips: [
      'Plant clues strategically',
      'Maintain consistent pacing',
      'Create believable red herrings',
      'Develop complex character motivations',
      'Build tension gradually',
    ],
  },
  {
    name: 'Romance',
    description:
      'A style focused on romantic relationships and emotional development.',
    characteristics: [
      'Character chemistry',
      'Emotional depth',
      'Relationship development',
      'Conflict resolution',
      'Happy endings',
    ],
    examples: [
      'Pride and Prejudice by Jane Austen',
      'The Notebook by Nicholas Sparks',
      'Outlander by Diana Gabaldon',
    ],
    tips: [
      'Develop authentic character chemistry',
      'Create meaningful conflicts',
      'Balance romance with plot',
      'Write realistic dialogue',
      'Build emotional tension',
    ],
  },
  {
    name: 'Historical Fiction',
    description:
      'Blends historical facts with fictional narratives, bringing past eras to life through compelling characters and events.',
    characteristics: [
      'Meticulous historical research and accuracy',
      'Authentic period details and settings',
      'Real historical figures alongside fictional characters',
      'Balance between historical events and personal stories',
      'Rich cultural and social context',
    ],
    examples: [
      'The Pillars of the Earth by Ken Follett',
      'Wolf Hall by Hilary Mantel',
      'The Book Thief by Markus Zusak',
    ],
    tips: [
      "Research extensively but don't let it overshadow the story",
      'Create authentic dialogue that reflects the period without being inaccessible',
      'Weave historical events naturally into character arcs',
      'Use sensory details to bring historical settings to life',
      'Maintain historical accuracy while allowing creative freedom',
    ],
  },
  {
    name: 'Horror',
    description:
      'Creates fear, dread, and suspense through supernatural elements, psychological terror, or physical threats.',
    characteristics: [
      'Building tension and suspense',
      'Atmospheric settings and mood',
      'Psychological or supernatural elements',
      'Fear of the unknown',
      'Disturbing imagery and themes',
    ],
    examples: [
      'The Shining by Stephen King',
      'The Haunting of Hill House by Shirley Jackson',
      'Mexican Gothic by Silvia Moreno-Garcia',
    ],
    tips: [
      'Build tension gradually through pacing',
      'Use sensory details to create atmosphere',
      "Leave some elements to the reader's imagination",
      'Create relatable characters to ground the horror',
      'Balance explicit and implicit horror',
    ],
  },
  {
    name: 'Young Adult',
    description:
      'Targets teenage readers with coming-of-age stories, exploring themes of identity, relationships, and personal growth.',
    characteristics: [
      'Teenage protagonists and perspectives',
      'Coming-of-age themes',
      'Fast-paced plots',
      'Relatable emotional experiences',
      'Contemporary or fantasy settings',
    ],
    examples: [
      'The Fault in Our Stars by John Green',
      'The Hunger Games by Suzanne Collins',
      'The Perks of Being a Wallflower by Stephen Chbosky',
    ],
    tips: [
      'Write authentic teenage voices and experiences',
      'Address real issues while maintaining hope',
      'Create compelling character arcs',
      'Balance serious themes with engaging plots',
      "Respect your young audience's intelligence",
    ],
  },
  {
    name: 'Magical Realism',
    description:
      'Blends realistic settings with magical elements, treating the supernatural as a natural part of everyday life.',
    characteristics: [
      'Realistic settings with magical elements',
      'Matter-of-fact treatment of the supernatural',
      'Rich cultural and social context',
      'Symbolic and metaphorical elements',
      'Blurred lines between reality and fantasy',
    ],
    examples: [
      'One Hundred Years of Solitude by Gabriel García Márquez',
      'The House of the Spirits by Isabel Allende',
      'Like Water for Chocolate by Laura Esquivel',
    ],
    tips: [
      'Treat magical elements as natural occurrences',
      'Use magic to explore deeper themes',
      'Maintain internal consistency',
      'Draw from cultural traditions and folklore',
      'Balance the magical with the mundane',
    ],
  },
];
