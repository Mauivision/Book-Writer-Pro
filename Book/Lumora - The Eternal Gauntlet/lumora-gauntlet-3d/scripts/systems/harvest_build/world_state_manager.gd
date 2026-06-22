extends Node
class_name WorldStateManager

## Simple but effective persistence for harvested nodes and placed buildings.
## One manager per zone or a global one with zone keys.

signal world_state_loaded(zone_id: String)

var current_zone: String = "verdant_meadow"
var harvested_state: Dictionary = {}   # { "harvestable_node_name": {data} }
var placed_buildings: Dictionary = {}  # zone -> array of placed props

func set_zone(zone_id: String) -> void:
	current_zone = zone_id

func mark_harvestable_depleted(node_name: String, data: Dictionary) -> void:
	if not harvested_state.has(current_zone):
		harvested_state[current_zone] = {}
	harvested_state[current_zone][node_name] = data

func get_harvestable_state(node_name: String) -> Dictionary:
	if harvested_state.has(current_zone) and harvested_state[current_zone].has(node_name):
		return harvested_state[current_zone][node_name]
	return {}

func save_placed_buildings(zone_id: String, buildings: Array) -> void:
	placed_buildings[zone_id] = buildings

func get_placed_buildings(zone_id: String) -> Array:
	return placed_buildings.get(zone_id, [])

# Full save / load for the whole world state (call from your main game save system)
func get_full_save_data() -> Dictionary:
	return {
		"harvested": harvested_state,
		"buildings": placed_buildings
	}

func load_full_save_data(data: Dictionary) -> void:
	harvested_state = data.get("harvested", {})
	placed_buildings = data.get("buildings", {})
	world_state_loaded.emit(current_zone)