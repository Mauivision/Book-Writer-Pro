extends Node
class_name CharacterManager

var profiles: Dictionary = {}
var active_companions: Array = []
var bonds: Dictionary = {}

func _ready():
	load_canon()

func load_canon():
	var path = "res://data/characters/sample_lumora_characters.json"
	if FileAccess.file_exists(path):
		var file = FileAccess.open(path, FileAccess.READ)
		var json = JSON.new()
		if json.parse(file.get_as_text()) == OK:
			var data = json.data
			for c in data.get("canon_characters", []):
				profiles[c.id] = c
			for c in data.get("example_generated", []):
				profiles[c.id] = c
		file.close()
	# Load from lumora.json if has characters section
	var gdata = get_node_or_null("/root/GameData")
	if gdata and gdata.data.has("characters"):
		for id in gdata.data.characters:
			profiles[id] = gdata.data.characters[id]
	print("[CharacterManager] Loaded ", profiles.size(), " profiles")

func get_profile(id: String) -> Dictionary:
	return profiles.get(id, {})

func update_bond(id: String, delta: int):
	bonds[id] = bonds.get(id, 0) + delta
	print("[CharacterManager] Bond with ", id, " now ", bonds.get(id, 0))

func recruit(id: String):
	if not active_companions.has(id):
		active_companions.append(id)
		print("[CharacterManager] Recruited ", id)

func get_bond(id: String) -> int:
	return bonds.get(id, 0)
