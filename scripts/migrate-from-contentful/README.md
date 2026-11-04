# Contentful → Sanity migration (one-off, already run)

Moved 53 people, 7 surnames, 1 tag and 37 archive documents from Contentful + the old S3 `data.json` files into Sanity, converting Markdown/HTML bios to Portable Text.

```bash
npm install
npm run export     # Contentful + R2 data.json → data/ (git-ignored)
npm run transform  # → data/migration.ndjson (prints any conversion warnings)
SANITY_AUTH_TOKEN=<editor token> npm run import   # sanity dataset import --replace
npm run verify     # counts, references, citations, PDFs in R2, images
```

⚠️ The `<sid>/data.json` files were deleted from R2 after the migration, so `export` can't be re-run.

⚠️ `import` uses `--replace`: re-running it overwrites any edits made in the Studio since to the same documents. Only re-run it before going live.

Conversion notes:
- `<span resource|record="sid">detail</span>` → inline `assetCitation` (+ `detail`, e.g. " - P29")
- `span.highlight` / `span.warning` → `highlightBox` / `warningBox`; `<img>` + following `span.caption` → `figure`
- Links to `resources.familyhistorytalks.com/…` → `/resources/…`
- "Novemeber" → "November"; stray spaces trimmed from years
- lydia-upchurch cited an asset missing from her resources list; it was appended so the footnote is numbered.
