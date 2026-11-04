// Step 2: data/contentful.json + data/archive.json → data/migration.ndjson
//
// Document ids are deterministic so the import can be re-run with --replace:
//   archiveAsset  asset-<sid>        (sid = old S3 folder / R2 folder)
//   person        person-<contentfulId>
//   surname       surname-<contentfulId>
//   tag           tag-<contentfulId>
//
// Bios are Markdown with inline HTML. They're rendered to HTML with `marked`, parsed
// with htmlparser2, and walked into Portable Text:
//   <span resource|record="sid">        → inline assetCitation → asset-<sid>
//   <span class="highlight">…</span>    → highlightBox
//   <span class="warning">…</span>      → warningBox
//   <img> (+ following span.caption)    → figure { image, alt, caption, maxWidth }
//   ### heading / > quote / - list      → block styles h2–h4 / blockquote / bullet
// Images are imported by `sanity dataset import` itself via `_sanityAsset`.
import fs from "node:fs";
import { marked } from "marked";
import { parseDocument } from "htmlparser2";

const { entries, assets } = JSON.parse(fs.readFileSync("data/contentful.json", "utf-8"));
const archive = JSON.parse(fs.readFileSync("data/archive.json", "utf-8"));

const warnings = [];
const warn = (msg) => warnings.push(msg);

let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36).padStart(5, "0")}`;

const byId = new Map(entries.map((e) => [e.sys.id, e]));
const assetById = new Map(assets.map((a) => [a.sys.id, a]));
const typeOf = (e) => e.sys.contentType.sys.id;
const ofType = (t) => entries.filter((e) => typeOf(e) === t);

const DOC_ID_PREFIX = { person: "person", surname: "surname", tag: "tag" };

// Contentful link → Sanity reference (or null when the target isn't published).
const ref = (link, from) => {
  const target = link && byId.get(link.sys.id);
  if (!target) {
    if (link) warn(`${from}: link to missing/unpublished entry ${link.sys.id} dropped`);
    return null;
  }
  if (typeOf(target) === "resource") return { _type: "reference", _ref: `asset-${String(target.fields.sid).trim()}` };
  return { _type: "reference", _ref: `${DOC_ID_PREFIX[typeOf(target)]}-${target.sys.id}` };
};

const knownSids = new Set(Object.keys(archive));
// Text inside the old marker (" - P29", ".1") was shown inside the brackets: [5 - P29].
const citation = (sid, detail, from) => {
  if (!knownSids.has(sid)) warn(`${from}: citation to unknown asset ${sid}`);
  return {
    _type: "assetCitation",
    _key: key(),
    asset: { _type: "reference", _ref: `asset-${sid}` },
    ...(detail && { detail }),
  };
};
const textOf = (nodes) => nodes.map((n) => (n.type === "text" ? n.data : textOf(n.children || []))).join("");

const imageField = (url, extra = {}) => ({
  _type: "image",
  _sanityAsset: `image@${url.startsWith("//") ? `https:${url}` : url}`,
  ...extra,
});

// Old PDF links point at the S3 domain; the site now serves them from /resources/.
const rewriteHref = (href = "") =>
  href.replace(/^https?:\/\/resources\.familyhistorytalks\.com\//, "/resources/");

// ---------------------------------------------------------------- HTML → blocks
const isEl = (n) => n.type === "tag";
const cls = (n) => (n.attribs?.class || "").split(/\s+/);
const styleMaxWidth = (n) => {
  const m = /max-width:\s*(\d+)px/.exec(n.attribs?.style || "");
  return m ? Number(m[1]) : undefined;
};

// Collect inline content (spans, citations, links) into a block-in-progress.
function inline(nodes, block, marks, from) {
  for (const n of nodes) {
    if (n.type === "text") {
      const text = n.data.replace(/\s*\n\s*/g, " ");
      if (text) block.children.push({ _type: "span", _key: key(), text, marks: [...marks] });
    } else if (isEl(n)) {
      const name = n.name;
      if (name === "br") {
        block.children.push({ _type: "span", _key: key(), text: "\n", marks: [...marks] });
      } else if (name === "strong" || name === "b") {
        inline(n.children, block, [...marks, "strong"], from);
      } else if (name === "em" || name === "i") {
        inline(n.children, block, [...marks, "em"], from);
      } else if (name === "a") {
        const def = {
          _type: "link",
          _key: key(),
          href: rewriteHref(n.attribs.href),
          ...(n.attribs.target === "_blank" && { openInNewTab: true }),
        };
        block.markDefs.push(def);
        inline(n.children, block, [...marks, def._key], from);
      } else if (name === "span" && (n.attribs.resource || n.attribs.record)) {
        const sid = String(n.attribs.resource || n.attribs.record).trim();
        block.children.push(citation(sid, textOf(n.children).replace(/\s+$/, ""), from));
      } else if (name === "code") {
        inline(n.children, block, marks, from);
      } else {
        if (name !== "span") warn(`${from}: inline <${name}> flattened to text`);
        inline(n.children, block, marks, from);
      }
    }
  }
}

const newBlock = (style = "normal", extra = {}) => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [],
  ...extra,
});

// Trim outer whitespace, merge neighbouring spans with identical marks, drop empties.
function finishBlock(block) {
  const merged = [];
  for (const child of block.children) {
    const prev = merged[merged.length - 1];
    if (
      child._type === "span" &&
      prev?._type === "span" &&
      prev.marks.join() === child.marks.join()
    ) {
      prev.text += child.text;
    } else {
      merged.push({ ...child });
    }
  }
  // "text <br><br> more" → no stray spaces around the line breaks
  for (const child of merged) {
    if (child._type === "span") child.text = child.text.replace(/ *\n */g, "\n");
  }
  const spans = merged.filter((c) => c._type === "span");
  if (spans.length) {
    const first = merged.find((c) => c._type === "span");
    const last = [...merged].reverse().find((c) => c._type === "span");
    if (merged[0] === first) first.text = first.text.replace(/^[ \t]+/, "").replace(/^\n+/, "");
    if (merged[merged.length - 1] === last) last.text = last.text.replace(/[\s]+$/, "");
  }
  block.children = merged.filter((c) => c._type !== "span" || c.text !== "");
  const used = new Set(block.children.flatMap((c) => c.marks || []));
  block.markDefs = block.markDefs.filter((d) => used.has(d._key));
  if (!block.children.length) return null;
  // Portable Text blocks need at least one span
  if (!block.children.some((c) => c._type === "span")) {
    block.children.push({ _type: "span", _key: key(), text: "", marks: [] });
  }
  return block;
}

const simpleBlocks = (nodes, from) => {
  const block = finishBlock((() => {
    const b = newBlock();
    inline(nodes, b, [], from);
    return b;
  })());
  return block ? [block] : [];
};

// A paragraph may hold images, captions and boxes mixed with text: split it.
function paragraph(nodes, out, style, from, extra = {}) {
  let current = newBlock(style, extra);
  const flush = () => {
    const done = finishBlock(current);
    if (done) out.push(done);
    current = newBlock(style, extra);
  };

  for (const n of nodes) {
    if (isEl(n) && n.name === "img") {
      flush();
      out.push({
        _type: "figure",
        _key: key(),
        image: imageField(n.attribs.src),
        alt: n.attribs.alt || undefined,
        maxWidth: styleMaxWidth(n),
      });
    } else if (isEl(n) && n.name === "span" && cls(n).includes("caption")) {
      flush();
      const last = out[out.length - 1];
      const caption = simpleBlocks(n.children, `${from} caption`);
      if (last?._type === "figure" && !last.caption) {
        last.caption = caption;
        if (!last.maxWidth) last.maxWidth = styleMaxWidth(n);
      } else {
        warn(`${from}: caption without an image kept as a paragraph`);
        out.push(...caption);
      }
    } else if (isEl(n) && n.name === "span" && cls(n).includes("highlight")) {
      flush();
      out.push({ _type: "highlightBox", _key: key(), content: simpleBlocks(n.children, `${from} highlight`) });
    } else if (isEl(n) && n.name === "span" && cls(n).includes("warning")) {
      flush();
      out.push({ _type: "warningBox", _key: key(), content: simpleBlocks(n.children, `${from} warning`) });
    } else if (isEl(n) && n.name === "br" && !current.children.length) {
      // <br> right after an image/caption: layout spacing only
    } else {
      inline([n], current, [], from);
    }
  }
  flush();
}

function markdownToBlocks(markdown, from) {
  if (!markdown) return undefined;
  const html = marked.parse(markdown, { gfm: true, breaks: false });
  const doc = parseDocument(html, { decodeEntities: true });
  const out = [];

  const walk = (nodes, listDepth = 0, listType) => {
    for (const n of nodes) {
      if (n.type === "text") {
        if (n.data.trim()) paragraph([n], out, "normal", from);
        continue;
      }
      if (!isEl(n)) continue;
      const name = n.name;
      if (name === "p") {
        paragraph(n.children, out, "normal", from);
      } else if (/^h[1-6]$/.test(name)) {
        const level = Math.min(Math.max(Number(name[1]), 2), 4);
        paragraph(n.children, out, `h${level}`, from);
      } else if (name === "blockquote") {
        for (const child of n.children) {
          if (isEl(child) && child.name === "p") paragraph(child.children, out, "blockquote", from);
          else if (child.type === "text" && child.data.trim()) paragraph([child], out, "blockquote", from);
          else if (isEl(child)) {
            warn(`${from}: <${child.name}> inside blockquote flattened`);
            paragraph(child.children, out, "blockquote", from);
          }
        }
      } else if (name === "ul" || name === "ol") {
        walk(n.children, listDepth + 1, name === "ul" ? "bullet" : "number");
      } else if (name === "li") {
        const inlineKids = n.children.filter((c) => !(isEl(c) && (c.name === "ul" || c.name === "ol")));
        const nested = n.children.filter((c) => isEl(c) && (c.name === "ul" || c.name === "ol"));
        // "loose" lists wrap item text in <p>
        const kids = inlineKids.flatMap((c) => (isEl(c) && c.name === "p" ? c.children : [c]));
        paragraph(kids, out, "normal", from, { listItem: listType, level: listDepth });
        walk(nested, listDepth, listType);
      } else if (name === "hr") {
        warn(`${from}: <hr> dropped`);
      } else {
        // Raw HTML blocks (e.g. a <span class="warning"> on its own lines)
        paragraph([n], out, "normal", from);
      }
    }
  };
  walk(doc.children);
  return out;
}

// ---------------------------------------------------------------- documents
const trim = (v) => (typeof v === "string" ? v.trim() || undefined : v ?? undefined);
const MONTH_FIXES = { Novemeber: "November" };
const month = (v) => (v ? MONTH_FIXES[v.trim()] || v.trim() : undefined);
const slug = (current) => ({ _type: "slug", current });
const refs = (links, from) => (links || []).map((l) => ref(l, from)).filter(Boolean).map((r) => ({ ...r, _key: key() }));

const docs = [];

// Assets — one per archive data.json; title from data.json (more complete), falling
// back to the Contentful resource entry.
const contentfulTitleBySid = new Map(
  ofType("resource").map((e) => [String(e.fields.sid).trim(), e.fields.title])
);
for (const [sid, data] of Object.entries(archive)) {
  docs.push({
    _id: `asset-${sid}`,
    _type: "archiveAsset",
    title: trim(data.title) || contentfulTitleBySid.get(sid),
    file: {
      sid,
      key: `${sid}/${data.fileName}`,
      fileName: data.fileName,
      size: data.size,
      contentType: "application/pdf",
    },
    startYear: Number(data.startYear) || undefined,
    endYear: Number(data.endYear) || undefined,
    description: trim(data.description),
    transcript: trim(data.transcript),
  });
}
for (const sid of contentfulTitleBySid.keys()) {
  if (!archive[sid]) warn(`Contentful resource ${sid} has no data.json in R2 — not migrated`);
}

for (const e of ofType("tag")) {
  docs.push({ _id: `tag-${e.sys.id}`, _type: "tag", title: e.fields.title });
}

for (const e of ofType("surname")) {
  const f = e.fields;
  docs.push({
    _id: `surname-${e.sys.id}`,
    _type: "surname",
    surname: f.surname,
    slug: slug(f.slug),
    isLive: Boolean(f.isLive),
    body: markdownToBlocks(f.body, `surname ${f.slug}`),
  });
}

for (const e of ofType("person")) {
  const f = e.fields;
  const from = `person ${f.slug}`;
  const portrait = f.profileImage && assetById.get(f.profileImage.sys.id);
  if (f.profileImage && !portrait) warn(`${from}: portrait asset ${f.profileImage.sys.id} missing`);
  docs.push({
    _id: `person-${e.sys.id}`,
    _type: "person",
    name: trim(f.name),
    slug: slug(f.slug),
    isLive: Boolean(f.isLive),
    surname: ref(f.surname, from),
    gender: trim(f.gender),
    birthMonth: month(f.birthMonth),
    birthDay: f.birthDay ?? undefined,
    birthYear: trim(f.birthYear),
    deathMonth: month(f.deathMonth),
    deathDay: f.deathDay ?? undefined,
    deathYear: trim(f.deathYear),
    profileImage: portrait ? imageField(portrait.fields.file.url, { alt: `${trim(f.name)} portrait` }) : undefined,
    description: trim(f.description),
    body: markdownToBlocks(f.body, from),
    assets: refs(f.resources, from),
    father: ref(f.father, from) || undefined,
    mother: ref(f.mother, from) || undefined,
    childrenOfPerson: refs(f.childrenOfPerson, from),
    tags: refs(f.tags, from),
  });
}

// A bio may cite an asset that was never added to the person's resources list in
// Contentful (the old site then showed the footnote without a number). Append those
// so every citation gets a number.
const citedRefs = (value, out = []) => {
  if (Array.isArray(value)) value.forEach((v) => citedRefs(v, out));
  else if (value && typeof value === "object") {
    if (value._type === "assetCitation") out.push(value.asset._ref);
    Object.values(value).forEach((v) => citedRefs(v, out));
  }
  return out;
};
for (const person of docs.filter((d) => d._type === "person")) {
  const listed = new Set(person.assets.map((a) => a._ref));
  for (const ref of citedRefs(person.body)) {
    if (listed.has(ref)) continue;
    listed.add(ref);
    person.assets.push({ _type: "reference", _ref: ref, _key: key() });
    warn(`${person.slug.current}: cited ${ref} was missing from their assets — appended`);
  }
}

// Drop undefined / empty-array fields so documents stay clean (Portable Text blocks
// keep their markDefs/marks arrays even when empty).
const KEEP_EMPTY = new Set(["markDefs", "marks", "children"]);
const clean = (value) => {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k, v]) => v !== undefined && (KEEP_EMPTY.has(k) || !(Array.isArray(v) && v.length === 0)))
        .map(([k, v]) => [k, clean(v)])
    );
  }
  return value;
};

fs.writeFileSync("data/migration.ndjson", docs.map((d) => JSON.stringify(clean(d))).join("\n") + "\n");

const count = (t) => docs.filter((d) => d._type === t).length;
console.log(
  `✅ data/migration.ndjson: ${count("person")} people, ${count("surname")} surnames, ${count("archiveAsset")} assets, ${count("tag")} tags`
);
if (warnings.length) {
  console.log(`\n⚠️  ${warnings.length} warning(s):`);
  for (const w of [...new Set(warnings)]) console.log(`  - ${w}`);
}
