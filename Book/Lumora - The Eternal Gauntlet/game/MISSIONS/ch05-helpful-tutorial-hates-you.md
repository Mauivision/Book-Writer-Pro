# Mission M05_SUNNY_HATES — The Helpful Tutorial That Hates You

| Field | Value |
|-------|-------|
| Chapter | 05 |
| Arc | Arc 1 — The Summoning |
| Manuscript | `CHAPTERS/Chapter-05-The-Helpful-Tutorial-That-Hates-You.md` |
| Quest ID | — |
| Zones | `sd7-tutorial` |
| Est. playtime | 20 min |
| Prerequisites | M04 |

## Narrative objective
Sunny's "help" is petty and weaponized. Comedy equals danger. Haruto resists tutorial framing.

## Gameplay objective
- Sunny overlay appears with tips
- Player chooses follow vs ignore advice
- Survive trap escalation (S0502–S0503)
- Complete floor despite Sunny (S0504)

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S0501 | dialogue | Sunny introduced |
| S0502 | puzzle | Bad advice trap |
| S0503 | combat | Trap wave adds |
| S0504 | dialogue | Resist framing |

## Start state
M04 complete; Sunny not yet registered.

## End state
Sunny entity active; debuff immunity (1 use) granted.

## Fail states
Trap wave wipe; following all tips = harder but completable.

## Characters
Sunny, Haruto, Party

## Key objects
Sunny overlay, `trap_sunny_tip`

## Bond / faction deltas
None.

## Rewards & unlocks
- Sunny system (antagonist helper)
- Debuff immunity ×1
- Unlock M06

## Reactivity flags
`sunny_tips_followed` count.

## Branch hooks
Ignore Sunny = correct path; follow = comedy suffering.

## Implementation notes
- **P1 system:** SunnyControl node
- `storyBeats.firstHit` optional on first damage
- Vertical slice milestone
