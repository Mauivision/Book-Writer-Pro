# Mission M32_BOSS_P3 — World Boss Phase 3 (Unity Override)

| Field | Value |
|-------|-------|
| Chapter | 32 |
| Arc | Arc 5 — World Boss Raid |
| Manuscript | `CHAPTERS/Chapter-32-World-Boss-Phase-3-Unity-Override.md` |
| Quest ID | — |
| Zones | `raid-arena` |
| Est. playtime | 25 min |
| Prerequisites | M31 |

## Narrative objective
Haruto uses Party Leader Authority: Unity Override. Cyan route pulses. World marks him deeper.

## Gameplay objective
- Phase 3 at boss 33% HP
- All party members hold co-op input 5 sec
- Activate Unity Override (Gauntlet Overdrive)
- Defeat Correction Warden

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S3201 | boss | Phase 3 |
| S3202 | cutscene | World mark |

## Start state
Phase 2 clear; `refused_public_choice` required.

## End state
Boss defeated; Level 5; `unity_override_used`.

## Fail states
Override interrupted → phase reset.

## Characters
Full party, Haruto, Boss, System

## Key objects
`unity_override_token`, `crystal_gauntlet` Overdrive

## Bond / faction deltas
All bonds +20.

## Rewards & unlocks
- Unity Override ability
- Level 5 (Book 1 cap)
- Unlock M33

## Reactivity flags
`unity_override_used`, `correction_warden_defeated`

## Branch hooks
Requires canon path from M28.

## Implementation notes
- Volume 1 gameplay climax
- Cinematic Gauntlet VFX
