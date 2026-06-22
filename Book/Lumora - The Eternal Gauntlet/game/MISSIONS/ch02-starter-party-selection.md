# Mission M02_PARTY_SELECT — Starter Party Selection

| Field | Value |
|-------|-------|
| Chapter | 02 |
| Arc | Arc 1 — The Summoning |
| Manuscript | `CHAPTERS/Chapter-02-Starter-Party-Selection.md` |
| Quest ID | — |
| Zones | `castle-lumora`, `golden-tankard` |
| Est. playtime | 20–25 min |
| Prerequisites | M01 |

## Narrative objective
Haruto boxed into "pick a party." Factions treat him as asset. Mira and Velvet crash the summoning. Veil breaks in for equal rights.

## Gameplay objective
- Open starter party selection UI
- Select active party (3 followers from roster)
- Survive Mira/Velvet intro scenes
- Win/ survive Veil break-in skirmish (S0205)
- Accept quest: Clear Sky Dungeon #7

## Scenes
| ID | Type | Summary |
|----|------|---------|
| S0201 | dialogue | Starter party window |
| S0202 | dialogue | Factions claim asset |
| S0203 | dialogue | Mira crash |
| S0204 | dialogue | Velvet scandal |
| S0205 | combat | Veil break-in |
| S0206 | dialogue | SD7 quest issued |

## Start state
M01 complete; meadow or castle hub.

## End state
Party roster locked; SD7 quest in log; jealousy meter visible.

## Fail states
Combat wipe → respawn at shrine; embarrassment debuff.

## Characters
Haruto, System, Seraphina, Luminara, Mira, Velvet, Bone Commander, Chiller, Ecto

## Key objects
`starter_party_window`, `romance_flag_popup`, `recovery_potion`

## Bond / faction deltas
+1 bond all selected starters; Radiant/Veil rep baseline set.

## Rewards & unlocks
- Full party roster
- Jealousy meter UI
- Unlock M03

## Reactivity flags
`party_comp` — affects banter lines M03+.

## Branch hooks
Which 3 followers selected — dialogue variants, not power gates.

## Implementation notes
- Auto-equip starter gear comedy beat
- Chandelier trap optional in S0205
