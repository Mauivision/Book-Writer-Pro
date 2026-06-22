# Mission M11_COOP_GATE — The First Real Co-op Gate

| Field | Value |
|-------|-------|
| Chapter | 11 |
| Arc | Arc 3 — Sky Dungeon #7 Deep Run |
| Manuscript | `CHAPTERS/Chapter-11-The-First-Real-Co-op-Gate.md` |
| Quest ID | — |
| Zones | `sd7-mid` |
| Est. playtime | 20 min |
| Prerequisites | M10 |

## Narrative objective
Light+Veil synergy required. Puzzle language: co-op or die. Party trusts systems of each other.

## Gameplay objective
- Reach sd7-mid co-op gate
- Seraphina + Bone Commander dual interact 3 sec
- Clear post-gate combat room

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S1101 | puzzle | Co-op gate |
| S1102 | dialogue | Trust systems beat |

## Start state
sd7-mid unlocked.

## End state
Co-op gate cleared; synergy buff.

## Fail states
Gate shock; separation reset.

## Characters
Seraphina, Bone Commander, Party

## Key objects
`gate_coop_sd7_01`, `veil_key_pair`

## Bond / faction deltas
+1 Seraphina, +1 Bone; Unity +5.

## Rewards & unlocks
- Synergy buff (co-op damage +10%)
- Unlock M12

## Reactivity flags
`coop_gate_01_cleared`

## Branch hooks
None — skill check mission.

## Implementation notes
- Template for all co-op gates
