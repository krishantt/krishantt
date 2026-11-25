// Shared, dependency-free helpers for the build-time content generators.
import { promises as fs } from "node:fs"
import path from "node:path"

export const META_PATTERN = /export const meta\s*=\s*({[\s\S]*?\n})\n?/

export function parsePostSource(fileName, source) {
  const metaSource = source.match(META_PATTERN)?.[1]
  if (!metaSource) throw new Error(`No \`export const meta\` in ${fileName}`)

  const meta = new Function(`return (${metaSource})`)()
  for (const key of ["title", "date", "summary"]) {
    if (typeof meta[key] !== "string" || !meta[key]) {
      throw new Error(`${fileName}: meta.${key} is required`)
    }
  }

  return {
    slug: fileName.replace(/\.mdx$/, ""),
    title: meta.title,
    date: meta.date,
    summary: meta.summary,
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    body: source.replace(META_PATTERN, "").trim(),
  }
}

export async function readPosts(postsDir) {
  const files = (await fs.readdir(postsDir)).filter((f) => f.endsWith(".mdx"))
  const posts = await Promise.all(
    files.map(async (fileName) =>
      parsePostSource(
        fileName,
        await fs.readFile(path.join(postsDir, fileName), "utf8")
      )
    )
  )
  return posts.sort((a, b) => b.date.localeCompare(a.date))
}

export function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

export function buildRss({ baseUrl, title, description, posts }) {
  const items = posts.map((post) => {
    const url = `${baseUrl}/blog/${post.slug}`
    return [
      "    <item>",
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>`,
      `      <description>${escapeXml(post.summary)}</description>`,
      ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
      "    </item>",
    ].join("\n")
  })

  const lastBuild = posts[0]
    ? new Date(`${posts[0].date}T00:00:00Z`).toUTCString()
    : new Date(0).toUTCString()

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${baseUrl}/blog</link>`,
    `    <description>${escapeXml(description)}</description>`,
    "    <language>en</language>",
    `    <lastBuildDate>${lastBuild}</lastBuildDate>`,
    `    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n")
}

// Greedy word wrap; a single overlong word gets its own line rather than being split.
export function wrapText(text, maxChars) {
  const lines = []
  let line = ""
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word
    if (next.length > maxChars && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

// Like wrapText, but narrows the measure (to 70%) to avoid a one-word last line.
export function wrapBalanced(text, maxChars) {
  for (let width = maxChars; width >= Math.ceil(maxChars * 0.7); width--) {
    const lines = wrapText(text, width)
    if (lines.length === 1 || lines.at(-1).includes(" ")) return lines
  }
  return wrapText(text, maxChars)
}
