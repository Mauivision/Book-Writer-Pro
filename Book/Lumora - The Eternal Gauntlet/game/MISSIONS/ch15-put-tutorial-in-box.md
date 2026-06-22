# Mission M15_BOX_SUNNY — Put The Tutorial In A Box

| Field | Value |
|-------|-------|
| Chapter | 15 |
| Arc | Arc 3 — Sky Dungeon #7 Deep Run |
| Manuscript | `CHAPTERS/Chapter-15-Put-The-Tutorial-In-A-Box.md` |
| Quest ID | — |
| Zones | `sd7-deep` |
| Est. playtime | 25 min |
| Prerequisites | M14 |

## Narrative objective
Literally contain Sunny. Party chooses autonomy. Dungeon reacts like it lost a lever.

## Gameplay objective
- Craft or find `sunny_box`
- Place in `sunny_box_slot`
- Escape room while dungeon aggro increases
- Sunny contained state

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S1501 | puzzle | Box Sunny |
| S1502 | combat | Dungeon reaction |
| S1503 | dialogue | Lost lever |

## Start state
M14 complete.

## End state
`sunny_contained` = true; dungeon aggro +1.

## Fail states
Combat wipe before box placed.

## Characters
Party, Sunny, System

## Key objects
`sunny_box`, `sunny_box_slot`

## Bond / faction deltas
Unity +15 (autonomy choice).

## Rewards & unlocks
- Sunny contained (no tips until M27)
- Unlock M16

## Reactivity flags
`sunny_contained`

## Branch hooks
Fail to box → Sunny stays active (harder M16).

## Implementation notes
- Sunny overlay disabled when flag set
- Affects M34 monitor slip
