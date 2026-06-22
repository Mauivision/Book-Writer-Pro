# Mission M04_TUTORIAL_LIAR — Tutorial Dungeon (Liar)

| Field | Value |
|-------|-------|
| Chapter | 04 |
| Arc | Arc 1 — The Summoning |
| Manuscript | `CHAPTERS/Chapter-04-Tutorial-Dungeon-Liar.md` |
| Quest ID | — |
| Zones | `sd7-tutorial` |
| Est. playtime | 20 min |
| Prerequisites | M03 |

## Narrative objective
Establish dungeon tile language, rules, traps. Haruto learns dungeon rewards unity and punishes posturing.

## Gameplay objective
- Enter sd7-tutorial
- Learn tile rules (safe vs lie tiles)
- Clear combat room
- Activate unity tile (2+ party members)

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S0401 | explore | Enter tutorial floor |
| S0402 | puzzle | Tile rules |
| S0403 | combat | Light constructs |
| S0404 | puzzle | Unity tile door |

## Start state
At forest-ruin-gate or sd7 entrance.

## End state
Tutorial floor cleared; trap codex entry.

## Fail states
Wrong tile → trap damage; wipe → respawn.

## Characters
Party

## Key objects
`tile_set`, `tile_lie`, `tile_safe`, `unity_tile`

## Bond / faction deltas
+1 bond if unity tile cleared without separation.

## Rewards & unlocks
- Tutorial loot
- Codex: trap basics
- Unlock M05

## Reactivity flags
`posture_trap_triggered` if emote used on wrong tile.

## Branch hooks
Solo posturing triggers extra trap (comedy).

## Implementation notes
- First dungeon puzzle prototype
- See `BIBLES/Puzzles_Traps.md` tile kit
