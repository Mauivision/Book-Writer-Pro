extends "res://scripts/simple_interact.gd"

func interact():
	var inventory = get_node_or_null("/root/PlayerInventory")
	if not inventory:
		return false
	
	# Try to craft a repair kit
	if inventory.craft_item("basic_repair_kit"):
		print("[Workbench] Successfully crafted Basic Repair Kit!")
		return true
	else:
		print("[Workbench] Not enough materials. Need 3 Verdant Crystal + 2 Ruin Stone.")
		return false
