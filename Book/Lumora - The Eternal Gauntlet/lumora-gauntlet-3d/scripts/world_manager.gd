extends Node

const ZONES_PATH = "res://data/lumora_zones.json"
const BUILDS_SAVE_DIR = "user://lumora_builds"
const BUILDS_ROOT_NAME = "PlayerBuilds"

var zones_data: Dictionary = {}
var current_zone: String = ""

# === Persistence state (in-memory, survives zone hops in one session) ===
var player_builds: Dictionary = {}        # zone_id -> Array of {scene_path, pos:Vector3, rot_y:float}
var spent_harvests: Dictionary = {}       # zone_id -> Array of harvest_id strings

# === Simple Quest State (for story beats) ===
var active_quests: Dictionary = {}   # quest_id -> {state: "active"|"complete", data: {} }
var completed_quests: Array = []

# Quest persistence file
const QUESTS_SAVE_FILE = "user://lumora_builds/quests.json"

func _ready():
	load_zones_data()
	_ensure_save_dir()

func load_zones_data():
	var file = FileAccess.open(ZONES_PATH, FileAccess.READ)
	if file:
		var json = JSON.new()
		var parse_result = json.parse(file.get_as_text())
		if parse_result == OK:
			zones_data = json.data
		file.close()

func _ensure_save_dir():
	if not DirAccess.dir_exists_absolute(BUILDS_SAVE_DIR):
		DirAccess.make_dir_recursive_absolute(BUILDS_SAVE_DIR)
	
	# Also ensure we can save quests
	var quest_dir = BUILDS_SAVE_DIR.get_base_dir()
	if not DirAccess.dir_exists_absolute(quest_dir):
		DirAccess.make_dir_recursive_absolute(quest_dir)

# ---------------- Public API for BuildManager & Harvestables ----------------

func record_player_build(zone: String, scene_path: String, position: Vector3, rotation_y: float):
	if zone == "":
		zone = current_zone
	if not player_builds.has(zone):
		player_builds[zone] = []
	
	var record = {
		"scene_path": scene_path,
		"pos": [position.x, position.y, position.z],
		"rot_y": rotation_y,
		"timestamp": Time.get_datetime_string_from_system()
	}
	player_builds[zone].append(record)
	_save_builds_to_disk(zone)
	print("[WorldManager] Recorded build in ", zone, " (total: ", player_builds[zone].size(), ")")

func remove_player_build(zone: String, position: Vector3, tolerance: float = 0.5):
	if not player_builds.has(zone):
		return
	var list = player_builds[zone]
	for i in range(list.size() - 1, -1, -1):
		var r = list[i]
		var rp = Vector3(r.pos[0], r.pos[1], r.pos[2])
		if rp.distance_to(position) < tolerance:
			list.remove_at(i)
			_save_builds_to_disk(zone)
			print("[WorldManager] Removed build from persistence")
			return

func mark_harvest_spent(zone: String, harvest_id: String):
	if zone == "":
		zone = current_zone
	if not spent_harvests.has(zone):
		spent_harvests[zone] = []
	if not spent_harvests[zone].has(harvest_id):
		spent_harvests[zone].append(harvest_id)
		_save_harvests_to_disk(zone)
		print("[WorldManager] Marked harvest spent: ", harvest_id, " in ", zone)

func is_harvest_spent(zone: String, harvest_id: String) -> bool:
	if zone == "":
		zone = current_zone
	if not spent_harvests.has(zone):
		# Try loading from disk on first check
		_load_harvests_from_disk(zone)
	if spent_harvests.has(zone):
		return spent_harvests[zone].has(harvest_id)
	return false

# ---------------- Simple Quest System ----------------

func start_quest(quest_id: String):
	if not active_quests.has(quest_id):
		active_quests[quest_id] = {"state": "active", "data": {}}
		print("[Quest] Started: ", quest_id)
		_save_quests_to_disk()

func complete_quest(quest_id: String, reward_data: Dictionary = {}):
	if active_quests.has(quest_id) and active_quests[quest_id].state != "complete":
		active_quests[quest_id].state = "complete"
		active_quests[quest_id].data = reward_data
		if not completed_quests.has(quest_id):
			completed_quests.append(quest_id)
		print("[Quest] Completed: ", quest_id)
		_save_quests_to_disk()
		# Hook for dynamic world events (consolidated from our modules)
		var em = get_node_or_null("/root/WorldEventManager")
		if em and em.has_method("resolve_chapter_on_quest_complete"):
			em.resolve_chapter_on_quest_complete(quest_id)
		return true
	return false

func is_quest_active(quest_id: String) -> bool:
	return active_quests.has(quest_id) and active_quests[quest_id].state == "active"

func is_quest_complete(quest_id: String) -> bool:
	return completed_quests.has(quest_id)

func get_quest_data(quest_id: String) -> Dictionary:
	if active_quests.has(quest_id):
		return active_quests[quest_id].data
	return {}

# ---------------- Scene change + restore ----------------

func change_zone(target_zone: String):
	if not zones_data.has("zones"):
		push_error("No zones data loaded!")
		return
	
	var found = false
	for zone in zones_data.zones:
		if zone.id == target_zone:
			found = true
			break
	
	if not found:
		push_error("Zone not found: " + target_zone)
		return
	
	current_zone = target_zone
	var scene_path = "res://scenes/" + target_zone + ".tscn"
	
	if ResourceLoader.exists(scene_path):
		get_tree().change_scene_to_file(scene_path)
		# Restore player-built objects and spent harvests after the new scene loads
		call_deferred("_schedule_restore")
	else:
		push_error("Scene does not exist: " + scene_path)

func _schedule_restore():
	# Give the scene a moment to fully initialize
	get_tree().create_timer(0.08).timeout.connect(restore_builds_for_current_scene)

func restore_builds_for_current_scene():
	if current_zone == "":
		return
	
	var scene = get_tree().current_scene
	if not scene:
		return
	
	# Load any disk data we haven't seen yet this session
	_load_builds_from_disk(current_zone)
	_load_harvests_from_disk(current_zone)
	_load_quests_from_disk()
	
	# Find or create a tidy container for player builds
	var builds_root = scene.get_node_or_null(BUILDS_ROOT_NAME)
	if not builds_root:
		builds_root = Node3D.new()
		builds_root.name = BUILDS_ROOT_NAME
		scene.add_child(builds_root)
	
	# Restore built objects
	if player_builds.has(current_zone):
		for record in player_builds[current_zone]:
			var scene_path = record.scene_path
			if not ResourceLoader.exists(scene_path):
				continue
			var res = load(scene_path)
			if res:
				var inst = res.instantiate()
				builds_root.add_child(inst)
				inst.global_position = Vector3(record.pos[0], record.pos[1], record.pos[2])
				inst.rotation_degrees.y = record.get("rot_y", 0.0)
				inst.set_meta("player_built", true)
	
	print("[WorldManager] Restored builds for ", current_zone, 
		" (", player_builds.get(current_zone, []).size(), " objects)")
	print("[WorldManager] Active quests restored: ", active_quests.size())

# ---------------- Disk persistence (JSON) ----------------

func _get_builds_path(zone: String) -> String:
	return BUILDS_SAVE_DIR + "/" + zone + "_builds.json"

func _get_harvests_path(zone: String) -> String:
	return BUILDS_SAVE_DIR + "/" + zone + "_harvests.json"

func _save_builds_to_disk(zone: String):
	if not player_builds.has(zone):
		return
	var path = _get_builds_path(zone)
	var file = FileAccess.open(path, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(player_builds[zone], "\t"))
		file.close()

func _load_builds_from_disk(zone: String):
	var path = _get_builds_path(zone)
	if not FileAccess.file_exists(path):
		return
	var file = FileAccess.open(path, FileAccess.READ)
	if file:
		var json = JSON.new()
		if json.parse(file.get_as_text()) == OK:
			player_builds[zone] = json.data
		file.close()

func _save_harvests_to_disk(zone: String):
	if not spent_harvests.has(zone):
		return
	var path = _get_harvests_path(zone)
	var file = FileAccess.open(path, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(spent_harvests[zone], "\t"))
		file.close()

# Quest save/load
func _save_quests_to_disk():
	var data = {
		"active_quests": active_quests,
		"completed_quests": completed_quests
	}
	var file = FileAccess.open(QUESTS_SAVE_FILE, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(data, "\t"))
		file.close()

func _load_quests_from_disk():
	if not FileAccess.file_exists(QUESTS_SAVE_FILE):
		return
	var file = FileAccess.open(QUESTS_SAVE_FILE, FileAccess.READ)
	if file:
		var json = JSON.new()
		if json.parse(file.get_as_text()) == OK:
			var data = json.data
			if data.has("active_quests"):
				active_quests = data.active_quests
			if data.has("completed_quests"):
				completed_quests = data.completed_quests
		file.close()

func _load_harvests_from_disk(zone: String):
	var path = _get_harvests_path(zone)
	if not FileAccess.file_exists(path):
		return
	var file = FileAccess.open(path, FileAccess.READ)
	if file:
		var json = JSON.new()
		if json.parse(file.get_as_text()) == OK:
			spent_harvests[zone] = json.data
		file.close()
