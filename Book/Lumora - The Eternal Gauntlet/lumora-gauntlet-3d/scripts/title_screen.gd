extends Control

func _ready():
	# Allow pressing Enter to start
	set_process_input(true)

func _input(event):
	if event.is_action_pressed("ui_accept"):
		_start_game()

func _on_start_pressed():
	_start_game()

func _start_game():
	get_tree().change_scene_to_file("res://scenes/verdant_meadow.tscn")
