# Mission M19_RADIANT_HEARING — Radiant Hearing (Anomaly)

| Field | Value |
|-------|-------|
| Chapter | 19 |
| Arc | Arc 4 — Politics & Bond Quests |
| Manuscript | `CHAPTERS/Chapter-19-Radiant-Hearing-Anomaly.md` |
| Quest ID | — |
| Zones | `castle-lumora` |
| Est. playtime | 20 min |
| Prerequisites | M18 |

## Narrative objective
Council labels Haruto threat/tool. Seraphina over-defends. Haruto refuses hero ownership publicly.

## Gameplay objective
- Attend hearing at council chambers
- Dialogue choices (refuse ownership = canon)
- Seraphina defense scene
- Rep consequences

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S1901 | dialogue | Hearing |
| S1902 | dialogue | Refusal |

## Start state
M18 complete; Radiant rep ≥ 25.

## End state
`refused_radiant_ownership` public; rep shift.

## Fail states
Submit to ownership → alternate branch (non-canon warning).

## Characters
Council (Aurex, Halvion, Solenne), Seraphina, Haruto

## Key objects
`hearing_podium`

## Bond / faction deltas
Seraphina bond +15 or jealousy +10; Radiant rep ±15.

## Rewards & unlocks
- Council story branch
- Unlock M20

## Reactivity flags
`refused_radiant_ownership` (public)

## Branch hooks
Accept ownership → locked out of Unity Override (fail state).

## Implementation notes
- Beta start; narrative-heavy
