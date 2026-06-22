@tool
extends Node3D
class_name HarvestWorkshopTool

## Editor tool for quickly testing and balancing the Harvest + Build systems.
## Similar philosophy to the Chest Builder and Character Creator.

@export_category("Testing")
@export var test_resource: String = "wood"
@export var test_amount: int = 5

@export_category("Actions")
@export_tool_button("Add Test Resources to Inventory") var add_resources_btn: Callable = add_test_resources
@export_tool_button("Print Current Inventory") var print_inv_btn: Callable = print_inventory
@export_tool_button("Simulate Harvest on Selected Node") var harvest_btn: Callable = simulate_harvest

var inventory := ResourceInventory.new()
var last_harvestable: Harvestable

func _ready() -> void:
	add_child(inventory)
	print("Harvest Workshop ready. Attach Harvestable nodes to test them.")

func add_test_resources() -> void:
	inventory.add_resource(test_resource, test_amount)
	print("Added ", test_amount, " ", test_resource)

func print_inventory() -> void:
	print("Current Inventory:")
	for res in inventory.get_all_resources():
		print("  ", res, ": ", inventory.get_amount(res))

func simulate_harvest() -> void:
	# Find a Harvestable in the scene to test
	if not last_harvestable:
		for child in get_tree().get_nodes_in_group("harvestable"):
			last_harvestable = child
			break
	
	if last_harvestable:
		last_harvestable.harvest("any", inventory)
		print("Harvested from: ", last_harvestable.name)
	else:
		print("No Harvestable found in scene. Add one with the Harvestable script.")