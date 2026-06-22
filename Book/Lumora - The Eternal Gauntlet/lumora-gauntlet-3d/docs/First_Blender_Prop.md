# Your First Blender Prop for Lumora

This is a step-by-step guide to create and import your first custom asset.

## Recommended First Prop

**A better Crystal Cluster** (replaces the current greybox one).

Why? It's iconic to Lumora, easy to model, and appears everywhere.

## Step-by-Step

### 1. In Blender

1. New file → Delete default cube.
2. Add → Mesh → Icosphere (subdivisions: 1)
3. In Edit Mode: Scale and move vertices to make irregular crystal shapes.
4. Add a few smaller crystals around the main one (duplicate + scale + rotate).
5. Select all → Object → Shade Flat.
6. Add a simple material (name it "Crystal_Preview").
7. UV Unwrap (Smart UV Project).
8. File → Export → glTF 2.0 (.glb)
   - Name: `SM_CrystalCluster_01.glb`
   - Apply Modifiers: On
   - UVs + Normals: On

### 2. In Godot

1. Copy the .glb into `assets/models/`
2. Drag it into the scene (e.g., replace a greybox crystal in `verdant_meadow.tscn`).
3. In the Inspector, assign the material:
   - Use `assets/materials/VerdantCrystal.tres` (or create a new one)
4. Scale/rotate as needed.

### 3. Polish Tips

- In Blender, add a slight bevel on edges for better lighting.
- Use vertex colors for variation between crystals.
- Once comfortable, create a few variations (tall, wide, broken).

## Next Props After This

1. Ruin wall section (modular)
2. Signpost / marker
3. Simple rock formation
4. Basic weapon (gauntlet cuff)

Once you have 4–6 props, we can start replacing the greybox in the main zones.

---

When you're ready, tell me:
- "I exported my first prop" → I'll guide you through import + material setup.
- Or "make a character blockout next" if you want to start on Velvet or enemies.
