# Mission M31_BOSS_P2 — World Boss Phase 2 (Declaration Duel)

| Field | Value |
|-------|-------|
| Chapter | 31 |
| Arc | Arc 5 — World Boss Raid |
| Manuscript | `CHAPTERS/Chapter-31-World-Boss-Phase-2-Declaration-Duel.md` |
| Quest ID | — |
| Zones | `raid-arena` |
| Est. playtime | 20 min |
| Prerequisites | M30 |

## Narrative objective
Light+Veil combo required. Seraphina + Bone Commander synchronize. Mutual respect overwrites rivalry.

## Gameplay objective
- Phase 2 begins at boss 66% HP
- Sync QTE: Seraphina + Bone Commander declarations
- Land synchronized Light+Veil strike
- Avoid faction fracture debuff

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S3101 | boss | Phase 2 sync |
| S3102 | dialogue | Rivalry overwrite |

## Start state
Phase 1 clear.

## End state
Phase 2 clear; declaration duel combo unlocked.

## Fail states
Sync fail → fracture debuff, retry phase.

## Characters
Seraphina, Bone Commander, Party, Boss

## Key objects
Sync QTE UI

## Bond / faction deltas
Seraphina + Bone bond +25 mutual.

## Rewards & unlocks
- Declaration duel combo
- Unlock M32

## Reactivity flags
`boss_phase_2_clear`, `rivalry_overwritten`

## Branch hooks
M23 + M25 done = wider sync window.

## Implementation notes
- Dramatic dialog during QTE
