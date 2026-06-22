# Characters Bible — Volume 1

Gameplay roles, bond variables, and scene requirements for mission/scene authoring.

---

## Playable / Party core

| ID | Name | Faction | Combat role | Bond var | Unlock mission |
|----|------|---------|-------------|----------|----------------|
| `haruto` | Haruto Takahashi | Neutral (Eternal Player) | Leader, melee, Gauntlet verbs | N/A | M01 |
| `seraphina` | Seraphina | Radiant | Tank, holy burst | `bond_seraphina` | M02 |
| `luminara` | Luminara | Radiant | AoE magic, debuff cleanse | `bond_luminara` | M02 |
| `bone_commander` | Bone Legion Commander | Veil | Commander buffs, tactics | `bond_bone` | M02 |
| `chiller` | Chiller Executioner | Veil | Burst DPS, collateral | `bond_chiller` | M02 |
| `ecto` | Ectoplasm Elemental | Veil | Utility, hug-blob CC | `bond_ecto` | M02 |
| `elara` | Elara Sylvandrel | Verdant | Stabilizer, cyan resonance | `bond_elara` | M17 |

**Party size (active followers):** 3 max in combat; full roster available in hubs.

---

## Hub & support NPCs

| ID | Name | Role | Hub | Gameplay function |
|----|------|------|-----|-------------------|
| `mira` | Lady Mirabelle "Mira" Heartflame | Tavern mistress | Golden Tankard | Gossip, buffs, recovery items, M21 minigame |
| `velvet` | High Priestess Velvet Dawn | Cleric | Castle Lumora, Tankard | Healing, M22 checkup, raid triage M29 |
| `silk` | Silk, Traveling Merchant | Merchant | Any zone | Rare items, shady disclaimers |
| `glyph` | Glyph, Cartographer | Cartographer | Travel nodes | Map data for secrets |
| `black_market_saint` | Black-Market Saint | Contraband | Veil Crypts | Holy contraband, cursed bargains |
| `odo` | Gravetender Odo | Shrine keeper | Veil Crypts | Respawn anchor, underworld rules |

---

## Radiant Council (political friction)

| ID | Name | Attitude to Haruto | Scene use |
|----|------|-------------------|-----------|
| `aurex` | Chancellor Aurex Valebright | Asset-minded | M19 hearing |
| `halvion` | Arch-Justicar Halvion | Hardliner "anomaly" | M19, M29 sabotage |
| `solenne` | Dame Solenne Skyward | Results over doctrine | M29 rally ally |
| `mirtha` | Treasurer Mirtha Giltveil | Favors for upgrades | Hub upgrades |
| `ysilde` | Oracle-Registrar Ysilde | Notices rollbacks | M27 warning echo |

---

## Veil leadership

| ID | Name | Role | Scene use |
|----|------|------|-----------|
| `nyx` | Syndic Madame Nyx Marrowveil | Negotiator | M20 contract |
| `ticker` | Hexwright "Ticker" Vonn | Curse-tech | Veil hub, shortcuts |
| `kairo` | Mist-DJ Kairo Lux | Info broker | Ghost Arcade gossip |

---

## System entities

| ID | Name | Type | Behavior |
|----|------|------|----------|
| `system` | The System | UI narrator | Quest updates, loading, warnings |
| `sunny` | Sunny (Tutorial Entity) | Antagonist helper | Misleading tips M05–M15; contained M15+; erratic M27+ |
| `patch_herald` | Patch Herald | Announcer | Patch notes, level-ups |
| `luminos` | Luminos | Twin god (light) | Post-credits M35 |
| `umbrax` | Umbrax | Twin god (shadow) | Post-credits M35 |

---

## Bond system (per character)

| Bond tier | Threshold | Unlocks |
|-----------|-----------|---------|
| 0 Stranger | 0 | Base dialogue |
| 1 Acquaintance | 10 | Assist in combat |
| 2 Ally | 25 | Co-op combo hint |
| 3 Trusted | 50 | Bond quest available |
| 4 Bonded | 75 | Raid synergy bonus |
| 5 Max (Volume 1 cap) | 100 | Epilogue scene M33 |

**Bond gain sources:** mission completion, correct dialogue choices, bond quests, avoiding jealousy spikes during their scenes.

---

## Jealousy triggers (by character)

| Character | Triggers jealousy when… |
|-----------|-------------------------|
| Seraphina | Velvet/Mira flirting scenes, Luminara tutoring alone |
| Luminara | Seraphina defense scenes, Elara proximity post-M17 |
| Mira | Any bond quest completion without visiting Tankard |
| Velvet | M22 skipped, other healers used |
| Veil trio | Radiant-only missions without Veil rep balance |
| Elara | "Quiet competent" scenes; System weaponizes M17+ |

---

## Voice / dialog tags (implementation)

```
speaker: Haruto | System | Sunny | Seraphina | Luminara | Bone Commander | ...
tone: deadpan | dramatic | teasing | sincere | panicked_ui
bond_check: bond_seraphina >= 25
flag_check: sunny_contained == true
```

---

## Character scene requirements (by arc)

| Arc | Required cast per mission |
|-----|---------------------------|
| 1 | Haruto, System, Seraphina, Luminara, Mira, Velvet, Veil trio |
| 2 | + Bone Commander focus, Ecto |
| 3 | Full party, Sunny, Elara M17 |
| 4 | Council, Mira, Velvet, bond quest leads |
| 5 | Full raid roster + hardliner saboteurs |
