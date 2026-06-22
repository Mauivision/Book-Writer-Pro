# Mission M07_SHADOW_DETOUR — Shadow Detour: Group Hug Hazard

| Field | Value |
|-------|-------|
| Chapter | 07 |
| Arc | Arc 2 — Party Formation & Escalation |
| Manuscript | `CHAPTERS/Chapter-07-Shadow-Detour-Group-Hug-Hazard.md` |
| Quest ID | — |
| Zones | `sd7-upper` (Veil route) |
| Est. playtime | 20 min |
| Prerequisites | M06 |

## Narrative objective
Veil side route showcases Ecto sincerity. Comedy builds trust. Bond events are advantages and liabilities.

## Gameplay objective
- Take Veil detour branch
- Navigate group-hug hazard room (Ecto stuck)
- Clear shade lurkers
- Exit with Ecto bond event

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S0701 | explore | Veil detour |
| S0702 | puzzle | Group hug hazard |
| S0703 | dialogue | Ecto sincerity |

## Start state
M06 complete; sd7-upper.

## End state
Ecto bond +1; bond event system explained.

## Fail states
Hug trap wipe; Chiller collateral optional comedy.

## Characters
Ecto, Chiller, Bone Commander, Haruto

## Key objects
`trap_hug`

## Bond / faction deltas
`bond_ecto` +10; Veil rep +5.

## Rewards & unlocks
- Bond event system tutorial
- Unlock M08

## Reactivity flags
`ecto_hug_trap` if triggered.

## Branch hooks
Skip detour — miss Ecto bond boost.

## Implementation notes
- Optional route from sd7-upper fork
