import { promises as fs } from "node:fs"
import { createHash } from "node:crypto"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const rootDir = path.resolve(path.dirname(__filename), "..")
const skillsDir = path.join(rootDir, "public", "agent-skills")
const baseUrl = "https://krishant.com.np"
const schemaUrl =
  "https://schemas.agentskills.io/discovery/0.2.0/schema.json"

const skills = [
  {
    name: "profile-lookup",
    description:
      "Look up Krishant Timilsina's profile, background, resume and contact details.",
  },
  {
    name: "blog-search",
    description:
      "Find and read Krishant Timilsina's blog posts as Markdown.",
  },
]

const entries = []

for (const skill of skills) {
  const body = await fs.readFile(
    path.join(skillsDir, skill.name, "SKILL.md")
  )

  entries.push({
    name: skill.name,
    type: "skill-md",
    description: skill.description,
    url: `${baseUrl}/agent-skills/${skill.name}/SKILL.md`,
    digest: `sha256:${createHash("sha256").update(body).digest("hex")}`,
  })
}

await fs.writeFile(
  path.join(skillsDir, "index.json"),
  `${JSON.stringify({ $schema: schemaUrl, skills: entries }, null, 2)}\n`
)

console.log(`Generated agent skills index for ${entries.length} skills`)
