# Mission M29_RAID_PREP — Raid Prep (Forced Mixed Party)

| Field | Value |
|-------|-------|
| Chapter | 29 |
| Arc | Arc 5 — World Boss Raid |
| Manuscript | `CHAPTERS/Chapter-29-Raid-Prep-Forced-Mixed-Party.md` |
| Quest ID | — |
| Zones | `golden-tankard`, `raid-arena` |
| Est. playtime | 25 min |
| Prerequisites | M28 |

## Narrative objective
Prep reveals true stakes. Velvet triage, Mira supplies, Seraphina rallies. Hardliners sabotage unity.

## Gameplay objective
- Gather supplies (Mira questionable potions)
- Velvet triage buff party
- Seraphina rally speech
- Survive saboteur traps in raid staging

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S2901 | hub | Supplies |
| S2902 | dialogue | Mixed party forced |
| S2903 | combat | Sabotage |

## Start state
World boss spawned.

## End state
Raid buffs active; mixed party locked.

## Fail states
Sabotage wipe → retry staging.

## Characters
Mira, Velvet, Seraphina, Halvion (saboteur), party

## Key objects
`questionable_potion`, `trap_sabotage`

## Bond / faction deltas
Raid buffs scale with bonds completed.

## Rewards & unlocks
- Raid prep buffs
- Unlock M30

## Reactivity flags
`raid_prep_complete`

## Branch hooks
Bond quest completion → stronger buffs.

## Implementation notes
- Raid staging area before boss
