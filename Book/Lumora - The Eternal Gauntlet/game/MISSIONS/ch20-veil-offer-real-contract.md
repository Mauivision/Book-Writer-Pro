# Mission M20_VEIL_CONTRACT — Veil Offer (Real Contract)

| Field | Value |
|-------|-------|
| Chapter | 20 |
| Arc | Arc 4 — Politics & Bond Quests |
| Manuscript | `CHAPTERS/Chapter-20-Veil-Offer-Real-Contract.md` |
| Quest ID | — |
| Zones | `veil-crypts` |
| Est. playtime | 20 min |
| Prerequisites | M19 |

## Narrative objective
Veil pitches freedom as contract. Bone Commander tests boundaries. Third option: alliance without chains.

## Gameplay objective
- Nyx + Bone Commander contract scene
- Read contract UI
- Refuse / negotiate third path
- Set non-submission alliance flag

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S2001 | dialogue | Contract offer |
| S2002 | dialogue | Third path |

## Start state
M19 complete.

## End state
Veil alliance (non-submission); `refused_veil_contract` reinforced.

## Fail states
Sign contract → bad branch.

## Characters
Nyx, Bone Commander, Haruto

## Key objects
`contract_table`

## Bond / faction deltas
Veil rep +20; `bond_bone` +10.

## Rewards & unlocks
- Veil alliance flag
- Unlock M21

## Reactivity flags
`veil_alliance_no_chains`

## Branch hooks
Contract text easter eggs (Umbrax clauses).

## Implementation notes
- Mirrors M10 thematically
