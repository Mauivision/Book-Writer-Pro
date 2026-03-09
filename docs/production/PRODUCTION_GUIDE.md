# Production Guide

Complete reference for the book production system: PDF generation, automation, and tools.

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run sync-production` | Regenerate PDFs for modified books only |
| `npm run update-pdfs` | Same as sync-production |
| `npm run watch-production` | Continuously watch for changes and regenerate |

---

## How It Works

1. **Detects changes** – Compares file timestamps with last known state  
2. **Prepares content** – Cleans screenplay formatting if needed (e.g. Shadow Realms Reborn)  
3. **Generates PDFs** – Creates print-ready PDFs for modified books  
4. **Updates docs** – Refreshes story build files and dashboard  

Only modified books are regenerated to save time.

---

## Scripts

| Script | Purpose |
|--------|---------|
| `auto-update-production.js` | Main automation: incremental updates, status tracking |
| `sync-production.js` | Thin wrapper around auto-update-production |
| `generate-book-pdf.js` | Single-book PDF generator (called by auto-update) |
| `prepare-book-for-pdf.js` | Cleans screenplay formatting before PDF |
| `production-dashboard.js` | Generates HTML dashboard |
| `quick-production.js` | One-off full run, auto-detects books |
| `batch-generate-pdfs.js` | Legacy batch script (uses generate-print-pdf) |
| `generate-print-pdf.js` | Legacy single-book PDF (older implementation) |
| `check-pacing.js` | Analyzes chapters for pacing issues |
| `generate-epub.js` | EPUB generation |

---

## Single Book PDF (manual)

```bash
node scripts/generate-book-pdf.js "Book Title" "path/to/chapters" "Author" "Series" "output.pdf"
```

Example:

```bash
node scripts/generate-book-pdf.js "Remembrance of the Moon" "Book/Rememberance of the Moon" "Aaron Writer" "The Heartline Chronicles - Book 1" "Remembrance_of_the_Moon_Print_Ready.pdf"
```

---

## Supported Books (configured in auto-update-production.js)

- Remembrance of the Moon  
- The Guardians Choice  
- The Evolution  
- International Hearts  
- Ascent of the Eternal Spark  
- Shadow Realms Reborn  

---

## Output Location

- **PDFs**: `Book/pdfs for print/`
- **Prepared files**: `Book/pdfs for print/prepared/`
- **Dashboard**: `Book/pdfs for print/dashboard.html`
- **Status**: `Book/pdfs for print/production-status.json`

---

## Git Hook (optional)

Add a `post-commit` hook to run sync automatically after each commit:

```bash
# .git/hooks/post-commit
node scripts/auto-update-production.js
```

---

_See [PRODUCTION_INDEX.md](./PRODUCTION_INDEX.md) for document index._
