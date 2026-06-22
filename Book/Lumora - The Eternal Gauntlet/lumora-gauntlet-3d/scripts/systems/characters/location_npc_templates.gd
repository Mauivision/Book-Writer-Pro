extends Resource
class_name LumoraLocationTemplates

## Defines how many NPCs of which roles should exist in each major location.
## This makes the "set amount of npc" request very controllable and useful for balancing.

static var TEMPLATES := {
	"tavern": {
		"count": 6,
		"roles": ["Tavern Keeper", "Barkeep", "Barmaid", "Bard", "Regular", "Traveling Merchant"],
		"weights": [1, 1, 1, 1, 2, 1],  # More regulars
		"recruitable_chance": 0.25,
	},
	"guild_hall": {
		"count": 5,
		"roles": ["Guild Master", "Quest Broker", "Trainer", "Archivist", "Recruiter"],
		"weights": [1, 1, 1, 1, 1],
		"recruitable_chance": 0.4,
	},
	"farmlands": {
		"count": 8,
		"roles": ["Farmer", "Harvest Hand", "Stablemaster", "Beekeeper"],
		"weights": [3, 3, 1, 1],
		"recruitable_chance": 0.15,
	},
	"town_hall": {
		"count": 3,
		"roles": ["Mayor", "Town Clerk", "Guard Captain"],
		"weights": [1, 1, 1],
		"recruitable_chance": 0.1,
	},
	"capital": {
		"count": 7,
		"roles": ["King's Advisor", "Court Mage", "Royal Herald", "Captain of the Guard", "Noble"],
		"weights": [1, 1, 1, 2, 2],
		"recruitable_chance": 0.2,
	},
	"verdant_meadow": {
		"count": 4,
		"roles": ["Wanderer", "Farmer", "Mystic"],
		"weights": [2, 1, 1],
		"recruitable_chance": 0.5,  # Higher in starting area for companions
	}
}

static func get_template_for(location: String) -> Dictionary:
	return TEMPLATES.get(location, {"count": 3, "roles": ["Wanderer"], "weights": [1], "recruitable_chance": 0.2})

static func get_all_locations() -> Array[String]:
	return TEMPLATES.keys()