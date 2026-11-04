// Writes public/static-slugs.json — every page path (used by the sitemap).
// "/" is the home page; other paths have no leading slash.
const fs = require("fs");
const path = require("path");
const { client } = require("./sanityBuildClient.cjs");

const STATIC_PAGES = ["/", "about", "surnames", "search"];

async function fetchSlugs() {
  const { people, surnames } = await client.fetch(`{
    "people": *[_type == "person" && isLive && defined(slug.current)].slug.current,
    "surnames": *[_type == "surname" && isLive && defined(slug.current)].slug.current
  }`);
  const slugs = [
    ...STATIC_PAGES,
    ...surnames.sort().map((s) => `surnames/${s}`),
    ...people.sort().map((s) => `person/${s}`),
  ];
  const slugsPath = path.join(process.cwd(), "public/static-slugs.json");
  fs.writeFileSync(slugsPath, JSON.stringify(slugs, null, 2));
  console.log(`✅ Static slugs generated (${slugs.length}).`);
}

fetchSlugs().catch((err) => {
  console.error("❌ generateSlugs failed:", err.message);
  process.exit(1);
});
