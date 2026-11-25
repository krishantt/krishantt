// Rewrites the static <head> tags of index.html with per-page metadata.
// HTMLRewriter is built into Cloudflare Workers and Bun.

function setContent(value) {
  return {
    element(el) {
      if (value == null) el.remove()
      else el.setAttribute("content", value)
    },
  }
}

export function rewriteHead(response, meta) {
  const headers = new Headers(response.headers)
  // The body changes, so the asset's validators no longer describe it.
  headers.delete("ETag")
  headers.delete("Content-Length")
  headers.set("Cache-Control", "public, max-age=0, must-revalidate")

  const extraHead = [
    meta.publishedTime &&
      `<meta property="article:published_time" content="${escapeAttr(meta.publishedTime)}" />`,
    meta.noindex && `<meta name="robots" content="noindex" />`,
    meta.jsonLd &&
      `<script type="application/ld+json" id="page-jsonld">${JSON.stringify(meta.jsonLd).replaceAll("<", "\\u003c")}</script>`,
  ]
    .filter(Boolean)
    .join("")

  const rewriter = new HTMLRewriter()
    .on("title", {
      element(el) {
        el.setInnerContent(meta.title)
      },
    })
    .on('meta[name="description"]', setContent(meta.description))
    .on('meta[property="og:title"]', setContent(meta.title))
    .on('meta[property="og:description"]', setContent(meta.description))
    .on('meta[property="og:type"]', setContent(meta.type))
    .on('meta[property="og:url"]', setContent(meta.url))
    .on('meta[property="og:image"]', setContent(meta.image))
    .on('meta[property="twitter:title"]', setContent(meta.title))
    .on('meta[property="twitter:description"]', setContent(meta.description))
    .on('meta[name="twitter:image"]', setContent(meta.image))
    .on('link[rel="canonical"]', {
      element(el) {
        if (meta.url) el.setAttribute("href", meta.url)
        else el.remove()
      },
    })
    .on("head", {
      element(el) {
        if (extraHead) el.append(extraHead, { html: true })
      },
    })

  return rewriter.transform(
    new Response(response.body, { status: response.status, headers })
  )
}

function escapeAttr(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;")
}
