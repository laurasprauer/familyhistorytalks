// Step 4: check the imported Sanity dataset against the Contentful export.
//   - document counts match
//   - every reference resolves
//   - every asset's PDF exists in R2 (via the Worker)
//   - every old <span resource> became a citation, and cited assets are in the
//     person's Assets list (otherwise the footnote has no number)
//   - every image imported
import fs from "node:fs";
import { createClient } from "@sanity/client";

const FILES_URL = "https://familyhistorytalks-files.familyhistorytalks.workers.dev";
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_STUDIO_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
  perspective: "published",
});

const { entries } = JSON.parse(fs.readFileSync("data/contentful.json", "utf-8"));
const problems = [];

// Counts
const expected = { person: 0, surname: 0, archiveAsset: 0, tag: 0 };
for (const e of entries) {
  const t = e.sys.contentType.sys.id;
  expected[t === "resource" ? "archiveAsset" : t]++;
}
const actual = await client.fetch(`{
  "person": count(*[_type == "person"]),
  "surname": count(*[_type == "surname"]),
  "archiveAsset": count(*[_type == "archiveAsset"]),
  "tag": count(*[_type == "tag"])
}`);
for (const t of Object.keys(expected)) {
  const ok = expected[t] === actual[t];
  console.log(`${ok ? "✅" : "❌"} ${t}: ${actual[t]} (Contentful ${expected[t]})`);
  if (!ok) problems.push(`count mismatch for ${t}`);
}

// References
const allIds = new Set(await client.fetch(`*[!(_id in path("_.**"))]._id`));
const docs = await client.fetch(`*[_type in ["person", "surname", "archiveAsset", "tag"]]`);
const findRefs = (value, path, out) => {
  if (Array.isArray(value)) value.forEach((v, i) => findRefs(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object") {
    if (value._ref) out.push({ ref: value._ref, path });
    for (const [k, v] of Object.entries(value)) if (k !== "_ref") findRefs(v, `${path}.${k}`, out);
  }
  return out;
};
let refCount = 0;
for (const doc of docs) {
  for (const { ref, path } of findRefs(doc, doc._id, [])) {
    refCount++;
    if (!allIds.has(ref)) problems.push(`broken reference ${path} → ${ref}`);
  }
}
console.log(`✅ checked ${refCount} references`);

// Citations: same number as the old <span resource|record> markers, and cited
// assets are listed in the person's Assets
const oldMarkers = entries.reduce(
  (n, e) => n + (String(e.fields.body || "").match(/<span (?:resource|record)="/g) || []).length,
  0
);
const people = docs.filter((d) => d._type === "person");
let citations = 0;
for (const p of people) {
  const listed = new Set((p.assets || []).map((a) => a._ref));
  const cited = findRefs(p.body || [], "", []).filter((r) => r.ref.startsWith("asset-"));
  citations += cited.length;
  for (const { ref } of cited) {
    if (!listed.has(ref)) problems.push(`${p.slug.current}: cites ${ref} but it isn't in their Assets list`);
  }
}
const citationsOk = citations === oldMarkers;
console.log(`${citationsOk ? "✅" : "❌"} citations: ${citations} (old markers ${oldMarkers})`);
if (!citationsOk) problems.push("citation count mismatch");

// PDFs exist in R2
const assets = docs.filter((d) => d._type === "archiveAsset");
const missingPdf = [];
await Promise.all(
  assets.map(async (a) => {
    const res = await fetch(`${FILES_URL}/${a.file?.key}`, { method: "HEAD" });
    if (!res.ok) missingPdf.push(`${a._id} → ${a.file?.key} (${res.status})`);
  })
);
missingPdf.forEach((m) => problems.push(`missing PDF ${m}`));
console.log(`${missingPdf.length ? "❌" : "✅"} PDFs in R2: ${assets.length - missingPdf.length}/${assets.length}`);

// Images
const images = {
  portraits: people.filter((p) => p.profileImage?.asset).length,
  figures: docs
    .flatMap((d) => d.body || [])
    .filter((b) => b._type === "figure" && b.image?.asset).length,
};
const expectedPortraits = entries.filter((e) => e.fields.profileImage).length;
const expectedFigures = entries.reduce((n, e) => n + (String(e.fields.body || "").match(/<img /g) || []).length, 0);
const imagesOk = images.portraits === expectedPortraits && images.figures === expectedFigures;
console.log(
  `${imagesOk ? "✅" : "❌"} images: ${images.portraits} portraits (expected ${expectedPortraits}), ${images.figures} bio images (expected ${expectedFigures})`
);
if (!imagesOk) problems.push("image count mismatch");

if (problems.length) {
  console.log(`\n❌ ${problems.length} problem(s):`);
  problems.forEach((p) => console.log(`  - ${p}`));
  process.exit(1);
}
console.log("\n✅ Migration verified.");
