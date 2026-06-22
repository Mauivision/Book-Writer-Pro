# In-Engine 3D Model Creation Tools

This folder contains tools for creating 3D assets **directly inside Godot**.

## PropGenerator.gd

A script that procedurally generates low-poly props using the Lumora color palette.

### Available Generators
- `create_crystal_cluster()`
- `create_crystal_formation()` (larger, more complex)
- `create_ruin_pillar()`
- `create_rock()`
- `create_signpost()`
- `spawn_random_prop()` (convenience function)

Also includes `enemy_scout.gd` and `enemy_wisp.gd` as self-contained enemy prefabs.

### How to Use

1. Add the `PropGenerator` node to a scene.
2. Assign the materials from `assets/materials/`.
3. Call the generator functions via code or in the editor (with @tool).

Example:
```gdscript
var crystal = prop_generator.create_crystal_cluster(6, 1.5, 0.8, verdant_mat)
add_child(crystal)
```

See `scenes/tools/PropGeneratorDemo.tscn` for a working example.

## Philosophy

- Use these tools for **rapid iteration** and filling the world.
- Move important/hero assets to **Blender** for higher quality and reusability.
- This hybrid approach lets you build fast while keeping the door open to proper art.

## Next Ideas

- More generators (rocks, crystal spikes, broken walls, signs)
- A simple editor plugin with buttons
- Mesh saving to .tres or .mesh files
- Randomization parameters exposed in the inspector
