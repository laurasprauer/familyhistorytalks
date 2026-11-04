# CLAUDE.md — Family History Talks

Genealogy site: biographies (people), surname pages, and an archive of PDF documents ("Assets") with full-text search. Same stack and conventions as `../RunWithNicole` (use it as the reference project). Setup, env vars and the editor workflow are in `README.md`.

## Stack

- **Next.js 16, Pages Router, plain JS**, React 19, SCSS Modules + `classnames`, static export (`output: "export"` in production) → `out/` → Netlify.
- **Sanity** (Studio in `studio/`, host `familyhistorytalks`). Content is pulled into JSON **at build time**; nothing fetches Sanity in the browser.
- **Cloudflare R2** bucket `familyhistorytalks-resources` holds the archive PDFs at `<sid>/<file>.pdf`. A Worker (`cloudflare/worker/`, `familyhistorytalks-files.familyhistorytalks.workers.dev`) serves it read-only with Range support. DNS stays at Namecheap, so R2 custom domains aren't available — Netlify proxies `/resources/*` to the Worker instead (`generateNetlifyFiles.cjs`).
- **Netlify Function** `netlify/functions/r2-upload-url.mjs`: signs R2 PUT URLs for the Studio's upload field after checking the caller's Sanity token (`/users/me`, editor-level role).
- Secrets never use `NEXT_PUBLIC_`.

## Data flow

1. `generateSlugs.cjs` → `public/static-slugs.json` (sitemap)
2. `generatePageData.cjs` → `public/static-page-data.json` `{ people, surnames, surnameList }` (live docs only). GROQ lives here.
3. `generateSearchIndex.cjs` → `public/search-index.json` (assets + live people, incl. transcripts / `pt::text(body)`)
4. Pages in `src/pages/` read the JSON via `@utils/readStaticData.js` in `getStaticProps`.

All generated files are git-ignored. `filesUrl.cjs` decides PDF URLs: `/resources` on Netlify, the Worker URL locally.

## Sanity schema (`studio/schemaTypes/`)

- `person` — `isLive` = has a page; relatives with `isLive: false` only appear in family trees. `assets[]` order = footnote numbers.
- `surname`, `tag`
- `archiveAsset` (shown as **Assets**) — `file {sid, key, fileName, size, contentType}` set by `studio/components/R2FileInput.jsx`; `transcript` is what search indexes. Named `archiveAsset` to avoid clashing with Sanity's own asset types.
- `blockContent` — bios: blocks (h2–h4, blockquote, lists), `figure` (image + caption + maxWidth), `highlightBox`, `warningBox`, inline `assetCitation` (`asset` ref + optional `detail` → renders `[n detail]`). `simpleBlockContent` for captions/boxes.
- Studio uses `auth.loginMethod: 'token'` so the upload field can read the editor's token. Don't switch it back to cookies or uploads will fail with "no token".

## Components

`src/app/components/<name>/component.js` + `styles.module.scss`, PropTypes, default params (not `defaultProps`), `"use client"` when using hooks. Key ones:

- `layout` — head/SEO, skip link, header, content column. Every page wraps in it.
- `richText` — `<PortableText>` renderer; citation numbers come from `citationNumbers` (context) mapping asset `_id` → n; a citation links to `#<asset _id>` in the person sidebar.
- `person` — bio + family tree (`@utils/buildFamilyTree.js`) + numbered Resources list.
- `search` — MiniSearch over `search-index.json`; state mirrored to `?q=&type=&from=&to=`.

Styles keep the original site's look: colors in `styles/variables/_color.scss` (use `var(--color-*)` / `color-alpha()`, never hex in components), Roboto + Roboto Slab via `next/font` in `_app.js`, `rich-text` mixin in `mixins/_typography.scss`. Pixel values were kept from the original design.

## Migration (done)

`scripts/migrate-from-contentful/` converted Contentful + the old S3 `data.json` files to Sanity (deterministic ids `asset-<sid>`, `person-<contentfulId>`…). Kept for reference; re-running `import` with `--replace` would overwrite edits made in Sanity since.
