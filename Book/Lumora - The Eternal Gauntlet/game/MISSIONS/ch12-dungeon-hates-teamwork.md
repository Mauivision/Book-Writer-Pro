# Mission M12_HATES_TEAMWORK — The Dungeon Hates Teamwork

| Field | Value |
|-------|-------|
| Chapter | 12 |
| Arc | Arc 3 — Sky Dungeon #7 Deep Run |
| Manuscript | `CHAPTERS/Chapter-12-The-Dungeon-Hates-Teamwork.md` |
| Quest ID | — |
| Zones | `sd7-mid` |
| Est. playtime | 25 min |
| Prerequisites | M11 |

## Narrative objective
Dungeon retaliates when unity rises. Teamwork is threat. Haruto realizes dungeon is adaptive.

## Gameplay objective
- Enter anti-teamwork room
- Survive `trap_anti_coop` escalation
- Adapt tactics (split bait vs unity rush)
- Unity tracker revealed

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S1201 | combat | Retaliation room |
| S1202 | dialogue | Adaptive reveal |

## Start state
Unity > threshold from M11.

## End state
`adaptive_dungeon` flag; Unity tracker UI.

## Fail states
Room reset harder on wipe.

## Characters
Party

## Key objects
`trap_anti_coop`, unity tracker

## Bond / faction deltas
Unity +10 if cleared without blaming.

## Rewards & unlocks
- Adaptive dungeon rules
- Unlock M13

## Reactivity flags
`adaptive_dungeon_active`

## Branch hooks
High unity = harder room (intended).

## Implementation notes
- Spawn tables swap when unity > 70
