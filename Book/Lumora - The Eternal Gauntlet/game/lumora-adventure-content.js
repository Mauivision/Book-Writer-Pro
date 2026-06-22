/**
 * Content + pile definitions for the autoplay pick-a-card adventure.
 * Everything here is safe to expand: add scenes/cards, tweak weights, add gates.
 */

const LUMORA_ADVENTURE = (() => {
  /** @typedef {'hub'|'explore'|'lock'|'approach'|'boss'|'aftermath'} Phase */
  /** @typedef {'tavern'|'dungeon'|'audit'|'mirror'|'verdant'|'radiant'|'veil'|'mixed'|'boss'} Tag */

  /** @typedef {{
   *   id: string;
   *   title: string;
   *   body: string;
   *   tags: Tag[];
   *   phase: Phase;
   *   actMin?: number;
   *   actMax?: number;
   *   weight?: number;
   * }} SceneDef */

  /** @typedef {{
   *   id: string;
   *   name: string;
   *   deck: string;
   *   faction?: 'radiant'|'veil'|'neutral';
   *   text: string;
   *   tags: Tag[];
   *   actMin?: number;
   *   actMax?: number;
   *   weight?: number;
   *   requires?: Partial<{
   *     verdantSeen: boolean;
   *     gossipToken: boolean;
   *     correctionHeatMin: number;
   *     bossUnlocked: boolean;
   *   }>;
   *   forbids?: Partial<{
   *     inSafeZone: boolean;
   *   }>;
   *   effects: { t: string; v?: number; w?: number; s?: string }[];
   * }} AdventureCard */

  const SCENES = /** @type {SceneDef[]} */ ([
    {
      id: "s_hub_tankard_1",
      title: "The Golden Tankard",
      body: "Lanternlight hangs like buffs. Mira’s grin is a status effect you didn’t consent to. The quest log pretends not to care.",
      tags: ["tavern"],
      phase: "hub",
      weight: 1.2,
    },
    {
      id: "s_hub_tankard_2",
      title: "Gossip Corner",
      body: "Rumors drift in ribbons. Someone laughs in your direction and you can feel Jealousy Aggro warming up like a bad engine.",
      tags: ["tavern", "mixed"],
      phase: "hub",
    },
    {
      id: "s_explore_bridge",
      title: "Glass Bridge to Sky Dungeon #7",
      body: "Wind claws at your clothes like an impatient loading spinner. Below is the city. Above is a starter dungeon that quietly cheats.",
      tags: ["dungeon"],
      phase: "explore",
      weight: 1.05,
    },
    {
      id: "s_explore_audit_corridor",
      title: "Audit Corridor",
      body: "Floating ledgers drift like jellyfish. Each footstep triggers a chime that sounds like judgment wearing a smile.",
      tags: ["dungeon", "audit"],
      phase: "explore",
    },
    {
      id: "s_explore_mirror",
      title: "Jealousy Mirror Hall",
      body: "Parallel corridors repeat you with tiny delays — each copy slightly smugger than the last. The mirrors want a verdict, not a selfie.",
      tags: ["dungeon", "mirror"],
      phase: "explore",
    },
    {
      id: "s_lock_vestibule",
      title: "Light / Shadow Lock Vestibule",
      body: "Marble-white and violet-black share a seam that hums like a strained smile. The lock wants a sequence — and an audience.",
      tags: ["dungeon", "radiant", "veil"],
      phase: "lock",
      weight: 1.1,
    },
    {
      id: "s_explore_verdant_leak",
      title: "Verdant Leak (Wrong Place to Grow)",
      body: "Vines push through admin tilework. Life magic shouldn’t thrive in a starter dungeon. It does anyway, like a secret refusing to stay buried.",
      tags: ["dungeon", "verdant"],
      phase: "explore",
      actMin: 2,
      weight: 0.8,
    },
    {
      id: "s_approach_waiting_room",
      title: "Curator Waiting Room",
      body: "Numbered tickets float without a desk. The bell never rings, yet your spine still braces. This is not a boss chamber. This is paperwork with teeth.",
      tags: ["dungeon", "audit", "boss"],
      phase: "approach",
      actMin: 2,
      weight: 1.25,
    },
    {
      id: "s_boss_counter",
      title: "The Counter of Denials",
      body: "The Sky Dungeon Curator stands behind a counter that shouldn’t fit in a dungeon. The stamp sound is louder than damage.",
      tags: ["dungeon", "audit", "boss"],
      phase: "boss",
      actMin: 3,
      weight: 1.4,
    },
    {
      id: "s_aftermath_tankard",
      title: "Aftermath: Toasts and Optics Debt",
      body: "You’re alive. That’s cheap here. The *meaning* of it is not. Mira pours something that tastes like victory and consequences.",
      tags: ["tavern", "mixed"],
      phase: "aftermath",
      actMin: 3,
      weight: 1.2,
    },
  ]);

  const ADVENTURE_CARDS = /** @type {AdventureCard[]} */ ([
    {
      id: "a_mira_gossip_token",
      name: "Mira’s Gossip Token",
      deck: "BOND",
      faction: "neutral",
      text: "Gain a Gossip Token. Unity +3. Jealousy +2 (someone saw that).",
      tags: ["tavern", "mixed"],
      actMin: 1,
      weight: 1.2,
      effects: [
        { t: "flag", s: "gossipToken", v: 1 },
        { t: "unity", v: 3 },
        { t: "jealousy", v: 2 },
      ],
    },
    {
      id: "a_reroll_bad_impression",
      name: "Spend Gossip Token (Reroll Optics)",
      deck: "BOND",
      faction: "neutral",
      text: "Consume Gossip Token. Jealousy −10. Radiant rep +2, Veil rep +2.",
      tags: ["tavern", "mixed"],
      requires: { gossipToken: true },
      weight: 0.9,
      effects: [
        { t: "flag", s: "gossipToken", v: 0 },
        { t: "jealousy", v: -10 },
        { t: "repRadiant", v: 2 },
        { t: "repVeil", v: 2 },
      ],
    },
    {
      id: "a_optics_debt_receipt",
      name: "Optics Debt Receipt",
      deck: "PATCH",
      faction: "neutral",
      text: "Patch Notes print a receipt for your choices. Correction Heat +1. (No immediate damage. Just dread.)",
      tags: ["audit"],
      actMin: 1,
      weight: 1.0,
      effects: [{ t: "correctionHeat", v: 1 }],
    },
    {
      id: "a_tutorial_arrow_lie",
      name: "Tutorial Arrow (Definitely Helpful)",
      deck: "SCENE",
      faction: "neutral",
      text: "Trust the arrow. If it lies, you’ll learn faster. Jealousy +3.",
      tags: ["dungeon"],
      weight: 1.0,
      effects: [{ t: "jealousy", v: 3 }],
    },
    {
      id: "a_safe_breath",
      name: "Safe Breath (Reset Your Vibe)",
      deck: "SCENE",
      faction: "neutral",
      text: "Heal 6. Jealousy −4. Unity +1.",
      tags: ["dungeon", "tavern"],
      weight: 0.95,
      effects: [
        { t: "heal", v: 6 },
        { t: "jealousy", v: -4 },
        { t: "unity", v: 1 },
      ],
    },
    {
      id: "a_light_shadow_lock",
      name: "Light / Shadow Lock",
      deck: "LOCK",
      faction: "neutral",
      text: "Solve the lock: choose a stance-aligned sequence. Success: Unity +6. Failure: take 8.",
      tags: ["dungeon", "radiant", "veil"],
      weight: 1.2,
      effects: [{ t: "lockCheck" }],
    },
    {
      id: "a_loot_binds",
      name: "Loot Binding Incident",
      deck: "LOOT",
      faction: "neutral",
      text: "Gain a bound relic. Unity +4. Jealousy +6. Correction Heat +1.",
      tags: ["dungeon", "mixed"],
      actMin: 2,
      weight: 0.85,
      effects: [
        { t: "flag", s: "boundRelic", v: 1 },
        { t: "unity", v: 4 },
        { t: "jealousy", v: 6 },
        { t: "correctionHeat", v: 1 },
      ],
    },
    {
      id: "a_verdant_interrupt",
      name: "Verdant Interrupt",
      deck: "VERDANT",
      faction: "neutral",
      text: "Cyan UI flickers. Verdant route seen. Unity +5. Correction Heat +2.",
      tags: ["verdant", "dungeon"],
      actMin: 2,
      weight: 0.75,
      effects: [
        { t: "flag", s: "verdantSeen", v: 1 },
        { t: "unity", v: 5 },
        { t: "correctionHeat", v: 2 },
      ],
    },
    {
      id: "a_correction_spike",
      name: "Correction Spike",
      deck: "CORRECTION",
      faction: "neutral",
      text: "The world pushes back. Take 7 if Unity ≥ 55, else 4. Jealousy +2.",
      tags: ["audit", "dungeon"],
      actMin: 2,
      weight: 1.0,
      effects: [{ t: "correctionSpike" }, { t: "jealousy", v: 2 }],
    },
    {
      id: "a_boss_unlock",
      name: "Boss Door Opens (For Entertainment)",
      deck: "BOSS_GATE",
      faction: "neutral",
      text: "Advance to the Curator. (No stat change—just a decision becoming a room.)",
      tags: ["boss", "audit"],
      actMin: 2,
      weight: 1.3,
      effects: [{ t: "flag", s: "bossUnlocked", v: 1 }],
    },
  ]);

  const PILES = {
    SCENE_HUB: { id: "SCENE_HUB", kind: "scene", phase: "hub", tags: ["tavern"] },
    SCENE_EXPLORE: { id: "SCENE_EXPLORE", kind: "scene", phase: "explore", tags: ["dungeon"] },
    SCENE_LOCK: { id: "SCENE_LOCK", kind: "scene", phase: "lock", tags: ["dungeon"] },
    SCENE_APPROACH: { id: "SCENE_APPROACH", kind: "scene", phase: "approach", tags: ["boss"] },
    SCENE_BOSS: { id: "SCENE_BOSS", kind: "scene", phase: "boss", tags: ["boss"] },
    SCENE_AFTERMATH: { id: "SCENE_AFTERMATH", kind: "scene", phase: "aftermath", tags: ["tavern"] },
    CARD_SCENE: { id: "CARD_SCENE", kind: "card" },
    CARD_LOCK: { id: "CARD_LOCK", kind: "card" },
    CARD_BOND: { id: "CARD_BOND", kind: "card" },
    CARD_LOOT: { id: "CARD_LOOT", kind: "card" },
    CARD_VERDANT: { id: "CARD_VERDANT", kind: "card" },
    CARD_CORRECTION: { id: "CARD_CORRECTION", kind: "card" },
    CARD_PATCH: { id: "CARD_PATCH", kind: "card" },
    CARD_BOSS_GATE: { id: "CARD_BOSS_GATE", kind: "card" },
  };

  return {
    SCENES,
    ADVENTURE_CARDS,
    PILES,
  };
})();

if (typeof window !== "undefined") {
  window.LumoraAdventureContent = LUMORA_ADVENTURE;
}

