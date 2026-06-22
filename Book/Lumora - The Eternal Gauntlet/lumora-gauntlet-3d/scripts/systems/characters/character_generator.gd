@tool
extends Node
class_name LumoraCharacterGenerator

## The most useful Character Creator for Lumora.
## Generates rich, lore-respecting NPCs and companions on demand.
## Can be used as an editor tool or at runtime for world population.

signal character_generated(profile: LumoraCharacterProfile)

@export var use_lumora_json: bool = true
@export var default_npc_count: int = 12

var rng := RandomNumberGenerator.new()

# === Core Generation ===

func generate_character(seed: int = -1, role_hint: String = "", location_hint: String = "") -> LumoraCharacterProfile:
	if seed == -1:
		seed = randi()
	rng.seed = seed
	
	var profile := LumoraCharacterProfile.new()
	profile.generation_seed = seed
	profile.is_procedural = true
	
	# Base identity
	profile.id = _generate_id(role_hint)
	profile.full_name = _generate_name()
	profile.title = _generate_title(role_hint)
	profile.role = role_hint if role_hint != "" else _pick_role()
	
	# Faction & location
	profile.faction = _pick_faction(location_hint)
	profile.location_tags = _pick_locations(location_hint, profile.role)
	
	# Personality & voice (very important for Lumora's tone)
	profile.personality_traits = _generate_personality(profile.role, profile.faction)
	profile.voice_style = _pick_voice_style(profile.personality_traits)
	profile.backstory_snippet = _generate_backstory(profile)
	
	# Relationships & bonds
	profile.bond_with_player = rng.randi_range(-15, 35)
	profile.relationships = _generate_relationships(profile)
	
	# Gameplay flags
	profile.is_recruitable = _should_be_recruitable(profile.role, profile.bond_with_player)
	profile.vendor = "Tavern" in profile.role or "Merchant" in profile.role or "Farm" in profile.role
	profile.quest_giver = rng.randf() < 0.35 or profile.role in ["Guild Master", "Mayor", "King's Advisor"]
	
	# Appearance
	profile.model_key = _pick_model_key(profile.role, profile.faction)
	profile.primary_color = _pick_primary_color(profile.faction, profile.role)
	profile.accent_color = _pick_accent_color(profile.faction)
	profile.has_gauntlet = profile.role.contains("Warden") or profile.faction == "Sky Wardens"
	
	character_generated.emit(profile)
	return profile

func generate_npcs_for_location(location: String, count: int) -> Array[LumoraCharacterProfile]:
	var results: Array[LumoraCharacterProfile] = []
	for i in count:
		var seed := hash(location) + i * 17 + Time.get_unix_time_from_system()
		var profile := generate_character(seed, "", location)
		results.append(profile)
	return results

# === Role & Location Templates (the heart of "most useful") ===

const ROLE_TEMPLATES := {
	"Tavern": ["Tavern Keeper", "Barkeep", "Barmaid", "Bard", "Regular Drunk", "Traveling Merchant"],
	"Guild": ["Guild Master", "Quest Broker", "Trainer", "Recruiter", "Archivist"],
	"Farm": ["Farmer", "Harvest Hand", "Stablemaster", "Beekeeper", "Miller"],
	"Mayor": ["Mayor", "Town Clerk", "Guard Captain", "Tax Collector"],
	"King": ["King's Advisor", "Court Mage", "Royal Herald", "Captain of the Guard", "Noble"],
	"Companion": ["Wanderer", "Disgraced Knight", "Mystic", "Rogue", "Scholar"]
}

func _pick_role() -> String:
	var keys := ROLE_TEMPLATES.keys()
	var key := keys[rng.randi() % keys.size()]
	var list: Array = ROLE_TEMPLATES[key]
	return list[rng.randi() % list.size()]

func _pick_faction(location_hint: String) -> String:
	if "farm" in location_hint.to_lower(): return ["Independent", "Radiant Dominion"].pick_random()
	if "guild" in location_hint.to_lower(): return ["Independent", "Veil Syndicate", "Radiant Dominion"].pick_random()
	if "tavern" in location_hint.to_lower(): return ["Independent", "Veil Syndicate"].pick_random()
	if location_hint.to_lower().contains("capital") or location_hint.to_lower().contains("king"):
		return ["Radiant Dominion", "Sky Wardens"].pick_random()
	return ["Independent", "Radiant Dominion", "Veil Syndicate", "Sky Wardens"].pick_random()

func _pick_locations(hint: String, role: String) -> PackedStringArray:
	var tags: PackedStringArray = []
	if hint != "": tags.append(hint)
	
	if "Tavern" in role: tags.append_array(["tavern", "social_hub"])
	if "Guild" in role: tags.append_array(["guild_hall", "quest_hub"])
	if "Farm" in role or "Farmer" in role: tags.append_array(["farmlands", "verdant_meadow"])
	if "Mayor" in role: tags.append("town_hall")
	if "King" in role or "Royal" in role or "Court" in role: tags.append_array(["capital", "throne_room"])
	
	if tags.is_empty():
		tags.append_array(["verdant_meadow", "forest_ruin_gate"])
	
	return tags

# === Personality & Voice (Lumora flavor) ===

func _generate_personality(role: String, faction: String) -> PackedStringArray:
	var traits: Array[String] = []
	
	if "Keeper" in role or "Barkeep" in role:
		traits.append_array(["Observant", "Cynical", "Warm-hearted"])
	elif "Farmer" in role:
		traits.append_array(["Stoic", "Practical", "Superstitious"])
	elif "Guild" in role:
		traits.append_array(["Ambitious", "Calculating", "Charismatic"])
	elif "King" in role or "Advisor" in role:
		traits.append_array(["Formal", "Weary", "Political"])
	elif "Companion" in role:
		traits.append_array(["Loyal", "Traumatized", "Witty"])
	
	# Faction flavor
	if faction == "Veil Syndicate": traits.append("Secretive")
	if faction == "Radiant Dominion": traits.append("Zealous")
	if faction == "Sky Wardens": traits.append("Detached")
	
	# Always add 1-2 random Lumora-flavored traits
	var pool := ["Witty", "Gruff", "Romantic", "Patch-Obsessed", "Respawn-Jaded", "Gauntlet-Curious", "Bond-Hungry"]
	traits.append_array(pool.slice(0, rng.randi_range(1, 2)))
	
	return PackedStringArray(traits)

func _pick_voice_style(traits: PackedStringArray) -> String:
	if "Witty" in traits or "Cynical" in traits: return "Sarcastic"
	if "Zealous" in traits: return "Formal"
	if "Gruff" in traits: return "Gruff"
	return "Warm" if rng.randf() > 0.5 else "Neutral"

# === Name Generation (simple but effective) ===

const FIRST_NAMES := ["Elara", "Velvet", "Haruto", "Sunny", "Kael", "Mira", "Thorne", "Liora", "Riven", "Sable", "Cassian", "Nyx"]
const LAST_NAMES := ["Dawn", "Sylvandrel", "Takahashi", "Vesper", "Ironroot", "Vale", "Shadowfen", "Luminar", "Grimwald"]

func _generate_name() -> String:
	return FIRST_NAMES[rng.randi() % FIRST_NAMES.size()] + " " + LAST_NAMES[rng.randi() % LAST_NAMES.size()]

func _generate_title(role: String) -> String:
	var titles := {
		"Tavern Keeper": ["the Patient Ear", "of the Leaking Mug", "the Storykeeper"],
		"Farmer": ["the Rootbound", "of the Verdant Leak", "the Patient Sower"],
		"Guild Master": ["the Contract Weaver", "of the Eternal Gauntlet"],
		"Mayor": ["the Compromiser", "of the Fringe"],
	}
	return titles.get(role, [""]).pick_random()

func _generate_id(role: String) -> String:
	return role.to_lower().replace(" ", "_") + "_" + str(randi() % 9999)

func _generate_backstory(profile: LumoraCharacterProfile) -> String:
	return "%s %s who %s the %s." % [
		profile.full_name.split(" ")[0],
		["survived", "witnessed", "lost everything in", "profited from"].pick_random(),
		["the last patch", "a Sky Dungeon breach", "the Gauntlet choosing someone else", "a forbidden bond"].pick_random(),
		profile.faction
	]

func _generate_relationships(profile: LumoraCharacterProfile) -> Dictionary:
	var rel := {}
	# Example canon connections
	if "Velvet" in profile.full_name or "Dawn" in profile.full_name:
		rel["haruto"] = 65
	return rel

func _should_be_recruitable(role: String, bond: int) -> bool:
	return role in ["Wanderer", "Disgraced Knight", "Mystic", "Rogue"] or bond > 40

func _pick_model_key(role: String, faction: String) -> String:
	if "Farmer" in role: return "human_rustic"
	if "Guild" in role: return "human_noble"
	if faction == "Sky Wardens": return "human_warden"
	return "human_generic"

func _pick_primary_color(faction: String, role: String) -> Color:
	match faction:
		"Radiant Dominion": return Color(0.85, 0.7, 0.35)
		"Veil Syndicate": return Color(0.25, 0.2, 0.35)
		"Sky Wardens": return Color(0.3, 0.45, 0.65)
		_: return Color(0.4, 0.35, 0.28)  # Verdant default

func _pick_accent_color(faction: String) -> Color:
	if faction == "Sky Wardens": return Color(0.2, 0.85, 0.95)  # Cyan
	return Color(0.2, 0.55, 0.4)

# === Hero + Support Specific ===

func generate_hero_support() -> LumoraCharacterProfile:
	var p := generate_character(-1, "Companion", "party")
	p.is_recruitable = true
	p.bond_with_player = rng.randi_range(25, 70)
	p.title = ["the Bonded", "Gauntlet-Touched", "of the Eternal Party"].pick_random()
	return p

# === Integration with existing systems ===

func populate_world_from_lumora_json() -> void:
	# TODO: Read from GameData or lumora.json and generate missing NPCs
	print("CharacterGenerator: Ready to sync with lumora.json and book canon.")