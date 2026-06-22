extends CharacterBody3D

@export var speed: float = 7.5
@export var dash_speed: float = 15.0
@export var dash_duration: float = 0.22

var is_dashing := false
var dash_timer := 0.0

# === Interaction System (E key) ===
var nearby_interactable: Node = null

# === Basic Combat (starting vertical slice) ===
var attack_cooldown := 0.0
const ATTACK_COOLDOWN_TIME := 0.6

# Simple player health for combat loop (extend later with UI)
var health := 5
var damage_cooldown := 0.0
const DAMAGE_COOLDOWN_TIME := 0.8

func _ready():
	add_to_group("player")
	add_to_group("Player")

func _attack():
	if attack_cooldown > 0.0:
		return

	attack_cooldown = ATTACK_COOLDOWN_TIME
	print("[Combat] You swing the gauntlet blade in a bright arc!")

	# Visual swing feedback (temporary glowing arc mesh)
	var swing = MeshInstance3D.new()
	swing.name = "SwingVisual"
	add_child(swing)
	var mesh = TorusMesh.new()
	mesh.inner_radius = 0.6
	mesh.outer_radius = 1.1
	swing.mesh = mesh

	var mat = StandardMaterial3D.new()
	mat.albedo_color = Color(1.0, 0.85, 0.3)
	mat.emission_enabled = true
	mat.emission = Color(1.0, 0.7, 0.2)
	mat.emission_energy_multiplier = 2.5
	swing.material_override = mat
	swing.position = Vector3(0, 1.1, 0.8)
	swing.rotation_degrees = Vector3(90, 0, 0)

	# Quick fade out
	var tween = create_tween()
	tween.tween_property(swing, "scale", Vector3(0.2, 0.2, 0.2), 0.25)
	tween.tween_property(swing, "modulate:a", 0.0, 0.15)
	tween.tween_callback(swing.queue_free)

	# Enable or create temporary attack area + arc swing simulation
	var attack_area = get_node_or_null("AttackArea")
	var is_temp := false
	if not attack_area:
		is_temp = true
		attack_area = Area3D.new()
		attack_area.name = "TempAttackArea"
		add_child(attack_area)

		var shape = CollisionShape3D.new()
		var box = BoxShape3D.new()
		box.size = Vector3(2.0, 1.4, 1.6)
		shape.shape = box
		attack_area.add_child(shape)
		attack_area.position = Vector3(0, 1, 1.3)

		attack_area.body_entered.connect(_on_attack_area_body_entered)
		attack_area.monitoring = true

	# Simulate an arc swing by rotating the area during the active window
	if attack_area:
		var start_rot = attack_area.rotation_degrees.y
		var end_rot = start_rot + 55.0   # nice wide arc feel

		# Animate the rotation over the attack window
		var rot_tween = create_tween()
		rot_tween.tween_property(attack_area, "rotation_degrees:y", end_rot, 0.22)

		attack_area.monitoring = true
		if not attack_area.is_connected("body_entered", _on_attack_area_body_entered):
			attack_area.body_entered.connect(_on_attack_area_body_entered)

		# Small forward lunge for weight
		var original_pos = global_position
		global_position += -transform.basis.z * 0.35   # forward lunge

		await get_tree().create_timer(0.26).timeout

		# Restore position (gentle)
		if is_instance_valid(self):
			global_position = original_pos

		if is_instance_valid(attack_area):
			attack_area.monitoring = false
			if is_temp:
				attack_area.queue_free()
			else:
				attack_area.rotation_degrees.y = start_rot

func _on_attack_area_body_entered(body: Node3D):
	if body.has_method("take_damage"):
		body.take_damage(1)
		print("[Combat] Hit: ", body.name)
		_spawn_hit_particles(body.global_position)

func take_damage(amount: int, knockback_dir: Vector3 = Vector3.ZERO):
	if damage_cooldown > 0.0:
		return

	damage_cooldown = DAMAGE_COOLDOWN_TIME
	health -= amount
	print("[Player] Took ", amount, " damage. Health: ", health)

	# Visual feedback on player mesh (if present)
	if has_node("Mesh"):
		var m = get_node("Mesh")
		if m is MeshInstance3D and m.material_override:
			var orig = m.material_override
			var flash = orig.duplicate() as StandardMaterial3D
			flash.albedo_color = Color(1, 0.3, 0.3)
			m.material_override = flash
			await get_tree().create_timer(0.12).timeout
			if is_instance_valid(m):
				m.material_override = orig

	# Simple knockback
	if knockback_dir != Vector3.ZERO:
		velocity += knockback_dir.normalized() * 6.0

	if health <= 0:
		print("[Player] You have fallen... (death state not implemented yet)")

func _physics_process(delta: float) -> void:
	if attack_cooldown > 0.0:
		attack_cooldown -= delta
	if damage_cooldown > 0.0:
		damage_cooldown -= delta

	if is_dashing:
		dash_timer -= delta
		if dash_timer <= 0.0:
			is_dashing = false
		move_and_slide()
		return

	var input_dir := Input.get_vector("move_left", "move_right", "move_forward", "move_back")
	var direction := (transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()

	if direction:
		velocity.x = direction.x * speed
		velocity.z = direction.z * speed
	else:
		velocity.x = move_toward(velocity.x, 0, speed * 8 * delta)
		velocity.z = move_toward(velocity.z, 0, speed * 8 * delta)

	if Input.is_action_just_pressed("dash") and not is_dashing and direction:
		is_dashing = true
		dash_timer = dash_duration
		velocity = direction * dash_speed

	move_and_slide()

func _input(event):
	if event.is_action_pressed("interact") and nearby_interactable:
		if nearby_interactable.has_method("interact"):
			nearby_interactable.interact()

	if event.is_action_pressed("attack"):
		_attack()

	# Basic inventory / quest status check (press I)
	if event is InputEventKey and event.pressed and event.keycode == KEY_I:
		_print_status()

	# Dedicated quest log (press Q)
	if event is InputEventKey and event.pressed and event.keycode == KEY_Q:
		_print_quest_log()

func _on_interact_area_entered(area: Area3D):
	if area.has_method("interact"):
		nearby_interactable = area
		if area.has("prompt"):
			print("[E] ", area.prompt)

func _on_interact_area_exited(area: Area3D):
	if nearby_interactable == area:
		nearby_interactable = null

func _spawn_hit_particles(pos: Vector3):
	# Quick hit spark burst (combat feedback)
	var p = CPUParticles3D.new()
	get_tree().current_scene.add_child(p)
	p.global_position = pos + Vector3(0, 0.8, 0)
	p.emitting = true
	p.amount = 8
	p.lifetime = 0.35
	p.one_shot = true
	p.explosiveness = 0.9
	p.direction = Vector3(0, 1, 0)
	p.spread = 70
	p.initial_velocity_min = 2.5
	p.initial_velocity_max = 4.5
	p.gravity = Vector3(0, -4, 0)

	var mat = StandardMaterial3D.new()
	mat.albedo_color = Color(1.0, 0.9, 0.4)
	mat.emission_enabled = true
	mat.emission = Color(1, 0.8, 0.2)
	p.material_override = mat

	await get_tree().create_timer(0.6).timeout
	if is_instance_valid(p):
		p.queue_free()

func _print_status():
	print("\n=== Current Status ===")
	
	# Materials
	var inv = get_node_or_null("/root/PlayerInventory")
	if inv and inv.has_method("get_all_materials"):
		var mats = inv.get_all_materials()
		print("Materials:")
		for mat in mats:
			print("  ", mat, ": ", mats[mat])
	else:
		print("Inventory not found")
	
	# Quests
	var wm = get_node_or_null("/root/WorldManager")
	if wm and wm.has_method("active_quests"):
		print("\nActive Quests:")
		for q in wm.active_quests.keys():
			var state = wm.active_quests[q]
			print("  ", q, " - ", state.state)
		print("Completed: ", wm.completed_quests)
	else:
		print("\nQuest system not found or no active quests")
	
	print("======================\n")

func _print_quest_log():
	print("\n=== Quest Log ===")
	var wm = get_node_or_null("/root/WorldManager")
	if wm and wm.has_method("active_quests"):
		if wm.active_quests.size() > 0:
			for q in wm.active_quests.keys():
				var data = wm.active_quests[q]
				print("• ", q, " [", data.state, "]")
				if data.data.size() > 0:
					print("  Data: ", data.data)
		else:
			print("(No active quests)")
		
		if wm.completed_quests.size() > 0:
			print("\nCompleted:")
			for q in wm.completed_quests:
				print("• ", q)
	else:
		print("Quest system not available.")
	print("==================\n")
