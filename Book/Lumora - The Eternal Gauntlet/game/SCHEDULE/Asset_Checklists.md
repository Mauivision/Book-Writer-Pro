# Asset Checklists — Lumora Volume 1

Use per milestone. Check items when ready for engine import.

---

## Phase B — Vertical slice

### Code / systems
- [ ] QuestManager (JSON-driven)
- [ ] StoryDialog panel
- [ ] PatchToast overlay
- [ ] Player controller (move, dash, attack)
- [ ] Basic enemy AI (scout)
- [ ] Save/load (zone, quests)
- [ ] Zone transition (meadow ↔ forest-ruin-gate)

### Art — 3D / 2D
- [ ] Haruto placeholder model/sprite
- [ ] Meadow tileset / terrain
- [ ] Forest ruin gate environment
- [ ] Sky Warden Scout enemy
- [ ] Verdant Wisp enemy
- [ ] Sunshade Golem (mini-boss)
- [ ] Crystal Gauntlet VFX (cyan)
- [ ] UI frame (quest log, HP)

### Audio
- [ ] UI ding (System welcome)
- [ ] Combat hit SFX
- [ ] Meadow ambient loop
- [ ] Patch Herald sting

### UI
- [ ] Loading screen mock
- [ ] Quest log widget
- [ ] Dialog box (speaker name)
- [ ] Interaction prompt (E)

### Narrative
- [ ] `q_awaken`, `q_gather`, `q_scout`, `q_gate`, `q_velvet` strings
- [ ] M01–M06 mission docs
- [ ] Sunny 3 misleading tip variants

---

## Phase C — Alpha (Arc 1–3)

### Zones
- [ ] castle-lumora (hall + council shell)
- [ ] golden-tankard interior
- [ ] veil-crypts hub shell
- [ ] travel-road-sd7
- [ ] sd7-tutorial, sd7-upper, sd7-mid, sd7-deep
- [ ] mirror-trial instance
- [ ] verdant-interrupt corridor

### Characters (followers + NPCs)
- [ ] Seraphina model + assist attack
- [ ] Luminara model + spell VFX
- [ ] Bone Commander, Chiller, Ecto
- [ ] Velvet NPC (exists — polish)
- [ ] Mira NPC
- [ ] Elara NPC + dialog

### Systems
- [ ] Bond meter (6 characters)
- [ ] Jealousy meter + spawn modifier
- [ ] Co-op gate prefab
- [ ] Tile puzzle kit
- [ ] Sunny overlay + trap link
- [ ] Loot binding UI indicator
- [ ] Faction rep (Radiant/Veil)

### Bosses
- [ ] Sunshade Golem phase 2
- [ ] Mirror copy AI
- [ ] Sky Warden #7 (optional extended)

### Items
- [ ] Harvest nodes (wood, stone, fiber)
- [ ] Workbench interactable
- [ ] radiant_seal, veil_curse_key props
- [ ] bound_relic icon + equip force

---

## Phase D — Beta (Arc 4–5)

### Hub / social
- [ ] hearing_podium scene
- [ ] contract_table scene
- [ ] gossip_board minigame UI
- [ ] bond quest instances (×3)

### Combat / raid
- [ ] town_mob variants
- [ ] correction_drone
- [ ] hardliner_saboteur
- [ ] Correction Warden boss (3 phases)
- [ ] morale_bar raid UI
- [ ] Unity Override cinematic

### Narrative
- [ ] M19–M35 dialog scripts
- [ ] Council character portraits
- [ ] Post-credits patch notes sequence
- [ ] Codex entries (6 from lumora.json)

### Audio
- [ ] Boss phase music (3 tracks)
- [ ] Golden Tankard hub music
- [ ] System warning VO-style filter (text-only ok)

---

## Phase E — Polish / ship

### QA
- [ ] Full playthrough M01–M35
- [ ] Save corruption test
- [ ] Jealousy edge cases (max/min)
- [ ] Softlock audit (gates, keys)

### Platform
- [ ] Windows export
- [ ] `RUN_GAME.bat`
- [ ] README controls section
- [ ] Optional web export (HTML5)

### Marketing (demo)
- [ ] 30 sec trailer capture
- [ ] Steam/itch description from GDD pitch
- [ ] Screenshot set (6)

---

## JSON / data files to maintain

| File | Contents |
|------|----------|
| `lumora-gauntlet-3d/data/lumora.json` | zones, quests, enemies, beats |
| `data/quests.json` (planned) | mission objectives |
| `data/dialogue/*.json` (planned) | scene scripts |
| `data/flags.json` (planned) | reactivity flags |

---

## Art pipeline (existing)

- Blender props: `lumora-gauntlet-3d/assets/blender/`
- Imported models: `assets/models/`
- PropGenerator notes: `lumora-gauntlet-3d/docs/CONSOLIDATED_LUMORA_GAUNTLET.md`

---

## Book integration

- [ ] Each mission `ch##.md` links to `CHAPTERS/Chapter-##-*.md`
- [ ] Quest ID in mission matches `lumora.json`
- [ ] Scene IDs in mission match `Scene_List_Volume1.md`
