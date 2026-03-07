import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")

const postsDir = path.join(rootDir, "src", "content", "posts")
const personalInfoPath = path.join(rootDir, "personal-info.json")
const sitemapPath = path.join(rootDir, "public", "sitemap.xml")

const fallbackBaseUrl = "https://krishant.com.np"

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function normalizeBaseUrl(url) {
  try {
    return new URL(url).origin
  } catch {
    return fallbackBaseUrl
  }
}

function toDateOnly(value) {
  if (!value) {
    return undefined
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString().slice(0, 10)
}

function parsePostDate(mdxSource) {
  const match = mdxSource.match(/date\s*:\s*["']([^"']+)["']/)
  return toDateOnly(match?.[1])
}

function buildUrlEntry(url) {
  const lines = ["  <url>", `    <loc>${escapeXml(url.loc)}</loc>`]

  if (url.lastmod) {
    lines.push(`    <lastmod>${url.lastmod}</lastmod>`)
  }

  if (url.changefreq) {
    lines.push(`    <changefreq>${url.changefreq}</changefreq>`)
  }

  if (url.priority) {
    lines.push(`    <priority>${url.priority}</priority>`)
  }

  lines.push("  </url>")
  return lines.join("\n")
}

async function getBaseUrl() {
  const personalInfo = await fs.readFile(personalInfoPath, "utf8")
  const parsed = JSON.parse(personalInfo)
  return normalizeBaseUrl(parsed?.basics?.website ?? fallbackBaseUrl)
}

async function getBlogPosts() {
  const files = await fs.readdir(postsDir)
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"))

  return Promise.all(
    mdxFiles.map(async (fileName) => {
      const fullPath = path.join(postsDir, fileName)
      const source = await fs.readFile(fullPath, "utf8")

      return {
        slug: fileName.replace(/\.mdx$/, ""),
        date: parsePostDate(source),
      }
    })
  )
}

async function generateSitemap() {
  const baseUrl = await getBaseUrl()
  const posts = await getBlogPosts()

  const postDates = posts
    .map((post) => post.date)
    .filter(Boolean)
    .sort()
  const latestPostDate = postDates.at(-1)

  const staticUrls = [
    { loc: `${baseUrl}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${baseUrl}/about`, changefreq: "monthly", priority: "0.8" },
    {
      loc: `${baseUrl}/blog`,
      lastmod: latestPostDate,
      changefreq: "weekly",
      priority: "0.9",
    },
  ]

  const postUrls = posts
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((post) => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.date,
      changefreq: "monthly",
      priority: "0.7",
    }))

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...[...staticUrls, ...postUrls].map(buildUrlEntry),
    "</urlset>",
    "",
  ].join("\n")

  await fs.writeFile(sitemapPath, xml, "utf8")
  console.log(`Sitemap generated at ${path.relative(rootDir, sitemapPath)}`)
}

generateSitemap().catch((error) => {
  console.error("Failed to generate sitemap")
  console.error(error)
  process.exitCode = 1
})
