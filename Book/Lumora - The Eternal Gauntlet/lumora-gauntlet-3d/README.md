# Lumora Gauntlet 3D - Current State

**Status**: Playable sandbox with real economy + persistence (Explore → Harvest → Build → World Remembers). Phase 1 complete.

## What you can do right now
- Double-click RUN_SANDBOX.bat
- Walk the 4 connected zones (Meadow is the start)
- Harvest nodes with E (Verdant Crystals, Ruin Stone piles, Echo Veins) — materials go into your inventory
- Press B for Build Mode — every placement now costs harvested materials (no freebies)
- Talk to Velvet (first canon NPC) near the Workbench in the Meadow for story dialogue
- Use the Workbench (E) to attempt crafting once you have enough shards
- Place, rotate, delete your own structures in the world
- Leave the zone or quit the game — your buildings and harvested nodes remember what you did (persistence via JSON)

## Controls
- WASD/Arrows + Space (dash)
- E : Harvest / Talk / Use
- B : Toggle build mode
- 1-3 + LMB / R / RMB (in build mode)

## The Loop
You must walk the world and take its pieces before you are allowed to reshape it. This is the heart of Lumora's Crystal Gauntlet.

## Current World Map
1. Verdant Meadow (starting hub, multiple harvest types + Velvet)
2. Forest Ruin Gate (ruins, stone to gather)
3. Crystal Overlook (high crystals + echo fragments)
4. Shattered Path + collapsed aqueduct connections

Next goals: Persistence (saved builds + harvested state), more zones/polish, light combat, deeper quests from the book.

**Art Pipeline**: We are transitioning from pure greybox to Blender-made low-poly assets using the Lumora palette. See `docs/Blender_Asset_Pipeline.md` for the workflow.

**In-Engine Model Creation**: We also have a `PropGenerator` tool (see `scripts/tools/`) that lets you quickly generate procedural low-poly props (crystals, pillars, etc.) directly in Godot using the official Lumora materials. Great for rapid world building and iteration.


## CONSOLIDATED (see docs/CONSOLIDATED_LUMORA_GAUNTLET.md) - All three prior games (2D retro, products 3D skeleton, this advanced) + our hermes modules merged into this one. Full resources, characters, house, chests, gems, dynamic world events (city siege until chapter complete), book canon via GameData/lumora.json.
