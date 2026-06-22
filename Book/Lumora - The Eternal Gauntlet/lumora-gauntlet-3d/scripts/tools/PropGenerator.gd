@tool
extends Node

# Lumora Gauntlet 3D - Procedural Prop Generator
# Use this to quickly create low-poly environment assets directly in Godot.
# For hero assets and characters, use Blender and import .glb files.

class_name PropGenerator

# === MATERIALS (assign these in the editor or via code) ===
@export var verdant_material: StandardMaterial3D
@export var ruin_material: StandardMaterial3D
@export var echo_material: StandardMaterial3D

# === GENERATORS ===

func create_crystal_cluster(spikes: int = 5, height: float = 1.2, radius: float = 0.6, material: StandardMaterial3D = null) -> MeshInstance3D:
	"""Creates a low-poly crystal cluster made of several spikes."""
	var mesh_instance = MeshInstance3D.new()
	var st = SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	
	if material:
		mesh_instance.material_override = material
	elif verdant_material:
		mesh_instance.material_override = verdant_material
	
	for i in range(spikes):
		var angle = (float(i) / spikes) * TAU
		var offset = Vector3(cos(angle), 0, sin(angle)) * (radius * 0.4)
		var spike_height = height * randf_range(0.7, 1.3)
		
		# Simple 4-sided pyramid spike
		var base_center = offset
		var tip = offset + Vector3(0, spike_height, 0)
		
		var p1 = base_center + Vector3(radius * 0.3, 0, 0).rotated(Vector3.UP, angle)
		var p2 = base_center + Vector3(0, 0, radius * 0.3).rotated(Vector3.UP, angle)
		var p3 = base_center - Vector3(radius * 0.3, 0, 0).rotated(Vector3.UP, angle)
		var p4 = base_center - Vector3(0, 0, radius * 0.3).rotated(Vector3.UP, angle)
		
		# Add quad as two triangles
		st.add_vertex(p1)
		st.add_vertex(p2)
		st.add_vertex(tip)
		
		st.add_vertex(p2)
		st.add_vertex(p3)
		st.add_vertex(tip)
		
		st.add_vertex(p3)
		st.add_vertex(p4)
		st.add_vertex(tip)
		
		st.add_vertex(p4)
		st.add_vertex(p1)
		st.add_vertex(tip)
	
	st.generate_normals()
	mesh_instance.mesh = st.commit()
	return mesh_instance

func create_ruin_pillar(height: float = 3.0, width: float = 0.8, material: StandardMaterial3D = null) -> MeshInstance3D:
	"""Creates a simple ruined pillar with some damage."""
	var mesh_instance = MeshInstance3D.new()
	var st = SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	
	if material:
		mesh_instance.material_override = material
	elif ruin_material:
		mesh_instance.material_override = ruin_material
	
	# Simple box pillar with a broken top
	var half_w = width / 2.0
	var points = [
		Vector3(-half_w, 0, -half_w),
		Vector3(half_w, 0, -half_w),
		Vector3(half_w, 0, half_w),
		Vector3(-half_w, 0, half_w),
		Vector3(-half_w, height, -half_w),
		Vector3(half_w, height, -half_w),
		Vector3(half_w, height, half_w),
		Vector3(-half_w, height, half_w),
	]
	
	# Simple cube faces (you can expand this)
	_add_quad(st, points[0], points[1], points[5], points[4])
	_add_quad(st, points[1], points[2], points[6], points[5])
	_add_quad(st, points[2], points[3], points[7], points[6])
	_add_quad(st, points[3], points[0], points[4], points[7])
	_add_quad(st, points[4], points[5], points[6], points[7]) # top (broken look)
	
	st.generate_normals()
	mesh_instance.mesh = st.commit()
	return mesh_instance

func create_rock(size: float = 1.0, material: StandardMaterial3D = null) -> MeshInstance3D:
	"""Creates a simple low-poly rock."""
	var mesh_instance = MeshInstance3D.new()
	var st = SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	
	if material:
		mesh_instance.material_override = material
	elif ruin_material:
		mesh_instance.material_override = ruin_material
	
	var s = size * 0.5
	# Rough irregular shape using a few offset points
	var points = [
		Vector3(-s, 0, -s),
		Vector3(s, 0, -s),
		Vector3(s, 0, s),
		Vector3(-s, 0, s),
		Vector3(-s * 0.6, size, -s * 0.6),
		Vector3(s * 0.7, size * 0.9, -s * 0.5),
		Vector3(s * 0.5, size * 0.85, s * 0.6),
		Vector3(-s * 0.4, size * 0.95, s * 0.7),
	]
	
	# Very basic faces
	_add_quad(st, points[0], points[1], points[5], points[4])
	_add_quad(st, points[1], points[2], points[6], points[5])
	_add_quad(st, points[2], points[3], points[7], points[6])
	_add_quad(st, points[3], points[0], points[4], points[7])
	_add_quad(st, points[4], points[5], points[6], points[7])
	
	st.generate_normals()
	mesh_instance.mesh = st.commit()
	return mesh_instance

func create_signpost(height: float = 2.2, material: StandardMaterial3D = null) -> MeshInstance3D:
	"""Creates a simple wooden-style signpost."""
	var mesh_instance = MeshInstance3D.new()
	var st = SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	
	if material:
		mesh_instance.material_override = material
	elif ruin_material:
		mesh_instance.material_override = ruin_material
	
	var w = 0.15
	var h = height
	
	# Simple post
	_add_quad(st, Vector3(-w, 0, -w), Vector3(w, 0, -w), Vector3(w, h, -w), Vector3(-w, h, -w))
	_add_quad(st, Vector3(w, 0, -w), Vector3(w, 0, w), Vector3(w, h, w), Vector3(w, h, -w))
	_add_quad(st, Vector3(w, 0, w), Vector3(-w, 0, w), Vector3(-w, h, w), Vector3(w, h, w))
	_add_quad(st, Vector3(-w, 0, w), Vector3(-w, 0, -w), Vector3(-w, h, -w), Vector3(-w, h, w))
	
	st.generate_normals()
	mesh_instance.mesh = st.commit()
	return mesh_instance

func create_crystal_formation(size: float = 1.5) -> MeshInstance3D:
	"""Creates a larger, more complex crystal formation."""
	var mesh_instance = MeshInstance3D.new()
	var st = SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	
	mesh_instance.material_override = verdant_material if verdant_material else echo_material
	
	# Central large crystal
	_add_simple_spike(st, Vector3.ZERO, size * 1.0, 0.35)
	_add_simple_spike(st, Vector3(0.4, 0, 0.3), size * 0.7, 0.25)
	_add_simple_spike(st, Vector3(-0.5, 0, -0.2), size * 0.65, 0.28)
	_add_simple_spike(st, Vector3(0.2, 0, -0.6), size * 0.55, 0.22)
	
	st.generate_normals()
	mesh_instance.mesh = st.commit()
	return mesh_instance

func _add_simple_spike(st: SurfaceTool, base: Vector3, height: float, radius: float):
	var tip = base + Vector3(0, height, 0)
	var p1 = base + Vector3(radius, 0, 0)
	var p2 = base + Vector3(0, 0, radius)
	var p3 = base - Vector3(radius, 0, 0)
	var p4 = base - Vector3(0, 0, radius)
	
	st.add_vertex(p1); st.add_vertex(p2); st.add_vertex(tip)
	st.add_vertex(p2); st.add_vertex(p3); st.add_vertex(tip)
	st.add_vertex(p3); st.add_vertex(p4); st.add_vertex(tip)
	st.add_vertex(p4); st.add_vertex(p1); st.add_vertex(tip)

func _add_quad(st: SurfaceTool, a: Vector3, b: Vector3, c: Vector3, d: Vector3):
	st.add_vertex(a)
	st.add_vertex(b)
	st.add_vertex(c)
	
	st.add_vertex(a)
	st.add_vertex(c)
	st.add_vertex(d)

# === HELPER ===
func get_lumora_material(name: String) -> StandardMaterial3D:
	match name.to_lower():
		"verdant", "crystal":
			return verdant_material
		"ruin", "stone":
			return ruin_material
		"echo":
			return echo_material
		_:
			return null

func spawn_random_prop(type: String = "any", position: Vector3 = Vector3.ZERO) -> MeshInstance3D:
	"""Convenience function for quick world population."""
	var prop: MeshInstance3D
	
	match type:
		"crystal":
			prop = create_crystal_cluster(randi_range(4, 8), randf_range(0.9, 2.0), randf_range(0.5, 1.1))
		"rock":
			prop = create_rock(randf_range(0.8, 2.2))
		"pillar":
			prop = create_ruin_pillar(randf_range(2.0, 4.5), randf_range(0.7, 1.3))
		"sign":
			prop = create_signpost()
		_:
			# Random
			var r = randi() % 4
			if r == 0: prop = create_crystal_cluster()
			elif r == 1: prop = create_rock()
			elif r == 2: prop = create_ruin_pillar()
			else: prop = create_signpost()
	
	prop.position = position
	return prop
