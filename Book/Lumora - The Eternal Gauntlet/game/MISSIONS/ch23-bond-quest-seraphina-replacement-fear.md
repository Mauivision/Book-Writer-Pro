# Mission M23_BOND_SERAPHINA — Bond Quest: Seraphina (Replacement Fear)

| Field | Value |
|-------|-------|
| Chapter | 23 |
| Arc | Arc 4 — Politics & Bond Quests |
| Manuscript | `CHAPTERS/Chapter-23-Bond-Quest-Seraphina-Replacement-Fear.md` |
| Quest ID | — |
| Zones | `bond-seraphina` |
| Est. playtime | 25 min |
| Prerequisites | M22 |

## Narrative objective
Training + vulnerability. She fears replacement by better routes. Haruto validates her as person, not flag.

## Gameplay objective
- Training combat with Seraphina (parry tutorial)
- Vulnerability dialogue tree
- Validate choice (canon)
- Unlock Seraphina co-op combo

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S2301 | combat | Training |
| S2302 | dialogue | Replacement fear |

## Start state
M22 complete.

## End state
Seraphina co-op combo; bond tier 4+.

## Fail states
Dismiss fear → bond stall (retry).

## Characters
Seraphina, Haruto

## Key objects
Training weapons

## Bond / faction deltas
`bond_seraphina` +30.

## Rewards & unlocks
- Holy burst combo assist
- Raid synergy M31 bonus

## Reactivity flags
`seraphina_bond_quest_done`

## Branch hooks
Complete before M26 for jealousy reduction.

## Implementation notes
- Bond instance scene
