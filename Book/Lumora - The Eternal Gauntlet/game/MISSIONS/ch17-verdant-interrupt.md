# Mission M17_VERDANT — Verdant Interrupt

| Field | Value |
|-------|-------|
| Chapter | 17 |
| Arc | Arc 3 — Sky Dungeon #7 Deep Run |
| Manuscript | `CHAPTERS/Chapter-17-Verdant-Interrupt.md` |
| Quest ID | `q_elara` |
| Zones | `verdant-interrupt` |
| Est. playtime | 20 min |
| Prerequisites | M16 |

## Narrative objective
Elara reframes factions as framework. Warns cuff awakening. Verdant route activates; Equinox tease.

## Gameplay objective
- Traverse verdant-interrupt corridor
- Elara dialog (HUD refuses to label her)
- Fight correction_drone optional
- Activate Verdant route flag

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S1701 | explore | Corridor |
| S1702 | dialogue | Elara reframe |
| S1703 | combat | Correction drone |
| S1704 | cutscene | Verdant route |

## Start state
Mirror trial complete.

## End state
Elara in roster; `elara_route_active`.

## Fail states
Combat wipe.

## Characters
Elara, Haruto, Party, System

## Key objects
`crystal_gauntlet`, `cyan_tab`

## Bond / faction deltas
`bond_elara` +25; jealousy spike if romance flags active.

## Rewards & unlocks
- Elara follower
- Verdant route
- Unlock M18

## Reactivity flags
`elara_route_active`

## Branch hooks
Jealousy reactions from Radiant cast — dialog only.

## Implementation notes
- `storyBeats.elaraInterrupt`
- Zone status: planned in lumora.json
