# World Event & Chapter System Integration Instructions

This adds Crimson Desert-style dynamic world progression to your Lumora Zelda-like game.

## Key Features Implemented
- Chapters/events that permanently change world state (e.g., city siege until resolved).
- "Main city" (hub_city) under attack/siege when chapter active: damaged look, enemies, blocked exits.
- Completing the linked quest ("banish_demon") restores the city (new content, safe, open paths).
- Persistence via existing WorldManager + new event state.
- Easy to extend with more events from chapters_events.json.
- Ties into your existing quest system, zones, NPCs, enemies, and our previous systems (inventory, chests, etc.).

## Files to Copy/Merge into Book Project

1. Copy `world_events/` folder to `res://world_events/` (or scripts/world_events/).

2. **WorldEventManager.gd**
   - Add as Autoload: "WorldEventManager"
   - It auto-loads chapters_events.json

3. **chapters_events.json**
   - Copy to `res://data/chapters_events.json`
   - Extend with more chapters from your book (use existing storyBeats/quests).

4. **hub_city.tscn**
   - Copy to `res://scenes/hub_city.tscn`
   - This is a basic demo main city (plaza + buildings). Expand with your assets/Kenney models.
   - The CityStateController.gd is embedded in the scene.

5. **CityStateController.gd**
   - Already referenced in the .tscn. If separate, put in scripts/.

6. **Optional: Patch WorldManager**
   - In your existing `scripts/world_manager.gd`, after loading quests or in complete_quest, add:
     ```gdscript
     var event_mgr = get_node_or_null("/root/WorldEventManager")
     if event_mgr:
         event_mgr.resolve_chapter_on_quest_complete(quest_id)
     ```
   - Also enhance change_zone to check:
     ```gdscript
     var event_mgr = get_node_or_null("/root/WorldEventManager")
     if event_mgr and not event_mgr.can_enter_zone(target_zone):
         print("Cannot enter - chapter incomplete or event blocking.")
         return
     ```

7. **Update zones data (lumora_zones.json)**
   - Add the hub city:
     ```json
     {
       "id": "hub_city",
       "name": "Golden Tankard Hub",
       "description": "The main city. Currently under demon siege until chapter resolved.",
       "exits": [ ... ],
       "requires_chapter": "ch3_demon_summon"   // optional extension
     }
     ```
   - In WorldManager.change_zone, respect "requires" or call event_mgr.

8. **Demo Usage**
   - Load "hub_city" scene (add to your zone system or start scene).
   - Walk to "DemoTrigger" area to activate the siege event.
   - City becomes dangerous (enemies spawn, gate blocked).
   - To "complete chapter": In console or via debug, call:
     `WorldEventManager.resolve_chapter("ch3_demon_summon")`
     or complete the quest "banish_demon" (extend your quest complete to call the resolve hook).
   - Reload or re-enter the city: It should be in restored state (barrier down, no event enemies, new content hints).

## Tying to Existing Systems
- **Quests**: Uses your WorldManager quest system. Link your "banish_demon" or similar to the chapter.
- **Enemies**: Reuses enemy_wisp.gd etc. Spawn more or stronger during event.
- **NPCs**: Change story_beat based on state (siege vs restored dialogue).
- **Building/Harvest**: Event can disable some harvestables or allow emergency builds.
- **Gems/Treasures** (our other system): The demon event can drop rare gems as rewards.
- **Player House**: Once restored, player can claim/buy property in the hub.

## Making it More Zelda-like
- During siege: Add puzzles (e.g., find ritual items in other zones to power the banish).
- Exploration: The "meteor" creates new paths or hidden areas only accessible during event.
- Boss: Replace demo wisps with a stronger enemy or new "Demon" script with phases.
- World changes persist across sessions thanks to the save system.

## Next Improvements
- Visual polish for "damaged" state (use particles, different materials, our gem glows).
- Dynamic music (tense during event).
- NPC reactions and side quests during the chapter.
- More events (e.g., meteor in meadow changes terrain permanently after).
- UI: Chapter log or world map showing active events.

## Testing
- Start in verdant_meadow or directly load hub_city.tscn.
- Trigger event.
- "Complete" via resolve or quest.
- Change scenes and return - state should persist.

If you need a full "banish_demon" quest script, boss enemy, or more city details, let me know. This should give you a functioning demo of the progression system! 

Copy these into your project and test the hub_city scene. It builds on the existing player_3d, camera, zone_exit, npc, and enemy scripts.