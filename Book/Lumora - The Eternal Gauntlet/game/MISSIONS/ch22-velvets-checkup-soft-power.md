# Mission M22_VELVET_CHECKUP — Velvet's Checkup (Soft Power)

| Field | Value |
|-------|-------|
| Chapter | 22 |
| Arc | Arc 4 — Politics & Bond Quests |
| Manuscript | `CHAPTERS/Chapter-22-Velvets-Checkup-Soft-Power.md` |
| Quest ID | — |
| Zones | `castle-lumora` |
| Est. playtime | 15 min |
| Prerequisites | M21 |

## Narrative objective
Intimate healing reveals Velvet's reach. Care has consequences. Support roles run the world.

## Gameplay objective
- Velvet healing scene (dialogue + buff)
- Choose boundaries dialog
- Receive healing upgrade
- Jealousy reaction from party (off-screen flags)

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S2201 | dialogue | Checkup |
| S2202 | dialogue | Soft power |

## Start state
M21 complete.

## End state
Velvet bond +1 tier; healing upgrade.

## Fail states
N/A.

## Characters
Velvet, Haruto, Seraphina (reaction)

## Key objects
Healing UI, Velvet charm

## Bond / faction deltas
`bond_velvet` +25; Seraphina jealousy +10.

## Rewards & unlocks
- Healing upgrade (+20% HP restore)
- Unlock M23, M24, M25 (bond quests)

## Reactivity flags
`velvet_checkup_done`

## Branch hooks
Boundary choices — Velvet bond tone.

## Implementation notes
- Gates bond quest trio
