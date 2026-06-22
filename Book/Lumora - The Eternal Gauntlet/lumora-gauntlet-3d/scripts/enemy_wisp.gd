extends CharacterBody3D

@export var speed := 5.5
@export var health := 2

var player: Node3D = null
var attack_cooldown := 0.0
const ATTACK_COOLDOWN_TIME := 0.9
const ATTACK_RANGE := 4.5

func _ready():
	player = get_tree().get_first_node_in_group("player")
	if not player:
		player = get_tree().get_first_node_in_group("Player")
	if not player:
		var p = get_parent().get_node_or_null("Player")
		if p:
			player = p

	# Auto visual - ghostly blue wisp style
	if get_child_count() == 0 or not has_node("Mesh"):
		var mesh_instance = MeshInstance3D.new()
		mesh_instance.name = "Mesh"
		var sphere = SphereMesh.new()
		sphere.radius = 0.45
		sphere.height = 0.9
		mesh_instance.mesh = sphere

		var mat = StandardMaterial3D.new()
		mat.albedo_color = Color(0.4, 0.7, 1.0)
		mat.emission_enabled = true
		mat.emission = Color(0.2, 0.5, 0.9)
		mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		mat.albedo_color.a = 0.7
		mesh_instance.material_override = mat

		add_child(mesh_instance)

		if not has_node("CollisionShape3D"):
			var col = CollisionShape3D.new()
			var shape = SphereShape3D.new()
			shape.radius = 0.5
			col.shape = shape
			add_child(col)

func _physics_process(delta):
	if attack_cooldown > 0.0:
		attack_cooldown -= delta

	if not player or not is_instance_valid(player):
		return

	var to_player = player.global_position - global_position
	to_player.y = 0
	var dist = to_player.length()

	# Wisp is evasive - circles the player at medium range
	if dist > ATTACK_RANGE:
		var circle_dir = to_player.rotated(Vector3.UP, 1.2).normalized()
		velocity = circle_dir * speed
	else:
		# Close enough to attack
		velocity = Vector3.ZERO
		if attack_cooldown <= 0.0:
			_attack_player()

	move_and_slide()

func _attack_player():
	if not player or not is_instance_valid(player):
		return

	attack_cooldown = ATTACK_COOLDOWN_TIME
	print("[Enemy] Wisp zaps!")

	if player.has_method("take_damage"):
		var knock_dir = (player.global_position - global_position)
		player.take_damage(1, knock_dir)

	# Quick visual pulse on attack
	if has_node("Mesh"):
		var mesh = get_node("Mesh")
		var original_scale = mesh.scale
		mesh.scale = original_scale * 1.6
		await get_tree().create_timer(0.1).timeout
		if is_instance_valid(mesh):
			mesh.scale = original_scale

func take_damage(amount: int):
	health -= amount
	print("[Enemy] Wisp took ", amount, " damage. Health: ", health)

	if has_node("Mesh"):
		var mesh = get_node("Mesh")
		if mesh is MeshInstance3D:
			var original = mesh.material_override
			if original:
				var mat = original.duplicate() as StandardMaterial3D
				mat.albedo_color = Color(1, 1, 1)
				mesh.material_override = mat
				await get_tree().create_timer(0.12).timeout
				if is_instance_valid(mesh):
					mesh.material_override = original

	if health <= 0:
		print("[Enemy] Wisp dissipated!")
		# Small echo fragment drop
		print("[Enemy] Dropped Echo Fragment")
		queue_free()
