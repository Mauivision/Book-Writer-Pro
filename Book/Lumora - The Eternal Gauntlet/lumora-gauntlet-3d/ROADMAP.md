# Lumora Gauntlet 3D - Full Build Roadmap

**Goal**: A fun, small-scope 3D top-down Zelda-like adventure set in the Lumora universe. Focus on exploration, atmosphere, light story/quests, and the unique "twin gods + patch notes + messy party" tone.

**Core Pillars** (from original design):
- Top-down 3D camera (slight tilt, follows player)
- Weighty 8-way movement + dash
- Directional combat with personality
- Room-based world with connected zones
- Strong narrative flavor through quests, NPCs, and environmental storytelling

---

## Phase 0: Foundation (Done)
- [x] Godot 4 project scaffolded
- [x] Basic player movement + dash
- [x] Top-down camera rig
- [x] 3 connected explorable zones (greybox)
- [x] Basic zone transition system
- [x] Placeholder interactables

---

## Phase 1: Make the World Feel Good to Explore (Current Priority)

### 1.1 World Polish & Expansion
- [ ] Improve visual interest in existing zones (better shapes, elevation variety, landmarks)
- [ ] Add 2–3 more small connected zones to create a satisfying small map
- [x] Better lighting, fog, and basic environmental props added to main zones
- [ ] Clearer paths and points of interest (next)
- [ ] Simple navigation aids (signs, landmarks, subtle guiding elements)

### 1.2 Core Interaction Verbs
- [x] Functional harvesting system (multiple nodes: Verdant Crystal, Ruin Stone, Echo Fragments - E to gather)
- [x] Basic workbench interaction (prompts + craft attempt using real inventory)
- [x] First real NPC: Velvet placed in Meadow with Lumora canon dialogue
- [x] Inventory singleton fully wired (materials_changed signal, add/spend, costs enforced)
- [x] Build mode now consumes harvested materials (no more free placement)

### 1.3 First Story Hook
- [ ] Integrate simple quest system
- [ ] First story beat / patch note event
- [ ] Quest log in Godot UI (or keep HTML overlay if preferred)

---

## Phase 2: Gameplay Depth

### 2.1 Combat
- [ ] Basic sword combat (arc attack, i-frames on dash, knockback)
- [x] 2–3 enemy types (Scout, Wisp, Sunshade) — Scout + Wisp done. Wisp is fast/evasive and attacks from range.
- [ ] Simple enemy AI / behavior
- [ ] Light/Shadow lock puzzle mechanic

### 2.2 Progression & Fantasy
- [ ] Gauntlet Cuff abilities / upgrades
- [ ] Simple item-based progression (keys, tools, relics)
- [ ] Reputation / Unity / Jealousy systems affecting the world or dialogue

---

## Phase 3: Systems & Content

### 3.1 Save & Progression
- [ ] Save / Load system (zone, position, materials, quest state)
- [ ] Persistent world changes (opened paths, harvested nodes)

### 3.2 More Content
- [ ] Additional zones and rooms
- [ ] More NPCs and side stories
- [ ] Multiple story branches / patch events

### 3.3 Polish & Presentation
- [ ] Title screen + main menu
- [ ] Better UI (health, materials, quest log, patch toasts)
- [ ] Sound design (ambient, footsteps, combat, UI)
- [ ] Visual effects (gauntlet energy, particles, screen effects)

---

## Phase 4: Export & Integration

- [ ] Windows build
- [ ] Web export (for itch / BookWriter hub integration)
- [ ] Link from BookWriter Pro /gauntlet-rpg section
- [ ] Export lore/quests from BookWriter as clean JSON for the game

---

## Scope Notes
- Keep it small and fun first (aim for 20-40 minutes of content in the first full slice).
- Prioritize "the world feels good to walk around in" above everything else early on.
- Combat and systems should support exploration and story, not dominate it.
- All story and lore should feel like it comes from the Lumora book.

**Current Focus (as of this session):** "Do all" mode — systematically burning through the full Phase 2 backlog.

Recent progress:
- Second enemy type (Wisp) added and placed.
- Velvet quest now has real material reward.
- Significant visual density and navigation polish added to starting Meadow.
- Basic player feedback systems (I = status, Q = quest log).
- Automation layer now detects creative/Lumora activity and routes accordingly.
- Echo Hollow new zone added previously.

Recent progress:
- Second enemy type (Wisp) added — fast, evasive, ranged attacker. Now in both Meadow and Echo Hollow.
- Velvet quest now has tangible reward (3 Verdant Crystal + 1 Echo Fragment on completion).
- Visual density increased in starting Meadow (more ruins and crystals added).
- Basic status check added (press I to see current materials and active quests).
- World expanded with Echo Hollow (new combat/harvest zone).

Progress this session (aggressive "do all tasks" push):
- Agency production tasks fully cleared (multiple growth, editorial, humanize, PDF update runs executed).
- Lumora visual polish: Harvest particles significantly enhanced (dual-layer glowing shards, material-specific colors, better lifetime/spread).
- Build manager: Simple undo (U key) for last placed object + timestamped build records in persistence.
- Persistence system improved with richer build metadata.

- Harvest nodes across the starting zones actually feed a real inventory.
- Building is now gated behind exploration (you earn every placed object).
- Velvet (first canon NPC) is in the world with personality and lore beats.
- The "explore → harvest → build" fantasy from the original Crystal Gauntlet design is playable.

Next up (still Phase 1 polish) — actively executing in "do all tasks" mode:
- More visual love on the world (better props, particles on harvest, elevation variety) — **Harvest particles significantly upgraded**.
- Expand to 1-2 more small zones or deepen existing ones. — **Echo Hollow added** (new misty combat-focused zone south of Forest Ruin Gate, with echo harvest nodes and multiple Scouts).
- Light combat vertical slice or stronger story/quest beats — **Quest system implemented**. Basic combat vertical started: J-attack with cooldown + visible glowing swing effect + temporary damage area. Scout enemy script fully self-contained (auto visual + collision, chases player, takes damage, hit flash, dies).

**Just completed**: Full basic persistence (player-built structures + harvested node state now survive zone transitions and full game restarts via JSON in user://lumora_builds/).

**Combat vertical (latest)**: 
- Player: Arc-swing simulation (rotating hitbox) + lunge + hit particles. 
- Scout: Actively attacks player (cooldown + lunge), nice death scale/flash effect + economy drop hook.
- Player takes damage with red flash + knockback.
- Combat loop is now dynamic and satisfying.

After that we move into Phase 2 (combat, gauntlet abilities, reputation echoes).



