# Mission M24_BOND_LUMINARA — Bond Quest: Luminara (Gods Watching)

| Field | Value |
|-------|-------|
| Chapter | 24 |
| Arc | Arc 4 — Politics & Bond Quests |
| Manuscript | `CHAPTERS/Chapter-24-Bond-Quest-Luminara-Gods-Watching.md` |
| Quest ID | — |
| Zones | `bond-luminara` |
| Est. playtime | 25 min |
| Prerequisites | M22 |

## Narrative objective
Spell tutoring. Gods publish patch notes. Luminara's teasing becomes protective — marked Players warning.

## Gameplay objective
- Spell tutorial puzzle (combo inputs)
- Luminara lore dump (patch notes)
- Protective dialogue beat
- Unlock spell assist

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S2401 | puzzle | Spell tutoring |
| S2402 | dialogue | Gods watching |

## Start state
M22 complete.

## End state
Luminara spell assist; codex patch notes entry.

## Fail states
Fail puzzle → retry.

## Characters
Luminara, Haruto, Patch Herald (cameo)

## Key objects
`patch_toast`, spell UI

## Bond / faction deltas
`bond_luminara` +30.

## Rewards & unlocks
- AoE spell assist
- Codex: Patch Notes lore

## Reactivity flags
`luminara_bond_quest_done`

## Branch hooks
Parallel with M23, M25.

## Implementation notes
- Optional order doesn't block M26
