# Mission M01_LOADING — Loading Screen

| Field | Value |
|-------|-------|
| Chapter | 01 |
| Arc | Arc 1 — The Summoning |
| Manuscript | `CHAPTERS/Chapter-01-Loading-Screen.md` |
| Quest ID | `q_awaken` |
| Zones | `starting-meadow`, `castle-lumora` |
| Est. playtime | 15–20 min |
| Prerequisites | None (new game) |

## Narrative objective
Establish isekai framing, Truck-kun comedy, and Eternal Player status. System UI becomes the world's voice. Starter party window foreshadows social-combat.

## Gameplay objective
- Watch/play summon cutscene (S0101–S0102)
- Interact with loading UI (poke the rectangle)
- Complete Grand Radiant Hall intro dialog (S0103–S0104)
- Wake in Verdant Leak Meadow; Crystal Gauntlet binds (S0105)

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S0101 | cutscene | Earth street, truck telegraph |
| S0102 | cutscene | Void, System welcome |
| S0103 | dialogue | Grand Radiant Hall, Seraphina intro |
| S0104 | dialogue | Romance flag accident |
| S0105 | hub | Meadow wake, gauntlet bind |

## Start state
New game. No flags, level 1, empty inventory.

## End state
`crystal_gauntlet` bound; `quest_log` active; M02 available.

## Fail states
N/A (on-rails tutorial).

## Characters
Haruto, System, Seraphina, Luminara, Velvet (tease)

## Key objects
`crystal_gauntlet`, `quest_log`, loading UI

## Bond / faction deltas
None.

## Rewards & unlocks
- Crystal Gauntlet (Build/Destroy/Move verbs teased)
- Quest log
- Unlock M02

## Reactivity flags
None set.

## Branch hooks
Dialogue tone choices (deadpan vs panicked) — cosmetic only.

## Implementation notes
- Godot: `storyBeats.intro` from `lumora.json`
- Scene: `scenes/story/ch01_summoning.tscn`
- First harvest tutorial deferred to M02/M03
