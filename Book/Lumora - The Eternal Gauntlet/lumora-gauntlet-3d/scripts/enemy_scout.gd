extends CharacterBody3D

@export var speed := 3.5
@export var health := 3

var player: Node3D = null

var attack_cooldown := 0.0
const ATTACK_COOLDOWN_TIME := 1.1
const ATTACK_RANGE := 1.6

func _ready():
	# Robust player finding
	player = get_tree().get_first_node_in_group("player")
	if not player:
		player = get_tree().get_first_node_in_group("Player")
	if not player:
		# Fallback search in parent
		var p = get_parent().get_node_or_null("Player")
		if p:
			player = p

	# Auto-add simple visual if none exists (makes the enemy visible immediately)
	if get_child_count() == 0 or not has_node("Mesh"):
		var mesh_instance = MeshInstance3D.new()
		mesh_instance.name = "Mesh"
		var sphere = SphereMesh.new()
		sphere.radius = 0.6
		sphere.height = 1.2
		mesh_instance.mesh = sphere

		var mat = StandardMaterial3D.new()
		mat.albedo_color = Color(0.8, 0.3, 0.2)  # Angry red-ish scout
		mat.emission_enabled = true
		mat.emission = Color(0.4, 0.1, 0.05)
		mesh_instance.material_override = mat

		add_child(mesh_instance)

		# Add basic collision if missing
		if not has_node("CollisionShape3D"):
			var col = CollisionShape3D.new()
			var shape = CapsuleShape3D.new()
			shape.radius = 0.5
			shape.height = 1.4
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

	if dist > ATTACK_RANGE:
		# Chase
		velocity = to_player.normalized() * speed
	else:
		# In range – stop and try to attack
		velocity = Vector3.ZERO
		if attack_cooldown <= 0.0:
			_attack_player()

	move_and_slide()

func take_damage(amount: int):
	health -= amount
	print("[Enemy] Scout took ", amount, " damage. Health: ", health)

	# Simple hit feedback
	if has_node("Mesh"):
		var mesh = get_node("Mesh")
		if mesh is MeshInstance3D:
			var original = mesh.material_override
			if original:
				var mat = original.duplicate() as StandardMaterial3D
				mat.albedo_color = Color(1, 1, 1)
				mesh.material_override = mat
				await get_tree().create_timer(0.15).timeout
				if is_instance_valid(mesh):
					mesh.material_override = original

	if health <= 0:
		print("[Enemy] Scout defeated!")

		# Death drop hook (economy tie-in)
		print("[Enemy] Dropped a small resource cluster (verdant crystal)")

		# Death visual effect (quick scale + color flash then fade)
		if has_node("Mesh"):
			var mesh = get_node("Mesh")
			var death_tween = create_tween()
			death_tween.tween_property(mesh, "scale", Vector3(0.1, 0.1, 0.1), 0.35)
			if mesh.material_override:
				var flash_mat = mesh.material_override.duplicate() as StandardMaterial3D
				flash_mat.albedo_color = Color(1, 0.9, 0.6)
				flash_mat.emission = Color(1, 0.8, 0.3)
				mesh.material_override = flash_mat

			await get_tree().create_timer(0.4).timeout

		queue_free()

func _attack_player():
	if not player or not is_instance_valid(player):
		return

	attack_cooldown = ATTACK_COOLDOWN_TIME
	print("[Enemy] Scout attacks!")

	if player.has_method("take_damage"):
		var knock_dir = (player.global_position - global_position)
		player.take_damage(1, knock_dir)

	# Small lunge visual feedback on the enemy
	if has_node("Mesh"):
		var mesh = get_node("Mesh")
		var original_scale = mesh.scale
		mesh.scale = original_scale * 1.3
		await get_tree().create_timer(0.12).timeout
		if is_instance_valid(mesh):
			mesh.scale = original_scale
