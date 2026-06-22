# Mission M06_VEIL_KEY — The Veil Key Problem

| Field | Value |
|-------|-------|
| Chapter | 06 |
| Arc | Arc 1 — The Summoning |
| Manuscript | `CHAPTERS/Chapter-06-The-Veil-Key-Problem.md` |
| Quest ID | — |
| Zones | `sd7-upper` |
| Est. playtime | 25 min |
| Prerequisites | M05 |

## Narrative objective
Radiant + Veil cooperation mandatory. Keys are political leverage. Haruto refuses faction ownership as rule.

## Gameplay objective
- Obtain Radiant seal (Seraphina puzzle)
- Obtain Veil curse-key (Bone Commander puzzle)
- Dialogue: refuse ownership (S0603)
- Clear first co-op gate (dual interact)

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S0601 | puzzle | Radiant seal |
| S0602 | puzzle | Veil curse-key |
| S0603 | dialogue | Ownership refusal |
| S0604 | puzzle | Co-op gate |

## Start state
sd7-upper accessible.

## End state
`veil_key_pair` in party inventory; co-op system unlocked.

## Fail states
Co-op gate shock if not dual-held 3 sec.

## Characters
Seraphina, Bone Commander, Haruto, factions

## Key objects
`radiant_seal`, `veil_curse_key`, `coop_gate`

## Bond / faction deltas
+1 Seraphina, +1 Bone Commander; set `party_holds_keys`.

## Rewards & unlocks
- Veil Key pair
- Co-op gate mechanic
- Unlock M07

## Reactivity flags
`refused_radiant_ownership`, `refused_veil_contract`, `party_holds_keys`

## Branch hooks
Dialogue choices reinforce third path.

## Implementation notes
- Dual interact gate prefab
- East path blocked until keys — vertical slice hook
