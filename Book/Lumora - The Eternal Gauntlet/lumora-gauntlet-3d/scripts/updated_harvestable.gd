# ============================================================================
# updated_harvestable.gd
# Improved Harvestable for Phase 1.
# 
# Improvements over original:
# - Supports the full resource list via LumoraResources
# - Optional durability (multiple harvests from one node)
# - Tool requirements (future-proof)
# - Better persistence integration with WorldManager
# - Cleaner signals
#
# Usage: Replace or extend your current harvestable.gd
# ============================================================================

extends "res://scripts/simple_interact.gd"

@export var resource_id: String = "crystal_shard"   # Now uses full Lumora IDs
@export var amount_per_harvest: int = 1
@export var max_durability: int = 3                 # 0 or 1 = one-time like before
@export var required_tool: String = "any"           # "any", "axe", "pickaxe", "sickle"
@export var harvest_id: String = ""                 # Unique for persistence
@export var completes_quest: String = ""

var current_durability: int = max_durability
var is_depleted: bool = false

func _ready() -> void:
	super._ready()
	current_durability = max_durability

	if prompt == "Interact":
		prompt = "Harvest " + LumoraResources.get_display_name(resource_id)

	# Load persistence state
	_check_persistence()

func interact() -> bool:
	if is_depleted:
		print("[Harvest] This node is spent.")
		return false

	# Tool check (expand later with player equipment)
	if required_tool != "any":
		print("[Harvest] Requires tool: ", required_tool)  # placeholder

	var inventory = get_node_or_null("/root/PlayerResources")
	if not inventory:
		print("[Harvest] No PlayerResources found!")
		return false

	# Give resources
	var amount = amount_per_harvest
	if current_durability == 1:
		amount += 1  # Bonus on last harvest

	inventory.add_material(resource_id, amount)

	# Visual feedback
	_spawn_harvest_particles()

	current_durability -= 1

	if current_durability <= 0:
		_deplete_node()

	# Persistence
	if harvest_id != "":
		var wm = get_node_or_null("/root/WorldManager")
		if wm and wm.has_method("mark_harvest_spent"):
			wm.mark_harvest_spent("", harvest_id)

	# Quest hook
	if completes_quest != "" and get_node_or_null("/root/WorldManager"):
		# Extend as needed
		pass

	return true

func _deplete_node() -> void:
	is_depleted = true
	_dim_as_harvested()
	print("[Harvest] Node depleted: ", name)

func _check_persistence() -> void:
	var wm = get_node_or_null("/root/WorldManager")
	if wm and wm.has_method("is_harvest_spent") and harvest_id != "":
		if wm.is_harvest_spent("", harvest_id):
			is_depleted = true
			_dim_as_harvested()

func _dim_as_harvested() -> void:
	for child in get_children():
		if child is MeshInstance3D:
			var mesh = child as MeshInstance3D
			if mesh.material_override:
				var mat = mesh.material_override.duplicate() as StandardMaterial3D
				mat.albedo_color = mat.albedo_color.darkened(0.6)
				mat.albedo_color.a = 0.35
				mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
				mesh.material_override = mat
			else:
				var new_mat = StandardMaterial3D.new()
				new_mat.albedo_color = Color(0.4, 0.4, 0.4, 0.35)
				new_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
				mesh.material_override = new_mat

func _spawn_harvest_particles() -> void:
	# TODO: Replace with actual particle system using Lumora palette
	print("[Harvest] Particles would spawn here for ", resource_id)