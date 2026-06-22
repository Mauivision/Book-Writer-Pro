# Gems, Assets & Treasures - Lumora Expansion

This system expands the resource and loot economy with **Gems** as high-value magical resources and **Treasures** as the premium content inside chests and world discoveries.

## Core Concepts

### Gems
Special resources that are rarer and more powerful than basic materials (wood, stone, fiber).
- Have unique properties (growth, memory, instability, etc.)
- Used in advanced crafting, upgrades, and story progression
- Can be found in specific harvest nodes or inside high-tier treasures

Current Gem Types:
- Verdant Heart Gem (growth/healing)
- Echo Resonance Gem (memory/story)
- Skyward Sapphire (mobility/clarity)
- Sunshade Amber (warmth/construction)
- Glitch Prism (power/instability - dangerous)
- Bloodstone of the Gauntlet (legendary life/eternal)

### Treasures
Different categories of valuable finds with varying rarity and contents.
- Common Cache → basic materials
- Ruin Hoard / Crystal Vein → mid-tier + gems
- Sky Admin Cache / Gauntlet Relic → high-end gems and story items

### Integration Points
- **Chests**: Different chest types (from our Chest Builder) are thematically linked to certain treasure types.
- **Harvesting**: Special crystal nodes can yield gems.
- **Crafting**: Gems are used in high-tier recipes (chests, upgrades, elixirs).
- **Player House**: Gems can be displayed or used in special crafting stations.
- **Story/Quests**: Many story beats and companion bonds revolve around acquiring rare gems.

## Files in This System

- `data/gems.json` — Full definitions and properties
- `data/treasure_types.json` — Treasure categories
- `data/loot_tables.json` — What each treasure source drops
- `gems_treasures_manager.gd` — Central manager script (autoload recommended)

## How to Use in the Book Project (After Phase 1)

1. Add `GemsTreasuresManager` as an autoload.
2. Load the three JSON files on startup.
3. When a chest is opened, call `GemsTreasuresManager.open_treasure_chest(chest_type, player_inventory)`.
4. Update your Workbench recipes to accept gems as ingredients.
5. Add rare crystal harvest nodes in the world that can drop gems.

## Future Expansions (Assets Side)

For 3D assets:
- Unique low-poly gem models (different shapes/colors with emissive materials)
- Special "treasure glow" particle effects
- Animated chests that react when they contain gems
- Collectible gem floating pickups

We can generate concept art or texture descriptions for these using image tools when you're ready.

---

This system makes the world feel richer and gives players a reason to explore and take risks for the really good stuff (especially Glitch Prisms and Bloodstones).

Let me know if you want:
- More gem types
- Specific loot tables balanced for different zones
- Integration code for the existing Chest Builder
- 3D asset descriptions ready for generation
