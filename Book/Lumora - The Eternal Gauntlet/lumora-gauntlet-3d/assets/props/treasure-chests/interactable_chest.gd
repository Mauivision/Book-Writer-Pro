extends Node3D
class_name InteractableChest

## Runtime script for placed Lumora treasure chests.
## Attach this to baked chest instances in your levels.

@export var chest_type: TreasureChestBuilder.ChestType = TreasureChestBuilder.ChestType.WOODEN_RUINED
@export var loot_table_id: String = ""           # Optional override. Falls back to chest_type
@export var story_beat_on_open: String = ""      # e.g. "firstChest" or "glitchedCacheFound"
@export var is_opened: bool = false

@onready var body: Node3D = $Chest_Body if has_node("Chest_Body") else self

signal opened(chest: InteractableChest)

func _ready() -> void:
	add_to_group("interactable")
	if is_opened:
		_set_open_state(true)

func can_interact(_player: Node3D) -> bool:
	return not is_opened

func interact(player: Node3D) -> void:
	if is_opened:
		return
	
	is_opened = true
	_set_open_state(true)
	
	# Trigger story
	if not story_beat_on_open.is_empty() and StoryUI:
		StoryUI.enqueue_beat(story_beat_on_open)
	
	# Loot drop
	_drop_loot(player)
	
	opened.emit(self)

func _set_open_state(open: bool) -> void:
	# Look for lid and rotate it
	var lid_root := get_node_or_null("Chest_LidRoot")
	if lid_root:
		var target_angle := 72.0 if open else 0.0
		# Simple immediate rotation — replace with tween + sound later
		lid_root.rotation_degrees.x = -target_angle
	
	# Optional: change material to "opened" state or spawn particles here

func _drop_loot(_player: Node3D) -> void:
	# TODO: Wire to your actual inventory / loot system
	# For now we just print + optional quest hook
	var loot_id := loot_table_id if not loot_table_id.is_empty() else _get_default_loot_id()
	print("Lumora Chest opened — would drop loot from table: ", loot_id)
	
	# Example quest/story integration
	if QuestTracker:
		match chest_type:
			TreasureChestBuilder.ChestType.CRYSTAL_INFUSED:
				QuestTracker.on_beat("crystalChestOpened")
			TreasureChestBuilder.ChestType.GLITCHED_CACHE:
				QuestTracker.on_beat("glitchedCacheOpened")

func _get_default_loot_id() -> String:
	match chest_type:
		TreasureChestBuilder.ChestType.WOODEN_RUINED:
			return "common_meadow"
		TreasureChestBuilder.ChestType.CRYSTAL_INFUSED:
			return "verdant_crystal"
		TreasureChestBuilder.ChestType.GLITCHED_CACHE:
			return "sky_admin_cache"
		TreasureChestBuilder.ChestType.STONE_RELIC:
			return "ruin_relic"
		TreasureChestBuilder.ChestType.SUNSHADE_HOARD:
			return "sunshade_hoard"
		_:
			return "common"

# Optional: Call this from a save system to restore opened state
func force_set_opened(opened: bool) -> void:
	is_opened = opened
	_set_open_state(opened)