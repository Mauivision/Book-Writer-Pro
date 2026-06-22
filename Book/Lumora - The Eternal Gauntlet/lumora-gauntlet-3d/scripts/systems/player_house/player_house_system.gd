extends Node
class_name PlayerHouseSystem

## The most useful Player House system for Lumora.
## Buyable property with storage (using our chest builder) + cooking station.

signal house_purchased(house_id: String)
signal item_stored(item_id: String, quantity: int)
signal meal_cooked(meal: String, buffs: Dictionary)

@export var current_house_id: String = ""
@export var owned_houses: Array[String] = []

# Storage uses our existing chest system
var storage_chests: Array[Node] = []

# Simple cooking system
const MEALS := {
	"Verdant Stew": {"ingredients": ["fiber", "root", "herb"], "buff": {"stamina_regen": 25, "bond_gain": 5}},
	"Gauntlet Roast": {"ingredients": ["meat", "crystal_shard"], "buff": {"damage": 8, "duration": 1800}},
	"Patch Tea": {"ingredients": ["herb", "echo_fragment"], "buff": {"xp_gain": 15, "story_reveal": true}},
}

func can_buy_house(house_id: String, player_gold: int) -> bool:
	# In real game, pull prices from lumora.json or economy system
	var prices := {"meadow_cottage": 850, "ruin_loft": 1450, "capital_manor": 4200}
	return house_id not in owned_houses and player_gold >= prices.get(house_id, 9999)

func purchase_house(house_id: String) -> bool:
	if house_id in owned_houses:
		return false
	
	owned_houses.append(house_id)
	current_house_id = house_id
	house_purchased.emit(house_id)
	
	# Automatically place some storage chests using our builder
	_setup_storage_for_house(house_id)
	print("Player now owns house: ", house_id)
	return true

func _setup_storage_for_house(house_id: String) -> void:
	# This would instance actual 3D chests from our treasure_chest_builder in the house scene
	# For now we just track them
	storage_chests.clear()
	print("Storage chests initialized for ", house_id, " (integrate with TreasureChestBuilder here)")

func store_item(item_id: String, quantity: int = 1, chest_index: int = 0) -> bool:
	# In real implementation, this would call into the chest's inventory
	item_stored.emit(item_id, quantity)
	return true

# === Cooking System ===

func can_cook(meal_name: String, player_inventory: Dictionary) -> bool:
	if not MEALS.has(meal_name): return false
	var required: Array = MEALS[meal_name].ingredients
	for ing in required:
		if not player_inventory.has(ing) or player_inventory[ing] <= 0:
			return false
	return true

func cook_meal(meal_name: String, player_inventory: Dictionary) -> Dictionary:
	if not can_cook(meal_name, player_inventory):
		return {}
	
	# Consume ingredients
	for ing in MEALS[meal_name].ingredients:
		player_inventory[ing] -= 1
	
	var result := MEALS[meal_name].duplicate(true)
	meal_cooked.emit(meal_name, result.buff)
	
	# Special story integration
	if result.buff.has("story_reveal") and StoryUI:
		StoryUI.enqueue_beat("cooked_patch_tea")
	
	return result.buff

func get_available_meals(player_inventory: Dictionary) -> Array[String]:
	var available: Array[String] = []
	for meal in MEALS.keys():
		if can_cook(meal, player_inventory):
			available.append(meal)
	return available

# === Save / Load helpers ===

func to_save_data() -> Dictionary:
	return {
		"current_house": current_house_id,
		"owned_houses": owned_houses,
		# storage contents would go here in full implementation
	}