# Mission M03_WALK_SD7 — Walk to Sky Dungeon 7

| Field | Value |
|-------|-------|
| Chapter | 03 |
| Arc | Arc 1 — The Summoning |
| Manuscript | `CHAPTERS/Chapter-03-The-Walk-to-Sky-Dungeon-7.md` |
| Quest ID | `q_gate` |
| Zones | `travel-road-sd7`, `forest-ruin-gate` |
| Est. playtime | 15 min |
| Prerequisites | M02 |

## Narrative objective
Travel banter exposes mixed-faction friction. Party proves functional despite System romance-combat nudges.

## Gameplay objective
- Travel escort along road (S0301–S0302)
- Optional scout skirmish (S0303)
- Reach forest-ruin-gate zone transition (S0304)

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S0301 | explore | Travel start |
| S0302 | dialogue | Faction friction banter |
| S0303 | combat | Optional scouts |
| S0304 | dialogue | Arrival at gate |

## Start state
Party assembled; SD7 quest active.

## End state
`forest-ruin-gate` unlocked; M04 available.

## Fail states
Combat wipe → respawn; rep -5 if repeated deaths.

## Characters
Full selected party

## Key objects
Zone exit to `forest-ruin-gate`

## Bond / faction deltas
+1 bond if jealousy avoided during travel.

## Rewards & unlocks
- Travel XP
- Zone: forest-ruin-gate
- Unlock M04

## Reactivity flags
`skipped_skirmish` if combat avoided.

## Branch hooks
Optional combat — XP vs speed.

## Implementation notes
- `storyBeats.zoneTransition` on east exit
- Scout enemy: `sky_warden_scout`
