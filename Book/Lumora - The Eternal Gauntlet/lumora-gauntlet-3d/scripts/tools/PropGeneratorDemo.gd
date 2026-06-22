@tool
extends Node3D

@export var generate_on_ready: bool = true

@onready var generator = $PropGenerator

func _ready():
	if not generate_on_ready:
		return
	
	# Clear previous children for regeneration
	for child in $Crystals.get_children():
		child.queue_free()
	for child in $RuinPillars.get_children():
		child.queue_free()
	
	await get_tree().process_frame
	
	# Generate a nice mix of props
	for i in 8:
		var crystal = generator.create_crystal_cluster(
			randi_range(3, 7), 
			randf_range(0.7, 2.0), 
			randf_range(0.4, 1.0)
		)
		crystal.position = Vector3(
			randf_range(-10, 10), 
			0, 
			randf_range(-8, 8)
		)
		$Crystals.add_child(crystal)
	
	for i in 5:
		var pillar = generator.create_ruin_pillar(
			randf_range(1.8, 4.2),
			randf_range(0.5, 1.1)
		)
		pillar.position = Vector3(
			randf_range(-12, 12), 
			0, 
			randf_range(-9, 9)
		)
		$RuinPillars.add_child(pillar)
	
	for i in 6:
		var rock = generator.create_rock(randf_range(0.6, 1.8))
		rock.position = Vector3(
			randf_range(-11, 11), 
			0, 
			randf_range(-8, 8)
		)
		$Rocks.add_child(rock)
	
	# Add a few more enemies for testing
	for i in 3:
		var wisp = load("res://scripts/enemy_wisp.gd").new()
		wisp.position = Vector3(
			randf_range(-9, 9), 
			1.5, 
			randf_range(-7, 7)
		)
		$Enemies.add_child(wisp)
	
	for i in 2:
		var scout = load("res://scripts/enemy_scout.gd").new()
		scout.position = Vector3(
			randf_range(-10, 10), 
			1.5, 
			randf_range(-8, 8)
		)
		$Enemies.add_child(scout)
	
	print("PropGeneratorDemo: Generated rich sample scene with props + enemies.")
