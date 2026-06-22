# Lumora: The Eternal Gauntlet — Game Design Document (Volume 1)

**Tagline:** *Respawn is free. Romance is not.*

**Version:** 1.0  
**Source of truth:** `VOLUME_1_CHAPTER_PLAN.md`, `SERIES_BIBLE.md`, `CHARACTER_PROFILES.md`  
**Engine target (recommended):** Godot 4 (`lumora-gauntlet-3d/`) — design is engine-agnostic

---

## 1. Elevator pitch

A top-down 3D action-adventure where Haruto Takahashi — *The Eternal Player* — is summoned into Lumora, a world running on visible game logic. The System UI is petty, romance flags have combat consequences, and factions (Radiant Dominion vs Veil Syndicate) want to own him. The player leads a messy mixed-faction party through Sky Dungeon #7, survives politics and bond quests, and culminates in a world-boss raid that forces **Party Unity Override**.

**Genre:** Zelda-like exploration + light RPG + social-combat systems  
**Session length:** 20–40 min (vertical slice) → 8–12 hr (full Volume 1)  
**Tone:** Comedy is danger. Sincerity is power.

---

## 2. Design pillars

| # | Pillar | Player experience |
|---|--------|-------------------|
| 1 | **Explore → harvest → reshape** | Earn the right to change zones via Crystal Gauntlet verbs (Build / Destroy / Move) |
| 2 | **The System lies** | Sunny, tooltips, and patch notes are adversarial inputs |
| 3 | **Unity is mechanics** | Co-op gates, Veil Keys, jealousy aggro, and bond events affect difficulty |
| 4 | **Comedy is danger** | Flirting triggers spawns; tutorial “help” triggers traps |
| 5 | **Book-first pipeline** | Every quest ID traces to a chapter beat; no orphan lore |

---

## 3. Core loop

```
Hub (Castle Lumora / Golden Tankard / Veil Crypts)
  → Accept mission (chapter beat)
  → Travel / explore zone
  → Combat + puzzle (faction synergy required)
  → Bond / jealousy / faction delta
  → Reward + patch note toast
  → Unlock next mission / zone / UI tab
```

**Secondary loops:**
- **Bond quests** — character scenes with mechanical buffs and rivalry side-effects
- **Hub gossip** — Mira’s rumor network shifts NPC prices and jealousy baseline
- **Dungeon adaptivity** — Sky Dungeon #7 retaliates when Unity rises

---

## 4. Player character

| Field | Value |
|-------|-------|
| Name | Haruto Takahashi |
| Title | The Eternal Player |
| Signature ability | **Party Leader Authority** — cross-faction recruitment, co-op override, Unity Override (raid capstone) |
| Starting level band | 1 (Book 1 cap: Level 5) |
| Equipment slot | Crystal Gauntlet (right wrist, cyan, bound) |

**Controls (reference):** WASD move, Space attack, Shift dash, E interact, Tab craft, B build mode

---

## 5. Key systems

### 5.1 Quest / Mission system
- Missions map 1:1 to Volume 1 chapters (`MISSIONS/ch01` … `ch35`)
- Quest log updates in real time; objectives can change mid-mission (System behavior)
- Mission states: `locked` → `available` → `active` → `complete` / `failed`

### 5.2 Sunny (Tutorial Entity / UI antagonist)
- Appears Ch. 5+; provides misleading tooltips
- Following bad advice can trigger traps or spawn adds
- Ch. 15: player can **contain Sunny** (UI box) — dungeon reacts
- Ch. 34: monitor behavior slips — foreshadows Volume 2

### 5.3 Bond & jealousy
| Meter | Effect |
|-------|--------|
| Bond (per character) | Unlocks bond quests, co-op combos, dialogue |
| Jealousy (party-wide) | Increases spawn rate, boss aggression, town difficulty |
| Unity (party aggregate) | Unlocks cyan route UI, triggers dungeon retaliation & Corrections |

**Jealousy Aggro formula (design target):**  
`spawnMultiplier = 1.0 + (jealousy * 0.03) + (activeRomanceFlags * 0.05)`

### 5.4 Faction pressure
| Faction | Rep range | Effects |
|---------|-----------|---------|
| Radiant Dominion | -100 … +100 | Healing access, council hearings, gear upgrades |
| Veil Syndicate | -100 … +100 | Curse-tech, shortcuts, contract offers |

**Third path:** Haruto refuses ownership — unlocks Unity mechanics without submitting to either faction.

### 5.5 Veil Keys & co-op gates
- Certain doors require **Radiant seal + Veil curse-key** simultaneously
- Keys are political leverage; Haruto rule: party holds keys, not factions

### 5.6 Loot binding
- Rare drops bind to Player (cannot unequip)
- Bound gear visible to NPCs → rivalry escalation, gossip, hearing events

### 5.7 Adaptive dungeon (Sky Dungeon #7)
- Tracks party Unity; retaliates with anti-teamwork rooms (Ch. 12+)
- Mirror trial (Ch. 16) copies weakest bond
- Not scripted — difficulty scales with social state

### 5.8 Respawn
- Nearest shrine anchor (Gravetender Odo logic)
- Penalties: reputation loss, embarrassment debuff (comedy + mechanical)
- Death is slapstick, not gore

### 5.9 Patch Notes
- Delivered by Patch Herald between arcs
- Gods (Luminos / Umbrax) adjust mechanics — comedy + escalation
- Post-credits Ch. 35 = Volume 2 hook

### 5.10 Crystal Gauntlet verbs
| Verb | Gameplay use |
|------|----------------|
| Build | Place structures, workbench, co-op bridges |
| Destroy | Break false walls, trap tiles, Sunny’s bad suggestions |
| Move | Reposition objects, puzzle solutions |
| Overdrive | Raid capstone; cyan route surge (Ch. 32) |

---

## 6. Combat model (engine-agnostic)

**Player:** melee arc attack, dash with i-frames, stamina regen  
**Party NPCs:** assist attacks, buffs, puzzle triggers (not full party control in v1)  
**Enemy tiers:** Scout → Wisp → Mini-boss → Sky Warden → World Boss (Correction Warden)

**Sunshade Golem (mini-boss):** dual phase — debuff then holy burst  
**Sky Warden #7:** adapts to morale/jealousy  
**Correction Warden (world boss):** 3 phases — disunity punished → declaration duel → Unity Override

---

## 7. Progression (Level 1–5)

| Level | Unlock | Chapter anchor |
|-------|--------|----------------|
| 1 | Basic combat, harvest, Sunny intro | Ch. 1–5 |
| 2 | Party follower assist, jealousy awareness | Ch. 6–9 |
| 3 | Co-op gates, rivalry mechanic | Ch. 10–13 |
| 4 | Mirror trial, cyan tab, Elara route | Ch. 14–17 |
| 5 | Unity Override, bound relic, world boss | Ch. 18–35 |

---

## 8. UI / HUD

| Element | Behavior |
|---------|----------|
| Quest log | Real-time objective updates |
| Romance flags | Hearts on bond prompts; trigger buffs + jealousy |
| Bond meter | Per-character; visible in party screen |
| Jealousy indicator | Subtle meter; spikes announced by System |
| Cyan tab | Unlocks Ch. 16 — Codex fragments, Verdant route |
| Patch toast | Bottom-right; skippable but logged in codex |

---

## 9. Content scope (Volume 1)

| Arc | Chapters | Missions | Primary zones |
|-----|----------|----------|---------------|
| 1 Summoning | 1–6 | 6 | Castle Lumora, meadow, tutorial dungeon |
| 2 Party Formation | 7–10 | 4 | Travel routes, dungeon upper floors |
| 3 Sky Dungeon Deep | 11–18 | 8 | Sky Dungeon #7 stack, Golden Tankard |
| 4 Politics & Bonds | 19–28 | 10 | Hubs, bond quest instances, town |
| 5 World Boss Raid | 29–35 | 7 | Raid arena, aftermath hubs |

**Total missions:** 35

---

## 10. Out of scope (v1 ship)

- Multiplayer co-op (design for it; ship single-player)
- Full voice acting
- All 35 chapters fully playable in-engine (beta target: narrative-interactive for Arc 4–5 if needed)
- MMO / live-service backend

---

## 11. Cross-references

| Doc | Purpose |
|-----|---------|
| `CAMPAIGN_PROGRESSION.md` | Chapter → mission skeleton |
| `SCENES/Scene_List_Volume1.md` | Master scene index |
| `MISSIONS/ch##-*.md` | Per-chapter mission specs |
| `BIBLES/*.md` | Characters, items, locations, enemies, puzzles |
| `SCHEDULE/Production_Schedule.md` | Milestones |
| `../game/MASTER_PLAN.md` | Godot implementation bridge |
| `../lumora-gauntlet-3d/data/lumora.json` | Runtime quest/enemy data |
