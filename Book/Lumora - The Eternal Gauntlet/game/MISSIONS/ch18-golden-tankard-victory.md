# Mission M18_GOLDEN_TANKARD — Golden Tankard Victory

| Field | Value |
|-------|-------|
| Chapter | 18 |
| Arc | Arc 3 — Sky Dungeon #7 Deep Run |
| Manuscript | `CHAPTERS/Chapter-18-Golden-Tankard-Victory-Bound-Loot-Unbound-Choice.md` |
| Quest ID | — |
| Zones | `golden-tankard` |
| Est. playtime | 20 min |
| Prerequisites | M17 |

## Narrative objective
Celebration release valve. Bound relic aftermath. Public rivalry escalation. Elara measured warning.

## Gameplay objective
- Hub celebration scene with Mira
- Receive `bound_relic` (forced equip)
- NPC gossip reaction
- Elara warning dialog

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S1801 | hub | Celebration |
| S1802 | dialogue | Relic binds |
| S1803 | dialogue | Elara warning |

## Start state
Dungeon deep run complete.

## End state
`bound_relic_equipped`; Golden Tankard hub fully open.

## Fail states
N/A.

## Characters
Full party, Mira, Elara

## Key objects
`bound_relic`, gossip NPCs

## Bond / faction deltas
Jealousy +20 public; bonds +5 private scenes.

## Rewards & unlocks
- Bound relic (Eternal hint)
- Golden Tankard hub
- Unlock M19

## Reactivity flags
`bound_relic_equipped`

## Branch hooks
Dialog with each party member about relic — bond variants.

## Implementation notes
- Alpha content capstone (~3 hr to here)
- Hub scene: `scenes/hub/golden_tankard.tscn`
