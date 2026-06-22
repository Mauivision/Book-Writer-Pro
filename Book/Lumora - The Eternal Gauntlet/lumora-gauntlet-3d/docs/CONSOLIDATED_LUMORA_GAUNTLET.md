# CONSOLIDATED LUMORA GAUNTLET 3D - ONE WORKING GAME

This is now the single canonical project consolidating:
- The advanced 3D sandbox from the book manuscript (harvest, build with costs, persistence, multiple zones, PropGenerator, workbench, player_3d, world_manager, etc.).
- Rich story/lore and data-driven structure from the products 3D (full lumora.json with storyBeats, quests, camera specs, GameData autoload, story_triggers, combat_modes).
- Mature 2D lore and mechanics from retro-gauntlet (ported lumoraLore.ts, storyBeats, quest system concepts into the JSON and GD; map data for reference).
- All high-quality modules from hermes-home-base/assets/lumora-3d/ (full resources + PlayerResources inventory, flexible harvest/build with event conditionals, CharacterManager + generator + location templates for Tavern/Guild/Farms etc. + bonds/companions, PlayerHouseSystem with storage/cooking, Treasure Chest Builder 5 variants as placeable/craftable + runtime interactable, GemsTreasuresManager with loot tables, WorldEventManager + chapters_events for dynamic world changes like city demon/meteor siege until chapter complete -- Crimson Desert style gated progression).

## Key Consolidations Made
- Autoloads updated in project.godot: includes GameData (for lumora.json canon), PlayerResources (full 7+ resources replacing limited inventory), CharacterManager, GemsTreasuresManager, PlayerHouseSystem, WorldEventManager, etc. (with MigrationHelper for transition).
- Data: lumora.json (full from products + 2D lore ported to data/2d_lore/), chapters_events.json (for world events), resources.json + gems + loot_tables, buildable_chests.json, craftable recipes, updated lumora_zones.json (with hub_city and requires_chapter).
- Scripts: Replaced/enhanced harvestable.gd, build_manager.gd with full resources + event state queries (from our updated_ versions). Added world_events/ with WorldEventManager, CityStateController, hub_city.tscn (demo main city that changes state on chapter).
- Systems copied: characters/, harvest_build/, gems_and_treasures/, player_house/, props/treasure-chests/ (baked chests as placeables).
- 2D lore: Copied to data/2d_lore/ for reference/porting storyBeats/quests into the unified system.
- Web images: The gauntlet-rpg/Images (366 pixel card concepts) are the visual bible -- use for UI cards in hub, character refs, creature designs for events (e.g., gecko as siege hazard), gem visuals. Documented in hermes assets/lumora-3d/references/gauntlet-rpg-images/.

## How to Run the One Working Game
1. Open this folder in Godot 4.3+.
2. Run via RUN_SANDBOX.bat or editor (main scene title_screen or add hub_city to a zone exit from meadow).
3. In meadow: harvest full resources (wood, fiber, stone, crystal_shard, gems like verdant_gem), build with costs (place chests from builder), talk NPCs (populated via CharacterManager).
4. Trigger event (e.g., via WorldEventManager or demo in hub_city): city siege -- damaged, blocked, enemies, changed dialogue.
5. Complete the linked quest/chapter (e.g., "banish_demon" -- extend with combat/exploration in other zones).
6. Return: city restores permanently (new content, open, safe) -- persists on save/reload/zone hop.
7. Buy house in restored hub, store in chests, cook for buffs + story beats.
8. Use I key or console for status; full economy, companions (recruit via bonds), gems/treasures as rewards.

## Dynamic Events Example (Crimson Desert Style)
See data/chapters_events.json for ch3_demon_summon (or add meteor/dragon via the gecko/skyship visuals from the Images folder).
- Event active: world mutates (hub_city damaged per CityStateController, blocked exits per zone data, harvest/build affected via event queries in updated scripts).
- Chapter complete: permanent restore + new_content (e.g., survivor NPCs via CharacterManager, gem rewards via GemsTreasures, chests via builder).
- Gating: requires_chapter in zones; city "reopens" only after.

## Visuals from Images Folder
The 366 images in BookWriter's gauntlet-rpg/Images (pixel cards with dual characters, crystal geckos, skyships, glowing halls) are now the official visual refs:
- Duality for companions/events (split light/dark).
- Creatures for events (gecko as hazard in demon summon).
- Glowing for gems/chests/materials.
- Card style for BookWriter hub UI or in-game tarot.
- Documented in assets/lumora-3d/references/gauntlet-rpg-images/ (in hermes coordination).

## Next / Polish
- Wire more 2D lore (port specific beats from data/2d_lore/lumoraLore.ts into GameData or chapters).
- Add more chapters/events from book (use the gecko/skyship images for new enemy types in siege/meteor).
- Full 3D assets: use Images + Kenney for models (low-poly with emissives from the glowing cards).
- Combat polish, camera to 58° from lumora.json, UI for inventory/quests/bonds (dynamic from resources/characters).
- Test full loop with one event + house + companion + gems/treasures.
- The 2D retro-gauntlet is now legacy/reference (its lore and mechanics ported); the web hub uses the Images for 2D cards.

This is the ONE working consolidated game. Open in Godot and play the loop with dynamic world changes.

See hermes-home-base/assets/lumora-3d/LUMORA_3D_MERGE_PLAN.md and merge/book_project/ for full context and more guides.
