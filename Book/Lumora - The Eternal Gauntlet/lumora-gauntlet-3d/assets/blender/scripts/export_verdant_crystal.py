"""Headless Blender: Lumora Verdant Crystal prop -> SM_VerdantCrystal_01.glb"""
import bpy
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODELS = os.path.join(ROOT, "models")
BLEND_OUT = os.path.join(ROOT, "blender", "props", "SM_VerdantCrystal_01.blend")
GLB_OUT = os.path.join(MODELS, "SM_VerdantCrystal_01.glb")

os.makedirs(MODELS, exist_ok=True)
os.makedirs(os.path.dirname(BLEND_OUT), exist_ok=True)

# Fresh scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# Low-poly crystal: 6-sided cone + smaller tip cone
bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.35, depth=0.9, location=(0, 0, 0.45))
base = bpy.context.active_object
base.name = "SM_VerdantCrystal_01"

bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.12, depth=0.35, location=(0, 0, 1.05))
tip = bpy.context.active_object
tip.name = "CrystalTip"

bpy.ops.object.select_all(action="DESELECT")
base.select_set(True)
tip.select_set(True)
bpy.context.view_layer.objects.active = base
bpy.ops.object.join()

crystal = bpy.context.active_object
crystal.name = "SM_VerdantCrystal_01"
bpy.ops.object.shade_flat()

# Verdant Crystal material (pipeline palette)
mat = bpy.data.materials.new(name="M_VerdantCrystal")
mat.use_nodes = True
nodes = mat.node_tree.nodes
bsdf = nodes.get("Principled BSDF")
if bsdf:
    bsdf.inputs["Base Color"].default_value = (0.15, 0.9, 0.65, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.3
    bsdf.inputs["Emission Color"].default_value = (0.1, 0.4, 0.28, 1.0)
    bsdf.inputs["Emission Strength"].default_value = 0.6
crystal.data.materials.append(mat)

bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

# Save source .blend for manual edits in START-BLENDER.cmd
bpy.ops.wm.save_as_mainfile(filepath=BLEND_OUT)

# Export glTF binary for Godot
bpy.ops.export_scene.gltf(
    filepath=GLB_OUT,
    export_format="GLB",
    export_apply=True,
    export_materials="EXPORT",
    export_texcoords=True,
    export_normals=True,
)

print(f"Exported: {GLB_OUT}")
print(f"Blend:    {BLEND_OUT}")
