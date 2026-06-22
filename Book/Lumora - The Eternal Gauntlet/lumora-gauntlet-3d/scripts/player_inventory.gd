extends Node

# Simple Lumora Material System (for the sandbox game)

signal materials_changed

var materials = {
	"verdant_crystal": 0,
	"ruin_stone": 0,
	"echo_fragment": 0
}

func add_material(type: String, amount: int = 1):
	if materials.has(type):
		materials[type] += amount
		materials_changed.emit()
		print("[Inventory] +%d %s (total: %d)" % [amount, type, materials[type]])
	else:
		push_warning("Unknown material type: " + type)

func has_material(type: String, amount: int = 1) -> bool:
	return materials.get(type, 0) >= amount

func spend_material(type: String, amount: int = 1) -> bool:
	if has_material(type, amount):
		materials[type] -= amount
		materials_changed.emit()
		print("[Inventory] -%d %s (remaining: %d)" % [amount, type, materials[type]])
		return true
	return false

func get_material_count(type: String) -> int:
	return materials.get(type, 0)

func craft_item(item: String) -> bool:
	match item:
		"basic_repair_kit":
			if has_material("verdant_crystal", 3) and has_material("ruin_stone", 2):
				spend_material("verdant_crystal", 3)
				spend_material("ruin_stone", 2)
				print("[Craft] Basic Repair Kit created!")
				return true
		_:
			print("[Craft] Unknown item: ", item)
	return false

func get_all_materials() -> Dictionary:
	return materials.duplicate()
