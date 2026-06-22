extends Area3D

@export var npc_name: String = "NPC"
@export var dialogue_lines: Array[String] = []
@export var starts_quest: String = ""   # Quest to start the first time the player talks to this NPC
@export var quest_complete_lines: Array[String] = []  # Lines to say if the quest is already complete

var player_nearby := false
var has_talked := false

func _ready():
	body_entered.connect(_on_body_entered)
	body_exited.connect(_on_body_exited)

func _on_body_entered(body: Node3D):
	if body.name == "Player":
		player_nearby = true
		print("[Talk] Press E to speak with ", npc_name)

func _on_body_exited(body: Node3D):
	if body.name == "Player":
		player_nearby = false

func interact():
	if player_nearby and dialogue_lines.size() > 0:
		var wm = get_node_or_null("/root/WorldManager")
		var line = ""

		# If quest complete, prefer completion dialogue + give reward once
		if starts_quest != "" and wm and wm.has_method("is_quest_complete") and wm.is_quest_complete(starts_quest) and quest_complete_lines.size() > 0:
			line = quest_complete_lines[randi() % quest_complete_lines.size()]

			# Simple one-time reward (Velvet gives materials for bringing the fragment)
			if not has_meta("reward_given"):
				var inv = get_node_or_null("/root/PlayerInventory")
				if inv and inv.has_method("add_material"):
					inv.add_material("verdant_crystal", 3)
					inv.add_material("echo_fragment", 1)
					set_meta("reward_given", true)
					print("[Quest Reward] Received 3 Verdant Crystal + 1 Echo Fragment from Velvet")
		else:
			line = dialogue_lines[randi() % dialogue_lines.size()]

		print("[", npc_name, "] ", line)

		# First-time quest hook
		if not has_talked and starts_quest != "":
			if wm and wm.has_method("start_quest"):
				wm.start_quest(starts_quest)
			has_talked = true

		return true
	return false
