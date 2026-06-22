extends Node
class_name LumoraResources

## Ready-to-use Resource Registry for the Lumora project.
## Drop this into the book-embedded project as an autoload (or singleton).
## This replaces the hardcoded 3-material system with the full rich set.

## Full resource definitions (synced with our data/resources.json)
const RESOURCES := {
	"wood": {
		"display_name": "Verdant Wood",
		"description": "Common timber from the meadow. Basic building material.",
		"category": "material",
		"stack_size": 99,
		"value": 2,
		"icon_color": Color(0.4, 0.3, 0.2)
	},
	"stone": {
		"display_name": "Ruin Stone",
		"description": "Salvaged from old tilework and ruins.",
		"category": "material",
		"stack_size": 99,
		"value": 3,
		"icon_color": Color(0.5, 0.48, 0.45)
	},
	"fiber": {
		"display_name": "Sky Fiber",
		"description": "Tough vines and grass. Used for ropes and cloth.",
		"category": "material",
		"stack_size": 99,
		"value": 1,
		"icon_color": Color(0.3, 0.45, 0.25)
	},
	"crystal_shard": {
		"display_name": "Verdant Crystal Shard",
		"description": "Glowing fragments that leak from the world.",
		"category": "special",
		"stack_size": 50,
		"value": 12,
		"icon_color": Color(0.3, 0.9, 0.7)
	},
	"echo_fragment": {
		"display_name": "Echo Fragment",
		"description": "Resonant pieces of the world’s memory.",
		"category": "special",
		"stack_size": 25,
		"value": 25,
		"icon_color": Color(0.6, 0.4, 0.9)
	},
	"meat": {
		"display_name": "Wisp Meat",
		"description": "From defeated enemies. Perishable but nourishing.",
		"category": "consumable",
		"stack_size": 20,
		"value": 4,
		"icon_color": Color(0.7, 0.3, 0.3)
	},
	"herb": {
		"display_name": "Patch Herb",
		"description": "Common medicinal plant. Base for teas and stews.",
		"category": "consumable",
		"stack_size": 40,
		"value": 2,
		"icon_color": Color(0.4, 0.7, 0.4)
	}
}

## Get display name for a resource id
static func get_display_name(id: String) -> String:
	if RESOURCES.has(id):
		return RESOURCES[id].display_name
	return id.capitalize()

## Get full data for a resource
static func get_data(id: String) -> Dictionary:
	return RESOURCES.get(id, {})

## Check if a resource id is valid
static func is_valid(id: String) -> bool:
	return RESOURCES.has(id)

## Get all resource ids (for UI, saving, etc.)
static func get_all_ids() -> Array[String]:
	var ids: Array[String] = []
	for key in RESOURCES.keys():
		ids.append(key)
	return ids

## Get resources by category ("material", "special", "consumable")
static func get_by_category(category: String) -> Array[String]:
	var result: Array[String] = []
	for id in RESOURCES:
		if RESOURCES[id].category == category:
			result.append(id)
	return result
