import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")

const postsDir = path.join(rootDir, "src", "content", "posts")
const personalInfoPath = path.join(rootDir, "personal-info.json")
const publicDir = path.join(rootDir, "public")
const postsOutputDir = path.join(publicDir, "blog")

const fallbackBaseUrl = "https://krishant.com.np"
const META_PATTERN = /export const meta\s*=\s*({[\s\S]*?\n})\n?/
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

function normalizeBaseUrl(url) {
  try {
    return new URL(url).origin
  } catch {
    return fallbackBaseUrl
  }
}

function toDateOnly(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10)
}

function formatMonthYear({ year, month }) {
  return `${monthNames[month - 1]} ${year}`
}

function formatPeriod(role) {
  const start = formatMonthYear(role.start)
  const end = role.end ? formatMonthYear(role.end) : "Present"
  return `${start} - ${end}`
}

function quote(value) {
  return JSON.stringify(value ?? "")
}

async function readPersonalInfo() {
  return JSON.parse(await fs.readFile(personalInfoPath, "utf8"))
}

async function readPosts() {
  const files = (await fs.readdir(postsDir)).filter((file) =>
    file.endsWith(".mdx")
  )

  const posts = await Promise.all(
    files.map(async (fileName) => {
      const source = await fs.readFile(path.join(postsDir, fileName), "utf8")
      const metaSource = source.match(META_PATTERN)?.[1]

      if (!metaSource) {
        throw new Error(`Missing meta export in ${fileName}`)
      }

      return {
        slug: fileName.replace(/\.mdx$/, ""),
        // Local build input, not untrusted content.
        meta: new Function(`return (${metaSource})`)(),
        body: source.replace(META_PATTERN, "").trim(),
      }
    })
  )

  return posts.sort((a, b) =>
    String(b.meta.date).localeCompare(String(a.meta.date))
  )
}

function buildPostMarkdown({ meta, body }) {
  const lines = [
    "---",
    `title: ${quote(meta.title)}`,
    `date: ${quote(toDateOnly(meta.date))}`,
    `summary: ${quote(meta.summary)}`,
    `tags: [${(meta.tags ?? []).map(quote).join(", ")}]`,
    "---",
    "",
    body,
    "",
  ]

  return lines.join("\n")
}

function buildAboutMarkdown(info) {
  const { basics, socials, skills, focusAreas, languages, experience } = info
  const lines = [
    `# ${basics.name}`,
    "",
    `${basics.headline}${basics.location ? ` based in ${basics.location}` : ""}.`,
    "",
    basics.summary,
    "",
    `- Email: ${basics.email}`,
    `- Website: ${basics.website}`,
    ...socials.map((social) => `- ${social.label}: ${social.href}`),
    "",
    "## Focus areas",
    "",
    ...focusAreas.map((area) => `- ${area}`),
    "",
    "## Skills",
    "",
    ...skills.flatMap((group) => [
      `### ${group.title}`,
      "",
      ...group.items.map((item) => `- ${item}`),
      "",
    ]),
    "## Experience",
    "",
  ]

  for (const item of experience) {
    lines.push(`### ${item.org}`, "")

    for (const role of item.roles) {
      const details = [role.employmentType, role.location].filter(Boolean)
      lines.push(
        `#### ${role.title} (${formatPeriod(role)}${
          details.length ? `, ${details.join(", ")}` : ""
        })`,
        "",
        ...role.points.map((point) => `- ${point}`),
        ""
      )
    }
  }

  lines.push(
    "## Projects",
    "",
    ...info.projects.map(
      (project) => `- [${project.title}](${project.href}): ${project.summary}`
    ),
    "",
    "## Education",
    ""
  )

  for (const item of info.education) {
    lines.push(`### ${item.title}`, "", `- ${item.place} (${item.period})`)
    if (item.details.length) {
      lines.push("", ...item.details.map((detail) => `- ${detail}`))
    }
    lines.push("")
  }

  const sections = [
    ["Leadership", info.leadership],
    ["Certifications", info.certifications],
    ["Awards", info.awards],
    ["Languages", languages.map((l) => `${l.name} (${l.proficiency})`)],
  ]

  for (const [heading, items] of sections) {
    lines.push(`## ${heading}`, "", ...items.map((item) => `- ${item}`), "")
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n"
}

function buildLlmsTxt({ baseUrl, info, posts }) {
  const lines = [
    `# ${info.basics.name}`,
    "",
    `> ${info.basics.summary}`,
    "",
    `${info.basics.name} is a ${info.basics.headline} based in ${
      info.basics.location ?? "Nepal"
    }. Contact: ${info.basics.email}.`,
    "",
    "## Pages",
    "",
    `- [Home](${baseUrl}/): Portfolio landing page.`,
    `- [About (Markdown)](${baseUrl}/about.md): Full profile with experience, skills, education, projects, leadership and awards.`,
    `- [About](${baseUrl}/about): HTML version of the same profile.`,
    `- [Blog](${baseUrl}/blog): Index of all posts.`,
    `- [Resume (PDF)](${baseUrl}/docs/resume.pdf): Latest resume.`,
    "",
    "## Blog posts",
    "",
    ...posts.map(
      (post) =>
        `- [${post.meta.title}](${baseUrl}/blog/${post.slug}.md): ${
          post.meta.summary
        } (${toDateOnly(post.meta.date)})`
    ),
    "",
    "## Full content",
    "",
    `- [llms-full.txt](${baseUrl}/llms-full.txt): About page and every blog post in one file.`,
    "",
  ]

  return lines.join("\n")
}

function buildLlmsFullTxt({ info, aboutMarkdown, posts }) {
  const sections = [
    `# ${info.basics.name} - Full Site Content`,
    "",
    `Source: ${info.basics.website}`,
    "",
    aboutMarkdown.trim(),
    "",
  ]

  for (const post of posts) {
    sections.push(
      "---",
      "",
      `# ${post.meta.title}`,
      "",
      `${toDateOnly(post.meta.date)} | Tags: ${(post.meta.tags ?? []).join(", ")}`,
      "",
      post.body,
      ""
    )
  }

  return sections.join("\n")
}

async function generate() {
  const info = await readPersonalInfo()
  const baseUrl = normalizeBaseUrl(info.basics.website)
  const posts = await readPosts()

  await fs.mkdir(postsOutputDir, { recursive: true })
  await Promise.all(
    posts.map((post) =>
      fs.writeFile(
        path.join(postsOutputDir, `${post.slug}.md`),
        buildPostMarkdown(post),
        "utf8"
      )
    )
  )

  const aboutMarkdown = buildAboutMarkdown(info)

  await Promise.all([
    fs.writeFile(path.join(publicDir, "about.md"), aboutMarkdown, "utf8"),
    fs.writeFile(
      path.join(publicDir, "llms.txt"),
      buildLlmsTxt({ baseUrl, info, posts }),
      "utf8"
    ),
    fs.writeFile(
      path.join(publicDir, "llms-full.txt"),
      buildLlmsFullTxt({ info, aboutMarkdown, posts }),
      "utf8"
    ),
  ])

  console.log(
    `Generated llms.txt, llms-full.txt, about.md and ${posts.length} post markdown files`
  )
}

generate().catch((error) => {
  console.error("Failed to generate AI-readable files")
  console.error(error)
  process.exitCode = 1
})
