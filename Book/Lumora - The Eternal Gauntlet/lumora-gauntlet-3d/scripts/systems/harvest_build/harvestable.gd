extends Node3D
class_name Harvestable

## Attach this to any tree, rock, bush, or crystal node in the world.
## Works great with the Kenney Nature Kit assets we downloaded.

signal harvested(resource_id: String, amount: int)
signal depleted()

@export var resource_id: String = "wood"          # wood, stone, fiber, crystal_shard, etc.
@export var max_health: int = 3
@export var tool_required: String = "any"         # "any", "axe", "pickaxe", "sickle"
@export var base_yield: int = 2
@export var respawn_time: float = 180.0           # seconds (0 = never respawns)
@export var is_depleted: bool = false

var current_health: int = max_health
var _respawn_timer: Timer

@onready var visual: Node3D = $Visual if has_node("Visual") else self

func _ready() -> void:
	current_health = max_health
	if respawn_time > 0:
		_respawn_timer = Timer.new()
		_respawn_timer.wait_time = respawn_time
		_respawn_timer.one_shot = true
		_respawn_timer.timeout.connect(_on_respawn)
		add_child(_respawn_timer)

func harvest(tool: String = "any", player_inventory: ResourceInventory = null) -> bool:
	if is_depleted:
		return false
	
	if tool_required != "any" and tool != tool_required:
		print("Wrong tool! Need: ", tool_required)
		return false
	
	current_health -= 1
	
	var yield_amount := base_yield
	if current_health <= 0:
		yield_amount += 1  # Bonus on final hit
		_deplete()
	
	if player_inventory:
		player_inventory.add_resource(resource_id, yield_amount)
	
	harvested.emit(resource_id, yield_amount)
	
	# Visual feedback (simple for now — can be replaced with particles/animation)
	if visual:
		visual.scale = Vector3.ONE * (0.6 + (current_health / float(max_health)) * 0.4)
	
	return true

func _deplete() -> void:
	is_depleted = true
	if visual:
		visual.visible = false  # or play depletion animation
	
	depleted.emit()
	
	if respawn_time > 0 and _respawn_timer:
		_respawn_timer.start()

func _on_respawn() -> void:
	is_depleted = false
	current_health = max_health
	if visual:
		visual.visible = true
		visual.scale = Vector3.ONE
	
	print("Harvestable respawned: ", name)

# For world persistence
func get_save_data() -> Dictionary:
	return {
		"resource_id": resource_id,
		"is_depleted": is_depleted,
		"current_health": current_health
	}

func load_save_data(data: Dictionary) -> void:
	is_depleted = data.get("is_depleted", false)
	current_health = data.get("current_health", max_health)
	if visual:
		visual.visible = not is_depleted
		if not is_depleted:
			visual.scale = Vector3.ONE * (0.6 + (current_health / float(max_health)) * 0.4)