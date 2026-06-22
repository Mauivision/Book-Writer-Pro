# WorldEventManager.gd
# Extends the existing WorldManager with chapter and dynamic world event support.
# This enables Zelda-like progression where story chapters trigger permanent world changes.
# Example: City under demon summon siege until the chapter quest is complete.
#
# Usage:
# - Add as autoload "WorldEventManager"
# - In scenes, query WorldEventManager.is_event_active("city_demon_summon") or is_chapter_complete("ch3_demon_summon")
# - On quest complete (via WorldManager), call resolve_event if applicable.
#
# Integrates with existing WorldManager for persistence and zone changes.

extends Node

signal event_activated(event_id: String)
signal chapter_completed(chapter_id: String)
signal world_state_changed(zone: String, state: Dictionary)

var chapters_data: Dictionary = {}
var active_events: Dictionary = {}  # event_id -> {active: bool, data: {}}
var completed_chapters: Array = []
var zone_states: Dictionary = {}  # zone_id -> {event_active: bool, siege_state: "active"|"restored", ...}

@onready var world_manager = get_node_or_null("/root/WorldManager")

func _ready() -> void:
	load_chapters_data()
	_load_event_state_from_disk()
	
	# Hook into existing quest system if possible
	if world_manager and world_manager.has_method("complete_quest"):
		# We can listen or override, for now poll or manual call resolve on quest complete
		print("[WorldEventManager] Hooked to WorldManager quest system (call resolve_chapter_on_quest_complete manually or extend)")

func load_chapters_data() -> void:
	var path = "res://data/chapters_events.json"
	if FileAccess.file_exists(path):
		var file = FileAccess.open(path, FileAccess.READ)
		var json = JSON.new()
		if json.parse(file.get_as_text()) == OK:
			chapters_data = json.data
		file.close()
		print("[WorldEventManager] Loaded chapters and events data.")
	else:
		push_warning("[WorldEventManager] chapters_events.json not found. Using defaults.")
		# Fallback minimal data
		chapters_data = {
			"chapters": {
				"ch3_demon_summon": {
					"name": "The Demon Summon",
					"resolve_quest": "banish_demon"
				}
			}
		}

func activate_event(event_id: String) -> void:
	if not chapters_data.has("events") or not chapters_data.events.has(event_id):
		return
	
	var event_data = chapters_data.events[event_id]
	var chapter_id = event_data.chapter
	
	active_events[event_id] = {"active": true, "data": {}}
	
	# Apply world changes
	if event_data.has("affected_zones"):
		for zone in event_data.affected_zones:
			if not zone_states.has(zone):
				zone_states[zone] = {}
			zone_states[zone]["event_active"] = true
			
			# Merge specific changes from data
			if chapters_data.chapters.has(chapter_id) and chapters_data.chapters[chapter_id].has("world_changes_on_activate"):
				var changes = chapters_data.chapters[chapter_id].world_changes_on_activate.get(zone, {})
				for key in changes:
					zone_states[zone][key] = changes[key]
	
	_save_event_state_to_disk()
	event_activated.emit(event_id)
	print("[WorldEventManager] Event activated: ", event_id, " (chapter: ", chapter_id, ")")
	
	# Optional: Notify player via existing StoryUI if available
	if get_node_or_null("/root/StoryUI"):
		# get_node("/root/StoryUI").enqueue_beat("event_city_under_attack")  # tie to your beats
		pass

func resolve_chapter(chapter_id: String) -> bool:
	if not chapters_data.has("chapters") or not chapters_data.chapters.has(chapter_id):
		return false
	
	if completed_chapters.has(chapter_id):
		return true
	
	completed_chapters.append(chapter_id)
	
	var chapter = chapters_data.chapters[chapter_id]
	
	# Apply completion world changes
	if chapter.has("world_changes_on_complete"):
		for zone in chapter.world_changes_on_complete:
			if not zone_states.has(zone):
				zone_states[zone] = {}
			for key in chapter.world_changes_on_complete[zone]:
				zone_states[zone][key] = chapter.world_changes_on_complete[zone][key]
	
	# Deactivate related events
	if chapter.has("events"):
		for ev in chapter.events:
			if active_events.has(ev):
				active_events[ev].active = false
	
	_save_event_state_to_disk()
	chapter_completed.emit(chapter_id)
	print("[WorldEventManager] Chapter completed: ", chapter_id, " - World state updated.")
	
	# Example: If this opens a city, perhaps trigger a zone refresh or notification
	return true

func is_chapter_complete(chapter_id: String) -> bool:
	return completed_chapters.has(chapter_id)

func is_event_active(event_id: String) -> bool:
	return active_events.has(event_id) and active_events[event_id].get("active", false)

func get_zone_state(zone_id: String) -> Dictionary:
	return zone_states.get(zone_id, {"event_active": false})

func should_block_zone_access(zone_id: String, direction: String = "") -> bool:
	var state = get_zone_state(zone_id)
	if state.get("event_active", false) and state.get("blocked_exits", []).has(direction):
		return true
	# Add chapter requirement checks here, e.g. from zones_data
	return false

# Call this from your quest complete hook
func resolve_chapter_on_quest_complete(quest_id: String) -> void:
	if not chapters_data.has("chapters"):
		return
	for chapter_id in chapters_data.chapters:
		var ch = chapters_data.chapters[chapter_id]
		if ch.get("resolve_quest") == quest_id:
			resolve_chapter(chapter_id)
			break

# Persistence for events/chapters (separate from WorldManager quests for clarity)
const EVENT_STATE_FILE = "user://lumora_builds/world_events.json"

func _save_event_state_to_disk() -> void:
	var data = {
		"active_events": active_events,
		"completed_chapters": completed_chapters,
		"zone_states": zone_states
	}
	var file = FileAccess.open(EVENT_STATE_FILE, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(data, "\t"))
		file.close()

func _load_event_state_from_disk() -> void:
	if not FileAccess.file_exists(EVENT_STATE_FILE):
		return
	var file = FileAccess.open(EVENT_STATE_FILE, FileAccess.READ)
	if file:
		var json = JSON.new()
		if json.parse(file.get_as_text()) == OK:
			var data = json.data
			if data.has("active_events"):
				active_events = data.active_events
			if data.has("completed_chapters"):
				completed_chapters = data.completed_chapters
			if data.has("zone_states"):
				zone_states = data.zone_states
		file.close()
		print("[WorldEventManager] Loaded world event state.")

# Helper for zone change gating (call from WorldManager.change_zone or zone_exit)
func can_enter_zone(zone_id: String) -> bool:
	var state = get_zone_state(zone_id)
	if state.get("event_active", false):
		# During event, perhaps still enter but in dangerous state, or block per your design
		# For "chapter must be complete to open again", you might have a "city_closed" flag
		pass
	# Example: Some zones require specific chapter
	# if zone_id == "hub_city" and not is_chapter_complete("ch3_demon_summon"):
	#     return false
	return true

# Example trigger for demo (call from a quest or story beat)
func trigger_demo_city_siege() -> void:
	activate_event("city_demon_summon")
	# Assume it affects hub_city
