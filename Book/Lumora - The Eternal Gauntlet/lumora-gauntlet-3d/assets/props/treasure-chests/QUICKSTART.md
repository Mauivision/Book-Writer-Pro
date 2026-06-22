# Lumora Treasure Chest Builder — Quickstart

## Fastest way to get chests in your game

### 1. In Godot Editor (recommended for iteration)

1. Copy this entire `treasure-chests` folder into your project.
2. Create a new scene (e.g. `res://scenes/props/ChestDemo.tscn`).
3. Add a **Node3D** as the root.
4. Attach the script `treasure_chest_builder.gd` to it.
5. In the inspector:
   - Choose a `Chest Type`
   - Adjust width/height/depth, lid angle, crystal density, etc.
   - Hit the **"Rebuild Chest"** button (or enable Auto Rebuild)
6. When it looks good, click **"Bake as New Scene"**.
7. Godot will print the baked node in the output. Right-click it in the remote tree → **Save Branch as Scene**.
8. Now you have a clean, lightweight chest you can instance anywhere.

### 2. From Code (great for level generation)

```gdscript
var builder = preload("res://assets/props/treasure-chests/treasure_chest_builder.gd").new()
add_child(builder)

builder.chest_type = TreasureChestBuilder.ChestType.CRYSTAL_INFUSED
builder.crystal_density = 0.9
builder.emissive_strength = 1.4
builder.lid_angle_deg = 68
builder.rebuild()

# Later, when player is near:
var baked = builder.create_baked_instance()
get_tree().current_scene.add_child(baked)
baked.global_position = some_position

# Then attach runtime behavior
var runtime = preload("res://assets/props/treasure-chests/interactable_chest.gd").new()
baked.add_child(runtime)
runtime.chest_type = builder.chest_type
runtime.story_beat_on_open = "foundFirstCrystalChest"
```

### 3. Recommended Presets for Lumora

| Location / Context          | Recommended Type          | Crystal | Glow | Damage | Notes |
|-----------------------------|---------------------------|---------|------|--------|-------|
| Verdant Leak Meadow tutorial| Wooden Ruined             | 0.1     | 0.1  | 0.4    | Starter loot |
| Near Velvet NPC             | Crystal Infused           | 0.7     | 1.0  | 0.05   | Special reward |
| Forest Ruin Gate            | Stone Relic               | 0.3     | 0.3  | 0.6    | Ancient feel |
| Sky Dungeon approach        | Glitched Cache            | 0.5     | 1.8  | 0.3    | Cyan seams + floating shards |
| Mini-boss arena             | Sunshade Hoard            | 0.2     | 0.9  | 0.15   | Golden / warm tones |

### Pro Tips

- Use the builder in a separate "asset workshop" scene. Bake dozens of variations, then save them into `res://assets/props/chests/`.
- For performance, baked chests are just MeshInstance3D nodes + optional StaticBody — very cheap.
- You can replace the generated BoxMesh with higher quality imported models later (e.g. from Kenney or your own Blender work) while keeping the same node structure.
- The crystal clusters are intentionally cheap (boxes) so you can have many chests on screen.

---

Need:
- A full UI gallery scene with 12 presets?
- Better geometry (beveled edges, actual hinge pivots)?
- Particle / sound hooks on open?
- Integration with the existing PropGenerator in the book project?

Just tell me and I'll extend the builder.