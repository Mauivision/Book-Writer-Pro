# ============================================================================
# PlayerResources.gd
# Drop-in upgraded inventory for the book-embedded Lumora project.
#
# This replaces the hardcoded 3-material system with the full resource set.
#
# Installation:
# 1. Save this as scripts/autoload/PlayerResources.gd
# 2. Add as Autoload named "PlayerResources"
# 3. (Optional during transition) Keep the old PlayerInventory singleton for now
# ============================================================================

extends Node

signal materials_changed

# Full inventory using the central resource definitions
var materials: Dictionary = {}

func _ready() -> void:
    # Initialize every known resource to 0
    for id in LumoraResources.get_all_ids():
        materials[id] = 0
    
    print("[PlayerResources] Inventory initialized with full resource set.")

# === Core Methods (use these going forward) ===

func add_material(type: String, amount: int = 1) -> void:
    if not LumoraResources.is_valid(type):
        push_warning("[PlayerResources] Unknown resource type: " + type)
        return
    
    if amount <= 0:
        return
    
    materials[type] = materials.get(type, 0) + amount
    materials_changed.emit()
    
    var display = LumoraResources.get_display_name(type)
    print("[Inventory] +%d %s (total: %d)" % [amount, display, materials[type]])

func remove_material(type: String, amount: int = 1) -> bool:
    if not LumoraResources.is_valid(type):
        return false
    if not has_material(type, amount):
        return false
    
    materials[type] -= amount
    materials_changed.emit()
    
    var display = LumoraResources.get_display_name(type)
    print("[Inventory] -%d %s (remaining: %d)" % [amount, display, materials[type]])
    return true

func has_material(type: String, amount: int = 1) -> bool:
    return materials.get(type, 0) >= amount

func get_material_count(type: String) -> int:
    return materials.get(type, 0)

func get_all_materials() -> Dictionary:
    return materials.duplicate()

# === Compatibility Layer (for existing code) ===
# These methods let old code continue working during the transition.

func add_material_old(type: String, amount: int = 1):
    """Old name used in current Harvestable and BuildManager"""
    add_material(type, amount)

func spend_material(type: String, amount: int = 1) -> bool:
    """Old method name from the original PlayerInventory"""
    return remove_material(type, amount)

func craft_item(item: String) -> bool:
    """Placeholder for old crafting logic. Expand as needed."""
    print("[PlayerResources] craft_item called for:", item, "— expand this method.")
    return false

# === Save / Load Helpers (for later persistence work) ===

func to_save_data() -> Dictionary:
    return {
        "materials": materials.duplicate()
    }

func load_from_data(data: Dictionary) -> void:
    if data.has("materials"):
        for id in data.materials:
            if LumoraResources.is_valid(id):
                materials[id] = data.materials[id]
        materials_changed.emit()
        print("[PlayerResources] Loaded inventory from save.")