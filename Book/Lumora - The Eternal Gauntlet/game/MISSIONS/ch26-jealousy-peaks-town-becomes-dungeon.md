# Mission M26_JEALOUSY_PEAK — Jealousy Peaks (Town Becomes Dungeon)

| Field | Value |
|-------|-------|
| Chapter | 26 |
| Arc | Arc 4 — Politics & Bond Quests |
| Manuscript | `CHAPTERS/Chapter-26-Jealousy-Peaks-Town-Becomes-Dungeon.md` |
| Quest ID | — |
| Zones | `town-dungeon`, `golden-tankard`, `castle-lumora` |
| Est. playtime | 30 min |
| Prerequisites | M23, M24, M25 (recommended) |

## Narrative objective
Absurd difficulty in town. Safe zones fail. System treats romance like combat.

## Gameplay objective
- Town combat with `town_mob` spawns
- Jealousy at cap — manage or endure
- Secure Golden Tankard as temporary safe point
- Party bicker → reconcile scene

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S2601 | combat | Town dungeon |
| S2602 | dialogue | Safe zones fail |

## Start state
Bond quests done or skipped.

## End state
`town_dungeon_active`; jealousy cap event consumed.

## Fail states
Wipe → respawn with embarrassment debuff.

## Characters
Full party, town_mobs, Mira

## Key objects
Jealousy at max

## Bond / faction deltas
All bonds +10 if reconcile; -10 if blame.

## Rewards & unlocks
- Town dungeon mechanic (temporary)
- Unlock M27

## Reactivity flags
`town_dungeon_cleared`

## Branch hooks
More bond quests done = easier reconcile.

## Implementation notes
- Comedy difficulty — not unfair hard
