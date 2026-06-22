# Lumora game links (BookWriter Pro)

This book is the **canon source** for the playable Lumora games. When you change lore here, update the game layer next.

## Recommended: Retro Gauntlet

Standalone action RPG (Vite + Phaser):

- **Launcher:** `C:\Users\hawai\START-RETRO-GAUNTLET.cmd`
- **Dev URL:** http://127.0.0.1:5174
- **Project:** `C:\Users\hawai\.cursor\Agency agents\products\retro-gauntlet\`
- **Sync doc:** `products/retro-gauntlet/LUMORA-SOURCE.md`

### What the game reads from this folder

| Manuscript file | Game use |
|-----------------|----------|
| `SERIES_BIBLE.md` | System voice, factions, Patch Notes |
| `VOLUME_1_OUTLINE.md` | Quest arc, level band 1–5 |
| `CHARACTER_PROFILES.md` | Story beat speakers |
| `CHAPTERS/Chapter-17-Verdant-Interrupt.md` | Verdant Leak zone framing |
| `game/lumora-gauntlet.js` | Loading quips, patch notes, quest text |
| `game/lumora-adventure-content.js` | Verdant Leak scene tags |
| `game/PROTOCOLS/Architecture-Spec-Planar-Shift.md` | Planar Shift GDD protocol (engine implementation spec) |

Game copy lives in `retro-gauntlet/src/game/story/lumoraLore.ts` — edit there after manuscript changes, or regenerate from book notes.

## BookWriter Pro hub

With BookWriter running on port **3003**:

- Sidebar → **Lumora game**
- Or http://127.0.0.1:3003/gauntlet-rpg

The hub links to Retro Gauntlet and lists HTML prototypes below.

## HTML prototypes (this folder)

Open in a browser from the repo (double-click or drag into Chrome):

| File | Description |
|------|-------------|
| `game/index.html` | Sky Dungeon #7 narrative slice |
| `game/tarot-rpg.html` | Tarot story RPG |
| `game/adventure.html` | Autoplay pick-a-card adventure |
| `game/cards.html` | Patch Duel cards |

## Workflow: write → play → sync

1. Draft or revise in `CHAPTERS/` or bible docs.
2. Note new beats/mechanics in `VOLUME_1_OUTLINE.md` if they affect gameplay.
3. Port copy into `retro-gauntlet/src/game/story/lumoraLore.ts`.
4. Wire triggers in `retro-gauntlet/src/game/GauntletScene.ts` if needed.
5. Play-test via `START-RETRO-GAUNTLET.cmd`.
