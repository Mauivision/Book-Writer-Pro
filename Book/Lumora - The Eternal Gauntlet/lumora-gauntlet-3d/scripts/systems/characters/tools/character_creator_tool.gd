@tool
extends Node3D
class_name CharacterCreatorTool

## Editor tool version of the Character Creator.
## The most practical way for you to generate, tweak, and preview NPCs for Lumora.

@export_category("Generation Controls")
@export var target_location: String = "tavern"
@export var npc_count: int = 6
@export var include_companions: bool = true

@export_category("Actions")
@export_tool_button("Generate NPCs for Location") var generate_btn: Callable = generate_for_location
@export_tool_button("Generate One Hero Support") var generate_companion_btn: Callable = generate_companion
@export_tool_button("Print All Generated") var print_btn: Callable = print_all

var generator := LumoraCharacterGenerator.new()
var generated_profiles: Array[LumoraCharacterProfile] = []

func _ready() -> void:
	add_child(generator)

func generate_for_location() -> void:
	generated_profiles.clear()
	var template := LumoraLocationTemplates.get_template_for(target_location)
	var count := template.count if npc_count == 6 else npc_count   # allow override
	
	for i in count:
		var profile := generator.generate_character(-1, "", target_location)
		generated_profiles.append(profile)
	
	print("Generated %d NPCs for %s" % [generated_profiles.size(), target_location])
	_print_summary()

func generate_companion() -> void:
	var profile := generator.generate_hero_support()
	generated_profiles.append(profile)
	print("New Hero Support generated: ", profile.get_display_name(), " (Bond: ", profile.bond_with_player, ")")

func print_all() -> void:
	print("=== Current Generated Characters ===")
	for p in generated_profiles:
		print(p.get_display_name(), " | ", p.role, " | ", p.faction, " | Bond:", p.bond_with_player)

func _print_summary() -> void:
	for p in generated_profiles:
		print(" - %s (%s) | %s | Recruitable: %s" % [
			p.full_name, p.role, p.faction, "YES" if p.is_recruitable else "no"
		])

# Future: Add UI panel with sliders + "Save to JSON" button for the workshop scene