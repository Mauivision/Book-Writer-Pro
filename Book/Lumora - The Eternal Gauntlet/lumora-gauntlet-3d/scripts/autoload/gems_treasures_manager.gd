extends Node
class_name GemsTreasuresManager

## Central manager for Gems and Treasures in Lumora.
## Handles gem properties, treasure generation, and loot distribution.
## Can be used as an autoload or attached to WorldManager.

signal gem_collected(gem_id: String, amount: int)
signal treasure_opened(treasure_type: String, contents: Dictionary)

@export var use_loot_tables: bool = true

var gems_data: Dictionary = {}
var treasure_types: Dictionary = {}
var loot_tables: Dictionary = {}

func _ready() -> void:
    load_data()

func load_data() -> void:
    # In real project, load from JSON files
    # For now, these would be populated from the data files
    print("[GemsTreasures] Manager initialized (load JSON data in _ready)")

func get_gem_data(gem_id: String) -> Dictionary:
    return gems_data.get(gem_id, {})

func get_treasure_type(type_id: String) -> Dictionary:
    return treasure_types.get(type_id, {})

func generate_loot(treasure_type: String, luck_modifier: float = 1.0) -> Dictionary:
    # Uses loot_tables.json to generate random contents
    # Returns a dictionary of {resource_id: amount}
    var loot := {}
    
    # Placeholder logic - replace with actual table loading + RNG
    if treasure_type == "crystal_vein":
        loot["crystal_shard"] = randi_range(2, 5)
        if randf() < 0.4 * luck_modifier:
            loot["verdant_gem"] = 1
    
    # Add more table logic as needed...
    
    treasure_opened.emit(treasure_type, loot)
    return loot

func add_gem_to_inventory(gem_id: String, amount: int = 1, inventory: ResourceInventory = null) -> bool:
    if not inventory:
        inventory = get_node_or_null("/root/PlayerResources")
    
    if inventory and inventory.has_method("add_material"):
        inventory.add_material(gem_id, amount)
        gem_collected.emit(gem_id, amount)
        return true
    return false

# Helper for chest opening
func open_treasure_chest(chest_type: String, inventory: ResourceInventory = null) -> Dictionary:
    var loot = generate_loot(chest_type)
    
    if inventory:
        for resource in loot:
            inventory.add_material(resource, loot[resource])
    
    return loot
