@tool
extends Node
## Run this script (or attach temporarily) to mass-generate many chest variations
## into the examples folder. Great for quickly populating your asset library.

@export var output_folder: String = "res://assets/props/treasure-chests/examples/"
@export var count_per_type: int = 3

func _ready() -> void:
	if not Engine.is_editor_hint():
		return
	
	print("=== Generating Lumora Chest Variations ===")
	
	var builder_scene = preload("res://assets/props/treasure-chests/treasure_chest_builder.gd")
	
	for type in TreasureChestBuilder.ChestType.values():
		for i in count_per_type:
			var builder = builder_scene.new()
			add_child(builder)
			
			builder.chest_type = type
			builder.apply_preset(type)  # sets nice defaults
			
			# Add some random variation
			builder.width = randf_range(1.1, 1.7)
			builder.height = randf_range(0.85, 1.25)
			builder.depth = randf_range(0.9, 1.5)
			builder.lid_angle_deg = randf_range(28, 78)
			builder.crystal_density = clamp(builder.crystal_density + randf_range(-0.15, 0.2), 0.0, 1.0)
			builder.damage_level = clamp(builder.damage_level + randf_range(-0.1, 0.15), 0.0, 0.7)
			builder.emissive_strength = clamp(builder.emissive_strength + randf_range(-0.2, 0.4), 0.0, 2.0)
			
			builder.rebuild()
			
			# Bake
			var baked := builder.create_baked_instance()
			baked.name = "%s_%02d" % [TreasureChestBuilder.ChestType.keys()[type], i + 1]
			
			# Add the runtime script
			var runtime := preload("res://assets/props/treasure-chests/interactable_chest.gd").new()
			runtime.chest_type = type
			baked.add_child(runtime)
			
			# Save
			var path := output_folder + baked.name + ".tscn"
			var packed := PackedScene.new()
			packed.pack(baked)
			var err := ResourceSaver.save(packed, path)
			if err == OK:
				print("Saved: ", path)
			else:
				push_error("Failed to save ", path)
			
			builder.queue_free()
			baked.queue_free()
	
	print("=== Chest generation complete ===")
	get_tree().quit()