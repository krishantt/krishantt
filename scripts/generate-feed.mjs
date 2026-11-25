// Generates, from the MDX posts:
//   public/rss.xml              RSS 2.0 feed
//   public/og/<slug>.png        1200x630 share card per post (+ default.png)
//   src/content/post-index.json slim index the worker uses to fill per-page <head> tags
import { promises as fs } from "node:fs"
import path from "node:path"
import sharp from "sharp"

import { buildRss, escapeXml, readPosts, wrapBalanced } from "./lib/posts.mjs"

const rootDir = path.resolve(import.meta.dirname, "..")
const postsDir = path.join(rootDir, "src", "content", "posts")
const ogDir = path.join(rootDir, "public", "og")
const personalInfo = JSON.parse(
  await fs.readFile(path.join(rootDir, "personal-info.json"), "utf8")
)

const baseUrl = new URL(personalInfo?.basics?.website ?? "https://krishant.com.np").origin
const name = personalInfo?.basics?.name ?? "Krishant Timilsina"

// Reuse the masthead ridge so share cards look like the site.
const ridgeSource = await fs.readFile(
  path.join(rootDir, "src", "components", "machhapuchhre-ridge.tsx"),
  "utf8"
)
const pathConst = (id) =>
  ridgeSource.match(new RegExp(`const ${id} =\\s*"([^"]+)"`))?.[1] ?? ""
const RIDGE = pathConst("RIDGE")
const FISHTAIL = pathConst("FISHTAIL")

const COLORS = { bg: "#101619", fg: "#e8e9e4", muted: "#93a0a4", brand: "#7fc0b4" }
const SERIF = "Newsreader, 'Iowan Old Style', Georgia, 'Times New Roman', serif"
const SANS = "'IBM Plex Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif"

function cardSvg({ title, eyebrow }) {
  const fontSize = title.length > 70 ? 56 : title.length > 40 ? 64 : 76
  const lines = wrapBalanced(title, Math.floor(1900 / fontSize)).slice(0, 4)
  const lineHeight = Math.round(fontSize * 1.15)
  const firstY = 600 - 110 - (lines.length - 1) * lineHeight

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${COLORS.bg}"/>
  <g transform="translate(0 40)">
    <path d="${RIDGE}" fill="none" stroke="${COLORS.fg}" stroke-opacity="0.3" stroke-width="2" stroke-linejoin="round"/>
    <path d="${FISHTAIL}" fill="none" stroke="${COLORS.brand}" stroke-width="2" stroke-linejoin="round"/>
  </g>
  <text x="80" y="${firstY - lineHeight - 8}" font-family="${SANS}" font-size="26" fill="${COLORS.muted}">${escapeXml(eyebrow)}</text>
  ${lines
    .map(
      (line, i) =>
        `<text x="80" y="${firstY + i * lineHeight}" font-family="${SERIF}" font-size="${fontSize}" fill="${COLORS.fg}">${escapeXml(line)}</text>`
    )
    .join("\n  ")}
  <text x="80" y="570" font-family="${SANS}" font-size="26" fill="${COLORS.brand}">${escapeXml(new URL(baseUrl).host)}</text>
</svg>`
}

async function writeCard(fileName, card) {
  await sharp(Buffer.from(cardSvg(card)))
    .png({ compressionLevel: 9 })
    .toFile(path.join(ogDir, fileName))
}

const posts = await readPosts(postsDir)

await fs.writeFile(
  path.join(rootDir, "public", "rss.xml"),
  buildRss({
    baseUrl,
    title: `${name} — Writing`,
    description: `Essays and notes on software systems by ${name}.`,
    posts,
  })
)

// Cards are committed and only re-rendered when their text changes, so a CI
// machine without the same fonts never overwrites them.
await fs.mkdir(ogDir, { recursive: true })
const manifestPath = path.join(ogDir, "manifest.json")
const previous = JSON.parse(await fs.readFile(manifestPath, "utf8").catch(() => "{}"))
const cards = {
  "default.png": {
    title: "I build software that has to keep working after the interesting part is over.",
    eyebrow: name,
  },
  ...Object.fromEntries(
    posts.map((post) => [`${post.slug}.png`, { title: post.title, eyebrow: `${name} · Writing` }])
  ),
}
let rendered = 0
for (const [fileName, card] of Object.entries(cards)) {
  const key = `${card.eyebrow}\n${card.title}`
  const exists = await fs.access(path.join(ogDir, fileName)).then(() => true, () => false)
  if (exists && previous[fileName] === key) continue
  await writeCard(fileName, card)
  rendered++
}
for (const fileName of Object.keys(previous)) {
  if (!cards[fileName]) await fs.rm(path.join(ogDir, fileName), { force: true })
}
await fs.writeFile(
  manifestPath,
  JSON.stringify(
    Object.fromEntries(Object.entries(cards).map(([f, c]) => [f, `${c.eyebrow}\n${c.title}`])),
    null,
    2
  ) + "\n"
)

await fs.writeFile(
  path.join(rootDir, "src", "content", "post-index.json"),
  JSON.stringify(
    posts.map(({ slug, title, date, summary, tags }) => ({ slug, title, date, summary, tags })),
    null,
    2
  ) + "\n"
)

console.log(`Feed and post index generated; ${rendered} share card(s) re-rendered`)
