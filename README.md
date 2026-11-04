# Family History Talks

Genealogy website: family biographies, surname pages, and a searchable archive of historical documents (census records, certificates, family bibles…).

- **Site:** Next.js 16 (static export) → Netlify — https://familyhistorytalks.com
- **Content:** Sanity — Studio at https://familyhistorytalks.sanity.studio (code in `studio/`)
- **Archive PDFs:** Cloudflare R2 bucket `familyhistorytalks-resources`, served by a Cloudflare Worker (`cloudflare/worker/`) at `familyhistorytalks.com/resources/<id>/<file>.pdf`
- **Search:** in the browser, from `search-index.json` built at deploy time — no search server

## Adding content (Sanity Studio)

Publishing anything in the Studio rebuilds the site automatically (takes a couple of minutes). The **Deploy** tab shows build status and can start a rebuild by hand.

**A new archive document (PDF)**
1. **Assets → +** (new). Fill in title, start/end year, description and the transcript (the typed-out text — this is what search looks through).
2. **PDF → Upload PDF.** The file goes straight to Cloudflare R2.
3. Publish.
4. To show it on a biography: open the person, add it to their **Assets** list, and cite it in the biography with **Insert → Cite asset** (shows as a numbered footnote, e.g. `[3]`; the optional *Detail* field turns it into `[3 - P29]`).

**A new person**
- **People → +**. Turn on **Has a page** to give them a biography page; leave it off for relatives who only appear in family trees.
- Family trees are built from **Father**, **Mother** and **Children**.

**A new surname page**
- **Surnames → +**, turn on **Has a page**. People are listed on it automatically by their Surname field.

## Local development

Node 22.13.1 (`nvm use`).

```bash
npm install        # also installs studio/
cp .env.example .env   # fill in values (see below)
node on-deploy.mjs     # writes studio/.env from .env
npm run dev        # site → http://localhost:3000 (pulls Sanity data first)
npm run studio     # Studio → http://localhost:3333
npm run build      # static export → out/
npm run lint
```

## Environment variables

`.env` (root) holds local values; `studio/.env` is generated from it by `on-deploy.mjs`. Both are git-ignored. On Netlify, set them under **Site configuration → Environment variables**.

| Variable | Local | Netlify | Value / where to get it |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_STUDIO_PROJECT_ID` | ✓ | ✓ | sanity.io/manage → project → Project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | ✓ | ✓ | `production` |
| `SANITY_API_READ_TOKEN` | ✓ | ✓ | sanity.io/manage → API → Tokens → **Viewer** |
| `NEXT_PUBLIC_SITE_URL` | ✓ | ✓ | `http://localhost:3000` locally; `https://familyhistorytalks.com` on Netlify |
| `SANITY_AUTH_TOKEN` | – | ✓ | Tokens → **Deploy Studio** (the Netlify build redeploys the Studio) |
| `R2_ACCOUNT_ID` | ✓ | ✓ | Cloudflare dashboard → R2 → Account ID |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | ✓ | ✓ | R2 → Manage API tokens → **Object Read & Write** on the bucket |
| `R2_BUCKET` | ✓ | ✓ | `familyhistorytalks-resources` |
| `CLOUDFLARE_API_TOKEN` | optional | – | Only to redeploy the Worker (`cd cloudflare/worker && npx wrangler deploy`) |
| `SANITY_API_WRITE_TOKEN` | optional | – | Editor token, for scripted content edits (and `scripts/migrate-from-contentful`) |

## Netlify setup (one time)

Already done for familyhistorytalks.com — kept here in case the site is ever re-created.

1. **Add new site → Import from Git** → this repo. Build command, publish folder (`out`) and functions folder all come from `netlify.toml`; leave the UI fields as they are.
2. Add the env vars from the **Netlify** column above, then deploy. Only the ones in that column — the Cloudflare API token and the Sanity write token stay local.
3. **Domains:** `familyhistorytalks.com` (DNS at Namecheap). The old `resources.familyhistorytalks.com` subdomain is retired.
4. **Auto-rebuild on publish:** Netlify → Site configuration → Build & deploy → **Build hooks** → add "Sanity publish", copy the URL. sanity.io/manage → API → **Webhooks** → add it (dataset `production`, trigger on create/update/delete).
5. **Studio Deploy tab:** open the Studio → **Deploy** → add the site (title, Netlify Site ID, site name, the build hook URL, a Netlify personal access token).

Build gotchas:
- Netlify's **secrets scan** fails the build if a "secret" env var's value appears in the repo. The site URL, dataset and bucket name are public config, so `netlify.toml` lists them in `SECRETS_SCAN_OMIT_KEYS` — don't mark them secret-only to work around it, and don't add real secrets there.
- If a build fails in an `@netlify/plugin-gatsby` step, the old Gatsby plugin has come back on the site: set `NETLIFY_SKIP_GATSBY_BUILD_PLUGIN=true`.

## How it fits together

```
Studio "Upload PDF" ─POST─▶ /api/r2-upload-url (netlify/functions) ─▶ signed URL
                    ─PUT PDF──────────────────────────────────────▶ R2 bucket
Sanity publish ─webhook─▶ Netlify build:
  generateSlugs → generatePageData → generateSearchIndex → sitemap → _redirects → next build → out/
Visitor ─▶ /resources/<id>/<file>.pdf ─Netlify rewrite─▶ Cloudflare Worker ─▶ R2
```

- The upload function only signs uploads for logged-in editors of the Sanity project (it checks the editor's Studio token with Sanity).
- Uploads keep the `<id>/<file>.pdf` layout: a new Asset gets a new id folder (`Date.now()`), replacing the PDF reuses the Asset's folder. Only the PDF is stored — the metadata lives in Sanity.
- Removing or replacing a PDF in the Studio doesn't delete the old file from R2 — clean up in the Cloudflare dashboard if needed.

## History

Until November 2026 the site was Gatsby + Contentful, with PDFs and per-document `data.json` files in AWS S3/CloudFront and a (broken) search API on AWS. Everything moved to Sanity + R2 (see `scripts/migrate-from-contentful/`), the `data.json` files were deleted, and all AWS resources were shut down. Contentful is no longer used.
