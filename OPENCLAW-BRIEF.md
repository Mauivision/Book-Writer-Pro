# OpenClaw — BookWriter Pro / Lumora session brief

**Updated:** 2026-06-22  
**Repo:** `C:\Users\hawai\.cursor\Agency agents\content\bookwriter-pro`  
**Branch:** `2026-03-24-eqd2` (pushed; base `main`)  
**OpenClaw workspace:** `C:\Users\hawai\.openclaw\workspace` (see `CURSOR_PROJECTS.md`)

---

## Active lane: Lumora — The Eternal Gauntlet

Manuscript + game design pack live under:

`Book/Lumora - The Eternal Gauntlet/`

| Area | Path |
|------|------|
| Chapters (Vol 1) | `CHAPTERS/Chapter-*.md` |
| Crystal Gauntlet codex | `SIDE_STORIES/Crystal-Gauntlet-Lore/` |
| Game hub | `game/README.md` |
| Missions ch01–35 | `game/MISSIONS/ch*.md` |
| Planar Shift protocol | `game/PROTOCOLS/Architecture-Spec-Planar-Shift.md` |
| **Ship target (3D Godot)** | `C:\Users\hawai\.cursor\Agency agents\products\lumora-gauntlet-3d` |
| Story contract | `products/lumora-gauntlet-3d/STORY_PROGRESSION.md` |
| Godot copy (in book tree) | `lumora-gauntlet-3d/` |
| Canon JSON | `products/lumora-game-data/lumora.json` → `lumora-gauntlet-3d/data/lumora.json` |
| 2D reference only | `products/retro-gauntlet` (mechanics prototype; not ship target) |

**Launch 3D:** `C:\Users\hawai\START-LUMORA-3D.cmd` (Godot 4.3+ on `products/lumora-gauntlet-3d/project.godot`)

---

## Recent git (bookwriter-pro)

- `e0f3f70` — Lumora mission specs ch16–35 + `game/README.md`
- `c9f035d` — Full Lumora tree: manuscript, codex, protocols, Godot sources

Do **not** commit `.godot/` cache or `.hermes/desktop-attachments/` videos.

---

## Priority next actions (3D ship lane)

1. **`sky-dungeon-threshold` scene** — JSON + exits exist; no `scenes/sky_dungeon_threshold.tscn` yet. Port beats from 2D: Sunny traps, cyan seam (Planar Shift), Radiant Seal (`veilKeyTease`).
2. **Planar Shift in Godot** — Implement per `game/PROTOCOLS/Architecture-Spec-Planar-Shift.md` (`StoryDirector` + zone layer toggle).
3. **Forest gate east routing** — Wire east exit to threshold (south/east already splits to `verdant-interrupt` in JSON).
4. **MASTER_PLAN refresh** — Mark missions ch01–35 done; note 3D as sole ship engine.
5. **Canon sync** — Keep `lumora-game-data/lumora.json` and `data/lumora.json` aligned after beat/quest adds.

---

## Constraints

- Local-first; no secrets in git (Discord token, gateway token, API keys).
- OpenClaw edits **files on disk**; Cursor is the editor viewing the same paths.
- Prefer read/search before destructive writes outside `Book/Lumora - The Eternal Gauntlet/`.
- `products/retro-gauntlet` is **not** in bookwriter-pro git — coordinate via disk paths or parent monorepo if added later.

---

## Verify (bookwriter-pro)

```powershell
cd "C:\Users\hawai\.cursor\Agency agents\content\bookwriter-pro"
npm run hermes:verify
```

## Verify (3D)

```powershell
powershell -File "C:\Users\hawai\hermes-home-base\scripts\verify-lumora-vs1.ps1" -Smoke -WriteReport
# Or open Godot → F5 on meadow.tscn
```

---

## Discord templates (mention bot if `requireMention: true`)

**Status:**

```text
@<bot> status check for Lumora lane.
Read OPENCLAW-BRIEF.md in bookwriter-pro.
Return: git branch, last commit, retro-gauntlet type-check, openclaw channels status.
```

**Work order:**

```text
@<bot>
Repo: C:\Users\hawai\.cursor\Agency agents\products\lumora-gauntlet-3d
Design: C:\Users\hawai\.cursor\Agency agents\content\bookwriter-pro\Book\Lumora - The Eternal Gauntlet\game\

Goal: Build sky-dungeon-threshold.tscn + Planar Shift v0 per Architecture-Spec-Planar-Shift.md

Constraints:
- Follow STORY_PROGRESSION.md + story_triggers.json patterns
- Load canon from data/lumora.json
- Run verify-lumora-vs1.ps1 -Smoke before handoff
```

---

## Related docs

- Hermes routing: `HERMES-BRIEF.md`
- Studio OpenClaw setup: `platform/openclaw-command-center/docs/DISCORD_OPENCLAW_WINDOWS_SETUP.md`
- Operator sheet: `docs/studio/agents-and-openclaw/DISCORD_OPENCLAW_CURSOR_OPERATOR.md`
