// Serves the R2 bucket (archive PDFs) read-only.
// Netlify rewrites familyhistorytalks.com/resources/* to this Worker, so keys
// look like "<sid>/<file-name>.pdf" — the same layout the old S3 bucket used.
const CACHE_CONTROL = "public, max-age=31536000, immutable";

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const url = new URL(request.url);
    // Accept both "/<key>" (direct) and "/resources/<key>" (via the Netlify proxy).
    const key = decodeURIComponent(url.pathname.replace(/^\/(resources\/)?/, ""));
    if (!key || key.endsWith("/")) {
      return new Response("Not Found", { status: 404 });
    }

    // Range + conditional headers are passed through so PDF viewers can stream
    // large files (some census scans are ~90MB) instead of downloading them whole.
    const object =
      request.method === "HEAD"
        ? await env.BUCKET.head(key)
        : await env.BUCKET.get(key, {
            range: request.headers,
            onlyIf: request.headers,
          });

    if (!object) {
      return new Response("Not Found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("accept-ranges", "bytes");
    headers.set("cache-control", CACHE_CONTROL);
    headers.set("access-control-allow-origin", "*");

    if (request.method === "HEAD") {
      headers.set("content-length", String(object.size));
      return new Response(null, { headers });
    }

    // onlyIf precondition failed (e.g. If-None-Match matched): no body.
    if (!("body" in object)) {
      return new Response(null, { status: 304, headers });
    }

    if (object.range && request.headers.has("range")) {
      const range = object.range;
      // R2 reports either { offset, length } or { suffix } ("last N bytes").
      const offset =
        "suffix" in range ? object.size - range.suffix : range.offset ?? 0;
      const length =
        "suffix" in range ? range.suffix : range.length ?? object.size - offset;
      headers.set(
        "content-range",
        `bytes ${offset}-${offset + length - 1}/${object.size}`
      );
      headers.set("content-length", String(length));
      return new Response(object.body, { status: 206, headers });
    }

    headers.set("content-length", String(object.size));
    return new Response(object.body, { headers });
  },
};
