# Mission M34_LOOT_ETERNAL — Loot & Consequences (Eternal Hint)

| Field | Value |
|-------|-------|
| Chapter | 34 |
| Arc | Arc 5 — World Boss Raid |
| Manuscript | `CHAPTERS/Chapter-34-Loot-and-Consequences-Eternal-Hint.md` |
| Quest ID | — |
| Zones | any hub |
| Est. playtime | 15 min |
| Prerequisites | M33 |

## Narrative objective
Bound relic hints Eternal Gauntlet. Factions can't ignore Haruto. Sunny monitor slip.

## Gameplay objective
- Examine `bound_relic` in inventory (codex unlock)
- Faction NPC reaction scenes
- Sunny/System glitch cutscene (monitor behavior)

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S3401 | dialogue | Eternal hint |
| S3402 | cutscene | Monitor slip |

## Start state
M33 complete.

## End state
Eternal Gauntlet codex entries; `sunny_monitor_slip` flag.

## Fail states
N/A.

## Characters
Haruto, factions, Sunny, System

## Key objects
`bound_relic`, codex entries

## Bond / faction deltas
Faction rep locked to "unignorable" tier.

## Rewards & unlocks
- Codex: Selection Protocol, Architect Hands
- Unlock M35

## Reactivity flags
`sunny_monitor_slip`, `eternal_hint_seen`

## Branch hooks
`sunny_contained` changes slip dialog.

## Implementation notes
- Foreshadow Volume 2
