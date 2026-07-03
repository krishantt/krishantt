import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")

const postsDir = path.join(rootDir, "src", "content", "posts")
const outputPath = path.join(rootDir, "src", "content", "reading-times.json")

const AVERAGE_WORDS_PER_MINUTE = 200

function estimateReadingTime(source) {
  const words = source
    .replace(/export const meta\s*=\s*{[\s\S]*?\n}\n?/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]*)\]\(.*?\)/g, "$1")
    .replace(/[#>*_~-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.round(words / AVERAGE_WORDS_PER_MINUTE))
}

async function generateReadingTimes() {
  const files = await fs.readdir(postsDir)
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"))

  const entries = await Promise.all(
    mdxFiles.map(async (fileName) => {
      const source = await fs.readFile(path.join(postsDir, fileName), "utf8")
      const slug = fileName.replace(/\.mdx$/, "")
      return [slug, estimateReadingTime(source)]
    })
  )

  const readingTimes = Object.fromEntries(entries)
  await fs.writeFile(
    outputPath,
    `${JSON.stringify(readingTimes, null, 2)}\n`,
    "utf8"
  )
  console.log(`Reading times generated at ${path.relative(rootDir, outputPath)}`)
}

generateReadingTimes().catch((error) => {
  console.error("Failed to generate reading times")
  console.error(error)
  process.exitCode = 1
})
