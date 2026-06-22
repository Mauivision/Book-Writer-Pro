# CityStateController.gd
# Attach to your hub city scene root.
# Checks WorldEventManager (and WorldManager) to dynamically alter the scene
# based on active chapters/events.
# Example for "ch3_demon_summon": City looks damaged, enemies spawn, gate blocked,
# NPCs change dialogue. Once chapter complete, restored state loads with new content.

extends Node3D

@onready var event_manager = get_node_or_null("/root/WorldEventManager")
@onready var world_manager = get_node_or_null("/root/WorldManager")

# References to state-dependent nodes (set in editor or _ready)
@export var damaged_buildings: Array[NodePath] = []
@export var normal_buildings: Array[NodePath] = []
@export var event_enemy_spawner: NodePath
@export var gate_barrier: NodePath
@export var mayor_npc: NodePath

var current_chapter = "ch3_demon_summon"  # Tie to your chapters_events.json

func _ready() -> void:
	apply_world_state()

	# Demo trigger (remove or replace with quest trigger)
	var trigger = get_node_or_null("DemoTrigger")
	if trigger:
		trigger.body_entered.connect(_on_demo_trigger)

func apply_world_state() -> void:
	if not event_manager:
		print("[CityState] No WorldEventManager - using default restored state")
		_set_restored_state()
		return

	var zone_state = event_manager.get_zone_state("hub_city")
	var event_active = zone_state.get("event_active", false) or event_manager.is_event_active("city_demon_summon")
	var chapter_complete = event_manager.is_chapter_complete(current_chapter)

	print("[CityState] Applying state for hub_city. Event active: ", event_active, " Chapter complete: ", chapter_complete)

	if event_active and not chapter_complete:
		_set_siege_state()
	else:
		_set_restored_state()

	# Additional changes from zone_state (e.g. new_content from completion)
	if zone_state.has("new_content"):
		_spawn_new_content(zone_state.new_content)

func _set_siege_state() -> void:
	# Damage visuals
	for path in damaged_buildings:
		var node = get_node_or_null(path)
		if node and node is MeshInstance3D:
			var mat = node.material_override.duplicate() if node.material_override else StandardMaterial3D.new()
			mat.albedo_color = Color(0.2, 0.15, 0.1)  # Darker, burned look
			node.material_override = mat

	# Hide normal buildings or mark damaged
	for path in normal_buildings:
		var node = get_node_or_null(path)
		if node:
			node.visible = false

	# Block gate
	var barrier = get_node_or_null(gate_barrier)
	if barrier:
		barrier.visible = true
		# Make sure collision is on
		for child in barrier.get_children():
			if child is CollisionShape3D:
				child.disabled = false

	# Spawn event enemies (demo: a few wisps or stronger)
	var spawner = get_node_or_null(event_enemy_spawner)
	if spawner:
		# Clear previous
		for child in spawner.get_children():
			child.queue_free()
		
		# Spawn demo enemies (use existing wisp or scout)
		for i in 3:
			var enemy = load("res://scripts/enemy_wisp.gd").new()  # Or preload a tscn
			# For simplicity, assume a MeshInstance or full enemy scene
			var enemy_node = CharacterBody3D.new()
			enemy_node.script = load("res://scripts/enemy_wisp.gd")
			enemy_node.position = Vector3(5 + i*3, 1, 5 + i*2)
			spawner.add_child(enemy_node)
			# Add a simple mesh for visibility
			var mesh_inst = MeshInstance3D.new()
			mesh_inst.mesh = BoxMesh.new()
			mesh_inst.scale = Vector3(1,2,1)
			enemy_node.add_child(mesh_inst)

	# Change NPC dialogue/behavior for siege
	var mayor = get_node_or_null(mayor_npc)
	if mayor and mayor is Node and mayor.has_method("set_story_beat"):
		mayor.story_beat = "mayor_under_siege"  # Different beat for event

	print("[CityState] Siege state applied - city is dangerous and restricted.")

func _set_restored_state() -> void:
	# Restore visuals
	for path in damaged_buildings:
		var node = get_node_or_null(path)
		if node and node is MeshInstance3D:
			# Reset material if possible (or use normal one)
			pass

	for path in normal_buildings:
		var node = get_node_or_null(path)
		if node:
			node.visible = true

	var barrier = get_node_or_null(gate_barrier)
	if barrier:
		barrier.visible = false
		for child in barrier.get_children():
			if child is CollisionShape3D:
				child.disabled = true

	# Clear event enemies
	var spawner = get_node_or_null(event_enemy_spawner)
	if spawner:
		for child in spawner.get_children():
			child.queue_free()

	# Normal NPC
	var mayor = get_node_or_null(mayor_npc)
	if mayor and mayor is Node and mayor.has_method("set_story_beat"):
		mayor.story_beat = "mayor_intro"

	print("[CityState] Restored state - city is safe and open.")

func _spawn_new_content(content_list: Array) -> void:
	# Example: Spawn survivor NPCs or new quest givers after restoration
	if "survivor_npcs" in content_list:
		print("[CityState] Spawning survivor NPCs (demo - add actual nodes)")
		# In real: instance NPC scenes at positions

	if "restored_market" in content_list:
		print("[CityState] Enabling market stalls/vendors.")

func _on_demo_trigger(body: Node) -> void:
	if body.is_in_group("player") and event_manager:
		event_manager.trigger_demo_city_siege()
		# Reload or re-apply state
		get_tree().create_timer(0.5).timeout.connect(apply_world_state)
		print("[CityState] Demo siege triggered! Complete 'banish_demon' quest to restore.")
