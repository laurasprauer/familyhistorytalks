// Step 1: download everything we need into data/ (git-ignored).
//   data/contentful.json — all published Contentful entries + assets
//   data/archive.json    — every <sid>/data.json from R2, plus the PDF's size
// Needs CONTENTFUL_ACCESS_TOKEN (delivery token) in the root .env.
import fs from "node:fs";

const SPACE_ID = "1p0asew8voz7";
const FILES_URL = "https://familyhistorytalks-files.familyhistorytalks.workers.dev";
const token = process.env.CONTENTFUL_ACCESS_TOKEN;
if (!token) throw new Error("Set CONTENTFUL_ACCESS_TOKEN in .env");

const cda = async (path) => {
  const res = await fetch(
    `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/${path}&access_token=${token}`
  );
  if (!res.ok) throw new Error(`Contentful ${path}: ${res.status}`);
  return res.json();
};

const entries = await cda("entries?limit=1000");
const assets = await cda("assets?limit=1000");
if (entries.total > entries.items.length) throw new Error("More than 1000 entries — add paging");
fs.writeFileSync("data/contentful.json", JSON.stringify({ entries: entries.items, assets: assets.items }, null, 2));
console.log(`✅ Contentful: ${entries.items.length} entries, ${assets.items.length} assets`);

// Every resource sid referenced in Contentful, plus the full bucket listing would be
// ideal — but the Worker has no list endpoint, so use the sids Contentful knows about
// and any sids cited in bios/captions.
const sids = new Set(
  entries.items
    .filter((e) => e.sys.contentType.sys.id === "resource")
    .map((e) => String(e.fields.sid).trim())
);
for (const e of entries.items) {
  for (const field of ["body", "description"]) {
    for (const m of String(e.fields[field] || "").matchAll(/<span (?:resource|record)="(\d+)"/g)) sids.add(m[1]);
    for (const m of String(e.fields[field] || "").matchAll(/resources\.familyhistorytalks\.com\/(\d+)\//g)) sids.add(m[1]);
  }
}

const archive = {};
for (const sid of sids) {
  const res = await fetch(`${FILES_URL}/${sid}/data.json`);
  if (!res.ok) {
    console.warn(`⚠️  ${sid}/data.json → ${res.status}`);
    continue;
  }
  const data = await res.json();
  const head = await fetch(`${FILES_URL}/${sid}/${data.fileName}`, { method: "HEAD" });
  archive[sid] = {
    ...data,
    size: head.ok ? Number(head.headers.get("content-length")) : null,
    pdfStatus: head.status,
  };
}
fs.writeFileSync("data/archive.json", JSON.stringify(archive, null, 2));
console.log(`✅ Archive: ${Object.keys(archive).length} data.json files (from ${sids.size} sids)`);
