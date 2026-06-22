# Mission M09_LOOT_BINDS — Loot Binds (And So Do People)

| Field | Value |
|-------|-------|
| Chapter | 09 |
| Arc | Arc 2 — Party Formation & Escalation |
| Manuscript | `CHAPTERS/Chapter-09-Loot-Binds-And-So-Do-People.md` |
| Quest ID | — |
| Zones | `sd7-upper` |
| Est. playtime | 15 min |
| Prerequisites | M08 |

## Narrative objective
Binding loot mirrors binding relationships. Jealousy becomes system math. Haruto accepts responsibility without ownership.

## Gameplay objective
- Pick up bind-on-equip gear
- Equip (forced or choice)
- Survive jealousy UI spike
- Dialogue: responsibility beat

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S0901 | dialogue | Loot binds |
| S0902 | hub | Jealousy math |
| S0903 | dialogue | Responsibility |

## Start state
Post mini-boss loot available.

## End state
Bound gear slot active; jealousy +10 baseline.

## Fail states
N/A (narrative mission).

## Characters
Party, System

## Key objects
Bound gear, `jealousy_hud`

## Bond / faction deltas
Jealousy +10; bond tension flags.

## Rewards & unlocks
- Loot binding mechanic
- Unlock M10

## Reactivity flags
`bound_gear_equipped`

## Branch hooks
Which gear piece — cosmetic variants.

## Implementation notes
- UI: cannot unequip bound items
