extends Node3D
class_name Workbench

## Workbench / Crafting Station for Lumora.
## Used in the world, in player houses, and by NPCs (Farms, Guild).

signal crafting_started(recipe_id: String)
signal item_crafted(item_id: String, quantity: int)

@export var station_type: String = "basic"   # basic, advanced, cooking, crystal_forge

var player_inventory: ResourceInventory
var recipes: Dictionary = {}   # Loaded from data/recipes.json

func _ready() -> void:
	_load_recipes()

func _load_recipes() -> void:
	# In a real project, load from JSON or Resource files
	# For now, hard-coded core Lumora recipes
	recipes = {
		"wooden_chest": {
			"name": "Wooden Storage Chest",
			"ingredients": {"wood": 8, "fiber": 4},
			"result": {"item": "storage_chest", "quantity": 1},
			"station": ["basic", "player_house"]
		},
		"simple_workbench": {
			"name": "Simple Workbench",
			"ingredients": {"wood": 12, "stone": 6},
			"result": {"item": "workbench", "quantity": 1},
			"station": ["basic"]
		},
		"verdant_stew_kit": {
			"name": "Verdant Stew Kit",
			"ingredients": {"fiber": 3, "herb": 2, "meat": 1},
			"result": {"item": "verdant_stew", "quantity": 1},
			"station": ["basic", "cooking"]
		},
		"crystal_lantern": {
			"name": "Crystal Lantern",
			"ingredients": {"stone": 4, "crystal_shard": 2, "fiber": 2},
			"result": {"item": "crystal_lantern", "quantity": 1},
			"station": ["advanced", "crystal_forge"]
		}
	}

func can_craft(recipe_id: String) -> bool:
	if not recipes.has(recipe_id):
		return false
	var recipe = recipes[recipe_id]
	
	if station_type not in recipe.station:
		return false
	
	for res_id in recipe.ingredients:
		if not player_inventory or not player_inventory.has_resource(res_id, recipe.ingredients[res_id]):
			return false
	return true

func craft(recipe_id: String) -> bool:
	if not can_craft(recipe_id):
		return false
	
	var recipe = recipes[recipe_id]
	
	# Consume ingredients
	for res_id in recipe.ingredients:
		player_inventory.remove_resource(res_id, recipe.ingredients[res_id])
	
	var result = recipe.result
	# In real game, add result to inventory or spawn in world
	print("Crafted: ", result.item, " x", result.quantity)
	
	item_crafted.emit(result.item, result.quantity)
	crafting_started.emit(recipe_id)
	
	# Special integration with Player House cooking
	if "stew" in recipe_id or "cooking" in station_type:
		# Could trigger cooking buffs here
		pass
	
	return true

func get_available_recipes() -> Array:
	var available := []
	for id in recipes:
		if can_craft(id):
			available.append(id)
	return available