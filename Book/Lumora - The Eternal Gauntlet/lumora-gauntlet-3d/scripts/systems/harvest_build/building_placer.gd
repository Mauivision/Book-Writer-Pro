extends Node3D
class_name BuildingPlacer

## Building / Prop Placement System for Lumora.
## Enter build mode (B key), select props (chests, workbenches, platforms, lanterns), place them with resource cost.
## Perfect for player houses and world customization.

signal build_mode_toggled(active: bool)
signal prop_placed(prop_id: String, position: Vector3)

@export var player_inventory: ResourceInventory
@export var build_mode: bool = false

var current_prop_id: String = ""
var preview_instance: Node3D

# Props the player can build (expand this with our chest builder and nature kit)
var buildable_props := {
	"storage_chest": {"cost": {"wood": 8, "fiber": 4}, "scene": "res://assets/props/treasure-chests/examples/GlitchedAdminCache.tscn"},
	"simple_workbench": {"cost": {"wood": 12, "stone": 6}, "scene": "res://scenes/props/Workbench.tscn"},
	"crystal_lantern": {"cost": {"stone": 3, "crystal_shard": 1}, "scene": "res://scenes/props/CrystalLantern.tscn"},
	"wood_platform": {"cost": {"wood": 6}, "scene": "res://scenes/props/Platform.tscn"}
}

var placed_props: Array[Dictionary] = []  # For persistence

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("build_mode"):  # Bind "B" in project settings
		toggle_build_mode()

func toggle_build_mode() -> void:
	build_mode = not build_mode
	build_mode_toggled.emit(build_mode)
	
	if build_mode:
		print("Build mode ON — Press 1-4 to select props, Left Click to place")
	else:
		_clear_preview()
		print("Build mode OFF")

func select_prop(prop_id: String) -> void:
	if not buildable_props.has(prop_id):
		return
	
	current_prop_id = prop_id
	_clear_preview()
	_create_preview()

func _create_preview() -> void:
	# In real implementation, load the actual scene or use a cheap mesh preview
	preview_instance = MeshInstance3D.new()
	preview_instance.mesh = BoxMesh.new()
	preview_instance.material_override = StandardMaterial3D.new()
	preview_instance.material_override.albedo_color = Color(0.3, 0.8, 0.6, 0.5)
	preview_instance.material_override.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	add_child(preview_instance)

func _process(_delta: float) -> void:
	if build_mode and preview_instance:
		# Raycast from camera to ground and position preview
		var camera = get_viewport().get_camera_3d()
		if camera:
			var mouse_pos = get_viewport().get_mouse_position()
			var from = camera.project_ray_origin(mouse_pos)
			var to = from + camera.project_ray_normal(mouse_pos) * 100
			# Simple placeholder — in real game use proper raycast to terrain
			preview_instance.global_position = to

func try_place() -> bool:
	if not build_mode or current_prop_id == "":
		return false
	
	var cost: Dictionary = buildable_props[current_prop_id].cost
	for res in cost:
		if not player_inventory or not player_inventory.has_resource(res, cost[res]):
			print("Not enough ", res)
			return false
	
	# Consume resources
	for res in cost:
		player_inventory.remove_resource(res, cost[res])
	
	# Actually place the prop (instantiate real scene)
	var prop_data = buildable_props[current_prop_id]
	var placed = Node3D.new()  # Replace with actual scene load in real project
	placed.name = current_prop_id + "_" + str(randi() % 1000)
	placed.global_position = preview_instance.global_position if preview_instance else global_position
	
	get_tree().current_scene.add_child(placed)
	
	placed_props.append({
		"id": current_prop_id,
		"position": placed.global_position,
		"scene": prop_data.scene
	})
	
	prop_placed.emit(current_prop_id, placed.global_position)
	print("Placed: ", current_prop_id)
	return true

func _clear_preview() -> void:
	if preview_instance:
		preview_instance.queue_free()
		preview_instance = null

# Persistence helpers
func get_placed_props_data() -> Array:
	return placed_props.duplicate(true)

func load_placed_props(data: Array) -> void:
	placed_props = data.duplicate(true)
	# In real game, re-instantiate all saved props at their positions