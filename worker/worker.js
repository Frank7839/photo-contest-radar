/* Photo Contest Radar Worker
 *
 * Photo Contest Radar is a static web app, so this Worker has very little to do:
 *   - Static files in ./public are served by Cloudflare's asset layer (see wrangler.jsonc).
 *   - The contest list (/data/radar.json) is sent with a short cache so phones pick up
 *     new contests soon after each push.
 *   - Every response gets security headers.
 */

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src https://fonts.gstatic.com",
    "img-src 'self' data:",
    "worker-src 'self'",
    "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
};

function withHeaders(response, extra = {}) {
  const r = new Response(response.body, response);
  for (const [k, v] of Object.entries({ ...SECURITY_HEADERS, ...extra })) r.headers.set(k, v);
  return r;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const res = await env.ASSETS.fetch(request);

    if (url.pathname === "/data/radar.json") {
      return withHeaders(res, { "Cache-Control": "public, max-age=300" });
    }
    if (url.pathname === "/sw.js") {
      return withHeaders(res, { "Cache-Control": "no-cache" });
    }
    return withHeaders(res);
  },
};
