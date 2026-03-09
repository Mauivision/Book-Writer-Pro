#  Project Organization System

##  Purpose
Define and maintain a consistent structure for all assets in the Book Writer project so the team can locate, edit, and produce materials without friction.

---

##  Root Directory Rules
- Keep only runtime code, configuration, and core folders at the root (`src/`, `scripts/`, `Book/`, `docs/`, `public/`, etc.).
- Documentation, task files, frameworks, and guides must live under `docs/`.
- Generated assets belong in clearly marked output folders (`Book/pdfs for print/`, `PRODUCT_OUTPUT/`).
- No loose `.md`, `.mdc`, `.tsk`, or PDF files at the root.

### Required Root Items
```
/
 Book/
 docs/
 scripts/
 src/
 src_python/
 public/
 PRODUCT_OUTPUT/
 package.json
 tsconfig.json
 README.md
```

---

##  Documentation (`docs/`)
Organize written references by purpose:
```
docs/
 development/   # Engineering notes, TODOs, component map (COMPONENT_MAP.md)
 guides/        # User-facing guides and setup walkthroughs
 production/    # Production workflows (PRODUCTION_INDEX.md → PRODUCTION_GUIDE.md)
 project/       # Architecture, planning, organization systems (this doc)
 stories/       # Story samples, world-building references
 tasks/         # Task trackers, voice scripts, writing checklists
```

- **Production**: Start at `docs/production/PRODUCTION_INDEX.md`
- **Components**: See `docs/development/COMPONENT_MAP.md` for component usage

**Conventions**
- File names in SCREAMING_SNAKE_CASE (e.g., `PROJECT_COMPLETION_ROADMAP.md`).
- One topic per document; cross-link instead of duplicating content.
- When adding a new category, document it in this file first.

---

##  Books (`Book/`)
Every book folder follows the same blueprint:
```
Book/[Title]/
 README.md
 CHAPTERS/
 CHARACTER_PROFILES/
 OUTLINES/
 NOTES/ (optional)
 DRAFTS/
 MARKETING/
 PUBLICATION/
 RESEARCH/
 SCREENPLAY/ (if applicable)
 WORLD_BUILDING/
```

### Shared Book Assets
```
Book/
 DOCUMENTATION/   # Cross-book references, consistency systems
 TOOLS/           # Shared scripts and utilities
 Production/      # Shared production guides (audio, marketing, etc.)
 ARCHIVE/         # Deprecated or retired projects
 pdfs for print/  # Generated print assets (auto-managed)
```

### Naming Standards
- Book folders use Title Case (`Ascent of the Eternal Spark`).
- Chapter files use `Chapter-XX-Title.md` inside `CHAPTERS/`.
- Drafts and alternates live in `DRAFTS/` with subfolders (`first-draft/`, etc.).
- Screenshots or images go to an `Assets/` subfolder or `public/` if reused.

---

##  Scripts (`scripts/`)
- All automation and CLI utilities live here.
- Use kebab-case filenames (`generate-book-pdf.js`).
- Group related scripts with prefixes when helpful (`production-*`, `generate-*`).
- See `scripts/README.md` for script hierarchy and usage.
- Production workflow details: `docs/production/PRODUCTION_GUIDE.md`.

---

##  Output & Production Assets
- `Book/pdfs for print/` holds generated PDFs, dashboards, pacing reports.
- `PRODUCT_OUTPUT/` stores packaged deliverables (templates, marketing kits).
- Do not manually edit generated files; regenerate via scripts when content changes.

---

##  Maintenance Workflow
1. **Add New Material**
   - Choose the correct directory up front.
   - Create missing folders using the standard structure.
2. **Audit Monthly**
   - Run through each top-level folder and confirm compliance.
   - Relocate stray files immediately.
3. **Document Changes**
   - Update `README.md` files when folder scope changes.
   - Append notes in this doc for new rules.
4. **Automate Where Possible**
   - Extend scripts to respect this structure (e.g., auto-update PDFs looks for `CHAPTERS/`).

---

##  Quick Checklist
- [ ] Root is free of stray docs/tasks.
- [ ] Every book has the standard subfolders.
- [ ] All chapters live inside `CHAPTERS/` folders.
- [ ] Production scripts reside in `scripts/` only.
- [ ] Documentation stored under `docs/` by purpose.
- [ ] Generated outputs kept in dedicated output directories.

---

---

##  Related Documentation
- [Production Index](../production/PRODUCTION_INDEX.md) – production workflows
- [Component Map](../development/COMPONENT_MAP.md) – component usage and overlap
- [Scripts README](../../scripts/README.md) – script hierarchy

---

_Last updated: February 2026_
