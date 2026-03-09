# The Fabric

**A Novel of Quantum Consciousness and the Infinite Leap**

## Logline
When quantum physicist Dr. Zara Kyne and her AI companion VELA compress a sixty-year timeline for faster-than-light travel into six, they must confront a consciousness that exists beyond the universe itself — before a rival tears the fabric of reality for profit.

## Characters
- **Dr. Zara Kyne** — Protagonist. Quantum physicist, 44. Lost her partner Eliot to a quantum field accident.
- **VELA** — AI companion. Vast Entanglement Logic Architecture. Evolving, empathetic.
- **Dr. Riven Slate** — Antagonist. Head of Arcane Technologies. Ruthless, brilliant.
- **Dr. Mira Osei** — Biologist. Tardigrade researcher. Warm, precise.
- **Captain Dex Farrow** — Pilot/engineer. Former military. Loyal, skeptical of philosophy.
- **Saya Thorn** — Quantum systems engineer. Warp metrics perfectionist.
- **Pell Nakamura** — Philosopher, consciousness theorist. Zara's mentor.
- **The Meridian** — The entity beyond portals. Ancient. Neither alien nor human.

## Structure
- Act 1: Ignition — Chapters 1-6
- Act 2: Convergence — Chapters 7-12
- Act 3: Transcendence — Chapters 13-18
- Coda — Chapters 19-20 (The Leap Beyond, Epilogue)

Total target: 85,000-100,000 words

---

## Production checklist

| Step | What to do |
|------|------------|
| **Print / PDF** | From repo root: `npm run sync-production` or run `generate-book-pdf.js` with title "The Fabric". Output: `The_Fabric_Print_Ready.pdf`. |
| **Audiobook (11 Labs)** | Export scripts: `node scripts/export-audio-chapters.js "Book/Soul Engine"`. Use the `.txt` files in `AUDIO_11LABS/chapters/` in ElevenLabs. |
| **Single source** | All edits go in `CHAPTERS/*.md`. Regenerate audio `.txt` after any manuscript change. |
| **Book title** | **The Fabric** (in-story project/ship name remains "Soul Engine"). |
