# Mission M14_SUNNY_TRAP — The Tutorial Triggers the Trap

| Field | Value |
|-------|-------|
| Chapter | 14 |
| Arc | Arc 3 — Sky Dungeon #7 Deep Run |
| Manuscript | `CHAPTERS/Chapter-14-The-Tutorial-Triggers-The-Trap.md` |
| Quest ID | — |
| Zones | `sd7-deep` |
| Est. playtime | 20 min |
| Prerequisites | M13 |

## Narrative objective
Sunny guidance creates problems. Help is enemy vector. Party treats UI as adversarial.

## Gameplay objective
- Sunny recommends wrong path
- Ignore tips; trigger intentional correct route
- Survive trap wave
- Party consensus: adversarial UI

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S1401 | puzzle | Sunny trap |
| S1402 | combat | Trap wave |
| S1403 | dialogue | Adversarial UI |

## Start state
sd7-deep accessible.

## End state
Sunny trust -1; trap immunity this room.

## Fail states
Wipe.

## Characters
Sunny, Party

## Key objects
`trap_sunny_tip`

## Bond / faction deltas
+1 party trust if all ignore Sunny.

## Rewards & unlocks
- Trap immunity (room)
- Unlock M15

## Reactivity flags
`sunny_trust` decreased

## Branch hooks
Follow Sunny → extra wave (comedy).

## Implementation notes
- Sunny lie frequency +20% this mission
