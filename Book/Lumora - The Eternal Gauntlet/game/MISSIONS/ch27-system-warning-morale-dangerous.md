# Mission M27_SYSTEM_WARNING — System Warning (Morale Dangerous)

| Field | Value |
|-------|-------|
| Chapter | 27 |
| Arc | Arc 4 — Politics & Bond Quests |
| Manuscript | `CHAPTERS/Chapter-27-System-Warning-Morale-Dangerous.md` |
| Quest ID | — |
| Zones | any hub |
| Est. playtime | 15 min |
| Prerequisites | M26 |

## Narrative objective
Direct UI warning. Sunny erratic if not contained. Correction hints. Elara confirms world pushes back.

## Gameplay objective
- System warning cutscene
- Sunny erratic tips (if not contained: chaos; if contained: glitches)
- Elara confirm dialog
- Set `correction_heat` +1

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S2701 | cutscene | System warning |
| S2702 | dialogue | Elara confirm |

## Start state
M26 complete.

## End state
`correction_heat` = 1; Sunny erratic state.

## Fail states
N/A.

## Characters
System, Sunny, Elara, Haruto

## Key objects
`patch_toast`, correction UI

## Bond / faction deltas
Unity +5 (defiance).

## Rewards & unlocks
- Correction Heat tracker
- Unlock M28

## Reactivity flags
`correction_heat`, `sunny_erratic`

## Branch hooks
`sunny_contained` changes Sunny behavior this mission.

## Implementation notes
- Foreshadows Volume 2 Corrections
