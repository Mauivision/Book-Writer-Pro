# Lumora 3D — Treasure Chest Builder

Procedural low-poly treasure chest generator tailored for **Lumora: The Eternal Gauntlet**.

## Why this exists
- The game needs many chests (common loot, rare relics, glitched admin caches, faction-tied hoards).
- Manual modeling every variation is slow.
- This tool lets you rapidly create dozens of unique chests directly in Godot with inspector controls or code.
- Fits the aesthetic: ruined wood/stone + cyan "leak" / crystal growth + glitch / admin motifs.

## Files
- `treasure_chest_builder.gd` — The main procedural builder (attach to a Node3D or use as tool scene)
- `interactable_chest.gd` — Runtime script for chests placed in levels (open, loot drop, story beats)
- `examples/` — Folder for baked .tscn variations you generate

## How to Use in Your Godot Project

1. Copy the `treasure-chests` folder into your Godot project (e.g. `res://assets/props/treasure-chests/` or `res://tools/`).
2. Create a new scene.
3. Add a Node3D as root and attach `treasure_chest_builder.gd`.
4. In the inspector, tweak the exported parameters.
5. Click **Rebuild** (or call `rebuild()` in code).
6. When happy, use the **"Bake Instance"** button (or call `create_baked_instance()`) to generate a static, self-contained chest scene you can place in levels.

## Chest Types (Lumora-flavored)
- **WoodenRuined** — Basic starting meadow chests, weathered wood + iron.
- **CrystalInfused** — Verdant crystals growing out of the chest (rare drops).
- **StoneRelic** — Ancient ruin style, heavy stone + moss + runes.
- **GlitchedCache** — Admin/Sky Dungeon tech aesthetic, cyan seams, floating shards, "error" details.
- **SunshadeHoard** — Mini-boss / golden-hour variant with warm tones + heavy metal.

## Inspector Parameters
- `chest_type` — See enum above
- `width`, `height`, `depth`
- `lid_angle` — 0 = closed, 60–90 = nicely open for display
- `strap_count`, `has_lock`
- `crystal_density` — 0 to 1 (adds glowing crystal clusters)
- `damage_level` — Adds cracks / broken straps
- `emissive_strength` — Cyan glow for glitch/crystal variants
- `primary_color`, `accent_color` — Override defaults

## Runtime Usage (in actual levels)
Once baked, attach `interactable_chest.gd` to the root of your placed chest.

It supports:
- E to open (with animation hook)
- Different loot tables per `chest_type` or custom `loot_id`
- Optional story beat trigger on first open (`chestOpened_<id>`)
- Integration with `QuestTracker` and `GameData`

## Future Enhancements (tell me what to add)
- More lock styles (crystal padlock, rune lock, broken)
- Particle burst on open (cyan sparks / pollen)
- Animated lid with proper hinge pivot
- Randomization seed for consistent procedural generation across sessions
- Export to glTF
- Integration with harvesting system (some chests are "living" and need tools to open)

## Lore Tie-in Ideas
- Some chests are "bound" — opening gives temporary debuffs or faction reputation changes.
- Glitched caches can contain "Patch Notes" fragments or forbidden knowledge.
- Crystal chests sometimes contain "Echo Fragments" that advance specific character bonds (Velvet, Elara, etc.).

---

Built for the Lumora agency project — Grok + Hermes collaboration.  
Last updated: 2026-06

If you want more chest types, better geometry, or a full UI panel with presets gallery, just say the word.