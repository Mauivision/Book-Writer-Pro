# Lumora Gauntlet 3D — Blender + Godot Asset Pipeline

**Goal**: Move from greybox prototyping to polished low-poly assets while keeping iteration fast.

## Recommended Tools
- **Blender 4.0+** (free)
- Godot 4.3 (Forward+)
- Export format: **glTF 2.0 (.glb)** — best format for Godot 4

## Folder Structure

```
lumora-gauntlet-3d/
├── assets/
│   ├── blender/          # Source .blend files (organized by category)
│   │   ├── props/
│   │   ├── characters/
│   │   └── environment/
│   ├── models/           # Exported .glb files
│   ├── materials/        # Reusable .tres materials (Lumora palette)
│   └── textures/         # Any hand-painted or baked textures
├── scenes/
├── scripts/
└── docs/
```

## Lumora Color Palette (StandardMaterial3D base)

| Name              | Albedo                          | Emission          | Roughness | Notes                     |
|-------------------|---------------------------------|-------------------|-----------|---------------------------|
| Verdant Crystal   | #26E6A6 (0.15, 0.9, 0.65)      | #1A6647           | 0.3       | Glowing crystal           |
| Ruin Stone        | #8C7A66 (0.55, 0.48, 0.4)      | -                 | 0.9       | Weathered stone           |
| Echo Fragment     | #8A5FFF (0.54, 0.37, 1.0)      | #3D1A99           | 0.25      | Mystical / purple glow    |
| Radiant Gold      | #E8C96A (0.91, 0.79, 0.42)     | #664F1A           | 0.4       | Accent / important        |
| Dark Metal        | #3D3D3D                         | -                 | 0.85      | For tools/weapons         |

Create these as reusable `.tres` files in `assets/materials/`.

## Workflow

### 1. Modeling in Blender
- Keep it low-poly (target 500–4000 tris per character/prop).
- Use **Shade Flat** + Edge Split or Auto Smooth for that chunky look.
- UV unwrap (Smart UV Project is usually fine for props).
- Name objects clearly (`SM_CrystalCluster_01`, `SK_Velvet`, etc.).

### 2. Materials in Blender (for preview only)
Use simple Principled BSDF.
Export with **Materials** enabled.

### 3. Export from Blender
**Recommended settings**:
- Format: glTF 2.0 (.glb)
- Apply Modifiers: Yes
- UVs: Yes
- Normals: Yes
- Materials: Yes
- Compress: Yes (smaller files)

**File naming**:
- `SM_` = Static Mesh (props)
- `SK_` = Skeletal Mesh (characters)
- `AN_` = Animation (if separate)

### 4. Import into Godot
1. Drag `.glb` into `assets/models/`
2. Godot will generate an `.import` file.
3. Recommended import settings:
   - **Meshes > Light Baking**: Static
   - **Meshes > Generate LODs**: Optional (disable for tiny props)
   - **Materials > Material Type**: Standard (or ORM if you bake)

### 5. Applying Lumora Palette
Instead of using Blender materials, create reusable `StandardMaterial3D` resources in `assets/materials/` and assign them in Godot. This keeps colors consistent and easy to tweak globally.

## Starter Steps (Do These Now)

1. Open Blender and create your first prop (recommend: a better-looking Crystal Cluster or a signpost).
2. Export as `SM_CrystalCluster_Improved.glb`
3. Import into Godot.
4. Create matching materials in `assets/materials/` using the palette above.
5. Replace greybox meshes in `verdant_meadow.tscn` or `echo_hollow.tscn`.

## Tips & Gotchas

- **Scale**: Blender default unit = 1m. Godot uses the same. Keep consistent.
- **Rotation**: Apply all rotations before export (`Ctrl+A` → Rotation).
- **Vertex Colors**: Can be used for variation without extra textures.
- **Armature**: For characters, use one Armature per character. Name bones clearly.
- **Animations**: Export actions separately or in one file. Use AnimationPlayer in Godot for state machines.

## Future Upgrades

- Baked lighting (LightmapGI or VoxelGI)
- Custom shaders (crystal refraction, emissive pulsing)
- Texture atlasing for performance
- Blender addons: "glTF 2.0" exporter (built-in), "Asset Library" management

## Hybrid Approach (Recommended)

Use **both systems together**:

- Use the **PropGenerator** (`scripts/tools/PropGenerator.gd`) for filler props, rocks, crystal formations, signs, and quick iteration. It now supports:
  - Crystal clusters & formations
  - Ruin pillars
  - Rocks
  - Signposts
  - `spawn_random_prop()` helper

- The enemy scripts (`enemy_scout.gd` and `enemy_wisp.gd`) are also self-contained.

- Use **Blender** for hero assets, characters (Velvet, future NPCs), and important modular environment kits.

See `scenes/tools/PropGeneratorDemo.tscn` for a live example of the in-engine generator.

---

**Next Action**: Tell me what you want to model first (e.g., "better crystal cluster", "Velvet character blockout", "ruin wall kit", "signpost"), and I'll guide you step-by-step through the Blender → Godot process, including exact material settings.

This pipeline will let us gradually replace all the greybox with proper low-poly Lumora assets while keeping development fast.

---

## Character, Environment & Object Design Briefs (Lumora Style)

### Overall Style
- Low-poly (chunky, readable silhouettes)
- Strong use of the Lumora palette (Verdant teal-green, Echo purple, Ruin warm stone, Radiant gold accents)
- Slightly mystical / ancient feel with glowing elements
- Readable from a top-down ~45° camera angle

---

### Characters

**Velvet (Main NPC)**
- Young woman with short dark hair and a slightly tattered cloak
- Carries a small satchel and a crystal shard on a cord
- Color accents: deep indigo + gold
- Personality: calm, slightly melancholic, knowledgeable about the old pact

**Scout Enemy**
- Thin, hunched humanoid with glowing red eyes
- Wears tattered wrappings and simple armor plates
- Moves on foot, aggressive melee

**Wisp Enemy**
- Ethereal floating entity, more energy than solid form
- Core glow + faint trailing particles
- Fast and evasive, prefers distance attacks

**Future Characters (for later)**
- Haruto (more armored, golden accents)
- Other runners / corrupted variants
- Small spirit creatures

---

### Environments

**Verdant Meadow** (Starting Hub)
- Lush floating island with patches of glowing crystal leaking through the ground
- Mix of living crystal and old stone ruins
- Bright, hopeful but slightly eerie lighting

**Echo Hollow** (New Combat Zone)
- Lower, misty area with heavy echo fragment presence
- Darker stone + strong purple/blue glows
- More verticality and broken floating platforms

**Other Future Zones**
- Forest Ruin Gate → Overgrown ancient ruins
- Crystal Overlook → High, exposed vantage with strong vertical crystals
- Shattered Path → Broken floating walkways

---

### Objects & Props

High priority props to model first:

1. **Crystal Cluster** (various sizes)
2. **Ruin Wall / Pillar sections** (modular kit)
3. **Signposts & Markers** (navigation + lore)
4. **Fallen Statues** (environmental storytelling)
5. **Small Chests / Containers**
6. **Gauntlet Cuff** (player visual upgrade later)
7. **Echo Resonators** (special interactables)

---

## Recommended Modeling Order (Practical)

**Phase 1 (High Impact)**
- Improved Crystal Cluster
- 2-3 Modular Ruin pieces
- Signpost

**Phase 2**
- Basic enemy meshes (Scout + Wisp)
- Velvet blockout

**Phase 3**
- More environment kits
- Special objects (chests, resonators)

---

## Next Steps

Tell me which direction you want to go:

- **"Start with environment props"** → I'll give detailed Blender steps for a modular ruin kit or crystal variations.
- **"Start with characters"** → We'll begin with a low-poly Velvet blockout or Scout enemy.
- **"Focus on objects first"** → Signposts, chests, and interactables.
- **"Improve the in-engine generators more"** → I can add more procedural objects right now.
