# Production Schedule — Lumora Volume 1 Game

Engine-agnostic design phases with Godot 4 implementation branch (`lumora-gauntlet-3d/`).

**Team assumption (solo/small):** 1 designer-writer + 1 programmer + part-time art  
**Last updated:** 2026-04-15

---

## Milestone overview

| Phase | Weeks | Goal | Exit criteria |
|-------|-------|------|---------------|
| A — Design lock | 1–2 | Full GAME/ doc pack | 35 mission specs, bibles, scene index |
| B — Vertical slice | 3–6 | 20–40 min playable | Arc 1 compressed in Godot |
| C — Alpha | 7–12 | Ch. 1–18 playable | ~3 hr content, save/load all Arc 1–3 zones |
| D — Beta | 13–18 | Ch. 19–35 coverage | Full Volume 1 mission flow |
| E — Polish / ship demo | 19–22 | Act 1 demo release | Steam-ready or itch demo |

---

## Phase A — Design lock (Weeks 1–2) ✓

| Week | Deliverable | Path | Status |
|------|-------------|------|--------|
| 1 | GDD, campaign progression | `GAME/GDD.md`, `CAMPAIGN_PROGRESSION.md` | Done |
| 1 | Bibles (6) | `GAME/BIBLES/*.md` | Done |
| 2 | Scene index | `GAME/SCENES/Scene_List_Volume1.md` | Done |
| 2 | Mission specs M01–M35 | `GAME/MISSIONS/ch*.md` | In progress |
| 2 | Schedule + checklists | `GAME/SCHEDULE/*.md` | Done |

---

## Phase B — Vertical slice (Weeks 3–6)

**Playable beats (Godot):**

1. Awakening in Verdant Meadow (M01)
2. Velvet + harvest quests (`q_awaken`, `q_gather`)
3. Scout combat (`q_scout`)
4. Forest Ruin Gate transition (`q_gate`)
5. Sunny wrong advice → trap (M05)
6. Veil Key tease / east path blocked (M06 hook)

| Week | Engineering | Content |
|------|-------------|---------|
| 3 | QuestManager singleton, JSON quests | Wire M01–M02 dialog |
| 4 | StoryDialog + PatchToast UI | Sunny overlay prototype |
| 5 | Sunshade Golem mini-boss | M04–M05 dungeon tiles |
| 6 | Title screen + save slots | Slice playtest pass |

**Exit:** New player completes slice in one session; quest IDs trace to mission docs.

---

## Phase C — Alpha (Weeks 7–12)

**Target:** Arc 1–3 (M01–M18)

| Week | Focus |
|------|-------|
| 7–8 | Sky Dungeon #7 zone stack (3–5 scenes) |
| 9 | Party followers (Seraphina, Luminara, Ecto) |
| 10 | Bond meter + jealousy aggro (M13) |
| 11 | Mirror trial room (M16), Elara corridor (M17) |
| 12 | Golden Tankard hub (M18), editorial dialog pass |

**Exit:** ~3 hours content; persistence across zones.

---

## Phase D — Beta (Weeks 13–18)

**Target:** Arc 4–5 (M19–M35)

| Week | Focus |
|------|-------|
| 13–14 | Hearing + contract scenes (M19–M20) |
| 15 | Bond quest instances (M23–M25) |
| 16 | Town dungeon mode (M26), System warning (M27) |
| 17 | Raid arena 3 phases (M29–M32) |
| 18 | Aftermath + post-credits (M33–M35) |

**Exit:** Full mission flow completable; narrative-interactive acceptable for low-combat missions.

---

## Phase E — Polish (Weeks 19–22)

- Balance pass (jealousy formula, boss HP)
- Bug bash, accessibility (text size, remappable keys)
- Windows export + `RUN_GAME.bat`
- Optional: link from BookWriter hub / `GAME-LINKS.md`

---

## Engine branches (choose one for Phase B+)

| Engine | Path | Best for | Add to schedule |
|--------|------|----------|-----------------|
| **Godot 4** (recommended) | `lumora-gauntlet-3d/` | Top-down 3D slice | +0 weeks (in progress) |
| Unity | New project | Asset Store pipeline | +2 weeks setup |
| Unreal | New project | High-fidelity | +4 weeks setup |
| Ren'Py / Twine | New project | VN-first Arc 4–5 | -4 weeks combat; +2 narrative tools |

---

## Staffing scenarios

| Team | Phase B duration | Phase D duration |
|------|------------------|------------------|
| Solo dev | 8 weeks | 12 weeks |
| 2 person | 4 weeks | 6 weeks |
| 4+ person | 3 weeks | 4 weeks |

---

## Risk register

| Risk | Mitigation |
|------|------------|
| Scope creep (35 chapters) | Ship Arc 1–3 first; Arc 4–5 narrative mode |
| Sunny UI complexity | Phase B prototype; defer advanced lies |
| Bond system overload | Start with jealousy only; add bonds Alpha |
| Book/game drift | Quest ID ↔ mission ID enforced in JSON |

---

## Sync points with manuscript

| Mission | Manuscript file |
|---------|-----------------|
| M01 | `CHAPTERS/Chapter-01-Loading-Screen.md` |
| M02 | `CHAPTERS/Chapter-02-Starter-Party-Selection.md` |
| … | `CHAPTERS/Chapter-{NN}-*.md` |
| M35 | `CHAPTERS/Chapter-35-Post-Credits-Patch-Notes-Volume-2-Hook.md` |

Weekly: diff dialog strings against manuscript during Alpha.

---

## Definition of done (Volume 1 demo)

- [ ] M01–M18 fully playable in engine
- [ ] M19–M35 completable (playable or interactive narrative)
- [ ] All `q_*` quest IDs in `lumora.json` map to missions
- [ ] Save/load: zone, quests, bond, jealousy, flags
- [ ] One world boss clear (M30–M32)
- [ ] Post-credits M35 triggers
