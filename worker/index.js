import postIndex from "../src/content/post-index.json"
import { createResumePdf } from "../src/lib/resume.ts"
import { rewriteHead } from "./head.js"
import { NOT_FOUND_META, looksLikeFile, pageMetaFor } from "./page-meta.js"

const MARKDOWN_PAGES = {
  "/": "/home.md",
  "/about": "/about.md",
  "/blog": "/blog.md",
}

// Requests that map to a static asset but need a different Content-Type.
const RSS = {
  path: "/rss.xml",
  contentType: "application/rss+xml; charset=utf-8",
  cacheControl: "public, max-age=3600",
}

const STATIC_OVERRIDES = {
  "/rss.xml": RSS,
  "/feed.xml": RSS,
  "/.well-known/api-catalog": {
    path: "/api-catalog.json",
    contentType: "application/linkset+json",
  },
  "/.well-known/agent-card.json": {
    path: "/agent-card.json",
    contentType: "application/json",
    cacheControl: "public, max-age=3600",
  },
  "/.well-known/http-message-signatures-directory": {
    path: "/http-message-signatures-directory.json",
    contentType: "application/json",
    cacheControl: "public, max-age=3600",
  },
  "/.well-known/agent-skills/index.json": {
    path: "/agent-skills/index.json",
    contentType: "application/json",
    cacheControl: "public, max-age=3600",
  },
  "/.well-known/mcp/server-card.json": {
    path: "/mcp-server-card.json",
    contentType: "application/json",
    cacheControl: "public, max-age=3600",
  },
}

const SITE = "https://krishant.com.np"

const ANSWERS = [
  {
    match: /contact|email|hire|reach/i,
    text: `Email: krishtimil@gmail.com. Profile: ${SITE}/about.md.`,
  },
  {
    match: /resume|cv|curriculum/i,
    text: `Resume (PDF): ${SITE}/docs/resume.pdf. Profile: ${SITE}/about.md.`,
  },
  {
    match: /blog|post|wrote|written|article|writing/i,
    text: `All posts: ${SITE}/blog.md. Full text: ${SITE}/llms-full.txt.`,
  },
  {
    match: /experience|work|job|career|skill/i,
    text: `Krishant is a software engineer working across full-stack systems, AI tooling and platform/DevOps. Details: ${SITE}/about.md.`,
  },
]

const DEFAULT_ANSWER = `Krishant Timilsina is a software engineer based in Pokhara, Nepal. Full profile: ${SITE}/about.md. Site index: ${SITE}/llms.txt. Blog: ${SITE}/blog.md.`

const CONTENT_SIGNAL = "search=yes, ai-input=yes, ai-train=no"

function bytesToBase64(bytes) {
  let binary = ""
  const chunkSize = 0x8000

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }

  return btoa(binary)
}

async function handleResume(env, url) {
  const bytes = await createResumePdf(async (path) => {
    const asset = await env.ASSETS.fetch(new URL(path, url))
    if (!asset.ok) throw new Error(`Missing font asset: ${path}`)
    return bytesToBase64(new Uint8Array(await asset.arrayBuffer()))
  })

  const isoDate = new Date().toISOString().slice(0, 10)

  return withAgentHeaders(
    new Response(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="krishant-timilsina-resume-${isoDate}.pdf"`,
        "Cache-Control": "public, max-age=3600",
      },
    }),
    url
  )
}


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
      return withAgentHeaders(
        asset,
        url,
        override.contentType,
        override.cacheControl
      )
    }

    if (url.pathname === "/a2a") {
      return handleA2A(request)
    }

    if (url.pathname === "/mcp") {
      return handleMcp(request)
    }

    if (url.pathname === "/docs/resume.pdf") {
      return handleResume(env, url)
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

    return withAgentHeaders(await servePage(request, env, url), url)
  },
}

// Serves the SPA shell with per-route <head> tags, a real 404 status for
// unknown routes, and a plain 404 for missing files instead of the shell.
async function servePage(request, env, url) {
  const isPageRequest =
    (request.method === "GET" || request.method === "HEAD") &&
    !looksLikeFile(url.pathname)

  // Conditional headers would let the asset server answer 304 for HTML we rewrite.
  const response = await env.ASSETS.fetch(
    isPageRequest ? new Request(url, { method: request.method }) : request
  )
  const isHtml = (response.headers.get("Content-Type") ?? "").includes("text/html")

  if (!isHtml || !response.ok) return response

  if (!isPageRequest) {
    // A missing /foo.png or /rss.xml must not come back as the HTML shell.
    return new Response("Not Found\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  const meta = pageMetaFor(url.pathname, postIndex)
  // Unknown routes get the empty shell (not the prerendered home page); the
  // client renders its not-found view.
  const page = meta
    ? response
    : await env.ASSETS.fetch(new Request(new URL("/shell", url)))
  const rewritten = rewriteHead(page, meta ?? NOT_FOUND_META)

  return new Response(rewritten.body, {
    status: meta ? 200 : 404,
    headers: rewritten.headers,
  })
}

function withAgentHeaders(response, url, contentType, cacheControl) {
  const headers = new Headers(response.headers)

  if (contentType) headers.set("Content-Type", contentType)
  if (cacheControl) headers.set("Cache-Control", cacheControl)
  applyAgentHeaders(headers, url)

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

async function handleA2A(request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed\n", {
      status: 405,
      headers: { Allow: "POST" },
    })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return rpcError(null, -32700, "Parse error")
  }

  // v1.0 uses "SendMessage"; v0.3 used "message/send".
  const legacy = body?.method === "message/send"
  if (body?.method !== "SendMessage" && !legacy) {
    return rpcError(body?.id ?? null, -32601, "Method not found")
  }

  const parts = body?.params?.message?.parts
  const prompt = (Array.isArray(parts) ? parts : [])
    .map((part) => part?.text ?? "")
    .join(" ")

  const text = ANSWERS.find((entry) => entry.match.test(prompt))?.text ?? DEFAULT_ANSWER
  const messageId = crypto.randomUUID()

  return Response.json({
    jsonrpc: "2.0",
    id: body.id ?? null,
    result: legacy
      ? {
          kind: "message",
          messageId,
          role: "agent",
          parts: [{ kind: "text", text }],
        }
      : { message: { messageId, role: "ROLE_AGENT", parts: [{ text }] } },
  })
}

function rpcError(id, code, message) {
  return Response.json({
    jsonrpc: "2.0",
    id,
    error: { code, message },
  })
}

const MCP_TOOLS = [
  {
    name: "ask_about_krishant",
    description:
      "Answer a question about Krishant Timilsina using his public site content (profile, resume, blog, contact).",
    inputSchema: {
      type: "object",
      properties: {
        question: { type: "string", description: "Question to answer." },
      },
      required: ["question"],
    },
  },
]

async function handleMcp(request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed\n", {
      status: 405,
      headers: { Allow: "POST" },
    })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return rpcError(null, -32700, "Parse error")
  }

  const { id = null, method, params } = body ?? {}

  if (method === "initialize") {
    return Response.json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: params?.protocolVersion ?? "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: { name: "krishant.com.np/site", version: "1.0.0" },
      },
    })
  }

  if (method === "tools/list") {
    return Response.json({ jsonrpc: "2.0", id, result: { tools: MCP_TOOLS } })
  }

  if (method === "tools/call") {
    const question = String(params?.arguments?.question ?? "")
    const text =
      ANSWERS.find((entry) => entry.match.test(question))?.text ?? DEFAULT_ANSWER
    return Response.json({
      jsonrpc: "2.0",
      id,
      result: { content: [{ type: "text", text }], isError: false },
    })
  }

  if (method?.startsWith("notifications/")) {
    return new Response(null, { status: 202 })
  }

  return rpcError(id, -32601, "Method not found")
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
      `<${url.origin}/.well-known/agent-card.json>; rel="agent-card"; type="application/json"`,
    ].join(", ")
  )
}
