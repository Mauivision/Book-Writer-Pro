# Lumora — Harvesting, Resources, Workbench & Building System

This is the **core gameplay loop engine** for Lumora: **Explore → Harvest → Build → World Remembers**.

It was designed to be the most practical and integrated system possible, tying directly into everything we've already built:
- Treasure Chest Builder (storage in houses and world)
- Character Creator (Farmers, Vendors, Guild members react to your harvesting)
- Player House (storage + cooking uses these exact resources)

## What You Get

### 1. Harvestable Component (`harvestable.gd`)
- Attach to any tree, rock, bush, or crystal from the **Kenney Nature Kit** (or your own models).
- Configurable yield, tool requirements (axe/pickaxe), health, and respawn timers.
- Visual feedback + full persistence support.

### 2. Resource Inventory (`resource_inventory.gd`)
- Lightweight, signal-driven inventory.
- Used by Player, Chests, Player House storage, Workbenches, and NPCs.

### 3. Workbench & Crafting (`workbench.gd`)
- Placeable crafting stations.
- Recipe system (wooden chests, lanterns, stew kits, etc.).
- Different station types (basic, advanced, crystal forge, cooking).

### 4. Building & Placement System (`building_placer.gd`)
- Press **B** to enter build mode (as specified in original Lumora controls).
- Place storage chests (using our Chest Builder), workbenches, platforms, lanterns, etc.
- Resource costs + world persistence.
- Perfect for customizing your player house or claiming land.

### 5. World State Manager (`world_state_manager.gd`)
- Saves which harvestables are depleted.
- Saves all player-placed buildings per zone.
- Easy to hook into your main save system.

### 6. Editor Workshop Tool
- `HarvestWorkshopTool` — quickly test harvesting, inventory, and placement without running the full game.

## Data Files

- `data/resources.json` — All core resources (wood, stone, fiber, crystal_shards, echo_fragments, etc.)
- Recipes live inside `workbench.gd` for now (easy to move to JSON later).

## How Everything Connects (The Magic)

**Player House**
- When you buy a house → automatically gets storage chests (from Chest Builder)
- Cooking station consumes resources harvested from the world
- Meals give buffs + story progression

**Characters & Economy**
- Farmers sell extra resources
- Guild has quests that require specific harvested materials
- Tavern patrons react to how much "Echo" you've gathered

**World Feel**
- Harvest a tree → it stays gone until it respawns (or forever in some zones)
- Build a chest in the meadow → it stays there even after you leave the zone
- The world actually remembers your actions (core Lumora fantasy)

## Quick Integration Guide

1. **For Harvestables**:
   - Take any mesh from Kenney Nature Kit
   - Add a `Harvestable` node as parent or sibling
   - Set `resource_id`, `tool_required`, `base_yield`

2. **For Player**:
   - Give the player a `ResourceInventory`
   - When pressing E near a harvestable, call `harvestable.harvest("axe", player_inventory)`

3. **For Building**:
   - Add `BuildingPlacer` to the player or a manager node
   - Bind the "build_mode" input action to the B key

4. **Persistence**:
   - Use `WorldStateManager` as an autoload
   - On zone load, restore depleted harvestables and placed props

## Recommended Next Steps (Pick One)

This system is now very complete on the code side. The highest value next pieces are:

A. **3D Visual Polish** for harvesting (proper animations, particles, tool swing VFX, stump replacement models)

B. **Full Recipe Editor Tool** (similar to the Character Workshop) so you can balance crafting without touching code

C. **NPC Interaction with Harvesting** (Farmers react when you over-harvest their fields, give quests, sell tools)

D. **Actual 3D Building Props** using the PropGenerator style from the book project + our Chest Builder

E. **Deep integration** into one of the two existing Godot projects (merge this + previous systems into `lumora-gauntlet-3d`)

---

This + the Character System + Chest Builder gives you an extremely strong foundation for the "Eternal Gauntlet" fantasy.

The world now has real economy, player agency, and persistence.

**What do you want to build next?** Tell me the priority and we'll keep going.