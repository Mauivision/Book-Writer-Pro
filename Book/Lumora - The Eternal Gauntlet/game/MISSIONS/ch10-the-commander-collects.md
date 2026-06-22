# Mission M10_COMMANDER — The Commander Collects

| Field | Value |
|-------|-------|
| Chapter | 10 |
| Arc | Arc 2 — Party Formation & Escalation |
| Manuscript | `CHAPTERS/Chapter-10-The-Commander-Collects.md` |
| Quest ID | — |
| Zones | `sd7-upper` |
| Est. playtime | 20 min |
| Prerequisites | M09 |

## Narrative objective
Veil contract pressure. Bone Commander tests resolve. Third path: unity without submission.

## Gameplay objective
- Bone Commander confrontation dialog
- Refuse contract (required for canon)
- Optional Commander test fight
- Earn party code buff

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S1001 | dialogue | Contract pressure |
| S1002 | dialogue | Refuse submission |
| S1003 | combat | Commander test |

## Start state
M09 complete.

## End state
`refused_veil_contract` reinforced; party code buff.

## Fail states
Combat wipe.

## Characters
Bone Commander, Haruto, Nyx (optional)

## Key objects
`contract_table` (reference)

## Bond / faction deltas
`bond_bone` +15; Veil rep +10 (respect path).

## Rewards & unlocks
- Party code buff
- Unlock M11

## Reactivity flags
`refused_veil_contract`, `party_code_active`

## Branch hooks
Fake accept contract → bad end branch (reload).

## Implementation notes
- Contract UI similar to M20 preview
