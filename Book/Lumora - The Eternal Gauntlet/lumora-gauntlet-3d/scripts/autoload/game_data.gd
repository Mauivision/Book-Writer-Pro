extends Node

## Autoload: loads res://data/lumora.json canon for quests, beats, enemies.

var data: Dictionary = {}
var loaded := false

func _ready() -> void:
	load_canon()

func load_canon() -> void:
	var path := "res://data/lumora.json"
	if not FileAccess.file_exists(path):
		push_warning("GameData: missing %s" % path)
		return
	var text := FileAccess.get_file_as_string(path)
	var parsed = JSON.parse_string(text)
	if typeof(parsed) != TYPE_DICTIONARY:
		push_error("GameData: invalid JSON")
		return
	data = parsed
	loaded = true

func quest_text(id: String) -> String:
	var quests: Array = data.get("quests", [])
	for q in quests:
		if q is Dictionary and q.get("id", "") == id:
			return str(q.get("text", ""))
	return ""

func beat(id: String) -> Dictionary:
	var beats: Dictionary = data.get("storyBeats", {})
	return beats.get(id, {})

func zone(id: String) -> Dictionary:
	var zones: Dictionary = data.get("zones", {})
	return zones.get(id, {})

func enemy(kind: String) -> Dictionary:
	var enemies: Dictionary = data.get("enemies", {})
	return enemies.get(kind, {})
