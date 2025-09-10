// Character name generation
const firstNames = [
  'James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia',
  'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Charlotte', 'Alexander',
  'Amelia', 'Mason', 'Harper', 'Michael', 'Evelyn', 'Ethan', 'Abigail',
  'Daniel', 'Emily', 'Jacob', 'Elizabeth', 'Logan', 'Sofia', 'Jackson',
  'Avery', 'Sebastian', 'Ella', 'Jack', 'Scarlett', 'Owen', 'Grace',
  'Gabriel', 'Chloe', 'Matthew', 'Victoria', 'Leo', 'Riley', 'Nathan',
  'Aria', 'Isaac', 'Lily', 'Jayden', 'Aubrey', 'Anthony', 'Zoey'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
  'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
  'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
  'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell'
];

// Chapter title generation
const chapterPrefixes = [
  'The', 'A', 'An', 'In', 'On', 'At', 'Through', 'Beyond', 'Within',
  'Between', 'Among', 'Around', 'Before', 'After', 'During'
];

const chapterNouns = [
  'Journey', 'Discovery', 'Beginning', 'End', 'Crossing', 'Meeting',
  'Departure', 'Arrival', 'Revelation', 'Decision', 'Challenge',
  'Victory', 'Defeat', 'Transformation', 'Awakening', 'Sacrifice',
  'Promise', 'Betrayal', 'Redemption', 'Destiny', 'Fate', 'Choice',
  'Consequence', 'Legacy', 'Memory', 'Dream', 'Nightmare', 'Hope',
  'Despair', 'Love', 'Loss', 'Gain', 'Change', 'Struggle', 'Triumph'
];

// Story title generation
const storyPrefixes = [
  'The', 'A', 'An', 'In', 'On', 'At', 'Through', 'Beyond', 'Within',
  'Between', 'Among', 'Around', 'Before', 'After', 'During'
];

const storyNouns = [
  'Chronicles', 'Tales', 'Legends', 'Saga', 'Epic', 'Story', 'Narrative',
  'Journey', 'Adventure', 'Quest', 'Odyssey', 'Voyage', 'Expedition',
  'Exploration', 'Discovery', 'Revelation', 'Mystery', 'Secret', 'Truth',
  'Destiny', 'Fate', 'Legacy', 'Heritage', 'Inheritance', 'Legacy',
  'Promise', 'Oath', 'Vow', 'Pledge', 'Covenant', 'Bond', 'Connection'
];

const prefixes = [
  'Creative', 'Dynamic', 'Epic', 'Fantastic', 'Grand', 'Heroic',
  'Imaginative', 'Journey', 'Kaleidoscopic', 'Legendary', 'Magical',
  'Narrative', 'Original', 'Poetic', 'Quest', 'Remarkable', 'Story',
  'Tales', 'Unique', 'Vivid', 'Wonderful', 'Xenial', 'Yearning', 'Zestful'
];

const suffixes = [
  'Adventures', 'Chronicles', 'Dreams', 'Echoes', 'Fables', 'Glimpses',
  'Horizons', 'Imaginations', 'Journeys', 'Kaleidoscopes', 'Legends',
  'Memories', 'Narratives', 'Odysseys', 'Perspectives', 'Quests',
  'Reflections', 'Stories', 'Tales', 'Universe', 'Visions', 'Whispers',
  'Xenias', 'Yearnings', 'Zephyrs'
];

const themes = [
  'Mystery', 'Fantasy', 'Adventure', 'Romance', 'Sci-Fi', 'Horror',
  'Thriller', 'Drama', 'Comedy', 'Historical', 'Contemporary',
  'Dystopian', 'Utopian', 'Mythological', 'Philosophical'
];

export const generateCharacterName = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

export const generateChapterTitle = () => {
  const prefix = chapterPrefixes[Math.floor(Math.random() * chapterPrefixes.length)];
  const noun = chapterNouns[Math.floor(Math.random() * chapterNouns.length)];
  return `${prefix} ${noun}`;
};

export const generateStoryTitle = () => {
  const prefix = storyPrefixes[Math.floor(Math.random() * storyPrefixes.length)];
  const noun = storyNouns[Math.floor(Math.random() * storyNouns.length)];
  return `${prefix} ${noun}`;
};

export function generateRandomName(): string {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const theme = themes[Math.floor(Math.random() * themes.length)];
  
  return `${prefix} ${suffix} of ${theme}`;
}

export function generateRandomTitle(): string {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${prefix} ${suffix}`;
}

export function generateRandomTheme(): string {
  return themes[Math.floor(Math.random() * themes.length)];
} 