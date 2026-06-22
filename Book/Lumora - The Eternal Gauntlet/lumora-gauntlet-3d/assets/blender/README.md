# Blender Source Files

This folder contains the original .blend files for Lumora assets.

## Organization

- `props/` — Rocks, ruins, crystals, signs, furniture
- `characters/` — Velvet, enemies (Scout, Wisp, etc.)
- `environment/` — Large modular pieces, terrain kits
- `weapons/` — Gauntlet variants, tools

## Naming Convention

- `prop_crystal_cluster_01.blend`
- `char_velvet_rig_01.blend`
- `env_ruin_wall_kit.blend`

## Export Rule

Always export as **glTF 2.0 (.glb)** with:
- Apply Transforms
- UVs + Normals
- Materials (even if we override in Godot)

Do **not** commit high-res textures or baked lightmaps here — keep source clean.

## Current Status

- Greybox phase (all assets still defined in Godot .tscn files)
- Transitioning to Blender pipeline

When creating a new prop:
1. Model in Blender
2. Export to `../models/`
3. Create matching material in `../materials/`
4. Replace greybox MeshInstance in scenes
