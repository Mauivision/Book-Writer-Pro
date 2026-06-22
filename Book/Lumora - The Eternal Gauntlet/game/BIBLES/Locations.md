# Locations Bible — Volume 1

Zone IDs align with `lumora-gauntlet-3d/data/lumora.json` where applicable.

---

## Hub zones

| Zone ID | Display name | Book anchor | Missions | Notes |
|---------|--------------|-------------|----------|-------|
| `castle-lumora` | Castle Lumora | Arc 1 | M01–M02, M19 | Grand Radiant Hall, Council chambers |
| `golden-tankard` | The Golden Tankard | M18+ | M18, M21, M33 | Mira's tavern; gossip, buffs |
| `veil-crypts` | Veil Crypts | Arc 1 break-in | M02, M20, M25 | Barracks, Ghost Arcade, fog gardens |

---

## Overworld / travel

| Zone ID | Display name | Missions | Notes |
|---------|--------------|----------|-------|
| `starting-meadow` | Verdant Leak Meadow | M01, M03 | Tutorial airlock; cyan flecks in grass |
| `travel-road-sd7` | Road to Sky Dungeon #7 | M03 | Escort, banter, skirmish |
| `hub-city` | Lumora Undercity | M03 | Below dungeon; city state controller |

---

## Sky Dungeon #7 stack

| Layer | Zone ID | Missions | Puzzle/combat focus |
|-------|---------|----------|---------------------|
| Entrance | `sd7-entrance` | M04, M11 | Light bridges, shadow anchors |
| Tutorial floor | `sd7-tutorial` | M04, M05 | Tile rules, Sunny traps |
| Upper | `sd7-upper` | M07–M10 | Detour, mini-boss |
| Mid | `sd7-mid` | M11–M13 | Co-op gates, rivalry rooms |
| Deep | `sd7-deep` | M14–M16 | Sunny box, mirror trial |
| Fringe | `forest-ruin-gate` | M03, M08 | Forest Ruin Gate, Sunshade Golem |
| Boss antechamber | `sd7-warden` | M08 (alt), M17 | Sky Warden approach |

---

## Special instances

| Zone ID | Display name | Missions | Type |
|---------|--------------|----------|------|
| `verdant-interrupt` | Verdant Interrupt Corridor | M17 | Story corridor, Elara intro |
| `mirror-trial` | Unity Trial Chamber | M16 | Puzzle instance |
| `bond-seraphina` | Training Grounds | M23 | Bond instance |
| `bond-luminara` | Solar Spire Study | M24 | Bond instance |
| `bond-veil` | Veil Civilian Quarter | M25 | Bond instance |
| `town-dungeon` | Lumora Town (dungeon mode) | M26 | Overworld combat |
| `raid-arena` | Correction Warden Arena | M29–M32 | World boss raid |

---

## Location features by zone

### Castle Lumora
- **Grand Radiant Hall** — summoning M01–M02
- **Council chambers** — hearing M19
- **Velvet's chapel** — healing M22

### Golden Tankard
- Bar, rooms, gossip board
- Celebration scene M18
- Raid prep supply M29

### Veil Crypts
- Bone Legion barracks
- Ghost Arcade (Kairo)
- Contract table M20
- Civilian quarter M25

### Sky Dungeon #7
- Adaptive tilework
- Anti-teamwork rooms M12
- Audit tiles (codex)
- Glass bridge aesthetic at forest-ruin-gate

---

## Zone transition rules

| From | To | Requirement |
|------|-----|-------------|
| starting-meadow | forest-ruin-gate | M03 complete |
| forest-ruin-gate | sd7-entrance | M06 keys |
| sd7-* | golden-tankard | M18 victory |
| any hub | raid-arena | M28 world boss spawn |

---

## Safe zones vs danger

| Zone | Safe until… |
|------|-------------|
| golden-tankard | M26 (town becomes dungeon) |
| castle-lumora | M26 partial |
| veil-crypts | M26 partial |
| starting-meadow | Never fully safe (scouts) |

---

## Art / atmosphere notes

| Faction zone | Lighting | Audio |
|--------------|----------|-------|
| Radiant | Gold daylight | Choir, marble echo |
| Veil | Violet twilight, neon | Arcade bass, fog |
| Verdant leak | Cyan flecks in green | Wind, crystal hum |
| Sky Dungeon | Glass, rotating light/shadow | Wind claws, tile clicks |
| Raid arena | Red correction pulse | System warnings |
