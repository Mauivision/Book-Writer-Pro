# Lumora Gauntlet 3D - Phase 0/1 Design

**Target Feel**: Link's Awakening (Switch) top-down camera + classic Zelda room logic in 3D.

## Camera
- Fixed yaw ~45°, pitch ~55-60°
- Smooth follow with slight lead
- No player-controlled orbit

## Player
- 8-way movement on XZ plane
- Dash (Gauntlet cuff fantasy)
- Weighty, not twitchy

## Combat (Phase 1)
- Sword swing with visible forward arc
- Short windup + hit-stop on hit
- Basic i-frames on dash

## First Slice (Verdant Leak Meadow)
- Greybox geometry
- One scout enemy type
- Velvet NPC + one story beat
- East exit trigger to Forest Ruin Gate (blocked for now)
- Quest log + basic UI bridge from BookWriter

## Controls (Godot Input)
- WASD / Arrows: Move
- Space: Dash
- J: Attack

## Data Contract
Shared JSON from BookWriter Pro:
- zones (exits, requirements)
- quests
- enemy profiles
- player progression (gauntlet verbs)

This project stays experimental content for the Lumora book in BookWriter Pro.
