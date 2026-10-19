const MARKDOWN_PAGES = {
  "/": "/home.md",
  "/about": "/about.md",
  "/blog": "/blog.md",
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
        headers.set("Vary", "Accept")
        headers.set("Content-Signal", CONTENT_SIGNAL)
        headers.set(
          "x-markdown-tokens",
          String(Math.ceil(new TextEncoder().encode(markdown).length / 4))
        )

        return new Response(markdown, { headers })
      }
    }

    return withAgentHeaders(await env.ASSETS.fetch(request))
  },
}

function withAgentHeaders(response) {
  const headers = new Headers(response.headers)
  // Without Vary, a shared cache could serve the HTML variant to markdown requests.
  headers.set("Vary", "Accept")
  headers.set("Content-Signal", CONTENT_SIGNAL)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
