extends Area3D

# Zone exit trigger. Place on Area3D with a large enough collision.
# Set target_zone to the id matching lumora_zones.json (e.g. "forest_ruin_gate")

@export var target_zone: String = ""

func _ready():
	body_entered.connect(_on_body_entered)

func _on_body_entered(body: Node3D):
	if body.name == "Player" and target_zone != "":
		var wm = get_node_or_null("/root/WorldManager")
		if wm and wm.has_method("change_zone"):
			print("[ZoneExit] Player entering: ", target_zone)
			wm.change_zone(target_zone)
		else:
			push_warning("WorldManager not found or missing change_zone")
