# Lumora: The Eternal Gauntlet — Master Game Plan

**Tagline:** *Respawn is free. Romance is not.*

**North star:** A playable 3D top-down adventure that feels like walking through Volume 1 — System UI as antagonist, messy party politics as mechanics, Sky Dungeon #7 as the long arc.

**Last updated:** 2026-06-22

---

## 1. What we're building

| Layer | Target | Engine |
|-------|--------|--------|
| **Ship target** | 20–40 min vertical slice → 3–5 hr Act 1 demo | **Godot 4** (`lumora-gauntlet-3d/`) |
| **Reference only** | Mechanics prototyping | `products/retro-gauntlet/` (2D, not ship) |
| **Narrative source of truth** | 35-chapter Volume 1 + series bible | `Book/Lumora - The Eternal Gauntlet/` |
| **Web prototypes** | Cards, dungeon pull, narrative JS | `game/*.html` + `game/lumora-*.js` |
| **Design pack (this folder)** | GDD, missions, bibles, schedule | `GAME/` |

**Genre:** Top-down 3D action-adventure (Zelda-like camera) with light RPG systems — bond/jealousy flags, faction pressure, adaptive dungeon rules, Sunny as UI antagonist.

**Not in v1 scope:** MMO, full 35-chapter campaign in-engine, voice acting, multiplayer co-op (design for it; ship single-player first).

---

## 2. Asset inventory (today)

### Done
- [x] Volume 1 chapter plan (Arcs 1–5, Ch. 1–35 beats)
- [x] Ch. 1–17 manuscript exists; Ch. 18–35 scaffolded
- [x] Godot 4 project: meadow, forest gate, verdant interrupt, **sky-dungeon-threshold**, harvest/build, combat, Planar Shift v0
- [x] 2D Phaser reference slice (not ship target): quests, beats, map registry
- [x] `GAME/MISSIONS/` ch01–ch35 mission specs
- [x] Planar Shift protocol (`PROTOCOLS/Architecture-Spec-Planar-Shift.md`)
- [x] `lumora.json` canon — 4 zones, threshold quests/beats synced to Godot

### In progress
- [ ] Quest system wired to book beats (partial — Velvet quest only)
- [ ] Combat vertical slice (arc attack + Scout/Wisp — needs polish + mini-boss)
- [ ] Chapter → mission conversion docs (`GAME/MISSIONS/` empty)

### Not started
- [ ] Sunny tutorial UI antagonist in Godot
- [ ] Bond / jealousy / Unity mechanics affecting gameplay
- [ ] Sky Dungeon #7 as distinct zone stack
- [ ] BookWriter ↔ Godot JSON sync in CI
- [ ] Windows + web export linked from BookWriter hub

---

## 3. Design pillars (lock these)

1. **Explore → harvest → reshape** — You earn the right to change the world (Crystal Gauntlet fantasy).
2. **The System lies** — Tooltips, patch notes, and Sunny are adversarial inputs, not help.
3. **Unity is mechanics** — Co-op gates, jealousy aggro, and faction keys are gameplay, not flavor text.
4. **Comedy is danger** — Bond events and tutorial pettiness have real stakes.
5. **Book-first pipeline** — Every quest ID traces to a chapter beat; no orphan lore.

---

## 4. Core loop (player-facing)

```
Town / meadow hub
  → accept mission (chapter beat)
  → explore zone(s) — harvest, talk, fight
  → dungeon rule / puzzle (Light+Veil, co-op gate, mirror trial)
  → bond or faction delta
  → reward + patch note
  → unlock next zone / chapter mission
```

**Systems map (implement in order):**

| Priority | System | Book anchor |
|----------|--------|-------------|
| P0 | Zone travel + save | Arc 1 travel |
| P0 | Quest log + story dialog | Ch. 1–6 |
| P1 | Combat + enemy types | Ch. 8 mini-boss |
| P1 | Sunny overlay (snarky tooltips) | Ch. 5 |
| P2 | Bond flags (jealousy → difficulty) | Ch. 9, 13 |
| P2 | Faction keys / Veil cooperation | Ch. 6, 11 |
| P3 | Adaptive dungeon layers | Ch. 12–16 |
| P3 | Golden Tankard hub | Ch. 18, 21 |

---

## 5. Production phases

### Phase A — Design lock (Weeks 1–2)

**Goal:** One folder everyone reads before touching Godot.

| Deliverable | Path | Owner |
|-------------|------|-------|
| GDD (pillars, loop, systems) | `GAME/GDD.md` | Hermes + design pass |
| Planar Shift protocol (auditable engine spec) | `game/PROTOCOLS/Architecture-Spec-Planar-Shift.md` | Done (v1 draft) |
| Campaign progression (35 chapters → missions) | `GAME/CAMPAIGN_PROGRESSION.md` | Extract from `VOLUME_1_CHAPTER_PLAN.md` |
| Mission specs Ch. 1–6 | `GAME/MISSIONS/ch01` … `ch06` | Grok narrative + Hermes structure |
| Character / faction / item bibles | `GAME/BIBLES/*.md` | From `SERIES_BIBLE.md`, `CHARACTER_PROFILES.md` |
| Scene index (Volume 1) | `GAME/SCENES/Scene_List_Volume1.md` | Map beats → Godot scenes |

**Exit criteria:** Mission template applied to Arc 1; every Ch. 1–6 beat has gameplay objective + scene list + reward.

---

### Phase B — Vertical slice (Weeks 3–6)

**Goal:** 20–40 minutes of shippable Godot gameplay = **Arc 1 compressed** (Summoning + Tutorial Dungeon).

**Playable beat list (slice):**

1. Awakening in Verdant Meadow (Ch. 1 tone — System UI boot)
2. Meet Velvet + first harvest quest (`q_awaken`, `q_gather`)
3. Scout combat + first kill (`q_scout`)
4. Forest Ruin Gate transition (`q_gate`)
5. Sunny appears — wrong advice, trap trigger (Ch. 5 beat)
6. Veil Key tease / east path blocked until co-op flag (Ch. 6 hook)

**Engine tasks:**

- [ ] QuestManager singleton (JSON-driven from `data/quests.json`)
- [ ] StoryDialog + PatchToast UI (port from `retro-gauntlet` / `lumoraLore.ts`)
- [ ] SunnyControl node — overrides tooltip text, triggers trap on bad follow
- [ ] Sunshade Golem mini-boss at Forest Ruin Gate
- [ ] Title screen + save slot (zone, quests, inventory)
- [ ] `RUN_GAME.bat` → stable Windows build

**Exit criteria:** New player completes slice in one session; all quest IDs trace to mission docs; no greybox dead ends.

---

### Phase C — Alpha (Weeks 7–12)

**Goal:** Arc 1–3 playable (Ch. 1–18) — through Golden Tankard victory.

- Sky Dungeon #7 zone stack (3–5 layered scenes)
- Party NPC followers (Seraphina, Luminara, Ecto — dialogue + combat assist)
- Bond meter + jealousy aggro spike (Ch. 13)
- Mirror trial puzzle room (Ch. 16)
- Golden Tankard social hub scene (Ch. 18)

**Exit criteria:** ~3 hours content; save/load across all Arc 1–3 zones; editorial pass on in-game dialog vs manuscript.

---

### Phase D — Beta (Weeks 13–18)

**Goal:** Full Volume 1 mission coverage (Ch. 19–35) as playable or narrative-interactive segments.

- Radiant Hearing + Veil Contract (branching dialogue trees)
- Bond quests (Seraphina, Luminara, Velvet, Mira)
- World boss raid phases (Volume 1 climax)
- Balance pass on materials, combat, bond difficulty

---

### Phase E — Ship (Week 19+)

- Web export for itch.io + BookWriter `/gauntlet-rpg` embed
- Steam demo checklist (if desired)
- `npm run sync-lumora-game` in BookWriter pipeline when chapters change

---

## 6. Single source of truth pipeline

```
SERIES_BIBLE + VOLUME_1_CHAPTER_PLAN + CHAPTERS/
        ↓ (extract)
GAME/MISSIONS/ + GAME/BIBLES/
        ↓ (export script)
products/lumora-game-data/lumora.json
        ↓ (Godot import)
lumora-gauntlet-3d/data/quests.json + zones + dialog
        ↓ (play)
RUN_SANDBOX.bat / RUN_GAME.bat
        ↓ (link)
BookWriter http://127.0.0.1:3003/gauntlet-rpg
```

**Rule:** Never author quest text only in Godot — always land in JSON exported from book/mission docs.

---

## 7. Agent / team workflow

| Role | Responsibility |
|------|----------------|
| **You (captain)** | Milestone approval, playtest 30 min/week, scope cuts |
| **Hermes (local)** | Godot systems, pipeline scripts, mission doc structure |
| **Grok (cloud)** | Mission prose, dialog batches, boss/encounter design |
| **BookWriter** | Chapter edits → triggers game data re-export |
| **Kanban** | One card per mission spec or engine milestone |

**Handoffs:** `hermes-home-base/00_Inbox/grok-handoff-lumora-3d-adventure.md`

**Launchers:**
```cmd
GROK-PROJECT.cmd lumora-gauntlet-3d
cd "...\lumora-gauntlet-3d" && RUN_SANDBOX.bat
START-RETRO-GAUNTLET.cmd
```

---

## 8. Immediate sprint (next 14 days)

### Week 1 — Design pack
1. Write `GAME/GDD.md` (1 page pillars + systems)
2. Extract Ch. 1–6 into `GAME/MISSIONS/` using mission template
3. Create `data/quests.json` schema + import first 8 quests from `retro-gauntlet` lore
4. Scene list for vertical slice only (6 scenes)

### Week 2 — Vertical slice code
1. QuestManager + dialog UI in Godot
2. Sunny tooltip override (first trap event)
3. Sunshade Golem mini-boss
4. Title + save/load
5. Playtest + fix blockers

**Mission template** (copy per chapter file):

```markdown
# Mission: Chapter NN — [Title]
- Narrative objective:
- Gameplay objective:
- Scenes: setup → escalation → twist → payoff
- Locations / Godot scenes:
- NPCs / enemies:
- Key items:
- Bond / faction deltas:
- Rewards / unlocks:
- Fail states:
- Book file: CHAPTERS/...
```

---

## 9. Success metrics

| Milestone | Metric |
|-----------|--------|
| Vertical slice | 1 outside playtester finishes without guidance |
| Alpha | 3 hr session, <3 game-breaking bugs |
| Beta | All 35 missions documented; 18+ playable in-engine |
| Ship | Web build loads from BookWriter hub in <5 s |

---

## 10. Risks & cuts

| Risk | Mitigation |
|------|------------|
| Scope creep (35 chapters) | Ship Arc 1 slice first; Ch. 19+ as VN-style interludes if needed |
| Art bottleneck | PropGenerator + Blender pipeline; greybox OK until slice locks |
| Lore drift | Quest IDs must cite chapter numbers |
| Two engines (Phaser + Godot) | Phaser = reference only; Godot = ship |

**If time is short:** Cut to **Arc 1 only** (Ch. 1–6) as the demo — still a complete emotional arc (summoning → tutorial dungeon → Veil Key).

---

## Appendix — Key paths

| What | Path |
|------|------|
| Godot project | `Book/Lumora - The Eternal Gauntlet/lumora-gauntlet-3d/` |
| 3D roadmap | `lumora-gauntlet-3d/ROADMAP.md` |
| 2D reference | `.cursor/Agency agents/products/retro-gauntlet/` |
| Chapter plan | `VOLUME_1_CHAPTER_PLAN.md` |
| Grok handoff | `hermes-home-base/00_Inbox/grok-handoff-lumora-3d-adventure.md` |
| Cursor conversion plan | `.cursor/plans/lumora_game_conversion_pack_8825c7ed.plan.md` |
