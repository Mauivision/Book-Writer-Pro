extends Node3D

@export var target: Node3D
@export var follow_speed: float = 5.0
@export var height: float = 22.0
@export var distance: float = 26.0
@export var angle: float = 55.0  # pitch

var _offset: Vector3

func _ready():
    if not target:
        target = get_node_or_null("../Player")
    _recalculate_offset()

func _recalculate_offset():
    var rad = deg_to_rad(angle)
    _offset = Vector3(0, height, distance * cos(rad))  # simplified

func _physics_process(delta: float):
    if not target:
        return
    
    var desired_pos = target.global_position + Vector3(0, height, distance * 0.6)
    # Slight lead in movement direction
    if target.velocity.length() > 1.0:
        desired_pos += target.velocity.normalized() * 4.0
    
    global_position = global_position.lerp(desired_pos, follow_speed * delta)
    look_at(target.global_position + Vector3(0, 2, 0), Vector3.UP)
