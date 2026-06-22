# Mission M28_PUBLIC_CHOICE — Public Choice Cliffhanger

| Field | Value |
|-------|-------|
| Chapter | 28 |
| Arc | Arc 4 — Politics & Bond Quests |
| Manuscript | `CHAPTERS/Chapter-28-Public-Choice-Cliffhanger.md` |
| Quest ID | — |
| Zones | `castle-lumora`, `raid-arena` |
| Est. playtime | 20 min |
| Prerequisites | M27 |

## Narrative objective
World boss foreshadow. System demands pick a side. Haruto refuses publicly — triggers raid.

## Gameplay objective
- Public assembly scene
- System faction choice UI
- Refuse both (canon)
- World boss portal opens

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S2801 | dialogue | Public choice |
| S2802 | cutscene | Raid trigger |

## Start state
M27 complete.

## End state
World boss spawned; raid queue active.

## Fail states
Pick faction → alternate ending (non-canon).

## Characters
System, factions, Haruto, full party

## Key objects
`raid_portal`

## Bond / faction deltas
Unity +20 on refusal.

## Rewards & unlocks
- Raid access
- Unlock M29

## Reactivity flags
`world_boss_spawned`, `refused_public_choice`

## Branch hooks
Canon refusal required for M32 Unity Override.

## Implementation notes
- Cliffhanger → raid arc
