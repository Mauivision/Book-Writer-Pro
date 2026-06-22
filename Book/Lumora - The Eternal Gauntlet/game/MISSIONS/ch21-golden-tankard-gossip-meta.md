# Mission M21_GOSSIP_META — Golden Tankard Gossip Meta

| Field | Value |
|-------|-------|
| Chapter | 21 |
| Arc | Arc 4 — Politics & Bond Quests |
| Manuscript | `CHAPTERS/Chapter-21-Golden-Tankard-Gossip-Meta.md` |
| Quest ID | — |
| Zones | `golden-tankard` |
| Est. playtime | 20 min |
| Prerequisites | M20 |

## Narrative objective
Mira weaponizes rumors. Jealousy becomes strategy. Comedy tools = political tools. NPCs bet openly.

## Gameplay objective
- Gossip board minigame (spread/contradict rumors)
- Shift 3 NPC attitude meters favorably
- Optional: buy `jealousy_dampener`
- Unlock betting NPC dialog tease

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S2101 | hub | Gossip minigame |
| S2102 | dialogue | Betting tease |

## Start state
M20 complete; bound relic visible.

## End state
Gossip network active; NPC prices shifted.

## Fail states
Fail minigame → retry; jealousy +5.

## Characters
Mira, Haruto, tavern NPCs

## Key objects
`gossip_board`, `jealousy_dampener`

## Bond / faction deltas
Mira bond +15; jealousy -10 if dampener used.

## Rewards & unlocks
- Gossip network mechanic
- Jealousy dampener shop stock
- Unlock M22

## Reactivity flags
`gossip_network_active`

## Branch hooks
Rumor choices affect M26 town mood.

## Implementation notes
- Light social minigame UI
