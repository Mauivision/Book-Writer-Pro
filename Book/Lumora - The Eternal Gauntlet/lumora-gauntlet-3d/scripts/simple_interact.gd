extends Area3D

@export var prompt: String = "Interact"

func _ready():
    body_entered.connect(_on_body_entered)
    body_exited.connect(_on_body_exited)

func _on_body_entered(body: Node3D):
    if body.name == "Player":
        print("[Interact] ", prompt, " (press E)")

func _on_body_exited(body: Node3D):
    if body.name == "Player":
        print("[Interact] Left area")
