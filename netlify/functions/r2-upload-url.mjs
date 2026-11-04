// Netlify Function: r2-upload-url
// Called by the Studio's "Upload PDF" field (studio/components/R2FileInput.jsx).
// Checks that the caller is a logged-in editor on this Sanity project, then returns
// a short-lived signed URL the browser PUTs the PDF to (Cloudflare R2, S3 API).
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_ORIGINS = ["https://familyhistorytalks.sanity.studio", "http://localhost:3333"];
const EDITOR_ROLES = ["administrator", "editor", "developer", "contributor"];
const URL_TTL_SECONDS = 600;

const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  Vary: "Origin",
});

const json = (statusCode, body, origin) => ({
  statusCode,
  headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  body: JSON.stringify(body),
});

// "Sanford & Elizabeth Census.PDF" → "sanford-elizabeth-census.pdf"
const slugifyFileName = (name) => {
  const base = String(name)
    .replace(/\.pdf$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "document"}.pdf`;
};

// The Studio sends the editor's own Sanity token. Sanity answers /users/me with
// the user and their roles on this project (or {} / 401 for no or bad tokens).
async function isProjectEditor(authHeader) {
  const projectId = process.env.NEXT_PUBLIC_STUDIO_PROJECT_ID;
  if (!projectId || !authHeader?.startsWith("Bearer ")) return false;
  const res = await fetch(`https://${projectId}.api.sanity.io/v2021-06-07/users/me`, {
    headers: { Authorization: authHeader },
  });
  if (!res.ok) return false;
  const user = await res.json();
  return Boolean(user?.id) && (user.roles || []).some((role) => EDITOR_ROLES.includes(role.name));
}

export async function handler(event) {
  const origin = event.headers.origin || "";

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(origin), body: "" };
  }
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" }, origin);
  }

  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
    return json(500, { error: "R2 environment variables are not set on Netlify" }, origin);
  }

  try {
    if (!(await isProjectEditor(event.headers.authorization))) {
      return json(401, { error: "Log in to the Studio as an editor to upload files" }, origin);
    }

    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return json(400, { error: "Invalid JSON" }, origin);
    }
    const { sid, fileName, contentType } = body;
    if (!/^\d{10,16}$/.test(String(sid))) {
      return json(400, { error: "Invalid folder id" }, origin);
    }
    if (contentType !== "application/pdf") {
      return json(400, { error: "Only PDF files can be uploaded" }, origin);
    }

    const cleanName = slugifyFileName(fileName);
    const key = `${sid}/${cleanName}`;
    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
    });
    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: contentType }),
      { expiresIn: URL_TTL_SECONDS }
    );

    return json(200, { uploadUrl, key, fileName: cleanName }, origin);
  } catch (e) {
    return json(500, { error: e.message }, origin);
  }
}
