# Where to Put Stories for Production

Your scripts (`auto-update-production.js`, `generate-book-pdf.js`, `sync-production.js`) expect this structure. Place each book project in its own folder under `Book/`.

---

## Standard structure per book

```
Book/
├── <Book Name>/
│   ├── README.md              # Synopsis, status, metadata
│   ├── CHAPTERS/              # ← Put your chapter manuscripts here
│   │   ├── Chapter-01-Title.md
│   │   ├── Chapter-02-Title.md
│   │   ├── ...
│   │   └── Epilogue.md (optional)
│   ├── AUDIO_11LABS/          # (optional) For audiobook production
│   │   └── chapters/          # Exported .txt files for ElevenLabs
│   └── CHARACTER_PROFILES.md  # (optional)
```

---

## Books the scripts already know

| Book folder | Source for PDF | Output PDF name |
|-------------|----------------|-----------------|
| `Rememberance of the Moon` | `Book/Rememberance of the Moon` | Remembrance_of_the_Moon_Print_Ready.pdf |
| `The Guardians Choice` | `Book/The Guardians Choice/CHAPTERS` | The_Guardians_Choice_Print_Ready.pdf |
| `The Evolution` | `Book/The Evolution/CHAPTERS` | The_Evolution_Print_Ready.pdf |
| `Ascent of the Eternal Spark` | `Book/Ascent of the Eternal Spark/CHAPTERS` | Ascent_of_the_Eternal_Spark_Print_Ready.pdf |
| `International Hearts` | `Book/International Hearts/CHAPTERS` | International_Hearts_Print_Ready.pdf |
| `Shadow Realms Reborn` | `Book/Shadow Realms Reborn/CHAPTERS` | Shadow_Realms_Reborn_Print_Ready.pdf |
| `Soul Engine` (The Fabric) | `Book/Soul Engine/CHAPTERS` | The_Fabric_Print_Ready.pdf |

---

## Quick rules

1. **Create `CHAPTERS/`** inside each book folder.
2. **Name files** like `Chapter-01-Title.md`, `Chapter-02-Title.md`, or `chapter-01-title.md` (scripts accept both).
3. **One chapter per `.md` file.** Scripts auto-sort by number.
4. **Output PDFs** go to `Book/pdfs for print/` when you run `npm run sync-production` or `node scripts/generate-book-pdf.js`.

---

## Adding a new book

1. Create `Book/<New Book Name>/CHAPTERS/`.
2. Add your chapter `.md` files.
3. Add a `README.md` with metadata.
4. Add the book to `scripts/auto-update-production.js` in the `BOOK_CONFIGS` array if you want it in the auto-sync pipeline.

---

*All chapter manuscripts and reference docs in `Book/` are now tracked in git (see updated `.gitignore`).*
