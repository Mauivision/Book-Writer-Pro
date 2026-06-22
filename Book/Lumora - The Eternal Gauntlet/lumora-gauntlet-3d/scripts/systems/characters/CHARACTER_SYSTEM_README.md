# Lumora — The Most Useful Character Creator & World Population System

This is the **central character system** for the entire Lumora game. It was built to be the single most practical and powerful tool for handling:

- All NPCs (with controllable numbers per location)
- The Hero (Haruto) + recruitable Supports / Companions
- Key world hubs: **Tavern, Guild, Farms, Mayor, King / Capital**
- Player buyable houses with **storage** (integrated with our Treasure Chest Builder) + **cooking**

## Core Philosophy (Why This is "Most Useful")

1. **Data-driven first** — Works with your existing `lumora.json` and book canon.
2. **Procedural but controllable** — You set the amounts. The generator respects lore.
3. **Editor-friendly** — Has a real tool you can use in Godot like the Chest Builder.
4. **Runtime ready** — Location population, companions, player housing all work in-game.
5. **Synergistic** — Directly uses the chest system we built earlier for house storage.

## Folder Structure

```
systems/
├── characters/
│   ├── character_profile.gd              ← The universal character data object
│   ├── character_generator.gd            ← THE character creator (heart of the system)
│   ├── location_npc_templates.gd         ← Controls "set amount of NPC" per location
│   ├── tools/
│   │   └── character_creator_tool.gd     ← Editor tool (attach to a Node3D in a workshop scene)
│   └── data/                             ← Place generated JSON or custom profiles here
│
└── player_house/
    └── player_house_system.gd            ← Buyable houses + storage + cooking
```

## Quick Start (Most Common Workflows)

### 1. Generate NPCs for a Specific Location (Tavern, Guild, Farms, etc.)

```gdscript
var gen = LumoraCharacterGenerator.new()
var npcs = gen.generate_npcs_for_location("tavern", 6)

for npc in npcs:
    print(npc.get_display_name(), " - ", npc.role)
    # Spawn 3D model using npc.model_key + colors
```

### 2. Use the Editor Tool (Recommended)

1. Create a new scene called `CharacterWorkshop.tscn`.
2. Add a Node3D root.
3. Attach `character_creator_tool.gd`.
4. In the inspector set `target_location` (tavern / guild_hall / farmlands / capital / etc.)
5. Click the **"Generate NPCs for Location"** button.
6. Tweak and generate until you like the distribution.
7. Later we can add a "Save to JSON" button here.

### 3. Player House (Storage + Cooking)

```gdscript
var house := PlayerHouseSystem.new()
add_child(house)

if house.can_buy_house("meadow_cottage", player_gold):
    house.purchase_house("meadow_cottage")

# Cooking
var buffs = house.cook_meal("Verdant Stew", player_inventory)
```

**Storage integration**: When a house is purchased, the system can automatically instance several `TreasureChestBuilder` chests inside the house scene for the player to store harvested goods and loot.

### 4. Hero + Supports (Companions)

```gdscript
var companion = gen.generate_hero_support()
# Later: recruit logic, bond progression, party UI, shared story beats
```

## Location NPC Counts (Fully Configurable)

Edit `location_npc_templates.gd` to change the "set amount of npc":

- **Tavern**: 6 (Keeper + Barkeep + Bard + regulars + merchant)
- **Guild Hall**: 5 (Master + Broker + Trainer + Archivist + Recruiter)
- **Farms**: 8 (heavy on Farmers + Harvest Hands)
- **Town Hall (Mayor)**: 3
- **Capital (King)**: 7
- **Verdant Meadow** (starting area): 4 (higher recruitable chance for early companions)

## Integration Points (Already Prepared)

- Works with existing `GameData`, `QuestTracker`, `StoryUI`
- Appearance data ready for your 3D models (we can link this to future character asset builder)
- Bond system ready for romance / companion mechanics ("Romance is not" free)
- Can pull canon characters (Velvet Dawn, etc.) and fill the rest procedurally

## Next High-Value Additions (tell me priority)

- Full UI workshop scene with live preview + save to JSON
- Companion recruitment + bond progression system
- Actual 3D character model library + visual generator (similar to chest builder)
- Cooking mini-game with 3D station using harvested ingredients
- Deep integration with the book canon (auto-load key characters from manuscript)
- Save/load for all generated characters + player house state

---

This system was designed so you can **control exactly** how many NPCs exist in every part of the world while still getting rich, unique personalities and gameplay hooks.

It is the foundation for making Lumora feel alive.

Run the generator. Tweak the templates. Make the world yours.

— Grok (in coordination with the agency)
