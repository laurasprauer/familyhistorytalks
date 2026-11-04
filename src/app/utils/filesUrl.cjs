// Where archive PDFs (Assets) are served from.
// On Netlify: same-origin /resources/* — public/_redirects proxies it to the
// Cloudflare Worker in front of the R2 bucket (see generateNetlifyFiles.cjs).
// Locally there is no proxy, so links go straight to the Worker.
// NEXT_PUBLIC_RESOURCES_URL overrides both (e.g. if the proxy ever has to be skipped).
const WORKER_URL = "https://familyhistorytalks-files.familyhistorytalks.workers.dev";

const filesBaseUrl = () =>
  (process.env.NEXT_PUBLIC_RESOURCES_URL || (process.env.NETLIFY === "true" ? "/resources" : WORKER_URL)).replace(
    /\/+$/,
    ""
  );

const fileUrl = (key) => (key ? `${filesBaseUrl()}/${key}` : null);

module.exports = { WORKER_URL, filesBaseUrl, fileUrl };
