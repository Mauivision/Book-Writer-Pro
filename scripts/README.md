# Scripts

Automation and tooling for the Book Writer project.

---

## Production Scripts (PDFs, EPUB, Dashboard)

| Script | Purpose | When to use |
|--------|---------|-------------|
| **auto-update-production.js** | Main automation: detects changes, regenerates only modified books | Primary workflow – run after editing chapters |
| **sync-production.js** | Wrapper for auto-update | Same as above – `npm run sync-production` |
| **generate-book-pdf.js** | Generate a single print-ready PDF | Called by auto-update; use manually for one-off books |
| **prepare-book-for-pdf.js** | Clean screenplay formatting (stage directions, etc.) | Called by auto-update for books like Shadow Realms Reborn |
| **quick-production.js** | One-off full PDF generation, auto-detects books | Alternative to auto-update when you want a full run |
| **production-dashboard.js** | Generate HTML dashboard of PDFs | Called by auto-update; run manually to refresh dashboard |
| **batch-generate-pdfs.js** | Legacy batch PDF (uses generate-print-pdf) | Deprecated – prefer sync-production / auto-update |
| **generate-print-pdf.js** | Legacy single-book PDF | Deprecated – use generate-book-pdf.js |
| **generate-epub.js** | Generate EPUB ebooks | Run manually for EPUB output |
| **check-pacing.js** | Analyze chapters for pacing issues (long sentences, etc.) | Run manually for editorial review |

---

## NPM Scripts (package.json)

```bash
npm run sync-production   # = node scripts/auto-update-production.js
npm run update-pdfs      # = same
npm run watch-production # = auto-update with --watch (continuous)
```

---

## Recommended Workflow

1. Edit chapters in `Book/[Title]/CHAPTERS/`
2. Run `npm run sync-production`
3. PDFs and docs are updated in `Book/pdfs for print/`

---

## Development Scripts

| Script | Purpose |
|--------|---------|
| **migrate-imports.js** | Migrate import paths (e.g. after refactoring) |

---

_See [docs/production/PRODUCTION_GUIDE.md](../docs/production/PRODUCTION_GUIDE.md) for full documentation._
