// Writes public/search-index.json — everything the /search page searches, in the
// browser with MiniSearch. Rebuilt on every deploy (publishing in Sanity triggers one).
//   assets: title, description, transcript, years → link to the PDF
//   people (with a page): name, description, biography text, birth–death → their page
const fs = require("fs");
const path = require("path");
const { client } = require("./sanityBuildClient.cjs");
const { fileUrl } = require("./filesUrl.cjs");

const QUERY = `{
  "assets": *[_type == "archiveAsset" && defined(file.key)] | order(title asc){
    _id, title, description, transcript, startYear, endYear, "key": file.key
  },
  "people": *[_type == "person" && isLive && defined(slug.current)] | order(name asc){
    _id, name, "slug": slug.current, description, birthYear, deathYear,
    "bodyText": pt::text(body)
  }
}`;

// "1776-80" → 1776, "before 1755" → 1755
const firstYear = (value) => {
  const match = /\d{4}/.exec(value || "");
  return match ? Number(match[0]) : null;
};

async function generate() {
  const { assets, people } = await client.fetch(QUERY);

  const documents = [
    ...assets.map((a) => ({
      id: a._id,
      type: "asset",
      title: a.title || "",
      description: a.description || "",
      text: a.transcript || "",
      startYear: a.startYear || null,
      endYear: a.endYear || a.startYear || null,
      url: fileUrl(a.key),
    })),
    ...people.map((p) => ({
      id: p._id,
      type: "person",
      title: p.name || "",
      description: p.description || "",
      text: p.bodyText || "",
      startYear: firstYear(p.birthYear),
      endYear: firstYear(p.deathYear) || firstYear(p.birthYear),
      dates: `${p.birthYear || "????"} – ${p.deathYear || "????"}`,
      url: `/person/${p.slug}`,
    })),
  ];

  const filePath = path.join(process.cwd(), "public/search-index.json");
  fs.writeFileSync(filePath, JSON.stringify(documents));
  const kb = Math.round(fs.statSync(filePath).size / 1024);
  console.log(`✅ Search index generated (${assets.length} assets, ${people.length} people, ${kb} KB).`);
}

generate().catch((err) => {
  console.error("❌ generateSearchIndex failed:", err.message);
  process.exit(1);
});
