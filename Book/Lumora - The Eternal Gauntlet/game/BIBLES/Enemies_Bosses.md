# Enemies & Bosses Bible — Volume 1

Stats reference `lumora-gauntlet-3d/data/lumora.json` for implemented enemies.

---

## Enemy tiers

| Tier | Role | Examples |
|------|------|----------|
| T0 Ambient | Zone flavor | Wisps, critters |
| T1 Scout | Tutorial combat | Sky Warden Scout |
| T2 Standard | Dungeon fodder | Veil shade, Radiant wisp |
| T3 Elite | Room clears | Jealousy-touched adds |
| T4 Mini-boss | Arc checkpoints | Sunshade Golem |
| T5 Major boss | Dungeon cap | Sky Warden #7 |
| T6 World boss | Volume finale | Correction Warden |

---

## Implemented (Godot JSON)

| ID | Label | HP | Speed | XP | Zone |
|----|-------|-----|-------|-----|------|
| `scout` | Sky Warden Scout | 14 | 62 | 18 | starting-meadow |
| `wisp` | Verdant Wisp | 10 | 88 | 14 | forest-ruin-gate |
| `miniBoss` | Sunshade Golem (mini) | 42 | 48 | 40 | forest-ruin-gate / sd7 |

---

## Volume 1 enemy roster (design)

| ID | Name | Faction flavor | Behavior | Mission |
|----|------|----------------|----------|---------|
| `sky_warden_scout` | Sky Warden Scout | Dungeon patrol | Chase, telegraph | M01, M03 |
| `verdant_wisp` | Verdant Wisp | Leak fauna | Fast, erratic | M04, forest-ruin |
| `shade_lurker` | Shade Lurker | Veil | Stealth, debuff | M07 |
| `light_construct` | Light Construct | Radiant | Shield ally | M04 |
| `jealousy_spawn` | Jealousy Spawn | System | Scales with jealousy meter | M13+ |
| `mirror_copy` | Mirror Copy | Dungeon | Attacks weakest bond target | M16 |
| `correction_drone` | Correction Drone | Verdant/Correction | Anti-synergy pulse | M17 |
| `town_mob` | Town Mob (absurd) | System | Comedy difficulty spike | M26 |
| `hardliner_saboteur` | Hardliner Saboteur | Radiant/Veil | Trap placement | M29 |
| `rollback_sentinel` | Rollback Sentinel | System | Volume 2 tease | M35 codex only |

---

## Mini-boss: Sunshade Golem

| Phase | Requirement | Player action |
|-------|-------------|---------------|
| 1 | Veil debuff active | Apply debuff vial / Chiller skill |
| 2 | Radiant burst window | Holy burst / Seraphina skill |

**Failure:** Golem enrages; jealousy +5  
**Mission:** M08  
**Zone:** forest-ruin-gate, sd7-upper

---

## Major boss: Sky Warden #7

| Mechanic | Description |
|----------|-------------|
| Morale scan | Adapts attack pattern to party jealousy |
| Unity punish | Bonus damage if party separated |
| Phase shift | At 50% HP, spawns jealousy adds |

**Mission:** M08 (intro), full fight optional extended in M12  
**Design note:** Foreshadows Correction Warden mechanics

---

## World boss: Correction Warden

**Book name:** World Boss Event — The Correction Warden (Phase Raid)  
**Level capstone:** Level 5 / Book 1 finale

### Phase 1 — Disunity Punished (M30)
- Targets lowest bond pair with split attack
- Jealousy literalized: hearts on HUD deal damage if overlapping
- **Win condition:** Keep morale above 0; Haruto "tanks morale"

### Phase 2 — Declaration Duel (M31)
- Requires Light + Veil synchronized attack
- Seraphina + Bone Commander combo QTE/dialogue sync
- **Fail:** Faction fracture debuff

### Phase 3 — Unity Override (M32)
- Haruto activates Party Leader Authority: Unity Override
- Cyan Gauntlet Overdrive; party acts as one
- **Reward:** bound relic upgrade, Level 5, Volume 1 complete

---

## Spawn rules (jealousy)

```
baseSpawn = roomDefault
if jealousy > 50: baseSpawn *= 1.5
if activeRomanceFlags >= 2: add jealousy_spawn x2
if unity > 70 && mission >= M12: dungeon retaliation room
```

---

## Death / respawn (enemies)

- Dungeon enemies respawn on re-entry (except bosses)
- Bosses flag `defeated` permanently per save
- World boss: single attempt until Phase clear checkpoint

---

## Loot tables (summary)

| Enemy | Common | Rare |
|-------|--------|------|
| Scout | fiber, stone | map fragment |
| Wisp | verdant_crystal shard | audit_tile |
| Sunshade Golem | bound gear candidate | debuff/holy consumables |
| Sky Warden | sky_warden_core | bound_relic precursor |
| Correction Warden | unity_override_token | eternal_gauntlet_codex |
