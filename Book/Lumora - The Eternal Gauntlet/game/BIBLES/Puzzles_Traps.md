# Puzzles & Traps Bible — Volume 1

Dungeon language established M04; escalates through adaptive retaliation M12+.

---

## Puzzle types

| Type | ID prefix | Intro mission | Description |
|------|-----------|---------------|-------------|
| Tile rule | `tile_` | M04 | Step on correct tiles; wrong = trap |
| Co-op gate | `gate_` | M06, M11 | Two faction inputs simultaneous |
| Light/shadow lock | `lock_` | M04, M11 | Radiant bridge + Veil anchor |
| Bond door | `bond_` | M16 | Opens at min bond aggregate |
| Mirror trial | `mirror_` | M16 | Copies weakest bond; no separation |
| Build puzzle | `build_` | M01+ | Gauntlet Build verb places object |
| Gossip puzzle | `gossip_` | M21 | Spread/contradict rumors |
| Morale puzzle | `morale_` | M30 | Keep party morale synchronized |

---

## Trap types

| Type | ID | Trigger | Effect | Mission |
|------|-----|---------|--------|---------|
| Tutorial lie | `trap_sunny_tip` | Follow Sunny bad advice | Spawn adds / damage | M05, M14 |
| Posturing punish | `trap_posture` | Solo hero pose emote | Tile collapse | M04 |
| Group hug hazard | `trap_hug` | Ecto hug in combat zone | Party stuck, adds spawn | M07 |
| Chandelier | `trap_chandelier` | Chiller collateral | Area damage + comedy | M02, M07 |
| Jealousy spike | `trap_jealousy` | Romance flag during fight | Elite spawn | M13 |
| Separation punish | `trap_split` | Party &gt;10m apart | Mirror damage | M16 |
| Anti-teamwork | `trap_anti_coop` | Unity buff active | Room resets harder | M12 |
| Saboteur trap | `trap_sabotage` | Hardliner NPC | Raid debuff | M29 |

---

## Co-op gate specification (M11 template)

**Object:** `gate_coop_sd7_01`

| Input A | Input B | Hold time | Fail |
|---------|---------|-----------|------|
| Radiant seal (Seraphina interact) | Veil curse-key (Bone Commander interact) | 3 sec | Gate shocks, jealousy +3 |

**UI:** System announces "CO-OP OR DIE" — comedy tone, real fail state.

---

## Mirror trial specification (M16)

**Zone:** `mirror-trial`

1. Party enters; mirrors show bond scores (hidden from player until scan)
2. Weakest bond character copied → `mirror_copy` fights party
3. **Separation punish:** if copies and originals &gt;15m, pulse damage
4. **Win:** Defeat copy without separation &gt;5 sec cumulative
5. **Reward:** `cyan_tab` unlock, codex fragment

---

## Tile rule kit (M04 tutorial)

| Tile | Visual | Effect |
|------|--------|--------|
| Safe | White | Pass |
| Audit | Cyan fleck | Log for codex |
| Lie | Gold (looks safe) | Trap if Sunny recommended |
| Unity | Requires 2+ party on simultaneously | Opens door |

---

## Sunny trap chain (M05, M14)

```
Sunny suggests tile A → tile A is lie
Player ignores → correct path
Player follows → trap_sunny_tip + Sunny trust -
```

**M15 resolution:** `sunny_box` placed in `sunny_box_slot` — traps from Sunny disabled; dungeon aggro +1.

---

## Adaptive dungeon retaliation (M12+)

When `unity` &gt; threshold:
- Next room rolls `trap_anti_coop`
- Spawn tables swap to anti-synergy enemies
- "Helpful" UI tips increase lie frequency

---

## Raid phase puzzles (M30–M32)

| Phase | Puzzle element |
|-------|----------------|
| P1 | Morale bar — keep above 0 via dialogue choices + positioning |
| P2 | Sync QTE — Seraphina + Bone Commander declaration timing |
| P3 | Unity Override — hold co-op inputs all party members 5 sec |

---

## Difficulty scaling

| Variable | Puzzle effect |
|----------|---------------|
| jealousy | Shorter QTE windows, more lie tiles |
| unity | Stronger anti-coop retaliation |
| sunny_contained | Fewer lie tiles; dungeon compensates with adds |
| bond_min | Mirror copy HP scales down with higher bonds |

---

## Puzzle asset checklist

- [ ] Tile set (safe, lie, audit, unity)
- [ ] Co-op gate prefab (dual interact)
- [ ] Mirror room prefab + copy AI
- [ ] Sunny tip overlay widget
- [ ] Morale bar UI (raid)
- [ ] Gossip board UI (M21)
