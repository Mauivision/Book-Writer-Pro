# Scene List — Volume 1 (Master Index)

Maps every mission to scenes. Scene IDs use format `S{mission}{seq}` (e.g. `S0101` = Mission 01, scene 01).

**Scene types:** `cutscene` | `dialogue` | `explore` | `combat` | `puzzle` | `hub` | `boss`

---

## Arc 1 — The Summoning

### M01 — Loading Screen (`S01xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S0101 | cutscene | Earth street | Haruto | truck (off-screen) | Truck-kun telegraph |
| S0102 | cutscene | void | Haruto, System | loading UI | Summon sequence |
| S0103 | dialogue | Grand Radiant Hall | Haruto, System, Seraphina | quest_log | Eternal Player welcome |
| S0104 | dialogue | Grand Radiant Hall | Haruto, Seraphina, Luminara | romance_flag_popup | Hero intro undercut |
| S0105 | hub | starting-meadow | Haruto, Velvet (tease) | crystal_gauntlet | Wake in meadow; gauntlet bind |

### M02 — Starter Party Selection (`S02xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S0201 | dialogue | castle-lumora | Haruto, System | starter_party_window | Choose party UI |
| S0202 | dialogue | castle-lumora | Seraphina, Luminara, factions | — | Factions claim asset |
| S0203 | dialogue | golden-tankard | Mira, Haruto | recovery_potion | Mira crash |
| S0204 | dialogue | castle-lumora | Velvet, Seraphina, Luminara | — | Healing scandal |
| S0205 | combat | castle-lumora | Veil trio, Radiant | chandelier | Veil break-in |
| S0206 | dialogue | All | Full cast | quest_log | Quest: Clear Sky Dungeon #7 |

### M03 — Walk to Sky Dungeon 7 (`S03xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S0301 | explore | travel-road-sd7 | Party | — | Travel banter |
| S0302 | dialogue | travel-road-sd7 | Mixed party | — | Faction friction |
| S0303 | combat | travel-road-sd7 | Party, scouts | — | Optional skirmish |
| S0304 | dialogue | travel-road-sd7 | Haruto | — | Party functions despite UI |

### M04 — Tutorial Dungeon Liar (`S04xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S0401 | explore | sd7-tutorial | Party | tile_set | Enter tutorial floor |
| S0402 | puzzle | sd7-tutorial | Haruto | tile_lie, tile_safe | Tile rules |
| S0403 | combat | sd7-tutorial | Party, constructs | — | First dungeon fight |
| S0404 | puzzle | sd7-tutorial | Party | unity_tile | Unity rewards |

### M05 — Sunny Hates You (`S05xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S0501 | dialogue | sd7-tutorial | Sunny, Haruto | sunny overlay | Sunny introduced |
| S0502 | puzzle | sd7-tutorial | Haruto | trap_sunny_tip | Bad advice trap |
| S0503 | combat | sd7-tutorial | Party | — | Escalation from trap |
| S0504 | dialogue | sd7-tutorial | Haruto | — | Resist tutorial framing |

### M06 — Veil Key Problem (`S06xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S0601 | puzzle | sd7-upper | Seraphina, Bone Commander | radiant_seal | Obtain seal |
| S0602 | puzzle | sd7-upper | Bone Commander | veil_curse_key | Obtain key |
| S0603 | dialogue | sd7-upper | Haruto, factions | veil_key_pair | Refuse ownership |
| S0604 | puzzle | sd7-upper | Party | coop_gate | Co-op door tutorial |

---

## Arc 2 — Party Formation

### M07 — Shadow Detour (`S07xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S0701 | explore | sd7-upper (veil route) | Ecto, Chiller | — | Veil detour |
| S0702 | puzzle | sd7-upper | Ecto, Party | trap_hug | Group hug hazard |
| S0703 | dialogue | sd7-upper | Ecto, Haruto | — | Sincerity builds trust |

### M08 — Mini Boss (`S08xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S0801 | combat | forest-ruin-gate | Party | — | Approach golem |
| S0802 | boss | forest-ruin-gate | Party, Sunshade Golem | debuff_vial, holy_burst | Dual phase |
| S0803 | dialogue | forest-ruin-gate | Haruto | — | Leadership emerges |

### M09 — Loot Binds (`S09xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S0901 | dialogue | sd7-upper | Party, System | bound gear | Loot binds |
| S0902 | hub | sd7-upper | Party | jealousy_hud | Jealousy math shown |
| S0903 | dialogue | sd7-upper | Haruto | — | Responsibility not ownership |

### M10 — Commander Collects (`S10xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S1001 | dialogue | sd7-upper | Bone Commander, Haruto | contract_table | Contract pressure |
| S1002 | dialogue | sd7-upper | Haruto | — | Refuse submission |
| S1003 | combat | sd7-upper | Party | — | Commander test fight |

---

## Arc 3 — Sky Dungeon Deep

### M11 — Co-op Gate (`S11xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S1101 | puzzle | sd7-mid | Seraphina, Bone Commander | gate_coop_sd7_01 | First real co-op gate |
| S1102 | dialogue | sd7-mid | Party | — | Trust systems not vibes |

### M12 — Hates Teamwork (`S12xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S1201 | combat | sd7-mid | Party, elites | trap_anti_coop | Retaliation room |
| S1202 | dialogue | sd7-mid | Haruto | unity tracker | Adaptive dungeon reveal |

### M13 — Rivalry Mechanic (`S13xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S1301 | combat | sd7-mid | Party, jealousy_spawn | rivalry UI | Jealousy aggro |
| S1302 | dialogue | sd7-mid | Haruto | — | Lead social layer |

### M14 — Sunny Trap (`S14xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S1401 | puzzle | sd7-deep | Sunny, Party | trap_sunny_tip | Sunny triggers trap |
| S1402 | combat | sd7-deep | Party | — | Trap wave |
| S1403 | dialogue | Party | — | Adversarial UI consensus |

### M15 — Box Sunny (`S15xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S1501 | puzzle | sd7-deep | Party | sunny_box, sunny_box_slot | Contain Sunny |
| S1502 | combat | sd7-deep | Party | — | Dungeon reacts |
| S1503 | dialogue | Haruto, System | — | Lost control lever |

### M16 — Mirror Trial (`S16xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S1601 | puzzle | mirror-trial | Party | mirror_pedestal | Enter trial |
| S1602 | boss | mirror-trial | Party, mirror_copy | — | Weakest bond copy |
| S1603 | cutscene | mirror-trial | Party, System | cyan_tab | Cyan unlock |

### M17 — Verdant Interrupt (`S17xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S1701 | explore | verdant-interrupt | Haruto | — | Corridor approach |
| S1702 | dialogue | verdant-interrupt | Elara, Haruto | crystal_gauntlet | Framework reframe |
| S1703 | combat | verdant-interrupt | Party, correction_drone | — | Interrupt threat |
| S1704 | cutscene | verdant-interrupt | Elara | cyan_tab | Verdant route active |

### M18 — Golden Tankard (`S18xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S1801 | hub | golden-tankard | Full party, Mira | — | Victory celebration |
| S1802 | dialogue | golden-tankard | Party | bound_relic | Relic binds |
| S1803 | dialogue | golden-tankard | Elara, Haruto | — | Measured warning |

---

## Arc 4 — Politics & Bonds

### M19 — Radiant Hearing (`S19xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S1901 | dialogue | castle-lumora | Council, Haruto, Seraphina | hearing_podium | Anomaly hearing |
| S1902 | dialogue | castle-lumora | Haruto | — | Refuse hero ownership |

### M20 — Veil Contract (`S20xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S2001 | dialogue | veil-crypts | Nyx, Bone Commander, Haruto | contract_table | Real contract |
| S2002 | dialogue | veil-crypts | Haruto | — | Alliance without chains |

### M21 — Gossip Meta (`S21xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S2101 | hub | golden-tankard | Mira, Haruto | gossip_board | Gossip minigame |
| S2102 | dialogue | golden-tankard | NPCs | — | Betting tease |

### M22 — Velvet Checkup (`S22xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S2201 | dialogue | castle-lumora | Velvet, Haruto | — | Intimate healing |
| S2202 | dialogue | castle-lumora | Haruto | — | Soft power reveal |

### M23 — Bond Seraphina (`S23xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S2301 | combat | bond-seraphina | Seraphina, Haruto | — | Training |
| S2302 | dialogue | bond-seraphina | Seraphina, Haruto | — | Replacement fear |

### M24 — Bond Luminara (`S24xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S2401 | puzzle | bond-luminara | Luminara, Haruto | — | Spell tutoring |
| S2402 | dialogue | bond-luminara | Luminara | patch_toast | Gods watching |

### M25 — Bond Veil (`S25xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S2501 | explore | veil-crypts (civilian) | Ecto, Haruto | — | Veil civilians |
| S2502 | dialogue | veil-crypts | Ecto, Haruto | — | Humanity bridge |

### M26 — Jealousy Peaks (`S26xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S2601 | combat | town-dungeon | Party, town_mob | — | Town difficulty spike |
| S2602 | dialogue | golden-tankard | Party | — | Safe zones fail |

### M27 — System Warning (`S27xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S2701 | cutscene | any hub | System, Sunny, Elara | patch_toast | Morale dangerous |
| S2702 | dialogue | castle-lumora | Elara, Haruto | — | World pushes back |

### M28 — Public Choice (`S28xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S2801 | dialogue | castle-lumora (public) | System, factions, Haruto | — | Pick a side |
| S2802 | cutscene | raid-arena | All | raid_portal | Refusal triggers raid |

---

## Arc 5 — World Boss Raid

### M29 — Raid Prep (`S29xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S2901 | hub | golden-tankard | Mira, Velvet, Seraphina | questionable_potion | Supplies |
| S2902 | dialogue | raid-arena | Party | — | Mixed party forced |
| S2903 | combat | raid-arena | hardliner_saboteur | trap_sabotage | Sabotage |

### M30 — Boss Phase 1 (`S30xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S3001 | boss | raid-arena | Party, Correction Warden | morale_bar | Disunity punished |
| S3002 | dialogue | raid-arena | Haruto | — | Tank morale |

### M31 — Boss Phase 2 (`S31xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S3101 | boss | raid-arena | Seraphina, Bone Commander | — | Declaration duel sync |
| S3102 | dialogue | raid-arena | Party | — | Rivalry overwrite |

### M32 — Boss Phase 3 (`S32xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S3201 | boss | raid-arena | Full party | unity_override_token | Unity Override |
| S3202 | cutscene | raid-arena | Haruto, System | cyan_tab | World marks deeper |

### M33 — Aftermath (`S33xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S3301 | hub | golden-tankard | Party | — | Quiet warmth |
| S3302 | dialogue | golden-tankard | Elara | — | Higher-tier warning |

### M34 — Loot Eternal (`S34xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S3401 | dialogue | any hub | Haruto, factions | bound_relic | Eternal hint |
| S3402 | cutscene | void UI | Sunny, System | — | Monitor slip |

### M35 — Patch Notes (`S35xx`)

| ID | Type | Location | Characters | Key objects | Beat |
|----|------|----------|------------|-------------|------|
| S3501 | cutscene | credits void | Luminos, Umbrax, Patch Herald | patch_toast | Post-credits |
| S3502 | dialogue | — | System | codex | Volume 2 hook |

---

## Scene count summary

| Arc | Missions | Scenes |
|-----|----------|--------|
| 1 | 6 | 28 |
| 2 | 4 | 14 |
| 3 | 8 | 24 |
| 4 | 10 | 22 |
| 5 | 7 | 14 |
| **Total** | **35** | **102** |

---

## Godot scene mapping (implementation)

| Scene ID prefix | Godot scene path (planned) |
|-----------------|----------------------------|
| S01xx | `scenes/story/ch01_summoning.tscn` |
| S04–S16 | `scenes/dungeon/sd7_*.tscn` |
| S17xx | `scenes/verdant_interrupt.tscn` |
| S18xx | `scenes/hub/golden_tankard.tscn` |
| S29–S32 | `scenes/raid/correction_warden.tscn` |

Cross-ref: `../lumora-gauntlet-3d/data/lumora.json` quest IDs `q_awaken` … `q_elara`
