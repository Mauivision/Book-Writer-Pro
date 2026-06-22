# ============================================================================
# updated_build_manager.gd
# Patched version of the original build_manager.gd for Phase 1 integration.
#
# Key improvements:
# - Uses the full Lumora resource set via LumoraResources + PlayerResources
# - More buildable objects with meaningful costs
# - Better feedback and integration points for future systems (chests, houses)
#
# How to use:
# - Replace or merge with your current scripts/build_manager.gd
# - Requires PlayerResources and LumoraResources autoloads
# ============================================================================

extends Node

signal build_mode_toggled(active: bool)
signal object_placed(object: Node3D)

var build_mode_active := false
var current_object_index := 0
var preview_instance: Node3D = null
var rotation_degrees := 0.0

# Expanded placeable objects using the full resource system
var placeable_objects: Array[String] = [
	"res://scenes/build_objects/crystal_cluster.tscn",
	"res://scenes/build_objects/stone_platform.tscn",
	"res://scenes/build_objects/small_ruin.tscn",
	# New from our Chest Builder integration (Phase 2 ready)
	# "res://scenes/props/treasure_chests/wooden_storage_chest.tscn",
	# "res://scenes/props/treasure_chests/crystal_infused_chest.tscn",
]

# Resource costs now use the full Lumora resource vocabulary
var object_costs: Array[Dictionary] = [
	{ "crystal_shard": 2 },                                    # Crystal Cluster
	{ "stone": 3, "wood": 1 },                                 # Stone Platform (now requires wood too)
	{ "stone": 4, "wood": 3, "echo_fragment": 1 },             # Small Ruin
	# Example future costs
	# { "wood": 8, "fiber": 4 },                               # Wooden Storage Chest
	# { "stone": 6, "crystal_shard": 3, "echo_fragment": 2 },  # Advanced structure
]

func _ready() -> void:
	print("[BuildManager] Phase 1 upgraded version loaded. Full resources active.")

func toggle_build_mode() -> void:
	build_mode_active = !build_mode_active
	build_mode_toggled.emit(build_mode_active)
	rotation_degrees = 0.0

	if build_mode_active:
		_create_preview()
		print("[Build] BUILD MODE ON")
		print("  1-%d : Select object" % placeable_objects.size())
		print("  Left Click : Place (costs resources)")
		print("  R : Rotate | Right Click : Delete")
		print("  B : Exit build mode")
	else:
		_clear_preview()
		print("[Build] Build mode OFF")

func _input(event: InputEvent) -> void:
	if event.is_action_pressed("toggle_build"):
		toggle_build_mode()
		return

	if not build_mode_active:
		return

	# Number key selection (supports more than 3 objects now)
	if event is InputEventKey and event.pressed:
		var key = event.keycode
		if key >= KEY_1 and key <= KEY_9:
			var index = key - KEY_1
			if index < placeable_objects.size():
				current_object_index = index
				rotation_degrees = 0.0
				_update_preview()
				print("[Build] Selected: ", current_object_index + 1)

	# Rotation
	if event.is_action_pressed("rotate_build"):
		rotation_degrees = fmod(rotation_degrees + 90, 360)
		if preview_instance:
			preview_instance.rotation_degrees.y = rotation_degrees

	# Place
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		try_place_current()

	# Delete under cursor (simple raycast placeholder)
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_RIGHT:
		_try_delete_under_cursor()

func _create_preview() -> void:
	_clear_preview()
	if current_object_index >= placeable_objects.size():
		return

	# Simple visual preview (replace with actual scene instance later)
	preview_instance = MeshInstance3D.new()
	preview_instance.mesh = BoxMesh.new()
	var mat = StandardMaterial3D.new()
	mat.albedo_color = Color(0.4, 0.9, 0.6, 0.4)
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	preview_instance.material_override = mat
	add_child(preview_instance)

func _update_preview() -> void:
	_clear_preview()
	_create_preview()

func _clear_preview() -> void:
	if preview_instance:
		preview_instance.queue_free()
		preview_instance = null

func try_place_current() -> bool:
	if not build_mode_active or current_object_index >= placeable_objects.size():
		return false

	var cost: Dictionary = object_costs[current_object_index] if current_object_index < object_costs.size() else {}
	var inventory = get_node_or_null("/root/PlayerResources")
	if not inventory:
		print("[Build] No PlayerResources found!")
		return false

	# Check costs
	for resource in cost:
		if not inventory.has_material(resource, cost[resource]):
			print("[Build] Not enough %s" % LumoraResources.get_display_name(resource))
			return false

	# Spend resources
	for resource in cost:
		inventory.remove_material(resource, cost[resource])

	# TODO: Actually instantiate the real scene at preview position
	print("[Build] Placed object %d. Cost: %s" % [current_object_index + 1, cost])

	# Future: Emit signal with actual placed node for WorldManager persistence
	object_placed.emit(null)  
	return true

func _try_delete_under_cursor() -> void:
	# Placeholder - implement proper raycast + deletion + refund logic later
	print("[Build] Delete under cursor (implement raycast + refund)")
