/**
 * Canon hooks for Retro Gauntlet — sourced from:
 * Book/Lumora - The Eternal Gauntlet (SERIES_BIBLE, VOLUME_1_OUTLINE, CHARACTER_PROFILES)
 * and sibling prototypes (lumora-gauntlet.js, lumora-adventure-content.js).
 */

export type StoryBeatId =
  | 'intro'
  | 'firstHit'
  | 'firstHarvest'
  | 'shelter'
  | 'firstKill'
  | 'levelUp'
  | 'npcVelvet'
  | 'zoneTransition'
  | 'miniBoss'
  | 'tarotDraw'
  | 'playerRespawn';

export type StoryBeat = {
  id: StoryBeatId;
  speaker: string;
  text: string;
  /** Optional quest id to mark complete when this beat fires */
  questId?: string;
};

export type LumoraQuest = {
  id: string;
  text: string;
  /** Book arc reference for writers */
  arc?: string;
};

export const ZONE = {
  id: 'verdant-leak-meadow',
  title: 'Verdant Leak Meadow',
  subtitle: 'Sky Dungeon #7 fringe · wrong place to grow',
  bookRef: 'lumora-adventure-content.js → s_explore_verdant_leak',
} as const;

export const ENEMY = {
  name: 'Sky Warden Scout',
  bookRef: 'Starter dungeon patrol — Sky Dungeon #7 quietly cheats.',
} as const;

export const PROTAGONIST = {
  name: 'Haruto Takahashi',
  title: 'The Eternal Player',
  ability: 'Party Leader Authority',
} as const;

/** Volume 1 starter quests adapted for the action slice */
export const BOOK_QUESTS: LumoraQuest[] = [
  {
    id: 'q_awaken',
    text: 'Wake at the Verdant Leak — prove this meadow is not a loading error.',
    arc: 'Arc 1 · Summoning',
  },
  {
    id: 'q_gather',
    text: 'Harvest wood, stone, and fiber for mixed-faction starter gear.',
    arc: 'Arc 2 · Party Formation',
  },
  {
    id: 'q_shelter',
    text: 'Place a workbench — continuity before Sky Dungeon scouts return.',
    arc: 'Arc 3 · Sky Dungeon fringe',
  },
  {
    id: 'q_scout',
    text: 'Defeat a Sky Warden Scout (Sky Dungeon #7 fringe patrol).',
    arc: 'Arc 3 · first skirmish',
  },
  {
    id: 'q_level',
    text: 'Reach Level 2 before the System publishes embarrassing Patch Notes.',
    arc: 'Book 1 · Levels 1–5',
  },
  {
    id: 'q_velvet',
    text: 'Speak with High Priestess Velvet Dawn (healing purposes, allegedly).',
    arc: 'Arc 1 · Velvet Arrival',
  },
  {
    id: 'q_gate',
    text: 'Cross east to the Forest Ruin Gate — Sky Dungeon #7 approach.',
    arc: 'Arc 2 · Approach to Dungeon',
  },
  {
    id: 'q_miniboss',
    text: 'Survive the Sunshade Golem mini-phase at the ruin gate.',
    arc: 'Arc 3 · Mini-Boss',
  },
];

export const STORY_BEATS: Record<StoryBeatId, StoryBeat> = {
  intro: {
    id: 'intro',
    speaker: 'The System',
    questId: 'q_awaken',
    text:
      'Loading… Welcome, Eternal Player. You are standing in a meadow that should not exist — ' +
      'vines through admin tilework, cyan flecks in the grass. Lumora is fractured. ' +
      'The Crystal Gauntlet on your wrist is not loot. It is an emergency balance organ. Gather. Fight. Build.',
  },
  firstHit: {
    id: 'firstHit',
    speaker: 'Sunny (Tutorial Entity)',
    text:
      'Great job surviving contact damage! You are all very— ' +
      'Ow. Okay. Pain is a tutorial you did not consent to. The Gauntlet learns from hits. ' +
      'Haruto\'s beliefs about containers are evolving.',
  },
  firstHarvest: {
    id: 'firstHarvest',
    speaker: 'Glyph, Cartographer',
    questId: 'q_gather',
    text:
      'Wood, stone, fiber — starter economy unlocked. I trade map data for secrets; ' +
      'you trade sweat for walls. Sky Dungeon #7 hates teamwork, but it respects resourcefulness.',
  },
  shelter: {
    id: 'shelter',
    speaker: 'Bone Legion Commander',
    questId: 'q_shelter',
    text:
      'A workbench is not a castle. It is a claim. Craft tools, patch wounds, pretend this leak is home ' +
      'until the Radiant Dominion and Veil Syndicate stop arguing over who owns your respawn point.',
  },
  firstKill: {
    id: 'firstKill',
    speaker: 'The System',
    questId: 'q_scout',
    text:
      'Objective updated: Sky Warden Scout — eliminated. ' +
      'Jealousy Aggro +0 (you fought alone; the gods are disappointed but entertained). ' +
      'Quest hint: Clear Sky Dungeon #7. (This meadow is only the tutorial airlock.)',
  },
  levelUp: {
    id: 'levelUp',
    speaker: 'Patch Herald',
    questId: 'q_level',
    text:
      'Level gained. That is not praise — it is permission. ' +
      'Book 1 band: Levels 1–5. Stronger body, sharper blade. ' +
      'Luminos notes your bravery. Umbrax notes your timing.',
  },
  npcVelvet: {
    id: 'npcVelvet',
    speaker: 'High Priestess Velvet Dawn',
    questId: 'q_velvet',
    text:
      'Welcome to Lumora. I can cleanse wounds… and political mistakes. ' +
      'The Radiant Dominion would prefer you choose a side. Haruto would prefer you choose yourself. ' +
      'Build shelter before you cross the gate east.',
  },
  zoneTransition: {
    id: 'zoneTransition',
    speaker: 'The System',
    questId: 'q_gate',
    text:
      'Zone transition: Forest Ruin Gate. Wind claws like a loading spinner. ' +
      'Below is the city. Above is Sky Dungeon #7 — a starter dungeon that quietly cheats. ' +
      'Verdant Wisps detected. Mini-boss probability: rising.',
  },
  miniBoss: {
    id: 'miniBoss',
    speaker: 'Seraphina (distant echo)',
    questId: 'q_miniboss',
    text:
      'Sunshade Golem — dual phase required. Debuff first, then holy burst. ' +
      'Or, you know, hit it until the tutorial stops lying. The dungeon hates teamwork; prove it wrong later.',
  },
  tarotDraw: {
    id: 'tarotDraw',
    speaker: 'The System',
    text:
      'Tarot milestone unlocked — The Fool reversed: bold moves, questionable landings. ' +
      'Card buff pending integration. (The manuscript has a whole deck; this is your teaser draw.)',
  },
  playerRespawn: {
    id: 'playerRespawn',
    speaker: 'Gravetender Odo',
    text:
      'Respawn complete. Optics debt +1. Tip: dying is free. The gods still charge embarrassment.',
  },
};

export const LOADING_QUIPS = [
  'Tip: dying is free. Optics are not.',
  'Respawn is free. Romance is not.',
  'Gravetender Odo says: try not to make a hobby of this.',
  'Luminos notes your bravery. Umbrax notes your timing.',
  'Patch 0.0.7: humility spike when you run it back.',
];

export const PATCH_NOTES = [
  'Patch: Jealousy scaling +3% because the gods are bored.',
  'Hotfix: Sky Dungeon #7 now cheats slightly less. (Lie.)',
  'Balance: Found-family buffs are OP; enjoy it while it lasts.',
  'Verdant route signature detected. The world is paying attention.',
  'Correction Heat +1. No immediate damage. Just dread.',
];

export function getStoryBeat(id: string): StoryBeat | undefined {
  if (id in STORY_BEATS) {
    return STORY_BEATS[id as StoryBeatId];
  }
  return undefined;
}

export function getQuest(id: string): LumoraQuest | undefined {
  return BOOK_QUESTS.find((q) => q.id === id);
}
