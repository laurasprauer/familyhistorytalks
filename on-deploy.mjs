// Runs on the Netlify build server (scripts/netlify-build.sh).
// Sanity Studio only sees SANITY_STUDIO_* variables from studio/.env, so this
// copies the values it needs out of the site's environment. If the Studio needs
// another variable, add it here.
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

// The Studio's "Upload PDF" field calls the site's Netlify Function. Locally the
// site runs without functions, so it falls back to the live site.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
const uploadUrl = siteUrl.startsWith("https://")
  ? `${siteUrl}/api/r2-upload-url`
  : "https://familyhistorytalks.com/api/r2-upload-url";

const fileContent = [
  `SANITY_STUDIO_PROJECT_ID=${process.env.NEXT_PUBLIC_STUDIO_PROJECT_ID}`,
  `SANITY_STUDIO_DATASET=${process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}`,
  `SANITY_STUDIO_UPLOAD_URL=${uploadUrl}`,
  "",
].join("\n");

const filePath = path.join(__dirname, "studio", ".env");
fs.writeFileSync(filePath, fileContent);
console.log(`✅ studio/.env written at ${filePath}`);
