@tool
extends Node3D
class_name TreasureChestBuilder

## Lumora 3D Treasure Chest Procedural Builder
## Attach to a Node3D. Tweak values in the inspector, then call rebuild().

enum ChestType {
	WOODEN_RUINED,
	CRYSTAL_INFUSED,
	STONE_RELIC,
	GLITCHED_CACHE,
	SUNSHADE_HOARD
}

@export_category("Lumora Chest")
@export var chest_type: ChestType = ChestType.WOODEN_RUINED
@export_range(0.6, 2.5, 0.05) var width: float = 1.4
@export_range(0.6, 2.0, 0.05) var height: float = 1.0
@export_range(0.6, 2.0, 0.05) var depth: float = 1.0
@export_range(-10, 110, 1) var lid_angle_deg: float = 45.0

@export_category("Details")
@export_range(1, 5) var strap_count: int = 3
@export var has_lock: bool = true
@export_range(0.0, 1.0, 0.05) var crystal_density: float = 0.0
@export_range(0.0, 1.0, 0.05) var damage_level: float = 0.15
@export_range(0.0, 2.0, 0.1) var emissive_strength: float = 0.6

@export_category("Colors (Lumora Palette)")
@export var primary_color: Color = Color(0.25, 0.18, 0.12)      # Dark weathered wood/stone
@export var accent_color: Color = Color(0.15, 0.55, 0.42)       # Verdant
@export var glow_color: Color = Color(0.3, 0.85, 0.95)          # Cyan glitch / crystal

@export_category("Actions")
@export var auto_rebuild: bool = true
@export_tool_button("Rebuild Chest") var rebuild_button: Callable = rebuild
@export_tool_button("Bake as New Scene") var bake_button: Callable = create_baked_instance

var _built := false

func _ready() -> void:
	if not Engine.is_editor_hint():
		rebuild()

func _process(_delta: float) -> void:
	if Engine.is_editor_hint() and auto_rebuild and not _built:
		rebuild()

func rebuild() -> void:
	# Clear previous build
	for child in get_children():
		if child.name.begins_with("Chest_") or child.name.begins_with("Crystal_"):
			child.queue_free()
	
	await get_tree().process_frame
	
	_build_chest_body()
	_build_lid()
	_build_metal_straps()
	if has_lock:
		_build_lock()
	if crystal_density > 0.05:
		_add_crystal_growth()
	
	_built = true
	print("Lumora Chest rebuilt: ", ChestType.keys()[chest_type])

func _build_chest_body() -> void:
	var body := MeshInstance3D.new()
	body.name = "Chest_Body"
	
	var mesh := BoxMesh.new()
	mesh.size = Vector3(width, height * 0.65, depth)
	body.mesh = mesh
	
	var mat := _create_base_material(primary_color)
	body.material_override = mat
	
	add_child(body)
	body.owner = self if Engine.is_editor_hint() else null

	# Simple inner rim / lip for visual interest
	var lip := MeshInstance3D.new()
	lip.name = "Chest_Lip"
	var lip_mesh := BoxMesh.new()
	lip_mesh.size = Vector3(width * 1.02, 0.08, depth * 1.02)
	lip.mesh = lip_mesh
	lip.position.y = height * 0.65 * 0.5 - 0.04
	lip.material_override = _create_base_material(accent_color.darkened(0.3))
	add_child(lip)
	lip.owner = self if Engine.is_editor_hint() else null

func _build_lid() -> void:
	var lid_root := Node3D.new()
	lid_root.name = "Chest_LidRoot"
	lid_root.position.y = height * 0.65 * 0.5
	add_child(lid_root)
	lid_root.owner = self if Engine.is_editor_hint() else null
	
	var lid := MeshInstance3D.new()
	lid.name = "Chest_Lid"
	var lid_mesh := BoxMesh.new()
	lid_mesh.size = Vector3(width * 1.05, 0.18, depth * 1.08)
	lid.mesh = lid_mesh
	lid.position.z = -depth * 0.08  # Slight overhang
	lid.rotation_degrees.x = -lid_angle_deg
	lid.material_override = _create_base_material(primary_color.lightened(0.1))
	lid_root.add_child(lid)
	lid.owner = self if Engine.is_editor_hint() else null

	# Lid metal edge
	var edge := MeshInstance3D.new()
	edge.name = "Lid_Edge"
	var edge_mesh := BoxMesh.new()
	edge_mesh.size = Vector3(width * 1.08, 0.06, depth * 1.12)
	edge.mesh = edge_mesh
	edge.position = Vector3(0, 0.06, -depth * 0.06)
	edge.rotation_degrees.x = -lid_angle_deg
	edge.material_override = _create_metal_material()
	lid_root.add_child(edge)
	edge.owner = self if Engine.is_editor_hint() else null

func _build_metal_straps() -> void:
	var strap_height := height * 0.65
	var spacing := depth / (strap_count + 1)
	
	for i in range(strap_count):
		var z := -depth * 0.5 + spacing * (i + 1)
		
		# Vertical strap on front
		var strap := MeshInstance3D.new()
		strap.name = "Strap_%d" % i
		var s_mesh := BoxMesh.new()
		s_mesh.size = Vector3(0.12, strap_height, 0.08)
		strap.mesh = s_mesh
		strap.position = Vector3(0, 0, z)
		strap.material_override = _create_metal_material()
		add_child(strap)
		strap.owner = self if Engine.is_editor_hint() else null
		
		# Damage / broken strap chance
		if damage_level > 0.4 and randf() < damage_level * 0.7:
			strap.scale.y = randf_range(0.4, 0.75)
			strap.position.y -= strap_height * 0.2

func _build_lock() -> void:
	var lock := MeshInstance3D.new()
	lock.name = "Chest_Lock"
	var lock_mesh := BoxMesh.new()
	lock_mesh.size = Vector3(0.35, 0.28, 0.18)
	lock.mesh = lock_mesh
	lock.position = Vector3(0, height * 0.32, depth * 0.5 + 0.06)
	lock.material_override = _create_metal_material(0.9)
	add_child(lock)
	lock.owner = self if Engine.is_editor_hint() else null
	
	# Lock glow / crystal detail for special types
	if chest_type == ChestType.CRYSTAL_INFUSED or chest_type == ChestType.GLITCHED_CACHE:
		var crystal := MeshInstance3D.new()
		crystal.name = "Lock_Crystal"
		var c_mesh := BoxMesh.new()
		c_mesh.size = Vector3(0.12, 0.22, 0.12)
		crystal.mesh = c_mesh
		crystal.position = Vector3(0, 0.14, 0.12)
		crystal.material_override = _create_crystal_material()
		lock.add_child(crystal)
		crystal.owner = self if Engine.is_editor_hint() else null

func _add_crystal_growth() -> void:
	var count := int(lerp(2, 7, crystal_density))
	var body_top := height * 0.65 * 0.5
	
	for i in count:
		var cluster := Node3D.new()
		cluster.name = "Crystal_Cluster_%d" % i
		
		var x := randf_range(-width * 0.4, width * 0.4)
		var z := randf_range(-depth * 0.4, depth * 0.4)
		cluster.position = Vector3(x, body_top + randf() * 0.2, z)
		
		# Simple crystal "spikes" made from scaled boxes (cheap & low-poly)
		for j in range(randi_range(2, 4)):
			var spike := MeshInstance3D.new()
			spike.name = "Spike_%d" % j
			var s := BoxMesh.new()
			var spike_h := randf_range(0.25, 0.65) * (0.6 + crystal_density * 0.8)
			s.size = Vector3(0.09, spike_h, 0.09)
			spike.mesh = s
			spike.position = Vector3(randf_range(-0.15, 0.15), spike_h * 0.5, randf_range(-0.15, 0.15))
			spike.rotation_degrees = Vector3(randf_range(-25, 25), randf() * 360, randf_range(-25, 25))
			spike.material_override = _create_crystal_material()
			cluster.add_child(spike)
			spike.owner = self if Engine.is_editor_hint() else null
		
		add_child(cluster)
		cluster.owner = self if Engine.is_editor_hint() else null

func _create_base_material(base_color: Color) -> StandardMaterial3D:
	var mat := StandardMaterial3D.new()
	mat.albedo_color = base_color
	mat.roughness = 0.85
	mat.metallic = 0.0
	
	if damage_level > 0.2:
		mat.uv1_scale = Vector3(2.0 + damage_level * 3.0, 2.0, 1.0)  # Fake wear
	
	return mat

func _create_metal_material(brightness: float = 1.0) -> StandardMaterial3D:
	var mat := StandardMaterial3D.new()
	mat.albedo_color = Color(0.55, 0.58, 0.62) * brightness
	mat.metallic = 0.85
	mat.roughness = 0.35
	mat.emission_enabled = emissive_strength > 0.1 and (chest_type == ChestType.GLITCHED_CACHE or chest_type == ChestType.CRYSTAL_INFUSED)
	if mat.emission_enabled:
		mat.emission = glow_color * emissive_strength * 0.6
	return mat

func _create_crystal_material() -> StandardMaterial3D:
	var mat := StandardMaterial3D.new()
	mat.albedo_color = glow_color.lerp(Color(0.6, 0.95, 0.7), 0.3)
	mat.emission_enabled = true
	mat.emission = glow_color * (0.7 + emissive_strength * 0.8)
	mat.metallic = 0.2
	mat.roughness = 0.15
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA if chest_type == ChestType.GLITCHED_CACHE else BaseMaterial3D.TRANSPARENCY_DISABLED
	if mat.transparency != BaseMaterial3D.TRANSPARENCY_DISABLED:
		mat.albedo_color.a = 0.85
	return mat

func create_baked_instance() -> Node3D:
	"""Creates a clean, self-contained static copy of the current chest (no builder script)."""
	var baked := Node3D.new()
	baked.name = "LumoraChest_" + ChestType.keys()[chest_type]
	
	# Duplicate visual structure
	for child in get_children():
		if child is MeshInstance3D:
			var dup := child.duplicate()
			baked.add_child(dup)
			dup.owner = baked
	
	# Add a simple static body for collision (optional)
	var static_body := StaticBody3D.new()
	static_body.name = "StaticBody"
	baked.add_child(static_body)
	static_body.owner = baked
	
	var col := CollisionShape3D.new()
	col.shape = BoxShape3D.new()
	col.shape.size = Vector3(width, height * 0.8, depth)
	static_body.add_child(col)
	col.owner = baked
	
	print("Baked Lumora chest instance created. You can now save this as a .tscn")
	return baked

# Quick preset helper (call from code or add buttons in a UI)
func apply_preset(preset: ChestType) -> void:
	chest_type = preset
	match preset:
		ChestType.WOODEN_RUINED:
			primary_color = Color(0.28, 0.22, 0.15)
			accent_color = Color(0.22, 0.42, 0.28)
			glow_color = Color(0.2, 0.6, 0.5)
			emissive_strength = 0.1
			crystal_density = 0.1
			damage_level = 0.35
		ChestType.CRYSTAL_INFUSED:
			primary_color = Color(0.18, 0.25, 0.22)
			glow_color = Color(0.35, 0.92, 0.75)
			emissive_strength = 1.1
			crystal_density = 0.85
			damage_level = 0.1
		ChestType.GLITCHED_CACHE:
			primary_color = Color(0.12, 0.14, 0.18)
			accent_color = Color(0.15, 0.65, 0.78)
			glow_color = Color(0.25, 0.9, 1.0)
			emissive_strength = 1.6
			crystal_density = 0.6
			damage_level = 0.25
		ChestType.STONE_RELIC:
			primary_color = Color(0.32, 0.30, 0.28)
			accent_color = Color(0.18, 0.32, 0.25)
			glow_color = Color(0.4, 0.55, 0.45)
			emissive_strength = 0.25
			crystal_density = 0.35
			damage_level = 0.55
		ChestType.SUNSHADE_HOARD:
			primary_color = Color(0.35, 0.26, 0.12)
			accent_color = Color(0.65, 0.45, 0.18)
			glow_color = Color(1.0, 0.82, 0.35)
			emissive_strength = 0.8
			crystal_density = 0.25
			damage_level = 0.2
	
	if auto_rebuild:
		rebuild()