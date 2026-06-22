extends Node
class_name ResourceInventory

## Simple but powerful inventory system for Lumora.
## Used by Player, Player House storage, Chests (via TreasureChestBuilder), NPCs, and Workbenches.

signal resource_changed(resource_id: String, new_amount: int)
signal inventory_full(resource_id: String)

@export var max_slots: int = 24
@export var resources: Dictionary = {}  # { "wood": 47, "crystal_shard": 3 }

func add_resource(resource_id: String, amount: int = 1) -> bool:
	if amount <= 0:
		return false
	
	var current := resources.get(resource_id, 0)
	var new_amount := current + amount
	
	# TODO: Add proper stack size limits from resources.json later
	resources[resource_id] = new_amount
	resource_changed.emit(resource_id, new_amount)
	return true

func remove_resource(resource_id: String, amount: int = 1) -> bool:
	if amount <= 0:
		return false
	if not resources.has(resource_id) or resources[resource_id] < amount:
		return false
	
	resources[resource_id] -= amount
	if resources[resource_id] <= 0:
		resources.erase(resource_id)
	
	resource_changed.emit(resource_id, resources.get(resource_id, 0))
	return true

func has_resource(resource_id: String, amount: int = 1) -> bool:
	return resources.get(resource_id, 0) >= amount

func get_amount(resource_id: String) -> int:
	return resources.get(resource_id, 0)

func get_all_resources() -> Dictionary:
	return resources.duplicate()

func clear() -> void:
	resources.clear()

# For saving
func to_dict() -> Dictionary:
	return {"resources": resources.duplicate()}

func from_dict(data: Dictionary) -> void:
	resources = data.get("resources", {}).duplicate()