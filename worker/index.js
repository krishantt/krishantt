const MARKDOWN_PAGES = {
  "/": "/home.md",
  "/about": "/about.md",
  "/blog": "/blog.md",
}

// Requests that map to a static asset but need a different Content-Type.
const STATIC_OVERRIDES = {
  "/.well-known/api-catalog": {
    path: "/api-catalog.json",
    contentType: "application/linkset+json",
  },
}

const CONTENT_SIGNAL = "search=yes, ai-input=yes, ai-train=no"

function acceptsMarkdown(request) {
  return (request.headers.get("Accept") ?? "").includes("text/markdown")
}

function markdownPathFor(pathname) {
  if (MARKDOWN_PAGES[pathname]) return MARKDOWN_PAGES[pathname]
  if (pathname.startsWith("/blog/")) return `${pathname}.md`
  return null
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const override = STATIC_OVERRIDES[url.pathname]

    if (override) {
      const asset = await env.ASSETS.fetch(new URL(override.path, url))
      return withAgentHeaders(asset, url, override.contentType)
    }

    // The SPA fallback must not answer discovery probes with HTML.
    if (url.pathname.startsWith("/.well-known/")) {
      return withAgentHeaders(new Response("Not Found\n", { status: 404 }), url)
    }

    const markdownPath =
      request.method === "GET" && acceptsMarkdown(request)
        ? markdownPathFor(url.pathname)
        : null

    if (markdownPath) {
      const asset = await env.ASSETS.fetch(new URL(markdownPath, url))

      // Unknown paths fall back to index.html, which is HTML, not markdown.
      if (
        asset.ok &&
        (asset.headers.get("Content-Type") ?? "").includes("text/markdown")
      ) {
        const markdown = await asset.text()
        const headers = new Headers(asset.headers)
        headers.set("Content-Type", "text/markdown; charset=utf-8")
        headers.set(
          "x-markdown-tokens",
          String(Math.ceil(new TextEncoder().encode(markdown).length / 4))
        )
        applyAgentHeaders(headers, url)

        return new Response(markdown, { headers })
      }
    }

    return withAgentHeaders(await env.ASSETS.fetch(request), url)
  },
}

function withAgentHeaders(response, url, contentType) {
  const headers = new Headers(response.headers)

  if (contentType) headers.set("Content-Type", contentType)
  applyAgentHeaders(headers, url)

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function applyAgentHeaders(headers, url) {
  // Without Vary, a shared cache could serve the HTML variant to markdown requests.
  headers.set("Vary", "Accept")
  headers.set("Content-Signal", CONTENT_SIGNAL)
  headers.set(
    "Link",
    [
      `<${url.origin}/.well-known/api-catalog>; rel="api-catalog"`,
      `<${url.origin}/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"`,
      `<${url.origin}/llms.txt>; rel="service-doc"; type="text/plain"`,
      `<${url.origin}/llms-full.txt>; rel="describedby"; type="text/plain"`,
    ].join(", ")
  )
}
