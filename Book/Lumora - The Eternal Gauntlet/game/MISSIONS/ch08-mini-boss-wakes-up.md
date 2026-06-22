# Mission M08_MINI_BOSS — Mini Boss Wakes Up

| Field | Value |
|-------|-------|
| Chapter | 08 |
| Arc | Arc 2 — Party Formation & Escalation |
| Manuscript | `CHAPTERS/Chapter-08-Mini-Boss-Wakes-Up.md` |
| Quest ID | `q_miniboss` |
| Zones | `forest-ruin-gate`, `sd7-upper` |
| Est. playtime | 25–30 min |
| Prerequisites | M07 |

## Narrative objective
First real boss pressure. Mechanics punish disunity. Haruto's leadership = coordination + emotional regulation.

## Gameplay objective
- Approach Sunshade Golem
- Phase 1: apply debuff (Veil)
- Phase 2: holy burst (Radiant)
- Defeat golem without party separation penalty

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S0801 | combat | Approach |
| S0802 | boss | Sunshade Golem dual phase |
| S0803 | dialogue | Leadership beat |

## Start state
Detour complete or skipped.

## End state
Golem defeated; Level 2 threshold reached.

## Fail states
Phase fail → enrage; wipe → respawn.

## Characters
Full party, Sunshade Golem

## Key objects
`debuff_vial`, `holy_burst_flask`

## Bond / faction deltas
+2 bond all if no jealousy spike during boss.

## Rewards & unlocks
- Mini-boss loot
- Level 2
- Unlock M09

## Reactivity flags
`sunshade_defeated`

## Branch hooks
Brute force path possible but slower (tutorial lie).

## Implementation notes
- Enemy ID: `miniBoss` in lumora.json
- `storyBeats.miniBoss`
