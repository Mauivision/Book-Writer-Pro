# The Fabric — 11 Labs (ElevenLabs) Audio Read

Use this folder for producing the **audiobook / text-to-speech** version of *The Fabric* with **ElevenLabs** (11 Labs).

---

## Where the files are

### PDF for production (print/ebook)

| What | Location |
|------|----------|
| **Print-ready PDF** | `Book/pdfs for print/The_Fabric_Print_Ready.pdf` |

Regenerate with:  
`npm run sync-production`  
or:  
`node scripts/generate-book-pdf.js "The Fabric" "Book/Soul Engine/CHAPTERS" "Aaron Writer" "The Fabric" "The_Fabric_Print_Ready.pdf"`

---

### 11 Labs audio — files to send / use in 11 Labs

| What | Location |
|------|----------|
| **Plain-text chapters (ready to paste into ElevenLabs)** | **`Book/Soul Engine/AUDIO_11LABS/chapters/`** |

That folder contains one `.txt` file per chapter (e.g. `Chapter-00-Prologue.txt`, `Chapter-01-Echoes-of-the-Veil.txt`, …).  
Use these with ElevenLabs:

1. Open [ElevenLabs](https://elevenlabs.io) (or your 11 Labs project).
2. For each chapter, open the corresponding `.txt` file from `AUDIO_11LABS/chapters/`.
3. Copy the text and paste into 11 Labs.
4. Choose voice and settings, then generate and download audio.

**Source markdown (if you prefer to edit before exporting):**  
`Book/Soul Engine/CHAPTERS/` — same content as the `.txt` files but in Markdown.

---

## Regenerating the 11 Labs text files

If you edit chapters in `CHAPTERS/`, regenerate the plain-text exports:

```bash
node scripts/export-audio-chapters.js "Book/Soul Engine"
```

New `.txt` files will be written to `Book/Soul Engine/AUDIO_11LABS/chapters/`.

---

## Quick reference

- **Production PDF:** `Book/pdfs for print/The_Fabric_Print_Ready.pdf`
- **11 Labs chapter text:** `Book/Soul Engine/AUDIO_11LABS/chapters/*.txt`
- **Original chapters:** `Book/Soul Engine/CHAPTERS/*.md`

For more on free audiobook production (including ElevenLabs), see  
`Book/Production/Audio_Book_Production/FREE_PRODUCTION_GUIDE.md`.
