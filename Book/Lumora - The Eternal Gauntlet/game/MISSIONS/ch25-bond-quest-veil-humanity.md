# Mission M25_BOND_VEIL — Bond Quest: Veil (Humanity)

| Field | Value |
|-------|-------|
| Chapter | 25 |
| Arc | Arc 4 — Politics & Bond Quests |
| Manuscript | `CHAPTERS/Chapter-25-Bond-Quest-Veil-Humanity.md` |
| Quest ID | — |
| Zones | `veil-crypts` (civilian quarter) |
| Est. playtime | 25 min |
| Prerequisites | M22 |

## Narrative objective
Haruto sees Veil civilians. Ecto's sincerity defuses hatred. Bridging is moral, not tactical.

## Gameplay objective
- Explore civilian quarter
- Escort Ecto social scene
- Dialogue with Veil civilians
- Moral choice: defend civilians (canon)

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S2501 | explore | Civilian quarter |
| S2502 | dialogue | Ecto sincerity |

## Start state
M22 complete.

## End state
Veil civilian trust; Ecto bond max tease.

## Fail states
Ignore civilians → Veil rep -20.

## Characters
Ecto, Haruto, Veil civilians, Bone Commander

## Key objects
— 

## Bond / faction deltas
`bond_ecto` +30; Veil rep +25.

## Rewards & unlocks
- Veil civilian trust flag
- Ecto hug assist (comedy CC)

## Reactivity flags
`veil_humanity_seen`

## Branch hooks
Affects M31 Bone Commander sync dialog.

## Implementation notes
- Low combat; exploration focus
