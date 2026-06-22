# Mission M16_MIRROR_TRIAL — Unity Trial (Mirror Lies)

| Field | Value |
|-------|-------|
| Chapter | 16 |
| Arc | Arc 3 — Sky Dungeon #7 Deep Run |
| Manuscript | `CHAPTERS/Chapter-16-Unity-Trial-Mirror-Lies.md` |
| Quest ID | — |
| Zones | `mirror-trial` |
| Est. playtime | 30 min |
| Prerequisites | M15 |

## Narrative objective
Mirror tests bonds. Separation punished. Copies attack weakest bond. Cyan tab unlocks; gods watching.

## Gameplay objective
- Enter mirror-trial instance
- Identify weakest bond (hidden until scan)
- Defeat `mirror_copy` without separation >5 sec cumulative
- Cyan tab unlock cutscene

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S1601 | puzzle | Enter trial |
| S1602 | boss | Mirror copy |
| S1603 | cutscene | Cyan unlock |

## Start state
sd7-deep trial door open.

## End state
`cyan_tab_unlocked`; codex fragment 1.

## Fail states
Separation pulse death; wipe.

## Characters
Party, mirror_copy, System

## Key objects
`mirror_pedestal`, `cyan_tab`

## Bond / faction deltas
Weakest bond +20 if copy defeated together.

## Rewards & unlocks
- Cyan UI tab
- Codex: First Equinox fragment
- Unlock M17

## Reactivity flags
`cyan_tab_unlocked`, `mirror_trial_cleared`

## Branch hooks
Higher bond aggregate = weaker copy HP.

## Implementation notes
- Puzzle + boss hybrid instance
- Alpha milestone
