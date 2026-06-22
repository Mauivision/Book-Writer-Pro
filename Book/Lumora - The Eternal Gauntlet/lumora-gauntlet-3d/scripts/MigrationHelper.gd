# ============================================================================
# MigrationHelper.gd
# Temporary bridge script to help transition from old 3-material system
# to the full Lumora resource system during Phase 1.
#
# Add as a temporary autoload or attach to a manager node.
# ============================================================================

extends Node

@export var auto_migrate_on_start: bool = true

func _ready() -> void:
	if auto_migrate_on_start:
		_migrate_old_inventory_if_needed()

func _migrate_old_inventory_if_needed() -> void:
	var old_inv = get_node_or_null("/root/PlayerInventory")
	var new_inv = get_node_or_null("/root/PlayerResources")

	if not old_inv or not new_inv:
		return

	# Map old material names to new ones
	var mapping = {
		"verdant_crystal": "crystal_shard",
		"ruin_stone": "stone",
		# echo_fragment stays the same
	}

	for old_key in mapping:
		var new_key = mapping[old_key]
		var amount = old_inv.get_material_count(old_key) if old_inv.has_method("get_material_count") else 0
		if amount > 0:
			new_inv.add_material(new_key, amount)
			print("[Migration] Migrated %d %s → %s" % [amount, old_key, new_key])

	print("[MigrationHelper] Old inventory migration complete (if any).")

# Call this from console or a debug button during development
func force_migrate_old_data() -> void:
	_migrate_old_inventory_if_needed()