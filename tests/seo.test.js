import { describe, expect, test } from "bun:test"

import { buildRss, parsePostSource, wrapBalanced, wrapText } from "../scripts/lib/posts.mjs"
import { rewriteHead } from "../worker/head.js"
import { NOT_FOUND_META, looksLikeFile, pageMetaFor } from "../worker/page-meta.js"

const posts = [
  { slug: "a-post", title: 'Quotes "and" <tags> & more', date: "2026-01-02", summary: "Sum.", tags: ["X", "Y"] },
]

const shell = `<!doctype html><html><head>
<link rel="canonical" href="https://krishant.com.np/" />
<meta name="description" content="default" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://krishant.com.np/" />
<meta property="og:image" content="https://krishant.com.np/images/profile.jpg" />
<meta property="og:title" content="Krishant Timilsina" />
<meta property="og:description" content="default" />
<meta name="twitter:image" content="x" />
<meta property="twitter:title" content="x" />
<meta property="twitter:description" content="x" />
<title>Krishant Timilsina</title></head><body></body></html>`

const render = (meta) =>
  rewriteHead(new Response(shell, { headers: { "Content-Type": "text/html", ETag: '"1"' } }), meta).text()

describe("pageMetaFor", () => {
  test("known routes resolve, trailing slash and index.html normalise", () => {
    expect(pageMetaFor("/", posts).url).toBe("https://krishant.com.np/")
    expect(pageMetaFor("/index.html", posts).url).toBe("https://krishant.com.np/")
    expect(pageMetaFor("/about/", posts).url).toBe("https://krishant.com.np/about")
    expect(pageMetaFor("/blog", posts).title).toStartWith("Writing")
  })

  test("a post gets its own title, card and article JSON-LD", () => {
    const meta = pageMetaFor("/blog/a-post", posts)
    expect(meta.title).toStartWith('Quotes "and"')
    expect(meta.image).toBe("https://krishant.com.np/og/a-post.png")
    expect(meta.type).toBe("article")
    expect(meta.jsonLd["@type"]).toBe("BlogPosting")
  })

  test("unknown routes are null", () => {
    expect(pageMetaFor("/blog/nope", posts)).toBeNull()
    expect(pageMetaFor("/nope", posts)).toBeNull()
    expect(pageMetaFor("/blog/a-post/extra", posts)).toBeNull()
  })

  test("file-looking paths are not pages", () => {
    expect(looksLikeFile("/rss.xml")).toBe(true)
    expect(looksLikeFile("/blog/a-post")).toBe(false)
  })
})

describe("rewriteHead", () => {
  test("replaces title, OG, canonical, and escapes values", async () => {
    const html = await render(pageMetaFor("/blog/a-post", posts))
    expect(html).toContain("<title>Quotes \"and\" &lt;tags&gt; &amp; more | Krishant Timilsina</title>")
    expect(html).toContain('<link rel="canonical" href="https://krishant.com.np/blog/a-post"')
    expect(html).toContain('og:image" content="https://krishant.com.np/og/a-post.png"')
    expect(html).toContain('og:type" content="article"')
    expect(html).not.toContain('content="Quotes "and"')
    expect(html).toContain('"@type":"BlogPosting"')
    expect(html).not.toContain("<tags></")
  })

  test("404 meta drops canonical and og:url, adds noindex", async () => {
    const html = await render(NOT_FOUND_META)
    expect(html).not.toContain("rel=\"canonical\"")
    expect(html).not.toContain("og:url")
    expect(html).toContain('name="robots" content="noindex"')
  })

  test("drops the stale ETag", () => {
    const res = rewriteHead(new Response(shell, { headers: { ETag: '"1"' } }), NOT_FOUND_META)
    expect(res.headers.get("ETag")).toBeNull()
  })
})

describe("content helpers", () => {
  test("parsePostSource reads meta and strips it from the body", () => {
    const post = parsePostSource(
      "x.mdx",
      'export const meta = {\n  title: "T",\n  date: "2026-01-01",\n  summary: "S",\n  tags: ["a"],\n}\n\nHello'
    )
    expect(post).toMatchObject({ slug: "x", title: "T", tags: ["a"], body: "Hello" })
  })

  test("parsePostSource rejects missing fields", () => {
    expect(() => parsePostSource("x.mdx", 'export const meta = {\n  title: "T",\n}\n')).toThrow("meta.date")
  })

  test("buildRss escapes and links each post", () => {
    const xml = buildRss({ baseUrl: "https://e.x", title: "T & U", description: "D", posts })
    expect(xml).toContain("<title>T &amp; U</title>")
    expect(xml).toContain("<link>https://e.x/blog/a-post</link>")
    expect(xml).toContain("&lt;tags&gt;")
    expect(xml).toContain("<category>X</category>")
  })

  test("wrapText wraps on words", () => {
    expect(wrapText("one two three four", 9)).toEqual(["one two", "three", "four"])
  })

  test("wrapBalanced avoids a one-word last line", () => {
    const lines = wrapBalanced("Building the Factory, Not the Feature: How I Work with AI Agents", 29)
    expect(lines.at(-1)).toContain(" ")
  })
})
