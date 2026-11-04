// Writes public/static-page-data.json — every biography and surname page.
// getStaticProps in src/pages/** reads this file; nothing fetches Sanity at runtime.
//   { people: { <slug>: person }, surnames: { <slug>: surname }, surnameList: [...] }
const fs = require("fs");
const path = require("path");
const { client, rewriteSanityUrls } = require("./sanityBuildClient.cjs");
const { fileUrl } = require("./filesUrl.cjs");

// Image projection shared by every image field.
const IMAGE = `{ alt, crop, hotspot, asset->{ url, originalFilename, "width": metadata.dimensions.width, "height": metadata.dimensions.height } }`;

// Rich text: figures need their image dereferenced; citations keep their _ref, which
// the site matches against the person's assets list to number footnotes.
const BODY = `body[]{ ..., _type == "figure" => { ..., image ${IMAGE} } }`;

const ASSET = `{ _id, title, description, startYear, endYear, "key": file.key, "fileName": file.fileName }`;

// Relatives only need what the family tree shows.
const RELATIVE_FIELDS = `name, "slug": slug.current, isLive, gender, birthYear, deathYear, "surname": surname->surname`;

const PEOPLE_QUERY = `*[_type == "person" && isLive && defined(slug.current)]{
  _id,
  name,
  "slug": slug.current,
  gender,
  birthMonth, birthDay, birthYear,
  deathMonth, deathDay, deathYear,
  description,
  "surname": surname->surname,
  profileImage ${IMAGE},
  ${BODY},
  "assets": assets[]->${ASSET},
  "father": father->{ ${RELATIVE_FIELDS} },
  "mother": mother->{ ${RELATIVE_FIELDS} },
  "childrenOfPerson": childrenOfPerson[]->{
    ${RELATIVE_FIELDS},
    "father": father->{ ${RELATIVE_FIELDS} },
    "mother": mother->{ ${RELATIVE_FIELDS} }
  }
}`;

const SURNAMES_QUERY = `*[_type == "surname" && isLive && defined(slug.current)] | order(surname asc){
  surname,
  "slug": slug.current,
  ${BODY},
  "people": *[_type == "person" && isLive && surname._ref == ^._id] | order(name asc){
    name,
    "slug": slug.current,
    birthYear,
    deathYear,
    profileImage ${IMAGE}
  }
}`;

// SEO-friendly image URLs: Sanity's CDN accepts a "vanity" filename after the asset
// path and serves the same file (same approach as the other Sanity sites).
const slugifyFilename = (name) =>
  String(name)
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function addVanityFilenames(input) {
  if (Array.isArray(input)) return input.map(addVanityFilenames);
  if (!input || typeof input !== "object") return input;
  const result = {};
  for (const key of Object.keys(input)) result[key] = addVanityFilenames(input[key]);
  const { url, originalFilename } = result;
  if (typeof url === "string" && url.startsWith("https://cdn.sanity.io/") && originalFilename) {
    const ext = (url.match(/\.([a-z0-9]+)$/i) || [])[1];
    const slug = slugifyFilename(originalFilename);
    if (ext && slug) result.url = `${url}/${slug}.${ext}`;
  }
  return result;
}

// Assets get the public URL of their PDF.
const withFileUrls = (assets) => (assets || []).filter(Boolean).map((a) => ({ ...a, url: fileUrl(a.key) }));

async function getAllData() {
  const [people, surnames] = await Promise.all([client.fetch(PEOPLE_QUERY), client.fetch(SURNAMES_QUERY)]);

  const allData = { people: {}, surnames: {}, surnameList: [] };

  people.forEach((person) => {
    allData.people[person.slug] = { ...person, assets: withFileUrls(person.assets) };
  });

  surnames.forEach((surname) => {
    allData.surnames[surname.slug] = surname;
    allData.surnameList.push({ surname: surname.surname, slug: surname.slug });
  });

  return rewriteSanityUrls(addVanityFilenames(allData));
}

getAllData()
  .then((data) => {
    const filePath = path.join(process.cwd(), "public/static-page-data.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(
      `✅ Static page data generated (${Object.keys(data.people).length} people, ${data.surnameList.length} surnames).`
    );
  })
  .catch((err) => {
    console.error("❌ generatePageData failed:", err.message);
    process.exit(1);
  });
