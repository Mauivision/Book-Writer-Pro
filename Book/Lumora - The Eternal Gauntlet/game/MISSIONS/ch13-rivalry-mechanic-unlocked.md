# Mission M13_RIVALRY — Rivalry Mechanic Unlocked

| Field | Value |
|-------|-------|
| Chapter | 13 |
| Arc | Arc 3 — Sky Dungeon #7 Deep Run |
| Manuscript | `CHAPTERS/Chapter-13-Rivalry-Mechanic-Unlocked.md` |
| Quest ID | — |
| Zones | `sd7-mid` |
| Est. playtime | 25 min |
| Prerequisites | M12 |

## Narrative objective
Jealousy aggro becomes difficulty spikes. Romance flags are hazards. Haruto leads social layer.

## Gameplay objective
- Rivalry mechanic UI tutorial
- Combat with active romance flags
- Reduce jealousy below threshold OR survive max spawns
- Social leadership dialogue

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S1301 | combat | Jealousy spawns |
| S1302 | dialogue | Social leadership |

## Start state
Jealousy baseline from M09.

## End state
Rivalry mechanic fully active.

## Fail states
Wipe from spawn overwhelm.

## Characters
Party, System

## Key objects
`jealousy_hud`, `romance_flag_popup`, `jealousy_spawn`

## Bond / faction deltas
Jealousy managed → +2 all bonds; failed → jealousy +15.

## Rewards & unlocks
- Rivalry mechanic UI
- Spawn formula active
- Unlock M14

## Reactivity flags
`rivalry_mechanic_unlocked`

## Branch hooks
Use `jealousy_dampener` if obtained early (M21 preview skip).

## Implementation notes
- **P2 system:** jealousy → spawn multiplier
- Alpha milestone
