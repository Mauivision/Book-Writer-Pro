# Mission M30_BOSS_P1 — World Boss Phase 1 (Disunity Punished)

| Field | Value |
|-------|-------|
| Chapter | 30 |
| Arc | Arc 5 — World Boss Raid |
| Manuscript | `CHAPTERS/Chapter-30-World-Boss-Phase-1-Disunity-Punished.md` |
| Quest ID | — |
| Zones | `raid-arena` |
| Est. playtime | 20 min |
| Prerequisites | M29 |

## Narrative objective
Boss punishes disunity. Jealousy literalized. Haruto tanks morale, not damage.

## Gameplay objective
- Enter Correction Warden fight
- Phase 1: maintain morale bar > 0
- Manage jealousy hearts overlap damage
- Dialogue choices as morale heals

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S3001 | boss | Phase 1 |
| S3002 | dialogue | Tank morale |

## Start state
Raid prep complete.

## End state
Phase 1 cleared; morale tank skill unlocked.

## Fail states
Morale 0 → phase reset.

## Characters
Party, Correction Warden

## Key objects
`morale_bar`, jealousy hearts UI

## Bond / faction deltas
Lowest bond pair targeted — +15 bond if protected.

## Rewards & unlocks
- Morale tank ability
- Unlock M31

## Reactivity flags
`boss_phase_1_clear`

## Branch hooks
High jealousy = harder phase 1.

## Implementation notes
- Boss ID: `correction_warden` phase 1
