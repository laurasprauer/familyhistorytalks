import fs from "fs";
import path from "path";

// Build-time only (getStaticPaths / getStaticProps): reads the JSON written by
// generatePageData.cjs. Nothing fetches Sanity in the browser.
export const readStaticData = () =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "static-page-data.json"), "utf-8"));
