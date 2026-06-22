extends Resource
class_name LumoraCharacterProfile

## The most useful character data structure for Lumora.
## Used for both canon NPCs and procedurally generated ones.

@export var id: String = ""
@export var full_name: String = ""
@export var title: String = ""
@export var role: String = ""                    # "Tavern Keeper", "Guild Master", "Farmer", "Mayor", "Companion", etc.

@export var faction: String = "Neutral"          # Radiant Dominion, Veil Syndicate, Sky Wardens, Independent, etc.
@export var location_tags: PackedStringArray = [] # "verdant_meadow", "tavern", "guild_hall", "farmlands", "capital"

@export_category("Narrative")
@export var personality_traits: PackedStringArray = []  # "Witty", "Gruff", "Idealistic", "Cynical", "Romantic"
@export var voice_style: String = "Neutral"             # Used by StoryUI / dialogue system
@export var backstory_snippet: String = ""

@export_category("Relationships")
@export var bond_with_player: int = 0             # -100 to +100 (affects dialogue, quests, romance flags)
@export var relationships: Dictionary = {}        # { "velvet_dawn": 45, "elara": -20 }

@export_category("Gameplay")
@export var is_recruitable: bool = false          # Can become Hero support / companion
@export var recruit_cost: int = 0
@export var vendor: bool = false
@export var quest_giver: bool = false
@export var is_unique: bool = true                # If false, can be procedurally duplicated with variations

@export_category("Appearance (for 3D)")
@export var model_key: String = "human_generic"   # Reference to your 3D model library
@export var primary_color: Color = Color(0.6, 0.5, 0.4)
@export var accent_color: Color = Color(0.2, 0.6, 0.5)
@export var has_gauntlet: bool = false            # Special visual for important characters

@export_category("Generation Metadata")
@export var generation_seed: int = 0
@export var is_procedural: bool = false

func get_display_name() -> String:
	if title != "":
		return "%s, %s" % [full_name, title]
	return full_name

func get_bond_level() -> String:
	if bond_with_player >= 80: return "Soulbound"
	if bond_with_player >= 50: return "Close Ally"
	if bond_with_player >= 20: return "Trusted"
	if bond_with_player >= 0:  return "Neutral"
	if bond_with_player >= -30: return "Wary"
	return "Hostile"

func can_recruit() -> bool:
	return is_recruitable and bond_with_player >= 30

# Helper to serialize for saving / lumora.json style data
func to_dict() -> Dictionary:
	return {
		"id": id,
		"full_name": full_name,
		"title": title,
		"role": role,
		"faction": faction,
		"location_tags": location_tags,
		"personality_traits": personality_traits,
		"voice_style": voice_style,
		"bond_with_player": bond_with_player,
		"is_recruitable": is_recruitable,
		"model_key": model_key,
		"primary_color": primary_color.to_html(),
		"accent_color": accent_color.to_html(),
	}